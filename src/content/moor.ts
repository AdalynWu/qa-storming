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
    "Moor 是創作者使用的 Mobile App，涵蓋直播、貼文、聊天、個人內容管理與數據分析。沿著冒險路徑逐章認識產品，也把容易遺漏的 QA 觀察一起帶走。",
  sourceLabel: "Moor App 使用手冊",
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
    sourceUpdatedAt: "2026-07-02",
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
    sourceUpdatedAt: "2026-07-31",
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
    summary: "創作者首頁、收益資訊、直播引導與內容捷徑。",
    duration: "待整理",
    status: "review",
  },
  {
    slug: "posts",
    order: 4,
    rune: "IV",
    title: "貼文功能",
    subtitle: "CONTENT GARDEN",
    summary: "建立、排程、編輯、刪除與管理創作者貼文。",
    duration: "待整理",
    status: "review",
  },
  {
    slug: "chat",
    order: 5,
    rune: "V",
    title: "聊天功能",
    subtitle: "MESSAGE GROVE",
    summary: "私訊、聊天室操作與常見互動狀態。",
    duration: "待整理",
    status: "review",
  },
  {
    slug: "profile",
    order: 6,
    rune: "VI",
    title: "我的頁面",
    subtitle: "PROFILE LODGE",
    summary: "個人檔案、設定、通知與已發布內容管理。",
    duration: "待整理",
    status: "review",
  },
  {
    slug: "analytics",
    order: 7,
    rune: "VII",
    title: "數據分析",
    subtitle: "INSIGHT OBSERVATORY",
    summary: "收益、觀看與成長數據的查看方式。",
    duration: "待整理",
    status: "review",
  },
  {
    slug: "other",
    order: 8,
    rune: "VIII",
    title: "其他功能",
    subtitle: "HIDDEN PATHS",
    summary: "推薦計畫、App 連結與跨模組輔助功能。",
    duration: "待整理",
    status: "review",
  },
];

export const publishedMoorChapters = moorChapters.filter(
  (chapter) => chapter.status === "published" && chapter.sections,
);

export function getMoorChapter(slug: string) {
  return publishedMoorChapters.find((chapter) => chapter.slug === slug);
}
