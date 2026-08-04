import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ErrorCodeExplorer, type ErrorCodeEntry } from "@/components/ErrorCodeExplorer";
import { getGeneratedStandaloneDocument } from "@/content/generated-docs";
import { parseNotionMarkdown } from "@/content/notion-markdown";
import "../library.css";

export const metadata: Metadata = {
  title: "Error Code V2 鑑定圖鑑 | QA Storming",
  description: "可依 Code、Backend Key、使用者情境與處理範圍搜尋的錯誤代碼索引。",
};

export default async function ErrorCodesPage() {
  const source = await getGeneratedStandaloneDocument("error-codes");
  if (!source) notFound();
  const parsed = parseNotionMarkdown(source.markdown);
  const table = parsed.blocks.find((block) => block.type === "table");
  const entries: ErrorCodeEntry[] = table?.rows.slice(1).map((row) => ({
    code: row[0] ?? "—",
    key: (row[1] ?? "—").replaceAll("`", ""),
    scenario: row[2] ?? "待補",
    scope: row[3] ?? "待確認",
  })) ?? [];

  return (
    <main className="library-reader-shell error-code-page">
      <header className="library-topbar">
        <Link href="/library">← 返回知識書庫</Link>
        <span>ERROR CODE V2</span>
        <Link href="/regression">Regression</Link>
      </header>
      <section className="library-reader-hero error-code-hero" aria-labelledby="error-title">
        <div><p>QA REFERENCE · IDENTIFICATION GUIDE</p><h1 id="error-title">錯誤代碼<br />鑑定圖鑑</h1></div>
        <p>先辨識代碼，再帶著產品、版本、操作步驟與恢復結果判斷問題。代碼不是使用者文案，也不能單獨代表責任歸屬。</p>
        <div className="library-reader-mark" aria-hidden="true">EC</div>
      </section>
      <ErrorCodeExplorer entries={entries} />
    </main>
  );
}
