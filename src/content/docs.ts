import { z } from "zod";
import docsManifestJson from "./generated/docs/manifest.json";

export const docCategorySchema = z.enum([
  "onboarding",
  "product",
  "qa-know-how",
  "tool",
  "process",
]);

export const docPublishModeSchema = z.enum(["full", "link-only"]);

export const docDocumentTypeSchema = z.enum(["hub", "chapter", "standalone"]);
export const docReviewStatusSchema = z.enum(["draft", "in-review", "approved"]);

const routeSegmentSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const generatedDocSchema = z.object({
  notionPageId: z.string().min(1),
  title: z.string().min(1),
  slug: routeSegmentSchema,
  category: docCategorySchema,
  order: z.number().finite(),
  summary: z.string(),
  publishMode: docPublishModeSchema,
  documentType: docDocumentTypeSchema,
  reviewStatus: docReviewStatusSchema,
  productKey: routeSegmentSchema.optional(),
  chapterSlug: routeSegmentSchema.optional(),
  parentSlug: routeSegmentSchema.optional(),
  sourceUrl: z.url(),
  owner: z.string().min(1).optional(),
  lastEditedTime: z.string().min(1),
  contentHash: z.string().min(1),
  markdownPath: z.string().min(1).optional(),
}).strict().superRefine((document, context) => {
  if (document.reviewStatus !== "approved") {
    context.addIssue({
      code: "custom",
      path: ["reviewStatus"],
      message: "generated manifest 只能包含 approved 文件",
    });
  }

  if (document.documentType === "standalone") {
    for (const field of ["productKey", "chapterSlug", "parentSlug"] as const) {
      if (document[field] !== undefined) {
        context.addIssue({ code: "custom", path: [field], message: "standalone 文件不可設定產品階層欄位" });
      }
    }
    return;
  }

  if (!document.productKey) {
    context.addIssue({ code: "custom", path: ["productKey"], message: "產品文件必須設定 Product Key" });
  }

  if (document.documentType === "hub") {
    if (document.chapterSlug !== undefined || document.parentSlug !== undefined) {
      context.addIssue({ code: "custom", path: ["chapterSlug"], message: "hub 不可設定章節階層欄位" });
    }
    return;
  }

  if (!document.chapterSlug) {
    context.addIssue({ code: "custom", path: ["chapterSlug"], message: "chapter 必須設定 Chapter Slug" });
  }
  if (document.parentSlug && document.parentSlug === document.chapterSlug) {
    context.addIssue({ code: "custom", path: ["parentSlug"], message: "Parent Slug 不可與 Chapter Slug 相同" });
  }
});

export const docsManifestSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal(2),
    contentHash: z.string().min(1),
  }).strict(),
  documents: z.array(generatedDocSchema),
}).strict();

export type DocCategory = z.infer<typeof docCategorySchema>;
export type DocPublishMode = z.infer<typeof docPublishModeSchema>;
export type DocDocumentType = z.infer<typeof docDocumentTypeSchema>;
export type DocReviewStatus = z.infer<typeof docReviewStatusSchema>;
export type GeneratedDoc = z.infer<typeof generatedDocSchema>;
export type DocsManifest = z.infer<typeof docsManifestSchema>;

export const docsManifest = docsManifestSchema.parse(docsManifestJson);
export const generatedDocs = docsManifest.documents;

export function getDocsByCategory(category: DocCategory) {
  return generatedDocs.filter((document) => document.category === category);
}
