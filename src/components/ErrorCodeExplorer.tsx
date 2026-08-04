"use client";

import { useMemo, useState } from "react";

export type ErrorCodeEntry = {
  code: string;
  key: string;
  scenario: string;
  scope: string;
};

const groups = [
  { id: "all", label: "全部" },
  { id: "unmapped", label: "未映射" },
  { id: "1", label: "1xxx 輸入" },
  { id: "2", label: "2xxx 規則" },
  { id: "4", label: "4xxx 權限" },
  { id: "5", label: "5xxx 資料" },
  { id: "6", label: "6xxx 限流" },
  { id: "9", label: "9xxx 系統" },
] as const;

function belongsToGroup(code: string, group: string) {
  if (group === "all") return true;
  if (group === "unmapped") return code === "未映射";
  return code.startsWith(group);
}

export function ErrorCodeExplorer({ entries }: { entries: ErrorCodeEntry[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-Hant");
    return entries.filter((entry) => {
      const haystack = `${entry.code} ${entry.key} ${entry.scenario} ${entry.scope}`.toLocaleLowerCase("zh-Hant");
      return belongsToGroup(entry.code, group) && (!normalized || haystack.includes(normalized));
    });
  }, [entries, group, query]);

  return (
    <section className="error-explorer" aria-labelledby="error-explorer-title">
      <header className="error-search-panel">
        <div>
          <p>IDENTIFICATION DESK</p>
          <h2 id="error-explorer-title">輸入線索，定位錯誤</h2>
          <span>可搜尋數字 Code、Backend Key、使用者情境或處理範圍。</span>
        </div>
        <label>
          <span>錯誤線索</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：4012、JWT、直播、付款"
          />
        </label>
        <div className="error-group-filter" aria-label="錯誤碼分類">
          {groups.map((item) => (
            <button
              type="button"
              aria-pressed={group === item.id}
              className={group === item.id ? "active" : undefined}
              onClick={() => setGroup(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="error-results-heading">
        <p aria-live="polite">顯示 {filtered.length} / {entries.length} 筆</p>
        <span>代碼範圍與 Owner 仍須以 Backend 現行契約複核。</span>
      </div>
      <div className="error-result-list">
        {filtered.map((entry) => (
          <article className="error-entry" key={`${entry.code}-${entry.key}`}>
            <div className="error-code"><small>CODE</small><strong>{entry.code}</strong></div>
            <div className="error-key"><small>BACKEND KEY</small><code>{entry.key}</code></div>
            <div className="error-scenario"><small>使用者情境</small><strong>{entry.scenario}</strong></div>
            <div className="error-scope"><small>處理範圍</small><span>{entry.scope}</span></div>
          </article>
        ))}
      </div>
      {!filtered.length && <div className="library-empty"><strong>沒有找到相符的錯誤代碼。</strong><span>請檢查拼字或切換分類。</span></div>}
    </section>
  );
}
