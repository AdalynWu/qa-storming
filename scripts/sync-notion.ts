import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import net from "node:net";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Client } from "@notionhq/client";
import { z } from "zod";
import {
  docCategorySchema,
  docsManifestSchema,
  type DocsManifest,
  type GeneratedDoc,
} from "../src/content/docs";

const OUTPUT_PATH = path.resolve("src/content/generated/docs");
const PREVIEW_OUTPUT_PATH = path.resolve("work/notion-preview");
const PREVIEW_FLAG = "--preview";
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30_000;

const REQUIRED_PROPERTIES = {
  Title: "title",
  "Source Page URL": "url",
  Slug: "rich_text",
  Category: "select",
  Order: "number",
  Summary: "rich_text",
  "Publish Mode": "select",
  Status: "select",
  Owner: "people",
  "Last edited time": "last_edited_time",
} as const;

const rawCatalogItemSchema = z.object({
  notionPageId: z.string().min(1),
  title: z.string().min(1),
  sourceUrl: z.url(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: docCategorySchema,
  order: z.number().finite(),
  summary: z.string(),
  publishMode: z.enum(["full", "link-only", "hidden"]),
  status: z.enum(["draft", "published", "archived"]),
  owner: z.string().min(1).optional(),
  lastEditedTime: z.string().min(1),
}).strict();

type RawCatalogItem = z.infer<typeof rawCatalogItemSchema>;

type MarkdownResult = {
  markdown: string;
  truncated: boolean;
  unknownBlockIds: string[];
};

export type NotionGateway = {
  getCatalogPropertyTypes: () => Promise<Record<string, string>>;
  queryCatalog: () => Promise<unknown[]>;
  retrieveMarkdown: (pageId: string) => Promise<MarkdownResult>;
};

type SyncOptions = {
  gateway: NotionGateway;
  outputPath: string;
  fetchImpl?: typeof fetch;
};

function hash(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function property(page: Record<string, unknown>, name: string) {
  const properties = page.properties;
  if (!isRecord(properties) || !isRecord(properties[name])) {
    throw new Error(`Catalog 項目缺少 ${name}`);
  }
  return properties[name];
}

function richTextValue(value: Record<string, unknown>, field: string) {
  const items = value[field];
  if (!Array.isArray(items)) return "";
  return items.map((item) => isRecord(item) && typeof item.plain_text === "string" ? item.plain_text : "").join("").trim();
}

function selectValue(value: Record<string, unknown>) {
  return isRecord(value.select) && typeof value.select.name === "string" ? value.select.name : "";
}

function peopleValue(value: Record<string, unknown>) {
  if (!Array.isArray(value.people)) return undefined;
  const names = value.people.flatMap((person) => {
    if (!isRecord(person)) return [];
    if (typeof person.name === "string" && person.name.trim()) return [person.name.trim()];
    if (typeof person.id === "string" && person.id.trim()) return [person.id.trim()];
    return [];
  });
  return names.length ? names.join(", ") : undefined;
}

export function extractNotionPageId(url: string) {
  const parsed = new URL(url);
  if (!parsed.hostname.endsWith("notion.so") && parsed.hostname !== "app.notion.com") {
    throw new Error(`Source Page URL 不是 Notion 網址：${url}`);
  }
  const compactId = parsed.pathname.match(/([0-9a-f]{32})(?:\/)?$/i)?.[1];
  if (!compactId) throw new Error(`無法從 Source Page URL 取得 page ID：${url}`);
  return compactId.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    "$1-$2-$3-$4-$5",
  );
}

export function parseCatalogPage(value: unknown): RawCatalogItem {
  if (!isRecord(value)) throw new Error("Catalog 查詢包含無效項目");
  const sourceUrlProperty = property(value, "Source Page URL");
  const orderProperty = property(value, "Order");
  const lastEditedProperty = property(value, "Last edited time");
  const sourceUrl = typeof sourceUrlProperty.url === "string" ? sourceUrlProperty.url.trim() : "";
  extractNotionPageId(sourceUrl);

  return rawCatalogItemSchema.parse({
    notionPageId: typeof value.id === "string" ? value.id : "",
    title: richTextValue(property(value, "Title"), "title"),
    sourceUrl,
    slug: richTextValue(property(value, "Slug"), "rich_text"),
    category: selectValue(property(value, "Category")),
    order: orderProperty.number,
    summary: richTextValue(property(value, "Summary"), "rich_text"),
    publishMode: selectValue(property(value, "Publish Mode")),
    status: selectValue(property(value, "Status")),
    owner: peopleValue(property(value, "Owner")),
    lastEditedTime: typeof lastEditedProperty.last_edited_time === "string"
      ? lastEditedProperty.last_edited_time
      : typeof value.last_edited_time === "string" ? value.last_edited_time : "",
  });
}

export function validateCatalogPropertyTypes(propertyTypes: Record<string, string>) {
  const problems = Object.entries(REQUIRED_PROPERTIES).flatMap(([name, expected]) => {
    const actual = propertyTypes[name];
    return actual === expected ? [] : [`${name} 應為 ${expected}，目前為 ${actual ?? "不存在"}`];
  });
  if (problems.length) throw new Error(`Website Docs Catalog schema 不正確：${problems.join("；")}`);
}

function assertUniqueSlugs(items: RawCatalogItem[]) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) throw new Error(`重複的文件 slug：${item.slug}`);
    seen.add(item.slug);
  }
}

function isBlockedImageHost(hostname: string) {
  const lower = hostname.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".localhost") || lower.endsWith(".local")) return true;
  if (net.isIP(lower) === 4) {
    const [a, b] = lower.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:");
}

function imageExtension(contentType: string, url: URL) {
  const fromType: Record<string, string> = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
  };
  if (fromType[contentType]) return fromType[contentType];
  const extension = path.extname(url.pathname).toLowerCase();
  return [".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"].includes(extension) ? extension : ".bin";
}

async function fetchWithRetry(fetchImpl: typeof fetch, url: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (response.ok) return response;
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`圖片下載失敗 (${response.status})：${url}`);
    }
    if (attempt === 2) throw new Error(`圖片下載重試失敗 (${response.status})：${url}`);
    const retryAfter = Number(response.headers.get("retry-after"));
    await new Promise((resolve) => setTimeout(resolve, Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt));
  }
  throw new Error(`圖片下載失敗：${url}`);
}

export function findRemoteImageUrls(markdown: string) {
  const urls = new Set<string>();
  const patterns = [
    /!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g,
    /<(?:img|image|attachment)\b[^>]*?\b(?:src|source)=["'](https?:\/\/[^"']+)["'][^>]*>/g,
  ];
  for (const pattern of patterns) {
    for (const match of markdown.matchAll(pattern)) urls.add(match[1]);
  }
  return [...urls];
}

async function localizeImages(markdown: string, assetsDirectory: string, fetchImpl: typeof fetch) {
  let localized = markdown;
  for (const remoteUrl of findRemoteImageUrls(markdown)) {
    const url = new URL(remoteUrl);
    if (url.protocol !== "https:" || isBlockedImageHost(url.hostname)) {
      throw new Error(`拒絕下載不安全的圖片網址：${remoteUrl}`);
    }
    const response = await fetchWithRetry(fetchImpl, remoteUrl);
    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (!contentType.startsWith("image/")) throw new Error(`圖片網址回傳非圖片內容：${remoteUrl}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) {
      throw new Error(`圖片大小無效或超過 20 MB：${remoteUrl}`);
    }
    const filename = `${hash(bytes)}${imageExtension(contentType, url)}`;
    await fs.writeFile(path.join(assetsDirectory, filename), bytes);
    localized = localized.split(remoteUrl).join(`../assets/${filename}`);
  }
  return localized;
}

async function replaceDirectoryAtomically(temporaryPath: string, outputPath: string) {
  const backupPath = `${outputPath}.backup-${process.pid}`;
  const outputExists = await fs.stat(outputPath).then(() => true, () => false);
  if (outputExists) await fs.rename(outputPath, backupPath);
  try {
    await fs.rename(temporaryPath, outputPath);
  } catch (error) {
    if (outputExists) await fs.rename(backupPath, outputPath);
    throw error;
  }
  if (outputExists) {
    await fs.rm(backupPath, { recursive: true, force: true }).catch((error) => {
      console.warn(`新輸出已安裝，但無法清除備份 ${backupPath}：${error instanceof Error ? error.message : String(error)}`);
    });
  }
}

async function loadPreviousManifest(outputPath: string) {
  try {
    return docsManifestSchema.parse(JSON.parse(await fs.readFile(path.join(outputPath, "manifest.json"), "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw new Error(`既有 Notion manifest 無法讀取：${error instanceof Error ? error.message : String(error)}`);
  }
}

function assertNoUnexpectedRemovals(previous: DocsManifest | undefined, items: RawCatalogItem[]) {
  if (!previous) return;
  const currentBySlug = new Map(items.map((item) => [item.slug, item]));
  const unexpected = previous.documents.filter((document) => {
    const current = currentBySlug.get(document.slug);
    if (!current) return true;
    if (current.status === "archived" || current.publishMode === "hidden") return false;
    return current.status !== "published";
  });
  if (unexpected.length) {
    throw new Error(`下列已發布文件無預警消失，請先設為 archived 或 hidden：${unexpected.map((item) => item.slug).join(", ")}`);
  }
}

export async function synchronizeNotionDocuments({
  gateway,
  outputPath,
  fetchImpl = fetch,
}: SyncOptions): Promise<DocsManifest> {
  validateCatalogPropertyTypes(await gateway.getCatalogPropertyTypes());
  const items = (await gateway.queryCatalog()).map(parseCatalogPage);
  assertUniqueSlugs(items);
  const previousManifest = await loadPreviousManifest(outputPath);
  assertNoUnexpectedRemovals(previousManifest, items);
  const publishedItems = items
    .filter((item) => item.status === "published" && item.publishMode !== "hidden")
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

  const parentDirectory = path.dirname(outputPath);
  const temporaryPath = path.join(parentDirectory, `.${path.basename(outputPath)}.tmp-${process.pid}-${Date.now()}`);
  await fs.mkdir(path.join(temporaryPath, "assets"), { recursive: true });

  try {
    const documents: GeneratedDoc[] = [];
    for (const item of publishedItems) {
      let markdownPath: string | undefined;
      let contentHash = hash(JSON.stringify(item));
      if (item.publishMode === "full") {
        const pageId = extractNotionPageId(item.sourceUrl);
        const result = await gateway.retrieveMarkdown(pageId);
        if (result.truncated || result.unknownBlockIds.length) {
          throw new Error(`${item.slug} 的 Markdown 不完整或含未知 block`);
        }
        const markdown = await localizeImages(
          result.markdown.trimEnd(),
          path.join(temporaryPath, "assets"),
          fetchImpl,
        );
        markdownPath = `${item.category}/${item.slug}.md`;
        await fs.mkdir(path.join(temporaryPath, item.category), { recursive: true });
        await fs.writeFile(path.join(temporaryPath, markdownPath), `${markdown}\n`, "utf8");
        contentHash = hash(markdown);
      }
      documents.push({
        notionPageId: extractNotionPageId(item.sourceUrl),
        title: item.title,
        slug: item.slug,
        category: item.category,
        order: item.order,
        summary: item.summary,
        publishMode: item.publishMode === "full" ? "full" : "link-only",
        sourceUrl: item.sourceUrl,
        owner: item.owner,
        lastEditedTime: item.lastEditedTime,
        contentHash,
        markdownPath,
      });
    }

    const manifest = docsManifestSchema.parse({
      _meta: {
        schemaVersion: 1,
        contentHash: hash(JSON.stringify(documents)),
      },
      documents,
    });
    await fs.writeFile(path.join(temporaryPath, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    await replaceDirectoryAtomically(temporaryPath, outputPath);
    return manifest;
  } catch (error) {
    await fs.rm(temporaryPath, { recursive: true, force: true });
    throw error;
  }
}

async function loadLocalEnv() {
  try {
    process.loadEnvFile(path.resolve(".env.local"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

function createGateway(client: Client, dataSourceId: string): NotionGateway {
  return {
    async getCatalogPropertyTypes() {
      const response = await client.dataSources.retrieve({ data_source_id: dataSourceId });
      return Object.fromEntries(Object.entries(response.properties).map(([name, value]) => [name, value.type]));
    },
    async queryCatalog() {
      const results: unknown[] = [];
      let startCursor: string | undefined;
      do {
        const response = await client.dataSources.query({
          data_source_id: dataSourceId,
          page_size: 100,
          start_cursor: startCursor,
          result_type: "page",
        });
        results.push(...response.results);
        startCursor = response.next_cursor ?? undefined;
      } while (startCursor);
      return results;
    },
    async retrieveMarkdown(pageId) {
      const response = await client.pages.retrieveMarkdown({ page_id: pageId });
      return {
        markdown: response.markdown,
        truncated: response.truncated,
        unknownBlockIds: response.unknown_block_ids,
      };
    },
  };
}

async function main() {
  await loadLocalEnv();
  const args = process.argv.slice(2);
  const unknownArgs = args.filter((arg) => arg !== PREVIEW_FLAG);
  if (unknownArgs.length) throw new Error(`不支援的參數：${unknownArgs.join(", ")}`);
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DOCS_DATA_SOURCE_ID;
  if (!token) throw new Error("請在 .env.local 設定 NOTION_TOKEN");
  if (!dataSourceId) throw new Error("請在 .env.local 設定 NOTION_DOCS_DATA_SOURCE_ID");

  const preview = args.includes(PREVIEW_FLAG);
  const outputPath = preview ? PREVIEW_OUTPUT_PATH : OUTPUT_PATH;
  const client = new Client({ auth: token });
  const manifest = await synchronizeNotionDocuments({
    gateway: createGateway(client, dataSourceId),
    outputPath,
  });
  const full = manifest.documents.filter((document) => document.publishMode === "full").length;
  const links = manifest.documents.filter((document) => document.publishMode === "link-only").length;
  console.info(`Notion ${preview ? "預覽" : "正式"}同步完成：全文 ${full}、連結 ${links}、輸出 ${outputPath}`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  main().catch((error) => {
    console.error(`Notion 同步失敗：${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
