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

export const generatedDocSchema = z.object({
  notionPageId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: docCategorySchema,
  order: z.number().finite(),
  summary: z.string(),
  publishMode: docPublishModeSchema,
  sourceUrl: z.url(),
  owner: z.string().min(1).optional(),
  lastEditedTime: z.string().min(1),
  contentHash: z.string().min(1),
  markdownPath: z.string().min(1).optional(),
}).strict();

export const docsManifestSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal(1),
    contentHash: z.string().min(1),
  }).strict(),
  documents: z.array(generatedDocSchema),
}).strict();

export type DocCategory = z.infer<typeof docCategorySchema>;
export type DocPublishMode = z.infer<typeof docPublishModeSchema>;
export type GeneratedDoc = z.infer<typeof generatedDocSchema>;
export type DocsManifest = z.infer<typeof docsManifestSchema>;

export const docsManifest = docsManifestSchema.parse(docsManifestJson);
export const generatedDocs = docsManifest.documents;

export function getDocsByCategory(category: DocCategory) {
  return generatedDocs.filter((document) => document.category === category);
}
