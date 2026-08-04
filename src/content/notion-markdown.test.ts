import assert from "node:assert/strict";
import test from "node:test";
import { parseNotionMarkdown } from "./notion-markdown";

test("parses Notion headings, lists, callouts, details and tables", () => {
  const document = parseNotionMarkdown(`<callout icon="test" color="green_bg">
\tSafe demo content.
</callout>
# Adventure Goal
## Preparation
- One
- Two
1. Open
2. Verify
<table header-row="true">
<tr><td>Area</td><td>Focus</td></tr>
<tr><td>Flow</td><td>Complete</td></tr>
</table>
<details>
<summary>Demo steps</summary>
\tRun sync.
</details>`);

  assert.deepEqual(document.tableOfContents.map(({ title, level }) => ({ title, level })), [
    { title: "Adventure Goal", level: 1 },
    { title: "Preparation", level: 2 },
  ]);
  assert.equal(document.blocks[0].type, "callout");
  assert.equal(document.blocks.some((block) => block.type === "unordered-list"), true);
  assert.equal(document.blocks.some((block) => block.type === "ordered-list"), true);
  assert.deepEqual(document.blocks.find((block) => block.type === "table"), {
    type: "table",
    rows: [["Area", "Focus"], ["Flow", "Complete"]],
  });
  assert.equal(document.blocks.find((block) => block.type === "details")?.summary, "Demo steps");
});

test("does not require generated Markdown to mirror the curated block schema", () => {
  const document = parseNotionMarkdown("# Goal\n\nThree steps can lead to one expected outcome.\n\n---\n\n> Reviewed by QA.");
  assert.deepEqual(document.blocks.map((block) => block.type), ["heading", "paragraph", "divider", "quote"]);
});
