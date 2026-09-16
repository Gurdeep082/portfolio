"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lenis = reducedMotion
      ? null
      : new Lenis({
          autoRaf: true,
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
        });

    const handleScrollTo = (event: Event) => {
      const selector = (event as CustomEvent<{ selector?: string }>).detail
        ?.selector;
      const target = selector ? document.querySelector(selector) : null;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (lenis) {
        lenis.scrollTo(target, {
          offset: -72,
          duration: 1.05,
        });
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    };

    window.addEventListener("portfolio:scroll-to", handleScrollTo);

    if (lenis) {
      document.documentElement.classList.add("lenis");
    }

    return () => {
      window.removeEventListener("portfolio:scroll-to", handleScrollTo);
      document.documentElement.classList.remove("lenis");
      lenis?.destroy();
    };
  }, []);

  return null;
}
