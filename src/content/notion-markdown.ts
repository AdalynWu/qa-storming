export type NotionMarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list" | "ordered-list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; tone: "tip" | "warning"; blocks: NotionMarkdownBlock[] }
  | { type: "details"; summary: string; blocks: NotionMarkdownBlock[] }
  | { type: "table"; rows: string[][] }
  | { type: "code"; language?: string; code: string }
  | { type: "divider" };

export type ParsedNotionMarkdown = {
  blocks: NotionMarkdownBlock[];
  tableOfContents: Array<{ id: string; title: string; level: 1 | 2 }>;
};

function stripIndent(value: string) {
  return value.replace(/^\s{1,4}/gm, "").trim();
}

function stripHeadingAttributes(value: string) {
  return value.replace(/\s+\{[^}]*\}\s*$/, "").trim();
}

function stripTags(value: string) {
  return value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, "").trim();
}

function slugifyHeading(value: string, fallback: number) {
  const slug = value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return `notion-${slug || `section-${fallback}`}`;
}

function startsSpecialBlock(line: string) {
  return /^(#{1,3})\s+/.test(line)
    || /^[-*]\s+/.test(line)
    || /^\d+[.)]\s+/.test(line)
    || /^>\s?/.test(line)
    || /^```/.test(line)
    || /^---+$/.test(line)
    || /^<(callout|details|table)\b/i.test(line);
}

export function parseNotionMarkdown(markdown: string): ParsedNotionMarkdown {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: NotionMarkdownBlock[] = [];
  const tableOfContents: ParsedNotionMarkdown["tableOfContents"] = [];
  const usedIds = new Map<string, number>();

  const uniqueHeadingId = (text: string) => {
    const base = slugifyHeading(text, usedIds.size + 1);
    const count = (usedIds.get(base) ?? 0) + 1;
    usedIds.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3;
      const text = stripHeadingAttributes(heading[2]);
      const id = uniqueHeadingId(text);
      blocks.push({ type: "heading", level, text, id });
      if (level === 1 || level === 2) tableOfContents.push({ id, title: text, level });
      index += 1;
      continue;
    }

    if (/^<callout\b/i.test(line)) {
      const opening = line;
      const content: string[] = [];
      index += 1;
      while (index < lines.length && !/^<\/callout>\s*$/i.test(lines[index].trim())) {
        content.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({
        type: "callout",
        tone: /(?:red|orange|yellow)_bg/i.test(opening) ? "warning" : "tip",
        blocks: parseNotionMarkdown(stripIndent(content.join("\n"))).blocks,
      });
      continue;
    }

    if (/^<details\b/i.test(line)) {
      const content: string[] = [];
      index += 1;
      while (index < lines.length && !/^<\/details>\s*$/i.test(lines[index].trim())) {
        content.push(lines[index]);
        index += 1;
      }
      index += 1;
      const joined = content.join("\n");
      const summaryMatch = joined.match(/<summary>([\s\S]*?)<\/summary>/i);
      const body = joined.replace(/<summary>[\s\S]*?<\/summary>/i, "");
      blocks.push({
        type: "details",
        summary: stripTags(summaryMatch?.[1] ?? "展開補充資訊"),
        blocks: parseNotionMarkdown(stripIndent(body)).blocks,
      });
      continue;
    }

    if (/^<table\b/i.test(line)) {
      const content: string[] = [lines[index]];
      index += 1;
      while (index < lines.length && !/<\/table>\s*$/i.test(lines[index].trim())) {
        content.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) content.push(lines[index]);
      index += 1;
      const html = content.join("\n");
      const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
        [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => stripTags(cell[1])),
      ).filter((row) => row.length > 0);
      if (rows.length) blocks.push({ type: "table", rows });
      continue;
    }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim() || undefined;
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", language, code: code.join("\n") });
      continue;
    }

    const listType = /^[-*]\s+/.test(line)
      ? "unordered-list"
      : /^\d+[.)]\s+/.test(line)
        ? "ordered-list"
        : undefined;
    if (listType) {
      const items: string[] = [];
      const pattern = listType === "unordered-list" ? /^[-*]\s+(.+)$/ : /^\d+[.)]\s+(.+)$/;
      while (index < lines.length) {
        const match = lines[index].trim().match(pattern);
        if (!match) break;
        items.push(match[1].trim());
        index += 1;
      }
      blocks.push({ type: listType, items });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push({ type: "divider" });
      index += 1;
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !startsSpecialBlock(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: stripTags(paragraph.join(" ")) });
  }

  return { blocks, tableOfContents };
}
