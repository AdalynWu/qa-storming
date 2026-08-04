"use client";

import { useEffect, useRef, useState } from "react";
import { useIsComputerDevice } from "@/hooks/useIsComputerDevice";

const GAME_SRC = "/rpg/misty-test-forest.html";

/**
 * 迷霧測試林進入閘門。狀態機：
 *   entered           → playing（latch；一旦 true，之後裝置值/resize 都不影響）
 *   eligibility=null  → checking（載入提示，不載 iframe）
 *   eligibility=false && !bypassed → blocked（擋頁卡片＋「我有鍵盤，仍要進入」）
 *   否則              → gate（原生 button，Enter/Space/點擊皆可）
 * 只在 onClick 內 setState，無 setState-in-effect（auto-focus 走 ref.focus()）。
 */
export function MistyForestGate() {
  const eligibility = useIsComputerDevice();
  const [bypassed, setBypassed] = useState(false);
  const [entered, setEntered] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  const showGate = !entered && (eligibility === true || bypassed);

  // 進入 gate 時把焦點放到進入按鈕（純鍵盤可直接 Enter）。ref.focus 非 setState。
  useEffect(() => {
    if (showGate) startButtonRef.current?.focus();
  }, [showGate]);

  if (entered) {
    return <GameFrame />;
  }

  if (eligibility === null) {
    return (
      <div className="rpg-quest-state" role="status" aria-live="polite">
        <p className="rpg-quest-checking">正在確認裝置…</p>
      </div>
    );
  }

  if (eligibility === false && !bypassed) {
    return (
      <div className="rpg-quest-state">
        <div className="rpg-quest-card">
          <p className="rpg-quest-kicker">MISTY TEST FOREST</p>
          <h1 className="rpg-quest-title">此副本需要實體鍵盤與足夠的畫面空間。</h1>
          <p className="rpg-quest-desc">
            使用 WASD、方向鍵、E 與 Esc 操作。手機／觸控裝置暫不支援，且為了效能不會載入這個 3D 場景。
          </p>
          <button
            type="button"
            className="rpg-quest-btn rpg-quest-btn-ghost"
            onClick={() => setBypassed(true)}
          >
            我有鍵盤，仍要進入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rpg-quest-state">
      <div className="rpg-quest-card">
        <p className="rpg-quest-kicker">MISTY TEST FOREST · VIBE CODING 自測副本</p>
        <h1 className="rpg-quest-title">迷霧測試林</h1>
        <p className="rpg-quest-desc">使用 WASD、方向鍵、E 與 Esc 操作。準備好就走進迷霧。</p>
        <button
          ref={startButtonRef}
          type="button"
          className="rpg-quest-btn"
          onClick={() => setEntered(true)}
        >
          按 Enter 或點擊進入迷霧測試林
        </button>
        <p className="rpg-quest-note">離開時按 Shift+Tab 回到頂部「返回世界樹」即可退出。</p>
      </div>
    </div>
  );
}

/**
 * iframe 隔離載入遊戲。焦點交接全在 onLoad 內（此時已導航到正式 HTML，
 * 不再是 about:blank）：先 focus iframe window，再 focus 遊戲的 #start，
 * 讓純鍵盤按 Enter 即可「走進霧裡」、WASD 隨即可用；找不到 #start 時退而
 * focus iframe 本體。同源、未加 sandbox，故可存取 contentDocument。
 */
function GameFrame() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      iframe.contentWindow?.focus();
      const startButton = iframe.contentDocument?.getElementById("start");
      if (startButton instanceof HTMLElement) {
        startButton.focus();
      } else {
        iframe.focus();
      }
    } catch {
      iframe.focus();
    }
  };

  return (
    <div className="rpg-quest-frame">
      <iframe
        ref={iframeRef}
        src={GAME_SRC}
        title="迷霧測試林 測試教學遊戲"
        className="rpg-quest-iframe"
        tabIndex={0}
        onLoad={handleLoad}
      />
      <p className="rpg-quest-small-hint" aria-hidden="true">
        畫面較小，建議放大視窗以獲得完整體驗。
      </p>
    </div>
  );
}
