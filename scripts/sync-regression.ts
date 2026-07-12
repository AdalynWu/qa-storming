import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { google } from "googleapis";
import {
  lifecycleStatusSchema,
  regressionDataSchema,
  regressionSuiteSchema,
  testCaseSchema,
  testPrioritySchema,
  type RegressionData,
  type RegressionSuite,
  type TestCase,
} from "../content/regression";

type SheetRow = Record<string, string>;
type SheetValues = Array<Array<string | number | boolean | null>>;

const OUTPUT_PATH = path.resolve("content/generated/regression.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const REPLACE_SAMPLE_BASELINE_FLAG = "--replace-sample-baseline";

const SUITE_HEADERS = ["id", "title", "subtitle", "product", "platforms", "release", "description", "owner", "status"];
const CASE_HEADERS = [
  "id", "suiteId", "module", "title", "priority", "platforms", "preconditions", "testData",
  "steps", "expectedResults", "tags", "lifecycleStatus", "owner", "updatedAt",
];

export function rowsFromValues(values: SheetValues, requiredHeaders: string[], sheetName: string): SheetRow[] {
  if (!values.length) throw new Error(`${sheetName} 分頁沒有資料`);
  const headers = values[0].map((value) => String(value ?? "").trim());
  const missing = requiredHeaders.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`${sheetName} 缺少欄位：${missing.join(", ")}`);

  return values.slice(1).flatMap((valuesRow) => {
    const row = Object.fromEntries(headers.map((header, index) => [header, String(valuesRow[index] ?? "").trim()]));
    return Object.values(row).some(Boolean) ? [row] : [];
  });
}

export function splitList(value: string, separator: RegExp = /[,，\n]/) {
  return value.split(separator).map((item) => item.trim()).filter(Boolean);
}

function stripStepNumber(value: string) {
  return value.replace(/^\s*\d+\s*[.)、．:-]?\s*/, "").trim();
}

export function parseNumberedLines(value: string) {
  return splitList(value, /\r?\n/).map(stripStepNumber).filter(Boolean);
}

function optional(value: string) {
  return value || undefined;
}

export function buildRegressionData(suiteValues: SheetValues, caseValues: SheetValues): Omit<RegressionData, "_meta"> {
  const suiteRows = rowsFromValues(suiteValues, SUITE_HEADERS, "Suites");
  const caseRows = rowsFromValues(caseValues, CASE_HEADERS, "Cases");
  const suiteIds = new Set<string>();
  const caseIds = new Set<string>();

  const suites = suiteRows.map((row): RegressionSuite => {
    if (suiteIds.has(row.id)) throw new Error(`重複的 suite id：${row.id}`);
    suiteIds.add(row.id);
    return regressionSuiteSchema.parse({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      product: row.product,
      platforms: splitList(row.platforms),
      release: optional(row.release),
      description: row.description,
      owner: optional(row.owner),
      status: row.status,
    });
  });

  const cases = caseRows.map((row): TestCase => {
    if (caseIds.has(row.id)) throw new Error(`重複的 case id：${row.id}`);
    caseIds.add(row.id);
    if (!suiteIds.has(row.suiteId)) throw new Error(`${row.id} 引用了不存在的 suite：${row.suiteId}`);
    return testCaseSchema.parse({
      id: row.id,
      suiteId: row.suiteId,
      module: row.module,
      title: row.title,
      priority: testPrioritySchema.parse(row.priority),
      platforms: splitList(row.platforms),
      preconditions: splitList(row.preconditions, /\r?\n/),
      testData: splitList(row.testData, /\r?\n/),
      steps: parseNumberedLines(row.steps),
      expectedResults: parseNumberedLines(row.expectedResults),
      tags: splitList(row.tags),
      lifecycleStatus: lifecycleStatusSchema.parse(row.lifecycleStatus),
      owner: optional(row.owner),
      updatedAt: optional(row.updatedAt),
    });
  });

  return {
    suites,
    cases,
  };
}

export function assertNoActiveCasesRemoved(
  previous: RegressionData,
  nextCases: TestCase[],
  options: { replaceSampleBaseline?: boolean } = {},
) {
  const nextIds = new Set(nextCases.map((testCase) => testCase.id));
  const removed = previous.cases
    .filter((testCase) => testCase.lifecycleStatus === "active" && !nextIds.has(testCase.id))
    .map((testCase) => testCase.id);
  if (!removed.length) return removed;

  if (options.replaceSampleBaseline) {
    if (!previous._meta.contentHash.startsWith("sample-public-regression-v")) {
      throw new Error(`${REPLACE_SAMPLE_BASELINE_FLAG} 只能用於內建示例基準，不能略過正式案例的刪除保護`);
    }
    return removed;
  }

  if (removed.length) {
    throw new Error(`下列 active 案例從 Sheet 消失，請先標記 archived：${removed.join(", ")}`);
  }
  return removed;
}

function stablePayload(data: Omit<RegressionData, "_meta">): RegressionData {
  const serialized = JSON.stringify(data);
  return {
    _meta: {
      schemaVersion: 2,
      contentHash: createHash("sha256").update(serialized).digest("hex").slice(0, 16),
    },
    ...data,
  };
}

function summarize(previous: RegressionData, next: RegressionData) {
  const previousById = new Map(previous.cases.map((item) => [item.id, item]));
  const nextById = new Map(next.cases.map((item) => [item.id, item]));
  const added = next.cases.filter((item) => !previousById.has(item.id)).length;
  const changed = next.cases.filter((item) => {
    const oldItem = previousById.get(item.id);
    return oldItem && JSON.stringify(oldItem) !== JSON.stringify(item);
  }).length;
  const archived = next.cases.filter((item) => item.lifecycleStatus === "archived" && previousById.get(item.id)?.lifecycleStatus !== "archived").length;
  const removed = previous.cases.filter((item) => !nextById.has(item.id)).length;
  const reordered = previous.cases.map((item) => item.id).join("\n") !== next.cases.map((item) => item.id).join("\n");
  return { added, changed, archived, removed, reordered };
}

async function loadLocalEnv() {
  try {
    process.loadEnvFile(path.resolve(".env.local"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }
}

async function main() {
  await loadLocalEnv();
  const args = process.argv.slice(2);
  const unknownArgs = args.filter((arg) => arg !== REPLACE_SAMPLE_BASELINE_FLAG);
  if (unknownArgs.length) throw new Error(`不支援的參數：${unknownArgs.join(", ")}`);
  const replaceSampleBaseline = args.includes(REPLACE_SAMPLE_BASELINE_FLAG);
  const sheetId = process.env.REGRESSION_SHEET_ID;
  if (!sheetId) throw new Error("請在 .env.local 設定 REGRESSION_SHEET_ID");

  const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: sheetId,
    ranges: ["Suites!A:Z", "Cases!A:Z"],
    majorDimension: "ROWS",
  });
  const [suiteRange, caseRange] = response.data.valueRanges ?? [];
  if (!suiteRange?.values || !caseRange?.values) throw new Error("無法讀取 Suites 或 Cases 分頁");

  const previous = regressionDataSchema.parse(JSON.parse(await fs.readFile(OUTPUT_PATH, "utf8")));
  const built = buildRegressionData(suiteRange.values, caseRange.values);
  const removedFromBaseline = assertNoActiveCasesRemoved(previous, built.cases, { replaceSampleBaseline });
  if (removedFromBaseline.length) {
    console.warn(`將以正式 Sheet 取代示例基準，移除：${removedFromBaseline.join(", ")}`);
  }
  const next = regressionDataSchema.parse(stablePayload(built));
  const summary = summarize(previous, next);
  const temporaryPath = `${OUTPUT_PATH}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, OUTPUT_PATH);
  console.info(`Regression 同步完成：新增 ${summary.added}、修改 ${summary.changed}、封存 ${summary.archived}、移除 ${summary.removed}、順序變更 ${summary.reordered ? "是" : "否"}`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  main().catch((error) => {
    console.error(`Regression 同步失敗：${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
