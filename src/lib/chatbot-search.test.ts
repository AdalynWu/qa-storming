import assert from "node:assert/strict";
import test from "node:test";
import { searchKnowledgeChunks } from "./chatbot-search";
import type { KnowledgeChunk } from "../types/chatbot";

const chunks: KnowledgeChunk[] = [
  {
    id: "live-0",
    documentId: "live",
    title: "Web 直播體驗",
    href: "/products/web/live-experience",
    markdownPath: "product/web-live-experience.md",
    headingPath: ["直播失敗與恢復"],
    chunkIndex: 0,
    content: "直播間顯示 404 時，記錄入口、URL、時間、登入狀態與可恢復路徑。",
  },
  {
    id: "maestro-0",
    documentId: "maestro",
    title: "Maestro Mobile UI 自動化手冊",
    href: "/library/maestro",
    markdownPath: "tool/maestro.md",
    headingPath: ["Selector"],
    chunkIndex: 0,
    content: "selector 應優先使用穩定且可理解的識別方式。",
  },
];

test("中文問題會優先命中標題與內容相關段落", () => {
  const results = searchKnowledgeChunks(chunks, "如何回報直播間 404 問題？");
  assert.equal(results[0]?.chunk.id, "live-0");
});

test("中英文技術詞可以共同搜尋", () => {
  const results = searchKnowledgeChunks(chunks, "Maestro selector 怎麼選？");
  assert.equal(results[0]?.chunk.id, "maestro-0");
});

test("知識庫無關問題不會產生結果", () => {
  assert.deepEqual(searchKnowledgeChunks(chunks, "今天天氣如何？"), []);
});

test("空白問題不會產生結果", () => {
  assert.deepEqual(searchKnowledgeChunks(chunks, "   "), []);
});

// Regression fixture for natural-language questions: a keyword doc (keyword in
// title), a keyword-only-in-content doc, and two filler docs — one that even
// puts the filler phrase in its heading (the case that used to out-rank the
// real answer once the whole-phrase bonus and coverage bonus collapsed).
const ragChunks: KnowledgeChunk[] = [
  {
    id: "error-codes",
    documentId: "error-codes",
    title: "Error Code V2 錯誤碼圖鑑",
    href: "/library/error-codes",
    markdownPath: "qa-know-how/error-codes.md",
    headingPath: ["錯誤碼分類"],
    chunkIndex: 0,
    content: "1001 PAYLOAD_VALIDATION_ERROR 送出資料格式錯誤。4002 JWT_EXPIRED 登入已過期。",
  },
  {
    id: "deeplink",
    documentId: "deeplink",
    title: "行動端導流設定",
    href: "/library/deeplink",
    markdownPath: "product/deeplink.md",
    headingPath: ["導流"],
    chunkIndex: 0,
    content: "我們現在的 deeplink 設定會將使用者導向對應頁面。",
  },
  {
    id: "onboarding",
    documentId: "onboarding",
    title: "新手村報到指南",
    href: "/onboarding",
    markdownPath: "onboarding/intro.md",
    headingPath: ["我們的團隊"],
    chunkIndex: 0,
    content: "我們現在的排班方式與請假流程，新人現在可以先閱讀這份文件。",
  },
  {
    id: "process",
    documentId: "process",
    title: "測試流程總覽",
    href: "/library/process",
    markdownPath: "process/overview.md",
    headingPath: ["我們現在的做法"],
    chunkIndex: 0,
    content: "我們現在使用的回歸測試節奏與工具設定。",
  },
];

test("自然語句(關鍵詞被中文填充詞包住)仍命中正確文件", () => {
  const results = searchKnowledgeChunks(ragChunks, "我們現在有哪些 error code？");
  assert.equal(results[0]?.chunk.id, "error-codes");
});

test("填充詞不會讓分數相對純關鍵詞崩掉", () => {
  const bareScore = searchKnowledgeChunks(ragChunks, "error code")
    .find((result) => result.chunk.id === "error-codes")?.score ?? 0;
  const naturalScore = searchKnowledgeChunks(ragChunks, "我們現在有哪些 error code？")
    .find((result) => result.chunk.id === "error-codes")?.score ?? 0;
  assert.ok(
    naturalScore >= bareScore * 0.5,
    `自然語句分數 ${naturalScore} 應至少為純關鍵詞 ${bareScore} 的一半`,
  );
});

test("關鍵詞只在內文的文件,自然語句仍能檢索到", () => {
  const results = searchKnowledgeChunks(ragChunks, "我們現在的 deeplink 怎麼設定？");
  assert.equal(results[0]?.chunk.id, "deeplink");
});

