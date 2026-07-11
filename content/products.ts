export type ProductSection = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  technology: string;
  summary: string;
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
  theme: "creator" | "sushi" | "ramen" | "web" | "tv";
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
        summary: "主播專用 App，涵蓋直播、上傳影片、貼文、限時動態等主播功能。",
        environment: "Mobile／主播端",
        sections: [{ label: "版本", value: "可申請 Beta 版本（Jay）" }],
        notes: ["Moor 後續版本通常會比 Flutter Web 新。"],
        status: "beta",
      },
      {
        id: "flutter-web",
        name: "Flutter Web",
        technology: "Flutter Web",
        summary: "網頁版主播入口，需經由 OBS 連線。",
        environment: "Web Production 登入主播帳號後使用",
        notes: ["Web Production 登入後，點擊獨立後開啟的各個畫面可能由不同後端服務支援。"],
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
        summary: "以 Ramen Web 為基礎，但區域功能由 Native Flutter 實作，之後將朝獨立 App 發展。",
        environment: "iOS／Android",
        notes: ["開發階段需先完成後台設定。", "iOS 使用 TestFlight；Android 使用 APK。"],
        status: "active",
      },
    ],
  },
  {
    id: "ramen-cities",
    name: "Ramen 雙城",
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
        summary: "純網頁包在 App 殼內，目前是主要用戶端產品。",
        environment: "Android",
        notes: ["收到的回傳資料有加密。", "主要面向中國使用者，也有國際版本。"],
        status: "active",
      },
      {
        id: "ramen-mdm",
        name: "Ramen - MDM",
        technology: "Native App + WebView（類 H5）",
        summary: "Ramen 的 iOS 版本，純網頁包在 App 殼內。",
        environment: "iOS／MDM",
        notes: ["目前是主要用戶端產品。", "回傳資料有加密；主要面向中國使用者，也有國際版本。"],
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
        technology: "Chrome／Safari",
        summary: "前端版主要測試環境。",
        environment: "https://swag.live/",
        notes: ["瀏覽器端開啟的 swag.live 使用 swag-webapp 的 v3.xxx 分支。"],
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
    id: "swag-tv-island",
    name: "SWAG TV 未知之島",
    subtitle: "Uncharted Territory",
    theme: "tv",
    status: "development",
    position: { x: 48, y: 69 },
    focus: { x: 0, y: -24, scale: 1.92 },
    products: [
      {
        id: "swag-tv",
        name: "SWAG TV",
        technology: "Native App",
        summary: "全新原生 App，產品功能仍在開發中。",
        notes: ["平台、受眾與功能尚未確認，不在文件中推測。"],
        status: "development",
      },
    ],
  },
];
