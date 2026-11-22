import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { REFINERY_STAGES } from "../data/sfdata";

const STAGE_ICONS = [Activity, Filter, Box, ShieldCheck] as const;

function getInitialStageIndex(): number {
  if (typeof window === "undefined") return 0;
  const param = new URLSearchParams(window.location.search).get("stage");
  if (!param) return 0;
  const idx = REFINERY_STAGES.findIndex((s) => s.id === param);
  return idx >= 0 ? idx : 0;
}

export function TraceRefineryEngine() {
  const [activeIndex, setActiveIndex] = useState<number>(getInitialStageIndex);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stagePanelRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasInteractedRef = useRef(false);

  const activeStage = REFINERY_STAGES[activeIndex];

  useEffect(() => {
    if (!hasInteractedRef.current || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("stage", activeStage.id);
    window.history.replaceState({}, "", url.toString());
  }, [activeStage.id]);

  const selectStage = (idx: number) => {
    hasInteractedRef.current = true;
    setActiveIndex(idx);
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % REFINERY_STAGES.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + REFINERY_STAGES.length) % REFINERY_STAGES.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = REFINERY_STAGES.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      selectStage(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  // Scroll-triggered entrance choreography for header, 4 pipeline nodes, connectors, and deep-dive panel
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".refinery-header-reveal", {
          y: 26,
          opacity: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 84%",
            once: true,
          },
        });

        gsap.from(".refinery-node-reveal", {
          y: 24,
          opacity: 0,
          scale: 0.96,
          duration: 0.62,
          stagger: 0.085,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".refinery-pipeline-grid",
            start: "top 86%",
            once: true,
          },
        });

        gsap.from(".refinery-arrow-reveal", {
          scale: 0.5,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          delay: 0.2,
          ease: "back.out(1.7)",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".refinery-pipeline-grid",
            start: "top 86%",
            once: true,
          },
        });

        gsap.from(stagePanelRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.72,
          ease: "expo.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: stagePanelRef.current,
            start: "top 88%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // Stage-switch stagger transition for text & terminal trace lines
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".refinery-animate-item",
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.04,
            ease: "expo.out",
            overwrite: "auto",
            clearProps: "transform,opacity",
          },
        );
        gsap.fromTo(
          ".refinery-trace-line",
          { x: -12, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.045,
            ease: "expo.out",
            overwrite: "auto",
            clearProps: "transform,opacity",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: stagePanelRef, dependencies: [activeIndex] },
  );

  return (
    <section
      id="refinery"
      ref={sectionRef}
      className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
        {/* Centered Editorial Section Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="refinery-header-reveal font-optima text-[clamp(2rem,3.8vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
            Raw traces are not training assets any more than crude oil is jet fuel.
          </h2>
          <p className="refinery-header-reveal mt-5 font-garamond text-[20px] leading-[1.58] text-[var(--sf-ink-muted)] text-balance">
            We operate as a Glencore for production traces, pairing partner-permissioned access to
            fragmented agent supply with the four-step research engineering pipeline required to
            turn real failures into verifiable RL training environments.
          </p>
        </div>

        {/* Interactive 4-Step Visual Pipeline Diagram */}
        <div
          role="tablist"
          aria-label="Trace to RL refinery stages"
          className="refinery-pipeline-grid mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        >
          {REFINERY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const Icon = STAGE_ICONS[idx];

            return (
              <div key={stage.id} className="relative flex items-stretch">
                <button
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  id={`tab-${stage.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="refinery-tabpanel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectStage(idx)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`refinery-node-reveal sf-pressable group w-full text-left p-5 sm:p-6 border cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "bg-[var(--sf-red)] text-[var(--sf-white)] border-[var(--sf-red)] shadow-[0_12px_30px_rgba(204,50,0,0.2)]"
                      : isPast
                        ? "bg-[var(--sf-red-tint)] text-[var(--sf-ink)] border-[var(--sf-red-border)] hover:border-[var(--sf-red)]"
                        : "bg-[var(--sf-paper)] text-[var(--sf-ink)] border-[var(--sf-hairline)] hover:border-[var(--sf-red-border)] hover:bg-[var(--sf-white)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`font-optima text-[14px] font-bold tracking-[0.08em] tabular-nums ${
                        isActive ? "text-[var(--sf-white)]" : "text-[var(--sf-red)]"
                      }`}
                    >
                      {stage.step}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 ${
                        isActive ? "text-[var(--sf-white)]" : "text-[var(--sf-red)]"
                      }`}
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="mt-4">
                    <div
                      className={`font-optima text-[18px] font-medium leading-[1.2] ${
                        isActive ? "text-[var(--sf-white)]" : "text-[var(--sf-ink)]"
                      }`}
                    >
                      {stage.shortTitle}
                    </div>
                    <div
                      className={`mt-1.5 font-garamond text-[17px] leading-[1.35] ${
                        isActive ? "text-[var(--sf-white-muted)]" : "text-[var(--sf-ink-muted)]"
                      }`}
                    >
                      {stage.shortTag}
                    </div>
                  </div>
                </button>

                {/* Directional flow chevron between pipeline nodes on desktop */}
                {idx < REFINERY_STAGES.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="refinery-arrow-reveal hidden lg:flex items-center justify-center absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-[var(--sf-white)] border border-[var(--sf-hairline-strong)] text-[var(--sf-red)]"
                  >
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Stage Deep-Dive Panel: Plain-English Input->Output + Live Illustrative Specimen */}
        <div
          id="refinery-tabpanel"
          ref={stagePanelRef}
          role="tabpanel"
          aria-labelledby={`tab-${activeStage.id}`}
          className="mt-6 border border-[var(--sf-hairline-strong)] bg-[var(--sf-white)] shadow-[0_20px_50px_rgba(17,16,14,0.06)]"
        >
          {/* Progress rail */}
          <div className="h-[3px] w-full bg-[var(--sf-paper)] overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-[var(--sf-red)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left"
              style={{ transform: `scaleX(${(activeIndex + 1) / REFINERY_STAGES.length})` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Clear Plain-English Explanation + Hairline Input -> Output Transformation */}
            <div className="lg:col-span-5 p-7 sm:p-10 lg:p-11 flex flex-col justify-between lg:border-r lg:border-[var(--sf-hairline)]">
              <div>
                <h3 className="refinery-animate-item font-optima text-[clamp(1.6rem,2.4vw,2.05rem)] font-medium leading-[1.18] tracking-[-0.015em] text-[var(--sf-ink)] text-balance">
                  {activeStage.title}
                </h3>

                <p className="refinery-animate-item mt-4 font-garamond text-[19px] leading-[1.6] text-[var(--sf-ink-muted)]">
                  {activeStage.detail}
                </p>

                {/* Hairline-divided Input -> Output transformation summary */}
                <div className="refinery-animate-item mt-8 border-t border-[var(--sf-hairline)] divide-y divide-[var(--sf-hairline)]">
                  <div className="py-4">
                    <div className="font-optima text-[14px] font-medium text-[var(--sf-ink-muted)]">
                      Goes in
                    </div>
                    <p className="mt-1 font-garamond text-[18.5px] leading-[1.48] text-[var(--sf-ink)]">
                      {activeStage.inputLabel}
                    </p>
                  </div>
                  <div className="py-4">
                    <div className="font-optima text-[14px] font-medium text-[var(--sf-red)]">
                      Comes out
                    </div>
                    <p className="mt-1 font-garamond text-[18.5px] font-medium leading-[1.48] text-[var(--sf-ink)]">
                      {activeStage.outputLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean step navigation controls */}
              <div className="mt-6 pt-6 border-t border-[var(--sf-hairline)] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    selectStage(
                      activeIndex === 0 ? REFINERY_STAGES.length - 1 : activeIndex - 1,
                    )
                  }
                  className="sf-pressable inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-ink-muted)] hover:text-[var(--sf-red)] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectStage((activeIndex + 1) % REFINERY_STAGES.length)}
                  className="sf-pressable inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] cursor-pointer"
                >
                  <span>
                    {activeIndex === REFINERY_STAGES.length - 1
                      ? "Restart pipeline"
                      : `Next: ${REFINERY_STAGES[activeIndex + 1].shortTitle}`}
                  </span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Right: Readable Dark Carbon Illustrative Artifact Inspector */}
            <div
              translate="no"
              className="lg:col-span-7 bg-[var(--sf-terminal)] text-[var(--sf-terminal-ink)] flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-6 sm:px-8 py-4 border-b border-[var(--sf-terminal-hairline)] bg-[var(--sf-terminal-bar)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Terminal
                      className="h-4 w-4 text-[#FF8566] shrink-0"
                      aria-hidden="true"
                      strokeWidth={1.75}
                    />
                    <span className="font-mono-trace text-[13.5px] text-[var(--sf-terminal-muted)] break-all sm:truncate">
                      {activeStage.codeTitle}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono-trace text-[12.5px] px-3 py-1 border shrink-0 whitespace-nowrap ${
                      activeStage.statusTone === "signal"
                        ? "border-[rgba(255,133,102,0.5)] text-[#FFA68F] bg-[rgba(204,50,0,0.22)]"
                        : activeStage.statusTone === "verified"
                          ? "border-[rgba(74,222,128,0.42)] text-[var(--sf-verified-dark)] bg-[rgba(74,222,128,0.12)]"
                          : "border-[var(--sf-terminal-hairline)] text-[var(--sf-terminal-ink)] bg-[rgba(255,255,255,0.06)]"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" strokeWidth={1.75} />
                    {activeStage.statusLabel}
                  </span>
                </div>

                <div className="p-6 sm:p-8 lg:p-9 space-y-4 font-mono-trace text-[13.5px] sm:text-[14.5px] leading-[1.7] overflow-x-auto">
                  {activeStage.lines.map((line, i) => (
                    <div
                      key={`${activeStage.id}-${i}`}
                      className="refinery-trace-line flex items-start gap-4"
                    >
                      <span
                        className={`text-[12.5px] uppercase tracking-wider select-none w-9 shrink-0 pt-[2px] ${
                          line.tone === "red"
                            ? "text-[#FF8566]"
                            : line.tone === "verified"
                              ? "text-[var(--sf-verified-dark)]"
                              : "text-[rgba(248,245,242,0.65)]"
                        }`}
                      >
                        {line.prefix}
                      </span>
                      <span
                        className={
                          line.tone === "red"
                            ? "text-[#FFA68F]"
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

              {/* Stage Outcome Bar */}
              <div
                aria-live="polite"
                className="px-6 sm:px-8 py-4 border-t border-[var(--sf-terminal-hairline)] bg-[rgba(255,255,255,0.03)] flex items-center justify-between gap-4"
              >
                <span className="font-garamond text-[17.5px] text-[var(--sf-terminal-muted)]">
                  {activeStage.outcomeNote}
                </span>
                <span className="font-mono-trace text-[13px] text-[#FF8566] shrink-0 tabular-nums">
                  {activeIndex + 1} / {REFINERY_STAGES.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
