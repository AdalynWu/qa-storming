# Regression Test Case 維護與 AI 起草流程

## 資料來源

Google Sheet 是唯一正式編輯來源。網站使用的 `content/generated/regression.json` 由同步程式產生，請勿手動修改。

工作簿需要兩個分頁：

- `Suites`：`id`、`title`、`subtitle`、`product`、`platforms`、`release`、`description`、`owner`、`status`
- `Cases`：`id`、`suiteId`、`module`、`title`、`priority`、`platforms`、`preconditions`、`testData`、`steps`、`expectedResults`、`tags`、`lifecycleStatus`、`owner`、`updatedAt`

`steps` 與 `expectedResults` 都以儲存格內換行逐項填寫，兩者數量可以不同。網站依 Cases 分頁的資料列順序呈現，不會再依 ID 排序。

- `draft`：初稿期可直接修改 ID、刪除或拖曳資料列調整順序。
- `active`：ID 視為正式且不可重用；不再使用時先改為 `archived` 並同步，不要直接刪除。
- `archived`：保留歷史；若確定要永久刪除，先完成一次 archived 同步，再移除資料列。

## 第一次設定同步權限

1. 在 Google Cloud 建立 service account，啟用 Google Sheets API。
2. 下載 service-account JSON，存放在 repo 外或不會進 Git 的本機路徑。
3. 將私有 Sheet 以「檢視者」分享給 JSON 內的 `client_email`。
4. 複製 `.env.example` 為 `.env.local`，填入 Sheet ID 與憑證路徑。
5. 執行 `npm run sync:regression`，檢查輸出的新增、修改與封存摘要。

首次用正式 Sheet 取代網站內建示例資料時，僅執行一次：

```bash
npm run sync:regression -- --replace-sample-baseline
```

此參數只能用於內建示例基準。正式資料同步成功後會自動失效，後續案例必須先在 Sheet 標記 `archived`，不可用參數略過刪除保護。

同步成功後，依序檢查生成資料、執行測試與 build，再進入既有部署流程。

## 錄影與 AI 起草 SOP

1. 優先在 staging 錄製。若只能使用 production，先遮蔽個資、token、付款資訊與真實帳號。
2. 將影片整理成關鍵影格、GIF 或 contact sheet，並標明操作順序。
3. 一起提供角色、平台、環境、帳號狀態、流程目的與已知限制。
4. 要求 AI 依 `Cases` 欄位起草，並將 `lifecycleStatus` 固定設為 `draft`。
5. QA 人工確認每一步與預期結果，補上 negative、權限、邊界、錯誤恢復、網路中斷及跨平台案例。
6. 審核後回填 Google Sheet，再執行同步；不要直接編輯生成 JSON。

AI 產出只能作為候選案例，不可未經人工審核直接發布。

## AI 起草提示詞範本

```text
你是 QA test designer。請根據以下流程截圖與說明，起草 regression test cases。
輸出必須包含：suiteId、module、title、priority、platforms、preconditions、
testData、steps、expectedResults、tags、lifecycleStatus、owner、updatedAt。
lifecycleStatus 一律為 draft。steps 與 expectedResults 是獨立清單，不要求數量相同。請勿推測畫面中不存在的功能。
另外列出仍需 QA 人工確認的假設與缺少資訊。
```
