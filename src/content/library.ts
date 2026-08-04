export type LibraryShelf = "產品手冊" | "QA 參考資料" | "測試工具";

export type LibraryDocument = {
  slug: string;
  href: string;
  shelf: LibraryShelf;
  eyebrow: string;
  title: string;
  summary: string;
  marker: string;
  kind: string;
  featured?: boolean;
};

export const libraryDocuments: LibraryDocument[] = [
  {
    slug: "product-map",
    href: "/product-map",
    shelf: "產品手冊",
    eyebrow: "WORLD ATLAS",
    title: "產品世界地圖",
    summary: "從產品版圖進入 Moor 與 Web 的完整冒險路徑。",
    marker: "MAP",
    kind: "導航地圖",
    featured: true,
  },
  {
    slug: "moor",
    href: "/products/moor",
    shelf: "產品手冊",
    eyebrow: "CREATOR SANCTUARY",
    title: "Moor App 創作者手冊",
    summary: "登入、數據、任務、直播、貼文、聊天與創作者端 QA 觀察。",
    marker: "M",
    kind: "Mobile App",
  },
  {
    slug: "web",
    href: "/products/web",
    shelf: "產品手冊",
    eyebrow: "BROWSER COAST",
    title: "SWAG Web 冒險手冊",
    summary: "帳號、直播、付費、探索及 Landing 流程的 Web QA 章節。",
    marker: "W",
    kind: "Desktop / Mobile Web",
  },
  {
    slug: "error-codes",
    href: "/library/error-codes",
    shelf: "QA 參考資料",
    eyebrow: "ERROR CODE V2",
    title: "錯誤代碼鑑定圖鑑",
    summary: "以 Code、Backend Key、使用者情境與處理範圍快速定位錯誤。",
    marker: "EC",
    kind: "可搜尋索引",
    featured: true,
  },
  {
    slug: "regression",
    href: "/regression",
    shelf: "QA 參考資料",
    eyebrow: "TRIAL ARCHIVE",
    title: "Regression 試煉圖鑑",
    summary: "依產品、平台與風險探索核心流程及錯誤恢復案例。",
    marker: "R",
    kind: "Test Cases",
  },
  {
    slug: "testing-tools",
    href: "/library/testing-tools",
    shelf: "測試工具",
    eyebrow: "TOOL WORKSHOP",
    title: "測試工具工坊",
    summary: "Mobile、自動化、投影、影音、留存與效率工具的安全入口。",
    marker: "T",
    kind: "工具索引",
    featured: true,
  },
  {
    slug: "maestro",
    href: "/library/maestro",
    shelf: "測試工具",
    eyebrow: "AUTOMATION GRIMOIRE",
    title: "Maestro Mobile UI 手冊",
    summary: "Flow、Selector、專案結構、除錯、CI 與 Flutter 注意事項。",
    marker: "M°",
    kind: "自動化手冊",
  },
  {
    slug: "appium-mcp",
    href: "/library/appium-mcp",
    shelf: "測試工具",
    eyebrow: "DEVICE OBSERVATORY",
    title: "Appium MCP 使用手冊",
    summary: "安裝、唯讀連線驗證、UI Tree 探索與 Maestro 分工。",
    marker: "A",
    kind: "裝置探索",
  },
];

export const standaloneLibrarySlugs = ["testing-tools", "maestro", "appium-mcp"] as const;

export function getLibraryDocument(slug: string) {
  return libraryDocuments.find((document) => document.slug === slug);
}
