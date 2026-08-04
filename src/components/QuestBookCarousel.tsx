"use client";

import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { questBooks, type QuestBook } from "@/content/quests";

type OrbitQuest = QuestBook & {
  sealed?: boolean;
};

const MIN_ORBIT_BOOKS = 5;
const PARTICLE_COUNT = 18;

function createSealedBooks(count: number): OrbitQuest[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `sealed-quest-${index + 1}`,
    category: "SEALED QUEST",
    title: "封印中的任務書",
    description: "新的冒險篇章仍在樹靈的守護下沉睡。",
    progress: "等待解封",
    reward: "未知獎勵",
    theme: "mint",
    emblem: "✦",
    cta: "尚未解封",
    sealed: true,
  }));
}

function particleStyle(index: number): CSSProperties {
  return {
    "--particle-x": `${8 + ((index * 37) % 85)}%`,
    "--particle-size": `${3 + ((index * 5) % 7)}px`,
    "--particle-delay": `${-((index * 0.73) % 7.5)}s`,
    "--particle-duration": `${5.5 + ((index * 0.61) % 4)}s`,
    "--particle-drift": `${-26 + ((index * 19) % 53)}px`,
  } as CSSProperties;
}

function getOrbitOffset(index: number, activeIndex: number, total: number) {
  let offset = (index - activeIndex + total) % total;
  if (offset > total / 2) offset -= total;
  return offset;
}

function offsetClass(offset: number) {
  if (Math.abs(offset) > 2) return "is-behind";
  if (offset === 0) return "is-front";
  return offset < 0 ? `is-left-${Math.abs(offset)}` : `is-right-${offset}`;
}

function orbitSlotStyle(revealOrder: number): CSSProperties {
  return {
    "--reveal-order": revealOrder,
  } as CSSProperties;
}

function QuestChevron({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="quest-chevron"
      viewBox="0 0 24 24"
    >
      <path d={direction === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

export function QuestBookCarousel({
  quests = questBooks,
}: {
  quests?: QuestBook[];
}) {
  const orbitBooks = useMemo<OrbitQuest[]>(() => {
    if (quests.length >= MIN_ORBIT_BOOKS) return quests;
    return [...quests, ...createSealedBooks(MIN_ORBIT_BOOKS - quests.length)];
  }, [quests]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragPointerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const move = (direction: -1 | 1) => {
    setActiveIndex(
      (current) => (current + direction + orbitBooks.length) % orbitBooks.length,
    );
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.22 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [hasEntered]);

  if (!orbitBooks.length) return null;

  return (
    <div
      ref={rootRef}
      className={`quest-carousel quest-orbit ${hasEntered ? "is-entered" : ""}`}
      aria-label="冒險者任務書"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
    >
      <div className="quest-particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
          <i key={index} style={particleStyle(index)} />
        ))}
      </div>

      <button
        className="quest-arrow quest-prev"
        onClick={() => move(-1)}
        aria-label="上一項任務"
      >
        <QuestChevron direction="left" />
      </button>

      <div
        className="quest-orbit-stage"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest(".book-cta")) return;
          dragStartXRef.current = event.clientX;
          dragPointerRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (
            dragStartXRef.current === null ||
            dragPointerRef.current !== event.pointerId
          ) {
            return;
          }
          const distance = event.clientX - dragStartXRef.current;
          if (Math.abs(distance) >= 34) move(distance < 0 ? 1 : -1);
          dragStartXRef.current = null;
          dragPointerRef.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragStartXRef.current = null;
          dragPointerRef.current = null;
        }}
      >
        {orbitBooks.map((quest, index) => {
          const offset = getOrbitOffset(index, activeIndex, orbitBooks.length);
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          return (
            <div
              className={`quest-orbit-slot ${offsetClass(offset)}`}
              style={orbitSlotStyle(index)}
              aria-hidden={!isVisible}
              key={quest.id}
            >
              <div className="quest-book-reveal">
                <article
                  className={`quest-book theme-${quest.theme} ${isActive ? "is-active" : ""} ${quest.sealed ? "is-sealed" : ""}`}
                >
                  <div className="book-cover">
                    {quest.sealed && <span className="book-seal" aria-hidden="true">✦</span>}
                    <small>{quest.category}</small>
                    <h3>{quest.title}</h3>
                    <p>{quest.description}</p>
                    {quest.sealed ? (
                      <span className="book-cta is-disabled">
                        {quest.cta}
                        <span className="book-cta-icon">◇</span>
                      </span>
                    ) : quest.href ? (
                      <Link className="book-cta" href={quest.href} tabIndex={isActive ? 0 : -1}>
                        {quest.cta}
                        <span className="book-cta-icon"><QuestChevron /></span>
                      </Link>
                    ) : (
                      <button className="book-cta" type="button" tabIndex={isActive ? 0 : -1}>
                        {quest.cta}
                        <span className="book-cta-icon"><QuestChevron /></span>
                      </button>
                    )}
                  </div>
                </article>
              </div>
            </div>
          );
        })}

      </div>

      <button
        className="quest-arrow quest-next"
        onClick={() => move(1)}
        aria-label="下一項任務"
      >
        <QuestChevron />
      </button>
      <p className="quest-position" aria-live="polite">
        {activeIndex + 1} / {orbitBooks.length}
      </p>
    </div>
  );
}
