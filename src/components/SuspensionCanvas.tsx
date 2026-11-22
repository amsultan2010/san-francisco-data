import { useEffect, useRef } from "react";

interface SuspensionCanvasProps {
  theme?: "vermilion" | "dark";
  activeStage?: number;
  className?: string;
  height?: number;
}

interface Pulse {
  t: number;
  speed: number;
  lane: number;
  size: number;
}

export function SuspensionCanvas({
  theme = "vermilion",
  activeStage = 0,
  className = "",
  height = 280,
}: SuspensionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef(activeStage);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    stageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pulses: Pulse[] = Array.from({ length: 16 }, (_, i) => ({
      t: (i / 16) % 1,
      speed: 0.0005 + (i % 4) * 0.00018,
      lane: i % 3,
      size: i % 3 === 0 ? 3.2 : 2.0,
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
      pointerRef.current = {
        x: (e.clientX - rect.left) / Math.max(1, rect.width),
        y: (e.clientY - rect.top) / Math.max(1, rect.height),
        active: true,
      };
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const catenaryY = (
      xNorm: number,
      t1: number,
      t2: number,
      towerTopY: number,
      deckY: number,
      sagOffset: number,
    ) => {
      const spanSag = (deckY - towerTopY) * 0.7 + sagOffset;
      if (xNorm < t1) {
        const u = (t1 - xNorm) / t1;
        return towerTopY + spanSag * 0.92 * u * u;
      }
      if (xNorm > t2) {
        const u = (xNorm - t2) / (1 - t2);
        return towerTopY + spanSag * 0.92 * u * u;
      }
      const mid = (t1 + t2) / 2;
      const half = (t2 - t1) / 2;
      const u = (xNorm - mid) / half;
      return towerTopY + spanSag * (1 - u * u);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, canvasHeight);

      const isVermilion = theme === "vermilion";
      const gridColor = isVermilion ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)";
      const cableFine = isVermilion ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.16)";
      const cableMain = isVermilion ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.44)";
      const towerStroke = isVermilion ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.62)";
      const deckColor = isVermilion ? "rgba(255, 255, 255, 0.62)" : "rgba(255, 255, 255, 0.36)";
      const accent = isVermilion ? "#FFFFFF" : "#CC3200";
      const accentSoft = isVermilion ? "rgba(255, 255, 255, 0.45)" : "rgba(204, 50, 0, 0.42)";
      const labelColor = isVermilion ? "rgba(255, 255, 255, 0.86)" : "rgba(248, 245, 242, 0.76)";

      const t1 = 0.27;
      const t2 = 0.73;
      const towerTopY = canvasHeight * 0.14;
      const deckY = canvasHeight * 0.76;
      const baseBottomY = canvasHeight * 0.9;

      const pointerInfluence =
        !reducedMotion && pointerRef.current.active
          ? (pointerRef.current.y - 0.5) * 14
          : 0;
      const breath = reducedMotion ? 0 : Math.sin(time * 0.00095) * 3.5;
      const sagOffset = breath + pointerInfluence;

      // Subtle architectural coordinate grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const cols = 12;
      for (let i = 1; i < cols; i++) {
        const gx = Math.round((width / cols) * i) + 0.5;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvasHeight);
        ctx.stroke();
      }
      const rows = 5;
      for (let j = 1; j < rows; j++) {
        const gy = Math.round((canvasHeight / rows) * j) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Active stage highlight zone along the span
      const stageZones: [number, number][] = [
        [0.03, t1],
        [t1, 0.5],
        [0.5, t2],
        [t2, 0.97],
      ];
      const [zoneStart, zoneEnd] = stageZones[stageRef.current % 4];
      const grad = ctx.createLinearGradient(width * zoneStart, 0, width * zoneEnd, 0);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(
        0.5,
        isVermilion ? "rgba(255, 255, 255, 0.14)" : "rgba(204, 50, 0, 0.18)",
      );
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(
        width * zoneStart,
        towerTopY,
        width * (zoneEnd - zoneStart),
        deckY - towerTopY,
      );

      // Vertical suspender cables
      const suspenderCount = Math.max(24, Math.floor(width / 24));
      for (let i = 1; i < suspenderCount; i++) {
        const xNorm = i / suspenderCount;
        if (Math.abs(xNorm - t1) < 0.015 || Math.abs(xNorm - t2) < 0.015) continue;
        const x = xNorm * width;
        const yTop = catenaryY(xNorm, t1, t2, towerTopY, deckY, sagOffset);
        const inZone = xNorm >= zoneStart && xNorm <= zoneEnd;
        ctx.strokeStyle = inZone ? accentSoft : cableFine;
        ctx.lineWidth = inZone ? 1.2 : 0.85;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, deckY);
        ctx.stroke();
      }

      // Secondary ghost catenary
      ctx.strokeStyle = cableFine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let s = 0; s <= 120; s++) {
        const xNorm = s / 120;
        const x = xNorm * width;
        const y = catenaryY(xNorm, t1, t2, towerTopY + 9, deckY, sagOffset * 0.65 + 10);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Primary suspension cable
      ctx.strokeStyle = cableMain;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      for (let s = 0; s <= 140; s++) {
        const xNorm = s / 140;
        const x = xNorm * width;
        const y = catenaryY(xNorm, t1, t2, towerTopY, deckY, sagOffset);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Active segment highlight along the primary cable
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const segSteps = 48;
      for (let s = 0; s <= segSteps; s++) {
        const xNorm = zoneStart + (zoneEnd - zoneStart) * (s / segSteps);
        const x = xNorm * width;
        const y = catenaryY(xNorm, t1, t2, towerTopY, deckY, sagOffset);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Horizontal roadway deck
      ctx.strokeStyle = deckColor;
      ctx.lineWidth = 1.65;
      ctx.beginPath();
      ctx.moveTo(width * 0.02, deckY);
      ctx.lineTo(width * 0.98, deckY);
      ctx.stroke();

      // Twin suspension towers
      [t1, t2].forEach((txNorm) => {
        const tx = txNorm * width;
        const halfW = Math.max(5, Math.min(8, width * 0.008));

        ctx.strokeStyle = towerStroke;
        ctx.lineWidth = 1.65;
        ctx.beginPath();
        ctx.moveTo(tx - halfW, towerTopY);
        ctx.lineTo(tx - halfW, baseBottomY);
        ctx.moveTo(tx + halfW, towerTopY);
        ctx.lineTo(tx + halfW, baseBottomY);
        ctx.stroke();

        [0.24, 0.44, 0.64, 0.82].forEach((frac) => {
          const by = towerTopY + (baseBottomY - towerTopY) * frac;
          ctx.beginPath();
          ctx.moveTo(tx - halfW, by);
          ctx.lineTo(tx + halfW, by);
          ctx.stroke();
        });

        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(tx, towerTopY - 3, 2.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Travelling trace pulses along cable & deck
      pulses.forEach((p) => {
        if (!reducedMotion) {
          p.t = (p.t + p.speed) % 1;
        }
        const xNorm = 0.03 + p.t * 0.94;
        const x = xNorm * width;
        const y =
          p.lane === 2
            ? deckY
            : catenaryY(
                xNorm,
                t1,
                t2,
                towerTopY + (p.lane === 1 ? 9 : 0),
                deckY,
                sagOffset * (p.lane === 1 ? 0.65 : 1) + (p.lane === 1 ? 10 : 0),
              );

        const isVerified = xNorm > t2;
        ctx.fillStyle = isVermilion
          ? "#FFFFFF"
          : isVerified
            ? "#4ADE80"
            : "#FF6B4A";
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.lane === 0) {
          ctx.strokeStyle = isVermilion
            ? "rgba(255, 255, 255, 0.45)"
            : isVerified
              ? "rgba(74, 222, 128, 0.4)"
              : "rgba(255, 107, 74, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, p.size + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Architectural axis annotations at bottom
      const isNarrow = width < 560;
      ctx.font = isNarrow
        ? '500 9.5px "Azeret Mono", monospace'
        : '500 11px "Azeret Mono", monospace';
      ctx.textBaseline = "top";
      ctx.textAlign = isNarrow ? "center" : "left";
      const annotations = isNarrow
        ? [
            { x: 0.14, text: "TRACE" },
            { x: 0.385, text: "FILTER" },
            { x: 0.615, text: "ENV" },
            { x: 0.86, text: "VERIFY" },
          ]
        : [
            { x: 0.04, text: "RAW TRACE" },
            { x: t1 + 0.02, text: "FILTER & ISOLATE" },
            { x: 0.51, text: "RECONSTRUCT ENV" },
            { x: t2 + 0.02, text: "RL VERIFIER" },
          ];
      annotations.forEach((a, idx) => {
        ctx.fillStyle =
          idx === stageRef.current % 4
            ? isVermilion
              ? "#FFFFFF"
              : "#FF7857"
            : labelColor;
        ctx.fillText(a.text, a.x * width, deckY + 14);
      });
      ctx.textAlign = "left";

      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [theme, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height: `${height}px` }}
      className={`block w-full select-none ${className}`}
      aria-label="Interactive Golden Gate suspension geometry visualizing production traces transforming into verified RL environments"
    />
  );
}
