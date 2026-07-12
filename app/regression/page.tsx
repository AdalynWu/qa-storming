"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { regressionCases, regressionStats, regressionSuites, type TestCase } from "@/content/regression";
import "./regression.css";

type ViewMode = "reader" | "table";
type Filters = {
  search: string; module: string; platform: string; priority: string;
  lifecycle: string; tag: string;
};

const emptyFilters: Filters = {
  search: "", module: "all", platform: "all", priority: "all",
  lifecycle: "not-archived", tag: "all",
};

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function statusLabel(value: string) {
  return ({ active: "啟用", draft: "草稿", archived: "封存", manual: "手動", candidate: "候選", automated: "已自動化" } as Record<string, string>)[value] ?? value;
}

function RegressionExplorer() {
  const params = useSearchParams();
  const initialSuiteId = params.get("suite");
  const [suiteId, setSuiteId] = useState<string | null>(() => regressionSuites.some((suite) => suite.id === initialSuiteId) ? initialSuiteId : null);
  const [caseId, setCaseId] = useState<string | null>(params.get("case"));
  const [view, setView] = useState<ViewMode>(params.get("view") === "table" ? "table" : "reader");
  const [filters, setFilters] = useState<Filters>(() => ({ ...emptyFilters, module: params.get("module") ?? "all" }));

  const selectedSuite = regressionSuites.find((suite) => suite.id === suiteId) ?? null;
  const suiteCases = useMemo(() => regressionCases.filter((testCase) => testCase.suiteId === suiteId), [suiteId]);
  const options = useMemo(() => ({
    modules: unique(suiteCases.map((item) => item.module)),
    platforms: unique(suiteCases.flatMap((item) => item.platforms)),
    priorities: unique(suiteCases.map((item) => item.priority)),
    tags: unique(suiteCases.flatMap((item) => item.tags)),
  }), [suiteCases]);

  const filteredCases = useMemo(() => suiteCases.filter((testCase) => {
    const haystack = [testCase.id, testCase.title, testCase.module, ...testCase.steps, ...testCase.expectedResults].join(" ").toLowerCase();
    return (!filters.search || haystack.includes(filters.search.toLowerCase()))
      && (filters.module === "all" || testCase.module === filters.module)
      && (filters.platform === "all" || testCase.platforms.includes(filters.platform))
      && (filters.priority === "all" || testCase.priority === filters.priority)
      && (filters.lifecycle === "all" || (filters.lifecycle === "not-archived" ? testCase.lifecycleStatus !== "archived" : testCase.lifecycleStatus === filters.lifecycle))
      && (filters.tag === "all" || testCase.tags.includes(filters.tag));
  }), [filters, suiteCases]);

  const selectedCase = filteredCases.find((testCase) => testCase.id === caseId) ?? filteredCases[0] ?? null;

  useEffect(() => {
    const url = new URL(window.location.href);
    if (suiteId) url.searchParams.set("suite", suiteId); else url.searchParams.delete("suite");
    if (selectedCase) url.searchParams.set("case", selectedCase.id); else url.searchParams.delete("case");
    url.searchParams.set("view", view);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [selectedCase, suiteId, view]);

  const chooseSuite = (nextSuiteId: string) => {
    setSuiteId(nextSuiteId);
    setFilters(emptyFilters);
    setCaseId(regressionCases.find((item) => item.suiteId === nextSuiteId && item.lifecycleStatus !== "archived")?.id ?? null);
  };
  const clearSuite = () => { setSuiteId(null); setCaseId(null); setFilters(emptyFilters); };
  const updateFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <main className="regression-page">
      <header className="regression-header">
        <Link href="/#regression" className="regression-back">← 返回任務看板</Link>
        <div><small>QA STORMING · TRIAL ARCHIVE</small><h1>Regression 試煉圖鑑</h1></div>
        {selectedSuite ? <button className="atlas-button" onClick={clearSuite}>試煉總覽</button> : <span />}
      </header>

      {!selectedSuite ? (
        <section className="trial-atlas" aria-labelledby="atlas-title">
          <div className="atlas-copy"><p>✦ REGRESSION TRIAL ATLAS ✦</p><h2 id="atlas-title">選擇一座試煉領域</h2><span>{regressionStats.suiteCount} 個 Suites · {regressionStats.caseCount} 個公開案例 · P0 {regressionStats.p0Count}</span></div>
          <div className="suite-grid">
            {regressionSuites.filter((suite) => suite.status === "active").map((suite, index) => {
              const cases = regressionCases.filter((item) => item.suiteId === suite.id && item.lifecycleStatus !== "archived");
              return <button className={`suite-region region-${(index % 3) + 1}`} key={suite.id} onClick={() => chooseSuite(suite.id)}>
                <span className="region-emblem" aria-hidden="true">{["🛡️", "🌿", "⚔️"][index % 3]}</span>
                <small>{suite.subtitle}</small><h3>{suite.title}</h3><p>{suite.description}</p>
                <footer><span>{suite.platforms.join(" · ")}</span><b>{cases.length} CASES</b></footer>
              </button>;
            })}
          </div>
        </section>
      ) : (
        <section className="trial-workspace">
          <div className="suite-banner">
            <div><small>{selectedSuite.subtitle} · {selectedSuite.product}</small><h2>{selectedSuite.title}</h2><p>{selectedSuite.description}</p></div>
            <div className="view-toggle" aria-label="切換案例檢視"><button aria-pressed={view === "reader"} onClick={() => setView("reader")}>閱讀模式</button><button aria-pressed={view === "table"} onClick={() => setView("table")}>表格模式</button></div>
          </div>
          <div className="case-toolbar" aria-label="案例搜尋與篩選">
            <label className="search-field"><span className="sr-only">搜尋案例</span><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="搜尋 ID、標題、步驟…" /></label>
            <FilterSelect label="模組" value={filters.module} options={options.modules} onChange={(value) => updateFilter("module", value)} />
            <FilterSelect label="平台" value={filters.platform} options={options.platforms} onChange={(value) => updateFilter("platform", value)} />
            <FilterSelect label="優先級" value={filters.priority} options={options.priorities} onChange={(value) => updateFilter("priority", value)} />
            <FilterSelect label="生命週期" value={filters.lifecycle} options={["active", "draft", "archived"]} defaultLabel="未封存" defaultValue="not-archived" includeAll onChange={(value) => updateFilter("lifecycle", value)} />
            <FilterSelect label="標籤" value={filters.tag} options={options.tags} onChange={(value) => updateFilter("tag", value)} />
            <button className="clear-filters" onClick={() => setFilters(emptyFilters)}>清除</button>
            <p className="result-count" aria-live="polite">符合 {filteredCases.length} / 全部 {suiteCases.length}</p>
          </div>
          {filteredCases.length === 0 ? <div className="empty-cases"><span>✧</span><h3>沒有符合條件的案例</h3><p>調整搜尋字詞或清除篩選後再試一次。</p><button onClick={() => setFilters(emptyFilters)}>清除所有篩選</button></div>
            : view === "reader" ? <div className={caseId ? "case-reader has-case" : "case-reader"}><aside className="case-list" aria-label="案例清單">{filteredCases.map((testCase) => <CaseListButton key={testCase.id} testCase={testCase} active={selectedCase?.id === testCase.id} onClick={() => setCaseId(testCase.id)} />)}</aside>{selectedCase && <CaseDetail testCase={selectedCase} onBack={() => setCaseId(null)} />}</div>
              : <CaseTable cases={filteredCases} onChoose={(id) => { setCaseId(id); setView("reader"); }} />}
        </section>
      )}
    </main>
  );
}

function FilterSelect({ label, value, options, onChange, defaultLabel = "全部", defaultValue = "all", includeAll = false }: { label: string; value: string; options: string[]; onChange: (value: string) => void; defaultLabel?: string; defaultValue?: string; includeAll?: boolean }) {
  return <label className="filter-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value={defaultValue}>{defaultLabel}</option>{includeAll && <option value="all">全部</option>}{options.map((option) => <option value={option} key={option}>{statusLabel(option)}</option>)}</select></label>;
}

function CaseListButton({ testCase, active, onClick }: { testCase: TestCase; active: boolean; onClick: () => void }) {
  return <button className={active ? "case-list-item is-active" : "case-list-item"} onClick={onClick} aria-current={active ? "true" : undefined}><span><b>{testCase.id}</b><em className={`priority priority-${testCase.priority.toLowerCase()}`}>{testCase.priority}</em></span><strong>{testCase.title}</strong><small>{testCase.module} · {statusLabel(testCase.lifecycleStatus)}</small></button>;
}

function CaseDetail({ testCase, onBack }: { testCase: TestCase; onBack: () => void }) {
  return <article className="case-detail"><button className="mobile-case-back" onClick={onBack}>← 返回案例清單</button><header><div><span className={`priority priority-${testCase.priority.toLowerCase()}`}>{testCase.priority}</span><small>{testCase.id} · {testCase.module}</small></div><h2>{testCase.title}</h2><p>{testCase.platforms.join(" / ")} · {statusLabel(testCase.lifecycleStatus)}</p></header><div className="case-facts"><section><h3>前置條件</h3>{testCase.preconditions.length ? <ul>{testCase.preconditions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>無</p>}</section><section><h3>測試資料</h3>{testCase.testData.length ? <ul>{testCase.testData.map((item) => <li key={item}>{item}</li>)}</ul> : <p>無</p>}</section></div><div className="execution-sections"><section className="step-scroll"><h3>測試步驟</h3><ol>{testCase.steps.map((step, index) => <li key={`${index}-${step}`}><span>{index + 1}</span><div><p>{step}</p></div></li>)}</ol></section><section className="expected-scroll"><h3>預期結果</h3><ol>{testCase.expectedResults.map((result, index) => <li key={`${index}-${result}`}><span>✓</span><p>{result}</p></li>)}</ol></section></div><footer><div>{testCase.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><small>{testCase.owner && `Owner: ${testCase.owner}`}{testCase.updatedAt && ` · Updated: ${testCase.updatedAt}`}</small></footer></article>;
}

function CaseTable({ cases, onChoose }: { cases: TestCase[]; onChoose: (id: string) => void }) {
  return <div className="case-table-wrap"><table className="case-table"><thead><tr><th>ID</th><th>Module</th><th>標題</th><th>Priority</th><th>Platform</th><th>Lifecycle</th><th>Tags</th></tr></thead><tbody>{cases.map((testCase) => <tr key={testCase.id} onClick={() => onChoose(testCase.id)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onChoose(testCase.id); }}><td><b>{testCase.id}</b></td><td>{testCase.module}</td><td>{testCase.title}</td><td><span className={`priority priority-${testCase.priority.toLowerCase()}`}>{testCase.priority}</span></td><td>{testCase.platforms.join(" / ")}</td><td>{statusLabel(testCase.lifecycleStatus)}</td><td>{testCase.tags.join(", ")}</td></tr>)}</tbody></table></div>;
}

export default function RegressionPage() {
  return <Suspense fallback={<main className="regression-page"><div className="regression-loading">正在展開試煉圖鑑…</div></main>}><RegressionExplorer /></Suspense>;
}
