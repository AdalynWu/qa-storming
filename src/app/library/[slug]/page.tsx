import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotionMarkdown } from "@/components/NotionMarkdown";
import { getGeneratedStandaloneDocument } from "@/content/generated-docs";
import { getLibraryDocument, standaloneLibrarySlugs } from "@/content/library";
import { parseNotionMarkdown } from "@/content/notion-markdown";
import "../library.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return standaloneLibrarySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = getLibraryDocument(slug);
  return metadata
    ? { title: `${metadata.title} | QA Storming`, description: metadata.summary }
    : {};
}

export default async function LibraryDocumentPage({ params }: PageProps) {
  const { slug } = await params;
  if (!standaloneLibrarySlugs.includes(slug as (typeof standaloneLibrarySlugs)[number])) notFound();
  const [source, metadata] = await Promise.all([
    getGeneratedStandaloneDocument(slug),
    Promise.resolve(getLibraryDocument(slug)),
  ]);
  if (!source || !metadata) notFound();
  const parsed = parseNotionMarkdown(source.markdown);
  const related = standaloneLibrarySlugs
    .filter((item) => item !== slug)
    .map((item) => getLibraryDocument(item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="library-reader-shell">
      <header className="library-topbar">
        <Link href="/library">← 返回知識書庫</Link>
        <span>{metadata.eyebrow}</span>
        <Link href="/library/error-codes">Error Code</Link>
      </header>
      <section className="library-reader-hero" aria-labelledby="library-document-title">
        <div><p>{metadata.eyebrow}</p><h1 id="library-document-title">{metadata.title}</h1><strong>{metadata.kind}</strong></div>
        <p>{metadata.summary}</p>
        <div className="library-reader-mark" aria-hidden="true">{metadata.marker}</div>
      </section>
      <div className="library-reader-layout">
        <nav className="library-toc" aria-label="本頁目錄">
          <p>CONTENTS</p>
          {parsed.tableOfContents.map((item) => <a className={`level-${item.level}`} href={`#${item.id}`} key={item.id}>{item.title}</a>)}
        </nav>
        <article className="library-manuscript">
          <NotionMarkdown document={parsed} classPrefix="library" />
        </article>
        <aside className="library-related">
          <p>RELATED VOLUMES</p>
          {related.map((item) => <Link href={item.href} key={item.slug}><b>{item.marker}</b><span><strong>{item.title}</strong><small>{item.kind}</small></span></Link>)}
          <small>來源於已核准的 Notion 文件；內部操作請回到有權限的 Runbook。</small>
        </aside>
      </div>
    </main>
  );
}
