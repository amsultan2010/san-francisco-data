import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
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
