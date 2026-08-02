# AGENTS.md — AI 工作守則與規範

本專案由 **Claude 與 Codex 並行開發**,兩邊都可能新增/修改/刪除檔案。本檔是**所有 AI agent 的主入口**,開工前務必先讀。

`qa-storming` 是 QA 團隊知識中心網站:Next.js 16(App Router）以 `output: "export"` 產生純靜態站,部署在 Firebase Hosting,溫暖奇幻 RPG 風、繁體中文。**沒有 server / API route / DB。**

---

## 文件索引(治理系統)

| 文件 | 位置 | 用途 | 何時更新 |
|---|---|---|---|
| `AGENTS.md` | root | 本檔:工作守則、文件索引 | 規範改變時 |
| `CHANGELOG.md` | root | 版本變更紀錄(Keep a Changelog) | 每次發版 / 顯著變更 |
| `PLAN.md` | `docs/` | 專案計劃與 Roadmap、milestone | 完成 milestone / 規劃調整 |
| `PROGRESS.md` | `docs/` | 進度紀錄(dated 日誌) | **每次完成工作** |
| `DECISION.md` | `docs/` | 設計決策與原因(ADR) | **架構/技術決策變更時** |
| `TASK.md` | `docs/` | 待辦事項與優先級 | 領取/完成/新增任務時 |
| `MEMORY.md` | `docs/` | 長期知識與專案慣例、地雷 | 發現新慣例/踩雷時 |
| `ARCHITECTURE.md` | `docs/` | 系統架構與設計說明 | 架構變動時 |
| `DESIGN.md` | root | 前端視覺、互動、圖片與 RWD 規範 | 視覺/風格調整時 |
| `CLAUDE.md` | root | Claude Code 專用指引、build/deploy、地雷 | — |

`docs/` 另有 `regression-authoring.md`(regression 撰寫 SOP)、`notion-content-sync.md`(文件管線討論)。

---

## 工作流規範

**每次執行任務前**,先讀:`AGENTS.md` → `docs/PLAN.md` → `docs/PROGRESS.md` → `docs/TASK.md`,並視任務讀相關的 `docs/DECISION.md`、`docs/ARCHITECTURE.md`、`docs/MEMORY.md`、`DESIGN.md`。

**每次完成工作後**:
- 一律更新 `docs/PROGRESS.md`(新增 dated 條目)。
- 若**架構/技術決策有變**→ 更新 `docs/DECISION.md`(必要時同步 `docs/ARCHITECTURE.md`)。
- 若**完成一個 milestone** → 更新 `docs/PLAN.md`。
- 若**發版或有顯著變更** → 更新 `CHANGELOG.md`。
- 動到待辦 → 同步 `docs/TASK.md`。

## 與 Codex 並行的編輯禮儀(降低衝突)

- dated 條目(PROGRESS / CHANGELOG / DECISION)一律**最新在上**,用**附加**,不要改寫或重排他人既有條目。
- 每次編輯**聚焦單一主題**,檔案改動範圍越小越好。
- 不確定對方是否正在動同一區塊時,傾向新增段落而非重寫。

## ⚠️ Git 由使用者本人處理

**任何 git 操作(staging / commit / push / pull / branch)都由使用者親自執行,agent 不執行任何 git 指令。** Agent 只負責改檔案內容;是否納入版控、如何 commit 交給使用者。

## 硬性限制

- 純靜態匯出(`output: "export"`)——不能有 server、API route、runtime server action、DB。要後端須先改部署模型(見 `docs/DECISION.md`)。
- `public/` 必須留在 repo root(Next 要求)。
- Sprite sheet 一律先重排成**等距格**再用,否則 CSS `steps()` 動畫會裁切(見 `docs/MEMORY.md`)。
- 部署一步到位:`npm run deploy`(已含 build)。
- UI 任務遵守 root `DESIGN.md`:圖片主導場景/主要物件,CSS 做排版、光影與動畫,JSX 管狀態;同時驗證手機、鍵盤與 `prefers-reduced-motion`。
