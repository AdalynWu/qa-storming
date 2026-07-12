"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { questBooks, type QuestBook } from "@/content/quests";
import "swiper/css";
import "swiper/css/a11y";

// Swiper loop needs roughly 2×slidesPerView+1 real slides to fill the wrap-around
// buffer (desktop shows 3-up). If there aren't enough quests, repeat them until there
// are; once there are enough, use them as-is (no duplication).
const MIN_LOOP_SLIDES = 7;
export function QuestBookCarousel({ quests = questBooks }: { quests?: QuestBook[] }) {
  const slides = quests.length >= MIN_LOOP_SLIDES
    ? quests
    : Array.from({ length: Math.ceil(MIN_LOOP_SLIDES / quests.length) }, () => quests).flat();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="quest-carousel" aria-label="冒險者任務書" aria-roledescription="carousel">
      <button className="quest-arrow quest-prev" onClick={() => swiperRef.current?.slidePrev()} aria-label="上一項任務">‹</button>
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        loop
        centeredSlides
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true, prevSlideMessage: "上一項任務", nextSlideMessage: "下一項任務", slideLabelMessage: "{{index}} / {{slidesLength}}" }}
        slidesPerView={1}
        spaceBetween={12}
        speed={620}
        breakpoints={{ 680: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }}
        onSwiper={(swiper) => { swiperRef.current = swiper; setActiveIndex(swiper.realIndex); }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((quest, index) => (
          <SwiperSlide key={`${quest.id}-${index}`}>
            {({ isActive }) => (
              <article
                className={`quest-book theme-${quest.theme} ${isActive ? "is-active" : ""}`}
                onClick={() => { if (!isActive) swiperRef.current?.slideToLoop(index); }}
              >
                <div className="book-pages" aria-hidden="true" />
                <div className="book-spine" aria-hidden="true" />
                <div className="book-corner corner-one" aria-hidden="true">◆</div>
                <div className="book-corner corner-two" aria-hidden="true">◆</div>
                <div className="book-cover">
                  <small>{quest.category}</small>
                  <div className="book-emblem" aria-hidden="true">{quest.emblem}</div>
                  <h3>{quest.title}</h3>
                  <p>{quest.description}</p>
                  <div className="book-meta"><span>{quest.progress}</span><b>{quest.reward}</b></div>
                  {quest.href ? (
                    <Link className="book-cta" href={quest.href} tabIndex={isActive ? 0 : -1}>{quest.cta}<span>➜</span></Link>
                  ) : (
                    <button className="book-cta" type="button" tabIndex={isActive ? 0 : -1}>{quest.cta}<span>➜</span></button>
                  )}
                </div>
              </article>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="quest-arrow quest-next" onClick={() => swiperRef.current?.slideNext()} aria-label="下一項任務">›</button>
      <p className="quest-position" aria-live="polite">{(activeIndex % quests.length) + 1} / {quests.length}</p>
    </div>
  );
}
