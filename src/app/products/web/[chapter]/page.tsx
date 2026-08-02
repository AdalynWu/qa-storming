import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { MoorContentBlock } from "@/content/moor";
import { getWebChapter, publishedWebChapters, webChapters } from "@/content/web";
import "../web.css";

type PageProps = { params: Promise<{ chapter: string }> };

export function generateStaticParams() {
  return publishedWebChapters.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getWebChapter(slug);
  return chapter
    ? { title: `${chapter.title} · Web | QA Storming`, description: chapter.summary }
    : { title: "Web 文件 | QA Storming" };
}

function ContentBlock({ block }: { block: MoorContentBlock }) {
  if (block.type === "paragraph") return <p className="web-doc-paragraph">{block.text}</p>;
  if (block.type === "steps") return <div className="web-doc-block"><h3>{block.title}</h3><ol className="web-steps">{block.items.map((item) => <li key={item}><span>{item}</span></li>)}</ol></div>;
  if (block.type === "list") return <div className="web-doc-block"><h3>{block.title}</h3><ul className="web-check-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
  if (block.type === "table") return <div className="web-doc-block"><h3>{block.title}</h3><div className="web-table-wrap"><table><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>;
  return <aside className={`web-callout ${block.tone}`}><strong>{block.title}</strong><p>{block.text}</p></aside>;
}

export default async function WebChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getWebChapter(slug);
  if (!chapter?.sections) notFound();

  const currentIndex = publishedWebChapters.findIndex((item) => item.slug === chapter.slug);
  const previous = publishedWebChapters[currentIndex - 1];
  const next = publishedWebChapters[currentIndex + 1];

  return (
    <main className="web-reader-shell">
      <header className="web-reader-topbar">
        <Link href="/products/web">← 返回瀏覽者海岸</Link>
        <span>WEB KNOW-HOW · CHAPTER {String(chapter.order).padStart(2, "0")}</span>
        <Link href="/">QA STORMING</Link>
      </header>

      <section className="web-reader-banner">
        <div><p>{chapter.subtitle}</p><h1>{chapter.title}</h1><span>{chapter.summary}</span></div>
        <div className="web-reader-emblem" aria-hidden="true"><span>{chapter.rune}</span></div>
      </section>

      <div className="web-reader-layout">
        <nav className="web-toc" aria-label="本章目錄">
          <p>ADVENTURE GUIDE</p><h2>本章路標</h2>
          {chapter.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><i>{String(index + 1).padStart(2, "0")}</i><span>{section.title}</span></a>)}
          <small>來源更新：{chapter.sourceUpdatedAt}</small>
        </nav>

        <article className="web-manuscript">
          <div className="web-manuscript-intro"><span>QA CURATED EDITION</span><p>這是由核准設計稿整理出的網站閱讀版本；實際規格與最新操作仍以團隊核准文件及本次測試版本為準。</p></div>
          {chapter.sections.map((section, index) => (
            <section id={section.id} className="web-doc-section" key={section.id}>
              <div className="web-section-number">{String(index + 1).padStart(2, "0")}</div>
              <h2>{section.title}</h2>
              {section.blocks.map((block, blockIndex) => <ContentBlock block={block} key={`${section.id}-${blockIndex}`} />)}
            </section>
          ))}
          <footer className="web-chapter-nav">
            {previous ? <Link href={`/products/web/${previous.slug}`}>← {previous.title}</Link> : <span />}
            {next ? <Link href={`/products/web/${next.slug}`}>{next.title} →</Link> : <Link href="/products/web">返回章節地圖 →</Link>}
          </footer>
        </article>

        <aside className="web-qa-notes">
          <p>QA FIELD NOTES</p><h2>冒險札記</h2>
          <div><strong>版本原則</strong><span>2026 綠色 Mockup／Ready for dev 優先；Master File 用於補足產品範圍。</span></div>
          <div><strong>裝置覆蓋</strong><span>依功能驗證桌機、平板、手機、鍵盤操作與長翻譯，不只檢查單一 viewport。</span></div>
          <div><strong>內容安全</strong><span>不要把真實帳號、token、個資、付款資料或未核准內部連結貼到 issue。</span></div>
        </aside>
      </div>

      <div className="web-reader-chapter-strip" aria-label="Web 全部章節">
        {webChapters.map((item) => item.status === "published" ? (
          <Link key={item.slug} href={`/products/web/${item.slug}`} aria-current={item.slug === chapter.slug ? "page" : undefined}><span>{item.rune}</span>{item.title}</Link>
        ) : (
          <span className="is-locked" key={item.slug}><i>{item.rune}</i>{item.title}</span>
        ))}
      </div>
    </main>
  );
}
