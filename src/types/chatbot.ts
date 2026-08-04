import { z } from "zod";

export const knowledgeChunkSchema = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  title: z.string().min(1),
  href: z.string().startsWith("/"),
  markdownPath: z.string().min(1),
  headingPath: z.array(z.string().min(1)),
  chunkIndex: z.number().int().nonnegative(),
  content: z.string().min(1),
}).strict();

export const knowledgeIndexSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal(1),
    contentHash: z.string().min(1),
    documentCount: z.number().int().nonnegative(),
    chunkCount: z.number().int().nonnegative(),
  }).strict(),
  chunks: z.array(knowledgeChunkSchema),
}).strict();

export const modelAnswerSchema = z.object({
  sufficient: z.boolean(),
  answer: z.string(),
  usedChunkIds: z.array(z.string()),
}).strict();

export type KnowledgeChunk = z.infer<typeof knowledgeChunkSchema>;
export type KnowledgeIndex = z.infer<typeof knowledgeIndexSchema>;

export type ChatSource = {
  title: string;
  href: string;
};

export type ChatAnswer = {
  kind: "knowledge" | "fun";
  answer: string;
  sources: ChatSource[];
};
