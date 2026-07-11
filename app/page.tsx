"use client";

import { useEffect, useState } from "react";

const fruits = [
  { id: "onboarding", className: "fruit-pink", icon: "✦", title: "新手村", subtitle: "ONBOARDING" },
  { id: "regression", className: "fruit-blue", icon: "◆", title: "試煉之森", subtitle: "REGRESSION" },
  { id: "knowhow", className: "fruit-green", icon: "✧", title: "賢者書庫", subtitle: "KNOW-HOW" },
];

const quests = [
  { type: "新手任務", title: "QA 冒險者啟程指南", description: "完成環境建置、權限申請與第一週修行。", progress: "12 個章節", reward: "+120 EXP", color: "mint", icon: "🧭" },
  { type: "團隊副本", title: "Console Web · Release 4.8", description: "核心流程、權限矩陣與跨瀏覽器回歸試煉。", progress: "84 Cases", reward: "P0 · 18", color: "blue", icon: "🛡️" },
  { type: "限時挑戰", title: "Mobile App · Checkout", description: "iOS / Android 結帳與錯誤恢復測試。", progress: "63 Cases", reward: "P0 · 12", color: "peach", icon: "⚔️" },
];

const lore = [
  { number: "I", title: "API 測試魔法書", text: "Contract testing、測試資料與常見除錯咒語。", badge: "8 MIN" },
  { number: "II", title: "缺陷鑑定圖鑑", text: "Severity、priority 與可靠證據的判定方式。", badge: "V3.2" },
  { number: "III", title: "測試環境世界地圖", text: "Dev、Staging、UAT 的入口與守門人。", badge: "9 MAPS" },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!frame) frame = requestAnimationFrame(() => { setScrollY(window.scrollY); frame = 0; });
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="rpg-world">
      <header className="rpg-nav">
        <button className="rpg-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="crest">Q</span><span><b>QA STORMING</b><small>Guild Knowledge Archive</small></span>
        </button>
        <nav className={menuOpen ? "rpg-links open" : "rpg-links"}>
          <button onClick={() => jumpTo("onboarding")}>新手村</button>
          <button onClick={() => jumpTo("regression")}>試煉之森</button>
          <button onClick={() => jumpTo("knowhow")}>賢者書庫</button>
        </nav>
        <div className="guild-level"><span>GUILD LV.</span><b>25</b><i><em /></i></div>
        <button className="rpg-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="切換選單">☰</button>
      </header>

      <section className="tree-hero">
        <div className="sky-layer" style={{ transform: `translateY(${scrollY * .08}px)` }} />
        <div className="tree-art" style={{ transform: `translateY(${scrollY * .15}px) scale(${1 + Math.min(scrollY, 500) * .00008})` }} />
        <div className="mist mist-one" style={{ transform: `translate3d(${-scrollY * .04}px, ${scrollY * .22}px, 0)` }} />
        <div className="mist mist-two" style={{ transform: `translate3d(${scrollY * .05}px, ${scrollY * .3}px, 0)` }} />
        <div className="hero-leaves" style={{ transform: `translateY(${scrollY * .45}px)` }} aria-hidden="true">❧　•　❧　　•　❧</div>

        <div className="hero-copy-rpg" style={{ transform: `translateY(${scrollY * .12}px)` }}>
          <p className="rpg-kicker"><span>✦</span> THE GREAT TREE OF QUALITY <span>✦</span></p>
          <h1>知識之樹，<br /><em>守護每次冒險。</em></h1>
          <p>在世界樹的枝葉之間，探索團隊累積的測試智慧。<br />採下果實，選擇你的任務旅程。</p>
          <button className="rpg-primary" onClick={() => jumpTo("onboarding")}><span>開始冒險</span><i>➜</i></button>
        </div>

        <div className="fruit-nav" aria-label="知識區域導航">
          {fruits.map((fruit) => (
            <button className={`magic-fruit ${fruit.className}`} key={fruit.id} onClick={() => jumpTo(fruit.id)}>
              <span className="fruit-orb"><i>{fruit.icon}</i></span>
              <span className="fruit-name"><small>{fruit.subtitle}</small><b>{fruit.title}</b></span>
            </button>
          ))}
        </div>

        <div className="animal animal-fox" style={{ transform: `translateY(${scrollY * .28}px)` }}><span className="animal-sprite sprite-fox" role="img" aria-label="狐狸嚮導" /><i>任務準備好了嗎？</i></div>
        <button className="rpg-scroll" onClick={() => jumpTo("onboarding")}><i>⌄</i><span>向下探索</span></button>
      </section>

      <section className="quest-zone" id="onboarding">
        <div className="parallax-hills hills-back" style={{ transform: `translateY(${(scrollY - 650) * .06}px)` }} />
        <div className="parallax-hills hills-front" style={{ transform: `translateY(${(scrollY - 650) * .12}px)` }} />
        <div className="zone-content">
          <div className="zone-title"><p>✦ ADVENTURER&apos;S QUEST BOARD ✦</p><h2>選擇今日任務</h2><span>每一份測試文件，都是讓產品世界更加安定的冒險紀錄。</span></div>
          <div className="quest-grid">
            {quests.map((quest, index) => (
              <article className={`quest-card ${quest.color}`} id={index === 1 ? "regression" : undefined} key={quest.title}>
                <div className="quest-pin">●</div><div className="quest-icon">{quest.icon}</div>
                <small>{quest.type}</small><h3>{quest.title}</h3><p>{quest.description}</p>
                <footer><span>{quest.progress}</span><b>{quest.reward}</b><button>接受任務</button></footer>
              </article>
            ))}
          </div>
        </div>
        <div className="critter owl" style={{ transform: `translate(${Math.sin(scrollY * .01) * 14}px, ${(scrollY - 800) * -.06}px)` }}><span className="animal-sprite sprite-owl" role="img" aria-label="飛行的貓頭鷹" /><i>HOOT!</i></div>
      </section>

      <section className="library-zone" id="knowhow">
        <div className="floating-motes" style={{ transform: `translateY(${(scrollY - 1500) * -.08}px)` }}>✦　·　✧　　　·　✦　　✧　·　✦</div>
        <div className="library-inner">
          <div className="book-copy"><p className="rpg-kicker"><span>✦</span> THE SAGE&apos;S ARCHIVE</p><h2>賢者的知識書庫</h2><p>把經驗寫成可以傳承的冒險筆記。所有卷軸都以 Markdown 保存，跟著版本一同成長。</p><button className="rpg-secondary">開啟完整圖書館　➜</button></div>
          <div className="lore-list">
            {lore.map((item) => <article key={item.title}><b>{item.number}</b><div><small>KNOWLEDGE SCROLL</small><h3>{item.title}</h3><p>{item.text}</p></div><span>{item.badge}</span></article>)}
          </div>
        </div>
        <div className="animal-deer" style={{ transform: `translateY(${(scrollY - 1500) * -.04}px)` }}><span className="animal-sprite sprite-deer" role="img" aria-label="散步的小鹿" /></div>
      </section>

      <section className="camp-zone">
        <div><p>QUEST COMPLETE</p><h2>與團隊一起，<br />寫下下一頁冒險。</h2></div>
        <div className="campfire"><span>✦</span><i>🔥</i><small>ALL SYSTEMS<br />NOMINAL</small></div>
      </section>
      <footer className="rpg-footer"><b>QA STORMING</b><span>Made for the guild that guards quality.</span><small>© 2026 SWAG QA GUILD</small></footer>
    </main>
  );
}
