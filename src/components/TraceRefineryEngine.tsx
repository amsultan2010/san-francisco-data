import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, AlertCircle, Layers } from "lucide-react";
import { REFINERY_STAGES } from "../data/sfdata";
import { SuspensionCanvas } from "./SuspensionCanvas";

export function TraceRefineryEngine() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const codePanelRef = useRef<HTMLDivElement | null>(null);
  const userClickedRef = useRef(false);

  const activeStage = REFINERY_STAGES[activeIndex];

  // Animate code lines smoothly whenever the active stage changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".trace-line-item",
          { y: 8 },
          {
            y: 0,
            duration: 0.42,
            stagger: 0.05,
            ease: "expo.out",
            overwrite: "auto",
            clearProps: "transform",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: codePanelRef, dependencies: [activeIndex] },
  );

  // Link scroll progression through the dark chamber to the 4 refinery stages
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 40%",
          end: "bottom 65%",
          onUpdate: (self) => {
            if (userClickedRef.current) return;
            const idx = Math.min(
              REFINERY_STAGES.length - 1,
              Math.floor(self.progress * REFINERY_STAGES.length),
            );
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const handleSelectStage = (idx: number) => {
    userClickedRef.current = true;
    setActiveIndex(idx);
  };

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative bg-[var(--sf-obsidian)] text-[var(--sf-obsidian-ink)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end pb-14 sf-obsidian-hairline-b">
          <div className="lg:col-span-7">
            <h2 className="font-serif-display text-[clamp(2rem,3.8vw,3.35rem)] leading-[1.08] tracking-[-0.025em] text-[var(--sf-obsidian-ink)] text-balance">
              Raw traces are not training assets any more than crude oil is jet fuel.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15.5px] leading-[1.65] text-[var(--sf-obsidian-muted)] max-w-[52ch]">
              We operate as a Glencore for production traces—pairing partner-permissioned access to
              fragmented agent supply with the research engineering required to refine failures into
              reproducible reinforcement learning environments.
            </p>
          </div>
        </div>

        {/* Interactive Refinery Grid */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Sequential stage selector */}
          <div className="lg:col-span-5 flex flex-col">
            {REFINERY_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  aria-pressed={isActive}
                  className={`group text-left py-5 px-4 transition-colors duration-200 sf-obsidian-hairline-b first:border-t first:border-[var(--sf-obsidian-hairline)] cursor-pointer ${
                    isActive
                      ? "bg-[var(--sf-obsidian-surface)]"
                      : "hover:bg-[rgba(245,244,240,0.03)]"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`font-mono-trace text-xs tracking-wider ${
                        isActive ? "text-[var(--sf-red)]" : "text-[var(--sf-obsidian-muted)]"
                      }`}
                    >
                      0{stage.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-[16px] font-medium tracking-[-0.01em] ${
                            isActive
                              ? "text-[var(--sf-obsidian-ink)]"
                              : "text-[var(--sf-obsidian-muted)] group-hover:text-[var(--sf-obsidian-ink)]"
                          }`}
                        >
                          {stage.title}
                        </span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 transition-opacity ${
                            isActive ? "bg-[var(--sf-red)] opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                      <p className="mt-1.5 text-[14px] leading-[1.55] text-[var(--sf-obsidian-muted)]">
                        {stage.summary}
                      </p>
                      {isActive && (
                        <p className="mt-3 text-[13.5px] leading-[1.6] text-[rgba(245,244,240,0.82)]">
                          {stage.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Specimen Terminal + Suspension Bridge Telemetry */}
          <div className="lg:col-span-7 flex flex-col gap-6" ref={codePanelRef}>
            <div className="border border-[var(--sf-obsidian-hairline)] bg-[var(--sf-obsidian-surface)] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sf-obsidian-hairline-b bg-[var(--sf-obsidian-elevated)]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Layers className="h-3.5 w-3.5 text-[var(--sf-red)] shrink-0" strokeWidth={1.75} />
                  <span className="font-mono-trace text-[12px] text-[var(--sf-obsidian-muted)] truncate">
                    {activeStage.codeTitle}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 font-mono-trace text-[11.5px] px-2.5 py-0.5 border ${
                    activeStage.statusTone === "signal"
                      ? "border-[rgba(192,54,44,0.45)] text-[#F18B83] bg-[rgba(192,54,44,0.12)]"
                      : activeStage.statusTone === "verified"
                        ? "border-[rgba(74,222,128,0.35)] text-[var(--sf-verified-dark)] bg-[rgba(74,222,128,0.08)]"
                        : "border-[var(--sf-obsidian-hairline)] text-[var(--sf-obsidian-muted)] bg-[rgba(245,244,240,0.04)]"
                  }`}
                >
                  {activeStage.statusTone === "verified" ? (
                    <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} />
                  ) : (
                    <AlertCircle className="h-3 w-3" strokeWidth={1.75} />
                  )}
                  {activeStage.statusLabel}
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-3 font-mono-trace text-[13px] leading-[1.65] overflow-x-auto">
                {activeStage.lines.map((line, i) => (
                  <div
                    key={`${activeStage.id}-${i}`}
                    className="trace-line-item flex items-start gap-4"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(245,244,240,0.68)] select-none w-8 shrink-0 pt-[2px]">
                      {line.prefix}
                    </span>
                    <span
                      className={
                        line.tone === "red"
                          ? "text-[#F28B82]"
                          : line.tone === "verified"
                            ? "text-[var(--sf-verified-dark)]"
                            : line.tone === "muted"
                              ? "text-[var(--sf-obsidian-muted)]"
                              : "text-[var(--sf-obsidian-ink)]"
                      }
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dark-mode Golden Gate Trace-Flow Graphic synchronized to activeStage */}
            <div className="border border-[var(--sf-obsidian-hairline)] bg-[var(--sf-obsidian-surface)] px-4 pt-3 pb-2">
              <SuspensionCanvas theme="dark" activeStage={activeIndex} height={210} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
