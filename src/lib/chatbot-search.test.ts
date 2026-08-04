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

