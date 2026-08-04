"use client";

import { useSyncExternalStore } from "react";

/**
 * 判斷是否為「可玩迷霧測試林」的電腦裝置。
 * 條件：畫面 >= 1024x600 且非純觸控環境 (hover:none) and (pointer:coarse)。
 * 刻意不偵測滑鼠——遊戲核心是鍵盤操作，觸控筆電／平板鍵盤容易誤判。
 *
 * 三態回傳：
 *   null  → 尚未判斷（SSR / hydration 首繪）
 *   true  → 合格（eligible）
 *   false → 不合格（blocked）
 *
 * 用 useSyncExternalStore 而非 useEffect+setState，避免踩 react-hooks/set-state-in-effect，
 * 並讓 server snapshot 回傳 null、client 端隨 resize/rotate 即時更新。
 */
const SIZE_QUERY = "(min-width: 1024px) and (min-height: 600px)";
const PURE_TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

// subscribe / getSnapshot 只會在 client 端被呼叫（server 走 getServerSnapshot），
// 故此處存取 window.matchMedia 是安全的，不需額外 typeof window 判斷。
function subscribe(onStoreChange: () => void): () => void {
  const size = window.matchMedia(SIZE_QUERY);
  const touch = window.matchMedia(PURE_TOUCH_QUERY);
  size.addEventListener("change", onStoreChange);
  touch.addEventListener("change", onStoreChange);
  return () => {
    size.removeEventListener("change", onStoreChange);
    touch.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): boolean | null {
  const bigEnough = window.matchMedia(SIZE_QUERY).matches;
  const pureTouch = window.matchMedia(PURE_TOUCH_QUERY).matches;
  return bigEnough && !pureTouch;
}

function getServerSnapshot(): boolean | null {
  return null;
}

export function useIsComputerDevice(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, getSnapshot, getServerSnapshot);
}
