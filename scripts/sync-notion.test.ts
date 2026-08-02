import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { findRemoteImageUrls, parseCatalogPage, synchronizeNotionDocuments, type NotionGateway } from "./sync-notion";

const fixture = JSON.parse(await readFile(new URL("./fixtures/notion-catalog.json", import.meta.url), "utf8"));

function gateway(overrides: Partial<NotionGateway> = {}): NotionGateway {
  return {
    getCatalogPropertyTypes: async () => fixture.propertyTypes,
    queryCatalog: async () => structuredClone(fixture.pages),
    retrieveMarkdown: async () => ({
      markdown: "# Guide\n\nWelcome.",
      truncated: false,
      unknownBlockIds: [],
    }),
    ...overrides,
  };
}

test("parses Catalog properties and Notion page URLs", () => {
  const item = parseCatalogPage(fixture.pages[0]);
  assert.equal(item.slug, "qa-onboarding-guide");
  assert.equal(item.owner, "QA Owner");
  assert.equal(item.documentType, "standalone");
  assert.equal(item.reviewStatus, "approved");
});

test("detects Markdown and enhanced Markdown image URLs", () => {
  assert.deepEqual(
    findRemoteImageUrls('![a](https://files.example/a.png)\n<image source="https://files.example/b.webp">'),
    ["https://files.example/a.png", "https://files.example/b.webp"],
  );
});

test("outputs full and link-only documents but excludes hidden drafts", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-"));
  const outputPath = path.join(directory, "docs");
  try {
    const manifest = await synchronizeNotionDocuments({ gateway: gateway(), outputPath });
    assert.deepEqual(manifest.documents.map((document) => document.slug), [
      "qa-onboarding-guide",
      "moor",
      "moor-live",
      "internal-tool-entry",
    ]);
    assert.equal(manifest.documents[0].markdownPath, "onboarding/qa-onboarding-guide.md");
    assert.equal(manifest.documents[1].documentType, "hub");
    assert.equal(manifest.documents[1].productKey, "moor");
    assert.equal(manifest.documents[2].chapterSlug, "live");
    assert.equal(manifest.documents[2].markdownPath, "product/moor-live.md");
    assert.equal(manifest.documents[3].markdownPath, undefined);
    assert.equal(manifest._meta.schemaVersion, 2);
    assert.match(await readFile(path.join(outputPath, "onboarding/qa-onboarding-guide.md"), "utf8"), /Welcome/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("localizes remote images using content hashes", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-image-"));
  const outputPath = path.join(directory, "docs");
  const markdownGateway = gateway({
    retrieveMarkdown: async () => ({
      markdown: "![sample](https://files.example/sample.png)",
      truncated: false,
      unknownBlockIds: [],
    }),
  });
  const fetchImpl: typeof fetch = async () => new Response(new Uint8Array([137, 80, 78, 71]), {
    status: 200,
    headers: { "content-type": "image/png" },
  });
  try {
    await synchronizeNotionDocuments({ gateway: markdownGateway, outputPath, fetchImpl });
    const markdown = await readFile(path.join(outputPath, "onboarding/qa-onboarding-guide.md"), "utf8");
    assert.match(markdown, /!\[sample]\(\.\.\/assets\/[a-f0-9]{16}\.png\)/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects duplicate slugs and invalid enum values", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-invalid-"));
  try {
    const duplicated = structuredClone(fixture.pages);
    duplicated[1].properties.Slug.rich_text[0].plain_text = "qa-onboarding-guide";
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({ queryCatalog: async () => duplicated }),
        outputPath: path.join(directory, "duplicate"),
      }),
      /重複的文件 slug/,
    );

    const invalid = structuredClone(fixture.pages);
    invalid[0].properties.Category.select.name = "unknown";
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({ queryCatalog: async () => invalid }),
        outputPath: path.join(directory, "invalid"),
      }),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects invalid product hierarchy and duplicate product routes", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-hierarchy-"));
  try {
    const missingProductKey = structuredClone(fixture.pages);
    missingProductKey[4].properties["Product Key"].select = null;
    assert.throws(() => parseCatalogPage(missingProductKey[4]), /Product Key/);

    const duplicateRoute = structuredClone(fixture.pages);
    duplicateRoute[5].properties["Chapter Slug"].rich_text[0].plain_text = "live";
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({ queryCatalog: async () => duplicateRoute }),
        outputPath: path.join(directory, "duplicate-route"),
      }),
      /重複的產品章節路由：moor\/live/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("accepts Product Key as rich text and excludes unapproved documents", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-review-"));
  const pages = structuredClone(fixture.pages);
  pages[4].properties["Product Key"] = { rich_text: [{ plain_text: "moor" }] };
  try {
    const manifest = await synchronizeNotionDocuments({
      gateway: gateway({
        getCatalogPropertyTypes: async () => ({ ...fixture.propertyTypes, "Product Key": "rich_text" }),
        queryCatalog: async () => pages,
      }),
      outputPath: path.join(directory, "docs"),
    });
    assert.equal(manifest.documents.some((document) => document.slug === "moor-posts"), false);
    assert.equal(manifest.documents.find((document) => document.slug === "moor-live")?.productKey, "moor");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects an invalid Catalog schema", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-schema-"));
  try {
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({
          getCatalogPropertyTypes: async () => ({ ...fixture.propertyTypes, Slug: "number" }),
        }),
        outputPath: path.join(directory, "docs"),
      }),
      /Website Docs Catalog schema 不正確/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("keeps the previous output when Markdown retrieval fails or is truncated", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-atomic-"));
  const outputPath = path.join(directory, "docs");
  await fsMkdir(outputPath);
  await writeFile(path.join(outputPath, "sentinel.txt"), "keep", "utf8");
  try {
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({
          retrieveMarkdown: async () => ({ markdown: "partial", truncated: true, unknownBlockIds: [] }),
        }),
        outputPath,
      }),
      /Markdown 不完整/,
    );
    assert.equal(await readFile(path.join(outputPath, "sentinel.txt"), "utf8"), "keep");

    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({ retrieveMarkdown: async () => { throw new Error("403"); } }),
        outputPath,
      }),
      /403/,
    );
    assert.equal(await readFile(path.join(outputPath, "sentinel.txt"), "utf8"), "keep");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("requires published documents to be archived or hidden before removal", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "notion-sync-removal-"));
  const outputPath = path.join(directory, "docs");
  try {
    await synchronizeNotionDocuments({ gateway: gateway(), outputPath });
    await assert.rejects(
      synchronizeNotionDocuments({
        gateway: gateway({ queryCatalog: async () => structuredClone(fixture.pages.slice(1)) }),
        outputPath,
      }),
      /無預警消失/,
    );
    assert.match(await readFile(path.join(outputPath, "onboarding/qa-onboarding-guide.md"), "utf8"), /Welcome/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

async function fsMkdir(directory: string) {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(directory, { recursive: true });
}
