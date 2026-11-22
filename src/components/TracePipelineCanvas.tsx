import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

interface TracePipelineCanvasProps {
  activeStage: number;
  runTrigger: number;
  manualTargetStage: number | null;
  onProgressStage: (stageIdx: number) => void;
  onSelectStage: (stageIdx: number) => void;
  onReplay: () => void;
  height?: number;
}

const STAGE_CENTERS = [0.125, 0.375, 0.625, 0.875] as const;

const STAGE_META = [
  { label: "Raw Trace", sub: "Logs + noise + PII" },
  { label: "Filter & Sanitize", sub: "Keep only real failures" },
  { label: "Reconstruct Env", sub: "Freeze deterministic sandbox" },
  { label: "RL Verifier", sub: "Grade true outcome" },
] as const;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function easeOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function TracePipelineCanvas({
  activeStage,
  runTrigger,
  manualTargetStage,
  onProgressStage,
  onSelectStage,
  onReplay,
  height = 248,
}: TracePipelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const progressRef = useRef(0);
  const runningRef = useRef(false);
  const completedRef = useRef(false);
  const manualRef = useRef<number | null>(manualTargetStage);
  const activeStageRef = useRef(activeStage);
  const lastReportedStageRef = useRef(activeStage);
  const [isDone, setIsDone] = useState(false);

  const onProgressStageRef = useRef(onProgressStage);
  onProgressStageRef.current = onProgressStage;

  useEffect(() => {
    activeStageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    manualRef.current = manualTargetStage;
    if (manualTargetStage !== null) {
      runningRef.current = false;
      progressRef.current = STAGE_CENTERS[manualTargetStage];
      completedRef.current = manualTargetStage === 3;
      setIsDone(true);
    }
  }, [manualTargetStage]);

  useEffect(() => {
    if (runTrigger === 0) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progressRef.current = STAGE_CENTERS[3];
      runningRef.current = false;
      completedRef.current = true;
      setIsDone(true);
      onProgressStageRef.current(3);
      return;
    }
    manualRef.current = null;
    progressRef.current = 0;
    lastReportedStageRef.current = 0;
    onProgressStageRef.current(0);
    completedRef.current = false;
    setIsDone(false);
    runningRef.current = true;
  }, [runTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = container.clientWidth || 1200;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || 1200;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = () => {
      if (runningRef.current && manualRef.current === null) {
        // ~18s continuous sweep from left to right so each stage is easy to follow
        progressRef.current = Math.min(1, progressRef.current + 0.0009);
        const stageIdx = Math.min(3, Math.floor(progressRef.current * 4));
        if (stageIdx !== lastReportedStageRef.current) {
          lastReportedStageRef.current = stageIdx;
          onProgressStageRef.current(stageIdx);
        }
        if (progressRef.current >= 1) {
          runningRef.current = false;
          completedRef.current = true;
          setIsDone(true);
        }
      }

      const p = progressRef.current;
      const currentStage =
        manualRef.current !== null ? manualRef.current : Math.min(3, Math.floor(p * 4));
      const padX = Math.max(24, width * 0.03);
      const innerW = width - padX * 2;
      const zoneW = innerW / 4;
      const railY = height * 0.56;
      const compact = width < 700;

      ctx.clearRect(0, 0, width, height);

      // 1. Clean warm paper surface
      ctx.fillStyle = "#FAF8F6";
      ctx.fillRect(0, 0, width, height);

      // 2. Active zone highlight panel + subtle vertical column dividers
      for (let i = 0; i < 4; i++) {
        const zx = padX + i * zoneW;
        const isActive = i === currentStage;
        const isPast = i < currentStage;

        if (isActive) {
          ctx.fillStyle = "rgba(204, 50, 0, 0.055)";
          drawRoundedRect(ctx, zx + 4, 10, zoneW - 8, height - 28, 10);
          ctx.fill();
          ctx.strokeStyle = "rgba(204, 50, 0, 0.22)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        if (i > 0) {
          ctx.strokeStyle = "rgba(17, 16, 14, 0.07)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(zx, 18);
          ctx.lineTo(zx, height - 24);
          ctx.stroke();
        }

        // Crisp top stage title + subtitle
        const cx = zx + zoneW / 2;
        ctx.textAlign = "center";
        ctx.font = compact
          ? "600 12px Optima, sans-serif"
          : "600 14.5px Optima, sans-serif";
        ctx.fillStyle = isActive
          ? "#CC3200"
          : isPast
            ? "rgba(17, 16, 14, 0.78)"
            : "rgba(17, 16, 14, 0.48)";
        ctx.fillText(STAGE_META[i].label, cx, 34);

        if (!compact) {
          ctx.font = "400 13.5px 'EB Garamond', Georgia, serif";
          ctx.fillStyle = isActive ? "#46423E" : "rgba(70, 66, 62, 0.62)";
          ctx.fillText(STAGE_META[i].sub, cx, 53);
        }
      }

      // 3. Main horizontal pipeline rail + filled vermilion progress track
      const railStart = padX + zoneW * 0.14;
      const railEnd = padX + innerW - zoneW * 0.14;
      const railSpan = railEnd - railStart;
      const filledX = railStart + clamp(p, 0, 1) * railSpan;

      ctx.strokeStyle = "rgba(17, 16, 14, 0.14)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(railEnd, railY);
      ctx.stroke();

      ctx.strokeStyle = "#CC3200";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(filledX, railY);
      ctx.stroke();

      // Clean directional arrows between zones
      for (let i = 1; i <= 3; i++) {
        const ax = padX + i * zoneW;
        const reached = filledX >= ax - 2;
        ctx.strokeStyle = reached ? "#CC3200" : "rgba(17, 16, 14, 0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax - 6, railY - 5);
        ctx.lineTo(ax + 1, railY);
        ctx.lineTo(ax - 6, railY + 5);
        ctx.stroke();
      }

      // 4. Stage 1 Visual: 3 clear incoming log cards (Noise, PII, Signal Failure)
      const z1Cx = padX + zoneW * 0.5;
      const cardW = Math.min(108, zoneW * 0.62);
      const cardH = 26;
      const s1Active = p >= 0;

      const incomingCards = [
        { dy: -38, label: "Noise", bg: "#ECEAE7", border: "rgba(17,16,14,0.18)", text: "#57534E" },
        { dy: 0, label: "Failure trace", bg: "#CC3200", border: "#CC3200", text: "#FFFFFF" },
        { dy: 38, label: "PII / secrets", bg: "#ECEAE7", border: "rgba(17,16,14,0.18)", text: "#57534E" },
      ];

      if (s1Active) {
        incomingCards.forEach((c) => {
          const x = z1Cx - cardW / 2;
          const y = railY + c.dy - cardH / 2;
          drawRoundedRect(ctx, x, y, cardW, cardH, 6);
          ctx.fillStyle = c.bg;
          ctx.fill();
          ctx.strokeStyle = c.border;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.fillStyle = c.text;
          ctx.font = compact ? "500 10.5px 'Azeret Mono', monospace" : "500 11.5px 'Azeret Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText(c.label, z1Cx, y + 17);
        });
      }

      // 5. Stage 2 Visual: Filter Gate that visibly drops Noise & PII downward and keeps Failure Trace
      const z2Cx = padX + zoneW * 1.5;
      const s2t = easeOutCubic((p - 0.22) / 0.26);
      const gateH = 88;
      const gateActive = p >= 0.24;

      // Filter aperture bar
      drawRoundedRect(ctx, z2Cx - 6, railY - gateH / 2, 12, gateH, 6);
      ctx.fillStyle = gateActive ? "rgba(204, 50, 0, 0.14)" : "rgba(17, 16, 14, 0.06)";
      ctx.fill();
      ctx.strokeStyle = gateActive ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Dropped noise/PII pill sliding down and fading out
      if (p >= 0.24) {
        const dropY = railY + 26 + s2t * 32;
        const dropAlpha = clamp(1 - s2t * 0.55, 0.35, 1);
        ctx.save();
        ctx.globalAlpha = dropAlpha;
        drawRoundedRect(ctx, z2Cx - 48, dropY, 96, 22, 5);
        ctx.fillStyle = "#F1EFEA";
        ctx.fill();
        ctx.strokeStyle = "rgba(17, 16, 14, 0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#6B655E";
        ctx.font = "500 10.5px 'Azeret Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("dropped", z2Cx, dropY + 14.5);
        ctx.restore();

        // Clean signal pill emerging cleanly to the right of the gate
        const cleanX = z2Cx + 16 + s2t * 14;
        drawRoundedRect(ctx, cleanX, railY - 14, Math.min(82, zoneW * 0.4), 28, 6);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#CC3200";
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.fillStyle = "#CC3200";
        ctx.font = "600 11px 'Azeret Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("clean", cleanX + Math.min(82, zoneW * 0.4) / 2, railY + 4);
      }

      // 6. Stage 3 Visual: Clean Sandbox Container Box
      const z3Cx = padX + zoneW * 2.5;
      const boxW = Math.min(138, zoneW * 0.7);
      const boxH = 74;
      const s3Active = p >= 0.5;
      const s3t = easeOutCubic((p - 0.5) / 0.22);

      drawRoundedRect(ctx, z3Cx - boxW / 2, railY - boxH / 2, boxW, boxH, 9);
      ctx.fillStyle = s3Active ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)";
      ctx.fill();
      ctx.strokeStyle = s3Active ? "#11100E" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = s3Active ? 1.8 : 1.2;
      ctx.stroke();

      // Container top bar
      ctx.fillStyle = s3Active ? "rgba(204, 50, 0, 0.1)" : "rgba(17, 16, 14, 0.05)";
      drawRoundedRect(ctx, z3Cx - boxW / 2 + 1, railY - boxH / 2 + 1, boxW - 2, 22, 8);
      ctx.fill();

      ctx.fillStyle = s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.45)";
      ctx.font = "600 10.5px 'Azeret Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("sandbox_env", z3Cx, railY - boxH / 2 + 15);

      // Deterministic state bars inside container
      const barW = boxW - 28;
      const barX = z3Cx - barW / 2;
      ctx.fillStyle = "rgba(17, 16, 14, 0.14)";
      drawRoundedRect(ctx, barX, railY - 4, barW, 8, 4);
      ctx.fill();
      drawRoundedRect(ctx, barX, railY + 12, barW * 0.72, 8, 4);
      ctx.fill();

      if (s3Active) {
        ctx.fillStyle = "#CC3200";
        drawRoundedRect(ctx, barX, railY - 4, barW * s3t, 8, 4);
        ctx.fill();
        ctx.fillStyle = "#11100E";
        drawRoundedRect(ctx, barX, railY + 12, barW * 0.72 * s3t, 8, 4);
        ctx.fill();
      }

      // 7. Stage 4 Visual: Verifier Checkmark Badge -> RL Reward Ready
      const z4Cx = padX + zoneW * 3.5;
      const s4Active = p >= 0.76;
      const s4t = easeOutCubic((p - 0.76) / 0.2);
      const badgeR = 26;

      if (s4Active) {
        // Subtle green halo ring
        ctx.beginPath();
        ctx.arc(z4Cx, railY - 6, badgeR + 6 + s4t * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(21, 128, 61, ${0.14 * s4t})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(z4Cx, railY - 6, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = s4Active ? "#15803D" : "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = s4Active ? "#15803D" : "rgba(17, 16, 14, 0.22)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Checkmark inside circle
      ctx.strokeStyle = s4Active ? "#FFFFFF" : "rgba(17, 16, 14, 0.28)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(z4Cx - 10, railY - 6);
      ctx.lineTo(z4Cx - 3, railY + 1);
      ctx.lineTo(z4Cx + 11, railY - 13);
      ctx.stroke();

      // Verified pill label underneath
      ctx.font = "600 11.5px 'Azeret Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = s4Active ? "#15803D" : "rgba(17, 16, 14, 0.42)";
      ctx.fillText(s4Active ? "RL reward ready" : "pending check", z4Cx, railY + 40);

      // 8. Moving glowing tracer dot along the rail while running
      if (p > 0.01 && p < 0.995) {
        ctx.beginPath();
        ctx.arc(filledX, railY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(204, 50, 0, 0.18)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(filledX, railY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#CC3200";
        ctx.fill();
      }

      // 9. Clean bottom progress bar
      ctx.fillStyle = "rgba(17, 16, 14, 0.08)";
      ctx.fillRect(0, height - 4, width, 4);
      ctx.fillStyle = p >= 0.99 ? "#15803D" : "#CC3200";
      ctx.fillRect(0, height - 4, width * clamp(p, 0, 1), 4);

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className="sf-squircle relative w-full overflow-hidden border border-[var(--sf-hairline-strong)] bg-[var(--sf-paper)] shadow-[0_14px_38px_rgba(17,16,14,0.05)]"
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Four-stage diagram showing a raw agent failure trace filtered of noise and PII, frozen into a deterministic sandbox environment, and graded by an RL verifier"
        className="block w-full h-full"
      />

      {/* Interactive click-to-jump zone overlays */}
      <div className="absolute inset-0 grid grid-cols-4">
        {STAGE_META.map((stage, idx) => (
          <button
            key={stage.label}
            type="button"
            onClick={() => onSelectStage(idx)}
            aria-label={`Inspect stage ${idx + 1}: ${stage.label}`}
            className="h-full w-full cursor-pointer bg-transparent hover:bg-[rgba(204,50,0,0.03)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sf-red)]"
          />
        ))}
      </div>

      {/* Replay control once the sequence finishes */}
      {isDone && (
        <button
          type="button"
          onClick={onReplay}
          className="sf-pressable sf-squircle-xs absolute right-3.5 bottom-3.5 z-10 inline-flex items-center gap-1.5 bg-[var(--sf-white)]/95 border border-[var(--sf-red-border)] px-3.5 py-2 font-optima text-[14.5px] font-medium text-[var(--sf-red)] hover:bg-[var(--sf-red)] hover:text-[var(--sf-white)] shadow-sm cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
          <span>Replay</span>
        </button>
      )}
    </div>
  );
}
