import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { ArrowUpRight } from "lucide-react";
import {
  AUDIENCE_PATHS,
  BACKER_LOGOS,
  FOUNDERS,
  HARD_PROBLEMS,
  PEDIGREE_COL_1,
  PEDIGREE_COL_2,
  SFDATA_LINKS,
} from "./data/sfdata";
import { BridgeMark } from "./components/BridgeMark";
import { TraceRefineryEngine } from "./components/TraceRefineryEngine";
import { StreetcarIcon } from "./components/StreetcarIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const COL_1_HALF = [...PEDIGREE_COL_1, ...PEDIGREE_COL_1];
const COL_2_HALF = [...PEDIGREE_COL_2, ...PEDIGREE_COL_2];

const NAV_LINKS = [
  { id: "refinery", label: "How it works" },
  { id: "research", label: "Research" },
  { id: "essay", label: "Essay" },
  { id: "founders", label: "Founders" },
  { id: "partners", label: "Partners" },
] as const;

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLElement | null>(null);
  const editorialSpreadRef = useRef<HTMLElement | null>(null);
  const partnersRef = useRef<HTMLElement | null>(null);
  const [activeNav, setActiveNav] = useState<string>("");
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [motionOk, setMotionOk] = useState(true);

  // Slow, high-inertia Lenis smooth scrolling synced directly with GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: 0.65,
      touchMultiplier: 0.85,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.id);
    let last = "";
    const update = () => {
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 96;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= header + 40) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = ids[ids.length - 1];
      if (current !== last) {
        last = current;
        setActiveNav(current);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleSmoothAnchor = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, { duration: 1.65 });
      return;
    }
    gsap.to(window, {
      duration: 1.35,
      scrollTo: { y: targetId, offsetY: 96 },
      ease: "power3.inOut",
    });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Slow, smooth scrubbed reading progress bar synced with Lenis
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
                scrub: 0.6,
              },
            },
          );
        }

        // 2. Hero staggered entrance
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .from(".sf-hero-stagger", {
            y: 28,
            opacity: 0,
            duration: 1.05,
            stagger: 0.12,
            clearProps: "transform,opacity",
          })
          .from(
            ".sf-hero-rail",
            {
              y: 22,
              opacity: 0,
              duration: 1.1,
              clearProps: "transform,opacity",
            },
            "-=0.72",
          );

        // 3. Research section: masked headline reveal + staggered cards
        if (researchRef.current) {
          gsap.from(researchRef.current.querySelector(".sf-research-heading"), {
            clipPath: "inset(0 0 100% 0)",
            y: 24,
            opacity: 0,
            duration: 1.05,
            ease: "power3.out",
            clearProps: "transform,opacity,clipPath",
            scrollTrigger: {
              trigger: researchRef.current,
              start: "top 84%",
              once: true,
            },
          });

          gsap.from(researchRef.current.querySelectorAll(".sf-research-card"), {
            y: 30,
            opacity: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: researchRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }

        // 4. Combined Essay + Founders spread: opposing horizontal reveals
        if (editorialSpreadRef.current) {
          gsap.from(editorialSpreadRef.current.querySelector(".sf-essay-card"), {
            x: -24,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: editorialSpreadRef.current,
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(editorialSpreadRef.current.querySelectorAll(".sf-founder-row"), {
            x: 24,
            opacity: 0,
            duration: 1.0,
            stagger: 0.16,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: editorialSpreadRef.current,
              start: "top 82%",
              once: true,
            },
          });
        }

        // 5. Audience triptych: masked heading + staggered columns
        if (partnersRef.current) {
          gsap.from(partnersRef.current.querySelector(".sf-partners-heading"), {
            clipPath: "inset(0 0 100% 0)",
            y: 22,
            opacity: 0,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "transform,opacity,clipPath",
            scrollTrigger: {
              trigger: partnersRef.current,
              start: "top 84%",
              once: true,
            },
          });

          gsap.from(partnersRef.current.querySelectorAll(".sf-triptych-col"), {
            y: 28,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: partnersRef.current,
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
        className="sf-squircle-sm sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[var(--sf-white)] focus:text-[var(--sf-red)] focus:px-4 focus:py-2 focus:font-optima focus:text-[16px] focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Sticky Golden Gate Vermilion Navbar (#CC3200) */}
      <header className="sf-red-focus sticky top-0 z-40 bg-[var(--sf-red)] border-b border-[var(--sf-white-hairline)] shadow-[0_4px_20px_rgba(158,37,0,0.14)]">
        <div className="mx-auto max-w-[1680px] ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-8 h-[64px] sm:h-[82px] flex items-center justify-between gap-3 sm:gap-6">
          <a
            href="#top"
            translate="no"
            onClick={(e) => handleSmoothAnchor(e, "#top")}
            className="inline-flex items-center gap-2 sm:gap-3 text-[var(--sf-white)] no-underline whitespace-nowrap shrink-0 leading-none"
          >
            <BridgeMark className="h-5 w-7 sm:h-8 sm:w-10 text-[var(--sf-white)] shrink-0" />
            <span className="font-optima text-[16px] min-[360px]:text-[17.5px] sm:text-[24px] font-medium tracking-[0.005em] leading-none">
              San Francisco Data
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden xl:flex items-center gap-8 font-optima text-[20px] font-medium text-[var(--sf-white-muted)]"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={activeNav === link.id ? "true" : undefined}
                onClick={(e) => handleSmoothAnchor(e, `#${link.id}`)}
                className={`inline-flex items-center min-h-11 leading-none whitespace-nowrap border-b-2 pb-0.5 transition-colors hover:text-[var(--sf-white)] ${
                  activeNav === link.id
                    ? "border-[var(--sf-white)] text-[var(--sf-white)]"
                    : "border-transparent"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={SFDATA_LINKS.xBrandon}
            target="_blank"
            rel="noreferrer"
            className="sf-pressable sf-squircle-sm inline-flex items-center gap-1 sm:gap-1.5 min-h-11 bg-[var(--sf-white)] text-[var(--sf-red)] px-3 py-2 sm:px-5 sm:py-3 font-optima text-[14.5px] sm:text-[19.5px] font-medium leading-none hover:bg-[var(--sf-red-tint)] whitespace-nowrap shrink-0"
          >
            <span className="max-[359px]:hidden">Partner with us</span>
            <span className="hidden max-[359px]:inline">Partner</span>
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 shrink-0" aria-hidden="true" strokeWidth={2} />
          </a>
        </div>

        {/* Compact Mobile Section Nav Strip */}
        <nav
          aria-label="Mobile sections"
          className="sf-mobile-nav xl:hidden border-t border-[var(--sf-white-hairline)] px-2 flex items-stretch gap-1 overflow-x-auto font-optima text-[16px] font-medium text-[var(--sf-white-muted)]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeNav === link.id ? "true" : undefined}
              onClick={(e) => handleSmoothAnchor(e, `#${link.id}`)}
              className={`inline-flex items-center min-h-11 px-2.5 leading-none border-b-2 hover:text-[var(--sf-white)] whitespace-nowrap ${
                activeNav === link.id
                  ? "border-[var(--sf-white)] text-[var(--sf-white)]"
                  : "border-transparent"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Scroll-scrubbed reading progress */}
        <div aria-hidden="true" className="relative h-[2px] w-full bg-[var(--sf-white)]/25">
          <div
            ref={scrollProgressRef}
            className="absolute inset-0 bg-[var(--sf-white)]/90 origin-left scale-x-0"
          />
        </div>
      </header>

      <main id="top">
        {/* Asymmetric Wide Hero: Left Manifesto + Right Seamless Infinite Vertical Logo Columns */}
        <section className="relative overflow-hidden bg-[var(--sf-white)]">
          <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8 pt-9 pb-14 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
            <div className="grid grid-cols-1 gap-9 sm:gap-10 lg:grid-cols-12 lg:gap-10 items-center">
              {/* Left Column: Backed by (tight gap directly over divider line) + Glowing Headline + Lead */}
              <div className="lg:col-span-7 pt-1 sm:pt-4 lg:pt-8">
                <div className="sf-hero-stagger flex justify-center sm:justify-start">
                  <div
                    aria-label="Backed by a16z speedrun and Khosla Ventures"
                    className="inline-flex max-w-full flex-col items-center gap-3 sm:items-start"
                  >
                    <div className="whitespace-nowrap font-optima text-[16px] sm:text-[18px] font-medium text-[var(--sf-ink-muted)]">
                      Backed by:
                    </div>
                    <div className="inline-grid grid-cols-[auto_1px_auto] items-center gap-x-5 sm:gap-x-9">
                    <span
                      role="img"
                      aria-label={BACKER_LOGOS[0].name}
                      className="sf-logo-tint col-start-1 justify-self-end inline-block max-w-[122px] sm:max-w-none"
                      style={{
                        width: `${BACKER_LOGOS[0].widthPx}px`,
                        height: `${BACKER_LOGOS[0].heightPx}px`,
                        maskImage: `url(${BACKER_LOGOS[0].src})`,
                        WebkitMaskImage: `url(${BACKER_LOGOS[0].src})`,
                      }}
                    />

                    <span
                      aria-hidden="true"
                      className="col-start-2 h-7 sm:h-8 w-[1px] bg-[var(--sf-hairline-strong)]"
                    />

                    <span
                      role="img"
                      aria-label={BACKER_LOGOS[1].name}
                      className="sf-logo-tint col-start-3 justify-self-start inline-block max-w-[100px] sm:max-w-none"
                      style={{
                        width: `${BACKER_LOGOS[1].widthPx}px`,
                        height: `${BACKER_LOGOS[1].heightPx}px`,
                        maskImage: `url(${BACKER_LOGOS[1].src})`,
                        WebkitMaskImage: `url(${BACKER_LOGOS[1].src})`,
                      }}
                    />
                    </div>
                  </div>
                </div>

                <h1 className="sf-hero-stagger mt-7 sm:mt-10 font-optima text-[clamp(2.35rem,8.4vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-[var(--sf-ink)] text-balance text-center sm:text-left">
                  The marketplace for{" "}
                  <span className="sf-glow-text">proprietary AI data</span>
                </h1>

                <p className="sf-hero-stagger mt-5 sm:mt-7 font-garamond text-[19.5px] sm:text-[clamp(1.42rem,2vw,1.76rem)] leading-[1.52] text-[var(--sf-ink-muted)] max-w-[56ch] text-center sm:text-left mx-auto sm:mx-0">
                  San Francisco Data turns real production traces from deployed AI agents into
                  reinforcement learning environments. As models surpass human intelligence, the
                  strongest training signal comes from where agents fail on real economic work, not
                  from synthetic prompts built to trick them.
                </p>
              </div>

              {/* Right Column: "Built by people from:" + Shorter Seamless Infinite Counter-Scrolling Logo Columns */}
              <div
                aria-label="Research and engineering institutions represented by our team"
                className={`sf-hero-rail lg:col-span-5 ${marqueePaused ? "is-paused" : ""}`}
              >
                <div className="relative mb-2.5 sm:mb-3 text-center font-optima text-[16.5px] sm:text-[18px] font-medium text-[var(--sf-ink-muted)]">
                  <div>Built by people from:</div>
                  {motionOk && (
                    <button
                      type="button"
                      aria-pressed={marqueePaused}
                      onClick={() => setMarqueePaused((paused) => !paused)}
                      className="sf-pressable absolute right-0 top-1/2 inline-flex min-h-11 -translate-y-1/2 items-center px-2 font-optima text-[16px] font-medium text-[var(--sf-ink-muted)] hover:text-[var(--sf-red)]"
                    >
                      {marqueePaused ? "Play" : "Pause"}
                    </button>
                  )}
                </div>
                <div className="sf-squircle border border-[var(--sf-hairline)] bg-[var(--sf-paper)] px-3 sm:px-7 py-2.5 sm:py-3">
                  <div className="sf-vmarquee-viewport h-[240px] sm:h-[330px] lg:h-[360px] overflow-hidden grid grid-cols-2 gap-3 sm:gap-7">
                    {/* Column 1: seamlessly infinite upward scroll */}
                    <div className="overflow-hidden">
                      <div className="sf-vmarquee-up">
                        {[0, 1].map((half) => (
                          <div
                            key={`col1-${half}`}
                            aria-hidden={half === 1}
                            className="flex flex-col items-center shrink-0"
                          >
                            {COL_1_HALF.map((logo, idx) => (
                              <div
                                key={`c1-${half}-${idx}-${logo.name}`}
                                className="flex items-center justify-center h-[64px] sm:h-[80px] pb-3 sm:pb-4 px-1.5 w-full shrink-0"
                              >
                                <span
                                  role={half === 0 && idx < PEDIGREE_COL_1.length ? "img" : undefined}
                                  aria-label={
                                    half === 0 && idx < PEDIGREE_COL_1.length
                                      ? logo.name
                                      : undefined
                                  }
                                  className="sf-logo-tint block max-w-full max-h-full opacity-90"
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

                    {/* Column 2: seamlessly infinite downward scroll */}
                    <div className="overflow-hidden border-l border-[var(--sf-hairline)] pl-3 sm:pl-7">
                      <div className="sf-vmarquee-down">
                        {[0, 1].map((half) => (
                          <div
                            key={`col2-${half}`}
                            aria-hidden={half === 1}
                            className="flex flex-col items-center shrink-0"
                          >
                            {COL_2_HALF.map((logo, idx) => (
                              <div
                                key={`c2-${half}-${idx}-${logo.name}`}
                                className="flex items-center justify-center h-[64px] sm:h-[80px] pb-3 sm:pb-4 px-1.5 w-full shrink-0"
                              >
                                <span
                                  role={half === 0 && idx < PEDIGREE_COL_2.length ? "img" : undefined}
                                  aria-label={
                                    half === 0 && idx < PEDIGREE_COL_2.length
                                      ? logo.name
                                      : undefined
                                  }
                                  className="sf-logo-tint block max-w-full max-h-full opacity-90"
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Interactive Trace-to-RL Refinery */}
        <TraceRefineryEngine />

        {/* Three Hard Research Problems — Wide Asymmetric Editorial Grid */}
        <section
          id="research"
          ref={researchRef}
          className="bg-[var(--sf-paper)] border-t border-b border-[var(--sf-hairline)] py-14 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-10 items-start">
              <div className="sf-research-heading lg:col-span-4">
                <h2 className="font-optima text-[clamp(1.85rem,3.4vw,3.05rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                  Three hard research problems define this work
                </h2>
                <p className="mt-3.5 sm:mt-4 font-garamond text-[19.5px] sm:text-[21px] leading-[1.56] text-[var(--sf-ink-muted)]">
                  Raw agent logs only become frontier RL signal once filtering, faithful world
                  reconstruction, and verifier rigor are solved together.
                </p>
                <div className="mt-5 sm:mt-6 h-[2px] w-14 bg-[var(--sf-red)]" aria-hidden="true" />
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                {HARD_PROBLEMS.map((problem) => (
                  <div
                    key={problem.title}
                    className="sf-research-card sf-squircle bg-[var(--sf-white)] border border-[var(--sf-hairline)] p-6 sm:p-7 flex flex-col"
                  >
                    <h3 className="font-optima text-[1.35rem] sm:text-[1.48rem] font-medium leading-[1.22] text-[var(--sf-red)]">
                      {problem.title}
                    </h3>
                    <p className="mt-3 sm:mt-4 font-garamond text-[19px] sm:text-[20.5px] leading-[1.56] text-[var(--sf-ink-muted)]">
                      {problem.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Combined Side-by-Side Spread: Essay (Left) + Alternating Founders (Right) — Above Partners */}
        <section
          id="essay"
          ref={editorialSpreadRef}
          className="overflow-x-clip bg-[var(--sf-white)] py-14 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-8 items-stretch">
              {/* Left: Compact Essay Card (Flush with top of Brandon & bottom of Faiz, upright quote) */}
              <article className="sf-essay-card sf-squircle lg:col-span-5 h-full bg-[var(--sf-paper)] border border-[var(--sf-hairline)] p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <h2 className="font-optima text-[clamp(1.7rem,2.7vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--sf-ink)] text-balance">
                    Production traces and{" "}
                    <span className="text-[var(--sf-red)]">the future of data</span>
                  </h2>

                  <blockquote className="mt-5 sm:mt-7 pl-4 sm:pl-5 border-l-2 border-[var(--sf-red)] font-garamond text-[1.28rem] sm:text-[1.48rem] leading-[1.52] text-[var(--sf-ink)]">
                    “The economy itself can become the largest source of training data for advanced
                    AI, building a continuous connection between AI deployed across the economy and
                    the training processes that determine what AI can do next.”
                  </blockquote>

                  <p className="mt-5 sm:mt-6 font-garamond text-[19px] sm:text-[21px] leading-[1.56] text-[var(--sf-ink-muted)]">
                    Our thesis explains why contractor-generated training tasks hit a ceiling as
                    models surpass human experts, and why coding agents are the starting wedge for
                    turning live production failures into RL environments.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[var(--sf-hairline)]">
                  <a
                    href={SFDATA_LINKS.essay}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-optima text-[17.5px] sm:text-[18.5px] font-medium text-[var(--sf-red)] hover:text-[var(--sf-red-hover)] underline transition-colors"
                  >
                    <span>Read the full essay on sfdata.com</span>
                    <ArrowUpRight
                      className="h-4.5 w-4.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                  </a>
                </div>
              </article>

              {/* Right: Alternating Founders Showcase (Natural stack on mobile, flush grid-rows-2 on desktop) */}
              <div id="founders" className="lg:col-span-7 flex flex-col gap-5 lg:h-full lg:grid lg:grid-rows-2 lg:gap-6">
                {FOUNDERS.map((founder, idx) => {
                  const isReversed = idx % 2 === 1;
                  return (
                    <article
                      key={founder.name}
                      className="sf-founder-row sf-squircle lg:h-full bg-[var(--sf-paper)] border border-[var(--sf-hairline)] p-5 sm:p-6 flex items-center"
                    >
                      <div
                        className={`w-full flex flex-col sm:flex-row gap-5 sm:gap-7 items-center ${
                          isReversed ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        <img
                          src={founder.image}
                          alt={founder.name}
                          width={232}
                          height={232}
                          loading="lazy"
                          className="sf-squircle-sm h-[168px] w-[168px] sm:h-[232px] sm:w-[232px] object-cover shrink-0 border border-[var(--sf-hairline)]"
                        />

                        <div className="flex-1 min-w-0 w-full">
                          <div
                            className={`flex flex-wrap items-center justify-center gap-3 ${
                              isReversed
                                ? "sm:flex-row-reverse sm:justify-start"
                                : "sm:justify-start"
                            }`}
                          >
                            <h3 className="font-optima text-[1.5rem] sm:text-[1.6rem] font-medium leading-[1.15] text-[var(--sf-ink)]">
                              {founder.name}
                            </h3>

                            <div className="inline-flex items-center gap-2">
                              <a
                                href={founder.xHref}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${founder.name} on X`}
                                className="sf-pressable sf-squircle-xs h-11 w-11 p-2.5 border border-[var(--sf-hairline)] hover:border-[var(--sf-red-border)] bg-[var(--sf-white)] inline-flex items-center justify-center"
                              >
                                <span
                                  aria-hidden="true"
                                  className="sf-logo-tint block h-full w-full"
                                  style={{
                                    maskImage: "url(/logos/x.png)",
                                    WebkitMaskImage: "url(/logos/x.png)",
                                  }}
                                />
                              </a>
                              <a
                                href={founder.linkedinHref}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${founder.name} on LinkedIn`}
                                className="sf-pressable sf-squircle-xs h-11 w-11 p-2.5 border border-[var(--sf-hairline)] hover:border-[var(--sf-red-border)] bg-[var(--sf-white)] inline-flex items-center justify-center"
                              >
                                <span
                                  aria-hidden="true"
                                  className="sf-logo-tint block h-full w-full"
                                  style={{
                                    maskImage: "url(/logos/linkedin.png)",
                                    WebkitMaskImage: "url(/logos/linkedin.png)",
                                  }}
                                />
                              </a>
                            </div>
                          </div>

                          <p
                            className={`mt-1 font-optima text-[17px] sm:text-[18px] font-medium text-[var(--sf-red)] text-center ${
                              isReversed ? "sm:text-right" : "sm:text-left"
                            }`}
                          >
                            {founder.role}
                          </p>

                          <ul className="mt-3.5 space-y-2 list-disc pl-5 font-garamond text-[18.5px] sm:text-[20px] leading-[1.48] text-[var(--sf-ink-muted)] marker:text-[var(--sf-red)] text-left">
                            {founder.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Wide 3-Column Audience Triptych (Centered Title, Header + Subheader Only) */}
        <section
          id="partners"
          ref={partnersRef}
          className="bg-[var(--sf-paper)] border-t border-[var(--sf-hairline)] text-[var(--sf-ink)] py-14 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8">
            <h2 className="sf-partners-heading mx-auto text-center font-optima text-[clamp(1.85rem,3.5vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--sf-ink)] max-w-[28ch] text-balance">
              Built for trace partners, frontier labs, and research engineers
            </h2>

            <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-10">
              {AUDIENCE_PATHS.map((item) => (
                <div
                  key={item.audience}
                  className="sf-triptych-col border-t-2 border-[var(--sf-red)] pt-5 sm:pt-7 flex flex-col"
                >
                  <h3 className="font-optima text-[1.45rem] sm:text-[1.6rem] font-medium leading-[1.2] text-[var(--sf-red)]">
                    {item.audience}
                  </h3>
                  <p className="mt-2.5 sm:mt-3 font-optima text-[1.25rem] sm:text-[1.4rem] font-medium leading-[1.35] text-[var(--sf-ink)]">
                    {item.heading}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bookend Golden Gate Vermilion Footer */}
      <footer className="sf-red-focus bg-[var(--sf-red)] text-[var(--sf-white)]">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pt-16 sm:pb-12">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-12 pb-10 sm:pb-12 border-b border-[var(--sf-white-hairline)] items-center">
            <div className="md:col-span-7">
              <p className="font-garamond text-[19.5px] sm:text-[23.5px] leading-[1.54] text-[var(--sf-white-muted)]">
                We are a small, in-person research engineering team in San Francisco’s Financial
                District, backed by a $30M seed round led by Khosla Ventures and a16z speedrun,
                building RL environments and evaluations for 20+ frontier labs.
              </p>
            </div>

            <div className="md:col-span-5 md:pl-10 text-left md:text-right md:flex md:flex-col md:items-end">
              <h2 className="font-optima text-[1.75rem] sm:text-[2rem] font-medium leading-[1.15] text-[var(--sf-white)]">
                Join us!
              </h2>
              <p className="mt-2 sm:mt-2.5 font-garamond text-[19.5px] sm:text-[23px] leading-[1.5] text-[var(--sf-white-muted)]">
                We’re hiring exceptional research engineers.
              </p>
              <a
                href={SFDATA_LINKS.careers}
                target="_blank"
                rel="noreferrer"
                className="sf-pressable sf-squircle-sm mt-4 sm:mt-5 inline-flex items-center gap-2 bg-[var(--sf-white)] text-[var(--sf-red)] px-5 py-3 sm:px-6 sm:py-3.5 font-optima text-[16.5px] sm:text-[18px] font-medium leading-none hover:bg-[var(--sf-red-tint)]"
              >
                <span>View open roles on Ashby</span>
                <ArrowUpRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true" strokeWidth={2} />
              </a>
            </div>
          </div>

          <div className="pt-7 sm:pt-8 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3.5 text-[var(--sf-white-muted)] text-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 font-garamond text-[17.5px] sm:text-[21.5px]">
              <BridgeMark className="h-5 w-7 sm:h-6 sm:w-8 text-[var(--sf-white)] shrink-0" />
              <StreetcarIcon className="h-4.5 w-6 sm:h-5 sm:w-7 text-[var(--sf-white)] shrink-0" />
              <span className="text-[var(--sf-white)]">
                Kearny Street, Financial District · San Francisco
              </span>
              <span aria-hidden="true">·</span>
              <span translate="no">© 2026 San Francisco Data</span>
            </div>

            <span aria-hidden="true" className="hidden lg:inline text-[var(--sf-white-hairline-strong)]">
              |
            </span>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-optima text-[17px] sm:text-[20px]">
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
