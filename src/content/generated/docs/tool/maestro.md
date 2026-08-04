<callout icon="🧭" color="blue_bg">
	本手冊說明 Maestro 的通用 Mobile UI 自動化方法。範例使用 `com.example.app`，帳密、裝置 ID 與環境資料必須以安全變數提供。
</callout>
<table_of_contents/>
## 核心理念
Maestro 以 YAML 宣告測試 flow，預設自動等待元素並在動畫或短暫延遲時重試。它透過 accessibility tree 觀察畫面；Flutter 元件若沒有 Semantics，可能完全不可見。
## Flow 基本結構
```yaml
appId: com.example.app
tags:
  - smoke
env:
  USERNAME: default_value
---
- launchApp:
    clearState: true
- tapOn: "登入"
- inputText: ${USERNAME}
- assertVisible: "歡迎回來"
```
## 核心指令
### 操作
- `tapOn`、`doubleTapOn`、`longPressOn`
- `inputText`、`eraseText`、`hideKeyboard`
- `swipe`、`scroll`、`scrollUntilVisible`
- `back`、`pressKey`、`copyTextFrom`
### 驗證
- `assertVisible`、`assertNotVisible`、`assertTrue`
- 預設等待不足時使用 `extendedWaitUntil`，不要先加入固定 sleep。
### 流程控制
- `runFlow` 重用 subflow。
- `when` 處理可能出現的彈窗。
- `repeat` 處理明確次數或條件迴圈。
- `runScript`／`evalScript` 執行 JavaScript。
## Selector 策略
1. `id`：最穩定；Flutter 應由 RD 提供 `Semantics(identifier: ...)`。
2. `text`：目前常用，但文案與語系變更會造成脆弱。
3. 相對定位：`below`、`above`、`leftOf`、`rightOf`、`containsChild`。
4. `index`：同名元素的最後手段。
5. `point`：會受解析度影響，只在無可替代時使用。
## 專案組織
```plain text
.maestro/
├── config.yaml
├── flows/
│   ├── 01_login.yaml
│   └── broadcast/
└── subflows/
    ├── _login.yaml
    └── _dismiss_popups.yaml
```
Flow 使用 `${VAR}`，執行時以 `-e VAR=value` 傳入。帳密、環境 URL 與 Token 一律放在 GitHub Actions Secrets 或核准的本機環境，不寫死在 YAML。
## 除錯
1. `maestro studio`：即時觀察元素層級與試 selector。
2. `maestro hierarchy`：輸出目前 accessibility tree。
3. `--debug-output ./debug`：保留失敗截圖與 log，CI 應上傳為 artifact。
## CLI 速查
```bash
maestro test flow.yaml
maestro test .maestro/
maestro test -e TEST_ACCOUNT=example .maestro/
maestro test --include-tags smoke .maestro/
maestro hierarchy
maestro studio
```
## CI／CD
- 使用 JUnit 輸出讓 CI 依 exit code 判斷成功或失敗。
- 失敗截圖、log 與 debug output 應保存為 artifact。
- 實體裝置需先確認可連線、螢幕保持喚醒。
- Smoke 與 Full Regression 以 tags 分級，不在每次變更都跑全部 flow。
## Flutter 注意事項
- Custom Paint 與純裝飾 Widget 不一定存在於 Semantics Tree。
- 動畫較多的頁面使用 `extendedWaitUntil`。
- `hideKeyboard` 不穩時可使用系統返回或點擊安全空白區。
- 長期應把 text selector 逐步替換為穩定 identifier。
## 上手路徑
1. 用 Studio 盤點主要畫面元素。
2. 寫 3–5 條 Smoke Flow。
3. 抽出登入、關彈窗等共用 Subflow。
4. 將帳號與環境參數化。
5. 加入 tags、報告與 debug artifacts。
6. 與 RD 協作補上穩定 Semantics identifier。
