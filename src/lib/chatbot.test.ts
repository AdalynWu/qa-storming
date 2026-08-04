import assert from "node:assert/strict";
import test from "node:test";
import {
  askKnowledgeBase,
  AI_BUSY_MESSAGE,
  ChatbotError,
  MAX_QUESTION_LENGTH,
  NO_RELEVANT_CONTENT,
  NOT_ENOUGH_INFORMATION,
} from "./chatbot";
import type { KnowledgeIndex } from "../types/chatbot";

const index: KnowledgeIndex = {
  _meta: { schemaVersion: 1, contentHash: "test", documentCount: 1, chunkCount: 1 },
  chunks: [{
    id: "web-404",
    documentId: "web-landing-seo",
    title: "Web Landing 與 SEO",
    href: "/products/web/landing-seo",
    markdownPath: "product/web-landing-seo.md",
    headingPath: ["404 與相關錯誤頁"],
    chunkIndex: 0,
    content: "404 錯誤頁需提供可用的恢復路徑。",
  }],
};

test("空白與超長問題會在檢索前拒絕", async () => {
  await assert.rejects(() => askKnowledgeBase(" "), (error: unknown) =>
    error instanceof ChatbotError && error.code === "empty-question");
  await assert.rejects(() => askKnowledgeBase("a".repeat(MAX_QUESTION_LENGTH + 1)), (error: unknown) =>
    error instanceof ChatbotError && error.code === "question-too-long");
});

test("精準命中的趣味問題不載入索引或呼叫模型", async () => {
  let indexCalled = false;
  let modelCalled = false;
  const answer = await askKnowledgeBase(" 今天適合上班嗎？ ", {
    random: () => 0,
    loadIndex: async () => { indexCalled = true; return index; },
    generate: async () => { modelCalled = true; return {}; },
  });
  assert.equal(answer.kind, "fun");
  assert.ok(answer.answer.length > 0);
  assert.deepEqual(answer.sources, []);
  assert.equal(indexCalled, false);
  assert.equal(modelCalled, false);
});

test("趣味回答可注入亂數且近似問題不會被誤攔", async () => {
  const firstAnswer = await askKnowledgeBase("今天適合上班嗎", { random: () => 0 });
  const lastAnswer = await askKnowledgeBase("今天適合上班嗎", { random: () => 0.99 });
  assert.notEqual(firstAnswer.answer, lastAnswer.answer);

  let indexCalled = false;
  await askKnowledgeBase("公司今天適合上班嗎", {
    loadIndex: async () => { indexCalled = true; return index; },
  });
  assert.equal(indexCalled, true);
});

test("找不到 chunk 時不呼叫模型", async () => {
  let called = false;
  const answer = await askKnowledgeBase("今天天氣如何？", {
    loadIndex: async () => index,
    generate: async () => { called = true; return {}; },
  });
  assert.equal(answer.answer, NO_RELEVANT_CONTENT);
  assert.equal(called, false);
});

test("只接受本次檢索結果中的引用", async () => {
  const answer = await askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    generate: async () => ({ sufficient: true, answer: "應提供恢復路徑。", usedChunkIds: ["web-404", "invented"] }),
  });
  assert.deepEqual(answer.sources, [{ title: "Web Landing 與 SEO", href: "/products/web/landing-seo" }]);
});

test("模型未提供有效引用時降級為資訊不足", async () => {
  const answer = await askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    generate: async () => ({ sufficient: true, answer: "任意回答", usedChunkIds: ["invented"] }),
  });
  assert.equal(answer.answer, NOT_ENOUGH_INFORMATION);
});

test("索引與 AI 失敗會回傳可辨識錯誤", async () => {
  await assert.rejects(() => askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => { throw new ChatbotError("index-unavailable", "索引失敗"); },
  }), (error: unknown) => error instanceof ChatbotError && error.code === "index-unavailable");

  await assert.rejects(() => askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    generate: async () => { throw new Error("secret provider error"); },
  }), (error: unknown) => error instanceof ChatbotError && error.code === "ai-unavailable");
});

test("模型暫時過載時會退避重試並在成功後正常回答", async () => {
  let modelCalls = 0;
  const delays: number[] = [];
  const answer = await askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    sleep: async (milliseconds) => { delays.push(milliseconds); },
    generate: async () => {
      modelCalls += 1;
      if (modelCalls < 3) {
        throw Object.assign(new Error("[500 Internal Server Error] high demand"), {
          code: "fetch-error",
          customErrorData: { status: 500 },
        });
      }
      return { sufficient: true, answer: "應提供恢復路徑。", usedChunkIds: ["web-404"] };
    },
  });

  assert.equal(answer.answer, "應提供恢復路徑。");
  assert.equal(modelCalls, 3);
  assert.deepEqual(delays, [400, 1_000]);
});

test("模型持續過載會顯示安全提示，非暫時性錯誤不重試", async () => {
  let busyCalls = 0;
  await assert.rejects(() => askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    sleep: async () => undefined,
    generate: async () => {
      busyCalls += 1;
      throw { code: 503, status: "UNAVAILABLE", message: "high demand" };
    },
  }), (error: unknown) =>
    error instanceof ChatbotError && error.message === AI_BUSY_MESSAGE);
  assert.equal(busyCalls, 3);

  let permissionCalls = 0;
  await assert.rejects(() => askKnowledgeBase("404 要注意什麼？", {
    loadIndex: async () => index,
    sleep: async () => { throw new Error("不應等待"); },
    generate: async () => {
      permissionCalls += 1;
      throw Object.assign(new Error("[403 Forbidden]"), { customErrorData: { status: 403 } });
    },
  }), (error: unknown) =>
    error instanceof ChatbotError && error.message === "賢者暫時無法完成回答，請稍後再試。");
  assert.equal(permissionCalls, 1);
});
