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

      // 1. Subtle warm architectural backdrop with fine dot grid
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#FCFAF8");
      bgGrad.addColorStop(1, "#F6F2EE");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(17, 16, 14, 0.055)";
      const dotGap = 24;
      for (let gx = 16; gx < width; gx += dotGap) {
        for (let gy = 16; gy < height - 8; gy += dotGap) {
          ctx.fillRect(gx, gy, 1.3, 1.3);
        }
      }

      // 2. Soft ambient lighting under the active zone + crisp column frames
      const activeCenterX = padX + (currentStage + 0.5) * zoneW;
      const zoneGlow = ctx.createRadialGradient(
        activeCenterX,
        railY,
        10,
        activeCenterX,
        railY,
        zoneW * 0.72,
      );
      zoneGlow.addColorStop(
        0,
        currentStage === 3 ? "rgba(21, 128, 61, 0.11)" : "rgba(204, 50, 0, 0.095)",
      );
      zoneGlow.addColorStop(1, "rgba(204, 50, 0, 0)");
      ctx.fillStyle = zoneGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 4; i++) {
        const zx = padX + i * zoneW;
        if (i === currentStage) {
          drawRoundedRect(ctx, zx + 8, 16, zoneW - 16, height - 36, 14);
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
          ctx.fill();
          ctx.strokeStyle =
            i === 3 ? "rgba(21, 128, 61, 0.28)" : "rgba(204, 50, 0, 0.24)";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        if (i > 0) {
          ctx.strokeStyle = "rgba(17, 16, 14, 0.07)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(zx, 24);
          ctx.lineTo(zx, height - 28);
          ctx.stroke();
        }
      }

      // 3. Polished dual-layer horizontal pipeline rail + gradient fill
      const railStart = padX + zoneW * 0.14;
      const railEnd = padX + innerW - zoneW * 0.14;
      const railSpan = railEnd - railStart;
      const filledX = railStart + clamp(p, 0, 1) * railSpan;

      ctx.strokeStyle = "rgba(17, 16, 14, 0.11)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(railEnd, railY);
      ctx.stroke();

      const railGrad = ctx.createLinearGradient(railStart, 0, railEnd, 0);
      railGrad.addColorStop(0, "#CC3200");
      railGrad.addColorStop(0.72, "#E04819");
      railGrad.addColorStop(1, "#15803D");
      ctx.strokeStyle = railGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(railStart, railY);
      ctx.lineTo(filledX, railY);
      ctx.stroke();

      // Polished circular chevron connectors at zone boundaries
      for (let i = 1; i <= 3; i++) {
        const ax = padX + i * zoneW;
        const reached = filledX >= ax - 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax, railY, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(17, 16, 14, 0.08)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = reached
          ? i === 3 && p >= 0.78
            ? "#15803D"
            : "#CC3200"
          : "rgba(17, 16, 14, 0.16)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.strokeStyle = reached
          ? i === 3 && p >= 0.78
            ? "#15803D"
            : "#CC3200"
          : "rgba(17, 16, 14, 0.34)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(ax - 3, railY - 4);
        ctx.lineTo(ax + 3, railY);
        ctx.lineTo(ax - 3, railY + 4);
        ctx.stroke();
        ctx.restore();
      }

      // 4. ZONE 1: Elevated tactile pills (Noise, Failure, PII)
      const z1Cx = padX + zoneW * 0.5;
      const pillW = Math.min(144, zoneW * 0.64);
      const pillH = 38;

      const pills = [
        { dy: -58, label: "Noise", primary: false },
        { dy: 0, label: "Failure", primary: true },
        { dy: 58, label: "PII", primary: false },
      ];

      pills.forEach((pill) => {
        const x = z1Cx - pillW / 2;
        const y = railY + pill.dy - pillH / 2;
        ctx.save();
        drawRoundedRect(ctx, x, y, pillW, pillH, 10);
        if (pill.primary) {
          const g = ctx.createLinearGradient(x, y, x + pillW, y + pillH);
          g.addColorStop(0, "#D93800");
          g.addColorStop(1, "#B52B00");
          ctx.fillStyle = g;
          ctx.shadowColor = "rgba(204, 50, 0, 0.28)";
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 5;
          ctx.fill();
          ctx.shadowColor = "transparent";
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "rgba(17, 16, 14, 0.06)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 3;
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.strokeStyle = "rgba(17, 16, 14, 0.14)";
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }

        // Small status dot on left of pill
        ctx.beginPath();
        ctx.arc(x + 18, y + pillH / 2, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = pill.primary ? "rgba(255, 255, 255, 0.9)" : "rgba(17, 16, 14, 0.25)";
        ctx.fill();

        ctx.fillStyle = pill.primary ? "#FFFFFF" : "#554F4A";
        ctx.font = compact ? "500 13.5px Optima, sans-serif" : "500 15.5px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pill.label, z1Cx + 5, y + pillH / 2 + 0.5);
        ctx.restore();
      });

      // 5. ZONE 2: Luminous Vermilion Filter Lens + Clean Signal Capsule
      const z2Cx = padX + zoneW * 1.5;
      const s2Active = p >= 0.24;
      const s2t = easeOutCubic((p - 0.24) / 0.24);
      const gateH = 142;

      ctx.save();
      if (s2Active) {
        const beamGlow = ctx.createRadialGradient(z2Cx, railY, 4, z2Cx, railY, 64);
        beamGlow.addColorStop(0, "rgba(204, 50, 0, 0.24)");
        beamGlow.addColorStop(1, "rgba(204, 50, 0, 0)");
        ctx.fillStyle = beamGlow;
        ctx.fillRect(z2Cx - 64, railY - 76, 128, 152);
      }

      drawRoundedRect(ctx, z2Cx - 8, railY - gateH / 2, 16, gateH, 8);
      const gateGrad = ctx.createLinearGradient(z2Cx - 8, railY - gateH / 2, z2Cx + 8, railY + gateH / 2);
      if (s2Active) {
        gateGrad.addColorStop(0, "rgba(204, 50, 0, 0.16)");
        gateGrad.addColorStop(0.5, "rgba(204, 50, 0, 0.32)");
        gateGrad.addColorStop(1, "rgba(204, 50, 0, 0.16)");
      } else {
        gateGrad.addColorStop(0, "rgba(17, 16, 14, 0.04)");
        gateGrad.addColorStop(1, "rgba(17, 16, 14, 0.08)");
      }
      ctx.fillStyle = gateGrad;
      ctx.fill();
      ctx.strokeStyle = s2Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      if (s2Active) {
        // Deflected noise & PII markers falling gently beneath gate
        const dropOffset = s2t * 34;
        const dropAlpha = clamp(0.85 - s2t * 0.45, 0.25, 0.85);
        ctx.save();
        ctx.globalAlpha = dropAlpha;
        [-20, 20].forEach((dx) => {
          ctx.beginPath();
          ctx.arc(z2Cx + dx, railY + 46 + dropOffset, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#A39B93";
          ctx.fill();
        });
        ctx.restore();

        // Crisp elevated Signal card gliding right
        const cleanW = Math.min(104, zoneW * 0.4);
        const cleanH = 38;
        const cleanX = z2Cx + 20 + s2t * 14;
        ctx.save();
        drawRoundedRect(ctx, cleanX, railY - cleanH / 2, cleanW, cleanH, 10);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(204, 50, 0, 0.16)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#CC3200";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = "#CC3200";
        ctx.font = compact ? "500 13px Optima, sans-serif" : "500 15px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Signal", cleanX + cleanW / 2, railY + 0.5);
        ctx.restore();
      }

      // 6. ZONE 3: High-craft Sandbox Container Card
      const z3Cx = padX + zoneW * 2.5;
      const boxW = Math.min(184, zoneW * 0.72);
      const boxH = 116;
      const s3Active = p >= 0.5;
      const s3t = easeOutCubic((p - 0.5) / 0.22);

      ctx.save();
      drawRoundedRect(ctx, z3Cx - boxW / 2, railY - boxH / 2, boxW, boxH, 12);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = s3Active ? "rgba(17, 16, 14, 0.12)" : "rgba(17, 16, 14, 0.05)";
      ctx.shadowBlur = s3Active ? 22 : 10;
      ctx.shadowOffsetY = s3Active ? 7 : 3;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = s3Active ? "#11100E" : "rgba(17, 16, 14, 0.18)";
      ctx.lineWidth = s3Active ? 2 : 1.3;
      ctx.stroke();

      // Sleek header bar with 3 subtle window dots
      ctx.fillStyle = s3Active ? "rgba(204, 50, 0, 0.08)" : "rgba(17, 16, 14, 0.04)";
      drawRoundedRect(ctx, z3Cx - boxW / 2 + 1, railY - boxH / 2 + 1, boxW - 2, 34, 11);
      ctx.fill();

      const dotY = railY - boxH / 2 + 18;
      [0, 1, 2].forEach((d) => {
        ctx.beginPath();
        ctx.arc(z3Cx - boxW / 2 + 16 + d * 10, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle =
          d === 0 && s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
        ctx.fill();
      });

      ctx.fillStyle = s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.45)";
      ctx.font = compact ? "500 13px Optima, sans-serif" : "500 15px Optima, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Sandbox", z3Cx + boxW / 2 - 14, dotY + 0.5);

      // Animated deterministic state bars
      const barW = boxW - 36;
      const barX = z3Cx - barW / 2;
      ctx.fillStyle = "rgba(17, 16, 14, 0.09)";
      drawRoundedRect(ctx, barX, railY + 2, barW, 11, 5.5);
      ctx.fill();
      drawRoundedRect(ctx, barX, railY + 24, barW * 0.72, 11, 5.5);
      ctx.fill();

      if (s3Active) {
        const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        barGrad.addColorStop(0, "#CC3200");
        barGrad.addColorStop(1, "#FF6A3D");
        ctx.fillStyle = barGrad;
        drawRoundedRect(ctx, barX, railY + 2, Math.max(10, barW * s3t), 11, 5.5);
        ctx.fill();

        ctx.fillStyle = "#11100E";
        drawRoundedRect(ctx, barX, railY + 24, Math.max(10, barW * 0.72 * s3t), 11, 5.5);
        ctx.fill();
      }
      ctx.restore();

      // 7. ZONE 4: Luminous Emerald Verifier Medallion
      const z4Cx = padX + zoneW * 3.5;
      const s4Active = p >= 0.76;
      const s4t = easeOutCubic((p - 0.76) / 0.2);
      const badgeR = 38;

      ctx.save();
      if (s4Active) {
        // Double concentric emerald ripple rings
        ctx.beginPath();
        ctx.arc(z4Cx, railY, badgeR + 10 + s4t * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(21, 128, 61, ${0.14 * s4t})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(z4Cx, railY, badgeR + 20 + s4t * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(21, 128, 61, ${0.22 * s4t})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(z4Cx, railY, badgeR, 0, Math.PI * 2);
      if (s4Active) {
        const vGrad = ctx.createLinearGradient(
          z4Cx - badgeR,
          railY - badgeR,
          z4Cx + badgeR,
          railY + badgeR,
        );
        vGrad.addColorStop(0, "#16A34A");
        vGrad.addColorStop(1, "#15803D");
        ctx.fillStyle = vGrad;
        ctx.shadowColor = "rgba(21, 128, 61, 0.34)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fill();
        ctx.shadowColor = "transparent";
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(17, 16, 14, 0.08)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 3;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "rgba(17, 16, 14, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Crisp checkmark
      ctx.strokeStyle = s4Active ? "#FFFFFF" : "rgba(17, 16, 14, 0.25)";
      ctx.lineWidth = 4.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(z4Cx - 15, railY + 1);
      ctx.lineTo(z4Cx - 4, railY + 12);
      ctx.lineTo(z4Cx + 16, railY - 11);
      ctx.stroke();
      ctx.restore();

      // 8. Traveling luminous bead along rail
      if (p > 0.01 && p < 0.995) {
        const beadGlow = ctx.createRadialGradient(filledX, railY, 2, filledX, railY, 16);
        beadGlow.addColorStop(0, "rgba(204, 50, 0, 0.35)");
        beadGlow.addColorStop(1, "rgba(204, 50, 0, 0)");
        ctx.fillStyle = beadGlow;
        ctx.beginPath();
        ctx.arc(filledX, railY, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(filledX, railY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#CC3200";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(filledX, railY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // 9. Bottom progress hairline
      ctx.fillStyle = "rgba(17, 16, 14, 0.07)";
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
      className="sf-squircle relative w-full overflow-hidden border border-[var(--sf-hairline-strong)] bg-[var(--sf-paper)] shadow-[0_18px_46px_rgba(17,16,14,0.06)]"
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
          className="sf-pressable sf-squircle-xs absolute right-4 bottom-4 z-10 inline-flex items-center gap-1.5 bg-[var(--sf-white)]/95 border border-[var(--sf-red-border)] px-3.5 py-2 font-optima text-[15.5px] font-medium text-[var(--sf-red)] hover:bg-[var(--sf-red)] hover:text-[var(--sf-white)] shadow-sm cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
          <span>Replay</span>
        </button>
      )}
    </div>
  );
}
