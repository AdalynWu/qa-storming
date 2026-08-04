import { readFile } from "node:fs/promises";
import path from "node:path";
import { generatedDocs, type GeneratedDoc } from "./docs";

export type GeneratedMarkdownDocument = GeneratedDoc & { markdown: string };

export async function getGeneratedProductChapter(
  productKey: string,
  chapterSlug: string,
): Promise<GeneratedMarkdownDocument | undefined> {
  const document = generatedDocs.find((item) =>
    item.publishMode === "full"
    && item.documentType === "chapter"
    && item.productKey === productKey
    && item.chapterSlug === chapterSlug,
  );

  if (!document?.markdownPath) return undefined;

  const contentRoot = path.resolve(process.cwd(), "src/content/generated/docs");
  const markdownPath = path.resolve(contentRoot, document.markdownPath);
  if (!markdownPath.startsWith(`${contentRoot}${path.sep}`)) {
    throw new Error(`不安全的 generated Markdown 路徑：${document.markdownPath}`);
  }

  const markdown = await readFile(markdownPath, "utf8");
  return { ...document, markdown };
}

export async function getGeneratedStandaloneDocument(
  slug: string,
): Promise<GeneratedMarkdownDocument | undefined> {
  const document = generatedDocs.find((item) =>
    item.publishMode === "full"
    && item.documentType === "standalone"
    && item.slug === slug,
  );

  if (!document?.markdownPath) return undefined;

  const contentRoot = path.resolve(process.cwd(), "src/content/generated/docs");
  const markdownPath = path.resolve(contentRoot, document.markdownPath);
  if (!markdownPath.startsWith(`${contentRoot}${path.sep}`)) {
    throw new Error(`不安全的 generated Markdown 路徑：${document.markdownPath}`);
  }

  const markdown = await readFile(markdownPath, "utf8");
  return { ...document, markdown };
}
