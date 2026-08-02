import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMoorChapter,
  moorChapters,
  publishedMoorChapters,
  type MoorContentBlock,
} from "@/content/moor";
import "../moor.css";

type PageProps = {
  params: Promise<{ chapter: string }>;
};

export function generateStaticParams() {
  return publishedMoorChapters.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getMoorChapter(slug);
  return chapter
    ? { title: `${chapter.title} · Moor | QA Storming`, description: chapter.summary }
    : { title: "Moor 文件 | QA Storming" };
}

function ContentBlock({ block }: { block: MoorContentBlock }) {
  if (block.type === "paragraph") return <p className="moor-doc-paragraph">{block.text}</p>;

  if (block.type === "steps") {
    return (
      <div className="moor-doc-block">
        <h3>{block.title}</h3>
        <ol className="moor-steps">{block.items.map((item) => <li key={item}><span>{item}</span></li>)}</ol>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="moor-doc-block">
        <h3>{block.title}</h3>
        <ul className="moor-check-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div className="moor-doc-block">
        <h3>{block.title}</h3>
        <div className="moor-table-wrap">
          <table><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table>
        </div>
      </div>
    );
  }

  return (
    <aside className={`moor-callout ${block.tone}`}>
      <strong>{block.title}</strong>
      <p>{block.text}</p>
    </aside>
  );
}

export default async function MoorChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getMoorChapter(slug);
  if (!chapter?.sections) notFound();

  const currentIndex = publishedMoorChapters.findIndex((item) => item.slug === chapter.slug);
  const previous = publishedMoorChapters[currentIndex - 1];
  const next = publishedMoorChapters[currentIndex + 1];

  return (
    <main className="moor-reader-shell">
      <header className="moor-reader-topbar">
        <Link href="/products/moor">← 返回創作者聖域</Link>
        <span>MOOR KNOW-HOW · CHAPTER {String(chapter.order).padStart(2, "0")}</span>
        <Link href="/">QA STORMING</Link>
      </header>

      <section className="moor-reader-banner">
        <div>
          <p>{chapter.subtitle}</p>
          <h1>{chapter.title}</h1>
          <span>{chapter.summary}</span>
        </div>
        <div className="moor-reader-emblem" aria-hidden="true"><span>{chapter.rune}</span></div>
      </section>

      <div className="moor-reader-layout">
        <nav className="moor-toc" aria-label="本章目錄">
          <p>ADVENTURE GUIDE</p>
          <h2>本章路標</h2>
          {chapter.sections.map((section, index) => (
            <a href={`#${section.id}`} key={section.id}><i>{String(index + 1).padStart(2, "0")}</i><span>{section.title}</span></a>
          ))}
          <small>來源更新：{chapter.sourceUpdatedAt}</small>
        </nav>

        <article className="moor-manuscript">
          <div className="moor-manuscript-intro">
            <span>QA CURATED EDITION</span>
            <p>這是由原始 Know-how 整理出的網站閱讀版本；實際規格與最新操作仍以團隊核准文件及本次測試版本為準。</p>
          </div>
          {chapter.sections.map((section, index) => (
            <section id={section.id} className="moor-doc-section" key={section.id}>
              <div className="moor-section-number">{String(index + 1).padStart(2, "0")}</div>
              <h2>{section.title}</h2>
              {section.blocks.map((block, blockIndex) => <ContentBlock block={block} key={`${section.id}-${blockIndex}`} />)}
            </section>
          ))}

          <footer className="moor-chapter-nav">
            {previous ? <Link href={`/products/moor/${previous.slug}`}>← {previous.title}</Link> : <span />}
            {next ? <Link href={`/products/moor/${next.slug}`}>{next.title} →</Link> : <Link href="/products/moor">返回章節地圖 →</Link>}
          </footer>
        </article>

        <aside className="moor-qa-notes">
          <p>QA FIELD NOTES</p>
          <h2>冒險札記</h2>
          <div><strong>閱讀原則</strong><span>先理解使用者目的，再依環境與角色補足成功、失敗及恢復情境。</span></div>
          <div><strong>內容安全</strong><span>不要把真實帳號、token、個資、付款資料或未核准內部連結貼到 issue。</span></div>
          <div><strong>發現落差</strong><span>若 App 與本文不同，記錄版本與證據後回報，不直接假設文件或產品一定正確。</span></div>
        </aside>
      </div>

      <div className="moor-reader-chapter-strip" aria-label="Moor 全部章節">
        {moorChapters.map((item) => item.status === "published" ? (
          <Link key={item.slug} href={`/products/moor/${item.slug}`} aria-current={item.slug === chapter.slug ? "page" : undefined}><span>{item.rune}</span>{item.title}</Link>
        ) : (
          <span className="is-locked" key={item.slug}><i>{item.rune}</i>{item.title}</span>
        ))}
      </div>
    </main>
  );
}
