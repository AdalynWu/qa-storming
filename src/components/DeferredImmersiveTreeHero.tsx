"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ImmersiveTreeHero = dynamic(
  () => import("@/components/ImmersiveTreeHero").then((module) => module.ImmersiveTreeHero),
  { ssr: false },
);

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export function DeferredImmersiveTreeHero() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".tree-hero");
    let idleHandle = 0;
    let timeoutHandle = 0;
    let warmupHandle = 0;
    let isVisible = false;
    let isActivated = false;

    const scheduleIdle = () => {
      const idleWindow = window as IdleWindow;
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => {
          if (!isVisible || motionPreference.matches) return;
          isActivated = true;
          setEnabled(true);
        }, { timeout: 1400 });
      } else {
        timeoutHandle = window.setTimeout(() => {
          if (!isVisible || motionPreference.matches) return;
          isActivated = true;
          setEnabled(true);
        }, 450);
      }
    };

    const cancelPending = () => {
      const idleWindow = window as IdleWindow;
      if (idleHandle && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      if (warmupHandle) window.clearTimeout(warmupHandle);
      idleHandle = 0;
      timeoutHandle = 0;
      warmupHandle = 0;
    };

    const schedule = () => {
      if (motionPreference.matches || !isVisible || isActivated || warmupHandle || idleHandle || timeoutHandle) return;
      warmupHandle = window.setTimeout(() => {
        warmupHandle = 0;
        if (isVisible && !motionPreference.matches) scheduleIdle();
      }, 1600);
    };

    const onPreferenceChange = () => {
      cancelPending();
      if (motionPreference.matches) {
        isActivated = false;
        setEnabled(false);
      } else {
        schedule();
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) schedule();
      else cancelPending();
    }, { threshold: 0.05 });

    if (hero) visibilityObserver.observe(hero);
    motionPreference.addEventListener("change", onPreferenceChange);
    return () => {
      cancelPending();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return enabled ? <ImmersiveTreeHero /> : null;
}
