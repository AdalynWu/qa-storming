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

function orbitSlotStyle(offset: number, revealOrder: number): CSSProperties {
  const shared: CSSProperties = {
    "--reveal-order": revealOrder,
    position: "absolute",
    left: "50%",
    top: "49%",
    width: 315,
    transformOrigin: "50% 60%",
    transformStyle: "preserve-3d",
    transition:
      "transform 720ms cubic-bezier(0.2, 0.76, 0.24, 1), opacity 420ms ease, filter 520ms ease",
    willChange: "transform, opacity",
    pointerEvents: "none",
  } as CSSProperties;

  const positions: Record<number, CSSProperties> = {
    0: {
      zIndex: 6,
      opacity: 1,
      visibility: "visible",
      filter: "none",
      transform:
        "translate(-50%, -50%) translate3d(0, 0, 210px) rotateY(0deg) scale(1)",
    },
    [-1]: {
      zIndex: 4,
      opacity: 1,
      visibility: "visible",
      filter: "saturate(0.76) brightness(0.82)",
      transform:
        "translate(-50%, -50%) translate3d(-270px, 13px, 20px) rotateY(-50deg) scale(0.82)",
    },
    1: {
      zIndex: 4,
      opacity: 1,
      visibility: "visible",
      filter: "saturate(0.76) brightness(0.82)",
      transform:
        "translate(-50%, -50%) translate3d(270px, 13px, 20px) rotateY(50deg) scale(0.82)",
    },
    [-2]: {
      zIndex: 2,
      opacity: 1,
      visibility: "visible",
      filter: "saturate(0.55) brightness(0.68)",
      transform:
        "translate(-50%, -50%) translate3d(-438px, 32px, -170px) rotateY(-74deg) scale(0.64)",
    },
    2: {
      zIndex: 2,
      opacity: 1,
      visibility: "visible",
      filter: "saturate(0.55) brightness(0.68)",
      transform:
        "translate(-50%, -50%) translate3d(438px, 32px, -170px) rotateY(74deg) scale(0.64)",
    },
  };

  return {
    ...shared,
    ...(positions[offset] ?? {
      zIndex: 0,
      opacity: 0,
      visibility: "hidden",
      transform:
        "translate(-50%, -50%) translate3d(0, 40px, -380px) scale(0.35)",
    }),
  };
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
        ‹
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
              style={orbitSlotStyle(offset, index)}
              aria-hidden={!isVisible}
              key={quest.id}
            >
              <div className="quest-book-reveal">
                <article
                  className={`quest-book theme-${quest.theme} ${isActive ? "is-active" : ""} ${quest.sealed ? "is-sealed" : ""}`}
                >
                  <div className="book-pages" aria-hidden="true" />
                  <div className="book-spine" aria-hidden="true" />
                  <div className="book-corner corner-one" aria-hidden="true">◆</div>
                  <div className="book-corner corner-two" aria-hidden="true">◆</div>
                  <div className="book-cover">
                    {quest.sealed && <span className="book-seal" aria-hidden="true">✦</span>}
                    <small>{quest.category}</small>
                    <h3>{quest.title}</h3>
                    <p>{quest.description}</p>
                    <div className="book-meta">
                      <span>{quest.progress}</span>
                      <b>{quest.reward}</b>
                    </div>
                    {quest.sealed ? (
                      <span className="book-cta is-disabled">
                        {quest.cta}
                        <span>◇</span>
                      </span>
                    ) : quest.href ? (
                      <Link className="book-cta" href={quest.href} tabIndex={isActive ? 0 : -1}>
                        {quest.cta}
                        <span>➜</span>
                      </Link>
                    ) : (
                      <button className="book-cta" type="button" tabIndex={isActive ? 0 : -1}>
                        {quest.cta}
                        <span>➜</span>
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
        ›
      </button>
      <p className="quest-position" aria-live="polite">
        {activeIndex + 1} / {orbitBooks.length}
      </p>
    </div>
  );
}
