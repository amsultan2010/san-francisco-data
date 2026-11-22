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
  const [isMobile, setIsMobile] = useState(false);

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

  const effectiveHeight = isMobile ? 392 : height;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = container.clientWidth || 1400;
    let mobileMode = width < 640;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || 1400;
      mobileMode = width < 640;
      setIsMobile(mobileMode);
      const h = mobileMode ? 392 : height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const drawBackdrop = (w: number, h: number) => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#FCFAF8");
      bgGrad.addColorStop(1, "#F6F2EE");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(17, 16, 14, 0.05)";
      const dotGap = 24;
      for (let gx = 16; gx < w; gx += dotGap) {
        for (let gy = 16; gy < h - 8; gy += dotGap) {
          ctx.fillRect(gx, gy, 1.3, 1.3);
        }
      }
    };

    const drawMobileVertical = (w: number, h: number, p: number, currentStage: number) => {
      const padY = 12;
      const innerH = h - padY * 2 - 4;
      const rowH = innerH / 4;
      const cx = w * 0.5;

      drawBackdrop(w, h);

      // Active row glow & frame
      const activeCy = padY + (currentStage + 0.5) * rowH;
      const zoneGlow = ctx.createRadialGradient(cx, activeCy, 8, cx, activeCy, w * 0.48);
      zoneGlow.addColorStop(
        0,
        currentStage === 3 ? "rgba(21, 128, 61, 0.11)" : "rgba(204, 50, 0, 0.09)",
      );
      zoneGlow.addColorStop(1, "rgba(204, 50, 0, 0)");
      ctx.fillStyle = zoneGlow;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        const ry = padY + i * rowH;
        if (i === currentStage) {
          drawRoundedRect(ctx, 10, ry + 4, w - 20, rowH - 8, 12);
          ctx.fillStyle = "rgba(255, 255, 255, 0.52)";
          ctx.fill();
          ctx.strokeStyle =
            i === 3 ? "rgba(21, 128, 61, 0.28)" : "rgba(204, 50, 0, 0.24)";
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
        if (i > 0) {
          ctx.strokeStyle = "rgba(17, 16, 14, 0.07)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(18, ry);
          ctx.lineTo(w - 18, ry);
          ctx.stroke();
        }
      }

      // Vertical center rail
      const railTop = padY + rowH * 0.45;
      const railBot = padY + innerH - rowH * 0.45;
      const filledY = railTop + clamp(p, 0, 1) * (railBot - railTop);

      ctx.strokeStyle = "rgba(17, 16, 14, 0.11)";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, railTop);
      ctx.lineTo(cx, railBot);
      ctx.stroke();

      const railGrad = ctx.createLinearGradient(0, railTop, 0, railBot);
      railGrad.addColorStop(0, "#CC3200");
      railGrad.addColorStop(0.75, "#E04819");
      railGrad.addColorStop(1, "#15803D");
      ctx.strokeStyle = railGrad;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, railTop);
      ctx.lineTo(cx, filledY);
      ctx.stroke();

      // Downward chevron connectors between rows
      for (let i = 1; i <= 3; i++) {
        const ay = padY + i * rowH;
        const reached = filledY >= ay - 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, ay, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = reached
          ? i === 3 && p >= 0.78
            ? "#15803D"
            : "#CC3200"
          : "rgba(17, 16, 14, 0.16)";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.strokeStyle = reached
          ? i === 3 && p >= 0.78
            ? "#15803D"
            : "#CC3200"
          : "rgba(17, 16, 14, 0.34)";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(cx - 3.5, ay - 2);
        ctx.lineTo(cx, ay + 2.5);
        ctx.lineTo(cx + 3.5, ay - 2);
        ctx.stroke();
        ctx.restore();
      }

      // Row 1: Noise | Failure | PII horizontal row
      const r1Y = padY + rowH * 0.5;
      const pillW = Math.min(96, (w - 56) / 3);
      const pillH = 34;
      const gap = 8;
      const startX = cx - (pillW * 3 + gap * 2) / 2;

      [
        { label: "Noise", primary: false },
        { label: "Failure", primary: true },
        { label: "PII", primary: false },
      ].forEach((pill, idx) => {
        const x = startX + idx * (pillW + gap);
        const y = r1Y - pillH / 2;
        ctx.save();
        drawRoundedRect(ctx, x, y, pillW, pillH, 9);
        if (pill.primary) {
          const g = ctx.createLinearGradient(x, y, x + pillW, y + pillH);
          g.addColorStop(0, "#D93800");
          g.addColorStop(1, "#B52B00");
          ctx.fillStyle = g;
          ctx.shadowColor = "rgba(204, 50, 0, 0.25)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 3;
          ctx.fill();
          ctx.shadowColor = "transparent";
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.strokeStyle = "rgba(17, 16, 14, 0.14)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.fillStyle = pill.primary ? "#FFFFFF" : "#554F4A";
        ctx.font = "500 14px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pill.label, x + pillW / 2, r1Y + 0.5);
        ctx.restore();
      });

      // Row 2: Horizontal Filter Bar + Clean Signal pill
      const r2Y = padY + rowH * 1.5;
      const s2Active = p >= 0.24;
      const s2t = easeOutCubic((p - 0.24) / 0.24);
      const barW = Math.min(220, w - 64);

      ctx.save();
      drawRoundedRect(ctx, cx - barW / 2, r2Y - 22, barW, 12, 6);
      ctx.fillStyle = s2Active ? "rgba(204, 50, 0, 0.2)" : "rgba(17, 16, 14, 0.06)";
      ctx.fill();
      ctx.strokeStyle = s2Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (s2Active) {
        // Deflected noise dots moving outward
        ctx.globalAlpha = clamp(0.85 - s2t * 0.4, 0.25, 0.85);
        [-barW * 0.42 - s2t * 14, barW * 0.42 + s2t * 14].forEach((dx) => {
          ctx.beginPath();
          ctx.arc(cx + dx, r2Y + 8, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#A39B93";
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Clean Signal pill centered below filter bar
        drawRoundedRect(ctx, cx - 50, r2Y - 2, 100, 32, 8);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(204, 50, 0, 0.14)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#CC3200";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.fillStyle = "#CC3200";
        ctx.font = "500 14px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Signal", cx, r2Y + 14.5);
      }
      ctx.restore();

      // Row 3: Sandbox Container
      const r3Y = padY + rowH * 2.5;
      const boxW = Math.min(220, w - 64);
      const boxH = 66;
      const s3Active = p >= 0.5;
      const s3t = easeOutCubic((p - 0.5) / 0.22);

      ctx.save();
      drawRoundedRect(ctx, cx - boxW / 2, r3Y - boxH / 2, boxW, boxH, 10);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = s3Active ? "rgba(17, 16, 14, 0.11)" : "rgba(17, 16, 14, 0.04)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = s3Active ? "#11100E" : "rgba(17, 16, 14, 0.18)";
      ctx.lineWidth = s3Active ? 1.8 : 1.2;
      ctx.stroke();

      ctx.fillStyle = s3Active ? "rgba(204, 50, 0, 0.08)" : "rgba(17, 16, 14, 0.04)";
      drawRoundedRect(ctx, cx - boxW / 2 + 1, r3Y - boxH / 2 + 1, boxW - 2, 24, 9);
      ctx.fill();

      const dotY = r3Y - boxH / 2 + 13;
      [0, 1, 2].forEach((d) => {
        ctx.beginPath();
        ctx.arc(cx - boxW / 2 + 14 + d * 9, dotY, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = d === 0 && s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
        ctx.fill();
      });

      ctx.fillStyle = s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.45)";
      ctx.font = "500 13.5px Optima, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Sandbox", cx + boxW / 2 - 12, dotY + 0.5);

      const sBarW = boxW - 28;
      const sBarX = cx - sBarW / 2;
      ctx.fillStyle = "rgba(17, 16, 14, 0.09)";
      drawRoundedRect(ctx, sBarX, r3Y + 1, sBarW, 8, 4);
      ctx.fill();
      drawRoundedRect(ctx, sBarX, r3Y + 15, sBarW * 0.72, 8, 4);
      ctx.fill();

      if (s3Active) {
        ctx.fillStyle = "#CC3200";
        drawRoundedRect(ctx, sBarX, r3Y + 1, Math.max(8, sBarW * s3t), 8, 4);
        ctx.fill();
        ctx.fillStyle = "#11100E";
        drawRoundedRect(ctx, sBarX, r3Y + 15, Math.max(8, sBarW * 0.72 * s3t), 8, 4);
        ctx.fill();
      }
      ctx.restore();

      // Row 4: Emerald Verifier Medallion
      const r4Y = padY + rowH * 3.5;
      const s4Active = p >= 0.76;
      const s4t = easeOutCubic((p - 0.76) / 0.2);
      const badgeR = 26;

      ctx.save();
      if (s4Active) {
        ctx.beginPath();
        ctx.arc(cx, r4Y, badgeR + 8 + s4t * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(21, 128, 61, ${0.14 * s4t})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx, r4Y, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = s4Active ? "#15803D" : "#FFFFFF";
      ctx.shadowColor = s4Active ? "rgba(21, 128, 61, 0.3)" : "rgba(17, 16, 14, 0.06)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowColor = "transparent";
      if (!s4Active) {
        ctx.strokeStyle = "rgba(17, 16, 14, 0.2)";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      ctx.strokeStyle = s4Active ? "#FFFFFF" : "rgba(17, 16, 14, 0.25)";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 10, r4Y + 1);
      ctx.lineTo(cx - 3, r4Y + 8);
      ctx.lineTo(cx + 11, r4Y - 8);
      ctx.stroke();
      ctx.restore();

      // Bottom progress bar
      ctx.fillStyle = "rgba(17, 16, 14, 0.07)";
      ctx.fillRect(0, h - 4, w, 4);
      ctx.fillStyle = p >= 0.99 ? "#15803D" : "#CC3200";
      ctx.fillRect(0, h - 4, w * clamp(p, 0, 1), 4);
    };

    const drawDesktopHorizontal = (w: number, h: number, p: number, currentStage: number) => {
      const padX = Math.max(20, w * 0.025);
      const innerW = w - padX * 2;
      const zoneW = innerW / 4;
      const railY = h * 0.5;
      const compact = w < 860;

      drawBackdrop(w, h);

      // Soft ambient lighting under active zone + crisp column frames
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
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        const zx = padX + i * zoneW;
        if (i === currentStage) {
          drawRoundedRect(ctx, zx + 8, 16, zoneW - 16, h - 36, 14);
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
          ctx.lineTo(zx, h - 28);
          ctx.stroke();
        }
      }

      // Polished dual-layer horizontal pipeline rail + gradient fill
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

      // Circular chevron connectors
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

      // ZONE 1: Elevated tactile pills
      const z1Cx = padX + zoneW * 0.5;
      const pillW = Math.min(144, zoneW * 0.64);
      const pillH = 38;

      [
        { dy: -58, label: "Noise", primary: false },
        { dy: 0, label: "Failure", primary: true },
        { dy: 58, label: "PII", primary: false },
      ].forEach((pill) => {
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

        ctx.beginPath();
        ctx.arc(x + 16, y + pillH / 2, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = pill.primary ? "rgba(255, 255, 255, 0.9)" : "rgba(17, 16, 14, 0.25)";
        ctx.fill();

        ctx.fillStyle = pill.primary ? "#FFFFFF" : "#554F4A";
        ctx.font = compact ? "500 13.5px Optima, sans-serif" : "500 15.5px Optima, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pill.label, z1Cx + 5, y + pillH / 2 + 0.5);
        ctx.restore();
      });

      // ZONE 2: Luminous Vermilion Filter Lens + Clean Signal Capsule
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
      const gateGrad = ctx.createLinearGradient(
        z2Cx - 8,
        railY - gateH / 2,
        z2Cx + 8,
        railY + gateH / 2,
      );
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

        const cleanW = Math.min(104, zoneW * 0.4);
        const cleanH = 38;
        const cleanX = z2Cx + 18 + s2t * Math.min(14, zoneW * 0.06);
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

      // ZONE 3: High-craft Sandbox Container Card
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

      ctx.fillStyle = s3Active ? "rgba(204, 50, 0, 0.08)" : "rgba(17, 16, 14, 0.04)";
      drawRoundedRect(ctx, z3Cx - boxW / 2 + 1, railY - boxH / 2 + 1, boxW - 2, 34, 11);
      ctx.fill();

      const dotY = railY - boxH / 2 + 18;
      [0, 1, 2].forEach((d) => {
        ctx.beginPath();
        ctx.arc(z3Cx - boxW / 2 + 16 + d * 10, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = d === 0 && s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.2)";
        ctx.fill();
      });

      ctx.fillStyle = s3Active ? "#CC3200" : "rgba(17, 16, 14, 0.45)";
      ctx.font = compact ? "500 13px Optima, sans-serif" : "500 15px Optima, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Sandbox", z3Cx + boxW / 2 - 14, dotY + 0.5);

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

      // ZONE 4: Luminous Emerald Verifier Medallion
      const z4Cx = padX + zoneW * 3.5;
      const s4Active = p >= 0.76;
      const s4t = easeOutCubic((p - 0.76) / 0.2);
      const badgeR = 38;

      ctx.save();
      if (s4Active) {
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

      // Traveling luminous bead
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

      // Bottom progress hairline
      ctx.fillStyle = "rgba(17, 16, 14, 0.07)";
      ctx.fillRect(0, h - 4, w, 4);
      ctx.fillStyle = p >= 0.99 ? "#15803D" : "#CC3200";
      ctx.fillRect(0, h - 4, w * clamp(p, 0, 1), 4);
    };

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
      const h = mobileMode ? 392 : height;

      ctx.clearRect(0, 0, width, h);
      if (mobileMode) {
        drawMobileVertical(width, h, p, currentStage);
      } else {
        drawDesktopHorizontal(width, h, p, currentStage);
      }

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
      style={{ height: `${effectiveHeight}px` }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Four-stage visual pipeline showing raw traces filtered of noise and PII, packed into a deterministic sandbox, and verified for reinforcement learning"
        className="block w-full h-full"
      />

      {/* Interactive click-to-jump zone overlays (4 rows on mobile, 4 columns on desktop) */}
      <div className="absolute inset-0 grid grid-rows-4 sm:grid-rows-1 sm:grid-cols-4">
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
          className="sf-pressable sf-squircle-xs absolute right-3.5 bottom-3.5 z-10 inline-flex items-center gap-1.5 bg-[var(--sf-white)]/95 border border-[var(--sf-red-border)] px-3 py-1.5 sm:px-3.5 sm:py-2 font-optima text-[14.5px] sm:text-[15.5px] font-medium text-[var(--sf-red)] hover:bg-[var(--sf-red)] hover:text-[var(--sf-white)] shadow-sm cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
          <span>Replay</span>
        </button>
      )}
    </div>
  );
}
