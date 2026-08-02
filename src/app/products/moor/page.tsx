import type { Metadata } from "next";
import Link from "next/link";
import { MoorChapterMap } from "@/components/MoorChapterMap";
import { moorChapters, moorProduct } from "@/content/moor";
import "./moor.css";

export const metadata: Metadata = {
  title: "Moor 創作者聖域 | QA Storming",
  description: "Moor App 產品 Know-how：快速入門、直播、內容、聊天與數據的 QA 冒險指南。",
};

export default function MoorProductHubPage() {
  return (
    <main className="moor-page-shell">
      <header className="moor-topbar">
        <Link href="/product-map" className="moor-back-link">← 返回產品世界地圖</Link>
        <Link href="/#knowhow" className="moor-archive-link">賢者書庫</Link>
      </header>

      <section className="moor-hero" aria-labelledby="moor-title">
        <div className="moor-hero-art" aria-hidden="true" />
        <div className="moor-hero-mist mist-a" aria-hidden="true" />
        <div className="moor-hero-mist mist-b" aria-hidden="true" />
        <div className="moor-fireflies" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
        <div className="moor-hero-copy">
          <p>{moorProduct.eyebrow}</p>
          <h1 id="moor-title">{moorProduct.realmName}</h1>
          <strong>{moorProduct.name} App 使用手冊</strong>
          <span>{moorProduct.description}</span>
          <div className="moor-hero-stats" aria-label="Moor 文件統計">
            <div><b>{moorChapters.length}</b><small>章冒險路徑</small></div>
            <div><b>{moorChapters.filter((chapter) => chapter.status === "published").length}</b><small>章可閱讀</small></div>
            <div><b>Mobile</b><small>iOS／Android</small></div>
          </div>
        </div>
        <div className="moor-sanctuary-mark" aria-hidden="true">
          <span>M</span><i>CREATOR<br />SANCTUARY</i>
        </div>
        <div className="moor-scroll-cue" aria-hidden="true">
          <i>⌄</i><span>探索章節</span>
        </div>
      </section>

      <section className="moor-journey" aria-labelledby="moor-journey-title">
        <div className="moor-section-heading">
          <p>THE CREATOR&apos;S PATH</p>
          <h2 id="moor-journey-title">沿著創作旅程前進</h2>
          <span>點擊符文查看章節。只有完成整理與 QA 審核的內容才會解封。</span>
        </div>
        <MoorChapterMap chapters={moorChapters} />
      </section>

      <section className="moor-source-note" aria-label="內容維護說明">
        <div><p>NOTION · CURATED KNOWLEDGE</p><h2>原始文件持續維護，網站只發布審核版本。</h2></div>
        <p>目前內容整理自「{moorProduct.sourceLabel}」。內部連結、測試帳號與敏感設定不會進入公開靜態網站。</p>
      </section>
    </main>
  );
}
