"use client";

import { useEffect, useState } from "react";

const minimumVisibleTime = 850;
const fadeDuration = 320;

export default function SplashScreen() {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startedAt = Date.now();
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      const delay = Math.max(0, minimumVisibleTime - (Date.now() - startedAt));

      exitTimer = setTimeout(() => {
        setIsExiting(true);
        removeTimer = setTimeout(() => setIsVisible(false), fadeDuration);
      }, delay);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      window.removeEventListener("load", dismiss);
      if (exitTimer) clearTimeout(exitTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-label="Loading portfolio"
      aria-live="polite"
      className={`splash-screen${isExiting ? " splash-screen--exiting" : ""}`}
      role="status"
    >
      <img
        src="/GSlogo.png"
        alt=""
        className="splash-screen__logo"
        draggable={false}
      />
    </div>
  );
}
