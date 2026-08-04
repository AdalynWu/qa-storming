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

// A query unit is one search concept: a Latin/number token, or one contiguous
// run of Han characters. Grouping a Han run into a single unit (whose `variants`
// are its 2/3-grams) is deliberate — it stops a filler phrase like「我們現在」
// from exploding into many n-gram "terms" that would otherwise out-score a real
// keyword and dilute the coverage ratio.
type QueryUnit = {
  variants: string[];
  contentWeight: number;
};

function queryUnits(question: string) {
  const normalized = normalizeSearchText(question);
  const units: QueryUnit[] = [];

  for (const token of normalized.match(/[a-z0-9][a-z0-9._:/-]*/g) ?? []) {
    if (token.length >= 2 && !COMMON_TERMS.has(token)) {
      units.push({ variants: [token], contentWeight: token.length >= 4 ? 4 : 2 });
    }
  }

  for (const sequence of normalized.match(/[\p{Script=Han}]+/gu) ?? []) {
    const variants = new Set<string>();
    for (const size of [2, 3]) {
      for (let index = 0; index <= sequence.length - size; index += 1) {
        const gram = sequence.slice(index, index + size);
        if (!COMMON_TERMS.has(gram)) variants.add(gram);
      }
    }
    if (variants.size > 0) units.push({ variants: [...variants], contentWeight: 2 });
  }

  return { normalized, units };
}

const unitOccurs = (text: string, unit: QueryUnit) =>
  unit.variants.some((variant) => text.includes(variant));

export function searchKnowledgeChunks(
  chunks: KnowledgeChunk[],
  question: string,
  limit = 5,
): SearchResult[] {
  const { normalized: normalizedQuestion, units } = queryUnits(question);
  if (!normalizedQuestion || units.length === 0) return [];

  // Normalize each chunk's searchable fields once (reused for df + scoring).
  const normalizedChunks = chunks.map((chunk) => ({
    chunk,
    title: normalizeSearchText(chunk.title),
    headings: normalizeSearchText(chunk.headingPath.join(" ")),
    content: normalizeSearchText(chunk.content),
  }));

  // Document frequency per unit. Units that match nothing (junk CJK n-grams or
  // unrelated fillers) are dropped so they can't inflate the coverage denominator.
  // Surviving units are IDF-weighted (clamped to ~[0.5, 1.5]) so distinctive
  // terms (small df, e.g. error/code) outweigh common ones (large df, e.g.
  // 現在/我們) while keeping the score scale — and the score >= 8 gate — close to
  // the previous design.
  const total = chunks.length;
  const idfCeiling = Math.log(1 + total) || 1;
  const active: { unit: QueryUnit; weight: number }[] = [];
  for (const unit of units) {
    let df = 0;
    for (const entry of normalizedChunks) {
      if (unitOccurs(entry.title, unit) || unitOccurs(entry.headings, unit) || unitOccurs(entry.content, unit)) {
        df += 1;
      }
    }
    if (df > 0) active.push({ unit, weight: 0.5 + Math.log(1 + total / df) / idfCeiling });
  }
  if (active.length === 0) return [];

  const totalWeight = active.reduce((sum, item) => sum + item.weight, 0);

  return normalizedChunks
    .map(({ chunk, title, headings, content }) => {
      let score = 0;
      let matchedWeight = 0;

      if (normalizedQuestion.length >= 3 && title.includes(normalizedQuestion)) score += 28;
      if (normalizedQuestion.length >= 3 && headings.includes(normalizedQuestion)) score += 20;
      if (normalizedQuestion.length >= 3 && content.includes(normalizedQuestion)) score += 14;

      for (const { unit, weight } of active) {
        let matched = false;
        if (unitOccurs(title, unit)) { score += 9 * weight; matched = true; }
        if (unitOccurs(headings, unit)) { score += 6 * weight; matched = true; }
        if (unitOccurs(content, unit)) { score += unit.contentWeight * weight; matched = true; }
        if (matched) matchedWeight += weight;
      }

      // Weighted coverage over units: unmatched low-signal units barely move the
      // denominator, so a natural-language question isn't penalised for its filler.
      const coverage = totalWeight > 0 ? matchedWeight / totalWeight : 0;
      if (coverage >= 0.6) score += 8;
      else if (coverage >= 0.35) score += 3;

      return { chunk, score };
    })
    .filter((result) => result.score >= 8)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))
    .slice(0, limit);
}
