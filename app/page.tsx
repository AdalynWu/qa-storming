"use client";

import { useEffect, useState } from "react";

const destinations = [
  { id: "onboarding", code: "01", title: "ONBOARDING", subtitle: "新成員導航", className: "planet-cyan" },
  { id: "regression", code: "02", title: "REGRESSION", subtitle: "產品測試星系", className: "planet-violet" },
  { id: "knowhow", code: "03", title: "KNOW-HOW", subtitle: "知識資料庫", className: "planet-amber" },
];

const documents = [
  { category: "ONBOARDING", title: "QA 新人啟航手冊", description: "環境、權限、測試流程與第一週任務。", meta: "12 篇 · 更新於 2 天前", accent: "cyan" },
  { category: "REGRESSION", title: "Console Web — Release 4.8", description: "核心流程、權限矩陣與跨瀏覽器回歸清單。", meta: "84 cases · P0 18", accent: "violet" },
  { category: "REGRESSION", title: "Mobile App — Checkout", description: "iOS / Android 結帳、支付與錯誤恢復測試。", meta: "63 cases · P0 12", accent: "violet" },
  { category: "KNOW-HOW", title: "API 測試作戰指南", description: "Contract testing、測試資料與常見除錯路徑。", meta: "8 分鐘閱讀", accent: "amber" },
  { category: "KNOW-HOW", title: "缺陷分級與回報標準", description: "Severity、priority、證據與可重現步驟範例。", meta: "團隊規範 · v3.2", accent: "amber" },
  { category: "ONBOARDING", title: "測試環境星圖", description: "Dev、Staging、UAT 服務與負責人一覽。", meta: "9 個環境", accent: "cyan" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--mx", x.toFixed(3));
      document.documentElement.style.setProperty("--my", y.toFixed(3));
    };
    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  const filtered = documents.filter((doc) =>
    `${doc.category} ${doc.title} ${doc.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main>
      <section className="cockpit" aria-label="QA Mission Control 首頁">
        <div className="stars stars-back" aria-hidden="true" />
        <div className="stars stars-front" aria-hidden="true" />
        <header className="topbar">
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回首頁">
            <span className="brand-mark">Q</span>
            <span><b>QA</b> MISSION CONTROL<small>QUALITY KNOWLEDGE SYSTEM</small></span>
          </button>
          <nav className={menuOpen ? "nav open" : "nav"} aria-label="主選單">
            <button onClick={() => jumpTo("onboarding")}>ONBOARDING</button>
            <button onClick={() => jumpTo("regression")}>REGRESSION</button>
            <button onClick={() => jumpTo("knowhow")}>KNOW-HOW</button>
            <button onClick={() => jumpTo("architecture")}>ARCHITECTURE</button>
          </nav>
          <div className="system-status"><i /> ALL SYSTEMS NOMINAL</div>
          <button className="menu" onClick={() => setMenuOpen((value) => !value)} aria-label="切換選單" aria-expanded={menuOpen}>☰</button>
        </header>

        <div className="window-frame" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />

        <div className="hero-copy">
          <p className="eyebrow"><span /> MISSION 025 — KNOWLEDGE FRONTIER</p>
          <h1>EXPLORE.<br /><em>VERIFY.</em><br />DELIVER.</h1>
          <p className="intro">探索團隊知識星系，建立可靠的測試航線。<br />每一次發佈，都從清晰的資訊開始。</p>
          <button className="primary" onClick={() => jumpTo("documents")}>啟動探索 <span>↗</span></button>
        </div>

        <div className="planet-system">
          {destinations.map((destination, index) => (
            <button key={destination.id} className={`planet-node node-${index + 1}`} onClick={() => jumpTo(destination.id)} aria-label={`前往 ${destination.title}`}>
              <span className={`planet ${destination.className}`}><i /></span>
              <span className="planet-label"><small>{destination.code} //</small><b>{destination.title}</b><em>{destination.subtitle}</em></span>
            </button>
          ))}
        </div>

        <div className="telemetry left"><span>LAT 25.0330° N</span><span>LNG 121.5654° E</span></div>
        <div className="telemetry right"><span>VELOCITY 27,580 KM/H</span><span>ORBIT STABLE</span></div>
        <button className="scroll-cue" onClick={() => jumpTo("documents")}><span /> SCROLL TO NAVIGATE</button>
      </section>

      <section className="knowledge" id="documents">
        <div className="section-head">
          <div><p className="eyebrow"><span /> KNOWLEDGE SECTORS</p><h2>選擇你的任務航線</h2></div>
          <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋文件、產品或關鍵字..." aria-label="搜尋文件" /></label>
        </div>
        <div className="sector-tabs" aria-label="文件分類">
          {destinations.map((item) => <button key={item.id} onClick={() => jumpTo(item.id)}>{item.code} <span>{item.title}</span></button>)}
        </div>

        <div className="doc-grid">
          {filtered.map((doc, index) => (
            <article className={`doc-card ${doc.accent}`} id={index === 0 ? "onboarding" : index === 1 ? "regression" : index === 3 ? "knowhow" : undefined} key={doc.title}>
              <div className="doc-top"><span>{doc.category}</span><i>MD</i></div>
              <h3>{doc.title}</h3><p>{doc.description}</p>
              <footer><small>{doc.meta}</small><button aria-label={`開啟 ${doc.title}`}>↗</button></footer>
            </article>
          ))}
          {filtered.length === 0 && <p className="empty">這片星域沒有符合的文件，試試其他關鍵字。</p>}
        </div>
      </section>

      <section className="architecture" id="architecture">
        <p className="eyebrow"><span /> SYSTEM BLUEPRINT</p>
        <div className="architecture-grid">
          <div><h2>Markdown 驅動，<br />保持簡單而可靠。</h2><p>文件跟著程式碼一起版本控管，透過 Pull Request 審閱。前端在建置時讀取 Markdown，不需要先維護額外資料庫。</p></div>
          <div className="pipeline" aria-label="內容發布流程"><span>VS CODE<small>編輯 .md</small></span><i>→</i><span>GIT<small>審閱版本</small></span><i>→</i><span>BUILD<small>產生網站</small></span><i>→</i><span>DEPLOY<small>全球發佈</small></span></div>
        </div>
      </section>

      <footer className="footer"><span>QA MISSION CONTROL</span><small>Built for teams who verify the future.</small><b>STATUS: OPERATIONAL</b></footer>
    </main>
  );
}
