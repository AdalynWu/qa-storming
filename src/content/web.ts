import type { MoorChapter, MoorSection } from "@/content/moor";

export type WebChapter = Omit<MoorChapter, "sections"> & { sections?: MoorSection[] };

export const webProduct = {
  name: "Web Production",
  realmName: "瀏覽者海岸",
  eyebrow: "SWAG WEB · BROWSER COAST",
  description:
    "SWAG Web 是主要瀏覽器產品。這份冒險手冊把 Master Design File 的產品範圍，與 2026 已核准專案中的帳號、直播、付費、探索及 Landing 流程整理成可查找的 QA 章節。",
  sourceLabel: "SWAG Master Design File 與 2026 Web 設計專案",
};

export const webChapters: WebChapter[] = [
  {
    slug: "account-access",
    order: 1,
    rune: "I",
    title: "帳號與訪客",
    subtitle: "ACCOUNT GATE",
    summary: "登入、註冊合併，訪客帳號建立、登入與升級正式帳號。",
    duration: "12 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-02",
    sections: [
      {
        id: "identity-paths",
        title: "身分路徑",
        blocks: [
          { type: "paragraph", text: "2026 流程將登入與註冊收斂到同一入口，並加入訪客帳號建立與 claim 成為正式帳號。測試時先確認使用者目前身分，再驗證系統是否帶往正確路徑。" },
          { type: "table", title: "主要情境", columns: ["身分", "預期路徑", "QA 觀察"], rows: [
            ["既有帳號", "完成驗證後登入原帳號", "不得誤建新帳號或遺失原資料"],
            ["新訪客", "建立可識別的訪客狀態", "重整、返回與跨頁後狀態一致"],
            ["訪客升級", "claim 後成為正式帳號", "權益、購買與歷史資料正確承接"],
            ["受限制帳號", "顯示限制原因與可行下一步", "不可陷入登入循環"],
          ] },
        ],
      },
      {
        id: "recovery",
        title: "失敗與恢復",
        blocks: [
          { type: "list", title: "必要檢查", items: [
            "驗證碼錯誤、過期、重送與頻率限制都有明確提示。",
            "關閉、返回或重新整理不會跳過必要驗證，也不會重複建立身分。",
            "第三方登入、Passkey 或裝置能力不可用時，仍提供可理解的替代方式。",
            "claim 失敗時保留訪客權益，並提供重試或聯絡客服的出口。",
          ] },
          { type: "callout", tone: "warning", title: "高風險狀態", text: "帳號合併與訪客升級會改變使用者身分；需特別保留失敗前後的 user id、權益與訂單證據，但公開 issue 不得包含真實個資或驗證資訊。" },
        ],
      },
    ],
  },
  {
    slug: "live-experience",
    order: 2,
    rune: "II",
    title: "直播體驗",
    subtitle: "LIVE HARBOR",
    summary: "直播首屏、簡化 UI、聊天室、排行榜與募資互動。",
    duration: "14 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-02",
    sections: [
      {
        id: "first-screen",
        title: "首屏與介面層級",
        blocks: [
          { type: "list", title: "2026 核心檢查", items: [
            "直向、橫向與滿版都保留主要 CTA，並尊重瀏海、瀏覽器工具列與安全區。",
            "聊天室、公告、置頂內容與工具列不遮住關鍵直播資訊。",
            "排行榜前三名有足夠辨識度；載入、空資料與延遲更新不會被誤認為名次。",
            "新開直播沒有歷史資料時，首屏仍呈現完整且可操作的初始狀態。",
          ] },
        ],
      },
      {
        id: "crowdfunding",
        title: "募資活動同步",
        blocks: [
          { type: "paragraph", text: "募資活動跨越 SWAG 觀看端與 MOOR 主播端。進度、取得資格、公告、安可、提前結束與直播結束後狀態必須指向同一場活動。" },
          { type: "callout", tone: "tip", title: "跨端證據", text: "以同一活動識別資訊比對兩端時間、進度與結果；若不同步，記錄操作順序、網路狀態與各端版本。" },
        ],
      },
    ],
  },
  {
    slug: "purchase",
    order: 3,
    rune: "III",
    title: "商店與快速支付",
    subtitle: "MERCHANT DOCK",
    summary: "新用戶與訪客的首次禮包導購、Email 條件與訂單狀態。",
    duration: "10 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-02",
    sections: [
      {
        id: "first-purchase",
        title: "首次購買旅程",
        blocks: [
          { type: "steps", title: "基本流程", items: [
            "以符合條件的新用戶或訪客進入禮包入口。",
            "確認商品、價格、幣別、Email 欄位與付款方式。",
            "送出訂單後辨識處理中、成功或失敗狀態。",
            "返回原場景並確認商品、權益與活動任務正確更新。",
          ] },
          { type: "list", title: "狀態覆蓋", items: ["禮包載入中與無可購買商品", "Email 必填、格式錯誤與既有資料帶入", "重複點擊付款與長時間處理中", "付款失敗、取消、逾時與恢復", "成功後重整、返回與重複導購"] },
        ],
      },
      {
        id: "purchase-safety",
        title: "付款安全",
        blocks: [
          { type: "callout", tone: "warning", title: "證據去識別", text: "issue 只保留必要的測試訂單識別、時間與結果；信用卡、Email、付款憑證與個資必須遮蔽。" },
        ],
      },
    ],
  },
  {
    slug: "navigation-discovery",
    order: 4,
    rune: "IV",
    title: "導覽與探索",
    subtitle: "DISCOVERY ROUTE",
    summary: "Topbar、懸浮按鈕、搜尋選項、結果數量與活動入口。",
    duration: "9 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-02",
    sections: [
      {
        id: "navigation",
        title: "跨裝置導覽",
        blocks: [
          { type: "list", title: "檢查重點", items: [
            "Topbar 與懸浮按鈕在桌機、平板、手機維持正確位置與點擊範圍。",
            "捲動、開啟 Modal 或鍵盤後，固定元件不遮擋主要內容與操作。",
            "活動與任務 badge 能反映未讀或狀態；已結束、不可用時有明確提示。",
          ] },
        ],
      },
      {
        id: "search",
        title: "搜尋選項與結果",
        blocks: [
          { type: "paragraph", text: "搜尋列點擊後的選項與結果呈現需維持明確層級。驗證輸入、清除、無結果、結果數量、長名稱與鍵盤操作，並確認切換選項不會保留錯誤結果。" },
          { type: "callout", tone: "tip", title: "裝置差異", text: "手機軟鍵盤會改變可視高度；搜尋建議、結果與關閉操作都必須留在可視範圍內。" },
        ],
      },
    ],
  },
  {
    slug: "landing-seo",
    order: 5,
    rune: "V",
    title: "Landing 與 SEO",
    subtitle: "PUBLIC LIGHTHOUSE",
    summary: "首頁 FAQ、客服 CTA、多語系內容與搜尋引擎可讀性。",
    duration: "8 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-02",
    sections: [
      {
        id: "faq-support",
        title: "FAQ 與客服入口",
        blocks: [
          { type: "list", title: "內容與互動", items: [
            "FAQ 標題、展開內容與焦點順序在桌機及手機都清楚可讀。",
            "客服 CTA 的文案、目的地與返回路徑一致，不因登入狀態失效。",
            "長翻譯、較大系統字級與窄螢幕不造成裁切、重疊或不可操作。",
          ] },
        ],
      },
      {
        id: "seo",
        title: "SEO 基本驗證",
        blocks: [
          { type: "paragraph", text: "FAQ 與 Landing 的核心資訊應存在於可讀的 HTML 結構中。驗證標題層級、連結文字、頁面 metadata、canonical 與結構化資料是否符合本次需求，不以純視覺呈現代替語意。" },
        ],
      },
    ],
  },
  { slug: "profile-content", order: 6, rune: "VI", title: "個人檔案與內容", subtitle: "PROFILE QUARTER", summary: "個人檔案、貼文、媒體與內容管理。", duration: "待安全整理", status: "review" },
  { slug: "media-chat", order: 7, rune: "VII", title: "影音與聊天", subtitle: "MEDIA CHANNEL", summary: "影音瀏覽、訊息與聊天室互動。", duration: "待安全整理", status: "review" },
  { slug: "settings", order: 8, rune: "VIII", title: "個人中心與設定", subtitle: "ACCOUNT CABIN", summary: "個人中心、通知、偏好與帳號設定。", duration: "待安全整理", status: "review" },
];

export const publishedWebChapters = webChapters.filter(
  (chapter) => chapter.status === "published" && chapter.sections,
);

export function getWebChapter(slug: string) {
  return publishedWebChapters.find((chapter) => chapter.slug === slug);
}
