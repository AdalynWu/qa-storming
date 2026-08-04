"use client";

import { usePathname } from "next/navigation";
import { KnowledgeChatbot } from "@/components/KnowledgeChatbot";

/**
 * 全站掛載賢者問答 Chatbot，但在迷霧測試林 `/rpg` 沉浸式遊戲頁不顯示
 * （遊戲全螢幕、桌機專屬，不需要浮動 bot）。其餘頁面照常顯示。
 */
export function KnowledgeChatbotMount() {
  const pathname = usePathname();
  if (pathname?.startsWith("/rpg")) return null;
  return <KnowledgeChatbot />;
}
