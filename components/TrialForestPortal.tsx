"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { regressionCases, regressionSuites } from "@/content/regression";

const realms = [
  { id: "explore", module: "Home", title: "探索之森", subtitle: "首頁與旅程入口", icon: "✦", color: "green" },
  { id: "identity", module: "Authentication", title: "守門者峽谷", subtitle: "登入與身份驗證", icon: "◆", color: "blue" },
  { id: "live", module: "Live Streaming", title: "直播星火原", subtitle: "開播與觀看核心流程", icon: "♜", color: "red" },
  { id: "library", module: "Content Library", title: "內容秘藏地", subtitle: "影片與內容探索", icon: "✧", color: "black" },
] as const;

export function TrialForestPortal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [turning, setTurning] = useState(false);
  const dragStart = useRef<number | null>(null);
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
    setTurning(true);
    setActiveIndex(nextIndex);
    setRotation((current) => current - steps * 90);
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
      <div className="portal-copy">
        <p>✦ REGRESSION TRIAL GATE ✦</p><h2>轉動命運輪盤</h2>
        <span>選擇窗外的試煉領域，進入對應的 Regression 冒險。</span>
      </div>
      <div className="portal-machine">
        <div className={`portal-window scenery-${realm.id}`} aria-live="polite">
          <div className="window-bars" aria-hidden="true" />
          <div className="scenery-label"><small>{realm.subtitle}</small><strong>{realm.title}</strong><span>{counts[visibleIndex]} CASES</span></div>
        </div>
        <div className="portal-controls">
          <button className="dial-step dial-prev" onClick={() => move(-1)} aria-label="逆時針切換試煉">‹</button>
          <div className="dial-wrap">
            <span className="dial-pin" aria-hidden="true">▼</span>
            <div className="realm-dial" style={{ transform: `rotate(${rotation}deg)` }}
              onPointerDown={(event) => { dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
              onPointerUp={(event) => { if (dragStart.current === null) return; const distance = event.clientX - dragStart.current; dragStart.current = null; if (Math.abs(distance) > 24) move(distance > 0 ? 1 : -1); }}
              aria-label="試煉領域輪盤，可左右拖曳">
              {realms.map((item, index) => <button key={item.id} className={`dial-sector sector-${index} sector-${item.color}`}
                onClick={() => selectRealm(index)} aria-label={`${item.title}，${counts[index]} 個案例`} aria-pressed={activeIndex === index}><span>{item.icon}</span></button>)}
              <span className="dial-hub" aria-hidden="true" />
            </div>
          </div>
          <button className="dial-step dial-next" onClick={() => move(1)} aria-label="順時針切換試煉">›</button>
        </div>
        <div className="portal-status"><i className={`status-${realm.color}`} /><span>{realm.module}</span></div>
        <Link className="portal-enter" href={href}>進入試煉 <span>➜</span></Link>
        <p className="dial-hint">點擊色域或左右拖曳輪盤</p>
      </div>
    </div>
  );
}
