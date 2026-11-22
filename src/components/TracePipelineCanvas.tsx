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
}

const SHAPES: ShapeKind[] = ["circle", "square", "triangle", "diamond", "hex"];
const RAW_COLORS = [
  "#CC3200",
  "#D97706",
  "#4F46E5",
  "#0D9488",
  "#BE123C",
  "#64748B",
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
    ctx.moveTo(0, -r * 1.15);
    ctx.lineTo(r * 1.05, 0);
    ctx.lineTo(0, r * 1.15);
    ctx.lineTo(-r * 1.05, 0);
    ctx.closePath();
  } else if (kind === "triangle") {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const px = Math.cos(a) * r * 1.15;
      const py = Math.sin(a) * r * 1.15;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const px = Math.cos(a) * r * 1.05;
      const py = Math.sin(a) * r * 1.05;
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
  height = 176,
}: TracePipelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0.12);
  const lastStageRef = useRef(activeStage);
  const modeRef = useRef<"auto" | "manual">("auto");
  const targetProgressRef = useRef(0.88);
  const onProgressStageRef = useRef(onProgressStage);

  useEffect(() => {
    onProgressStageRef.current = onProgressStage;
  }, [onProgressStage]);

  // Trigger a fresh left -> right run when scrolled into view or Replay clicked
  useEffect(() => {
    if (runTrigger === 0) return;
    modeRef.current = "auto";
    progressRef.current = 0.08;
    targetProgressRef.current = 0.88;
    lastStageRef.current = 0;
    onProgressStageRef.current(0);
  }, [runTrigger]);

  // Jump smoothly to clicked card column when user manually selects a stage
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

    const cluster: ClusterItem[] = Array.from({ length: 20 }, (_, i) => ({
      offsetX: ((i % 5) - 2) * 0.022 + (((i * 13) % 7) - 3) * 0.004,
      rawOffsetY: (((i * 41) % 100) / 100 - 0.5) * 2,
      trackIdx: i % 3,
      isNoise: i % 3 === 1,
      shape: SHAPES[i % SHAPES.length],
      color: RAW_COLORS[i % RAW_COLORS.length],
      size: i % 3 === 1 ? 4.2 : 5.4,
      rotSpeed: ((i % 2 === 0 ? 1 : -1) * (0.0005 + (i % 4) * 0.00025)),
      dropScale: 0.72 + ((i * 17) % 28) / 100,
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

      if (!reducedMotion) {
        if (modeRef.current === "auto") {
          if (progressRef.current < targetProgressRef.current) {
            progressRef.current = Math.min(
              targetProgressRef.current,
              progressRef.current + 0.00145,
            );
          }
        } else {
          const diff = targetProgressRef.current - progressRef.current;
          if (Math.abs(diff) > 0.001) {
            progressRef.current += diff * 0.085;
          } else {
            progressRef.current = targetProgressRef.current;
          }
        }
      }

      const currentStage = Math.min(3, Math.max(0, Math.floor(progressRef.current * 4)));
      if (modeRef.current === "auto" && currentStage !== lastStageRef.current) {
        lastStageRef.current = currentStage;
        onProgressStageRef.current(currentStage);
      }

      // Align 4 columns directly with the 4-card grid below (gap = 16px on desktop)
      const gap = width >= 1024 ? 16 : 12;
      const colW = (width - gap * 3) / 4;
      const topY = 18;
      const bottomY = canvasHeight - 18;
      const flowH = Math.max(80, bottomY - topY);
      const centerY = topY + flowH * 0.5;
      const tracks = [-24, 0, 24];

      // Subtle aligned lane backgrounds (no outer container box, no header text)
      for (let i = 0; i < 4; i++) {
        const cx = i * (colW + gap);
        const isCurrent = i === currentStage;
        ctx.beginPath();
        ctx.roundRect(cx, topY, colW, flowH, 12);
        ctx.fillStyle = isCurrent
          ? "rgba(204, 50, 0, 0.055)"
          : "rgba(17, 16, 14, 0.025)";
        ctx.fill();
        ctx.strokeStyle = isCurrent
          ? "rgba(204, 50, 0, 0.35)"
          : "rgba(17, 16, 14, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Filter aperture gate in column 2
      const gate1X = colW + gap + colW * 0.5;
      ctx.strokeStyle = "rgba(204, 50, 0, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gate1X, topY + 12);
      ctx.lineTo(gate1X, centerY - 24);
      ctx.moveTo(gate1X, centerY + 24);
      ctx.lineTo(gate1X, bottomY - 12);
      ctx.stroke();

      // Deterministic tracks across column 3 & 4
      tracks.forEach((dy) => {
        ctx.strokeStyle = "rgba(17, 16, 14, 0.11)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo((colW + gap) * 2 + 12, centerY + dy);
        ctx.lineTo(width - 12, centerY + dy);
        ctx.stroke();
      });

      // Verifier checkpoint gate in column 4
      const gate2X = (colW + gap) * 3 + colW * 0.5;
      ctx.strokeStyle = "rgba(22, 163, 74, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(gate2X, topY + 12);
      ctx.lineTo(gate2X, bottomY - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw the single progressing cluster of varied shapes & colors
      const baseP = progressRef.current;
      cluster.forEach((item) => {
        const p = Math.min(0.95, Math.max(0.03, baseP + item.offsetX));
        const px = p * width;
        const targetTrackY = centerY + tracks[item.trackIdx];
        const rawY =
          centerY +
          item.rawOffsetY * (flowH * 0.36) +
          (reducedMotion ? 0 : Math.sin(time * 0.002 + item.dropScale * 14) * 3);

        let py = rawY;
        let alpha = 0.94;
        let fill = item.color;
        let shape: ShapeKind = item.shape;
        let rot = reducedMotion ? 0 : time * item.rotSpeed;

        if (p < 0.25) {
          py = rawY;
        } else if (p < 0.5) {
          const t = (p - 0.25) / 0.25;
          if (item.isNoise) {
            if (t > 0.35) {
              const dropT = (t - 0.35) / 0.65;
              py = rawY + dropT * dropT * (flowH * 0.52 * item.dropScale);
              alpha = Math.max(0, 0.72 * (1 - dropT));
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
          fill = t > 0.45 ? "#11100E" : item.color;
          shape = t > 0.55 ? "square" : item.shape;
        } else {
          if (item.isNoise) return;
          const t = (p - 0.75) / 0.25;
          py = targetTrackY;
          rot = 0;
          shape = t > 0.45 ? "circle" : "square";
          fill = t > 0.45 ? "#16A34A" : "#11100E";
        }

        if (alpha <= 0.02) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        drawShape(ctx, shape, px, py, item.size, rot);

        if (!item.isNoise && p > 0.85) {
          ctx.strokeStyle = "rgba(22, 163, 74, 0.36)";
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(px, py, item.size + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

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
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{ height: `${height}px` }}
        className="block w-full select-none cursor-pointer"
        aria-label="Interactive progression diagram showing a cluster of varied production trace shapes filtered, reconstructed into deterministic sandboxes, and verified into RL rewards"
      />
      <button
        type="button"
        onClick={onReplay}
        aria-label="Replay trace to RL progression"
        className="sf-pressable sf-squircle-xs absolute top-1 right-1 inline-flex items-center gap-1.5 border border-[var(--sf-hairline)] bg-[var(--sf-white)]/90 px-2.5 py-1 font-optima text-[12.5px] font-medium text-[var(--sf-ink-muted)] hover:border-[var(--sf-red-border)] hover:text-[var(--sf-red)] cursor-pointer"
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" strokeWidth={2} />
        <span>Replay</span>
      </button>
    </div>
  );
}
