"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ImmersiveTreeHero } from "@/components/ImmersiveTreeHero";
import { QuestBookCarousel } from "@/components/QuestBookCarousel";
import { TrialForestPortal } from "@/components/TrialForestPortal";
import { onboardingQuestBooks } from "@/content/quests";

const fruits = [
  { id: "onboarding", className: "fruit-pink", icon: "✦", title: "新手村", subtitle: "ONBOARDING" },
  { id: "regression", className: "fruit-blue", icon: "◆", title: "試煉之森", subtitle: "REGRESSION" },
  { id: "knowhow", className: "fruit-green", icon: "✧", title: "賢者書庫", subtitle: "KNOW-HOW" },
];

const lore = [
  { number: "I", title: "Moor App 創作者手冊", text: "快速入門、直播流程與創作者端 QA Know-how。", badge: "OPEN", href: "/products/moor" },
  { number: "II", title: "缺陷鑑定圖鑑", text: "Severity、priority 與可靠證據的判定方式。", badge: "V3.2" },
  { number: "III", title: "測試環境世界地圖", text: "Dev、Staging、UAT 的入口與守門人。", badge: "9 MAPS" },
  { number: "IV", title: "回歸測試典藏室", text: "依產品、模組與風險查閱 Regression Test Cases。", badge: "OPEN", href: "/regression" },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const mobileNavRef = useRef<HTMLDetailsElement | null>(null);

  const closeMobileNav = () => {
    if (mobileNavRef.current) mobileNavRef.current.open = false;
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!frame) frame = requestAnimationFrame(() => { setScrollY(window.scrollY); frame = 0; });
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);

  return (
    <main className="rpg-world" id="top">
      <header className="rpg-nav">
        <a className="rpg-brand" href="#top" aria-label="返回頁首">
          <span className="crest">Q</span><span><b>QA STORMING</b><small>Guild Knowledge Archive</small></span>
        </a>
        <nav className="rpg-links" aria-label="主要導覽">
          <a href="#onboarding">新手村</a>
          <a href="#regression">試煉之森</a>
          <a href="#knowhow">賢者書庫</a>
        </nav>
        <div className="guild-level"><span>GUILD LV.</span><b>25</b><i><em /></i></div>
        <details className="rpg-mobile-nav" ref={mobileNavRef}>
          <summary className="rpg-menu" aria-label="切換選單">☰</summary>
          <nav className="rpg-mobile-menu" aria-label="手機導覽">
            <a href="#onboarding" onClick={closeMobileNav}>新手村</a>
            <a href="#regression" onClick={closeMobileNav}>試煉之森</a>
            <a href="#knowhow" onClick={closeMobileNav}>賢者書庫</a>
          </nav>
        </details>
      </header>

      <section className="tree-hero">
        <div className="sky-layer" style={{ transform: `translateY(${scrollY * .08}px)` }} />
        <div className="tree-art" style={{ transform: `translateY(${scrollY * .15}px) scale(${1 + Math.min(scrollY, 500) * .00008})` }} />
        <ImmersiveTreeHero />
        <div className="mist mist-one" style={{ transform: `translate3d(${-scrollY * .04}px, ${scrollY * .22}px, 0)` }} />
        <div className="mist mist-two" style={{ transform: `translate3d(${scrollY * .05}px, ${scrollY * .3}px, 0)` }} />
        <div className="hero-leaves" style={{ transform: `translateY(${scrollY * .45}px)` }} aria-hidden="true">❧　•　❧　　•　❧</div>

        <div className="hero-copy-rpg" style={{ transform: `translateY(${scrollY * .12}px)` }}>
          <p className="rpg-kicker"><span>✦</span> THE GREAT TREE OF QUALITY <span>✦</span></p>
          <h1>知識之樹，<br /><em>守護每次冒險。</em></h1>
          <p>在世界樹的枝葉之間，探索團隊累積的測試智慧。<br />採下果實，選擇你的任務旅程。</p>
          <a className="rpg-primary" href="#onboarding"><span>開始冒險</span><i>➜</i></a>
        </div>

        <div className="fruit-nav" aria-label="知識區域導航">
          {fruits.map((fruit) => (
            <a className={`magic-fruit ${fruit.className}`} key={fruit.id} href={`#${fruit.id}`}>
              <span className="fruit-orb"><i>{fruit.icon}</i></span>
              <span className="fruit-name"><small>{fruit.subtitle}</small><b>{fruit.title}</b></span>
            </a>
          ))}
        </div>

        <div className="animal animal-fox" style={{ transform: `translateX(${scrollY * .28}px)` }}><span className="animal-sprite sprite-jelly" role="img" aria-label="史萊姆嚮導" /><i>任務準備好了嗎？</i></div>
        <a className="rpg-scroll" href="#onboarding"><i>⌄</i><span>向下探索</span></a>
      </section>

      <section className="quest-zone" id="onboarding">
        <div className="parallax-hills hills-back" style={{ transform: `translateY(${(scrollY - 650) * .06}px)` }} />
        <div className="parallax-hills hills-front" style={{ transform: `translateY(${(scrollY - 650) * .12}px)` }} />
        <div className="zone-content">
          <div className="zone-title"><p>✦ ADVENTURER&apos;S BEGINNING ✦</p><h2>新手村任務書</h2><span>從團隊指南與產品世界地圖開始，準備你的第一場 QA 冒險。</span></div>
          <QuestBookCarousel quests={onboardingQuestBooks} />
        </div>
        <div className="critter bat" style={{ transform: `translate(${(scrollY - 650) * .5}px, ${(scrollY - 650) * -.34}px)` }}><span className="animal-sprite sprite-bat" role="img" aria-label="飛行的蝙蝠" /></div>
      </section>

      <section className="trial-forest-zone" id="regression">
        <TrialForestPortal />
      </section>

      <section className="library-zone" id="knowhow">
        <div className="floating-motes" style={{ transform: `translateY(${(scrollY - 1500) * -.08}px)` }}>✦　·　✧　　　·　✦　　✧　·　✦</div>
        <div className="library-inner">
          <div className="book-copy"><p className="rpg-kicker"><span>✦</span> THE SAGE&apos;S ARCHIVE</p><h2>賢者的知識書庫</h2><p>把經驗寫成可以傳承的冒險筆記。所有卷軸都以 Markdown 保存，跟著版本一同成長。</p><button className="rpg-secondary">開啟完整圖書館　➜</button></div>
          <div className="lore-list">
            {lore.map((item) => {
              const entry = <article><b>{item.number}</b><div><small>KNOWLEDGE SCROLL</small><h3>{item.title}</h3><p>{item.text}</p></div><span>{item.badge}</span></article>;
              return item.href ? <Link className="lore-link" href={item.href} key={item.title}>{entry}</Link> : <div key={item.title}>{entry}</div>;
            })}
          </div>
        </div>
        <div className="animal-wolf" style={{ transform: `translateX(${(scrollY - 1350) * .6}px)` }}><span className="animal-sprite sprite-wolf" role="img" aria-label="奔跑的狼" /></div>
      </section>

      <section className="camp-zone">
        <div><p>QUEST COMPLETE</p><h2>與團隊一起，<br />寫下下一頁冒險。</h2></div>
        <div className="campfire"><span>✦</span><i>🔥</i><small>ALL SYSTEMS<br />NOMINAL</small></div>
      </section>
      <footer className="rpg-footer"><b>QA STORMING</b><span>Made for the guild that guards quality.</span><small>© 2026 SWAG QA GUILD</small></footer>
    </main>
  );
}
