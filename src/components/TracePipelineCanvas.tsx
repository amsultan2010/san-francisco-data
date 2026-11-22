import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface TracePipelineCanvasProps {
  activeStage: number;
  onSelectStage?: (index: number) => void;
  height?: number;
}

interface TraceParticle {
  x: number;
  speed: number;
  rawLaneOffset: number;
  sandboxTrack: number;
  isNoise: boolean;
  dropSeed: number;
  size: number;
}

const CHAMBERS = [
  { num: "01", title: "Raw Traces", short: "Raw", metric: "Noisy sessions" },
  { num: "02", title: "Filter & Redact", short: "Filter", metric: "Strip PII & noise" },
  { num: "03", title: "Sandbox Env", short: "Sandbox", metric: "Deterministic state" },
  { num: "04", title: "RL Verifier", short: "Verifier", metric: "Audited reward" },
] as const;

export function TracePipelineCanvas({
  activeStage,
  onSelectStage,
  height = 250,
}: TracePipelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef(activeStage);
  const hoverChamberRef = useRef<number>(-1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    stageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticRender = reducedMotion || isPaused;

    const particles: TraceParticle[] = Array.from({ length: 42 }, (_, i) => ({
      x: (i / 42) % 1,
      speed: 0.00095 + (i % 5) * 0.00018,
      rawLaneOffset: (((i * 37) % 100) / 100 - 0.5) * 2,
      sandboxTrack: i % 3,
      isNoise: i % 3 === 1,
      dropSeed: 0.65 + ((i * 19) % 35) / 100,
      size: i % 3 === 1 ? 2.1 : 2.9,
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

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width);
      hoverChamberRef.current = Math.min(3, Math.max(0, Math.floor(xNorm * 4)));
    };

    const onPointerLeave = () => {
      hoverChamberRef.current = -1;
    };

    const onClick = (e: MouseEvent) => {
      if (!onSelectStage) return;
      const rect = canvas.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width);
      const idx = Math.min(3, Math.max(0, Math.floor(xNorm * 4)));
      onSelectStage(idx);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClick);

    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, canvasHeight);

      const padX = Math.max(14, width * 0.025);
      const topY = 46;
      const bottomY = canvasHeight - 40;
      const flowH = Math.max(90, bottomY - topY);
      const centerY = topY + flowH * 0.5;
      const usableW = width - padX * 2;
      const colW = usableW / 4;
      const isNarrow = width < 620;

      // Subtle architectural dot grid across the flow field
      ctx.fillStyle = "rgba(17, 16, 14, 0.08)";
      const dotCols = isNarrow ? 16 : 32;
      const dotRows = 6;
      for (let c = 0; c <= dotCols; c++) {
        for (let r = 0; r <= dotRows; r++) {
          const dx = padX + (usableW / dotCols) * c;
          const dy = topY + (flowH / dotRows) * r;
          ctx.fillRect(dx - 0.5, dy - 0.5, 1, 1);
        }
      }

      // Draw 4 refinery chambers
      for (let i = 0; i < 4; i++) {
        const cx = padX + i * colW + 4;
        const cw = colW - 8;
        const isActive = i === stageRef.current;
        const isHovered = i === hoverChamberRef.current;

        drawRoundedRect(cx, topY, cw, flowH, 10);
        ctx.fillStyle = isActive
          ? "rgba(204, 50, 0, 0.055)"
          : isHovered
            ? "rgba(17, 16, 14, 0.025)"
            : "rgba(255, 255, 255, 0.72)";
        ctx.fill();
        ctx.strokeStyle = isActive
          ? "rgba(204, 50, 0, 0.55)"
          : isHovered
            ? "rgba(204, 50, 0, 0.28)"
            : "rgba(17, 16, 14, 0.11)";
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.stroke();

        // Chamber top label
        ctx.font = isNarrow
          ? '500 11.5px "Optima", sans-serif'
          : '500 13.5px "Optima", sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isActive ? "#CC3200" : "#46423E";
        const label = isNarrow
          ? `${CHAMBERS[i].num} ${CHAMBERS[i].short}`
          : `${CHAMBERS[i].num} · ${CHAMBERS[i].title}`;
        ctx.fillText(label, cx + 10, topY - 18);

        // Chamber bottom caption
        if (!isNarrow) {
          ctx.font = '400 13px "EB Garamond", Georgia, serif';
          ctx.fillStyle = isActive ? "#11100E" : "#6D6761";
          ctx.fillText(CHAMBERS[i].metric, cx + 10, bottomY + 18);
        }
      }

      // Precision Filter Aperture in Chamber 02 (x ~ 0.375)
      const gate1X = padX + colW * 1.5;
      ctx.strokeStyle = "rgba(204, 50, 0, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gate1X, topY + 10);
      ctx.lineTo(gate1X, centerY - 22);
      ctx.moveTo(gate1X, centerY + 22);
      ctx.lineTo(gate1X, bottomY - 10);
      ctx.stroke();

      // Deterministic Sandbox 3-track guide rails in Chamber 03 & 04
      const tracks = [-22, 0, 22];
      tracks.forEach((dy) => {
        ctx.strokeStyle = "rgba(17, 16, 14, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX + colW * 2 + 12, centerY + dy);
        ctx.lineTo(padX + colW * 4 - 12, centerY + dy);
        ctx.stroke();
      });

      // Verifier Checkpoint Gate in Chamber 04 (x ~ 0.875)
      const gate2X = padX + colW * 3.5;
      ctx.strokeStyle = "rgba(22, 163, 74, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(gate2X, topY + 14);
      ctx.lineTo(gate2X, bottomY - 14);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animate & draw trace particles flowing left -> right through all 4 chambers
      particles.forEach((p) => {
        if (!staticRender) {
          p.x = (p.x + p.speed) % 1;
        }
        const px = padX + p.x * usableW;
        const targetTrackY = centerY + tracks[p.sandboxTrack];
        const rawY =
          centerY +
          p.rawLaneOffset * (flowH * 0.36) +
          (staticRender ? 0 : Math.sin(time * 0.002 + p.dropSeed * 12) * 3.5);

        let py = rawY;
        let alpha = 0.88;
        let fill = "#7A736C";

        if (p.x < 0.25) {
          // Chamber 01: Raw noisy traces
          py = rawY;
          fill = p.isNoise ? "rgba(122, 115, 108, 0.55)" : "#CC3200";
        } else if (p.x < 0.5) {
          // Chamber 02: Filter & Redact
          const localT = (p.x - 0.25) / 0.25;
          if (p.isNoise) {
            // Noise & PII drops cleanly downward and fades out past aperture
            if (localT > 0.48) {
              const dropT = (localT - 0.48) / 0.52;
              py = rawY + dropT * dropT * (flowH * 0.48 * p.dropSeed);
              alpha = Math.max(0, 0.65 * (1 - dropT));
              fill = "rgba(122, 115, 108, 0.6)";
            } else {
              py = rawY;
              fill = "rgba(122, 115, 108, 0.55)";
            }
          } else {
            // High-signal traces funnel smoothly toward the aperture center
            const ease = localT * localT * (3 - 2 * localT);
            py = rawY + (targetTrackY - rawY) * ease;
            fill = "#CC3200";
          }
        } else if (p.x < 0.75) {
          // Chamber 03: Deterministic Sandbox
          if (p.isNoise) return;
          py = targetTrackY;
          fill = "#11100E";
        } else {
          // Chamber 04: RL Verifier
          if (p.isNoise) return;
          const localT = (p.x - 0.75) / 0.25;
          py = targetTrackY;
          fill = localT > 0.5 ? "#16A34A" : "#11100E";
        }

        if (alpha <= 0.02) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle crisp halo on verified RL outputs
        if (!p.isNoise && p.x > 0.875) {
          ctx.strokeStyle = "rgba(22, 163, 74, 0.35)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, p.size + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      if (!staticRender) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [height, isPaused, onSelectStage]);

  return (
    <div className="sf-squircle relative border border-[var(--sf-hairline)] bg-[var(--sf-paper)] px-2 py-2 sm:px-4 sm:py-3">
      <canvas
        ref={canvasRef}
        style={{ height: `${height}px` }}
        className="block w-full select-none cursor-pointer"
        aria-label="Interactive four-stage data refinery flow showing noisy production traces filtered into deterministic sandboxes and verified RL rewards"
      />
      <button
        type="button"
        onClick={() => setIsPaused((prev) => !prev)}
        aria-pressed={isPaused}
        aria-label={isPaused ? "Play refinery diagram animation" : "Pause refinery diagram animation"}
        className="sf-pressable sf-squircle-xs absolute top-3 right-3 inline-flex items-center gap-1.5 border border-[var(--sf-hairline)] bg-[var(--sf-white)] px-2.5 py-1 font-optima text-[12.5px] font-medium text-[var(--sf-ink-muted)] hover:border-[var(--sf-red-border)] hover:text-[var(--sf-red)] cursor-pointer"
      >
        {isPaused ? (
          <>
            <Play className="h-3 w-3" aria-hidden="true" strokeWidth={2} />
            <span>Play</span>
          </>
        ) : (
          <>
            <Pause className="h-3 w-3" aria-hidden="true" strokeWidth={2} />
            <span>Pause</span>
          </>
        )}
      </button>
    </div>
  );
}
