import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/azeret-mono/latin-400.css";
import "@fontsource/azeret-mono/latin-500.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/index.css";
import App from "./App";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const rootEl = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, tree);
} else {
  createRoot(rootEl).render(tree);
}
