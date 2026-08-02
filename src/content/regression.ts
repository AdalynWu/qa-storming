import { z } from "zod";
import regressionJson from "./generated/regression.json";

export const testPrioritySchema = z.enum(["P0", "P1", "P2", "P3"]);
export const lifecycleStatusSchema = z.enum(["draft", "active", "archived"]);

export const testCaseSchema = z.object({
  id: z.string().min(1),
  suiteId: z.string().min(1),
  module: z.string().min(1),
  title: z.string().min(1),
  priority: testPrioritySchema,
  platforms: z.array(z.string().min(1)).min(1),
  preconditions: z.array(z.string().min(1)),
  testData: z.array(z.string().min(1)),
  steps: z.array(z.string().min(1)).min(1),
  expectedResults: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)),
  lifecycleStatus: lifecycleStatusSchema,
  owner: z.string().min(1).optional(),
  updatedAt: z.string().min(1).optional(),
}).strict();

export const regressionSuiteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  product: z.string().min(1),
  platforms: z.array(z.string().min(1)).min(1),
  release: z.string().min(1).optional(),
  description: z.string().min(1),
  owner: z.string().min(1).optional(),
  status: z.enum(["active", "archived"]),
});

export const regressionDataSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal(2),
    contentHash: z.string().min(1),
  }),
  suites: z.array(regressionSuiteSchema),
  cases: z.array(testCaseSchema),
});

export type TestPriority = z.infer<typeof testPrioritySchema>;
export type LifecycleStatus = z.infer<typeof lifecycleStatusSchema>;
export type TestCase = z.infer<typeof testCaseSchema>;
export type RegressionSuite = z.infer<typeof regressionSuiteSchema>;
export type RegressionData = z.infer<typeof regressionDataSchema>;

export const regressionData = regressionDataSchema.parse(regressionJson);
export const regressionSuites = regressionData.suites;
export const regressionCases = regressionData.cases;

export const regressionStats = {
  suiteCount: regressionSuites.filter((suite) => suite.status === "active").length,
  caseCount: regressionCases.filter((testCase) => testCase.lifecycleStatus !== "archived").length,
  p0Count: regressionCases.filter(
    (testCase) => testCase.lifecycleStatus !== "archived" && testCase.priority === "P0",
  ).length,
};

export function getCasesForSuite(suiteId: string) {
  return regressionCases.filter((testCase) => testCase.suiteId === suiteId);
}
