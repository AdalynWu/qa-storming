<callout icon="🔭" color="purple_bg">
	第一次連線只做唯讀檢查。UI／XPath Tree 可能包含帳號、UID、訊息或通知內容，請使用核准測試帳號並在分享前遮蔽。
</callout>
<table_of_contents/>
## 用途
Appium MCP 讓支援 MCP 的開發工具觀察已連接的 Mobile 裝置、前景 App 與 UI／XPath Tree。適合首次連線驗證、探索畫面與尋找穩定 selector。
## 官方文件
- [Appium MCP GitHub 與安裝方式](https://github.com/appium/appium-mcp#%EF%B8%8F-installation)
## Claude Code 安裝
```bash
claude mcp add appium-mcp -- npx -y appium-mcp@latest
```
## Cursor 安裝
Cursor 的團隊安裝方式位於內部文件。Demo Workspace 與公開網站不保存 Slack Workspace URL；請由有權限的人員查閱核准 Runbook。
## 首次唯讀驗證 Prompt
```plain text
我已完成 Appium MCP 連線。

請先執行唯讀檢查：
1. 確認目前可偵測到的裝置。
2. 顯示目前前景 App 與頁面資訊。
3. 讀取目前畫面的 UI／XPath Tree。
4. 指出可穩定使用的 selector。

不要點擊、輸入、切換頁面或修改裝置狀態。
如果畫面包含帳號、UID、訊息或其他個資，請遮蔽後再摘要。
```
## 驗證清單
- MCP Client 能列出 Appium MCP 工具。
- 測試裝置已連接、解鎖且使用核准測試資料。
- 能讀到前景 App 與目前頁面的 UI Tree。
- 能指出 id、accessibility label 或其他穩定 selector。
- 唯讀驗證過程沒有點擊、輸入或更改裝置狀態。
## 與 Maestro 的分工
- Appium MCP：互動式探索、觀察裝置、讀 UI Tree、協助確認 selector。
- Maestro：將已確認的流程寫成可重複執行的 YAML，加入 Smoke、Regression 與 CI。
- ADB／scrcpy：裝置連線、系統指令、log 與人工畫面控制。
## 安全
- 不把真實帳號、UID、Token、訊息或通知貼入 Prompt。
- 不在第一次檢查時授權任意點擊或資料修改。
- 對外分享 UI Tree、截圖或 log 前先去識別。
- 具破壞性的操作、付款、發訊息與正式環境變更需另行確認。
