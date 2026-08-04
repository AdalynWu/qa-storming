# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 App Router、React、TypeScript、CSS；以 `output: "export"` 產生純靜態網站並部署至 Firebase Hosting。

## Users

- 主要使用者是 QA 團隊成員，包含正在熟悉產品與流程的新人，以及需要快速查找既有測試知識的成員。
- 使用情境以桌機閱讀與操作為主，但手機必須能完整查找、閱讀及使用核心導覽。

## Product Purpose

QA Storming 是團隊知識中心：以同一個可探索的奇幻公會世界，整合產品地圖、Onboarding、Regression、產品 Know-how、錯誤碼與測試工具文件，讓知識可以被找到、理解、驗證並持續維護。

## Core Workflows

- 從首頁選擇新手任務、Regression 試煉或賢者書庫。
- 從產品世界地圖理解產品、平台、環境與 QA 注意事項。
- 依產品或章節閱讀 Moor／Web Know-how。
- 依產品、主題或文件類型查找 QA 參考資料與工具手冊。
- 從全站賢者問答櫃台提問，依公開核准文件取得附來源的繁體中文回答；資料不足時明確拒答。
- 桌機使用者可進入 `/rpg` 迷霧測試林 3D 互動副本，練習 vibe coding 後如何自測（語句／決策覆蓋、邊界值、等價分割、error／defect／failure 等）；手機／觸控裝置不提供，會顯示擋頁。
- 從 Google Sheet／Notion 的核准來源產生可審核的靜態內容。

## Product Principles

- 探索感服務於理解，不能犧牲文件可讀性、搜尋、複製、鍵盤操作或錯誤恢復。
- Quest Books 表達「接下來完成什麼」；賢者書庫回答「去哪裡查資料」；產品 Hub 保存正式產品章節。
- 新版且已核准的來源優先；未審核、舊版、Sandbox、留言或推測不得包裝成現行規格。
- 文件預設採安全整理版，不公開帳號、UID、Token、驗證碼、付款資料、內部 Workspace／頻道／issue 連結或正式環境繞過指令。
- `noindex` 不是存取控制；目前靜態部署沒有登入與權限邊界，受限制內容只能以「內部 Runbook」占位，不得輸出原文。

## Content Sources

- Regression：Google Sheet 同步產生的結構化資料。
- 非 Regression 文件：Notion `Website Docs Catalog` allowlist，僅 `published + approved` 內容可進入 generated 輸出。
- 產品範圍：Master Design File；近期已核准 Mockup／Ready for dev 可覆蓋 Master 的舊內容。
- 專案內建 TypeScript 內容可作安全 fallback，但不得繞過審核與敏感資訊規則。

## Accessibility

- 核心內容與導覽不以 hydration、動畫、顏色或圖片內文字作為唯一載體。
- 支援鍵盤、明確 focus、約 44 × 44px 觸控目標、較大系統字級及 `prefers-reduced-motion`。
- 一般頁面不得產生 body 水平捲動；寬表格需限制在可辨識的內層捲動容器。

## Durable Constraints

- 維持純靜態輸出；沒有 server、API route、runtime server action 或資料庫。
- Chatbot 只索引 Notion manifest 核准的公開 Markdown；瀏覽器本地檢索後，透過 Firebase AI Logic Web SDK 與 App Check 呼叫 Gemini，不在前端保存 Gemini Developer API Key。
- `public/` 保留在 repo root；主要場景由既有插畫資產承擔，CSS 處理排版、材質、光影與動畫。
- Git、部署與正式 Workspace 權限由使用者處理。

## Open Decisions

- 若未來需要呈現完整內部 Runbook，必須先決定具登入或內網限制的部署模型；目前不將敏感內容放入網站輸出或 Demo Workspace。
