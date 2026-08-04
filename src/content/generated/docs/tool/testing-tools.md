<callout icon="🧰" color="green_bg">
	工具頁只收公開安裝資訊與通用 QA 用法。Slack 頻道、UID、正式環境重置指令及內部 issue 連結不放入 Demo Workspace；需要時請查閱核准的內部 Runbook。
</callout>
<table_of_contents/>
## Mobile 自動化
### Maestro
以 YAML 描述可重複執行的 Mobile UI flow，具自動等待與重試。適合 Smoke、Regression 與 CI。詳細內容見「Maestro Mobile UI 自動化手冊」。
### Appium MCP
讓 MCP Client 觀察已連接裝置與 UI／XPath Tree，適合探索畫面、確認 selector 與首次連線驗證。詳細內容見「Appium MCP 使用手冊」。
## Android 裝置
- ADB：裝置連線、安裝、log 與系統指令。安裝說明應優先採 Android 官方 Platform Tools 文件。
- scrcpy：[官方 GitHub](https://github.com/Genymobile/scrcpy)，用於 Android 畫面投影與控制。
## iPhone 裝置
- iDescriptor：[官方 GitHub](https://github.com/iDescriptor/iDescriptor)，用於 iPhone 畫面投影。
## 直播與影音
- OBS：[官方網站](https://obsproject.com/)，用於電腦開播與直播流程驗證。
- Agora Plugin：屬內部專案依賴，安裝方式請查閱核准的內部 Runbook。
- HandBrake：[官方網站](https://handbrake.fr/)，用於壓縮測試圖片與影片；壓縮後仍需確認格式、畫質與容量限制。
## 紀錄留存與效率
- Google Drive for desktop：[下載頁](https://www.google.com/drive/download/)，用於核准的測試證據留存。
- Raycast：[官方網站](https://www.raycast.com/)，常用 Clipboard History、Snippets、Emoji／Symbols 搜尋。
## 安全原則
- 安裝前確認來源、版本與授權。
- 測試帳密、環境 URL 與 Token 不寫入 Flow、Snippet、截圖或公開文件。
- 螢幕投影與 UI Tree 可能暴露通知、帳號與訊息，操作前切換至核准測試資料。
- 正式環境資料重置與 Slack Bot 指令只存在有權限的內部 Runbook。
