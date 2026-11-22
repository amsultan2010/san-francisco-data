import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import {
  HARD_PROBLEMS,
  REFINERY_STAGES,
  SFDATA_LINKS,
  TEAM_INSTITUTIONS,
  VERIFIED_FACTS,
} from "../data/sfdata";
import { SuspensionCanvas } from "./SuspensionCanvas";
import { StreetcarIcon } from "./StreetcarIcon";

export function PathD() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sculptureRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [traceOpen, setTraceOpen] = useState(false);
  const userPickedRef = useRef(false);

  const stage = REFINERY_STAGES[activeStage];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pathd-hero-reveal", {
          y: 10,
          duration: 0.7,
          stagger: 0.06,
          ease: "expo.out",
          clearProps: "transform",
        });

        ScrollTrigger.create({
          trigger: sculptureRef.current,
          start: "top 75%",
          end: "bottom 25%",
          onUpdate: (self) => {
            if (userPickedRef.current) return;
            const idx = Math.min(
              REFINERY_STAGES.length - 1,
              Math.floor(self.progress * REFINERY_STAGES.length),
            );
            setActiveStage((prev) => (prev === idx ? prev : idx));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const selectStage = (idx: number) => {
    userPickedRef.current = true;
    setActiveStage(idx);
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--sf-paper)] text-[var(--sf-ink)]">
      {/* Ultra-quiet editorial header */}
      <header className="mx-auto max-w-[1040px] px-5 sm:px-10 pt-8 pb-6 flex items-center justify-between gap-4">
        <a
          href="#top-d"
          className="inline-flex items-center gap-2.5 sm:gap-3 text-[14px] sm:text-[15px] font-medium tracking-[-0.015em] text-[var(--sf-ink)] no-underline whitespace-nowrap shrink-0"
        >
          <img
            src="/icon-512.png"
            alt="San Francisco Data bridge mark"
            className="h-7 w-7 rounded-[3px] object-cover shrink-0"
          />
          <span>San Francisco Data</span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6 text-[13.5px] sm:text-[14px] text-[var(--sf-ink-muted)] shrink-0">
          <a
            href={SFDATA_LINKS.essay}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--sf-ink)] transition-colors"
          >
            Essay
          </a>
          <a
            href={SFDATA_LINKS.careers}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--sf-ink)] transition-colors"
          >
            Careers
          </a>
          <a
            href={SFDATA_LINKS.xBrandon}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors"
          >
            Partner
          </a>
        </nav>
      </header>

      <main id="top-d">
        {/* Elevated single-column editorial opening */}
        <section className="mx-auto max-w-[760px] px-6 sm:px-10 pt-14 pb-12 lg:pt-24 lg:pb-16">
          <h1 className="pathd-hero-reveal font-serif-display text-[clamp(2.45rem,4.9vw,4.15rem)] font-normal leading-[1.06] tracking-[-0.028em] text-[var(--sf-ink)] text-balance">
            San Francisco Data turns production traces into RL environments.
          </h1>

          <div className="pathd-hero-reveal mt-8 space-y-5 font-serif-display text-[1.18rem] leading-[1.68] text-[var(--sf-ink)] max-w-[62ch]">
            <p>
              As models surpass human intelligence, we believe the best training data comes from
              where models fail on real work, not from tasks built to break them.
            </p>
            <p className="text-[var(--sf-ink-muted)]">
              We partner with companies whose agents are pushed past their limits and turn those
              failures into training environments to continuously push the frontier.
            </p>
          </div>

          <div className="pathd-hero-reveal mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[14.5px] font-medium">
            <a
              href={SFDATA_LINKS.xBrandon}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
            >
              <span>License production traces</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={SFDATA_LINKS.careers}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors"
            >
              <span>Explore engineering roles</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={SFDATA_LINKS.essay}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--sf-ink-muted)] hover:text-[var(--sf-ink)] underline decoration-[var(--sf-hairline-strong)] transition-colors"
            >
              <span>Read the thesis essay</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </section>

        {/* The One Sculptural Centerpiece — Full-Width Golden Gate Suspension & Trace Tension Field */}
        <section
          ref={sculptureRef}
          className="mx-auto max-w-[1040px] px-6 sm:px-10 py-6"
          aria-label="Interactive trace-to-environment transformation"
        >
          <div className="border border-[var(--sf-hairline)] bg-[var(--sf-paper-subtle)]/50">
            <div className="px-4 pt-5 pb-2 sm:px-6">
              <SuspensionCanvas theme="light" activeStage={activeStage} height={320} />
            </div>

            {/* Minimal interactive stage scrubber strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 sf-hairline-t divide-y sm:divide-y-0 sm:divide-x divide-[var(--sf-hairline)]">
              {REFINERY_STAGES.map((item, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectStage(idx)}
                    aria-pressed={isActive}
                    className={`px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--sf-paper)] text-[var(--sf-ink)]"
                        : "text-[var(--sf-ink-muted)] hover:text-[var(--sf-ink)] hover:bg-[var(--sf-paper)]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium tracking-[-0.01em]">
                        {item.title}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          isActive ? "bg-[var(--sf-red)]" : "bg-transparent"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Concise caption + optional expandable illustrative trace */}
            <div className="px-5 py-4 sm:px-6 sf-hairline-t bg-[var(--sf-paper)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] leading-[1.55] text-[var(--sf-ink-muted)] max-w-[64ch]">
                <span className="text-[var(--sf-ink)] font-medium">{stage.title}:</span>{" "}
                {stage.detail}
              </p>
              <button
                type="button"
                onClick={() => setTraceOpen((v) => !v)}
                aria-expanded={traceOpen}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--sf-ink)] hover:text-[var(--sf-red)] shrink-0 cursor-pointer"
              >
                <span>{traceOpen ? "Hide illustrative trace" : "Inspect illustrative trace"}</span>
                {traceOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
              </button>
            </div>

            {traceOpen && (
              <div className="px-5 py-4 sm:px-6 sf-hairline-t bg-[var(--sf-paper-subtle)]/75 font-mono-trace text-[12.5px] leading-[1.7] overflow-x-auto">
                <div className="text-[11.5px] text-[var(--sf-ink-muted)] mb-2.5">
                  {stage.codeTitle}
                </div>
                <div className="space-y-1.5">
                  {stage.lines.map((line, i) => (
                    <div key={`${stage.id}-${i}`} className="flex items-start gap-3.5">
                      <span className="text-[11px] text-[var(--sf-ink-muted)] w-8 shrink-0">
                        {line.prefix}
                      </span>
                      <span
                        className={
                          line.tone === "red"
                            ? "text-[var(--sf-red)]"
                            : line.tone === "verified"
                              ? "text-[var(--sf-verified)]"
                              : line.tone === "muted"
                                ? "text-[var(--sf-ink-muted)]"
                                : "text-[var(--sf-ink)]"
                        }
                      >
                        {line.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pure Editorial Body — Single-Column Rhythm */}
        <div className="mx-auto max-w-[760px] px-6 sm:px-10 py-16 lg:py-24 space-y-20">
          {/* Commercial & Technical Thesis */}
          <section className="pathd-editorial-block">
            <h2 className="font-serif-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.18] tracking-[-0.02em] text-[var(--sf-ink)]">
              A Glencore for production traces
            </h2>
            <div className="mt-5 space-y-4 text-[15.5px] leading-[1.75] text-[var(--sf-ink-muted)] max-w-[65ch]">
              <p>
                Raw traces are not training assets any more than crude oil is jet fuel. We do not
                claim ownership of the underlying data. Instead, we partner closely with companies
                whose deployed agents—starting with coding agents—generate economically valuable
                traces, handling permissions, redaction, and filtering so source companies share in
                the proceeds when frontier labs extract real training value.
              </p>
              <p>
                Companies keep their distribution, network effects, and customer trust. Frontier
                labs gain environments grounded in where models genuinely fail across the economy.
              </p>
            </div>

            <div className="mt-9 divide-y divide-[var(--sf-hairline)] sf-hairline-t sf-hairline-b">
              {HARD_PROBLEMS.map((problem) => (
                <div key={problem.title} className="py-5">
                  <h3 className="text-[15.5px] font-medium text-[var(--sf-ink)]">
                    {problem.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.68] text-[var(--sf-ink-muted)] max-w-[65ch]">
                    {problem.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Scale & Pedigree */}
          <section className="pathd-editorial-block">
            <h2 className="font-serif-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.18] tracking-[-0.02em] text-[var(--sf-ink)]">
              Team &amp; traction
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.75] text-[var(--sf-ink-muted)] max-w-[65ch]">
              Founded by Brandon Guo and Faiz Siddiqi, who previously grew Mercor’s code team to
              $100M in annualized revenue run rate. Our team has engineered and operated at{" "}
              {TEAM_INSTITUTIONS.slice(0, -1).join(", ")}, and co-authored benchmarks like{" "}
              {TEAM_INSTITUTIONS[TEAM_INSTITUTIONS.length - 1]}, building environments and evals
              for 20+ frontier labs.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 py-7 sf-hairline-y sm:grid-cols-4">
              {VERIFIED_FACTS.map((item) => (
                <div key={item.label}>
                  <dt className="text-[12.5px] text-[var(--sf-ink-muted)]">{item.label}</dt>
                  <dd className="mt-1 font-serif-display text-[1.5rem] leading-[1.15] text-[var(--sf-ink)] tabular-nums">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Careers & Essays — Direct homage to sfdata.com elevated */}
          <section className="pathd-editorial-block space-y-12">
            <div>
              <h2 className="font-serif-display text-[1.75rem] leading-[1.2] tracking-[-0.02em] text-[var(--sf-ink)]">
                Careers
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-[var(--sf-ink-muted)] max-w-[62ch]">
                If that sounds interesting to you, we’re hiring for exceptional research
                engineering talent! Our team works in person five days a week in San Francisco’s
                Financial District.
              </p>
              <a
                href={SFDATA_LINKS.careers}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
              >
                <span>View all roles on Ashby</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>

            <div className="pt-10 sf-hairline-t">
              <h2 className="font-serif-display text-[1.75rem] leading-[1.2] tracking-[-0.02em] text-[var(--sf-ink)]">
                Essays
              </h2>
              <a
                href={SFDATA_LINKS.essay}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 py-4 sf-hairline-y"
              >
                <span className="font-serif-display text-[1.2rem] text-[var(--sf-ink)] group-hover:text-[var(--sf-red)] transition-colors">
                  Production traces and the future of data
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] text-[var(--sf-ink-muted)] tabular-nums shrink-0">
                  <span>Oct 1, 2026</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Editorial Footer — extra bottom clearance for PreviewSwitcher on mobile */}
      <footer className="mx-auto max-w-[760px] px-6 sm:px-10 pt-8 pb-24 sm:pb-20 sf-hairline-t flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[13.5px] text-[var(--sf-ink-muted)]">
        <div className="flex items-center gap-2.5">
          <StreetcarIcon className="h-4 w-6 text-[var(--sf-red)]" />
          <span>Kearny Street, Financial District · © 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={SFDATA_LINKS.xCompany}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--sf-ink)] transition-colors"
          >
            @sfdata
          </a>
          <a
            href={SFDATA_LINKS.linkedinCompany}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--sf-ink)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
