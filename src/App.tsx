import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import {
  AUDIENCE_PATHS,
  BACKER_LOGOS,
  FOUNDERS,
  HARD_PROBLEMS,
  PEDIGREE_LOGOS,
  SFDATA_LINKS,
} from "./data/sfdata";
import { BridgeMark } from "./components/BridgeMark";
import { TraceRefineryEngine } from "./components/TraceRefineryEngine";
import { StreetcarIcon } from "./components/StreetcarIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLElement | null>(null);
  const partnersRef = useRef<HTMLElement | null>(null);
  const essayRef = useRef<HTMLElement | null>(null);
  const foundersRef = useRef<HTMLElement | null>(null);

  const handleSmoothAnchor = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    e.preventDefault();
    gsap.to(window, {
      duration: 1.15,
      scrollTo: { y: targetId, offsetY: 84 },
      ease: "power3.inOut",
    });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Slow, smooth scrubbed top reading progress hairline
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
                scrub: 0.9,
              },
            },
          );
        }

        // 2. Hero entrance timeline
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.from(".sf-hero-stagger", {
          y: 28,
          opacity: 0,
          duration: 1.0,
          stagger: 0.12,
          clearProps: "transform,opacity",
        });

        // 3. Research section: slow scroll-scrubbed drift + editorial reveals
        if (researchRef.current) {
          gsap.from(researchRef.current.querySelector(".sf-research-heading"), {
            y: 30,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: researchRef.current,
              start: "top 84%",
              once: true,
            },
          });

          gsap.utils
            .toArray<HTMLElement>(researchRef.current.querySelectorAll(".sf-research-item"))
            .forEach((item) => {
              gsap.from(item, {
                y: 34,
                opacity: 0,
                duration: 0.95,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: item,
                  start: "top 88%",
                  once: true,
                },
              });
            });
        }

        // 4. Partners ledger: smooth staggered row reveal
        if (partnersRef.current) {
          gsap.from(partnersRef.current.querySelector(".sf-partners-heading"), {
            y: 26,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
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
                y: 30,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: row,
                  start: "top 88%",
                  once: true,
                },
              });
            });
        }

        // 5. October 1 Essay feature: slow scroll-linked lift + quote slide
        if (essayRef.current) {
          gsap.from(essayRef.current.querySelector(".sf-essay-card"), {
            y: 34,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 84%",
              once: true,
            },
          });

          gsap.from(essayRef.current.querySelector(".sf-essay-quote"), {
            x: -18,
            opacity: 0,
            duration: 0.95,
            delay: 0.15,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: essayRef.current,
              start: "top 84%",
              once: true,
            },
          });
        }

        // 6. Founders showcase: opposing smooth entrance
        if (foundersRef.current) {
          gsap.from(foundersRef.current.querySelectorAll(".sf-founder-card"), {
            y: 34,
            opacity: 0,
            duration: 0.95,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: foundersRef.current,
              start: "top 84%",
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

      {/* Sticky Golden Gate Vermilion Navbar (#CC3200) — Masthead width */}
      <header className="sf-red-focus sticky top-0 z-40 bg-[var(--sf-red)] border-b border-[var(--sf-white-hairline)] shadow-[0_4px_20px_rgba(158,37,0,0.14)]">
        <div className="mx-auto max-w-[1060px] px-5 sm:px-14 lg:px-20 h-[72px] sm:h-[78px] flex items-center justify-between gap-4 sm:gap-5">
          <a
            href="#top"
            translate="no"
            onClick={(e) => handleSmoothAnchor(e, "#top")}
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
              onClick={(e) => handleSmoothAnchor(e, "#refinery")}
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              How it works
            </a>
            <a
              href="#research"
              onClick={(e) => handleSmoothAnchor(e, "#research")}
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Research
            </a>
            <a
              href="#partners"
              onClick={(e) => handleSmoothAnchor(e, "#partners")}
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Partners
            </a>
            <a
              href="#essay"
              onClick={(e) => handleSmoothAnchor(e, "#essay")}
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Essay
            </a>
            <a
              href="#founders"
              onClick={(e) => handleSmoothAnchor(e, "#founders")}
              className="inline-flex items-center leading-none whitespace-nowrap hover:text-[var(--sf-white)] transition-colors"
            >
              Founders
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
          <a
            href="#refinery"
            onClick={(e) => handleSmoothAnchor(e, "#refinery")}
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            How it works
          </a>
          <a
            href="#research"
            onClick={(e) => handleSmoothAnchor(e, "#research")}
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Research
          </a>
          <a
            href="#partners"
            onClick={(e) => handleSmoothAnchor(e, "#partners")}
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Partners
          </a>
          <a
            href="#essay"
            onClick={(e) => handleSmoothAnchor(e, "#essay")}
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Essay
          </a>
          <a
            href="#founders"
            onClick={(e) => handleSmoothAnchor(e, "#founders")}
            className="inline-flex items-center leading-none hover:text-[var(--sf-white)] whitespace-nowrap"
          >
            Founders
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
        {/* Centered Sculptural White Hero with a16z speedrun & Khosla Ventures logos above H1 */}
        <section className="relative overflow-hidden bg-[var(--sf-white)]">
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16 pt-20 pb-20 lg:pt-28 lg:pb-28">
            <div className="mx-auto max-w-[760px] text-center">
              {/* Backers Lockup: a16z speedrun + Khosla Ventures */}
              <div
                aria-label="Backed by a16z speedrun and Khosla Ventures"
                className="sf-hero-stagger mb-9 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
              >
                {BACKER_LOGOS.map((logo, idx) => (
                  <div key={logo.name} className="inline-flex items-center gap-6 sm:gap-8">
                    <span
                      role="img"
                      aria-label={logo.name}
                      className="sf-logo-tint inline-block opacity-90"
                      style={{
                        width: `${logo.widthPx}px`,
                        height: `${logo.heightPx}px`,
                        maskImage: `url(${logo.src})`,
                        WebkitMaskImage: `url(${logo.src})`,
                      }}
                    />
                    {idx === 0 && (
                      <span
                        aria-hidden="true"
                        className="h-5 w-[1px] bg-[var(--sf-hairline-strong)]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <h1 className="sf-hero-stagger font-optima text-[clamp(2.65rem,5.4vw,4.65rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[var(--sf-ink)] text-balance">
                The marketplace for{" "}
                <span className="text-[var(--sf-red)]">proprietary AI data.</span>
              </h1>

              <p className="sf-hero-stagger mx-auto mt-7 font-garamond text-[clamp(1.25rem,2vw,1.58rem)] leading-[1.55] text-[var(--sf-ink-muted)] max-w-[50ch]">
                San Francisco Data turns production traces into RL environments. As models surpass
                human intelligence, we believe the best training data comes from where models fail
                on real work, not from tasks built to break them.
              </p>
            </div>
          </div>
        </section>

        {/* Infinite Red-Tinted Institution Logo Rail (replaces numbers bar) */}
        <section
          aria-label="Team research and engineering institutions"
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-7 overflow-hidden"
        >
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16">
            <div className="sf-marquee-viewport overflow-hidden">
              <div className="sf-marquee-track items-center gap-12 sm:gap-16">
                {[0, 1].map((dup) => (
                  <div
                    key={dup}
                    aria-hidden={dup === 1}
                    className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0"
                  >
                    {PEDIGREE_LOGOS.map((logo) => (
                      <div
                        key={`${dup}-${logo.name}`}
                        className="flex items-center justify-center shrink-0 h-10"
                      >
                        <span
                          role={dup === 0 ? "img" : undefined}
                          aria-label={dup === 0 ? logo.name : undefined}
                          className="sf-logo-tint block opacity-85 hover:opacity-100 transition-opacity"
                          style={{
                            width: `${logo.widthPx}px`,
                            height: `${logo.heightPx}px`,
                            maskImage: `url(${logo.src})`,
                            WebkitMaskImage: `url(${logo.src})`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Progression Diagram + 4-Stage Trace-to-RL Refinery */}
        <TraceRefineryEngine />

        {/* Three Hard Research Problems: Asymmetric Sticky-Title Editorial Split */}
        <section
          id="research"
          ref={researchRef}
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
              <div className="sf-research-heading lg:col-span-5 lg:sticky lg:top-28">
                <h2 className="font-optima text-[clamp(1.9rem,3.3vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                  Three hard research problems define this work.
                </h2>
                <p className="mt-4 font-garamond text-[18.5px] leading-[1.6] text-[var(--sf-ink-muted)]">
                  Turning live agent failures into reliable RL signal requires solving signal
                  selection, faithful environment reconstruction, and verifier integrity together.
                </p>
                <div className="mt-6 h-[2px] w-14 bg-[var(--sf-red)]" aria-hidden="true" />
              </div>

              <div className="lg:col-span-7 divide-y divide-[var(--sf-hairline)] border-t border-b border-[var(--sf-hairline)]">
                {HARD_PROBLEMS.map((problem) => (
                  <div key={problem.title} className="sf-research-item py-8 first:pt-7 last:pb-7">
                    <h3 className="font-optima text-[1.35rem] font-medium leading-[1.25] text-[var(--sf-red)]">
                      {problem.title}
                    </h3>
                    <p className="mt-3 font-garamond text-[19px] leading-[1.64] text-[var(--sf-ink-muted)]">
                      {problem.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Three-Audience Architecture on Crisp White */}
        <section
          id="partners"
          ref={partnersRef}
          className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16">
            <div className="max-w-[660px]">
              <h2 className="sf-partners-heading font-optima text-[clamp(1.9rem,3.3vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Built for trace partners, frontier labs, and research engineers.
              </h2>
            </div>

            <div className="mt-12 divide-y divide-[var(--sf-hairline)] border-t border-b border-[var(--sf-hairline)]">
              {AUDIENCE_PATHS.map((row) => (
                <div
                  key={row.audience}
                  className="sf-audience-row grid grid-cols-1 gap-5 py-10 lg:grid-cols-12 lg:gap-8 items-start"
                >
                  <div className="lg:col-span-3">
                    <h3 className="font-optima text-[1.3rem] font-medium leading-[1.25] text-[var(--sf-red)]">
                      {row.audience}
                    </h3>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="font-optima text-[1.18rem] font-medium leading-[1.35] text-[var(--sf-ink)]">
                      {row.heading}
                    </p>
                    <p className="mt-2.5 font-garamond text-[18.5px] leading-[1.62] text-[var(--sf-ink-muted)]">
                      {row.body}
                    </p>
                  </div>
                  <div className="lg:col-span-3 lg:flex lg:justify-end lg:pt-1">
                    <a
                      href={row.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 font-optima text-[15.5px] font-medium text-[var(--sf-ink)] hover:text-[var(--sf-red)] underline decoration-[var(--sf-hairline-strong)] hover:decoration-[var(--sf-red)] transition-colors whitespace-nowrap"
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

        {/* Standalone October 1 Essay Monograph Feature */}
        <section
          id="essay"
          ref={essayRef}
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16">
            <article className="sf-essay-card sf-squircle bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-8 sm:p-11 lg:p-14">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--sf-hairline)]">
                <img
                  src="/logo-sfdata.jpg"
                  alt="San Francisco Data official mark"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="sf-squircle-xs h-10 w-10 object-cover"
                />
                <span className="font-garamond text-[17px] text-[var(--sf-ink-muted)] tabular-nums">
                  October 1, 2026 · Brandon Guo &amp; Faiz Siddiqi
                </span>
              </div>

              <h2 className="mt-8 font-optima text-[clamp(1.8rem,3vw,2.55rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Production traces and the future of data
              </h2>

              <blockquote className="sf-essay-quote mt-6 pl-5 border-l border-[var(--sf-red)] font-garamond italic text-[1.38rem] leading-[1.54] text-[var(--sf-ink)] max-w-[54ch]">
                “The economy itself can become the largest source of training data for advanced AI,
                building a continuous connection between AI deployed across the economy and the
                training processes that determine what AI can do next.”
              </blockquote>

              <p className="mt-6 font-garamond text-[19px] leading-[1.64] text-[var(--sf-ink-muted)] max-w-[60ch]">
                Our opening essay traces human data from drawing boxes around pedestrians to
                writing legal briefs and financial models, explaining why contractor-generated
                training data becomes a race to the bottom as models surpass human experts, and why
                coding agents are the starting wedge for production traces.
              </p>

              <div className="mt-8 pt-6 border-t border-[var(--sf-hairline)]">
                <a
                  href={SFDATA_LINKS.essay}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 font-optima text-[16px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
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
          </div>
        </section>

        {/* Dedicated Founders Section with Portraits & Verified Links */}
        <section
          id="founders"
          ref={foundersRef}
          className="bg-[var(--sf-white)] text-[var(--sf-ink)] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className="font-optima text-[clamp(1.9rem,3.2vw,2.65rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                Founded in San Francisco.
              </h2>
              <p className="mt-3.5 font-garamond text-[19px] leading-[1.6] text-[var(--sf-ink-muted)]">
                Backed by a $30M seed round led by Khosla Ventures and a16z speedrun.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {FOUNDERS.map((founder) => (
                <article
                  key={founder.name}
                  className="sf-founder-card sf-squircle border border-[var(--sf-hairline)] bg-[var(--sf-paper)] p-7 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-5">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        width={84}
                        height={84}
                        loading="lazy"
                        className="sf-squircle-sm h-[84px] w-[84px] object-cover shrink-0 border border-[var(--sf-hairline)]"
                      />
                      <div>
                        <h3 className="font-optima text-[1.35rem] font-medium leading-[1.2] text-[var(--sf-ink)]">
                          {founder.name}
                        </h3>
                        <p className="mt-1 font-optima text-[15px] font-medium text-[var(--sf-red)]">
                          {founder.role}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 font-garamond text-[18.5px] leading-[1.6] text-[var(--sf-ink-muted)]">
                      {founder.bio}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[var(--sf-hairline)] flex items-center gap-6 font-optima text-[15px] font-medium">
                    <a
                      href={founder.xHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--sf-ink)] hover:text-[var(--sf-red)] transition-colors"
                    >
                      <span>X</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
                    </a>
                    <a
                      href={founder.linkedinHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--sf-ink)] hover:text-[var(--sf-red)] transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bookend Golden Gate Vermilion Footer — Pedigree + Hiring + Links */}
      <footer className="sf-red-focus bg-[var(--sf-red)] text-[var(--sf-white)]">
        <div className="mx-auto max-w-[920px] px-6 sm:px-12 lg:px-16 pt-16 pb-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 pb-12 border-b border-[var(--sf-white-hairline)] items-start">
            <div className="md:col-span-6">
              <h2 className="font-optima text-[1.6rem] font-medium leading-[1.2] text-[var(--sf-white)]">
                Team &amp; research pedigree
              </h2>
              <p className="mt-3.5 font-garamond text-[18.5px] leading-[1.6] text-[var(--sf-white-muted)] max-w-[44ch]">
                We are a small, in-person research engineering team in San Francisco’s Financial
                District, backed by a $30M seed round led by Khosla Ventures, building environments
                and evaluations for 20+ frontier labs.
              </p>
            </div>

            <div className="md:col-span-6 md:pl-6">
              <h2 className="font-optima text-[1.6rem] font-medium leading-[1.2] text-[var(--sf-white)]">
                Join us in San Francisco
              </h2>
              <p className="mt-3.5 font-garamond text-[18.5px] leading-[1.6] text-[var(--sf-white-muted)]">
                We’re hiring exceptional research engineering talent, in person 5 days a week on
                Kearny Street.
              </p>
              <a
                href={SFDATA_LINKS.careers}
                target="_blank"
                rel="noreferrer"
                className="sf-pressable sf-squircle-sm mt-6 inline-flex items-center gap-2 bg-[var(--sf-white)] text-[var(--sf-red)] px-5 py-3 font-optima text-[15.5px] font-medium leading-none hover:bg-[var(--sf-red-tint)]"
              >
                <span>View open roles on Ashby</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between text-[var(--sf-white-muted)]">
            <div className="flex flex-wrap items-center gap-3 font-garamond text-[17px]">
              <BridgeMark className="h-5 w-7 text-[var(--sf-white)] shrink-0" />
              <StreetcarIcon className="h-4 w-6 text-[var(--sf-white)] shrink-0" />
              <span className="text-[var(--sf-white)]">
                Kearny Street, Financial District · San Francisco
              </span>
              <span aria-hidden="true">·</span>
              <span translate="no">© 2026 San Francisco Data</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-optima text-[15px]">
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
        </div>
      </footer>
    </div>
  );
}
