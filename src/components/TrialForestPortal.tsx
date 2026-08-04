"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { regressionCases, regressionSuites } from "@/content/regression";

const realms = [
  { id: "explore", module: "Home", title: "探索之森", subtitle: "首頁與旅程入口", imageBase: "/rpg-realm-dawn-valley", imagePosition: "50% 50%" },
  { id: "identity", module: "Authentication", title: "守門者峽谷", subtitle: "登入與身份驗證", imageBase: "/rpg-realm-crystal-canyon", imagePosition: "50% 50%" },
  { id: "live", module: "Live Streaming", title: "直播星火原", subtitle: "開播與觀看核心流程", imageBase: "/rpg-realm-ember-plain", imagePosition: "56% 50%" },
  { id: "library", module: "Content Library", title: "內容秘藏地", subtitle: "影片與內容探索", imageBase: "/rpg-realm-sunken-garden", imagePosition: "56% 54%" },
] as const;

export function TrialForestPortal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [turning, setTurning] = useState(false);
  const [feedbackDirection, setFeedbackDirection] = useState<-1 | 1 | null>(null);
  const timers = useRef<number[]>([]);
  const activeSuite = regressionSuites.find((suite) => suite.status === "active") ?? regressionSuites[0];
  const counts = useMemo(() => realms.map((realm) => regressionCases.filter(
    (testCase) => testCase.module === realm.module && testCase.lifecycleStatus !== "archived",
  ).length), []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const selectRealm = (nextIndex: number) => {
    if (turning || nextIndex === activeIndex) return;
    timers.current.forEach(window.clearTimeout);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(nextIndex);
      setVisibleIndex(nextIndex);
      timers.current = [window.setTimeout(() => setFeedbackDirection(null), 180)];
      return;
    }
    setTurning(true);
    setActiveIndex(nextIndex);
    timers.current = [
      window.setTimeout(() => setVisibleIndex(nextIndex), 510),
      window.setTimeout(() => { setTurning(false); setFeedbackDirection(null); }, 920),
    ];
  };

  const move = (direction: -1 | 1) => {
    if (turning) return;
    setFeedbackDirection(direction);
    selectRealm((activeIndex + direction + realms.length) % realms.length);
  };
  const realm = realms[visibleIndex];
  const hrefForRealm = (index: number) => activeSuite
    ? `/regression?suite=${encodeURIComponent(activeSuite.id)}&module=${encodeURIComponent(realms[index].module)}&view=reader`
    : "/regression";
  const href = hrefForRealm(visibleIndex);
  const previousIndex = (activeIndex - 1 + realms.length) % realms.length;
  const nextIndex = (activeIndex + 1) % realms.length;

  return (
    <div className={`trial-portal ${turning ? "is-turning" : ""}`}>
      <div className="portal-scene">
        <div className="realm-window" aria-live="polite">
          <picture className="realm-landscape-picture" key={realm.id}>
            <source srcSet={`${realm.imageBase}.avif`} type="image/avif" />
            <source srcSet={`${realm.imageBase}.webp`} type="image/webp" />
            <Image className="realm-landscape-image" src={`${realm.imageBase}.png`} alt={`${realm.title}的試煉領域景色`} fill sizes="100vw" style={{ objectPosition: realm.imagePosition }} />
          </picture>
          <div className="portal-mist" aria-hidden="true" />
        </div>
        <div className="trial-dragon"><span className="animal-sprite sprite-lol-dragon" role="img" aria-label="守護石台的試煉巨龍" /></div>
        <header className="portal-title">
          <p>✦ REGRESSION TRIAL GATE ✦</p><h2>試煉之森</h2>
          <span>選擇方向，讓傳送門顯現下一座試煉領域。</span>
        </header>
      </div>
      <div className="realm-info-panel" aria-live="polite">
          <small>目前試煉領域</small>
          <h3>{realm.title}</h3>
          <p>{realm.subtitle}</p>
          <div className="realm-info-meta"><span>{realm.module}</span><b>{counts[visibleIndex]} CASES</b></div>
          <div className="realm-info-actions">
            <Link
              className={`dial-step ${feedbackDirection === -1 ? "is-confirmed" : ""}`}
              href={hrefForRealm(previousIndex)}
              aria-disabled={turning}
              aria-label="上一座試煉領域"
              onClick={(event) => {
                if (turning) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                move(-1);
              }}
            >‹</Link>
            <Link className="portal-enter" href={href} aria-disabled={turning} tabIndex={turning ? -1 : undefined} onClick={(event) => { if (turning) event.preventDefault(); }}>進入試煉 <span>➜</span></Link>
            <Link
              className={`dial-step ${feedbackDirection === 1 ? "is-confirmed" : ""}`}
              href={hrefForRealm(nextIndex)}
              aria-disabled={turning}
              aria-label="下一座試煉領域"
              onClick={(event) => {
                if (turning) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                move(1);
              }}
            >›</Link>
          </div>
          <span className="dial-hint">使用方向按鈕切換試煉領域</span>
      </div>
    </div>
  );
}
