import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { docsManifestSchema, type GeneratedDoc } from "../src/content/docs";
import { parseNotionMarkdown, type NotionMarkdownBlock } from "../src/content/notion-markdown";
import { knowledgeIndexSchema, type KnowledgeChunk } from "../src/types/chatbot";
import manifestJson from "../src/content/generated/docs/manifest.json";

const CONTENT_ROOT = path.resolve("src/content/generated/docs");
const OUTPUT_PATH = path.resolve("public/chatbot-search-index.json");
const MAX_CHUNK_LENGTH = 1_200;
const TARGET_CHUNK_LENGTH = 800;

type TextSegment = { text: string; headingPath: string[] };

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function publicHref(document: GeneratedDoc) {
  if (document.documentType === "chapter" && document.productKey && document.chapterSlug) {
    return `/products/${document.productKey}/${document.chapterSlug}`;
  }
  if (document.documentType === "standalone") return `/library/${document.slug}`;
  if (document.documentType === "hub" && document.productKey) return `/products/${document.productKey}`;
  throw new Error(`無法建立 Chatbot 文件路由：${document.slug}`);
}

function inlineMarkdownToText(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block: NotionMarkdownBlock): string {
  switch (block.type) {
    case "heading": return block.text;
    case "paragraph":
    case "quote": return inlineMarkdownToText(block.text);
    case "unordered-list": return block.items.map((item) => `- ${inlineMarkdownToText(item)}`).join("\n");
    case "ordered-list": return block.items.map((item, index) => `${index + 1}. ${inlineMarkdownToText(item)}`).join("\n");
    case "table": return block.rows.map((row) => row.map(inlineMarkdownToText).join(" | ")).join("\n");
    case "code": return [block.language ? `程式碼語言：${block.language}` : "程式碼", block.code].join("\n");
    case "details": return [block.summary, ...block.blocks.map(blockText)].filter(Boolean).join("\n");
    case "callout": return block.blocks.map(blockText).filter(Boolean).join("\n");
    case "divider": return "";
  }
}

function toSegments(blocks: NotionMarkdownBlock[]) {
  const headingPath: string[] = [];
  const segments: TextSegment[] = [];

  for (const block of blocks) {
    if (block.type === "heading") {
      headingPath.splice(block.level - 1);
      headingPath[block.level - 1] = block.text;
    }
    const text = blockText(block).trim();
    if (text) segments.push({ text, headingPath: headingPath.filter(Boolean) });
  }
  return segments;
}

function splitLongText(text: string) {
  const parts: string[] = [];
  let rest = text;
  while (rest.length > MAX_CHUNK_LENGTH) {
    const window = rest.slice(0, MAX_CHUNK_LENGTH + 1);
    const boundary = Math.max(
      window.lastIndexOf("\n"),
      window.lastIndexOf("。"),
      window.lastIndexOf("；"),
      window.lastIndexOf(" "),
    );
    const end = boundary >= TARGET_CHUNK_LENGTH / 2 ? boundary + 1 : MAX_CHUNK_LENGTH;
    parts.push(rest.slice(0, end).trim());
    rest = rest.slice(end).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

function chunkSegments(segments: TextSegment[]) {
  const chunks: TextSegment[] = [];
  let current = "";
  let currentHeading: string[] = [];

  const flush = () => {
    if (current.trim()) chunks.push({ text: current.trim(), headingPath: currentHeading });
    current = "";
    currentHeading = [];
  };

  for (const segment of segments) {
    for (const piece of splitLongText(segment.text)) {
      const candidate = current ? `${current}\n${piece}` : piece;
      if (current && candidate.length > MAX_CHUNK_LENGTH && current.length >= TARGET_CHUNK_LENGTH / 2) flush();
      if (!current) currentHeading = segment.headingPath;
      current = current ? `${current}\n${piece}` : piece;
      if (current.length >= TARGET_CHUNK_LENGTH) flush();
    }
  }
  flush();
  return chunks;
}

async function buildDocumentChunks(document: GeneratedDoc): Promise<KnowledgeChunk[]> {
  if (!document.markdownPath) return [];
  const markdownPath = path.resolve(CONTENT_ROOT, document.markdownPath);
  if (!markdownPath.startsWith(`${CONTENT_ROOT}${path.sep}`)) {
    throw new Error(`不安全的 Chatbot Markdown 路徑：${document.markdownPath}`);
  }
  const markdown = await readFile(markdownPath, "utf8");
  const chunks = chunkSegments(toSegments(parseNotionMarkdown(markdown).blocks));
  return chunks.map((chunk, chunkIndex) => ({
    id: `${document.slug}-${hash(`${chunkIndex}:${chunk.text}`).slice(0, 10)}`,
    documentId: document.slug,
    title: document.title,
    href: publicHref(document),
    markdownPath: document.markdownPath!,
    headingPath: chunk.headingPath,
    chunkIndex,
    content: chunk.text,
  }));
}

async function main() {
  const manifest = docsManifestSchema.parse(manifestJson);
  const documents = manifest.documents.filter((document) =>
    document.publishMode === "full" && document.reviewStatus === "approved" && document.markdownPath,
  );
  const chunks = (await Promise.all(documents.map(buildDocumentChunks))).flat();
  const index = knowledgeIndexSchema.parse({
    _meta: {
      schemaVersion: 1,
      contentHash: hash(JSON.stringify(chunks)),
      documentCount: documents.length,
      chunkCount: chunks.length,
    },
    chunks,
  });
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.info(`Chatbot 索引完成：${documents.length} 份核准文件、${chunks.length} 個段落 → ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(`Chatbot 索引失敗：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

