export type MoorChapterStatus = "published" | "review";

export type MoorContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "steps"; title: string; items: string[] }
  | { type: "list"; title: string; items: string[] }
  | { type: "table"; title: string; columns: string[]; rows: string[][] }
  | { type: "callout"; tone: "tip" | "warning"; title: string; text: string };

export type MoorSection = {
  id: string;
  title: string;
  blocks: MoorContentBlock[];
};

export type MoorChapter = {
  slug: string;
  order: number;
  rune: string;
  title: string;
  subtitle: string;
  summary: string;
  duration: string;
  status: MoorChapterStatus;
  sourceUpdatedAt?: string;
  sections?: MoorSection[];
};

export const moorProduct = {
  id: "moor",
  name: "Moor",
  realmName: "創作者聖域",
  eyebrow: "MOOR · CREATOR SANCTUARY",
  description:
    "Moor 是創作者使用的 Mobile App，涵蓋登入、數據、任務、直播、貼文、聊天、個人內容管理與通知設定。沿著冒險路徑逐章認識產品，也把 2026 跨端流程中容易遺漏的 QA 觀察一起帶走。",
  sourceLabel: "Moor App 使用手冊、MOOR Master Design File 與 2026 跨端設計專案",
};

export const moorChapters: MoorChapter[] = [
  {
    slug: "quick-start",
    order: 1,
    rune: "I",
    title: "快速入門",
    subtitle: "FIRST STEPS",
    summary: "取得測試版本、確認環境並完成主播帳號登入。",
    duration: "6 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
    sections: [
      {
        id: "prepare",
        title: "開始前準備",
        blocks: [
          {
            type: "paragraph",
            text: "開始測試前，先確認本次任務指定的裝置平台、環境、App 版本與測試帳號。不要以私人帳號或未核准的 production 資料進行驗證。",
          },
          {
            type: "steps",
            title: "取得並安裝 Moor",
            items: [
              "向負責窗口取得本次測試使用的核准下載方式。",
              "依裝置平台安裝指定版本，完成後記錄版本號與 build。",
              "首次開啟時依測試需求授權通知、相機、麥克風與藍牙。",
              "確認目前環境與測試帳號後再開始操作。",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "QA 安全提醒",
            text: "截圖、錄影與 issue 證據不得包含真實個資、驗證碼、存取權杖或付款資訊。",
          },
        ],
      },
      {
        id: "login",
        title: "主播登入",
        blocks: [
          {
            type: "paragraph",
            text: "Moor 可能依版本與地區提供手機驗證碼、Email 密碼或第三方登入。實際可用方式以本次測試版本為準。",
          },
          {
            type: "list",
            title: "基本驗證清單",
            items: [
              "正確帳密或驗證碼可以完成登入。",
              "無效、過期與錯誤輸入會顯示可理解的提示。",
              "重複操作不會造成多次導頁或畫面卡死。",
              "重新開啟 App 後，登入狀態符合產品規格。",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "建議保留的測試證據",
            text: "記錄裝置、OS、App 版本、環境、登入方式、實際結果與發生時間，方便工程團隊重現。",
          },
        ],
      },
      {
        id: "creator-registration-consent",
        title: "創作者註冊與本人同意",
        blocks: [
          {
            type: "paragraph",
            text: "現行 Moor 金流合規 Mockup 在創作者註冊的媒體上傳流程加入本人同意勾選，並提供 Mobile 空白／已填寫狀態與 Desktop Registration 對照。",
          },
          {
            type: "list",
            title: "合規欄位檢查",
            items: [
              "未勾選本人同意時不可略過必要確認，錯誤訊息要靠近欄位且說明下一步。",
              "上傳、替換或移除媒體後，同意狀態與送出資格依規格正確保留或重設。",
              "Mobile 與 Desktop 的欄位順序、必填狀態、說明文案與送出結果一致。",
              "返回、重整、網路失敗與重複送出不會建立重複申請或留下不完整資料。",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "敏感資料",
            text: "媒體、身分與申請資料只使用核准測試素材；公開 issue 應遮蔽個資、檔案內容與任何可追溯申請人的資訊。",
          },
        ],
      },
    ],
  },
  {
    slug: "live",
    order: 2,
    rune: "II",
    title: "直播功能",
    subtitle: "LIVE EXPEDITION",
    summary: "從開播設定、直播工具與互動，到下播後的完整旅程。",
    duration: "18 分鐘",
    status: "published",
    sourceUpdatedAt: "2026-08-03",
    sections: [
      {
        id: "start-live",
        title: "開始直播",
        blocks: [
          {
            type: "steps",
            title: "基本開播流程",
            items: [
              "開啟 Moor，從底部導覽列進入建立內容入口。",
              "選擇直播，設定直播類型、標題與分類標籤。",
              "確認鏡頭、聲音與直播資訊後儲存設定。",
              "進入直播預覽頁，確認連線狀態後開始直播。",
            ],
          },
          {
            type: "table",
            title: "直播方式",
            columns: ["模式", "用途", "QA 觀察"],
            rows: [
              ["一般直播", "使用手機鏡頭直接直播", "相機、麥克風、前後鏡頭與連線狀態"],
              ["OBS 直播", "由電腦推流，Moor 控制直播流程", "推流連線、狀態同步與異常恢復"],
            ],
          },
        ],
      },
      {
        id: "pre-live",
        title: "直播前設定",
        blocks: [
          {
            type: "list",
            title: "必要資訊",
            items: [
              "直播類型必須有明確預設值與選取狀態。",
              "直播標題必填，需驗證字數限制、空白與錯誤提示。",
              "直播標籤至少選擇一項，並驗證選取上限與解除選取。",
              "關閉設定畫面或取消流程後，應回到正確頁面且不誤開播。",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "AI 輔助功能",
            text: "部分版本可能提供直播助理與直播精華。測試時需特別確認開關預設、額度或可用狀態、通知與下播後的內容去向。",
          },
        ],
      },
      {
        id: "audio-live",
        title: "語音直播",
        blocks: [
          {
            type: "paragraph",
            text: "語音直播的現行設計分別整理 Moor 主播端與 SWAG 觀看端。Moor 端需涵蓋建立語音房、麥克風與直播狀態；兩端的直播卡、房型與參與者狀態必須一致。",
          },
          {
            type: "list",
            title: "主播端檢查",
            items: [
              "建立與開啟語音直播時，房型、標題、封面及必要設定正確帶入。",
              "麥克風權限、靜音、切到背景、來電或音訊裝置切換後有明確狀態。",
              "聽眾加入、離開、斷線與重新連線後，參與者及在線資訊合理同步。",
              "結束直播後停止傳送聲音，並回到正確的結果或管理頁。",
            ],
          },
        ],
      },
      {
        id: "ai-assistant",
        title: "直播 AI 助理",
        blocks: [
          {
            type: "paragraph",
            text: "直播 AI 助理目前以 Moor 的 Merged Mockup 為來源，重點包含開播前設定與真實使用者隔離。若測試版本未開放，不應把設計稿視為所有帳號都已可用。",
          },
          {
            type: "list",
            title: "功能與隔離",
            items: [
              "符合條件的測試帳號看見正確入口；一般使用者不會誤觸或收到相關通知。",
              "開關預設、設定保存、開播中狀態及下播後結果符合本次版本規格。",
              "功能不可用、額度不足、生成失敗或網路中斷時有明確替代路徑。",
              "AI 產出需能辨識來源與狀態，不把處理中或失敗內容誤當已完成結果。",
            ],
          },
        ],
      },
      {
        id: "live-tools",
        title: "直播工具與互動",
        blocks: [
          {
            type: "list",
            title: "直播工具列",
            items: [
              "美顏與濾鏡：確認效果套用、關閉及切換鏡頭後的狀態。",
              "鏡像翻轉：確認預覽與實際直播畫面的方向符合預期。",
              "外接玩具：確認權限、搜尋、配對、離線、低電量與重新連線。",
              "互動指令：確認新增、編輯、排序、啟停與上下限提示。",
            ],
          },
          {
            type: "list",
            title: "直播中的互動",
            items: [
              "聊天、公告與置頂內容可正常新增、編輯及移除。",
              "排行榜、收益與即時在線人數更新一致。",
              "切換房間模式時，觀看權限與付費狀態正確更新。",
              "網路中斷、切到背景再返回時，畫面提供明確狀態與恢復方式。",
            ],
          },
        ],
      },
      {
        id: "live-2026",
        title: "2026 直播介面與跨端流程",
        blocks: [
          {
            type: "paragraph",
            text: "本節以 2026 專案中的綠色 Mockup／Ready for dev 為主，MOOR Master Design File 只用來補足功能範圍；Sandbox、遺棄版本與較舊方案不列入目前行為。",
          },
          {
            type: "table",
            title: "近期設計重點",
            columns: ["範圍", "目前方向", "QA 觀察"],
            rows: [
              ["直播首屏", "優先呈現目前直播資訊、釘選內容與必要提示", "新開直播、無歷史資料、蓋版與圖層前後關係"],
              ["簡化介面", "降低聊天室與工具對直播畫面的遮擋", "直向／橫向定位、滿版狀態、文字對比與安全區"],
              ["募資互動", "SWAG 觀看端與 MOOR 主播端共用同一場活動狀態", "進度、取得資格、公告、安可與提前結束的狀態同步"],
              ["排行榜", "前三名需要有足夠的層級差異", "名次、底色、資料延遲與空狀態不可互相誤認"],
            ],
          },
          {
            type: "list",
            title: "跨裝置驗證清單",
            items: [
              "手機直向與橫向都要保留主要 CTA；內容超高時由內容區捲動，不讓操作被裁切。",
              "聊天室、公告、置頂內容、指令與活動提示需維持可讀對比，且不遮住關鍵直播內容。",
              "SWAG 端取得資格、進度或直播狀態改變後，MOOR 端需在合理時間內反映一致狀態。",
              "新直播、無資料、載入中、網路中斷與活動結束後，都需顯示明確且可恢復的狀態。",
              "翻譯後文字、數字與排名資料需涵蓋最長內容，避免按鈕、Modal 或橫向畫面爆版。",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "版本判讀",
            text: "若 Master File 與 2026 專案不同，以 2026 綠色 Mockup／Ready for dev 為準；仍在討論或標為 Enhancement 的項目，不視為已上線功能。",
          },
        ],
      },
      {
        id: "after-live",
        title: "下播後操作",
        blocks: [
          {
            type: "list",
            title: "結束直播後",
            items: [
              "確認直播確實結束，不再持續傳送影像或聲音。",
              "檢查直播紀錄、收益與表現摘要是否對應本場直播。",
              "若有自動訊息或精華功能，確認內容、通知與保存期限。",
              "遇到技術問題時，透過問題回報入口提交足夠的重現資訊。",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "高風險測試情境",
            text: "優先涵蓋網路中斷、權限被關閉、裝置低電量、App 進入背景、重複點擊開關播，以及直播模式切換失敗後的恢復。",
          },
        ],
      },
    ],
  },
  {
    slug: "creator-hub",
    order: 3,
    rune: "III",
    title: "Creator Hub",
    subtitle: "CREATOR HALL",
    summary: "創作者首頁、主播任務、收益資訊、直播引導與建立內容入口。",
    duration: "10 分鐘",
    status: "published",
  },
  {
    slug: "posts",
    order: 4,
    rune: "IV",
    title: "貼文功能",
    subtitle: "CONTENT GARDEN",
    summary: "建立限時動態或貼文，並管理、更新與刪除已發布內容。",
    duration: "12 分鐘",
    status: "published",
  },
  {
    slug: "chat",
    order: 5,
    rune: "V",
    title: "聊天功能",
    subtitle: "MESSAGE GROVE",
    summary: "聊天室主頁、單一聊天室與訊息互動功能。",
    duration: "10 分鐘",
    status: "published",
  },
  {
    slug: "profile",
    order: 6,
    rune: "VI",
    title: "我的頁面",
    subtitle: "PROFILE LODGE",
    summary: "創作者檔案、VIP 等級與 Lv.0 徽章、直播時段、內容管理、推薦、通知與設定。",
    duration: "10 分鐘",
    status: "published",
  },
  {
    slug: "analytics",
    order: 7,
    rune: "VII",
    title: "數據分析",
    subtitle: "INSIGHT OBSERVATORY",
    summary: "直播收益、觀看、排名、日期範圍與成長數據的查看方式。",
    duration: "10 分鐘",
    status: "published",
  },
  {
    slug: "other",
    order: 8,
    rune: "VIII",
    title: "其他功能",
    subtitle: "HIDDEN PATHS",
    summary: "推薦計畫、通知設定與跨模組輔助功能。",
    duration: "8 分鐘",
    status: "published",
  },
];

export const publishedMoorChapters = moorChapters.filter(
  (chapter) => chapter.status === "published",
);

export function getMoorChapter(slug: string) {
  return publishedMoorChapters.find((chapter) => chapter.slug === slug);
}
