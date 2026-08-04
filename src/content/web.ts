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
    summary: "直播首屏、語音直播、簡化 UI、聊天室、排行榜與募資互動。",
    duration: "17 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
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
        id: "audio-live",
        title: "語音直播模式",
        blocks: [
          { type: "paragraph", text: "語音直播有 SWAG 觀看端與 Moor 主播端兩套現行 Mockup。入口、直播卡、房間狀態與聲音波形要能讓使用者明確分辨語音與視訊直播，兩端也必須指向同一場直播。" },
          { type: "list", title: "跨端檢查", items: [
            "直播列表與直播間入口能辨識語音模式，圖示、標籤與實際房型一致。",
            "加入、離開、重新連線與切到背景後，主播、聽眾、在線人數及房間狀態正確更新。",
            "麥克風權限拒絕、靜音、無聲音與網路不穩時提供可理解的狀態與恢復方式。",
            "聲音波形是輔助回饋；即使降低動態或無法播放動畫，仍要以文字或控制狀態表達結果。",
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
    summary: "Shop Detail、First Pay、新手禮包、信用卡結帳與快速支付。",
    duration: "14 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
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
        id: "shop-entry",
        title: "Shop Detail 與 First Pay",
        blocks: [
          { type: "paragraph", text: "2026 上半年 Shop 現行檔案將一般商店頁與新手首次導購拆成兩條路徑。測試時需保留入口身分、導購資格與返回來源，避免一般使用者誤進 First Pay，或符合資格的新手遺失優惠。" },
          { type: "table", title: "入口差異", columns: ["路徑", "主要目的", "QA 觀察"], rows: [
            ["Shop Detail", "瀏覽商品並進入一般購買", "商品狀態、價格、幣別、返回位置與重整"],
            ["First Pay", "引導符合條件的新手完成首次購買", "資格、零次購買判定、優惠承接與完成後去向"],
          ] },
        ],
      },
      {
        id: "card-checkout",
        title: "信用卡結帳流程",
        blocks: [
          { type: "list", title: "結帳摩擦點", items: [
            "快速支付與一般支付入口、欄位及下一步結果一致，不會因切換方式產生重複訂單。",
            "卡片資訊、Email、帳單資料的必填、格式錯誤與既有資料帶入都有明確提示。",
            "送出後的處理中、驗證、成功、失敗、取消與逾時狀態可以辨識並安全恢復。",
            "返回、重整或重複點擊不會誤扣款；成功後商品、權益與訂單紀錄只更新一次。",
          ] },
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
      {
        id: "error-pages",
        title: "404 與相關錯誤頁",
        blocks: [
          { type: "paragraph", text: "現行錯誤頁涵蓋 Mobile、Tablet 與 Desktop。不同錯誤可以共用視覺語言，但訊息要說明發生什麼事，並提供回首頁、返回上一頁或重新嘗試等真正可用的恢復路徑。" },
          { type: "list", title: "必要驗證", items: [
            "404、系統錯誤與地區限制等狀態不共用模糊文案，主要動作符合各自可恢復方式。",
            "重新整理、直接開深連結、返回及登入狀態切換後，錯誤頁不會形成循環。",
            "錯誤標題、說明、插圖替代文字與 CTA 在三種裝置尺寸都完整可讀。",
            "內部錯誤碼可以輔助回報，但不可取代面向使用者的問題與下一步說明。",
          ] },
        ],
      },
    ],
  },
  {
    slug: "profile-content",
    order: 6,
    rune: "VI",
    title: "個人檔案與內容",
    subtitle: "PROFILE QUARTER",
    summary: "個人檔案角色差異、創作生命週期與跨裝置內容管理。",
    duration: "13 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
    sections: [
      {
        id: "profile-roles",
        title: "角色與觀看視角",
        blocks: [
          { type: "paragraph", text: "Master Design File 將個人檔案拆成三種觀看視角：一般使用者看創作者、一般使用者看自己，以及創作者看自己。QA 應先固定登入身分與檔案擁有者，再驗證內容與操作權限，避免只用同一帳號覆蓋全部情境。" },
          { type: "table", title: "視角矩陣", columns: ["觀看者", "檔案擁有者", "QA 觀察"], rows: [
            ["一般使用者", "創作者", "公開資訊與可觀看內容完整；不出現僅限擁有者的管理操作"],
            ["一般使用者", "自己", "自己的資料、內容與可用操作符合一般帳號權限"],
            ["創作者", "自己", "創作與管理入口可找到，公開呈現與管理狀態不混淆"],
            ["未登入／受限制身分", "任一檔案", "依需求顯示可理解的限制與下一步，不洩漏非公開資料"],
          ] },
        ],
      },
      {
        id: "content-lifecycle",
        title: "建立、更新與刪除創作",
        blocks: [
          { type: "steps", title: "內容生命週期", items: [
            "從創作者自己的個人檔案找到建立入口，確認可選內容類型與必填資料。",
            "送出後確認處理中、成功或失敗狀態，且新內容只出現一次。",
            "重新開啟既有內容進行更新，確認儲存、取消與返回不會留下半套資料。",
            "刪除前辨識目標與影響，完成或失敗後同步檢查列表、詳情與公開檔案。",
          ] },
          { type: "list", title: "必要狀態", items: [
            "無內容、首次建立、載入中、部分載入與載入失敗都有可辨識呈現。",
            "長標題、長說明、多媒體比例與大量內容不會破壞個人檔案排版。",
            "連續點擊、網路延遲、重整與返回不造成重複建立或更新遺失。",
            "沒有權限、內容不可用或已刪除時，不保留失效操作或可返回的舊內容。",
          ] },
        ],
      },
      {
        id: "profile-management",
        title: "管理個人檔案",
        blocks: [
          { type: "paragraph", text: "個人檔案管理在 Master 中提供 Desktop、Tablet 與 Mobile 對照。欄位與可見範圍可能依一般使用者或創作者身分不同，但儲存結果應在自己的檔案與他人看到的公開檔案一致。" },
          { type: "list", title: "跨裝置檢查", items: [
            "欄位標籤、目前值、字數限制、錯誤原因與儲存結果在三種裝置都完整可讀。",
            "鍵盤、圖片選擇或系統字級放大後，儲存與取消仍在可操作範圍內。",
            "切換身分、裝置或分頁後重新載入，已儲存資料一致；未儲存變更不會默默套用。",
            "公開與非公開資訊的邊界清楚，截圖與 issue 不包含真實個資或未公開內容。",
          ] },
        ],
      },
    ],
  },
  {
    slug: "media-chat",
    order: 7,
    rune: "VII",
    title: "影音與聊天",
    subtitle: "MEDIA CHANNEL",
    summary: "影片、短影音、限時動態與聊天室的瀏覽、狀態及跨裝置互動。",
    duration: "16 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
    sections: [
      {
        id: "media-map",
        title: "影音與訊息功能地圖",
        blocks: [
          { type: "paragraph", text: "Master Design File 將內容消費拆成影片、短影音、限時動態與聊天室四條路徑；直播內聊天室則留在「直播體驗」章。測試時先確認入口與內容類型，避免把相似的播放或訊息操作視為同一套狀態。" },
          { type: "table", title: "主要頁面", columns: ["功能域", "Master 範圍", "QA 觀察"], rows: [
            ["影片", "影片主頁與影片詳情", "列表到詳情、返回位置、播放狀態與內容可用性"],
            ["短影音", "短影音詳情", "連續瀏覽、切換內容、手勢與控制項不互相衝突"],
            ["限時動態", "限時動態詳情", "前後切換、結束／不可用狀態與離開路徑"],
            ["聊天室", "聊天室主畫面與聊天功能", "會話列表、訊息狀態、輸入與返回行為"],
          ] },
        ],
      },
      {
        id: "video-short-story",
        title: "影片、短影音與限時動態",
        blocks: [
          { type: "list", title: "共同檢查", items: [
            "載入中、無內容、播放失敗、內容不可用與重新嘗試都有明確狀態。",
            "播放、暫停、靜音、全螢幕、前後切換及離開操作符合目前內容類型與裝置能力。",
            "返回列表或切到下一則內容時，捲動位置、播放狀態與已看進度不會套到錯誤項目。",
            "直向、橫向、瀏覽器工具列與系統字幕不遮擋標題、控制項或離開操作。",
            "內容權限或可用狀態改變時，以可理解訊息取代失效播放器或無限載入。",
          ] },
          { type: "callout", tone: "tip", title: "內容類型差異", text: "短影音偏向連續切換，限時動態有結束邊界，長影片則有主頁到詳情的往返；三者可以共用播放器能力，但不可共用錯誤的返回、進度或切換規則。" },
        ],
      },
      {
        id: "chat",
        title: "聊天室主畫面與訊息",
        blocks: [
          { type: "steps", title: "基本訊息路徑", items: [
            "從聊天室主畫面辨識目標會話，確認未讀與最新狀態符合實際資料。",
            "進入會話後確認歷史訊息、載入邊界與目前輸入狀態。",
            "送出文字或需求允許的媒體，辨識送出中、成功與失敗。",
            "離開再返回，確認訊息順序、未讀狀態與草稿處理符合需求。",
          ] },
          { type: "list", title: "邊界與恢復", items: [
            "空會話、長訊息、快速連續訊息與大量歷史內容不造成跳動或遮擋。",
            "離線、重連、送出失敗與重試不會重複訊息，也不會把失敗顯示成成功。",
            "軟鍵盤、附件面板與輸入列開啟後，最新訊息與關閉操作仍在可視範圍。",
            "封鎖、權限不足或會話不可用時停止不適用操作，並提供安全的離開方式。",
          ] },
        ],
      },
      {
        id: "responsive-coverage",
        title: "跨裝置覆蓋",
        blocks: [
          { type: "paragraph", text: "影片、短影音、限時動態與聊天室頁在 Master 中皆有 Desktop、Tablet、Mobile 規格。驗證不只比較外觀，也要確認同一狀態在裝置切換、旋轉與較大系統字級下仍能完成核心操作。" },
        ],
      },
    ],
  },
  {
    slug: "settings",
    order: 8,
    rune: "VIII",
    title: "個人中心與設定",
    subtitle: "ACCOUNT CABIN",
    summary: "設定入口、聯盟夥伴、密碼安全、VIP 等級與 Lv.0 徽章。",
    duration: "12 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
    sections: [
      {
        id: "settings-navigation",
        title: "設定與聯盟夥伴入口",
        blocks: [
          { type: "paragraph", text: "聯盟夥伴入口在現行 Mockup 中重新安排版位，並同時提供 Mobile、Tablet 與 Desktop 對照。驗證時以新版區塊為準，舊版只用來確認遷移後沒有遺失入口或權限判斷。" },
          { type: "list", title: "導覽檢查", items: [
            "三種裝置尺寸都能從預期的個人選單或設定區找到入口，排序與分組一致。",
            "只有符合資格的帳號看見可用入口；不可用、未登入與地區限制都有明確處理。",
            "入口 badge、未讀狀態與目的頁一致，返回後仍回到正確的設定位置。",
            "鍵盤、觸控及長翻譯不會讓入口被裁切、遮擋或誤點相鄰項目。",
          ] },
        ],
      },
      {
        id: "password-security",
        title: "設定密碼流程",
        blocks: [
          { type: "steps", title: "安全路徑", items: [
            "由正確的帳號或安全入口開始，確認目前身分與可設定資格。",
            "輸入符合規則的新密碼，並完成必要的再次確認或驗證。",
            "送出後確認成功狀態、登入狀態與返回目的地。",
            "以新密碼重新驗證，並確認舊密碼或未完成流程不會被誤套用。",
          ] },
          { type: "callout", tone: "warning", title: "錯誤與證據", text: "規則不符、兩次輸入不同、驗證逾時與網路失敗要說明可恢復方式；截圖與 issue 不得包含密碼、驗證碼或可識別的帳號資料。" },
        ],
      },
      {
        id: "vip-levels",
        title: "VIP 1–100 與 Lv.0 顯示",
        blocks: [
          { type: "paragraph", text: "2026 VIP 新制由原本 1–8 級調整為 1–100 級；另一份 Moor／SWAG 共用設計規定 Lv.0 不顯示等級徽章資訊。兩項規則必須一起驗證，避免只更新數值範圍而留下舊徽章或舊排序。" },
          { type: "table", title: "邊界案例", columns: ["狀態", "預期呈現", "QA 觀察"], rows: [
            ["Lv.0", "不顯示等級徽章資訊", "個人頁、直播間、列表、Hover／Tooltip 與無障礙名稱一致"],
            ["Lv.1", "顯示新制最低有效等級", "由 Lv.0 升級後即時更新，不殘留空白占位"],
            ["Lv.100", "顯示新制最高等級", "三位數不爆版，排序、篩選與資料格式正確"],
            ["舊資料／延遲", "使用可辨識的載入或降級狀態", "不可回退成 1–8 級或把未知值當 Lv.0"],
          ] },
        ],
      },
    ],
  },
];

export const publishedWebChapters = webChapters.filter(
  (chapter) => chapter.status === "published" && chapter.sections,
);

export function getWebChapter(slug: string) {
  return publishedWebChapters.find((chapter) => chapter.slug === slug);
}
