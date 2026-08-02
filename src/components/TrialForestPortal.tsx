"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { regressionCases, regressionSuites } from "@/content/regression";

const realms = [
  { id: "explore", module: "Home", title: "探索之森", subtitle: "首頁與旅程入口", icon: "✦", image: "/rpg-life-tree.png", imagePosition: "24% 72%" },
  { id: "identity", module: "Authentication", title: "守門者峽谷", subtitle: "登入與身份驗證", icon: "◆", image: "/rpg-product-world-map.png", imagePosition: "14% 43%" },
  { id: "live", module: "Live Streaming", title: "直播星火原", subtitle: "開播與觀看核心流程", icon: "♜", image: "/rpg-product-world-map.png", imagePosition: "84% 52%" },
  { id: "library", module: "Content Library", title: "內容秘藏地", subtitle: "影片與內容探索", icon: "✧", image: "/rpg-quest-book.png", imagePosition: "50% 45%" },
] as const;

export function TrialForestPortal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [turning, setTurning] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const timers = useRef<number[]>([]);
  const activeSuite = regressionSuites.find((suite) => suite.status === "active") ?? regressionSuites[0];
  const counts = useMemo(() => realms.map((realm) => regressionCases.filter(
    (testCase) => testCase.module === realm.module && testCase.lifecycleStatus !== "archived",
  ).length), []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const selectRealm = (nextIndex: number) => {
    if (turning || nextIndex === activeIndex) return;
    timers.current.forEach(window.clearTimeout);
    const forward = (nextIndex - activeIndex + realms.length) % realms.length;
    const steps = forward === 3 ? -1 : forward;
    const nextRotation = -steps * 90;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(nextIndex);
      setVisibleIndex(nextIndex);
      setRotation((current) => current + nextRotation);
      return;
    }
    setTurning(true);
    setActiveIndex(nextIndex);
    setRotation((current) => current + nextRotation);
    timers.current = [
      window.setTimeout(() => setVisibleIndex(nextIndex), 510),
      window.setTimeout(() => setTurning(false), 920),
    ];
  };

  const move = (direction: -1 | 1) => selectRealm((activeIndex + direction + realms.length) % realms.length);
  const realm = realms[visibleIndex];
  const href = activeSuite
    ? `/regression?suite=${encodeURIComponent(activeSuite.id)}&module=${encodeURIComponent(realm.module)}&view=reader`
    : "/regression";

  return (
    <div className={`trial-portal ${turning ? "is-turning" : ""}`}>
      <div className="portal-scene">
        <div className="realm-window" aria-live="polite">
          <Image key={realm.id} className="realm-landscape-image" src={realm.image} alt={`${realm.title}的試煉領域景色`} fill sizes="(max-width: 600px) 68vw, 31vw" style={{ objectPosition: realm.imagePosition }} />
          <div className="portal-mist" aria-hidden="true" />
        </div>
        <div className="portal-copy">
          <p>✦ REGRESSION TRIAL GATE ✦</p><h2>試煉之森</h2>
          <span>轉動符文石環，讓傳送門顯現下一座試煉領域。</span>
        </div>
        <div className="stone-dial"
          onPointerDown={(event) => { dragged.current = false; dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerUp={(event) => { if (dragStart.current === null) return; const distance = event.clientX - dragStart.current; dragStart.current = null; if (Math.abs(distance) > 24) { dragged.current = true; move(distance > 0 ? 1 : -1); } }}
          onPointerCancel={() => { dragStart.current = null; dragged.current = false; }}
          aria-label="石台符文盤，可左右拖曳切換試煉領域">
          <div className="stone-dial-energy" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true" />
          {realms.map((item, index) => <button key={item.id} className={`stone-rune stone-rune-${index}`}
            onClick={() => { if (dragged.current) { dragged.current = false; return; } selectRealm(index); }} aria-label={`${item.title}，${counts[index]} 個案例`} aria-pressed={activeIndex === index}><span>{item.icon}</span></button>)}
        </div>
        <div className="realm-info-panel" aria-live="polite">
          <small>目前試煉領域</small>
          <h3>{realm.title}</h3>
          <p>{realm.subtitle}</p>
          <div className="realm-info-meta"><span>{realm.module}</span><b>{counts[visibleIndex]} CASES</b></div>
          <div className="realm-info-actions">
            <button className="dial-step" onClick={() => move(-1)} aria-label="上一座試煉領域">‹</button>
            <Link className="portal-enter" href={href}>進入試煉 <span>➜</span></Link>
            <button className="dial-step" onClick={() => move(1)} aria-label="下一座試煉領域">›</button>
          </div>
          <span className="dial-hint">點擊符文、左右拖曳石台，或使用方向按鈕</span>
        </div>
      </div>
    </div>
  );
}
