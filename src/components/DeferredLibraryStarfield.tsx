"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LibraryStarfield = dynamic(
  () => import("@/components/LibraryStarfield").then((module) => module.LibraryStarfield),
  { ssr: false },
);

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export function DeferredLibraryStarfield() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".library-zone");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let idleHandle = 0;
    let timeoutHandle = 0;
    let isVisible = false;
    let isActivated = false;

    const cancelPending = () => {
      const idleWindow = window as IdleWindow;
      if (idleHandle && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      idleHandle = 0;
      timeoutHandle = 0;
    };

    const schedule = () => {
      if (!isVisible || isActivated || motionPreference.matches || idleHandle || timeoutHandle) return;
      const idleWindow = window as IdleWindow;
      const activate = () => {
        if (!isVisible || motionPreference.matches) return;
        isActivated = true;
        setEnabled(true);
      };
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(activate, { timeout: 1200 });
      } else {
        timeoutHandle = window.setTimeout(activate, 320);
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) schedule();
      else if (!isActivated) cancelPending();
    }, { rootMargin: "120px 0px", threshold: 0.05 });

    const onPreferenceChange = () => {
      cancelPending();
      if (motionPreference.matches) {
        isActivated = false;
        setEnabled(false);
      } else {
        schedule();
      }
    };

    if (section) visibilityObserver.observe(section);
    motionPreference.addEventListener("change", onPreferenceChange);
    return () => {
      cancelPending();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return enabled ? <LibraryStarfield /> : null;
}
