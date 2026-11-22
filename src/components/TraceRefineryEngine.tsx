import { useRef, useState } from "react";
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

export function TraceRefineryEngine() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stagePanelRef = useRef<HTMLDivElement | null>(null);

  const activeStage = REFINERY_STAGES[activeIndex];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".refinery-animate-item",
          { y: 10 },
          {
            y: 0,
            duration: 0.42,
            stagger: 0.04,
            ease: "expo.out",
            overwrite: "auto",
            clearProps: "transform",
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
      className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
        {/* Centered Editorial Section Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-optima text-[clamp(2rem,3.8vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
            Raw traces are not training assets any more than crude oil is jet fuel.
          </h2>
          <p className="mt-5 font-garamond text-[20px] leading-[1.58] text-[var(--sf-ink-muted)] text-balance">
            We operate as a Glencore for production traces—pairing partner-permissioned access to
            fragmented agent supply with the four-step research engineering pipeline required to
            turn real failures into verifiable RL training environments.
          </p>
        </div>

        {/* Interactive 4-Step Visual Pipeline Diagram */}
        <div
          role="tablist"
          aria-label="Trace to RL refinery stages"
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        >
          {REFINERY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const Icon = STAGE_ICONS[idx];

            return (
              <div key={stage.id} className="relative flex items-stretch">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(idx)}
                  className={`group w-full text-left p-5 sm:p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
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
                    className="hidden lg:flex items-center justify-center absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-[var(--sf-white)] border border-[var(--sf-hairline-strong)] text-[var(--sf-red)]"
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
          ref={stagePanelRef}
          role="tabpanel"
          className="mt-6 border border-[var(--sf-hairline-strong)] bg-[var(--sf-white)] shadow-[0_20px_50px_rgba(17,16,14,0.06)]"
        >
          {/* Progress rail */}
          <div className="h-[3px] w-full bg-[var(--sf-paper)] overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-[var(--sf-red)] transition-transform duration-300 origin-left"
              style={{ transform: `scaleX(${(activeIndex + 1) / REFINERY_STAGES.length})` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Clear Plain-English Explanation + Hairline Input -> Output Transformation */}
            <div className="lg:col-span-5 p-7 sm:p-10 lg:p-11 flex flex-col justify-between lg:border-r lg:border-[var(--sf-hairline)]">
              <div>
                <h3 className="refinery-animate-item font-optima text-[clamp(1.6rem,2.4vw,2.05rem)] font-medium leading-[1.18] tracking-[-0.015em] text-[var(--sf-ink)]">
                  {activeStage.title}
                </h3>

                <p className="refinery-animate-item mt-4 font-garamond text-[19px] leading-[1.6] text-[var(--sf-ink-muted)]">
                  {activeStage.detail}
                </p>

                {/* Hairline-divided Input -> Output transformation summary (no nested card box) */}
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
                    setActiveIndex((prev) =>
                      prev === 0 ? REFINERY_STAGES.length - 1 : prev - 1,
                    )
                  }
                  className="inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-ink-muted)] hover:text-[var(--sf-red)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % REFINERY_STAGES.length)
                  }
                  className="inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] transition-colors cursor-pointer"
                >
                  <span>
                    {activeIndex === REFINERY_STAGES.length - 1
                      ? "Restart pipeline"
                      : `Next: ${REFINERY_STAGES[activeIndex + 1].shortTitle}`}
                  </span>
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Right: Readable Dark Carbon Illustrative Artifact Inspector */}
            <div className="lg:col-span-7 bg-[var(--sf-terminal)] text-[var(--sf-terminal-ink)] flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-6 sm:px-8 py-4 border-b border-[var(--sf-terminal-hairline)] bg-[var(--sf-terminal-bar)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Terminal className="h-4 w-4 text-[#FF8566] shrink-0" strokeWidth={1.75} />
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
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    {activeStage.statusLabel}
                  </span>
                </div>

                <div className="p-6 sm:p-8 lg:p-9 space-y-4 font-mono-trace text-[13.5px] sm:text-[14.5px] leading-[1.7] overflow-x-auto">
                  {activeStage.lines.map((line, i) => (
                    <div
                      key={`${activeStage.id}-${i}`}
                      className="refinery-animate-item flex items-start gap-4"
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
              <div className="px-6 sm:px-8 py-4 border-t border-[var(--sf-terminal-hairline)] bg-[rgba(255,255,255,0.03)] flex items-center justify-between gap-4">
                <span className="font-garamond text-[17.5px] text-[var(--sf-terminal-muted)]">
                  {activeStage.outcomeNote}
                </span>
                <span className="font-mono-trace text-[13px] text-[#FF8566] shrink-0">
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
