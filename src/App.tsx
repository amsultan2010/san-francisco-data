import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AUDIENCE_PATHS,
  HARD_PROBLEMS,
  SFDATA_LINKS,
  TEAM_INSTITUTIONS,
} from "./data/sfdata";
import { BridgeMark } from "./components/BridgeMark";
import { SuspensionCanvas } from "./components/SuspensionCanvas";
import { TraceRefineryEngine } from "./components/TraceRefineryEngine";
import { StreetcarIcon } from "./components/StreetcarIcon";

const KINETIC_METRICS = [
  { value: "$100M+", label: "Annualized run rate", note: "Reported in official roles" },
  { value: "$30M", label: "Seed round", note: "Led by Khosla Ventures" },
  { value: "20+", label: "Frontier labs", note: "Environments & evals built" },
  { value: "5 days", label: "In-person weekly", note: "Kearny St, Financial District" },
] as const;

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroSpanRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".sf-hero-stagger", {
          y: 14,
          duration: 0.72,
          stagger: 0.065,
          ease: "expo.out",
          clearProps: "transform",
        });

        if (heroSpanRef.current) {
          gsap.to(heroSpanRef.current, {
            y: 22,
            ease: "none",
            scrollTrigger: {
              trigger: heroSpanRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        }

        if (statsRef.current) {
          gsap.from(statsRef.current.querySelectorAll(".sf-stat-item"), {
            y: 12,
            duration: 0.55,
            stagger: 0.06,
            ease: "expo.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 90%",
              once: true,
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--sf-white)] text-[var(--sf-ink)]">
      {/* Sticky Golden Gate Vermilion Navbar (#CC3200) */}
      <header className="sf-red-focus sticky top-0 z-40 bg-[var(--sf-red)] border-b border-[var(--sf-white-hairline)] shadow-[0_4px_20px_rgba(158,37,0,0.14)]">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-12 lg:px-16 h-[68px] sm:h-[74px] flex items-center justify-between gap-3 sm:gap-6">
          <a
            href="#top"
            className="inline-flex items-center gap-2 sm:gap-3 text-[var(--sf-white)] no-underline whitespace-nowrap shrink-0"
          >
            <BridgeMark className="h-6 w-8 sm:h-7 sm:w-9 text-[var(--sf-white)] shrink-0" />
            <span className="font-optima text-[16px] sm:text-[18.5px] font-medium tracking-[0.01em]">
              San Francisco Data
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-9 font-optima text-[16px] font-medium text-[var(--sf-white-muted)]"
          >
            <a href="#refinery" className="hover:text-[var(--sf-white)] transition-colors">
              How it works
            </a>
            <a href="#research" className="hover:text-[var(--sf-white)] transition-colors">
              Research
            </a>
            <a href="#partners" className="hover:text-[var(--sf-white)] transition-colors">
              Partners
            </a>
            <a href="#essay" className="hover:text-[var(--sf-white)] transition-colors">
              Essay
            </a>
            <a
              href={SFDATA_LINKS.careers}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-white)] transition-colors"
            >
              Careers
            </a>
          </nav>

          <a
            href={SFDATA_LINKS.xBrandon}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--sf-white)] text-[var(--sf-red)] px-3 py-2 sm:px-5 sm:py-2.5 font-optima text-[14px] sm:text-[15.5px] font-medium hover:bg-[var(--sf-red-tint)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Partner with us</span>
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          </a>
        </div>

        {/* Compact Mobile Section Nav Strip */}
        <nav
          aria-label="Mobile sections"
          className="md:hidden border-t border-[var(--sf-white-hairline)] px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto font-optima text-[14.5px] font-medium text-[var(--sf-white-muted)]"
        >
          <a href="#refinery" className="hover:text-[var(--sf-white)] whitespace-nowrap">
            How it works
          </a>
          <a href="#research" className="hover:text-[var(--sf-white)] whitespace-nowrap">
            Research
          </a>
          <a href="#partners" className="hover:text-[var(--sf-white)] whitespace-nowrap">
            Partners
          </a>
          <a href="#essay" className="hover:text-[var(--sf-white)] whitespace-nowrap">
            Essay
          </a>
          <a
            href={SFDATA_LINKS.careers}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Careers
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Centered Luminous White Hero with Vermilion Accents & Golden Gate Span */}
        <section className="relative overflow-hidden bg-[var(--sf-white)]">
          <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16 pt-18 pb-14 lg:pt-26 lg:pb-20">
            <div className="mx-auto max-w-[860px] text-center">
              <h1 className="sf-hero-stagger font-optima text-[clamp(2.8rem,5.9vw,5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[var(--sf-ink)] text-balance">
                The marketplace for{" "}
                <span className="text-[var(--sf-red)]">proprietary AI data.</span>
              </h1>

              <p className="sf-hero-stagger mx-auto mt-7 font-garamond text-[clamp(1.3rem,2.1vw,1.62rem)] leading-[1.52] text-[var(--sf-ink)] max-w-[54ch]">
                San Francisco Data turns production traces into RL environments. As models surpass
                human intelligence, we believe the best training data comes from where models fail
                on real work, not from tasks built to break them.
              </p>

              <p className="sf-hero-stagger mx-auto mt-4 font-garamond text-[clamp(1.15rem,1.5vw,1.32rem)] leading-[1.58] text-[var(--sf-ink-muted)] max-w-[56ch]">
                We partner with companies whose agents are pushed past their limits and turn those
                failures into training environments to continuously push the frontier.
              </p>

              <div className="sf-hero-stagger mt-10 flex flex-wrap items-center justify-center gap-4 font-optima">
                <a
                  href="#refinery"
                  className="inline-flex items-center gap-2 bg-[var(--sf-red)] text-[var(--sf-white)] px-6 py-3.5 text-[16px] font-medium hover:bg-[var(--sf-red-hover)] transition-colors"
                >
                  <span>See how traces become RL</span>
                  <ArrowDownRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <a
                  href={SFDATA_LINKS.careers}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--sf-hairline-strong)] bg-[var(--sf-white)] text-[var(--sf-ink)] px-6 py-3.5 text-[16px] font-medium hover:border-[var(--sf-red)] hover:text-[var(--sf-red)] transition-colors"
                >
                  <span>Explore open roles</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
                <a
                  href={SFDATA_LINKS.essay}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-3.5 text-[16px] font-medium text-[var(--sf-red)] underline decoration-[var(--sf-red-border)] hover:decoration-[var(--sf-red)] transition-colors"
                >
                  <span>Read the October 1 essay</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
              </div>
            </div>

            {/* Centered Golden Gate Suspension Bridge Visualization (Vermilion on White) */}
            <div
              ref={heroSpanRef}
              className="sf-hero-stagger mt-14 lg:mt-16 border-t border-b border-[var(--sf-hairline)] pt-5 pb-3"
            >
              <SuspensionCanvas theme="light" activeStage={0} height={240} />
            </div>
          </div>
        </section>

        {/* Centered Verified Traction Strip on Subtle Warm Paper */}
        <section className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)]">
          <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-x-8 gap-y-2 lg:gap-0 lg:grid-cols-4 lg:divide-x lg:divide-[var(--sf-hairline)]"
            >
              {KINETIC_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="sf-stat-item py-9 lg:py-11 lg:px-8 text-center flex flex-col items-center"
                >
                  <div className="font-optima text-[clamp(2.2rem,3.6vw,3.15rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--sf-red)] tabular-nums">
                    {item.value}
                  </div>
                  <div className="mt-2.5 font-optima text-[16px] font-medium text-[var(--sf-ink)]">
                    {item.label}
                  </div>
                  <p className="mt-1 font-garamond text-[17.5px] text-[var(--sf-ink-muted)]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Visual Trace-to-RL Pipeline Diagram on Crisp White */}
        <TraceRefineryEngine />

        {/* Three Hard Research Problems — Hairline-Divided Architectural Columns */}
        <section
          id="research"
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
            <div className="mx-auto max-w-[700px] text-center">
              <h2 className="font-optima text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Three hard research problems define this work.
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0 border-t border-b border-[var(--sf-hairline)] lg:divide-x lg:divide-[var(--sf-hairline)]">
              {HARD_PROBLEMS.map((problem) => (
                <div
                  key={problem.title}
                  className="py-8 lg:py-10 lg:px-10 first:lg:pl-0 last:lg:pr-0 flex flex-col"
                >
                  <h3 className="font-optima text-[1.45rem] font-medium leading-[1.24] text-[var(--sf-red)]">
                    {problem.title}
                  </h3>
                  <p className="mt-4 font-garamond text-[19.5px] leading-[1.64] text-[var(--sf-ink-muted)]">
                    {problem.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three-Audience Architecture on Crisp White */}
        <section
          id="partners"
          className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
            <div className="max-w-[700px]">
              <h2 className="font-optima text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Built for trace partners, frontier labs, and research engineers.
              </h2>
            </div>

            <div className="mt-14 divide-y divide-[var(--sf-hairline)] border-t border-b border-[var(--sf-hairline)]">
              {AUDIENCE_PATHS.map((row) => (
                <div
                  key={row.audience}
                  className="grid grid-cols-1 gap-6 py-11 lg:grid-cols-12 lg:gap-12 items-start"
                >
                  <div className="lg:col-span-3">
                    <h3 className="font-optima text-[1.4rem] font-medium leading-[1.25] text-[var(--sf-red)]">
                      {row.audience}
                    </h3>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="font-optima text-[1.25rem] font-medium leading-[1.34] text-[var(--sf-ink)]">
                      {row.heading}
                    </p>
                    <p className="mt-3 font-garamond text-[19.5px] leading-[1.64] text-[var(--sf-ink-muted)] max-w-[56ch]">
                      {row.body}
                    </p>
                  </div>
                  <div className="lg:col-span-3 lg:flex lg:justify-end lg:pt-1">
                    <a
                      href={row.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-optima text-[16px] font-medium text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors whitespace-nowrap"
                    >
                      <span>{row.ctaLabel}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* October 1 Essay + Team Pedigree on Subtle Warm Paper */}
        <section
          id="essay"
          className="bg-[var(--sf-paper)] border-t border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Left: Crisp White Essay Monograph */}
              <article className="lg:col-span-7 bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-8 sm:p-11 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--sf-hairline)]">
                    <img
                      src="/logo-sfdata.jpg"
                      alt="San Francisco Data official mark"
                      className="h-10 w-10 object-cover"
                    />
                    <span className="font-garamond text-[17.5px] text-[var(--sf-ink-muted)] tabular-nums">
                      October 1, 2026 · Brandon Guo &amp; Faiz Siddiqi
                    </span>
                  </div>

                  <h2 className="mt-8 font-optima text-[clamp(1.85rem,3vw,2.55rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)]">
                    Production traces and the future of data
                  </h2>

                  <blockquote className="mt-6 pl-5 border-l border-[var(--sf-red)] font-garamond italic text-[1.42rem] leading-[1.52] text-[var(--sf-ink)] max-w-[48ch]">
                    “The economy itself can become the largest source of training data for advanced
                    AI—building a continuous connection between AI deployed across the economy and
                    the training processes that determine what AI can do next.”
                  </blockquote>

                  <p className="mt-6 font-garamond text-[19.5px] leading-[1.64] text-[var(--sf-ink-muted)] max-w-[56ch]">
                    Our opening essay traces human data from drawing boxes around pedestrians to
                    writing legal briefs and financial models, explaining why contractor-generated
                    training data becomes a race to the bottom as models surpass human experts—and
                    why coding agents are the starting wedge for production traces.
                  </p>
                </div>

                <div className="mt-9 pt-6 border-t border-[var(--sf-hairline)]">
                  <a
                    href={SFDATA_LINKS.essay}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-optima text-[16.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
                  >
                    <span>Read the full essay on sfdata.com</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </a>
                </div>
              </article>

              {/* Right: Team Pedigree & Hiring Panel */}
              <aside className="lg:col-span-5 bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-8 sm:p-11 flex flex-col justify-between">
                <div>
                  <h2 className="font-optima text-[clamp(1.65rem,2.4vw,2.15rem)] font-medium leading-[1.18] text-[var(--sf-ink)]">
                    Team &amp; research pedigree
                  </h2>
                  <p className="mt-4 font-garamond text-[19px] leading-[1.62] text-[var(--sf-ink-muted)]">
                    Founded by Brandon Guo (CEO) and Faiz Siddiqi (CTO), who previously grew
                    Mercor’s code team to $100M in annualized revenue run rate. Backed by a $30M
                    seed round led by Khosla Ventures.
                  </p>

                  <div className="mt-8 pt-6 border-t border-[var(--sf-hairline)]">
                    <div className="font-optima text-[14.5px] font-medium text-[var(--sf-ink-muted)]">
                      Previously engineered &amp; operated at
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                      {TEAM_INSTITUTIONS.map((org) => (
                        <span
                          key={org}
                          className="font-optima text-[16.5px] font-medium text-[var(--sf-ink)]"
                        >
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-7 border-t border-[var(--sf-hairline)]">
                  <h3 className="font-optima text-[1.35rem] font-medium text-[var(--sf-ink)]">
                    Join us in San Francisco
                  </h3>
                  <p className="mt-2.5 font-garamond text-[18.5px] leading-[1.58] text-[var(--sf-ink-muted)]">
                    We’re hiring exceptional research engineering talent—in person five days a week
                    on Kearny Street.
                  </p>
                  <a
                    href={SFDATA_LINKS.careers}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-[var(--sf-red)] text-[var(--sf-white)] px-6 py-3.5 font-optima text-[16px] font-medium hover:bg-[var(--sf-red-hover)] transition-colors"
                  >
                    <span>View all open roles on Ashby</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* Bookend Golden Gate Vermilion Footer */}
      <footer className="sf-red-focus bg-[var(--sf-red)] text-[var(--sf-white-muted)]">
        <div className="mx-auto max-w-[1140px] px-6 sm:px-12 lg:px-16 py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 font-garamond text-[17.5px]">
            <BridgeMark className="h-5 w-7 text-[var(--sf-white)] shrink-0" />
            <StreetcarIcon className="h-4 w-6 text-[var(--sf-white)] shrink-0" />
            <span className="text-[var(--sf-white)]">
              Kearny Street, Financial District · San Francisco
            </span>
            <span aria-hidden="true">·</span>
            <span>© 2026 San Francisco Data</span>
          </div>

          <div className="flex flex-wrap items-center gap-7 font-optima text-[15.5px]">
            <a
              href={SFDATA_LINKS.essay}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-white)] transition-colors"
            >
              Essay
            </a>
            <a
              href={SFDATA_LINKS.careers}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-white)] transition-colors"
            >
              Careers
            </a>
            <a
              href={SFDATA_LINKS.xCompany}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-white)] transition-colors"
            >
              X (@sfdata)
            </a>
            <a
              href={SFDATA_LINKS.linkedinCompany}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--sf-white)] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
