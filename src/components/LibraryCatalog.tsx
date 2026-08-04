"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LibraryDocument, LibraryShelf } from "@/content/library";

const shelves: Array<"全部" | LibraryShelf> = ["全部", "產品手冊", "QA 參考資料", "測試工具"];

export function LibraryCatalog({ documents }: { documents: LibraryDocument[] }) {
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<(typeof shelves)[number]>("全部");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-Hant");
    return documents.filter((document) => {
      const inShelf = shelf === "全部" || document.shelf === shelf;
      const haystack = `${document.title} ${document.summary} ${document.eyebrow} ${document.kind}`.toLocaleLowerCase("zh-Hant");
      return inShelf && (!normalized || haystack.includes(normalized));
    });
  }, [documents, query, shelf]);

  return (
    <section className="library-catalog" aria-labelledby="library-catalog-title">
      <header className="library-desk">
        <div>
          <p>ARCHIVE SEARCH DESK</p>
          <h2 id="library-catalog-title">查詢櫃台</h2>
          <span>輸入產品、流程或工具名稱，從核准的卷冊中尋找答案。</span>
        </div>
        <label className="library-search">
          <span>搜尋書庫</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：錯誤碼、Maestro、Moor"
          />
        </label>
        <div className="library-filter" aria-label="書架篩選">
          {shelves.map((item) => (
            <button
              type="button"
              className={shelf === item ? "active" : undefined}
              aria-pressed={shelf === item}
              onClick={() => setShelf(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <p className="library-result-count" aria-live="polite">找到 {filtered.length} 卷文件</p>
      {shelves.slice(1).map((shelfName) => {
        const shelfDocuments = filtered.filter((document) => document.shelf === shelfName);
        if (!shelfDocuments.length) return null;
        return (
          <section className="library-shelf" aria-labelledby={`shelf-${shelfName}`} key={shelfName}>
            <header>
              <p>SHELF · {String(shelves.indexOf(shelfName)).padStart(2, "0")}</p>
              <h3 id={`shelf-${shelfName}`}>{shelfName}</h3>
              <span>{shelfDocuments.length} 卷</span>
            </header>
            <div className="library-volume-list">
              {shelfDocuments.map((document, index) => (
                <Link
                  className={`library-volume ${document.featured ? "featured" : ""}`}
                  href={document.href}
                  key={document.slug}
                >
                  <span className="library-volume-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="library-volume-mark" aria-hidden="true">{document.marker}</span>
                  <span className="library-volume-copy">
                    <small>{document.eyebrow}</small>
                    <strong>{document.title}</strong>
                    <span>{document.summary}</span>
                  </span>
                  <span className="library-volume-kind">{document.kind}</span>
                  <span className="library-volume-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {!filtered.length && (
        <div className="library-empty">
          <strong>這個書架暫時沒有相符卷冊。</strong>
          <span>試著縮短關鍵字，或切回「全部」。</span>
        </div>
      )}
    </section>
  );
}
