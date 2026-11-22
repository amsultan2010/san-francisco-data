import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  { prefix: "$", target: 100, suffix: "M+", label: "Annualized run rate", note: "Reported in official roles" },
  { prefix: "$", target: 30, suffix: "M", label: "Seed round", note: "Led by Khosla Ventures" },
  { prefix: "", target: 20, suffix: "+", label: "Frontier labs", note: "Environments & evals built" },
  { prefix: "", target: 5, suffix: " days", label: "In-person weekly", note: "Kearny St, Financial District" },
] as const;

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroSpanRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Subtle already-visible entrance on hero elements
        gsap.from(".sf-hero-stagger", {
          y: 14,
          duration: 0.75,
          stagger: 0.07,
          ease: "expo.out",
          clearProps: "transform",
        });

        // Subtle architectural parallax on hero Golden Gate suspension span
        if (heroSpanRef.current) {
          gsap.to(heroSpanRef.current, {
            y: 26,
            ease: "none",
            scrollTrigger: {
              trigger: heroSpanRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        }

        // Kinetic numeric roll-up triggered once when traction strip enters viewport
        if (statsRef.current) {
          const counters = statsRef.current.querySelectorAll<HTMLElement>("[data-target]");
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 88%",
            once: true,
            onEnter: () => {
              counters.forEach((el) => {
                const end = Number(el.dataset.target || "0");
                const prefix = el.dataset.prefix || "";
                const suffix = el.dataset.suffix || "";
                const obj = { val: Math.max(1, Math.round(end * 0.8)) };
                gsap.to(obj, {
                  val: end,
                  duration: 0.65,
                  ease: "expo.out",
                  onUpdate: () => {
                    el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
                  },
                });
              });
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-[var(--sf-red)] text-[var(--sf-white)]">
      {/* Sticky Architectural Header on #CC3200 */}
      <header className="sticky top-0 z-40 bg-[rgba(204,50,0,0.94)] backdrop-blur-md border-b border-[var(--sf-white-hairline)]">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="inline-flex items-center gap-3 text-[var(--sf-white)] no-underline whitespace-nowrap shrink-0"
          >
            <BridgeMark className="h-6 w-8 text-[var(--sf-white)] shrink-0" />
            <span className="font-optima text-[16px] font-medium tracking-[0.01em]">
              San Francisco Data
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 font-optima text-[14px] text-[var(--sf-white-muted)]"
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
            className="inline-flex items-center gap-1.5 bg-[var(--sf-white)] text-[var(--sf-red)] px-3.5 py-2 sm:px-4 font-optima text-[13.5px] font-medium hover:bg-[var(--sf-white-soft)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Partner with us</span>
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero — Full-Bleed #CC3200 Monumental Editorial Opening */}
        <section className="relative overflow-hidden bg-[var(--sf-red)]">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10 pt-14 pb-10 lg:pt-20 lg:pb-12">
            <div className="max-w-[960px]">
              <h1 className="sf-hero-stagger font-optima text-[clamp(2.65rem,6.1vw,5.25rem)] font-medium leading-[1.03] tracking-[-0.025em] text-[var(--sf-white)] text-balance">
                The marketplace for proprietary AI data.
              </h1>

              <p className="sf-hero-stagger mt-6 font-garamond text-[clamp(1.25rem,2vw,1.62rem)] leading-[1.48] text-[var(--sf-white-soft)] max-w-[60ch]">
                San Francisco Data turns production traces into RL environments. As models surpass
                human intelligence, we believe the best training data comes from where models fail
                on real work, not from tasks built to break them.
              </p>

              <p className="sf-hero-stagger mt-3.5 font-garamond text-[clamp(1.1rem,1.45vw,1.28rem)] leading-[1.55] text-[var(--sf-white-muted)] max-w-[62ch]">
                We partner with companies whose agents are pushed past their limits and turn those
                failures into training environments to continuously push the frontier.
              </p>

              <div className="sf-hero-stagger mt-8 flex flex-wrap items-center gap-3.5 font-optima">
                <a
                  href="#refinery"
                  className="inline-flex items-center gap-2 bg-[var(--sf-white)] text-[var(--sf-red)] px-5 py-3 text-[14.5px] font-medium hover:bg-[var(--sf-white-soft)] transition-colors"
                >
                  <span>See how traces become RL</span>
                  <ArrowDownRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <a
                  href={SFDATA_LINKS.careers}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--sf-white-hairline-strong)] bg-transparent text-[var(--sf-white)] px-5 py-3 text-[14.5px] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <span>Explore open roles</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
                <a
                  href={SFDATA_LINKS.essay}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-3 text-[14.5px] text-[var(--sf-white)] underline decoration-[var(--sf-white-hairline-strong)] hover:decoration-[var(--sf-white)] transition-colors"
                >
                  <span>Read the October 1 essay</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </a>
              </div>
            </div>

            {/* Full-Width Architectural White Golden Gate Suspension Span */}
            <div
              ref={heroSpanRef}
              className="sf-hero-stagger mt-10 lg:mt-12 border-t border-b border-[var(--sf-white-hairline)] pt-4 pb-2"
            >
              <SuspensionCanvas theme="vermilion" activeStage={0} height={240} />
            </div>
          </div>
        </section>

        {/* Pinned GSAP Trace-to-RL Refinery Sheet (Crisp White framed inside #CC3200) */}
        <TraceRefineryEngine />

        {/* Full-Bleed #CC3200 Kinetic Traction + Three Hard Research Problems */}
        <section id="research" className="bg-[var(--sf-red)] text-[var(--sf-white)] py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            {/* Kinetic Verified Traction Strip */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-x-6 gap-y-2 lg:gap-0 lg:grid-cols-4 border-t border-b border-[var(--sf-white-hairline)] lg:divide-x lg:divide-[var(--sf-white-hairline)]"
            >
              {KINETIC_METRICS.map((item) => (
                <div key={item.label} className="py-6 lg:py-7 lg:px-7 first:lg:pl-0 last:lg:pr-0">
                  <div
                    data-target={item.target}
                    data-prefix={item.prefix}
                    data-suffix={item.suffix}
                    className="font-optima text-[clamp(2rem,3.6vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--sf-white)] tabular-nums"
                  >
                    {item.prefix}
                    {item.target}
                    {item.suffix}
                  </div>
                  <div className="mt-2 font-optima text-[14px] font-medium text-[var(--sf-white)]">
                    {item.label}
                  </div>
                  <p className="mt-0.5 font-garamond text-[16px] text-[var(--sf-white-muted)]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Three Hard Research Problems */}
            <div className="mt-16 lg:mt-20">
              <h2 className="font-optima text-[clamp(1.9rem,3.3vw,2.85rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-white)] max-w-[28ch]">
                Three hard research problems define this work.
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10 pt-8 border-t border-[var(--sf-white-hairline)]">
                {HARD_PROBLEMS.map((problem) => (
                  <div key={problem.title} className="flex flex-col">
                    <h3 className="font-optima text-[1.28rem] font-medium leading-[1.25] text-[var(--sf-white)]">
                      {problem.title}
                    </h3>
                    <p className="mt-3 font-garamond text-[18px] leading-[1.6] text-[var(--sf-white-muted)]">
                      {problem.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Full-Bleed Pure White Gallery — Three-Audience Architecture */}
        <section
          id="partners"
          className="sf-white-focus bg-[var(--sf-white)] text-[var(--sf-ink)] py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <h2 className="font-optima text-[clamp(1.95rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] max-w-[26ch] text-balance">
              Built for trace partners, frontier labs, and research engineers.
            </h2>

            <div className="mt-12 divide-y divide-[var(--sf-hairline)] border-t border-b border-[var(--sf-hairline)]">
              {AUDIENCE_PATHS.map((row) => (
                <div
                  key={row.audience}
                  className="grid grid-cols-1 gap-5 py-9 lg:grid-cols-12 lg:gap-10 items-start"
                >
                  <div className="lg:col-span-3">
                    <h3 className="font-optima text-[1.32rem] font-medium leading-[1.25] text-[var(--sf-red)]">
                      {row.audience}
                    </h3>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="font-optima text-[1.12rem] font-medium leading-[1.35] text-[var(--sf-ink)]">
                      {row.heading}
                    </p>
                    <p className="mt-2.5 font-garamond text-[18px] leading-[1.62] text-[var(--sf-ink-muted)] max-w-[58ch]">
                      {row.body}
                    </p>
                  </div>
                  <div className="lg:col-span-3 lg:flex lg:justify-end">
                    <a
                      href={row.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-optima text-[14.5px] font-medium text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors"
                    >
                      <span>{row.ctaLabel}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full-Bleed #CC3200 — October 1 Essay Monograph Sheet + Team Pedigree */}
        <section id="essay" className="bg-[var(--sf-red)] text-[var(--sf-white)] py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Crisp White Inset Essay Monograph */}
              <article className="sf-white-focus lg:col-span-7 bg-[var(--sf-white)] text-[var(--sf-ink)] p-7 sm:p-10 lg:p-12 flex flex-col justify-between shadow-[0_20px_50px_rgba(90,18,0,0.2)]">
                <div>
                  <div className="flex items-center justify-between gap-4 pb-6 border-b border-[var(--sf-hairline)]">
                    <img
                      src="/logo-sfdata.jpg"
                      alt="San Francisco Data official mark"
                      className="h-9 w-9 object-cover"
                    />
                    <span className="font-garamond text-[16px] text-[var(--sf-ink-muted)] tabular-nums">
                      October 1, 2026 · Brandon Guo &amp; Faiz Siddiqi
                    </span>
                  </div>

                  <h2 className="mt-7 font-optima text-[clamp(1.7rem,2.9vw,2.45rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)]">
                    Production traces and the future of data
                  </h2>

                  <blockquote className="mt-6 pl-5 border-l border-[var(--sf-red)] font-garamond italic text-[1.32rem] leading-[1.52] text-[var(--sf-ink)] max-w-[50ch]">
                    “The economy itself can become the largest source of training data for advanced
                    AI—building a continuous connection between AI deployed across the economy and
                    the training processes that determine what AI can do next.”
                  </blockquote>

                  <p className="mt-5 font-garamond text-[18px] leading-[1.62] text-[var(--sf-ink-muted)] max-w-[58ch]">
                    Our opening essay traces human data from drawing boxes around pedestrians to
                    writing legal briefs and financial models, explaining why contractor-generated
                    training data becomes a race to the bottom as models surpass human experts—and
                    why coding agents are the starting wedge for production traces.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--sf-hairline)]">
                  <a
                    href={SFDATA_LINKS.essay}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-optima text-[15px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
                  >
                    <span>Read the full essay on sfdata.com</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </a>
                </div>
              </article>

              {/* Right: White-on-Red Team Pedigree & Hiring Panel */}
              <aside className="lg:col-span-5 flex flex-col justify-between border border-[var(--sf-white-hairline)] bg-[var(--sf-red-surface)]/45 p-7 sm:p-10">
                <div>
                  <h2 className="font-optima text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.18] text-[var(--sf-white)]">
                    Team &amp; research pedigree
                  </h2>
                  <p className="mt-4 font-garamond text-[18px] leading-[1.6] text-[var(--sf-white-muted)]">
                    Founded by Brandon Guo (CEO) and Faiz Siddiqi (CTO), who previously grew
                    Mercor’s code team to $100M in annualized revenue run rate. Backed by a $30M
                    seed round led by Khosla Ventures.
                  </p>

                  <div className="mt-7 pt-6 border-t border-[var(--sf-white-hairline)]">
                    <div className="font-optima text-[13px] tracking-[0.04em] uppercase text-[var(--sf-white-muted)]">
                      Previously engineered &amp; operated at
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                      {TEAM_INSTITUTIONS.map((org) => (
                        <span
                          key={org}
                          className="font-optima text-[15.5px] font-medium text-[var(--sf-white)]"
                        >
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-7 border-t border-[var(--sf-white-hairline)]">
                  <h3 className="font-optima text-[1.25rem] font-medium text-[var(--sf-white)]">
                    Join us in San Francisco
                  </h3>
                  <p className="mt-2 font-garamond text-[17.5px] leading-[1.55] text-[var(--sf-white-muted)]">
                    If that sounds interesting to you, we’re hiring for exceptional research
                    engineering talent—in person five days a week on Kearny Street.
                  </p>
                  <a
                    href={SFDATA_LINKS.careers}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 bg-[var(--sf-white)] text-[var(--sf-red)] px-5 py-3 font-optima text-[14.5px] font-medium hover:bg-[var(--sf-white-soft)] transition-colors"
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

      {/* Deep Golden Gate Vermilion Footer */}
      <footer className="bg-[var(--sf-red-deep)] border-t border-[var(--sf-white-hairline)] text-[var(--sf-white-muted)]">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 font-garamond text-[16px]">
            <BridgeMark className="h-5 w-7 text-[var(--sf-white)] shrink-0" />
            <StreetcarIcon className="h-4 w-6 text-[var(--sf-white)] shrink-0" />
            <span className="text-[var(--sf-white)]">
              Kearny Street, Financial District · San Francisco
            </span>
            <span aria-hidden="true">·</span>
            <span>© 2026 San Francisco Data</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-optima text-[14px]">
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
