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
            stagger: 0.045,
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".refinery-stage-step");
        cards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => {
              if (!userClickedRef.current) setActiveIndex(idx);
            },
            onEnterBack: () => {
              if (!userClickedRef.current) setActiveIndex(idx);
            },
          });
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
      id="refinery"
      ref={sectionRef}
      className="relative bg-[var(--sf-red)] px-4 sm:px-8 lg:px-10 py-6 lg:py-10"
    >
      <div className="sf-white-focus mx-auto max-w-[1240px] bg-[var(--sf-white)] text-[var(--sf-ink)] border border-[rgba(255,255,255,0.2)] shadow-[0_24px_60px_rgba(90,18,0,0.24)]">
        {/* Top architectural header bar inside the white sheet */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end px-6 sm:px-10 lg:px-12 pt-10 pb-8 border-b border-[var(--sf-hairline)]">
          <div className="lg:col-span-7">
            <h2 className="font-optima text-[clamp(1.85rem,3.4vw,2.95rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
              Raw traces are not training assets any more than crude oil is jet fuel.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="font-garamond text-[18px] leading-[1.55] text-[var(--sf-ink-muted)] max-w-[48ch]">
              We operate as a Glencore for production traces—pairing partner-permissioned access to
              fragmented agent supply with the research engineering required to refine failures into
              reproducible reinforcement learning environments.
            </p>
          </div>
        </div>

        {/* Continuous vermilion progress hairline */}
        <div className="h-[2px] w-full bg-[rgba(17,16,14,0.08)] overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-[var(--sf-red)] transition-transform duration-300 origin-left"
            style={{
              transform: `scaleX(${(activeIndex + 1) / REFINERY_STAGES.length})`,
            }}
          />
        </div>

        {/* Interactive Refinery Grid: Scrollable 4-stage column + Sticky Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
          {/* Left: Sequential 4-stage list */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-[var(--sf-hairline)] lg:border-r lg:border-[var(--sf-hairline)]">
            {REFINERY_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  aria-pressed={isActive}
                  className={`refinery-stage-step group text-left px-6 sm:px-8 py-6 lg:py-8 transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[var(--sf-white-soft)]"
                      : "bg-[var(--sf-white)] hover:bg-[var(--sf-white-soft)]/60"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`font-optima text-[13px] font-bold tracking-[0.06em] tabular-nums ${
                        isActive ? "text-[var(--sf-red)]" : "text-[var(--sf-ink-muted)]"
                      }`}
                    >
                      0{stage.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`font-optima text-[18px] font-medium tracking-[-0.01em] ${
                            isActive
                              ? "text-[var(--sf-ink)]"
                              : "text-[var(--sf-ink-muted)] group-hover:text-[var(--sf-ink)]"
                          }`}
                        >
                          {stage.title}
                        </span>
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 transition-opacity ${
                            isActive ? "bg-[var(--sf-red)] opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                      <p className="mt-1.5 font-garamond text-[17px] leading-[1.48] text-[var(--sf-ink-muted)]">
                        {stage.summary}
                      </p>
                      <p
                        className={`mt-2.5 font-garamond text-[16px] leading-[1.55] transition-colors ${
                          isActive ? "text-[var(--sf-ink)]" : "text-[var(--sf-ink-muted)]"
                        }`}
                      >
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Sticky Live Specimen Terminal + Synchronized Suspension Span */}
          <div
            ref={codePanelRef}
            className="lg:col-span-7 lg:sticky lg:top-20 p-6 sm:p-8 lg:p-10 flex flex-col gap-5 bg-[var(--sf-white)]"
          >
            <div className="border border-[var(--sf-hairline-strong)] bg-[var(--sf-terminal)] text-[var(--sf-terminal-ink)] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--sf-terminal-hairline)] bg-[var(--sf-terminal-bar)]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Layers className="h-3.5 w-3.5 text-[#FF7857] shrink-0" strokeWidth={1.75} />
                  <span className="font-mono-trace text-[12px] text-[var(--sf-terminal-muted)] truncate">
                    {activeStage.codeTitle}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 font-mono-trace text-[11.5px] px-2.5 py-0.5 border ${
                    activeStage.statusTone === "signal"
                      ? "border-[rgba(255,120,87,0.5)] text-[#FF9B82] bg-[rgba(204,50,0,0.22)]"
                      : activeStage.statusTone === "verified"
                        ? "border-[rgba(74,222,128,0.4)] text-[var(--sf-verified-dark)] bg-[rgba(74,222,128,0.1)]"
                        : "border-[var(--sf-terminal-hairline)] text-[var(--sf-terminal-muted)] bg-[rgba(255,255,255,0.05)]"
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

              <div className="p-5 sm:p-6 space-y-3 font-mono-trace text-[12.5px] sm:text-[13px] leading-[1.65] overflow-x-auto">
                {activeStage.lines.map((line, i) => (
                  <div
                    key={`${activeStage.id}-${i}`}
                    className="trace-line-item flex items-start gap-4"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(248,245,242,0.7)] select-none w-8 shrink-0 pt-[2px]">
                      {line.prefix}
                    </span>
                    <span
                      className={
                        line.tone === "red"
                          ? "text-[#FF9B82]"
                          : line.tone === "verified"
                            ? "text-[var(--sf-verified-dark)]"
                            : line.tone === "muted"
                              ? "text-[var(--sf-terminal-muted)]"
                              : "text-[var(--sf-terminal-ink)]"
                      }
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[var(--sf-hairline-strong)] bg-[var(--sf-terminal)] px-4 pt-3 pb-2">
              <SuspensionCanvas theme="dark" activeStage={activeIndex} height={210} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
