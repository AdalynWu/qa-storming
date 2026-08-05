export type ProductSection = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  technology: string;
  summary: string;
  href?: string;
  entryLabel?: string;
  environment?: string;
  sections?: ProductSection[];
  notes: string[];
  status?: "active" | "beta" | "development";
};

export type Continent = {
  id: string;
  name: string;
  subtitle: string;
  products: Product[];
  position: { x: number; y: number };
  focus: { x: number; y: number; scale: number };
  theme: "creator" | "sushi" | "ramen" | "web" | "date";
  status?: "active" | "development";
};

export const continents: Continent[] = [
  {
    id: "creator-isles",
    name: "主播群島",
    subtitle: "Creator Realm",
    theme: "creator",
    status: "active",
    position: { x: 17, y: 21 },
    focus: { x: 31, y: 20, scale: 1.75 },
    products: [
      {
        id: "moor",
        name: "Moor",
        technology: "Mobile App",
        summary:
          "創作者專用 App，涵蓋登入、數據、主播任務、直播、貼文、聊天、個人檔案與通知設定。",
        href: "/products/moor",
        entryLabel: "進入 Moor 創作者聖域",
        environment: "Mobile／主播端",
        sections: [{ label: "版本", value: "於 testflight 下載 | APK" }],
        notes: ["完整功能、流程與 QA 重點收錄於 Moor 產品頁。"],
        status: "active",
      },
      {
        id: "flutter-web",
        name: "Flutter Web",
        technology: "Flutter Web",
        summary: "網頁版主播入口，開播需經由 OBS 連線。",
        environment: "Web Production 登入主播帳號後使用",
        notes: [
          "Web Production 登入後，點擊獨立後開啟的各個畫面可能由不同後端服務支援。",
        ],
        status: "active",
      },
    ],
  },
  {
    id: "sushi-land",
    name: "Sushi 大陸",
    subtitle: "Hybrid Frontier",
    theme: "sushi",
    status: "active",
    position: { x: 55, y: 18 },
    focus: { x: -8, y: 22, scale: 1.8 },
    products: [
      {
        id: "sushi-app",
        name: "Sushi App",
        technology: "Hybrid WebView + Native Flutter",
        summary:
          "以 Ramen Web 為基礎，但區域功能由 Native Flutter 實作，之後將朝獨立 App 發展。",
        environment: "iOS／Android",
        notes: [
          "開發階段需先完成後台設定。",
          "iOS 使用 TestFlight；Android 使用 APK。",
        ],
        status: "development",
      },
    ],
  },
  {
    id: "ramen-cities",
    name: "Ramen 城",
    subtitle: "User App Kingdom",
    theme: "ramen",
    status: "active",
    position: { x: 72, y: 48 },
    focus: { x: -29, y: -7, scale: 1.72 },
    products: [
      {
        id: "ramen",
        name: "Ramen",
        technology: "Native App + WebView（類 H5）",
        summary: "純網頁包在 App 殼內，主要面向中國使用者。",
        environment: "Android | iOS",
        notes: ["有提供 dev 版 APK，方便測試與 QA。"],
        status: "active",
      },
    ],
  },
  {
    id: "web-ecosystem",
    name: "Web 生態洲",
    subtitle: "Browser Coast",
    theme: "web",
    status: "active",
    position: { x: 22, y: 61 },
    focus: { x: 27, y: -18, scale: 1.66 },
    products: [
      {
        id: "web-production",
        name: "Web Production",
        technology: "Web",
        summary:
          "SWAG Web 主要測試環境，涵蓋帳號、直播、商店、探索、Landing、SEO 與活動入口。",
        href: "/products/web",
        entryLabel: "進入 Web 冒險手冊",
        environment: "https://swag.live",
        notes: ["完整 2026 流程、版本判讀與 QA 重點收錄於 Web 產品頁。"],
        status: "active",
      },
      {
        id: "pwa",
        name: "PWA",
        technology: "Progressive Web App",
        summary: "從網頁內點擊加入主畫面，形成類 App 的快速入口。",
        environment: "支援 PWA 的一般瀏覽器",
        notes: ["核心內容仍由 Web 版本提供。"],
        status: "active",
      },
    ],
  },
  {
    id: "date-app-island",
    name: "交友新島",
    subtitle: "Uncharted Territory",
    theme: "date",
    status: "development",
    position: { x: 48, y: 69 },
    focus: { x: 0, y: -24, scale: 1.92 },
    products: [
      {
        id: "date-app",
        name: "交友 App（開發中）",
        technology: "React Native App",
        summary: "全新交友社群 App，產品名稱與功能仍在開發中。",
        sections: [
          {
            label: "開發方式",
            value: "文件驅動開發（Spec-Driven Development, SDD）",
          },
        ],
        notes: ["產品名稱、平台、受眾與功能尚未確認。"],
        status: "development",
      },
    ],
  },
];
