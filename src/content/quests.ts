import { regressionStats } from "./regression";

export type QuestBook = {
  id: string;
  category: string;
  title: string;
  description: string;
  progress: string;
  reward: string;
  theme: "legendary" | "mint" | "blue" | "peach";
  emblem: string;
  cta: string;
  href?: string;
};

export const questBooks: QuestBook[] = [
  {
    id: "product-world-map",
    category: "主線任務 · WORLD MAP",
    title: "產品世界地圖",
    description: "探索五座產品大陸，了解技術架構、核心功能與 QA 注意事項。",
    progress: "5 座大陸",
    reward: "+300 EXP",
    theme: "legendary",
    emblem: "🗺️",
    cta: "開啟地圖",
    href: "/product-map",
  },
  {
    id: "qa-onboarding",
    category: "新手任務",
    title: "QA 冒險者啟程指南",
    description: "完成環境建置、權限申請與第一週修行。",
    progress: "12 個章節",
    reward: "+120 EXP",
    theme: "mint",
    emblem: "🧭",
    cta: "進入書庫",
    href: "/library",
  },
  {
    id: "error-code-field-guide",
    category: "鑑定任務 · ERROR CODE V2",
    title: "錯誤代碼鑑定圖鑑",
    description: "依 Code、Backend Key、情境與處理範圍快速定位問題。",
    progress: "7 類索引",
    reward: "+90 EXP",
    theme: "peach",
    emblem: "🔎",
    cta: "開始查詢",
    href: "/library/error-codes",
  },
  {
    id: "testing-tools",
    category: "支線任務 · TOOL WORKSHOP",
    title: "測試工具工坊",
    description: "找到裝置、投影、直播、影音、留存與效率工具。",
    progress: "8 組工具",
    reward: "+80 EXP",
    theme: "mint",
    emblem: "🧰",
    cta: "打開工具箱",
    href: "/library/testing-tools",
  },
  {
    id: "mobile-automation",
    category: "進階任務 · MOBILE AUTOMATION",
    title: "Maestro × Appium MCP",
    description: "先探索 UI Tree，再把穩定流程寫成可重複執行的測試。",
    progress: "2 卷手冊",
    reward: "+160 EXP",
    theme: "blue",
    emblem: "⚙️",
    cta: "研讀手冊",
    href: "/library/maestro",
  },
  {
    id: "console-regression",
    category: "團隊副本",
    title: "Regression 試煉圖鑑",
    description: "依產品與平台探索核心流程、權限、相容性與錯誤恢復案例。",
    progress: `${regressionStats.suiteCount} Suites · ${regressionStats.caseCount} Cases`,
    reward: `P0 · ${regressionStats.p0Count}`,
    theme: "blue",
    emblem: "🛡️",
    cta: "進入試煉",
    href: "/regression",
  },
  {
    id: "mobile-checkout",
    category: "限時挑戰",
    title: "Mobile App · Checkout",
    description: "iOS / Android 結帳與錯誤恢復測試。",
    progress: "63 Cases",
    reward: "P0 · 12",
    theme: "peach",
    emblem: "⚔️",
    cta: "接受任務",
  },
];

export const onboardingQuestBooks = questBooks.filter((quest) =>
  ["product-world-map", "qa-onboarding", "error-code-field-guide", "testing-tools", "mobile-automation"].includes(quest.id),
);
