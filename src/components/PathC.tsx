import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AUDIENCE_PATHS,
  HARD_PROBLEMS,
  SFDATA_LINKS,
  TEAM_INSTITUTIONS,
  VERIFIED_FACTS,
} from "../data/sfdata";
import { TraceRefineryEngine } from "./TraceRefineryEngine";
import { StreetcarIcon } from "./StreetcarIcon";

export function PathC() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pathc-hero-line", {
          y: 10,
          duration: 0.7,
          stagger: 0.06,
          ease: "expo.out",
          clearProps: "transform",
        });

        if (transitionRef.current) {
          gsap.fromTo(
            ".pathc-bridge-curtain",
            { scaleY: 0.12 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "bottom center",
              scrollTrigger: {
                trigger: transitionRef.current,
                start: "top 90%",
                end: "bottom 55%",
                scrub: 0.4,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--sf-paper)] text-[var(--sf-ink)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[rgba(250,249,246,0.94)] backdrop-blur-md sf-hairline-b">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10 h-16 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 sm:gap-3 text-[14px] sm:text-[15px] font-medium tracking-[-0.015em] text-[var(--sf-ink)] no-underline whitespace-nowrap shrink-0"
          >
            <img
              src="/icon-512.png"
              alt="San Francisco Data bridge mark"
              className="h-7 w-7 rounded-[3px] object-cover shrink-0"
            />
            <span>San Francisco Data</span>
          </a>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-[14px] text-[var(--sf-ink-muted)]">
            <a href="#pipeline" className="hover:text-[var(--sf-ink)] transition-colors">
              Pipeline
            </a>
            <a href="#partners" className="hover:text-[var(--sf-ink)] transition-colors">
              Partners
            </a>
            <a href="#thesis" className="hover:text-[var(--sf-ink)] transition-colors">
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
          </nav>

          <a
            href={SFDATA_LINKS.xBrandon}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--sf-ink)] text-[var(--sf-paper)] px-3 py-1.5 sm:px-4 sm:py-2 text-[13px] sm:text-[13.5px] font-medium tracking-[-0.01em] hover:bg-[var(--sf-red)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Partner with us</span>
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
        </div>
      </header>

      {/* Hero — Serene editorial light opening */}
      <main id="top">
        <section className="mx-auto max-w-[1200px] px-6 sm:px-10 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-[920px]">
            <h1 className="pathc-hero-line font-serif-display text-[clamp(2.55rem,5.4vw,4.7rem)] font-normal leading-[1.03] tracking-[-0.03em] text-[var(--sf-ink)] text-balance">
              San Francisco Data turns production traces into RL environments.
            </h1>

            <p className="pathc-hero-line mt-8 text-[clamp(1.06rem,1.5vw,1.25rem)] leading-[1.6] text-[var(--sf-ink-muted)] max-w-[60ch]">
              As models surpass human intelligence, we believe the best training data comes from
              where models fail on real work, not from tasks built to break them. We partner with
              companies whose agents are pushed past their limits and turn those failures into
              training environments to continuously push the frontier.
            </p>

            <div className="pathc-hero-line mt-10 flex flex-wrap items-center gap-3.5">
              <a
                href="#pipeline"
                className="inline-flex items-center gap-2 bg-[var(--sf-red)] text-white px-5 py-3 text-[14px] font-medium hover:bg-[var(--sf-red-hover)] transition-colors"
              >
                <span>Inspect the trace pipeline</span>
                <ArrowDownRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
              <a
                href={SFDATA_LINKS.careers}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--sf-hairline-strong)] bg-transparent text-[var(--sf-ink)] px-5 py-3 text-[14px] font-medium hover:border-[var(--sf-ink)] transition-colors"
              >
                <span>View open roles</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
              <a
                href={SFDATA_LINKS.essay}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-3 text-[14px] font-medium text-[var(--sf-ink-muted)] hover:text-[var(--sf-ink)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-ink)] transition-colors"
              >
                <span>Read the October 1 essay</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </section>

        {/* Scroll-linked architectural threshold from alabaster paper into obsidian engine */}
        <div
          ref={transitionRef}
          aria-hidden="true"
          className="relative h-16 sm:h-24 overflow-hidden bg-[var(--sf-paper)]"
        >
          <div className="pathc-bridge-curtain absolute inset-0 bg-[var(--sf-obsidian)]" />
        </div>

        {/* Dark Obsidian Interactive Trace Refinery Chamber */}
        <TraceRefineryEngine />

        {/* Three Hard Problems — Architectural Ledger on Obsidian */}
        <section className="bg-[var(--sf-obsidian)] text-[var(--sf-obsidian-ink)] pb-24 lg:pb-28">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 pt-14 sf-obsidian-hairline-t">
            <h2 className="font-serif-display text-[clamp(1.65rem,2.6vw,2.35rem)] leading-[1.15] tracking-[-0.02em] text-[var(--sf-obsidian-ink)] max-w-[26ch]">
              Three hard research problems define this work.
            </h2>

            <div className="mt-10 divide-y divide-[var(--sf-obsidian-hairline)] sf-obsidian-hairline-t sf-obsidian-hairline-b">
              {HARD_PROBLEMS.map((problem) => (
                <div
                  key={problem.title}
                  className="grid grid-cols-1 gap-4 py-7 lg:grid-cols-12 lg:items-baseline"
                >
                  <h3 className="lg:col-span-5 text-[17px] font-medium tracking-[-0.015em] text-[var(--sf-obsidian-ink)]">
                    {problem.title}
                  </h3>
                  <p className="lg:col-span-7 text-[15px] leading-[1.65] text-[var(--sf-obsidian-muted)] max-w-[64ch]">
                    {problem.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Return to Warm Alabaster — Three-Audience Editorial Rows (no eyebrow above heading) */}
        <section id="partners" className="mx-auto max-w-[1200px] px-6 sm:px-10 py-24 lg:py-28">
          <div className="max-w-[680px]">
            <h2 className="font-serif-display text-[clamp(1.95rem,3.4vw,3rem)] leading-[1.1] tracking-[-0.025em] text-[var(--sf-ink)] text-balance">
              Built for the companies generating traces, the labs training on them, and the
              engineers refining both.
            </h2>
          </div>

          <div className="mt-14 divide-y divide-[var(--sf-hairline)] sf-hairline-t sf-hairline-b">
            {AUDIENCE_PATHS.map((row) => (
              <div
                key={row.audience}
                className="grid grid-cols-1 gap-5 py-10 lg:grid-cols-12 lg:gap-10"
              >
                <div className="lg:col-span-4">
                  <h3 className="font-serif-display text-[1.5rem] leading-[1.2] tracking-[-0.02em] text-[var(--sf-ink)]">
                    {row.audience}
                  </h3>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-[16px] font-medium leading-[1.45] text-[var(--sf-ink)]">
                    {row.heading}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-[1.68] text-[var(--sf-ink-muted)] max-w-[60ch]">
                    {row.body}
                  </p>
                </div>
                <div className="lg:col-span-3 lg:flex lg:justify-end lg:items-start">
                  <a
                    href={row.ctaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
                  >
                    <span>{row.ctaLabel}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thesis Essay & Team Pedigree (Verified Facts placed after the mechanism) */}
        <section id="thesis" className="mx-auto max-w-[1200px] px-6 sm:px-10 pb-24 lg:pb-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pt-14 sf-hairline-t">
            <article className="lg:col-span-7 lg:pr-8">
              <h2 className="font-serif-display text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)]">
                Production traces and the future of data
              </h2>
              <p className="mt-3 text-[14px] text-[var(--sf-ink-muted)]">
                October 1, 2026 · Brandon Guo &amp; Faiz Siddiqi
              </p>

              <blockquote className="mt-7 pl-5 border-l border-[var(--sf-red)] font-serif-display italic text-[1.22rem] leading-[1.55] text-[var(--sf-ink)] max-w-[54ch]">
                “The economy itself can become the largest source of training data for advanced
                AI—building a continuous connection between AI deployed across the economy and the
                training processes that determine what AI can do next.”
              </blockquote>

              <p className="mt-6 text-[15px] leading-[1.7] text-[var(--sf-ink-muted)] max-w-[60ch]">
                Our opening essay traces human data from drawing boxes around pedestrians to
                writing legal briefs and financial models, explaining why contractor-generated
                training data becomes a race to the bottom as models surpass human experts—and why
                coding agents are the first wedge for production traces.
              </p>

              <a
                href={SFDATA_LINKS.essay}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-[14.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
              >
                <span>Read the full essay on sfdata.com</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </article>

            <aside className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[var(--sf-hairline)]">
              <h2 className="font-serif-display text-[1.55rem] leading-[1.2] tracking-[-0.02em] text-[var(--sf-ink)]">
                Team &amp; traction
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-[1.68] text-[var(--sf-ink-muted)]">
                Founded by Brandon Guo (CEO) and Faiz Siddiqi (CTO), who previously grew Mercor’s
                code team to $100M in annualized revenue run rate. Backed by a $30M seed round led
                by Khosla Ventures.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 pt-6 sf-hairline-t">
                {VERIFIED_FACTS.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[12px] text-[var(--sf-ink-muted)]">{item.label}</dt>
                    <dd className="mt-0.5 font-serif-display text-[1.35rem] leading-[1.15] text-[var(--sf-ink)] tabular-nums">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 pt-6 sf-hairline-t">
                {TEAM_INSTITUTIONS.map((org) => (
                  <span
                    key={org}
                    className="text-[13.5px] font-medium text-[var(--sf-ink)] tracking-[-0.01em]"
                  >
                    {org}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-6 sf-hairline-t">
                <p className="text-[14.5px] leading-[1.6] text-[var(--sf-ink)]">
                  We’re hiring exceptional research engineering talent in person in San Francisco.
                </p>
                <a
                  href={SFDATA_LINKS.careers}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-[var(--sf-ink)] text-[var(--sf-paper)] px-4 py-2.5 text-[13.5px] font-medium hover:bg-[var(--sf-red)] transition-colors"
                >
                  <span>View all roles on Ashby</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer — extra bottom clearance so PreviewSwitcher never occludes mobile links */}
      <footer className="sf-hairline-t bg-[var(--sf-paper)]">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 pt-10 pb-36 sm:pb-24 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-[13.5px] text-[var(--sf-ink-muted)]">
          <div className="flex items-center gap-3">
            <StreetcarIcon className="h-4 w-6 text-[var(--sf-red)] shrink-0" />
            <span>Kearny Street, Financial District · San Francisco · © 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
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
              href={SFDATA_LINKS.xCompany}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-ink)] transition-colors"
            >
              X (@sfdata)
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
        </div>
      </footer>
    </div>
  );
}
