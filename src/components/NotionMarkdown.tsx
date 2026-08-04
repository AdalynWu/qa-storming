import type { ReactNode } from "react";
import type { NotionMarkdownBlock, ParsedNotionMarkdown } from "@/content/notion-markdown";

function safeHref(value: string) {
  if (value.startsWith("/") || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

function InlineMarkdown({ text }: { text: string }) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={`${match.index}-code`}>{token.slice(1, -1)}</code>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = link ? safeHref(link[2]) : undefined;
      nodes.push(href
        ? <a href={href} key={`${match.index}-link`}>{link?.[1]}</a>
        : link?.[1] ?? token);
    }
    cursor = match.index + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

type NotionMarkdownClassPrefix = "moor" | "web" | "library";

function Blocks({
  blocks,
  classPrefix,
  showCallouts,
}: {
  blocks: NotionMarkdownBlock[];
  classPrefix: NotionMarkdownClassPrefix;
  showCallouts: boolean;
}) {
  return blocks.map((block, index) => {
    const key = block.type === "heading" ? block.id : `${block.type}-${index}`;
    if (block.type === "heading") {
      const Heading = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
      return <Heading className={`notion-heading notion-heading-${block.level}`} id={block.id} key={key}><InlineMarkdown text={block.text} /></Heading>;
    }
    if (block.type === "paragraph") return <p className={`${classPrefix}-doc-paragraph`} key={key}><InlineMarkdown text={block.text} /></p>;
    if (block.type === "unordered-list") {
      return <ul className={`${classPrefix}-check-list`} key={key}>{block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}><InlineMarkdown text={item} /></li>)}</ul>;
    }
    if (block.type === "ordered-list") {
      return <ol className={`${classPrefix}-steps`} key={key}>{block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}><span><InlineMarkdown text={item} /></span></li>)}</ol>;
    }
    if (block.type === "callout") {
      if (!showCallouts) return null;
      return <aside className={`${classPrefix}-callout ${block.tone === "warning" ? "warning" : ""}`} key={key}><Blocks blocks={block.blocks} classPrefix={classPrefix} showCallouts={showCallouts} /></aside>;
    }
    if (block.type === "details") {
      return <details className="notion-details" key={key}><summary><InlineMarkdown text={block.summary} /></summary><div><Blocks blocks={block.blocks} classPrefix={classPrefix} showCallouts={showCallouts} /></div></details>;
    }
    if (block.type === "table") {
      const [headings, ...rows] = block.rows;
      return (
        <div className={`${classPrefix}-table-wrap`} key={key}>
          <table><thead><tr>{headings.map((cell, cellIndex) => <th key={`${cell}-${cellIndex}`}><InlineMarkdown text={cell} /></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}><InlineMarkdown text={cell} /></td>)}</tr>)}</tbody></table>
        </div>
      );
    }
    if (block.type === "quote") return <blockquote className="notion-quote" key={key}><InlineMarkdown text={block.text} /></blockquote>;
    if (block.type === "code") return <pre className="notion-code" key={key}><code data-language={block.language}><InlineMarkdown text={block.code} /></code></pre>;
    return <hr className="notion-divider" key={key} />;
  });
}

export function NotionMarkdown({
  document,
  classPrefix = "moor",
  showCallouts = true,
}: {
  document: ParsedNotionMarkdown;
  classPrefix?: NotionMarkdownClassPrefix;
  showCallouts?: boolean;
}) {
  return <div className="notion-document"><Blocks blocks={document.blocks} classPrefix={classPrefix} showCallouts={showCallouts} /></div>;
}
