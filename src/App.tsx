import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PathC } from "./components/PathC";
import { PathD } from "./components/PathD";
import { PreviewSwitcher, type PreviewVariant } from "./components/PreviewSwitcher";

function readInitialVariant(): PreviewVariant {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("path")?.toLowerCase();
  return raw === "d" ? "d" : "c";
}

export default function App() {
  const [variant, setVariant] = useState<PreviewVariant>(readInitialVariant);

  const handleVariantChange = (next: PreviewVariant) => {
    if (next === variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set("path", next);
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setVariant(next);
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [variant]);

  return (
    <>
      {variant === "c" ? <PathC key="path-c" /> : <PathD key="path-d" />}
      <PreviewSwitcher variant={variant} onChange={handleVariantChange} />
    </>
  );
}
