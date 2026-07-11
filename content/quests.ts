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
    cta: "接受任務",
  },
  {
    id: "console-regression",
    category: "團隊副本",
    title: "Console Web · Release 4.8",
    description: "核心流程、權限矩陣與跨瀏覽器回歸試煉。",
    progress: "84 Cases",
    reward: "P0 · 18",
    theme: "blue",
    emblem: "🛡️",
    cta: "接受任務",
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
