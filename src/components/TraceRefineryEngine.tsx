import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Activity,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { REFINERY_STAGES } from "../data/sfdata";
import { TracePipelineCanvas } from "./TracePipelineCanvas";

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
  const [runTrigger, setRunTrigger] = useState<number>(0);
  const [manualTargetStage, setManualTargetStage] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const diagramRef = useRef<HTMLDivElement | null>(null);
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

  const handleManualSelect = useCallback((idx: number) => {
    hasInteractedRef.current = true;
    setManualTargetStage(idx);
    setActiveIndex(idx);
  }, []);

  const handleProgressStage = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  const handleReplay = useCallback(() => {
    setManualTargetStage(null);
    setActiveIndex(0);
    setRunTrigger((n) => n + 1);
  }, []);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % REFINERY_STAGES.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + REFINERY_STAGES.length) % REFINERY_STAGES.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = REFINERY_STAGES.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      handleManualSelect(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".refinery-header-reveal", {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        });

        if (diagramRef.current) {
          ScrollTrigger.create({
            trigger: diagramRef.current,
            start: "top 84%",
            once: true,
            onEnter: () => {
              setManualTargetStage(null);
              setRunTrigger((n) => n + 1);
            },
          });
        }

        gsap.from(".refinery-node-reveal", {
          y: 20,
          opacity: 0,
          duration: 0.78,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: ".refinery-pipeline-grid",
            start: "top 88%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".refinery-animate-item",
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.04,
            ease: "expo.out",
            overwrite: "auto",
            clearProps: "transform,opacity",
          },
        );
        gsap.fromTo(
          ".refinery-trace-line",
          { x: -10, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.04,
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
      className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-20 lg:py-24 border-t border-[var(--sf-hairline)]"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14">
        {/* Asymmetric Wide Editorial Header */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="refinery-header-reveal font-optima text-[clamp(2rem,3.6vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
              We partner with companies whose agents are pushed past their limits.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="refinery-header-reveal font-garamond text-[19.5px] leading-[1.58] text-[var(--sf-ink-muted)]">
              Every time a deployed agent breaks on real work, it exposes a frontier capability
              gap. We turn those partner-permissioned sessions into deterministic reinforcement
              learning environments and ungameable verifiers.
            </p>
          </div>
        </div>

        {/* One Continuous High-Detail Refinery Progression Box */}
        <div ref={diagramRef} className="mt-10">
          <TracePipelineCanvas
            activeStage={activeIndex}
            runTrigger={runTrigger}
            manualTargetStage={manualTargetStage}
            onProgressStage={handleProgressStage}
            onSelectStage={handleManualSelect}
            onReplay={handleReplay}
            height={240}
          />
        </div>

        {/* 4 Stage Cards Directly Aligned Below */}
        <div
          role="tablist"
          aria-label="Trace to RL refinery stages"
          className="refinery-pipeline-grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
        >
          {REFINERY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const Icon = STAGE_ICONS[idx];

            return (
              <button
                key={stage.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`tab-${stage.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="refinery-tabpanel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleManualSelect(idx)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`refinery-node-reveal sf-pressable sf-squircle group w-full text-left px-6 py-5 border cursor-pointer flex items-center justify-between gap-4 ${
                  isActive
                    ? "bg-[var(--sf-red)] text-[var(--sf-white)] border-[var(--sf-red)] shadow-[0_12px_28px_rgba(204,50,0,0.2)]"
                    : isPast
                      ? "bg-[var(--sf-red-tint)] text-[var(--sf-ink)] border-[var(--sf-red-border)] hover:border-[var(--sf-red)]"
                      : "bg-[var(--sf-paper)] text-[var(--sf-ink)] border-[var(--sf-hairline)] hover:border-[var(--sf-red-border)] hover:bg-[var(--sf-white)]"
                }`}
              >
                <div className="min-w-0">
                  <div
                    className={`font-optima text-[18px] font-medium leading-[1.2] ${
                      isActive ? "text-[var(--sf-white)]" : "text-[var(--sf-ink)]"
                    }`}
                  >
                    {stage.shortTitle}
                  </div>
                  <div
                    className={`mt-1 font-garamond text-[17px] leading-[1.3] ${
                      isActive ? "text-[var(--sf-white-muted)]" : "text-[var(--sf-ink-muted)]"
                    }`}
                  >
                    {stage.shortTag}
                  </div>
                </div>
                <Icon
                  aria-hidden="true"
                  className={`h-8 w-8 shrink-0 ${
                    isActive ? "text-[var(--sf-white)]" : "text-[var(--sf-red)]"
                  }`}
                  strokeWidth={1.6}
                />
              </button>
            );
          })}
        </div>

        {/* Synchronized Stage Deep-Dive Panel */}
        <div
          id="refinery-tabpanel"
          ref={stagePanelRef}
          role="tabpanel"
          aria-labelledby={`tab-${activeStage.id}`}
          className="sf-squircle mt-5 border border-[var(--sf-hairline-strong)] bg-[var(--sf-white)] shadow-[0_20px_50px_rgba(17,16,14,0.06)] overflow-hidden"
        >
          <div className="h-[3px] w-full bg-[var(--sf-paper)] overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-[var(--sf-red)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left"
              style={{ transform: `scaleX(${(activeIndex + 1) / REFINERY_STAGES.length})` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Explanation + Input -> Output */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between lg:border-r lg:border-[var(--sf-hairline)]">
              <div>
                <h3 className="refinery-animate-item font-optima text-[clamp(1.5rem,2.2vw,1.95rem)] font-medium leading-[1.18] tracking-[-0.015em] text-[var(--sf-ink)] text-balance">
                  {activeStage.title}
                </h3>

                <p className="refinery-animate-item mt-3.5 font-garamond text-[19px] leading-[1.58] text-[var(--sf-ink-muted)]">
                  {activeStage.detail}
                </p>

                <div className="refinery-animate-item mt-6 border-t border-[var(--sf-hairline)] divide-y divide-[var(--sf-hairline)]">
                  <div className="py-3.5">
                    <div className="font-optima text-[14px] font-medium text-[var(--sf-ink-muted)]">
                      Goes in
                    </div>
                    <p className="mt-1 font-garamond text-[18px] leading-[1.45] text-[var(--sf-ink)]">
                      {activeStage.inputLabel}
                    </p>
                  </div>
                  <div className="py-3.5">
                    <div className="font-optima text-[14px] font-medium text-[var(--sf-red)]">
                      Comes out
                    </div>
                    <p className="mt-1 font-garamond text-[18px] font-medium leading-[1.45] text-[var(--sf-ink)]">
                      {activeStage.outputLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[var(--sf-hairline)] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleManualSelect(
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
                  onClick={() =>
                    handleManualSelect((activeIndex + 1) % REFINERY_STAGES.length)
                  }
                  className="sf-pressable inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] cursor-pointer"
                >
                  <span>
                    {activeIndex === REFINERY_STAGES.length - 1
                      ? "Restart"
                      : `Next: ${REFINERY_STAGES[activeIndex + 1].shortTitle}`}
                  </span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Right: Dark Carbon Illustrative Artifact Inspector */}
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
                    className={`sf-squircle-xs inline-flex items-center gap-1.5 font-mono-trace text-[12.5px] px-3 py-1 border shrink-0 whitespace-nowrap ${
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

                <div className="p-6 sm:p-8 space-y-3.5 font-mono-trace text-[13.5px] sm:text-[14.5px] leading-[1.7] overflow-x-auto">
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
