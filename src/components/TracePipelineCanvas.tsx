import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

interface TracePipelineCanvasProps {
  activeStage: number;
  runTrigger: number;
  manualTargetStage: number | null;
  onProgressStage: (stage: number) => void;
  onSelectStage: (stage: number) => void;
  onReplay: () => void;
  height?: number;
}

type ShapeKind = "circle" | "square" | "triangle" | "diamond" | "hex";

interface ClusterItem {
  offsetX: number;
  rawOffsetY: number;
  trackIdx: number;
  isNoise: boolean;
  shape: ShapeKind;
  color: string;
  size: number;
  rotSpeed: number;
  dropScale: number;
  phase: number;
}

const SHAPES: ShapeKind[] = ["circle", "square", "triangle", "diamond", "hex"];
const RAW_COLORS = [
  "#CC3200",
  "#D97706",
  "#4F46E5",
  "#0D9488",
  "#BE123C",
  "#475569",
];

function drawShape(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  x: number,
  y: number,
  r: number,
  rot: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  if (kind === "circle") {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  } else if (kind === "square") {
    ctx.roundRect(-r, -r, r * 2, r * 2, r * 0.35);
  } else if (kind === "diamond") {
    ctx.moveTo(0, -r * 1.18);
    ctx.lineTo(r * 1.05, 0);
    ctx.lineTo(0, r * 1.18);
    ctx.lineTo(-r * 1.05, 0);
    ctx.closePath();
  } else if (kind === "triangle") {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const px = Math.cos(a) * r * 1.18;
      const py = Math.sin(a) * r * 1.18;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const px = Math.cos(a) * r * 1.08;
      const py = Math.sin(a) * r * 1.08;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
}

export function TracePipelineCanvas({
  activeStage,
  runTrigger,
  manualTargetStage,
  onProgressStage,
  onSelectStage,
  onReplay,
  height = 240,
}: TracePipelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0.1);
  const lastStageRef = useRef(activeStage);
  const modeRef = useRef<"auto" | "manual">("auto");
  const targetProgressRef = useRef(0.89);
  const onProgressStageRef = useRef(onProgressStage);

  useEffect(() => {
    onProgressStageRef.current = onProgressStage;
  }, [onProgressStage]);

  useEffect(() => {
    if (runTrigger === 0) return;
    modeRef.current = "auto";
    progressRef.current = 0.06;
    targetProgressRef.current = 0.89;
    lastStageRef.current = 0;
    onProgressStageRef.current(0);
  }, [runTrigger]);

  useEffect(() => {
    if (manualTargetStage === null) return;
    modeRef.current = "manual";
    targetProgressRef.current = 0.125 + manualTargetStage * 0.25;
  }, [manualTargetStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      progressRef.current = 0.125 + activeStage * 0.25;
    }

    const cluster: ClusterItem[] = Array.from({ length: 24 }, (_, i) => ({
      offsetX: ((i % 6) - 2.5) * 0.018 + (((i * 13) % 7) - 3) * 0.0035,
      rawOffsetY: (((i * 41) % 100) / 100 - 0.5) * 2,
      trackIdx: i % 3,
      isNoise: i % 3 === 1,
      shape: SHAPES[i % SHAPES.length],
      color: RAW_COLORS[i % RAW_COLORS.length],
      size: i % 3 === 1 ? 4.8 : 6.2,
      rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.00055 + (i % 4) * 0.00022),
      dropScale: 0.72 + ((i * 17) % 28) / 100,
      phase: (i * 0.91) % (Math.PI * 2),
    }));

    let rafId = 0;
    let width = 0;
    let canvasHeight = height;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      canvasHeight = rect.height || height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width);
      const idx = Math.min(3, Math.max(0, Math.floor(xNorm * 4)));
      onSelectStage(idx);
    };

    canvas.addEventListener("click", onClick);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, canvasHeight);

      // Slower, deliberate progression (~24s total across 4 stages so visitors can read comfortably)
      if (!reducedMotion) {
        if (modeRef.current === "auto") {
          if (progressRef.current < targetProgressRef.current) {
            progressRef.current = Math.min(
              targetProgressRef.current,
              progressRef.current + 0.00058,
            );
          }
        } else {
          const diff = targetProgressRef.current - progressRef.current;
          if (Math.abs(diff) > 0.0008) {
            progressRef.current += diff * 0.065;
          } else {
            progressRef.current = targetProgressRef.current;
          }
        }
      }

      const baseP = progressRef.current;
      const currentStage = Math.min(3, Math.max(0, Math.floor(baseP * 4)));
      if (modeRef.current === "auto" && currentStage !== lastStageRef.current) {
        lastStageRef.current = currentStage;
        onProgressStageRef.current(currentStage);
      }

      const padX = 24;
      const topY = 20;
      const bottomY = canvasHeight - 20;
      const flowH = Math.max(120, bottomY - topY);
      const centerY = topY + flowH * 0.5;
      const usableW = width - padX * 2;
      const zoneW = usableW / 4;
      const tracks = [-36, 0, 36];

      // 1. Subtle architectural precision dot-and-rule blueprint grid across one continuous chamber
      ctx.strokeStyle = "rgba(17, 16, 14, 0.045)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const dx = Math.round(padX + zoneW * i) + 0.5;
        ctx.beginPath();
        ctx.moveTo(dx, topY);
        ctx.lineTo(dx, bottomY);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(17, 16, 14, 0.1)";
      const dotCols = width < 640 ? 20 : 44;
      const dotRows = 6;
      for (let c = 0; c <= dotCols; c++) {
        for (let r = 0; r <= dotRows; r++) {
          const gx = padX + (usableW / dotCols) * c;
          const gy = topY + (flowH / dotRows) * r;
          ctx.fillRect(gx - 0.5, gy - 0.5, 1, 1);
        }
      }

      // 2. Luminous active-zone ambient sweep following the cluster smoothly
      const sweepX = padX + baseP * usableW;
      const glowGrad = ctx.createRadialGradient(
        sweepX,
        centerY,
        10,
        sweepX,
        centerY,
        zoneW * 0.85,
      );
      if (currentStage === 3) {
        glowGrad.addColorStop(0, "rgba(22, 163, 74, 0.13)");
        glowGrad.addColorStop(1, "rgba(22, 163, 74, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(204, 50, 0, 0.11)");
        glowGrad.addColorStop(1, "rgba(204, 50, 0, 0)");
      }
      ctx.fillStyle = glowGrad;
      ctx.fillRect(padX, topY, usableW, flowH);

      // 3. Stage 2 Precision Filter & Redaction Laser Aperture (x = 0.375)
      const gate1X = padX + usableW * 0.375;
      const filterActive = baseP >= 0.22 && baseP <= 0.54;
      ctx.save();
      ctx.strokeStyle = filterActive ? "#CC3200" : "rgba(204, 50, 0, 0.42)";
      ctx.lineWidth = filterActive ? 2.2 : 1.5;
      ctx.beginPath();
      ctx.moveTo(gate1X, topY + 10);
      ctx.lineTo(gate1X, centerY - 46);
      ctx.moveTo(gate1X, centerY + 46);
      ctx.lineTo(gate1X, bottomY - 10);
      ctx.stroke();

      // Glowing vertical scan beam across the aperture when cluster passes through
      if (filterActive) {
        const beamGrad = ctx.createLinearGradient(gate1X - 18, 0, gate1X + 18, 0);
        beamGrad.addColorStop(0, "rgba(204, 50, 0, 0)");
        beamGrad.addColorStop(0.5, "rgba(204, 50, 0, 0.24)");
        beamGrad.addColorStop(1, "rgba(204, 50, 0, 0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(gate1X - 18, topY + 12, 36, flowH - 24);
      }
      ctx.restore();

      // 4. Stage 3 Deterministic Sandbox Lattice Frame (x = 0.52..0.73)
      const box3X = padX + usableW * 0.53;
      const box3W = usableW * 0.19;
      const box3Y = centerY - 54;
      const box3H = 108;
      const sandboxActive = baseP >= 0.48 && baseP <= 0.78;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(box3X, box3Y, box3W, box3H, 10);
      ctx.fillStyle = sandboxActive
        ? "rgba(17, 16, 14, 0.045)"
        : "rgba(17, 16, 14, 0.02)";
      ctx.fill();
      ctx.strokeStyle = sandboxActive
        ? "rgba(17, 16, 14, 0.36)"
        : "rgba(17, 16, 14, 0.14)";
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.restore();

      // Deterministic 3-track guide rails from aperture exit to right edge
      tracks.forEach((dy) => {
        ctx.strokeStyle = "rgba(17, 16, 14, 0.11)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gate1X + 18, centerY + dy);
        ctx.lineTo(padX + usableW - 14, centerY + dy);
        ctx.stroke();
      });

      // 5. Stage 4 Verifier Checkpoint Gate (x = 0.82)
      const gate2X = padX + usableW * 0.82;
      const verifyActive = baseP >= 0.74;
      ctx.save();
      ctx.strokeStyle = verifyActive ? "#16A34A" : "rgba(22, 163, 74, 0.42)";
      ctx.lineWidth = verifyActive ? 2 : 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(gate2X, topY + 14);
      ctx.lineTo(gate2X, bottomY - 14);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 6. Animate & render the cluster of varied shapes & colors with rich stage transformations
      const survivingPoints: Array<{ x: number; y: number }> = [];

      cluster.forEach((item) => {
        const p = Math.min(0.95, Math.max(0.03, baseP + item.offsetX));
        const px = padX + p * usableW;
        const targetTrackY = centerY + tracks[item.trackIdx];
        const rawY =
          centerY +
          item.rawOffsetY * (flowH * 0.36) +
          (reducedMotion ? 0 : Math.sin(time * 0.0022 + item.phase) * 4);

        let py = rawY;
        let alpha = 0.95;
        let fill = item.color;
        let shape: ShapeKind = item.shape;
        let rot = reducedMotion ? 0 : time * item.rotSpeed;

        if (p < 0.25) {
          py = rawY;
        } else if (p < 0.5) {
          const t = (p - 0.25) / 0.25;
          if (item.isNoise) {
            if (t > 0.36) {
              const dropT = (t - 0.36) / 0.64;
              py = rawY + dropT * dropT * (flowH * 0.52 * item.dropScale);
              alpha = Math.max(0, 0.75 * (1 - dropT));
              fill = "#94A3B8";
            }
          } else {
            const ease = t * t * (3 - 2 * t);
            py = rawY + (targetTrackY - rawY) * ease;
          }
        } else if (p < 0.75) {
          if (item.isNoise) return;
          const t = (p - 0.5) / 0.25;
          py = targetTrackY;
          rot = rot * (1 - t);
          fill = t > 0.42 ? "#11100E" : item.color;
          shape = t > 0.52 ? "square" : item.shape;
        } else {
          if (item.isNoise) return;
          py = targetTrackY;
          rot = 0;
          const verified = p >= 0.82;
          shape = verified ? "circle" : "square";
          fill = verified ? "#16A34A" : "#11100E";

          // Expanding verification ring as each particle crosses the verifier gate
          if (verified && !reducedMotion) {
            const pulse = ((time * 0.0018 + item.phase) % 1);
            ctx.save();
            ctx.strokeStyle = `rgba(22, 163, 74, ${(1 - pulse) * 0.42})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(px, py, item.size + 3 + pulse * 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }

        if (alpha <= 0.02) return;

        // Subtle motion trail behind moving shapes
        if (!reducedMotion && !item.isNoise && baseP < targetProgressRef.current - 0.005) {
          ctx.save();
          ctx.globalAlpha = 0.16;
          ctx.strokeStyle = fill;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(px - 16, py);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        drawShape(ctx, shape, px, py, item.size, rot);
        ctx.restore();

        if (!item.isNoise && p >= 0.5 && p < 0.82) {
          survivingPoints.push({ x: px, y: py });
        }
      });

      // Subtle connecting lattice links between sandboxed traces inside Stage 3
      if (survivingPoints.length > 1) {
        ctx.save();
        ctx.strokeStyle = "rgba(17, 16, 14, 0.12)";
        ctx.lineWidth = 1;
        for (let i = 0; i < survivingPoints.length - 1; i++) {
          const a = survivingPoints[i];
          const b = survivingPoints[i + 1];
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < 64) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("click", onClick);
    };
  }, [activeStage, height, onSelectStage]);

  return (
    <div className="sf-squircle relative border border-[var(--sf-hairline-strong)] bg-[var(--sf-paper)] overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ height: `${height}px` }}
        className="block w-full select-none cursor-pointer"
        aria-label="Continuous refinery progression diagram showing varied production trace shapes filtered, reconstructed into deterministic sandboxes, and verified into RL rewards"
      />
      <button
        type="button"
        onClick={onReplay}
        aria-label="Replay trace to RL progression"
        className="sf-pressable sf-squircle-xs absolute top-3 right-3 inline-flex items-center gap-1.5 border border-[var(--sf-hairline)] bg-[var(--sf-white)]/92 px-3 py-1.5 font-optima text-[13px] font-medium text-[var(--sf-ink-muted)] hover:border-[var(--sf-red-border)] hover:text-[var(--sf-red)] cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
        <span>Replay</span>
      </button>
    </div>
  );
}
