import type { KnowledgeChunk } from "@/types/chatbot";

const COMMON_TERMS = new Set([
  "一個", "以及", "什麼", "可以", "哪些", "如何", "怎樣", "怎麼", "是否",
  "為何", "為什麼", "目前", "相關", "請問", "進行", "這個", "使用", "需要",
  "應該", "問題", "資訊", "方法", "the", "and", "for", "how", "what", "with",
]);

export type SearchResult = {
  chunk: KnowledgeChunk;
  score: number;
};

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-Hant")
    .replace(/[^\p{Letter}\p{Number}._:/-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function queryTerms(question: string) {
  const normalized = normalizeSearchText(question);
  const terms = new Set<string>();

  for (const token of normalized.match(/[a-z0-9][a-z0-9._:/-]*/g) ?? []) {
    if (token.length >= 2 && !COMMON_TERMS.has(token)) terms.add(token);
  }

  for (const sequence of normalized.match(/[\p{Script=Han}]+/gu) ?? []) {
    for (const size of [2, 3]) {
      for (let index = 0; index <= sequence.length - size; index += 1) {
        const term = sequence.slice(index, index + size);
        if (!COMMON_TERMS.has(term)) terms.add(term);
      }
    }
  }

  return { normalized, terms: [...terms] };
}

export function searchKnowledgeChunks(
  chunks: KnowledgeChunk[],
  question: string,
  limit = 5,
): SearchResult[] {
  const { normalized: normalizedQuestion, terms } = queryTerms(question);
  if (!normalizedQuestion || terms.length === 0) return [];

  return chunks
    .map((chunk) => {
      const title = normalizeSearchText(chunk.title);
      const headings = normalizeSearchText(chunk.headingPath.join(" "));
      const content = normalizeSearchText(chunk.content);
      let score = 0;
      let matchedTerms = 0;

      if (normalizedQuestion.length >= 3 && title.includes(normalizedQuestion)) score += 28;
      if (normalizedQuestion.length >= 3 && headings.includes(normalizedQuestion)) score += 20;
      if (normalizedQuestion.length >= 3 && content.includes(normalizedQuestion)) score += 14;

      for (const term of terms) {
        let matched = false;
        if (title.includes(term)) { score += 9; matched = true; }
        if (headings.includes(term)) { score += 6; matched = true; }
        if (content.includes(term)) { score += term.length >= 4 ? 4 : 2; matched = true; }
        if (matched) matchedTerms += 1;
      }

      const coverage = matchedTerms / terms.length;
      if (coverage >= 0.6) score += 8;
      else if (coverage >= 0.35) score += 3;

      return { chunk, score };
    })
    .filter((result) => result.score >= 8)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))
    .slice(0, limit);
}

