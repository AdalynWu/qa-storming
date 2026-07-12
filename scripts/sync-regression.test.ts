import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { regressionDataSchema, testCaseSchema } from "../content/regression";
import { assertNoActiveCasesRemoved, buildRegressionData, parseNumberedLines } from "./sync-regression";

const fixture = JSON.parse(await readFile(new URL("./fixtures/regression-sheets.json", import.meta.url), "utf8"));

test("builds independent steps and expected results from Sheet values", () => {
  const data = buildRegressionData(fixture.suites, fixture.cases);
  assert.equal(data.suites[0].id, "console-web");
  assert.equal(data.cases[0].steps.length, 3);
  assert.deepEqual(data.cases[0].expectedResults, ["登入成功"]);
  assert.deepEqual(data.cases[0].platforms, ["Web", "Chrome"]);
  assert.deepEqual(data.cases[0].tags, ["login", "critical"]);
});

test("parses numbered lines without coupling result counts", () => {
  assert.deepEqual(parseNumberedLines("1. first\n2. second"), ["first", "second"]);
});

test("supports one step and three expected results", () => {
  const cases = structuredClone(fixture.cases);
  cases[1][8] = "1. submit";
  cases[1][9] = "1. saved\n2. toast shown\n3. no duplicate";
  const data = buildRegressionData(fixture.suites, cases);
  assert.equal(data.cases[0].steps.length, 1);
  assert.equal(data.cases[0].expectedResults.length, 3);
});

test("rejects empty steps or expected results", () => {
  const withoutSteps = structuredClone(fixture.cases);
  withoutSteps[1][8] = "";
  assert.throws(() => buildRegressionData(fixture.suites, withoutSteps));
  const withoutResults = structuredClone(fixture.cases);
  withoutResults[1][9] = "";
  assert.throws(() => buildRegressionData(fixture.suites, withoutResults));
});

test("rejects the legacy Cases headers", () => {
  const legacy = structuredClone(fixture.cases);
  legacy[0][9] = "expected";
  assert.throws(() => buildRegressionData(fixture.suites, legacy), /expectedResults/);
});

test("rejects legacy fields in generated TestCase data", () => {
  const data = buildRegressionData(fixture.suites, fixture.cases);
  assert.equal(testCaseSchema.safeParse({ ...data.cases[0], caseType: "smoke" }).success, false);
  assert.equal(testCaseSchema.safeParse({ ...data.cases[0], automationStatus: "manual" }).success, false);
});

test("rejects duplicated case ids", () => {
  const cases = [...fixture.cases, fixture.cases[1]];
  assert.throws(() => buildRegressionData(fixture.suites, cases), /重複的 case id/);
});

test("preserves the exact Sheet row order instead of sorting by id", () => {
  const secondCase = [...fixture.cases[1]];
  secondCase[0] = "AA-001";
  const data = buildRegressionData(fixture.suites, [...fixture.cases, secondCase]);
  assert.deepEqual(data.cases.map((item) => item.id), ["CW-001", "AA-001"]);
});

test("rejects cases that point to an unknown suite", () => {
  const cases = structuredClone(fixture.cases);
  cases[1][1] = "missing-suite";
  assert.throws(() => buildRegressionData(fixture.suites, cases), /不存在的 suite/);
});

test("rejects invalid enum values", () => {
  const cases = structuredClone(fixture.cases);
  cases[1][4] = "urgent";
  assert.throws(() => buildRegressionData(fixture.suites, cases));
});

test("requires active cases to be archived before removal", () => {
  const previous = regressionDataSchema.parse({
    _meta: { schemaVersion: 2, contentHash: "fixture" },
    ...buildRegressionData(fixture.suites, fixture.cases),
  });
  assert.throws(() => assertNoActiveCasesRemoved(previous, []), /請先標記 archived/);
});

test("allows draft cases to be renamed or removed during initial authoring", () => {
  const data = buildRegressionData(fixture.suites, fixture.cases);
  const previous = regressionDataSchema.parse({
    _meta: { schemaVersion: 2, contentHash: "fixture" },
    suites: data.suites,
    cases: data.cases.map((item) => ({ ...item, lifecycleStatus: "draft" as const })),
  });
  assert.deepEqual(assertNoActiveCasesRemoved(previous, []), []);
});

test("allows the explicit one-time replacement of the sample baseline", () => {
  const previous = regressionDataSchema.parse({
    _meta: { schemaVersion: 2, contentHash: "sample-public-regression-v2" },
    ...buildRegressionData(fixture.suites, fixture.cases),
  });
  assert.deepEqual(
    assertNoActiveCasesRemoved(previous, [], { replaceSampleBaseline: true }),
    ["CW-001"],
  );
});

test("does not allow the replacement flag to bypass protection after the baseline is real", () => {
  const previous = regressionDataSchema.parse({
    _meta: { schemaVersion: 2, contentHash: "real-content-hash" },
    ...buildRegressionData(fixture.suites, fixture.cases),
  });
  assert.throws(
    () => assertNoActiveCasesRemoved(previous, [], { replaceSampleBaseline: true }),
    /只能用於內建示例基準/,
  );
});
