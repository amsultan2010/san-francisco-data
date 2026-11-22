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

const STAGE_ARIA_LABELS = [
  "Raw Trace",
  "Filter & Sanitize",
  "Reconstruct Env",
  "RL Verifier",
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
  height = 284,
}: TracePipelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const progressRef = useRef(0);
  const runningRef = useRef(false);
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
      setIsDone(true);
      onProgressStageRef.current(3);
      return;
    }
    manualRef.current = null;
    progressRef.current = 0;
    lastReportedStageRef.current = 0;
    onProgressStageRef.current(0);
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
    let width = container.clientWidth || 1400;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || 1400;
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
        progressRef.current = Math.min(1, progressRef.current + 0.00085);
        const stageIdx = Math.min(3, Math.floor(progressRef.current * 4));
        if (stageIdx !== lastReportedStageRef.current) {
          lastReportedStageRef.current = stageIdx;
          onProgressStageRef.current(stageIdx);
        }
        if (progressRef.current >= 1) {
          runningRef.current = false;
          setIsDone(true);
        }
      }

      const p = progressRef.current;
      const currentStage =
        manualRef.current !== null ? manualRef.current : Math.min(3, Math.floor(p * 4));
      const padX = Math.max(20, width * 0.025);
      const innerW = width - padX * 2;
      const zoneW = innerW / 4;
      const railY = height * 0.5;
      const compact = width < 720;

      ctx.clearRect(0, 0, width, height);

      // Clean warm paper backdrop
      ctx.fillStyle = "#FAF8F6";
      ctx.fillRect(0, 0, width, height);

      // Subtle active zone frame + vertical hairline separators (no text clutter)
      for (let i = 0; i < 4; i++) {
        const zx = padX + i * zoneW;
        if (i === currentStage) {
          ctx.fillStyle = "rgba(204, 50, 0, 0.045)";
          drawRoundedRect(ctx, zx + 6, 14, zoneW - 12, height - 32, 12);
          ctx.fill();
          ctx.strokeStyle = "rgba(204, 50, 0, 0.2)";
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
        if (i > 0) {
          ctx.strokeStyle = "rgba(17, 16, 14, 0.07)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(zx, 22);
          ctx.lineTo(zx, height - 26);
          ctx.stroke();
        }
      }

      // Main horizontal pipeline rail
      const railStart = padX + zoneW * 0.14;
      const railEnd = padX + innerW - zoneW * 0.14;
      const railSpan = railEnd - railStart;
      const filledX = railStart + clamp(p, 0, 1) * railSpan;

      ctx.strokeStyle = "rgba(17, 16, 14, 0.13)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(railEnd, railY);
      ctx.stroke();

      ctx.strokeStyle = "#CC3200";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(filledX, railY);
      ctx.stroke();

      // Directional chevrons at zone transitions
      for (let i = 1; i <= 3; i++) {
        const ax = padX + i * zoneW;
        const reached = filledX >= ax - 2;
        ctx.strokeStyle = reached ? "#CC3200" : "rgba(17, 16, 14, 0.24)";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(ax - 7, railY - 6);
        ctx.lineTo(ax + 2, railY);
        ctx.lineTo(ax - 7, railY + 6);
        ctx.stroke();
      }

      // ZONE 1: Three simple incoming pills (Noise, Failure, PII)
      const z1Cx = padX + zoneW * 0.5;
      const pillW = Math.min(136, zoneW * 0.62);
      const pillH = 34;

      const pills = [
        { dy: -54, label: "Noise", bg: "#EFECE8", border: "rgba(17,16,14,0.16)", text: "#5C5650" },
        { dy: 0, label: "Failure", bg: "#CC3200", border: "#CC3200", text: "#FFFFFF" },
        { dy: 54, label: "PII", bg: "#EFECE8", border: "rgba(17,16,14,0.16)", text: "#5C5650" },
      ];

      pills.forEach((pill) => {
        const x = z1Cx - pillW / 2;
        const y = railY + pill.dy - pillH / 2;
        drawRoundedRect(ctx, x, y, pillW, pillH, 8);
        ctx.fillStyle = pill.bg;
        ctx.fill();
        ctx.strokeStyle = pill.border;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = pill.text;
        ctx.font = compact ? "500 13px Optima, sans-serif" : "500 15px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pill.label, z1Cx, y + pillH / 2 + 0.5);
      });

      // ZONE 2: Clean Filter Gate dropping noise/PII downward, passing Failure forward
      const z2Cx = padX + zoneW * 1.5;
      const s2Active = p >= 0.24;
      const s2t = easeOutCubic((p - 0.24) / 0.24);
      const gateH = 128;

      // Vertical filter bar
      drawRoundedRect(ctx, z2Cx - 7, railY - gateH / 2, 14, gateH, 7);
      ctx.fillStyle = s2Active ? "rgba(204, 50, 0, 0.14)" : "rgba(17, 16, 14, 0.06)";
      ctx.fill();
      ctx.strokeStyle = s2Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Deflected grey noise/PII markers gently falling below the gate
      if (s2Active) {
        const dropOffset = s2t * 34;
        const dropAlpha = clamp(0.85 - s2t * 0.45, 0.25, 0.85);
        ctx.save();
        ctx.globalAlpha = dropAlpha;
        [-18, 18].forEach((dx) => {
          ctx.beginPath();
          ctx.arc(z2Cx + dx, railY + 42 + dropOffset, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = "#A39C93";
          ctx.fill();
        });
        ctx.restore();

        // Single clean signal capsule passing through
        const cleanW = Math.min(96, zoneW * 0.38);
        const cleanX = z2Cx + 18 + s2t * 14;
        drawRoundedRect(ctx, cleanX, railY - 17, cleanW, 34, 8);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#CC3200";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#CC3200";
        ctx.font = compact ? "500 12.5px Optima, sans-serif" : "500 14.5px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Signal", cleanX + cleanW / 2, railY + 0.5);
      }

      // ZONE 3: Clean Sandbox Container Box
      const z3Cx = padX + zoneW * 2.5;
      const boxW = Math.min(168, zoneW * 0.68);
      const boxH = 104;
      const s3Active = p >= 0.5;
      const s3t = easeOutCubic((p - 0.5) / 0.22);

      drawRoundedRect(ctx, z3Cx - boxW / 2, railY - boxH / 2, boxW, boxH, 10);
      ctx.fillStyle = s3Active ? "#FFFFFF" : "rgba(255, 255, 255, 0.72)";
      ctx.fill();
      ctx.strokeStyle = s3Active ? "#11100E" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = s3Active ? 2.2 : 1.4;
      ctx.stroke();

      // Container header strip
      ctx.fillStyle = s3Active ? "rgba(204, 50, 0, 0.1)" : "rgba(17, 16, 14, 0.05)";
      drawRoundedRect(ctx, z3Cx - boxW / 2 + 1, railY - boxH / 2 + 1, boxW - 2, 30, 9);
      ctx.fill();

      ctx.fillStyle = s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.45)";
      ctx.font = compact ? "500 12.5px Optima, sans-serif" : "500 14.5px Optima, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Sandbox", z3Cx, railY - boxH / 2 + 16);

      // Two clean state bars filling inside sandbox
      const barW = boxW - 36;
      const barX = z3Cx - barW / 2;
      ctx.fillStyle = "rgba(17, 16, 14, 0.12)";
      drawRoundedRect(ctx, barX, railY + 2, barW, 10, 5);
      ctx.fill();
      drawRoundedRect(ctx, barX, railY + 22, barW * 0.7, 10, 5);
      ctx.fill();

      if (s3Active) {
        ctx.fillStyle = "#CC3200";
        drawRoundedRect(ctx, barX, railY + 2, barW * s3t, 10, 5);
        ctx.fill();
        ctx.fillStyle = "#11100E";
        drawRoundedRect(ctx, barX, railY + 22, barW * 0.7 * s3t, 10, 5);
        ctx.fill();
      }

      // ZONE 4: Bold Emerald Verifier Checkmark
      const z4Cx = padX + zoneW * 3.5;
      const s4Active = p >= 0.76;
      const s4t = easeOutCubic((p - 0.76) / 0.2);
      const badgeR = 36;

      if (s4Active) {
        ctx.beginPath();
        ctx.arc(z4Cx, railY, badgeR + 10 + s4t * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(21, 128, 61, ${0.14 * s4t})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(z4Cx, railY, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = s4Active ? "#15803D" : "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = s4Active ? "#15803D" : "rgba(17, 16, 14, 0.22)";
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Bold checkmark
      ctx.strokeStyle = s4Active ? "#FFFFFF" : "rgba(17, 16, 14, 0.28)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(z4Cx - 14, railY + 1);
      ctx.lineTo(z4Cx - 4, railY + 11);
      ctx.lineTo(z4Cx + 16, railY - 10);
      ctx.stroke();

      // Moving tracer bead along rail
      if (p > 0.01 && p < 0.995) {
        ctx.beginPath();
        ctx.arc(filledX, railY, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(204, 50, 0, 0.18)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(filledX, railY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#CC3200";
        ctx.fill();
      }

      // Bottom hairline progress indicator
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
        aria-label="Four-stage visual pipeline showing raw traces filtered of noise and PII, packed into a deterministic sandbox, and verified for reinforcement learning"
        className="block w-full h-full"
      />

      {/* Interactive click-to-jump zone overlays */}
      <div className="absolute inset-0 grid grid-cols-4">
        {STAGE_ARIA_LABELS.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectStage(idx)}
            aria-label={`Inspect stage ${idx + 1}: ${label}`}
            className="h-full w-full cursor-pointer bg-transparent hover:bg-[rgba(204,50,0,0.025)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sf-red)]"
          />
        ))}
      </div>

      {/* Replay button once progression completes */}
      {isDone && (
        <button
          type="button"
          onClick={onReplay}
          className="sf-pressable sf-squircle-xs absolute right-4 bottom-4 z-10 inline-flex items-center gap-1.5 bg-[var(--sf-white)]/95 border border-[var(--sf-red-border)] px-3.5 py-2 font-optima text-[15px] font-medium text-[var(--sf-red)] hover:bg-[var(--sf-red)] hover:text-[var(--sf-white)] shadow-sm cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
          <span>Replay</span>
        </button>
      )}
    </div>
  );
}
