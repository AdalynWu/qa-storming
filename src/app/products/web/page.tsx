import type { Metadata } from "next";
import Link from "next/link";
import { ProductChapterMap } from "@/components/ProductChapterMap";
import { webChapters, webProduct } from "@/content/web";
import "./web.css";
import "../product-hub.css";

export const metadata: Metadata = {
  title: "Web 冒險手冊 | QA Storming",
  description: "SWAG Web 產品 Know-how：帳號、直播、付費、探索、Landing 與 SEO 的 QA 指南。",
};

export default function WebProductHubPage() {
  return (
    <main className="web-page-shell">
      <header className="web-topbar">
        <Link href="/product-map" className="web-back-link">← 返回產品世界地圖</Link>
        <Link href="/#knowhow" className="web-archive-link">賢者書庫</Link>
      </header>

      <section className="web-hero" aria-labelledby="web-title">
        <div className="web-hero-art" aria-hidden="true" />
        <div className="web-hero-mist mist-a" aria-hidden="true" />
        <div className="web-hero-mist mist-b" aria-hidden="true" />
        <div className="web-fireflies" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
        <div className="web-hero-copy">
          <p>{webProduct.eyebrow}</p>
          <h1 id="web-title">{webProduct.realmName}</h1>
          <strong>{webProduct.name} 冒險手冊</strong>
          <span>{webProduct.description}</span>
          <div className="web-hero-stats" aria-label="Web 文件統計">
            <div><b>{webChapters.length}</b><small>章冒險路徑</small></div>
            <div><b>{webChapters.filter((chapter) => chapter.status === "published").length}</b><small>章可閱讀</small></div>
            <div><b>Web</b><small>Desktop／Mobile</small></div>
          </div>
        </div>
        <div className="web-sanctuary-mark" aria-hidden="true">
          <span>W</span><i>BROWSER<br />COAST</i>
        </div>
        <div className="web-scroll-cue" aria-hidden="true"><i>⌄</i><span>探索章節</span></div>
      </section>

      <section className="web-journey" aria-labelledby="web-journey-title">
        <div className="web-section-heading">
          <p>THE BROWSER ROUTE</p>
          <h2 id="web-journey-title">沿著 Web 使用旅程前進</h2>
          <span>從身分入口一路走到直播、購買、探索與公開 Landing；已完成 QA 整理的章節才會解封。</span>
        </div>
        <ProductChapterMap
          chapters={webChapters}
          basePath="/products/web"
          ariaLabel="Web 冒險手冊章節"
          classPrefix="web"
          openLabel="展開航海誌"
        />
      </section>

      <section className="web-source-note" aria-label="內容維護說明">
        <div><p>FIGMA · CURATED KNOWLEDGE</p><h2>Master 定義範圍，2026 專案覆寫新流程。</h2></div>
        <p>目前內容整理自「{webProduct.sourceLabel}」。綠色 Mockup／Ready for dev 優先；較舊 Mockup、Sandbox、遺棄版本、內部連結、測試帳號與敏感設定不會進入公開靜態網站。</p>
      </section>
    </main>
  );
}
