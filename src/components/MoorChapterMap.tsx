"use client";

import Link from "next/link";
import { useState } from "react";
import type { MoorChapter } from "@/content/moor";

type Props = {
  chapters: MoorChapter[];
};

export function MoorChapterMap({ chapters }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(chapters[0]?.slug ?? "");
  const selected = chapters.find((chapter) => chapter.slug === selectedSlug) ?? chapters[0];

  if (!selected) return null;

  return (
    <div className="moor-adventure-grid">
      <div className="moor-route-card">
        <div className="moor-route-heading">
          <div>
            <p>KNOW-HOW JOURNEY</p>
            <h2>選擇冒險章節</h2>
          </div>
          <span>{chapters.filter((chapter) => chapter.status === "published").length} 已整理 · {chapters.filter((chapter) => chapter.status === "review").length} 待審核</span>
        </div>

        <div className="moor-route-line" aria-hidden="true" />
        <div className="moor-chapter-nodes" role="group" aria-label="Moor 使用手冊章節">
          {chapters.map((chapter) => (
            <button
              type="button"
              key={chapter.slug}
              className={`moor-chapter-node ${selected.slug === chapter.slug ? "is-selected" : ""} ${chapter.status === "review" ? "is-sealed" : ""}`}
              onClick={() => setSelectedSlug(chapter.slug)}
              aria-pressed={selected.slug === chapter.slug}
              aria-label={`${chapter.title}，${chapter.status === "published" ? "已整理" : "待審核"}`}
            >
              <span className="moor-rune"><i>{chapter.rune}</i></span>
              <b>{chapter.title}</b>
              <small>{chapter.status === "published" ? "已整理" : "待審核"}</small>
            </button>
          ))}
        </div>
      </div>

      <aside className="moor-preview-scroll" aria-live="polite">
        <p>{selected.subtitle}</p>
        <h2>{selected.title}</h2>
        <div className={`moor-doc-status status-${selected.status}`}>
          <span aria-hidden="true" />
          {selected.status === "published" ? "QA CURATED" : "AWAITING REVIEW"}
        </div>
        <p className="moor-preview-summary">{selected.summary}</p>
        <dl>
          <div><dt>閱讀時間</dt><dd>{selected.duration}</dd></div>
          <div><dt>內容狀態</dt><dd>{selected.status === "published" ? "可閱讀" : "整理與審核中"}</dd></div>
        </dl>
        {selected.status === "published" ? (
          <Link className="moor-enter-chapter" href={`/products/moor/${selected.slug}`}>
            展開魔法書 <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <button className="moor-enter-chapter is-disabled" type="button" disabled>
            章節尚未解封
          </button>
        )}
      </aside>
    </div>
  );
}
