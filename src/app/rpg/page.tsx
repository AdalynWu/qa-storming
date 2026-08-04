import type { Metadata } from "next";
import Link from "next/link";
import { MistyForestGate } from "@/components/MistyForestGate";
import "./rpg.css";

export const metadata: Metadata = {
  title: "迷霧測試林 | QA Storming",
  description:
    "vibe coding 完怎麼自測？在迷霧測試林用互動關卡練習語句／決策覆蓋、邊界值、等價分割與 error／defect／failure。桌機專屬副本。",
};

export default function RpgPage() {
  return (
    <main className="rpg-quest-shell">
      <header className="rpg-quest-topbar">
        <Link href="/">← 返回世界樹</Link>
        <span className="rpg-quest-topbar-title">MISTY TEST FOREST · VIBE CODING 自測副本</span>
        <Link href="/library">賢者書庫</Link>
      </header>
      <MistyForestGate />
    </main>
  );
}
