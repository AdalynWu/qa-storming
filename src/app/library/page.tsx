import type { Metadata } from "next";
import Link from "next/link";
import { LibraryCatalog } from "@/components/LibraryCatalog";
import { libraryDocuments } from "@/content/library";
import "./library.css";

export const metadata: Metadata = {
  title: "賢者知識書庫 | QA Storming",
  description: "產品手冊、錯誤代碼、Regression 與 Mobile 測試工具的 QA 知識入口。",
};

export default function LibraryPage() {
  return (
    <main className="library-page-shell">
      <header className="library-topbar">
        <Link href="/#knowhow">← 返回世界樹</Link>
        <span>QA STORMING · SAGE ARCHIVE</span>
        <Link href="/product-map">產品地圖</Link>
      </header>
      <section className="library-hero" aria-labelledby="library-title">
        <div className="library-hero-art" aria-hidden="true" />
        <div className="library-hero-copy">
          <p>THE SAGE&apos;S ARCHIVE</p>
          <h1 id="library-title">賢者的<br />知識書庫</h1>
          <strong>從查詢櫃台找到下一卷答案</strong>
          <span>產品手冊、錯誤代碼、Regression 與測試工具，都依用途安放在對應書架。公開卷冊不包含測試帳密、Token、UID 或正式環境操作指令。</span>
          <div className="library-hero-stats" aria-label="知識書庫統計">
            <div><b>{libraryDocuments.length}</b><small>卷可查閱</small></div>
            <div><b>3</b><small>座分類書架</small></div>
            <div><b>SAFE</b><small>公開安全版</small></div>
          </div>
        </div>
        <div className="library-crest" aria-hidden="true"><b>Q</b><span>ARCHIVE<br />OF QUALITY</span></div>
      </section>
      <LibraryCatalog documents={libraryDocuments} />
      <footer className="library-footer"><b>QA STORMING</b><span>核准內容由 Notion 同步，網站不取代內部 Runbook。</span></footer>
    </main>
  );
}
