import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import {
  AUDIENCE_PATHS,
  HARD_PROBLEMS,
  SFDATA_LINKS,
  TEAM_INSTITUTIONS,
} from "./data/sfdata";
import { BridgeMark } from "./components/BridgeMark";
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
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLElement | null>(null);
  const partnersRef = useRef<HTMLElement | null>(null);
  const essayRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Continuous top reading progress hairline scrubbed across full document
        if (scrollProgressRef.current) {
          gsap.fromTo(
            scrollProgressRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2,
              },
            },
          );
        }

        // 2. Choreographed hero entrance timeline
        const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
        heroTl.from(".sf-hero-stagger", {
          y: 26,
          opacity: 0,
          duration: 0.82,
          stagger: 0.1,
          clearProps: "transform,opacity",
        });

        // 3. Traction strip staggered entrance + kinetic numeric roll-up
        if (statsRef.current) {
          gsap.from(statsRef.current.querySelectorAll(".sf-stat-item"), {
            y: 22,
            opacity: 0,
            duration: 0.68,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 86%",
              once: true,
            },
          });

          const counters = statsRef.current.querySelectorAll<HTMLElement>("[data-target]");
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 86%",
            once: true,
            onEnter: () => {
              counters.forEach((el) => {
                const end = Number(el.dataset.target || "0");
                const prefix = el.dataset.prefix || "";
                const suffix = el.dataset.suffix || "";
                const obj = { val: Math.max(1, Math.round(end * 0.45)) };
                gsap.to(obj, {
                  val: end,
                  duration: 0.95,
                  ease: "expo.out",
                  onUpdate: () => {
                    el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
                  },
                });
              });
            },
          });
        }

        // 4. Three Hard Research Problems scroll-triggered architectural cascade
        if (researchRef.current) {
          gsap.from(researchRef.current.querySelectorAll(".sf-research-reveal"), {
            y: 26,
            opacity: 0,
            duration: 0.72,
            stagger: 0.11,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: researchRef.current,
              start: "top 82%",
              once: true,
            },
          });
        }

        // 5. Three-Audience Ledger row-by-row scroll reveal
        if (partnersRef.current) {
          gsap.from(partnersRef.current.querySelector(".sf-partners-heading"), {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: partnersRef.current,
              start: "top 84%",
              once: true,
            },
          });

          gsap.utils
            .toArray<HTMLElement>(partnersRef.current.querySelectorAll(".sf-audience-row"))
            .forEach((row) => {
              gsap.from(row, {
                y: 26,
                opacity: 0,
                duration: 0.68,
                ease: "expo.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: row,
                  start: "top 88%",
                  once: true,
                },
              });
            });
        }

        // 6. October 1 Essay & Team Pedigree asymmetric spread + institution cascade
        if (essayRef.current) {
          gsap.from(essayRef.current.querySelector(".sf-essay-card"), {
            y: 28,
            opacity: 0,
            duration: 0.76,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(essayRef.current.querySelector(".sf-essay-quote"), {
            x: -16,
            opacity: 0,
            duration: 0.75,
            delay: 0.14,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(essayRef.current.querySelector(".sf-team-card"), {
            y: 36,
            opacity: 0,
            duration: 0.8,
            delay: 0.12,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(essayRef.current.querySelectorAll(".sf-org-item"), {
            y: 12,
            opacity: 0,
            duration: 0.45,
            stagger: 0.045,
            delay: 0.25,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 80%",
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
      <a
        href="#top"
        className="sf-squircle-sm sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[var(--sf-white)] focus:text-[var(--sf-red)] focus:px-4 focus:py-2 focus:font-optima focus:text-[15.5px] focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Sticky Golden Gate Vermilion Navbar (#CC3200) */}
      <header className="sf-red-focus sticky top-0 z-40 bg-[var(--sf-red)] border-b border-[var(--sf-white-hairline)] shadow-[0_4px_20px_rgba(158,37,0,0.14)]">
        <div className="mx-auto max-w-[1060px] px-5 sm:px-14 lg:px-20 h-[72px] sm:h-[78px] flex items-center justify-between gap-4 sm:gap-5">
          <a
            href="#top"
            translate="no"
            className="inline-flex items-center gap-2.5 sm:gap-3 text-[var(--sf-white)] no-underline whitespace-nowrap shrink-0 leading-none"
          >
            <BridgeMark className="h-6 w-8 sm:h-7 sm:w-9 text-[var(--sf-white)] shrink-0" />
            <span className="font-optima text-[17.5px] sm:text-[20.5px] font-medium tracking-[0.005em] leading-none">
              San Francisco Data
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-5 lg:gap-6 font-optima text-[17.5px] font-medium text-[var(--sf-white-muted)]"
          >
            <a
              href="#refinery"
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              How it works
            </a>
            <a
              href="#research"
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Research
            </a>
            <a
              href="#partners"
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Partners
            </a>
            <a
              href="#essay"
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Essay
            </a>
            <a
              href={SFDATA_LINKS.careers}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Careers
            </a>
          </nav>

          <a
            href={SFDATA_LINKS.xBrandon}
            target="_blank"
            rel="noreferrer"
            className="sf-pressable sf-squircle-sm inline-flex items-center gap-1.5 bg-[var(--sf-white)] text-[var(--sf-red)] px-3.5 py-2 sm:px-5 sm:py-2.5 font-optima text-[15.5px] sm:text-[17px] font-medium leading-none hover:bg-[var(--sf-red-tint)] whitespace-nowrap shrink-0"
          >
            <span>Partner with us</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2} />
          </a>
        </div>

        {/* Compact Mobile Section Nav Strip */}
        <nav
          aria-label="Mobile sections"
          className="md:hidden border-t border-[var(--sf-white-hairline)] px-5 py-2.5 flex items-center justify-between gap-4 overflow-x-auto font-optima text-[15.5px] font-medium text-[var(--sf-white-muted)]"
        >
          <a href="#refinery" className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap">
            How it works
          </a>
          <a href="#research" className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap">
            Research
          </a>
          <a href="#partners" className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap">
            Partners
          </a>
          <a href="#essay" className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap">
            Essay
          </a>
          <a
            href={SFDATA_LINKS.careers}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Careers
          </a>
        </nav>

        {/* Scroll-scrubbed reading progress hairline */}
        <div
          ref={scrollProgressRef}
          aria-hidden="true"
          className="h-[2px] w-full bg-[var(--sf-white)]/85 origin-left scale-x-0"
        />
      </header>

      <main id="top">
        {/* Centered Sculptural White Hero */}
        <section className="relative overflow-hidden bg-[var(--sf-white)]">
          <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20 pt-24 pb-24 lg:pt-36 lg:pb-32">
            <div className="mx-auto max-w-[820px] text-center">
              <h1 className="sf-hero-stagger font-optima text-[clamp(2.9rem,6vw,5.15rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[var(--sf-ink)] text-balance">
                The marketplace for{" "}
                <span className="text-[var(--sf-red)]">proprietary AI data.</span>
              </h1>

              <p className="sf-hero-stagger mx-auto mt-8 font-garamond text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.54] text-[var(--sf-ink-muted)] max-w-[52ch]">
                San Francisco Data turns production traces into RL environments. As models surpass
                human intelligence, we believe the best training data comes from where models fail
                on real work, not from tasks built to break them.
              </p>
            </div>
          </div>
        </section>

        {/* Centered Kinetic Traction Strip on Subtle Warm Paper */}
        <section className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)]">
          <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20">
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-x-8 gap-y-2 lg:gap-0 lg:grid-cols-4 lg:divide-x lg:divide-[var(--sf-hairline)]"
            >
              {KINETIC_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="sf-stat-item py-9 lg:py-11 lg:px-6 text-center flex flex-col items-center"
                >
                  <div
                    data-target={item.target}
                    data-prefix={item.prefix}
                    data-suffix={item.suffix}
                    className="font-optima text-[clamp(2.2rem,3.6vw,3.15rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--sf-red)] tabular-nums"
                  >
                    {item.prefix}
                    {item.target}
                    {item.suffix}
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

        {/* Interactive Visual Trace-to-RL Pipeline Diagram & Deep-Dive on Crisp White */}
        <TraceRefineryEngine />

        {/* Three Hard Research Problems: Hairline-Divided Architectural Columns */}
        <section
          id="research"
          ref={researchRef}
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20">
            <div className="mx-auto max-w-[700px] text-center">
              <h2 className="sf-research-reveal font-optima text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Three hard research problems define this work.
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0 border-t border-b border-[var(--sf-hairline)] lg:divide-x lg:divide-[var(--sf-hairline)]">
              {HARD_PROBLEMS.map((problem) => (
                <div
                  key={problem.title}
                  className="sf-research-reveal py-8 lg:py-10 lg:px-9 first:lg:pl-0 last:lg:pr-0 flex flex-col"
                >
                  <h3 className="font-optima text-[1.45rem] font-medium leading-[1.24] text-[var(--sf-red)] text-balance">
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
          ref={partnersRef}
          className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20">
            <div className="max-w-[700px]">
              <h2 className="sf-partners-heading font-optima text-[clamp(2rem,3.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Built for trace partners, frontier labs, and research engineers.
              </h2>
            </div>

            <div className="mt-14 divide-y divide-[var(--sf-hairline)] border-t border-b border-[var(--sf-hairline)]">
              {AUDIENCE_PATHS.map((row) => (
                <div
                  key={row.audience}
                  className="sf-audience-row grid grid-cols-1 gap-6 py-11 lg:grid-cols-12 lg:gap-10 items-start"
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
                      className="group inline-flex items-center gap-1.5 font-optima text-[16px] font-medium text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors whitespace-nowrap"
                    >
                      <span>{row.ctaLabel}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                        strokeWidth={1.75}
                      />
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
          ref={essayRef}
          className="bg-[var(--sf-paper)] border-t border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Left: Crisp White Essay Monograph */}
              <article className="sf-essay-card sf-squircle lg:col-span-7 bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-8 sm:p-11 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--sf-hairline)]">
                    <img
                      src="/logo-sfdata.jpg"
                      alt="San Francisco Data official mark"
                      width={40}
                      height={40}
                      loading="lazy"
                      className="sf-squircle-xs h-10 w-10 object-cover"
                    />
                    <span className="font-garamond text-[17.5px] text-[var(--sf-ink-muted)] tabular-nums">
                      October 1, 2026 · Brandon Guo &amp; Faiz Siddiqi
                    </span>
                  </div>

                  <h2 className="mt-8 font-optima text-[clamp(1.85rem,3vw,2.55rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                    Production traces and the future of data
                  </h2>

                  <blockquote className="sf-essay-quote mt-6 pl-5 border-l border-[var(--sf-red)] font-garamond italic text-[1.42rem] leading-[1.52] text-[var(--sf-ink)] max-w-[48ch]">
                    “The economy itself can become the largest source of training data for advanced
                    AI, building a continuous connection between AI deployed across the economy and
                    the training processes that determine what AI can do next.”
                  </blockquote>

                  <p className="mt-6 font-garamond text-[19.5px] leading-[1.64] text-[var(--sf-ink-muted)] max-w-[56ch]">
                    Our opening essay traces human data from drawing boxes around pedestrians to
                    writing legal briefs and financial models, explaining why contractor-generated
                    training data becomes a race to the bottom as models surpass human experts, and
                    why coding agents are the starting wedge for production traces.
                  </p>
                </div>

                <div className="mt-9 pt-6 border-t border-[var(--sf-hairline)]">
                  <a
                    href={SFDATA_LINKS.essay}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-optima text-[16.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
                  >
                    <span>Read the full essay on sfdata.com</span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                  </a>
                </div>
              </article>

              {/* Right: Team Pedigree & Hiring Panel */}
              <aside className="sf-team-card sf-squircle lg:col-span-5 bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-8 sm:p-11 flex flex-col justify-between">
                <div>
                  <h2 className="font-optima text-[clamp(1.65rem,2.4vw,2.15rem)] font-medium leading-[1.18] text-[var(--sf-ink)] text-balance">
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
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 list-none p-0 m-0" translate="no">
                      {TEAM_INSTITUTIONS.map((org) => (
                        <li
                          key={org}
                          className="sf-org-item font-optima text-[16.5px] font-medium text-[var(--sf-ink)]"
                        >
                          {org}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 pt-7 border-t border-[var(--sf-hairline)]">
                  <h3 className="font-optima text-[1.35rem] font-medium text-[var(--sf-ink)]">
                    Join us in San Francisco
                  </h3>
                  <p className="mt-2.5 font-garamond text-[18.5px] leading-[1.58] text-[var(--sf-ink-muted)]">
                    We’re hiring exceptional research engineering talent, in person 5 days a week
                    on Kearny Street.
                  </p>
                  <a
                    href={SFDATA_LINKS.careers}
                    target="_blank"
                    rel="noreferrer"
                    className="sf-pressable sf-squircle-sm mt-6 inline-flex items-center gap-2 bg-[var(--sf-red)] text-[var(--sf-white)] px-6 py-3.5 font-optima text-[16px] font-medium hover:bg-[var(--sf-red-hover)]"
                  >
                    <span>View all open roles on Ashby</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* Bookend Golden Gate Vermilion Footer */}
      <footer className="sf-red-focus bg-[var(--sf-red)] text-[var(--sf-white-muted)]">
        <div className="mx-auto max-w-[1060px] px-6 sm:px-14 lg:px-20 py-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 font-garamond text-[17.5px]">
            <BridgeMark className="h-5 w-7 text-[var(--sf-white)] shrink-0" />
            <StreetcarIcon className="h-4 w-6 text-[var(--sf-white)] shrink-0" />
            <span className="text-[var(--sf-white)]">
              Kearny Street, Financial District · San Francisco
            </span>
            <span aria-hidden="true">·</span>
            <span translate="no">© 2026 San Francisco Data</span>
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
