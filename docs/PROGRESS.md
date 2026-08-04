# PROGRESS — 進度紀錄

dated 進度日誌,**最新在上**。每次完成工作附加一條(日期、做了什麼、影響的檔案、驗證結果)。勿改寫他人既有條目。

---

## 2026-08-04 — 迷霧測試林 `/rpg` 上線後修正(標題裁切/卡住/移除 vibe-coding)

- 修 iframe 高度塌陷(H1 被裁、`#start` 走進霧裡按鈕溢出視窗看不到而無法開始)：`src/app/rpg/rpg.css` 的 `.rpg-quest-shell` 由 `min-height` 改定值 `height:100dvh`(含 `100vh` fallback)；`.rpg-quest-iframe` 改 `position:absolute; inset:0` 撐滿 `position:relative` 的 `.rpg-quest-frame`，不再依賴 flex-item 百分比高度解析——遊戲載入讀 `innerHeight` 前即有正確全高，標題正常置中、按鈕可見、3D 場景尺寸正確。
- 焦點交接防捲動：`src/components/MistyForestGate.tsx` 的 `handleLoad` 內 `#start` 聚焦改 `focus({ preventScroll: true })`，避免再度把標題內容往上捲裁掉 H1。
- 移除 vibe-coding 字樣(使用者要求整個畫面不出現)：站內外框 `src/app/rpg/page.tsx`(topbar「MISTY TEST FOREST · 自測副本」、metadata 描述)與 `MistyForestGate.tsx`(gate kicker)；遊戲 `public/rpg/misty-test-forest.html` 標題畫面 `.mark`、`.sub`、回歸測試 takeaway 與兩處註解共 5 處改寫(如「你剛寫完一個功能」)。
- **驗證**：`npx tsc --noEmit`、ESLint、`npm run build` 通過，`out/rpg.html` 與 `out/rpg/misty-test-forest.html` 重新產出；`grep -i vibe` 於遊戲 HTML 與 `src/app/rpg`、`MistyForestGate.tsx` 皆為 0；built CSS 確認 `.rpg-quest-iframe{position:absolute;inset:0}` 與 shell `height:100dvh`；`python3 -m http.server` 靜態伺服 `/rpg.html`、`/rpg/misty-test-forest.html` 皆 200。**尚待使用者重新部署後在真實桌機瀏覽器複測(此環境無法互動測 WebGL/鍵盤)：標題完整置中、按 Enter/點擊走進霧裡→3D 森林可 WASD、全畫面無 vibe coding。改動含 `public/`，需重新 `npm run deploy`。未部署，未執行 Git。**

## 2026-08-04 — 迷霧測試林 3D 教學遊戲整合(`/rpg`)

- 新增 `/rpg` 路由：一份自帶 three.js r128、零外部依賴的完整教學遊戲(vibe coding 自測練習)複製到 `public/rpg/misty-test-forest.html`(UTF-8 逐字複製，未改內容)，由新 route 以**同源 `<iframe>` 執行/樣式隔離**載入，未改寫成 React、不共用站上 `three@^0.185`。
- 站內對齊：`src/app/rpg/page.tsx`(server component，metadata、noindex 沿用 layout)＋ scoped `src/app/rpg/rpg.css`(命名空間 `.rpg-quest-shell`)，站內品牌深色 topbar(`← 返回世界樹` 置於 iframe 前、`MISTY TEST FOREST` kicker、`賢者書庫` 交叉連結)。
- 桌機專屬入口：首頁 `src/app/page.tsx` 導覽 `.rpg-links` 新增 `迷霧測試林`(`/rpg`)，以**純 CSS 能力 gate**(`globals.css`：預設 `display:none`；`@media (min-width:1024px) and (min-height:600px)` 顯示；`@media (hover:none) and (pointer:coarse)` 再隱藏)避免 hydration 位移，不放進手機選單。
- 裝置判斷與閘門：新增 `src/hooks/useIsComputerDevice.ts`(`useSyncExternalStore` 三態 `null/true/false`＝`min 1024×600` 且非純觸控；刻意不偵測滑鼠)與 `src/components/MistyForestGate.tsx`(狀態：checking→blocked/gate→playing，`entered` latch；blocked 顯示擋頁＋「我有鍵盤，仍要進入」覆寫，不載入 iframe；gate 為原生 button，Enter/Space/點擊確認；`onLoad` 同源交接焦點 `contentWindow.focus()`→遊戲 `#start`)。
- 治理文件：`DECISION.md` 新增 D25(iframe 執行/樣式隔離非安全邊界、桌機專屬、reduced-motion 與離屏暫停第一版取捨、公開資產須確認無機密)；同步更新 `ARCHITECTURE.md`(路由/目錄/部署與限制)、`DESIGN.md`(§7 Navbar、§8 新增遊戲場景)、`CHANGELOG.md`、`PLAN.md`、`TASK.md`、`MEMORY.md`、`PRODUCT.md`。
- **驗證**：`npx tsc --noEmit` 與 ESLint 通過；`npm run build` 成功，路由表出現 `○ /rpg`，產出 `out/rpg.html`(12 KB)與 `out/rpg/misty-test-forest.html`(644 KB，UTF-8、title 正常)。built CSS 確認三段 gate rule(base `display:none`＋`min-width:1024px and min-height:600px`＋`hover:none and pointer:coarse`)皆輸出；`GAME_SRC` 僅在 JS chunk、SSR 的 `out/rpg.html` 只渲染 topbar＋「正在確認裝置…」placeholder(未含 iframe，符合 opt-in 後才載入)。以 `python3 -m http.server` 靜態伺服確認 `/rpg.html`(200)與 `/rpg/misty-test-forest.html`(200，直接存取)皆正常。**尚待使用者在真實桌機瀏覽器人工 QA(此環境無法互動測試)**：三段裝置矩陣(1023×768 fine→blocked、1280×800 coarse→blocked、1280×800 fine→eligible)、gate 進入後 iframe `#start` 焦點交接與純鍵盤全程(WASD/方向/E/Esc/Shift+Tab 返回)、遊戲中 1024↔1023 resize 不重建 iframe、reduced-motion 表現、公開資產內容不含機密之最終確認。**未部署，未執行 Git。**

## 2026-08-04 — Firebase AI Logic 過載自動重試

- 確認 `gemini-3.5-flash-lite` 仍為 Firebase AI Logic／Gemini Developer API 支援的 GA 穩定模型；本次 `500 INTERNAL high demand` 是模型容量尖峰，不是 Markdown 索引或模型名稱失效。
- 模型呼叫對 `429`、`500`、`502`、`503`、`504` 最多退避重試兩次（400ms、1000ms），持續過載時改顯示安全繁中忙碌提示；403、App Check、設定與解析錯誤不重試，也不將 provider 詳細錯誤顯示給使用者。
- **驗證**：Chatbot 單元測試 13/13 通過，涵蓋過載兩次後成功、持續 503、403 不重試與既有檢索／引用流程；ESLint 通過，`next build --webpack` 完成 TypeScript 與 28 個靜態頁輸出，並正常重建 20 份文件／29 個段落索引。未以人工製造的正式 provider 過載做 live call，未部署，未執行 Git。

## 2026-08-04 — Terminal 同步、驗證與部署操作手冊

- 新增 `docs/terminal-command-playbook.md`，整理 Regression Sheet、Notion preview／正式同步、AI Bot 索引、本機預覽、測試、圖片管線與 Firebase 部署的可複製指令及執行順序。
- 明確區分 `sync:notion`、`refresh:notion`、`build:chat-index` 與一般 `build`：Bot 無遠端知識庫同步，`refresh:notion` 才會同時取得最新 Notion 內容並重建本地搜尋索引；build 不會連線 Notion 或 Google Sheet。
- 補上 active Regression 封存流程、Notion 發布門檻、常見錯誤、分享會前完整檢查流程，並在 `AGENTS.md` 文件索引加入本手冊。本次未實際同步外部資料、build、部署或執行 Git。

## 2026-08-04 — Regression 正式 Sheet 狀態核對與分享講稿更正

- 核對 `.env.local` 已設定 `REGRESSION_SHEET_ID` 與 `GOOGLE_APPLICATION_CREDENTIALS`；`src/content/generated/regression.json` 目前為 Web Production 1 個 Suite、71 個 Cases，確認已完成正式 Sheet 串接與首次 sample baseline 替換。
- 更正 `PLAN.md`、`TASK.md` 與分享講稿中的舊狀態：Regression 已可透過 `npm run sync:regression` 手動同步，後續工作是內容複核節奏與自動部署，不再列為「待接正式 Sheet」。
- 本次只做設定鍵名與既有 generated 產出的唯讀核對，未顯示任何 ID／憑證內容，也未重新呼叫 Google API、執行同步、build、部署或 Git。

## 2026-08-04 — Quest 超寬版比例、文件導覽與書庫閱讀器收斂

- 首屏 `.hero-copy-rpg` 在桌機改為較寬的流動容器，強調句於 `>900px` 維持單行；Quest Scene 在 `≥2000px` 放大中央卡與五格軌道，避免超寬螢幕上的互動主體失去份量。
- Quest 左右控制與卡面 CTA 由一般亮色圓鈕／膠囊改為深森林琺瑯、黃銅描邊與書扣式 SVG 控制，補齊 hover、active、focus 與 disabled 狀態。
- Web／Moor 閱讀頁移除重複的同步前言與 callout，Topbar 改為「首頁 > 產品地圖 > 產品 > 目前章節」的完整可返回麵包屑；Notion renderer 新增可由消費頁關閉 callout 的選項。
- 賢者書庫移除重複安全提醒，徽章文字改為穩定的縱向排列；閱讀頁以具名 grid areas 重排目錄、正文與相關札記，窄桌機先讓目錄獨佔一列、手機再完整單欄堆疊。
- **驗證**：Notion fixture 12/12、Regression fixture 14/14、ESLint、`tsc --noEmit` 與 production build 全數通過，28 個靜態頁成功輸出。1454×900、2230×1239、900×900、700×900、390×844 實看皆無水平溢位；超寬 Quest 卡、完整麵包屑、書庫徽章與窄版閱讀器排列正常。未部署，未執行 Git。

## 2026-08-04 — Chatbot 本地趣味隨機回答

- 新增人工核准的趣味問答 allowlist；問題正規化後只有完整命中才會從該題答案中本地隨機挑選，命中時不載入公開索引、不呼叫 Firebase AI Logic／Gemini，近似問題仍走正式知識庫流程。
- `ChatAnswer` 新增 `knowledge | fun` 類型，趣味回答在 UI 顯示「史萊姆閒聊」與淡綠羊皮紙材質且不附來源；建議問題加入「今天適合上班嗎？」作為可發現入口。
- **驗證**：Chatbot 單元測試 11/11、ESLint、`tsc --noEmit`、Impeccable layout detector 與 `next build --webpack` 全數通過，20 份文件／29 個段落索引正常重建並輸出 28 個靜態頁；本機桌機實看確認建議題可送出、訊息帶有 `.is-fun` 與「史萊姆閒聊」標籤、從核准答案中回覆且沒有來源 `<details>`。未部署，未執行 Git。

## 2026-08-04 — 首屏向下探索提示對齊與對比

- 修正 `.rpg-scroll` 後置重複規則將米白前景覆寫為 `color: inherit` 的問題；依最終回饋維持無底色、無外框，以米白／金色前景與深色柔和陰影提高生命樹插畫上的辨識度。
- 控制器改為置中的 grid，固定箭頭盒寬並取消 `<i>` 預設斜體，讓箭頭、文字與 viewport 共用同一水平中心；箭頭與文字增加 8px grid gap、縮短 bob 位移並補上 hover／`focus-visible` 回饋。
- **驗證**：1440×900 與 390×844 實測整組相對 viewport 中線偏差皆為 0px、箭頭與文字中心差皆為 0px，頁面無水平溢位；圖片預算、ESLint、TypeScript、Impeccable layout detector 與 production build 全數通過，28 個靜態頁成功輸出。未部署，未執行 Git。

## 2026-08-04 — Chatbot 泡泡貼近史萊姆並移除尾巴

- 移除 `knowledge-chatbot-speech::after` 尾巴；邀請列 gap 歸零，泡泡以 `margin-left: -28px` 壓入史萊姆 sprite 的透明畫布，使兩者更緊密但不碰到實際角色圖形。
- **驗證**：ESLint、TypeScript、Impeccable layout detector 與 `next build --webpack` 通過，28 個靜態頁成功輸出。1440×900 與 390×844 實測泡泡皆與 sprite DOM 水平重疊 28px，上方位移分別為 25px／18px；偽元素 computed content 為 `none`，兩尺寸均無水平溢位，console 0 warning／error。未部署，未執行 Git。

## 2026-08-04 — 任務卡光暈、位置指示與 Chatbot 泡泡校準

- 任務卡移除 hover 時疊加的矩形 drop-shadow，將 `::after` 改為內縮、透明邊緣的單一 radial-gradient 光團，消除卡片上下兩層光暈的斷層。
- 桌機卡位由舞台 50% 上移至 46%，手機由 49% 上移至 44%；`quest-position` 提升至獨立 z-index 30，避免被中央卡片遮蓋。
- Chatbot 邀請列改為頂端對齊，桌機／手機泡泡分別上移 24px／18px；`::after` 尾巴移至泡泡左下角，斜指史萊姆，形成明確的斜右上關係。
- **驗證**：圖片預算、ESLint、TypeScript、Impeccable layout detector 與 production build 全數通過，28 個靜態頁成功輸出。1440×900／390×844 實測卡片底緣與 `quest-position` 分別保留約 38–49px／39px 間距，位置指示器 z-index 為 30；桌機／手機泡泡分別高於史萊姆 24px／18px，並向右錯開 7px。最終樣式確認卡片本體 filter 為 `none`、光團無 box-shadow、頁面無水平溢位，console 0 warning／error。未部署，未執行 Git。

## 2026-08-04 — 賢者書庫星穹典藏殿與互動星群

- 生成並接入賢者書庫桌機 `1672×941` 與手機 `941×1672` 星穹典藏殿背景，以深藍綠石材、直線柱廊、邊緣書架、黃銅星盤與開放星空形成獨立場景；AVIF 分別為 115.1 KB、150.1 KB。
- 新增 `DeferredLibraryStarfield`／`LibraryStarfield`：書庫接近 viewport 且瀏覽器空閒後才 dynamic import 原生 Three.js，星群在游標附近產生低幅度牽引與視差；手機粒子降至約六成，DPR 上限 1.25，離屏／隱藏分頁停止 render loop，reduced-motion 不載入。
- 移除舊 Unicode `floating-motes` 與直條漸層裝飾；靜態插畫為完整 fallback，HTML 標題、CTA 與卷冊維持最上層，狼降至內容後方避免遮住卷冊文字。
- **驗證**：1440×900 載入桌機 AVIF 與 Three.js canvas，390×844 載入手機 AVIF 且四張卷冊完整位於 section；兩者無水平溢位。圖片預算、ESLint、TypeScript、Impeccable layout detector 與 `next build --webpack` 皆通過，28 個靜態頁成功輸出。未部署，未執行 Git。

## 2026-08-04 — 蝙蝠編隊右上移與巨龍分層

- 試煉之森六蝙蝠編隊桌機水平起點由 60% 移至 70%、垂直起點由 34% 提至 24%；手機水平起點由 64% 移至 70%、垂直起點由 20% 提至 14%，讓蝙蝠留在傳送門上半部，與下方巨龍 sprite 拉開視覺距離。
- **驗證**：TypeScript、Impeccable layout detector 與 `next build --webpack` 通過，28 個靜態頁成功輸出。1440×900 實測蝙蝠群為 x=862–1173px、y=310–473px，與巨龍上緣相隔 78px；390×844 為 x=223–361px、y=157–225px，與巨龍上緣相隔 281px。兩尺寸皆無水平溢位，console 0 warning／error。全專案 ESLint 仍被未屬於本次修改的 `LibraryStarfield.tsx:177` effect 內同步 setState 擋住，本次 CSS detector 本身無問題。未部署，未執行 Git。

## 2026-08-04 — 六蝙蝠編隊起點右移

- 試煉之森六蝙蝠編隊的桌機基準點由 52% 右移至 60%；手機依 390px 實測邊界由 50% 調至 64%，避免照抄桌機比例後仍落在畫面左半，同時保留右側安全空間。
- **驗證**：TypeScript、Impeccable layout detector 與直接執行的 `next build --webpack` 通過，28 個靜態頁成功輸出。1440×900 實測六隻蝙蝠橫跨 x=702–1012px，390×844 橫跨 x=200–338px，均位於場景右側、保留右緣空間且無水平溢位，console 0 warning／error。完整 `npm run build` 被另一項進行中的 `rpg-library-celestial.avif` 缺檔擋住；全專案 ESLint 被未屬於本次修改的 `LibraryStarfield.tsx:177` effect 內同步 setState 擋住，本次 CSS detector 本身無問題。未部署，未執行 Git。

## 2026-08-04 — 六蝙蝠編隊與裁切後任務卡校準

- 試煉之森蝙蝠編隊由四隻增加為六隻，新增右側翼位與後方尾隨位，分別配置獨立尺寸、拍翼速度與負延遲；整群桌機起點由 46% 右移至 52%，手機由 43% 右移至 50%。
- 確認使用者裁切後的 `rpg-quest-card` PNG／WebP／AVIF 均為有效 811×1318 RGBA 圖片；依新比例將桌機卡高改為寬度的 1.625 倍、手機上限改為 377px，羊皮紙水平內距改為約 23%，glow inset 由舊畫布的 13.1% 收斂至新圖約 0.55%。
- **驗證**：`npm run optimize:images` 已由裁切後 PNG 重生 AVIF／WebP；圖片預算、ESLint、`tsc --noEmit`、Impeccable layout detector 與 `next build --webpack` 全數通過，28 個靜態頁成功輸出。1440×900 與 390×844 實看皆確認任務卡比例為 1.625、瀏覽器實際載入 `rpg-quest-card.avif`（HTTP 200）、試煉之森有 6 隻蝙蝠且頁面無水平溢位，console 0 warning／error。未部署，未執行 Git。

## 2026-08-04 — Realm Window 四領域純風景替換

- 為試煉之森四個 realm 生成各自獨立的 `1672×941` 純風景：晨光瀑布谷、月光水晶峽谷、暮色熔岩原與藍綠沉沒庭園；四張皆以中央 45% 為主要景深，圖片內不含角色、文字、UI 或傳送門框。
- `TrialForestPortal` 不再覆用生命樹與產品世界地圖；每個 realm 改以 `<picture>` 提供 AVIF、WebP 與 PNG fallback，實測 Chromium 選用 AVIF，四次切換依序載入四張不同圖片。
- 四張 PNG 母檔已納入既有圖片最佳化與 35% payload 預算；AVIF 分別為 272.5 KB、193.8 KB、158.5 KB、227.6 KB。
- **驗證**：1440×900 桌機實看門洞、巨龍、蝙蝠與 HUD 無重疊，390×844 手機中央裁切保留場景焦點且無水平溢位；圖片預算、ESLint、TypeScript、Impeccable layout detector 與 production build 皆通過，28 個靜態頁成功輸出。未部署，未執行 Git。

## 2026-08-04 — 蝙蝠編隊移至試煉之森

- 將四隻 `sprite-bat` 編隊由新手村製圖工坊移至 `trial-forest-zone`，保留原本的相對隊形、尺寸差、拍翼速度與負延遲相位。
- 捲動位移基準改為試煉場景附近的 `scrollY - 1500`，水平係數維持 `.5`、垂直係數由 `-.34` 收斂為 `-.12`，讓整群以更平緩的角度往右上飛；reduced-motion selector 同步改掛試煉之森。
- **驗證**：ESLint、`tsc --noEmit`、本次修改檔案的 Impeccable detector 與 `next build --webpack` 通過，28 個靜態頁成功輸出。1440×900 與 390×844 實看確認新手村蝙蝠數為 0、試煉之森為 4，桌機編隊落在傳送門上方且未遮 HUD，手機編隊位於標題與門框之間；兩尺寸皆無水平溢位，console 0 warning／error。未部署，未執行 Git。

## 2026-08-04 — Quest Zone 製圖工坊正式接入

- 將已確認的室內公會製圖工坊接入首頁 Quest Zone：桌機採 `1672×941` 橫幅、手機採 `941×1672` 直式獨立 art direction，以直線木構、矩形高窗、地圖櫃與長形製圖桌區隔生命樹首屏及森林遺跡試煉。
- 新增 `rpg-quest-workshop` 桌機／手機 PNG 母檔及 AVIF／WebP 衍生資產，納入既有 `optimize:images`／`check:images` 管線；AVIF 分別為 95.1 KB 與 70.0 KB。
- Quest Zone 改用對應 `image-set()`，移除只服務舊森林背景的丘陵視差 DOM／CSS；既有五卡軌道、方向、進場、hover／focus glow 與蝙蝠編隊均保留。
- **驗證**：1440×900 與 390×844 實看分別載入桌機／手機 AVIF，標題與中央卡完整位於場景內，無水平溢出；圖片預算、lint、TypeScript、Impeccable layout detector 與 production build 皆通過。未部署，未執行 Git。

## 2026-08-04 — Quest Zone 製圖工坊背景概念

- 為新手村生成純背景的室內公會製圖工坊概念：以水平木樑、矩形高窗、地圖櫃、黃銅儀器與長形製圖桌建立暖色建築場景，避開首屏生命樹的巨大樹冠與試煉之森的森林遺跡／圓形傳送門。
- 第一版仍出現大型拱形屋架，第二版針對此單點改為直線木構與矩形高窗；保留左上標題安全區、中央五卡軌道空間及左右方向控制區，圖片內不包含卡片、文字、箭頭或 UI。
- 本次僅為方向預覽，生成圖留在 Codex 預覽輸出，尚未加入 `public/`、切換 CSS、執行 build 或部署；未執行 Git。

## 2026-08-04 — 首頁入口、蝙蝠編隊與舊任務書資產整理

- Chatbot 由右下改為左下固定，史萊姆、對話泡泡尾端與面板裁切展開方向同步鏡像；手機仍保留 12px 安全邊距與完整 viewport 面板。
- 移除 Hero「開始冒險」CTA 及其專用 `.rpg-primary` CSS；新手村單隻蝙蝠改為四隻大小、隊形、拍翼速度與相位皆不同的裝飾編隊，從主卡上方隨捲動往右上離場，reduced-motion 下停止位移與拍翼。
- 任務卡 PNG 量測為 1086×1448，實際非透明內容約 802×1315（左右各 13.1%、上 4.1%、下 5.1% 為透明邊界）；保留母檔畫布與文字安全區，將 hover／focus glow 改由此實體邊界的偽元素承載，避免整個透明畫布發光。
- 「內容秘藏地」領域改用既有產品世界地圖取景；移除舊 `rpg-quest-book` 的 PNG／AVIF／WebP、圖片最佳化清單項目，以及輪播中早已隱藏的書頁、書脊與護角 DOM／CSS。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算與本次修改檔案的 Impeccable detector 通過；`next build --webpack` 成功輸出 28 個靜態頁。1440×900 與 390×844 實看確認 Chatbot 分別固定左側 28px／12px、面板完整落在 viewport、Hero 已無 `.rpg-primary`、蝙蝠為四隻且不同尺寸、卡面 glow inset 對應透明邊界，兩尺寸 body 皆無水平溢位。一般 `npm run build` 的 Turbopack 再次停在最佳化階段且無新輸出，已只中止該程序並改用 webpack 完成驗證。未部署，未執行 Git。

## 2026-08-04 — 新手村魔法任務卡替換與互動光暈

- 以既有 `rpg-quest-book.png` 為美術基準生成薄型對稱魔法卡，移除書脊、書頁與厚度，保留深森林琺瑯、黃銅、藤蔓、寶石及 HTML 羊皮紙安全區；透明 PNG 母檔加入 `public/rpg-quest-card.png`，並納入圖片管線產出 210.3 KB AVIF／304.3 KB WebP。
- `QuestBookCarousel` 的五卡偽 3D 軌道、方向、拖曳、鍵盤切換及進場動畫全部維持原狀，只把封面 image-set 切換為魔法卡；中央卡新增 hover／`focus-within` 金綠 glow，reduced-motion 下取消 transition。
- quest-zone 背景暫不替換；後續另往室內公會作戰室／製圖工坊探索，避免同時重複首屏生命樹與下一屏試煉森林的戶外自然場景。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算與 Impeccable layout detector 通過，`next build --webpack` 成功輸出 28 個靜態頁。1440×900 與 390×844 實看皆載入新卡、HTML 文字無溢位且 body 無水平溢位；手機中央卡約 245×364px。未部署，未執行 Git。

## 2026-08-04 — Chatbot 角色去重與對話框動效

- 移除首頁 Hero 原本的 `animal-sprite sprite-jelly` 與「任務準備好了嗎？」提示，清除其專用定位／RWD／reduced-motion CSS；全站只保留固定右下角的 Chatbot 史萊姆入口。
- Chatbot 邀請泡泡改為深森林底、羊皮紙文字與黃銅細邊的角色對話框，從貼近史萊姆的尾端以 440ms 裁切、模糊與縮放展開一次；手機維持緊湊寬度，`prefers-reduced-motion` 下取消動效。
- **驗證**：ESLint、TypeScript、production build 與 Impeccable detector 通過，28 個靜態頁成功輸出；1440×900、390×844 實看皆只剩一個 Chatbot `sprite-jelly`，對話框完成態文字與尾端完整、無 body 水平溢出，動畫名稱／時間為 `chat-speech-pop`／440ms。未部署，未執行 Git。

## 2026-08-04 — Quest Zone 場景與魔法卡概念探索

- 確認 `quest-zone` 與首屏相似的主因是沿用生命樹背景及其巨大樹冠、中央金光、綠色霧景構圖；提出改為低視角的「冒險者營地／符文訓練廣場」，以石台、帳篷、木牌與遠山建立不同的水平場景骨架。
- 以既有畫面作風格參考，生成一張五張漂浮魔法任務卡概念圖：保留深森林琺瑯、黃銅、藤蔓、寶石與羊皮紙安全區，移除書脊與厚書體積；本次僅供方向比較，尚未加入 `public/`、修改輪播或替換正式圖片。
- 未執行 build、部署或 Git；既有 Regression、Notion 同步與 Firebase 靜態部署架構均未變動。

## 2026-08-04 — Chatbot 史萊姆入口

- 將右下角「詢問賢者」書庫徽章改為既有六幀 `sprite-jelly` 動畫角色，關閉時在角色左側顯示「有什麼疑問可以問我唷」對話泡泡，點擊後沿原錨點展開既有羊皮紙 Chatbox。
- 入口保留語意化按鈕、明確 aria-label、鍵盤 focus 與至少 44px 操作區；手機縮小角色與泡泡但不遮斷文案，`prefers-reduced-motion` 下停止 sprite、泡泡與面板展開動畫。
- **驗證**：ESLint 與 production build 通過，28 個靜態頁成功輸出；以 1440×900、390×844 實機檢查關閉／展開狀態，泡泡與 sprite 無裁切、面板完整落在 viewport、頁面無水平溢出，輸入框開啟後自動聚焦，關閉後焦點回到史萊姆入口。`sprite-jelly.webp` 維持既有 80.1 KB 首選資產。未部署，未執行 Git。

## 2026-08-04 — Moor Notion 八章遷移完成

- 將 Creator Hub、貼文、聊天、我的頁面、數據分析與其他功能六篇 Notion 草稿補成公開安全版 QA 指引，涵蓋主要旅程、狀態同步、權限、弱網路、錯誤恢復與個資保護。
- 六筆 Catalog 由 `hidden + draft + in-review` 切換為 `full + published + approved`；Moor 八章目前全數通過發布閘門，來源頁標題亦移除「待整理」。
- `src/content/moor.ts` 將六章狀態改為 published，並讓靜態路由以發布狀態決定輸出；正文優先使用 approved generated Markdown，不要求每章另存一份重複的 TypeScript sections。
- 正式執行 `npm run sync:notion` 後 generated 文件由 14 增為 20 篇，Moor 8/8 皆有核准 Markdown；Chatbot 索引同步增為 20 份文件、29 個段落。
- **驗證**：Notion／Markdown tests 12/12、ESLint 與 production build 通過；28 個靜態頁成功輸出，Moor `quick-start`、`live`、`creator-hub`、`posts`、`chat`、`profile`、`analytics`、`other` 八個路由全部產生。首次 sandbox build 卡在 Turbopack 無進度，改於獲准的本機環境重跑後成功。未部署，未執行 Git。

## 2026-08-04 — Firebase AI Logic 賢者問答 Chatbot

- 新增全站「賢者問答櫃台」：桌機為右下固定羊皮紙工作台、手機為 viewport 內滿寬面板；支援歡迎訊息、建議問題、loading／error／disabled、Enter／Shift+Enter、Escape 關閉、來源 `<details>`、44px 操作區與 reduced-motion。
- 新增 manifest allowlist 索引器，只讀取 `full + approved + markdownPath` 的 generated Markdown；build 會產生 `public/chatbot-search-index.json`，目前涵蓋 14 份核准文件、23 個段落，不會收錄治理文件、hidden／link-only 或未審內容。
- 新增中文 2–3 字 n-gram、英文／技術詞、標題／章節加權與最低分數門檻；最多傳入 5 個 chunks。無檢索結果時在瀏覽器直接拒答，不呼叫模型。
- 整合 Firebase AI Logic Web SDK、Gemini Developer API backend、`gemini-3.5-flash-lite`、reCAPTCHA Enterprise App Check 與本機 debug token 流程；Gemini 使用 structured output 回傳 `sufficient`／`answer`／`usedChunkIds`，前端只接受本次檢索到的引用。Gemini Developer API Key 不進前端；Firebase Web config 與 App Check site key 仍待使用者在 `.env.local` 填入並於 Console 完成設定。
- Notion 仍維持手動 `sync:notion`；新增 `refresh:notion` 串接同步與索引，`prebuild` 每次依既有 generated Markdown 重建索引，不讓正式 build 強制依賴 Notion Token 或網路。
- **驗證**：Chatbot unit tests 9/9、ESLint、`tsc --noEmit`、圖片預算、Impeccable detector 0 findings、`next build --webpack` 通過，22 個靜態頁成功輸出。1280×900／390×844 實看面板完整落在 viewport、body 無水平溢位、console 0 warning／error；「今天天氣」正確本地拒答，缺少 Firebase 設定時顯示安全錯誤。`npm audit --omit=dev` 另回報既有 Next／PostCSS／sharp 鏈 3 項 high，修正需升級到目前鎖定範圍外或 breaking 版本，本次未執行 `--force`；Firebase 未出現在公告清單。未以真實 Firebase Console 設定呼叫 Gemini，未部署，未執行 Git。

## 2026-08-04 — 賢者書庫 CTA 與段落間距修正

- 將 `.book-copy` 內的書庫 CTA 由 inline formatting context 改為獨立 flex 區塊，並以 `clamp(24px, 3dvh, 32px)` 保留明確的響應式段落間距；同步固定前一段落的行高與下邊距，避免按鈕視覺位移壓到第二行文字。
- **驗證**：ESLint、`tsc --noEmit` 與 Impeccable layout detector 通過；2048×1125、768×1024、390×844 實測 CTA 與段落分別保留 32px、30.72px、25.31px，三者皆無重疊或 body 水平溢位，CTA 高度維持 52px。圖片預算與聊天索引前置檢查通過；完整 build 因工作區另一個既有 Next build 持續占用 `.next/lock`，未中止該程序或移除鎖。未部署，未執行 Git。

## 2026-08-03 — 賢者知識書庫、Error Code V2 與測試工具文件

- 在 `QA Storming Demo Lab` 的 `QA Storming Sync Lab` 建立 Error Code V2、測試工具、Maestro、Appium MCP 四份公開安全版來源頁，並新增四筆 `standalone + full + published + approved` Catalog 項目；正式同步後 generated 全文由 10 篇增為 14 篇。
- 新增 `/library` 查詢櫃台與產品手冊／QA 參考資料／測試工具三座分類書架；新增 `/library/error-codes`，直接從 Notion generated Markdown 表格衍生 64 筆可搜尋索引，不另維護重複資料。
- 新增 `/library/testing-tools`、`/library/maestro`、`/library/appium-mcp` 共用 standalone 文件閱讀器，具目錄、相關卷冊、code／callout／表格樣式與手機內層捲動邊界。
- 首頁 Quest Books 由 2 卷補為 5 卷，加入 Error Code、工具工坊與 Mobile Automation；賢者書庫 CTA 及 Moor／Web／Error Code／工具卷冊全部接上有效路由。
- 公開內容移除 Slack Workspace／頻道、UID 範例、正式環境重置指令與內部 issue URL，只保留「內部 Runbook」占位；新增 `PRODUCT.md` 記錄此安全邊界與產品真相。
- **驗證**：Notion/parser tests 12/12、ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 通過，22 個靜態頁成功輸出。瀏覽器實測 Error Code 搜尋 `4012` 為 1/64；1280px 書庫首屏與 390×844 書庫、Error Code、Maestro 無 body 水平溢位，console 0 warning／error。未部署，未執行 Git。

## 2026-08-03 — Web Notion 八章遷移完成

- 將「個人檔案與內容」及「影音與聊天」兩篇 Notion 草稿補成完整公開安全版，涵蓋角色／權限矩陣、內容生命週期、影音類型、聊天狀態、失敗恢復與跨裝置檢查。
- 兩筆 Catalog 由 `hidden + draft + in-review` 改為 `full + published + approved`；Web 八章目前全數通過發布閘門，不再保留 Web 待審章節。
- 正式執行 `npm run sync:notion` 後 generated 全文由 8 篇增為 10 篇（Moor 2、Web 8）；`profile-content` 與 `media-chat` production HTML 均顯示 `NOTION SYNCED EDITION`，不再使用 `web.ts` fallback。
- **驗證**：Notion 同步／parser tests 12/12、ESLint、圖片預算與 production build 通過，17 個靜態頁面成功輸出。未部署，未執行 Git。

## 2026-08-03 — Web 八章 Notion 映射與 generated 閱讀器接軌

- 在 `QA Storming Sync Lab` 建立 Web 八篇來源頁與 Catalog chapter 映射；帳號、直播、支付、探索、Landing／SEO、設定六篇為 `full + published + approved`，個人檔案／內容與影音／聊天兩篇維持 `hidden + draft + in-review`。
- Web 閱讀器改為 build time 優先載入 approved Notion generated Markdown，無同步內容時回退 `src/content/web.ts`；共用安全 renderer 可依 Moor／Web namespace 套用既有 RPG 手稿樣式。
- 正式同步產出 8 篇全文（Moor 2、Web 6）；production HTML 確認六篇 Web 正式章節顯示 `NOTION SYNCED EDITION`，兩篇待審章節顯示 `QA CURATED EDITION` 且沒有 generated Markdown。
- **驗證**：Notion 同步／parser tests 12/12、ESLint、圖片預算與 production build 通過，17 個靜態頁面成功輸出。首次 sandbox build 因 Turbopack 綁定本機連接埠被拒，於允許建置程序的環境重跑成功；未部署，未執行 Git。

## 2026-08-03 — SWAG Master sitemap 完整映射與 Web 八章補齊

- 唯讀盤點 SWAG Master `Functional Map` 與對應頁面，確認 00–13 共 14 個主域；未修改 Figma 節點、留言、檔案或分享設定。
- 「個人檔案與內容」由待審核改為正式閱讀頁，收錄三種觀看角色、創作建立／更新／刪除、個人檔案管理及 Desktop／Tablet／Mobile QA 矩陣。
- 「影音與聊天」由待審核改為正式閱讀頁，收錄 Video、Short、Story、Chat 主頁／詳情範圍、播放與訊息狀態、恢復路徑及跨裝置覆蓋。
- SWAG Master 的 14 個主域維持映射到既有八章資訊架構，不另造重複章節；Web 八章皆可由產品 Hub 與靜態路由閱讀。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算、Impeccable detector 與 `next build --webpack` 通過，17 個靜態頁面成功輸出；1280×900／390×844 實看兩個新章，body 無水平溢位、表格維持內層橫向捲動，console 0 warning／error。未部署，未執行 Git。

## 2026-08-03 — Moor 八章建立為 Notion 來源與 Catalog 映射

- 將網站目前的 Moor 八章建立為 `QA Storming Sync Lab` 對應文件：既有快速入門更新為網站安全整理版，新增直播功能完整正文，以及 Creator Hub、貼文、聊天、我的頁面、數據分析、其他功能六篇整理草稿。
- `Website Docs Catalog` 現有 8 筆 Moor chapter：快速入門與直播功能為 `full + published + approved`；其餘六篇為 `hidden + draft + in-review`，保留章節路由與摘要但不會進入公開 generated 內容。
- 正式執行 `npm run sync:notion` 後輸出全文 2 篇、連結 0 篇；production HTML 已確認 `/products/moor/quick-start` 與 `/products/moor/live` 均顯示 `NOTION SYNCED EDITION`，六篇草稿未輸出。
- **驗證**：Notion 測試 12/12、ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 通過；15 個靜態頁面成功輸出。未部署，未執行 Git。

## 2026-08-03 — Moor 閱讀器優先採用 Notion generated Markdown

- 新增 build-time generated 文件讀取器與安全 Markdown parser；只從 `src/content/generated/docs/` 讀取 manifest 核准的產品章節，並拒絕越界路徑，不在 React runtime 或每次 render 呼叫 Notion API。
- `/products/moor/[chapter]` 改為對應的 Notion generated Markdown 優先；manifest 沒有該產品章節時，保留 `src/content/moor.ts` 內建內容作 fallback。目前 `quick-start` 顯示 Notion 同步版，`live` 驗證仍使用 curated fallback。
- 新增符合既有 RPG 手稿風格的 Markdown 標題、清單、表格、callout、toggle、引用與 code block renderer；不用 `dangerouslySetInnerHTML`，連結限定安全協定，手機表格維持內層橫向捲動。
- `test:notion` 納入 parser fixtures；12/12 測試、ESLint、`tsc --noEmit`、圖片預算、Impeccable detector 與 `next build --webpack` 通過。production HTML 已確認 quick-start 含 `NOTION SYNCED EDITION` 與同步展示文字，live 含 `QA CURATED EDITION`。未執行 Git 或部署。

## 2026-08-03 — 獨立 Demo Workspace Catalog 與 Moor 同步樣本

- 確認 Codex Notion OAuth 已切換至獨立的 `QA Storming Demo Lab` Workspace，不再指向 SWAG；在 `QA Storming Sync Lab` 父頁下建立 schema v2 完整欄位的 `Website Docs Catalog`。
- 新 Catalog data source 為 `16d3010e-3844-405e-8fbc-4c2fb447d8b9`；欄位型別、Select 選項與 `scripts/sync-notion.ts` 的必要 schema 一致。
- 建立不含公司機密的 `Moor 快速入門｜同步 Demo` 來源頁，並新增 `full + published + approved` 的 `product / moor / quick-start` Catalog 項目；查詢驗證只有一筆且路由欄位完整。
- 本機 `.env.local` 已有 Notion 兩個變數，但 Data Source ID 仍是舊值；待使用者換成新 ID、確認父頁已分享給唯讀 Connection，再執行 preview。未讀取或記錄 Token，未執行 Git、同步、build 或部署。

## 2026-08-03 — 第二批 Figma 2026 產品情報整合

- 以唯讀方式核對 11 份新增 Figma 檔案；只採用 `Design Merged` 的現行 Mockup 與封面版本資訊，未進入 Prototype 原檔、Sandbox 或遺棄版本，也未修改節點、留言、分享設定或檔案內容。
- Web 直播章新增 SWAG／Moor 跨端語音直播；交易章補 Shop Detail、First Pay、信用卡快速／一般支付；Landing／SEO 章補 Mobile／Tablet／Desktop 的 404 與錯誤恢復檢查。
- Web「個人中心與設定」由待審核改為可閱讀第六章，收錄聯盟夥伴入口版位、設定密碼安全路徑、VIP 1–100 與 Lv.0 不顯示徽章的邊界案例。
- Moor 快速入門加入創作者註冊媒體上傳本人同意；直播章加入語音直播與 AI 助理隔離／失敗狀態；我的頁面摘要補上 VIP／Lv.0。Ramen／Ramen MDM 的產品地圖摘要加入下載 App 分流與 fallback。
- 內容僅保留可公開的功能範圍與 QA 觀察，沒有寫入 Figma URL、ticket、人名、帳號、留言原文或敏感設定。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算、Impeccable detector 與 `next build --webpack` 通過；靜態頁由 14 增至 15。1440×900 實看 Web 設定章，390×844 實測設定、交易、Web 直播、錯誤頁、Moor 快速入門與直播章皆無 body 水平溢出；手機表格維持在 316px 內層橫向捲動容器。未執行 Git、部署或 Figma 寫入。

## 2026-08-03 — 新手村／試煉場景標題基準統一

- 將新手村 `.zone-title` 從置中的 `.zone-content` 拆出，改為 section 直屬的語意化 `header`；書環仍保留在最大寬度容器中，標題不再受其 `margin: auto` 影響。
- 桌機新手村標題文字與試煉之森標題統一從 `6vw` 起始；新手村垂直光線移到文字基準左側，不額外推移標題內容。
- 將試煉之森 `.portal-copy` 全面更名為 `.portal-title`，同步更新 JSX 與所有桌機／平板／手機 selector，舊 class 無殘留。
- **驗證**：ESLint、獨立 `tsc --noEmit`、圖片體積檢查與 `next build --webpack` 全數通過；14 個靜態頁面成功輸出。本機預覽伺服器無法由內建瀏覽器連入，因此未宣稱 live browser 視覺驗證。未執行 Git 或部署。

## 2026-08-03 — Notion Catalog 五欄位實機建立與既有資料回填

- 在 `Website Docs Catalog` data source 實際新增 `Product Key`、`Chapter Slug`、`Document Type`、`Review Status`、`Parent Slug`；Product Key 提供 `moor`／`web`，文件類型與審核狀態選項與 schema v2 一致。
- 四筆既有 POC 項目皆回填為 `Document Type=standalone`：三筆 published full／link-only 保留原發布語意並設為 `Review Status=approved`，`隱藏草稿` 設為 `draft`；產品 key、章節與父層欄位維持空白，未虛構產品映射。
- 重新查詢 data source 驗證五欄 schema 與四筆資料全部符合預期；正式 Internal Connection token、preview 圖片本地化與 Moor Catalog 映射仍維持獨立待辦。未執行 Git、正式內容同步或部署。
- **驗證**：Notion fixture tests 10/10、Regression tests 14/14、ESLint、圖片預算與 `next build --webpack` 通過；production build 的 TypeScript 階段成功並輸出 14 個靜態頁面。額外 `tsc --noEmit` 因 `.next/types` 與空的 `.next/dev/types` generated route declarations 同時載入而報型別衝突，未修改或刪除 Next 暫存產物。

## 2026-08-03 — 產品 Hub 全尺寸內容邊界強化

- 新增共用 `product-hub.css`，在不混用產品 DOM namespace 的前提下，統一 Moor／Web 的首屏高度、卡片、徽章、統計與短視窗收斂規則。
- Hero 卡片明確取消 `overflow:auto`，字級、行高、padding 與間距同時依 `vw`／`svh` 縮放；900px 以下改為堆疊構圖，620px 以下另有短橫式緊湊雙欄。
- Moor／Web 徽章改由 Hero 可用高度、上下 padding 與保留空間共同限制，並在桌機上移、窄版置於卡片下方，不再被首屏 `overflow:hidden` 裁切。
- 統計列改為 `repeat(3, minmax(0, 1fr))`，卡片設定可收縮 padding，主文字與說明可依尺寸縮放；`Mobile`、平台說明與最長標籤不再越界。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 通過。Moor／Web 逐一實測 `2048×1125`、`1261×827`、`789×851`、`690×1488`、`390×844`、`1024×600`；12 組皆為卡片與徽章落在 Hero padding box、卡片 `overflowY: visible` 且無 scroll overflow、統計無爆版、頁面無水平溢出。未執行 Git、部署或 Figma 寫入。

## 2026-08-03 — Notion Catalog 產品階層 schema v2

- `docs.ts` 與 `sync-notion.ts` 支援 `Product Key`、`Chapter Slug`、`Document Type`、`Review Status`、`Parent Slug`，generated manifest 升為 schema v2。
- 同步輸出新增 `Review Status=approved` 安全閘門，並驗證 standalone／hub／chapter 欄位組合、產品 hub 唯一與產品章節路由唯一；既有原子替換、圖片本地化與已發布文件移除保護維持不變。
- fixtures 新增 Moor hub、approved chapter 與 in-review chapter，覆蓋 Select／Rich text Product Key、未審核排除及重複路由；Notion POC database 的五個實際欄位仍待有權限的人員建立。
- 同步校正 `TASK.md` 中已存在的 `.env.example` 待辦，並更新 Notion 操作指南、架構、決策與 Changelog。未執行 Git、Notion 寫入或部署。
- **驗證**：Notion fixture tests 10/10、Regression tests 14/14、ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 全數通過；14 個靜態頁面成功輸出。

## 2026-08-03 — 任務書 CTA 響應式單行文字

- `book-cta` 改為禁止換行，字級與箭頭間距會依實際任務書寬度流動縮放；手機另設 10–12px 可讀範圍，避免「開啟地圖」在窄書封上斷成兩行。
- 箭頭改用相對字級並固定為不可收縮項目，維持文字與方向符號在同一行且比例一致。
- **驗證**：ESLint、`tsc --noEmit`、圖片體積檢查與 `next build --webpack` 全數通過。未執行 Git 或部署。

## 2026-08-03 — Moor／Web Hub 首屏與命名空間修正

- Web Hub、章節地圖與閱讀器全面改用獨立 `web-*` class；移除 Web 對 `moor.css` 與 `moor-*` DOM 命名的借用。共用章節選擇器重構為 `ProductChapterMap`，由 `classPrefix` 分別輸出 Moor／Web namespace。
- Moor 與 Web Hub 改為 Topbar＋Hero 合計精準 `100svh`：桌機 72px＋剩餘高度，手機 62px＋剩餘高度；主文案、統計、產品徽章與捲動提示皆限制在首屏內。
- 手機重新壓縮卡片 padding、字級、統計列與徽章尺寸，保留完整內容且不產生卡片內捲動；Web 仍保有獨立 Browser Coast 色調。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 通過。1440×900 實測兩頁皆為 Topbar `72px`＋Hero `828px`，390×844 皆為 `62px`＋`782px`，下一區起點等於 viewport 高度；手機卡片無內層溢出、頁面無水平溢出。Web DOM 掃描 `moor-*` class 為 0。未執行 Git、部署或 Figma 寫入。

## 2026-08-03 — Three.js 可見暖機閘門與深連結跳過

- `DeferredImmersiveTreeHero` 改為同時觀察 Hero 可見性與 `prefers-reduced-motion`：Hero 持續可見 1.6 秒後才進入 browser idle dynamic import；暖機期間離開視口會取消排程，回到 Hero 才重新開始。
- 靜態 AVIF、DOM 文案與操作維持立即可用；停留 Hero 時 1.2 秒仍無 canvas，暖機後正常建立。直接開 `#regression` 時 section 精準落在 82px navbar 下、2.6 秒後仍無 canvas，且 Three.js async chunks 未下載。
- Three.js async chunks 目前合計 `541,323 bytes raw / 136,539 bytes gzip`，貼圖 `rpg-life-tree.webp` 為 `381.2 KB`；本次把增強資源移出初始靜態首屏競爭，並在使用者略過 Hero 時跳過 WebGL 程式碼。
- 曾實驗以 `content-visibility: auto` 延後遠端場景；雖可少載入書庫 wolf sprite，但直接開 `#knowhow` 會失去正確錨點定位，已完整撤回，不以導覽可靠性換取約 104 KB。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算、Regression 14/14、Notion 8/8、Impeccable detector 0 findings、`next build --webpack` 通過；1280×720 live QA 無水平溢位或 console warning/error。瀏覽器 viewport override 本輪未生效，因此未宣稱新的手機實測；版面 CSS 未修改，暖機邏輯不依賴固定尺寸。未執行 Git 或部署。

## 2026-08-03 — 產品地圖摘要化＋Web 多章 Know-how

- 產品世界地圖收斂為產品摘要與入口：Moor／Web 的 2026 詳細流程不再塞入畫卷，分別由 `/products/moor` 與新建的 `/products/web` 承載。
- 新增 Web「瀏覽者海岸」Hub、八章冒險路徑與五個已整理閱讀頁：帳號與訪客、直播體驗、商店與快速支付、導覽與探索、Landing 與 SEO；個人檔案與內容、影音與聊天、個人中心與設定維持待審核。
- 產品畫卷改為固定外框＋內層 `.product-scroll-body` 捲動；`:before`／`:after` 不再進入內容捲動座標系，手機底部保留 50px 內容安全區與 18px 裝飾條。
- 延續唯讀 Figma 邊界，內容採 2026 綠色 Mockup／Ready for dev 優先、Master 補範圍；未修改任何 Figma 檔案、節點、留言或權限。
- **驗證**：ESLint、`tsc --noEmit`、圖片預算與 `next build --webpack` 通過；靜態輸出新增 `/products/web` 與五個章節。1440×900／390×844 實看皆無水平溢出；手機 Moor 畫卷捲到底後 CTA 底緣 `793.9px`、底部裝飾條頂緣 `826px`，保留約 32px 間距。未執行 Git、部署或 Figma 寫入。

## 2026-08-03 — 任務書進度／獎勵列移除

- 從 `QuestBookCarousel` 移除 `.book-meta` 的進度與獎勵顯示，書封聚焦於分類、標題、說明與單一 CTA。
- 清除 `globals.css` 內五組桌機、手機與舊版 `.book-meta` 樣式；`QuestBook` 內容欄位暫時保留，避免純 UI 調整擴大成資料介面遷移。
- **驗證**：`rg` 確認 `src/` 無 `.book-meta` 殘留；ESLint、`tsc --noEmit`、圖片體積檢查與 `next build --webpack` 全數通過。未執行 Git 或部署。

## 2026-08-03 — 任務書封文字安全區校正

- 依 `rpg-quest-book.png` 原始插畫量測羊皮紙範圍，將桌機與手機 `.book-cover` 內容寬度由約 56–66% 收斂至 44%，並微調中心位置，避免分類、標題與說明壓到左右藤蔓及寶石。
- `book-meta` 移除安全區內的二次水平縮排，保留進度／獎勵同列可讀；手機長標題降為 14px 並使用較緊行高，讓內容仍落在羊皮紙內。
- **驗證**：ESLint、`tsc --noEmit`、圖片體積檢查與 `next build --webpack` 全數通過；所有靜態路由成功輸出。未執行 Git 或部署。

## 2026-08-02 — Figma MOOR／Web 2026 產品情報整合

- 以唯讀方式盤點 MOOR Master、SWAG Master 與 12 份 2026／近期專案設計；未修改 Figma 節點、留言、分享設定或檔案內容。
- 建立來源優先序：綠色 Mockup／Ready for dev 高於 Master File；Master 只補功能範圍，舊版、Sandbox、遺棄版本與仍在討論的留言不視為已上線規格。
- Moor 直播章新增 2026 首屏、簡化介面、募資互動、排行榜與跨裝置 QA 清單；其餘六章以 MOOR Master 功能樹補強安全摘要，但仍維持待審核封印狀態。
- 產品世界地圖補強 Moor 與 Web Production 範圍、2026 主要變更、版本判讀及登入／訪客、快速支付、直播、搜尋、FAQ、客服 CTA、活動入口等 QA 注意事項。
- 內容只保留適合公開知識站的功能範圍與測試觀察；未公開 Figma URL、ticket、人名、帳號、內部留言原文或敏感設定。
- **驗證**：ESLint、`tsc --noEmit`、Regression 14/14、Notion 8/8、圖片預算與 `next build --webpack` 全數通過；1440×900／390×844 實看產品地圖與 Moor 直播章，body 無水平溢出，手機三欄表格保留在內層橫向捲動。未執行 Git、部署或 Figma 寫入。

## 2026-08-02 — 首屏生命樹 LCP 資源提前發現

- 在 root layout 使用 React 19 `preload()` 將 `rpg-life-tree.avif` 標記為唯一的高優先級首屏圖片；WebP／PNG fallback、Three.js idle 貼圖與所有下方場景維持原載入策略，避免非首屏圖片搶占頻寬。
- 初版直接寫 `<head>` 會被 React／Next 資源提升機制輸出兩次，已改為 `react-dom` API；production `out/index.html` 最終只有一個 `as="image"`、`type="image/avif"`、`fetchPriority="high"` preload。
- 冷啟動伺服器請求順序由「HTML → CSS → 多個首頁 JS chunks → 生命樹 AVIF」改善為「HTML → CSS → 生命樹 AVIF → 首頁 JS chunks」，且 AVIF 僅請求一次。瀏覽器控制層未提供可用的 Performance API，因此不宣稱 LCP 毫秒差值。
- **驗證**：ESLint、`tsc --noEmit`、`check:images`、Regression 14/14、Notion 8/8、Impeccable detector 0 findings、`next build --webpack` 通過；1280×720 與 390×844 live browser QA 均正常顯示 AVIF／Three.js、無水平溢位或 console warning/error。reduced-motion 程式與 CSS 路徑未變。未執行 Git 或部署。

## 2026-08-02 — 圖片資產現代格式管線與建置預算

- 新增 `scripts/optimize-images.mjs` 與 `optimize:images`／`check:images`，以 PNG 母檔重現產生 AVIF、WebP；`prebuild` 會檢查衍生檔存在、均小於母檔，且瀏覽器首選資產總量不超過 PNG 來源的 35%。
- 首頁、產品地圖、Moor、Regression 與 sprite 背景改用 CSS `image-set()` 的 AVIF／WebP／PNG fallback；Three.js 與試煉領域動態圖片使用 WebP，社群 metadata 仍保留 PNG 相容圖。
- 7 組 RPG 場景與 4 張 sprite 的瀏覽器首選 payload 由 `22,623.9 KB` 降為 `2,201.5 KB`（`9.7%`）；PNG 母檔仍保留於 `public/`，未改動 Regression、Notion 同步、Firebase Hosting 或純靜態輸出。
- **驗證**：`check:images`、ESLint、`tsc --noEmit`、Regression 14/14、Notion 8/8、`next build --webpack` 全數通過；1440×900 與 390×844 live browser QA 無水平溢位或 console 警告，手機 idle 後 Three.js canvas 正常建立，HTTP 紀錄確認場景實際請求 AVIF、sprite 請求 WebP。`npm run test:*` 在 sandbox 因 `tsx` IPC socket 權限失敗，改用等價的 `node --import tsx --test` 驗證。未執行 Git 或部署。

## 2026-08-02 — Three.js 首頁效能基準與延後載入

- 量測 production 靜態輸出：優化前首頁 HTML 直接引用含 Three.js 的 `562,776 bytes` chunk；改以 `DeferredImmersiveTreeHero` 在瀏覽器 idle 後動態載入，reduced-motion 使用者不再下載或初始化 WebGL。
- 優化後 Three.js 相關程式碼留在 async chunks（共 `541,297 bytes raw / 135,955 bytes gzip`），不再出現在 `out/index.html` 初始 script 清單；webpack build 的首頁初始 scripts 為 `692,364 bytes raw / 209,561 bytes gzip`。
- `ImmersiveTreeHero` 改用 `renderer.setAnimationLoop`，離開 viewport 或分頁隱藏時真正停止迴圈，回到畫面再恢復；補上動態貼圖在 unmount 後完成時的 dispose 保護。
- `ui-ux-pro-max` Three.js／Next.js 檢索結果支持 DPR cap、hidden-tab pause、dispose 與 dynamic import；Impeccable optimize 以先量測再修正為準，detector 0 findings。
- **驗證**：ESLint、`tsc --noEmit`、`next build --webpack` 通過；1440×900、390×844 live browser QA 均成功建立 canvas、無水平溢位、原生錨點完整且 console 0 warning/error。瀏覽器控制層未提供可靠 rAF probe，因此未宣稱實測 FPS。未執行 Git 或部署。

## 2026-08-02 — Three.js 生命樹 Hero 實作與跨尺寸驗收

- 新增 `three`、`@types/three` 與 `ImmersiveTreeHero`：沿用 `rpg-life-tree.png` 建立 WebGL 全景 shader、樹心柔光、三層空間光塵及游標／捲動差速，語意化文案、導航與 CTA 仍維持 DOM。
- WebGL 貼圖成功後才淡入，建立失敗或 `prefers-reduced-motion` 時保留原 CSS 場景；限制 DPR、離開 viewport／頁面隱藏時暫停繪製，卸載時釋放 texture、geometry、material 與 renderer。
- 未改動 Regression、Notion 同步、Firebase Hosting 或純靜態輸出架構。
- **驗證**：ESLint、`tsc --noEmit`、`next build --webpack` 通過；本地靜態輸出以 1440×900、390×844 實機瀏覽器驗證 canvas 正常、主文案與三個入口無遮擋、無水平溢位，並清除 Three.js runtime warning。預設 Turbopack build 在 sandbox 長時間無輸出後中止，改用專案既有的 webpack 驗證路徑。未執行 Git 或部署。

## 2026-08-02 — 手機導覽、任務書與透明傳送門收尾

- 產品世界地圖手機 header 改為兩列結構，標題與 44px 高的返回／全圖操作分列，避免控制項貼住地圖邊界；地圖可用高度同步扣除新版 header。
- 新手村手機上緣改為 24–36px 的場景節奏，偽 3D 任務書縮至最多 232px 寬並降低前推深度，左右箭頭各保留獨立觸控空間。
- 手機漢堡選單點擊任一區段連結後會立即收合，保留原生 `details` 的無 JavaScript 導覽能力。
- 使用 ImageGen 依原始構圖產生桌機／手機傳送門版本，再以色鍵遮罩建立 `rpg-trial-portal-alpha.png` 與 `rpg-trial-portal-mobile-alpha.png`；門洞透明、外圍場景保留，Regression 領域景色改為鋪在前景石門下方。
- **驗證**：ESLint、`tsc --noEmit` 與 `next build --webpack` 通過，靜態輸出路由完整。Codex sandbox 禁止綁定本機 port，無法在本次工作內啟動 live preview；已完成透明度、尺寸與靜態建置檢查。未執行 Git 或部署。

## 2026-08-02 — 手機核心操作漸進式增強與文件版面修復

- 首頁品牌、桌機導覽、手機漢堡、三顆魔法果實、「開始冒險」與向下提示改用原生 anchor／`details`，即使 React 尚未 hydration 仍能完成區段導覽；固定 navbar 由既有 `scroll-margin-top` 對齊。
- 任務書取消「JavaScript 啟動前預設透明」狀態，手機可直接看見中央書；桌機書寬、3D 前推量與文字安全區縮小，避免底部裁切及文案碰到封面裝飾。
- 試煉之森方向控制改為具目標 URL 的 Link：JavaScript 正常時保留逐格旋轉，未啟動時仍可直接進入上一／下一 Regression module。
- `/regression` 新增伺服器輸出的原生手機案例典藏，以巢狀 `details` 展開完整前置條件、測試資料、步驟與預期結果；不再把案例閱讀完全綁在 client state。
- Moor 章節閱讀器補上 grid/flex 子元素 `min-width: 0`、shell 橫向邊界與手機內容寬度；章節地圖標題增加內距，修正 `/products/moor/live` 橫向目錄撐破 viewport 與文字貼邊。
- **驗證**：ESLint、`tsc --noEmit`、Regression tests 14/14、`next build --webpack` 皆通過；靜態輸出包含首頁原生導覽、Regression fallback 與 Moor live 路由。Impeccable 本次變更檔掃描僅回報 `regression.css` 兩項既有粗邊框規則，與本次新增區塊無關。未執行 Git、部署或新增依賴。

## 2026-08-02 — 首頁場景一屏化與手機垂直節奏修正

- 新手村任務書移除元件內寫死的 315px／3D 位移 inline style，改由 CSS class 與 viewport 高度完整接管；桌機使用 `100dvh - 82px navbar`，書本尺寸、標題與軌道間距會隨可用高度縮放，主要元素不再落到首屏之外。
- 試煉之森在桌機、平板與手機皆改為 `100dvh - navbar` 的完整場景；`realm-info-panel` 維持場景內 HUD，手機縮減次要提示但保留 44px 方向鍵與 CTA，巨龍上移至石台位置。
- 手機新手村與賢者書庫統一標題置中與 section 上緣節奏；書庫移除過大的桌機式頂部留白，典藏條目改為穩定的兩欄內容結構。
- 同步更新 `DESIGN.md` 的一屏場景、手機 HUD 與標題對齊規範；未新增前台套件。
- **驗證**：ESLint、`tsc --noEmit` 與 `next build --webpack` 通過，所有靜態路由成功輸出。預設 `npm run build` 的 Turbopack 因 Codex sandbox 禁止綁定內部 port 失敗，屬既有環境限制而非程式錯誤。未執行 Git 或部署。

## 2026-08-02 — 手機首屏與試煉之森互動修正

- 首屏三顆魔法果實在手機版恢復 `ONBOARDING／REGRESSION／KNOW-HOW` 與中文名稱，改採果實下方的小型實體標籤，保留 3 個清楚可辨識的導航入口。
- 史萊姆的 scroll parallax 改為隨向下捲動由左往右移動；實測 bounding box X 座標由 `37.5` 增至 `87.06`。
- 以現有桌機插畫為參考新增 `public/rpg-trial-portal-mobile.png`（941×1672）直式場景；手機門洞重新校準為獨立座標，動態 `realm-landscape-image` 完整填滿開口。
- 移除試煉石台符文盤、拖曳與相關 state／CSS；守護巨龍移至場景元件內並固定站在石台中央。領域改由左右方向按鈕循環切換，加入按壓、確認閃光、切換鎖定與 CTA 暫時停用回饋。
- 首頁區段跳轉改為依 `.rpg-nav` 實際高度計算 scroll top，同時保留 `scroll-margin-top` fallback；實測手機目標距頂 `68.19px`／navbar `68px`，桌機目標距頂 `81.9px`／navbar `82px`。
- 601–900px 改採「完整橫幅場景＋下方資訊組」，並縮放巨龍避免平板場景裁切；手機維持「直式場景＋下方資訊組」，桌機維持右下疊層。
- **驗證**：375px 與 1440px live visual QA 無水平溢出；魔法果實文字、手機直式傳送門、門洞景色、巨龍平台與資訊面板均正常。ESLint、`tsc --noEmit`、Impeccable detector 0 findings、Regression tests 14/14、`next build --webpack` 全數通過。未執行 Git 或部署。

## 2026-08-02 — 次要場景視覺升級第二輪驗收

- 依 `ui-ux-pro-max` 的 mobile-first／touch target 建議與 Impeccable 的適配、craft floor 規範，實看驗證 375px 手機、768px 平板與 1440px 桌機的 `quest-zone`、`moor-journey`、`moor-reader-layout`。
- Moor 手機閱讀器改為真正的單頁羊皮紙：移除穿越正文的中央頁縫、保留頁邊裝訂痕跡，加入 safe-area padding、44px 點擊高度、觸控最佳化及橫向目錄的 overscroll 控制。
- 新手村輪播手機箭頭由 39px 提升至 44px，維持偽 3D 書環、拖曳與左右切換；375px 實看確認書本仍是主要焦點，頁面無水平溢出。
- 保留試煉石台刻意的卡榫回彈曲線，並以單行 Impeccable 例外註解記錄其物理感設計原因，未停用其他設計檢查。
- **驗證**：ESLint、`tsc --noEmit`、Impeccable detector 0 findings、Regression tests 14/14、`next build --webpack` 靜態輸出成功；375px／768px 均無 body 水平溢出。`npm run test:regression` 在 Codex sandbox 因 `tsx` IPC socket 權限失敗，改用等價的 `node --import tsx --test` 通過。未執行 Git、部署或新增 runtime 依賴。

## 2026-08-02 — 次要場景視覺升級第一輪

- 使用 `ui-ux-pro-max` 的本地設計資料庫與 Impeccable 對 `quest-zone`、`moor-journey`、`moor-reader-layout` 進行分析；保留專案既有森林綠、羊皮紙、古金、插畫與語意化 DOM，捨棄工具產出的通用 Bento／藍色 SaaS 建議。
- `quest-zone` 從抽象單色山形改為生命樹林間空地：以現有插畫作場景、加入中央聚光、地面景深、邊緣暗角與標題光紋；書環仍是唯一主要焦點，未增加 runtime 套件。
- `moor-journey` 改為產品世界地圖上的探索路徑：地圖承擔地貌，符文節點與光路為互動層，右側保留高對比羊皮紙章節詳情；CTA 從通用 pill 改為書扣式輪廓。
- `moor-reader-layout` 改為木製章節路標＋展開典籍＋冒險札記的實體材質組合；新增書頁中縫與背景世界地圖，移除 callout 粗側邊色條及 detector 判定的粗弧線 border。
- Impeccable 安裝目錄造成 ESLint 掃入第三方工具碼，已在 `eslint.config.mjs` 排除 `.agents/`、`.claude/`、`.codex/`，維持應用程式 lint 訊號乾淨。
- **驗證**：ESLint 零警告、`tsc --noEmit`、Impeccable detector 0 findings、`next build --webpack` 成功；桌機實看已驗證新手村與 Moor 探索地圖。Moor 閱讀器與手機視覺第二輪因本機預覽服務中途停止而待補，功能與靜態輸出已通過。未執行 Git 或部署。

## 2026-08-02 — UI 工具鏈確認＋沉浸式技術邊界定案

- 確認 project-scoped Impeccable 已安裝於 `.agents/skills/impeccable/`，並新增 `.codex/hooks.json` 於 UI 編輯後執行設計檢查；它與全域 `ui-ux-pro-max` 都是 agent 開發工具，不會進入網站 runtime bundle。
- 比對現有依賴與 `ImmersiveTreeHero`：專案已使用原生 Three.js，包含 WebGL fallback、DPR 上限、viewport 暫停、資源清理與 reduced-motion 跳過；目前不新增 React Three Fiber、Drei、GSAP 或其他 3D runtime 依賴。
- 定案採漸進式混合架構：圖片／HTML／CSS 承擔文件與主要場景，Three.js 僅用於少數沉浸式背景、粒子及深度過場；文字、CTA、表單與長篇閱讀不得放入 canvas。
- 檢查 VS Code 顯示的 root `app/`、`components/`、`content/` 刪除項目：13 個舊路徑皆有 `src/` 對應檔，為 2026-07-19 目錄重構的正常結果；`.codex/hooks.json` 為 Impeccable 新增檔案。
- Codex 內建 shell 的 npm registry 失敗來自 sandbox 對外網路／DNS 限制，不是 npm、Notion 或本機檔案權限問題。未執行 Git、程式碼改動、建置或部署。

## 2026-08-02 — ui-ux-pro-max 全域安裝完成

- 使用者已完成 `ui-ux-pro-max` 全域安裝；skill 位於 `~/.agents/skills/ui-ux-pro-max`，`SKILL.md` 完整存在。
- Codex 可直接使用 universal skill，Claude Code 已建立 `~/.claude/skills/ui-ux-pro-max` symlink；後續 UI 設計與 review 可啟用本地設計資料庫。
- 安裝輸出的 PromptScript global integration 失敗不影響本專案，因 QA Storming 使用 Codex 與 Claude Code。
- Impeccable 尚未確認安裝，保留為後續 UI audit 工具待辦。未執行 Git、程式碼改動、建置或部署。

## 2026-08-02 — UI 設計輔助工具評估＋Notion Catalog 定位

- 確認 `QA Storming Sync Lab` 為 SWAG Notion 工作區根層的私人 POC 頁面，`Website Docs Catalog` database 位於其下；Catalog 目前維持 `Title`、`Source Page URL`、`Slug`、`Category`、`Order`、`Summary`、`Publish Mode`、`Status`、`Owner`、`Last edited time`，尚未加入產品／章節階層欄位。
- 評估 `ui-ux-pro-max` 與 `impeccable` 作為設計系統建議、反模式掃描與 accessibility review 輔助；它們不得取代專案 `DESIGN.md`、既有插畫語言或人工視覺判斷。
- 將次要場景的視覺品質基準補入 `DESIGN.md`：`quest-zone`、`moor-journey`、`moor-reader-layout` 應採敘事型場景與實體材質介面，降低通用漸層面板、制式膠囊按鈕與抽象幾何背景的比例。
- 嘗試安裝兩項工具，但目前 Codex sandbox 無法解析 `registry.npmjs.org`，指令以 `ENOTFOUND` 中止，專案與全域 skill 目錄均未被修改；待使用者本機 Terminal 具網路環境時完成。
- 未執行 Git、程式碼改動、建置或部署。

## 2026-08-01 — Moor 產品 Hub＋兩章 Know-how POC

- 以既有 Notion「Moor App 使用手冊」為來源，建立安全整理版 `src/content/moor.ts`；八章皆有導覽資料，「快速入門」與「直播功能」提供完整閱讀內容，其餘六章標記待審核。
- 新增 `/products/moor` 創作者聖域 Hub 與 `/products/moor/[chapter]` 靜態章節閱讀器；支援章節選取、封印狀態、章內錨點、前後章導覽、手機版與 `prefers-reduced-motion`。
- 產品世界地圖的 Moor 詳情與首頁賢者書庫新增入口；未將 Notion 的內部 Spec／Figma 連結、帳號或敏感設定打包進公開網站。
- 移除 `next/font/google` runtime build fetch，改用系統 font stack，避免離線或受限網路建置因 Google Fonts 失敗。
- **驗證**：ESLint 零警告、`tsc --noEmit`、Notion tests 8/8、Regression tests 14/14、`next build --webpack` 成功；靜態輸出包含 `/products/moor`、`quick-start`、`live`。預設 Turbopack 在 sandbox 因無法綁定內部 port 而失敗，屬執行環境限制。未執行 Git 或部署。

## 2026-07-26 — Notion 私人 POC＋手動同步器

- 透過 Notion MCP 在 SWAG 工作區 Private 區域建立 `QA Storming Sync Lab`、`Website Docs Catalog` 與四種 POC:兩篇 `full + published`、一篇 `link-only + published`、一篇 `hidden + draft`。
- 新增 `@notionhq/client`、`scripts/sync-notion.ts`、`src/content/docs.ts`、空白 generated manifest、fixture 與 `test:notion`;支援 Catalog schema 驗證、固定排序、Markdown、圖片本地化、preview、原子替換與已發布文件移除保護。
- 新增 `.env.example`;`.env.local` 預填非機密 data source ID,保留 `NOTION_TOKEN` 空值等待唯讀 Internal Connection。
- 驗證 Catalog 四筆資料排序與狀態正確;缺 token 時 `sync:notion -- --preview` 以非零碼安全結束且不產生輸出。
- **驗證**:`test:notion` 8/8、`test:regression` 14/14、ESLint、`tsc --noEmit`、`next build` 全數通過。未執行 Git、部署或 GitHub Actions。

## 2026-07-19 — 治理文件校對 + DESIGN 規範

- 完整閱讀 Claude 建立的治理文件,並以實際 `src/`、元件、CSS、圖片資產與 repository metadata 交叉核對。
- 新增 root `DESIGN.md`:定義圖片主導的溫暖奇幻 RPG 設計語言、色彩/字體、首頁與子頁場景、偽 3D 書環、試煉石台、動畫、sprite、RWD、accessibility 與變更流程。
- 修正 `AGENTS.md` / `CLAUDE.md` 的 DESIGN 路徑、共同維護責任與目前 `main` 分支說明。
- 修正 `CLAUDE.md` / `MEMORY.md` 對靜態輸出的預覽說明:`next start` 不適用 `output: "export"`,應使用 Firebase Hosting Emulator 或靜態伺服器開 `out/`。
- 將非 Regression 文件方向從「未定」更新為 Notion Catalog allowlist＋第一階段本機手動同步;同步調整 PLAN、TASK、DECISION、ARCHITECTURE、MEMORY 與 CHANGELOG。
- 修正 `notion-content-sync.md`、`regression-authoring.md` 內重構前的 `content/...` 路徑為 `src/content/...`。
- **驗證**:僅修改 Markdown 文件;檢查治理文件互相連結、路徑與目前專案結構一致。未執行 Git 指令、程式 build、部署或功能修改。

## 2026-07-19 — 目錄重構 + 文件治理系統

- **目錄重構**:`app/`→`src/app/`、`components/`→`src/components/`、`content/`→`src/content/`(純 `mv`,git 由使用者處理)。
  - `tsconfig.json`:`@/*` 由 `./*` → `./src/*`(所有 `@/` import 不需改)。
  - `scripts/sync-regression.ts`:import `../content/regression`→`../src/content/regression`;`OUTPUT_PATH`→`src/content/generated/regression.json`。
  - `scripts/sync-regression.test.ts`:import 路徑同步更新。
  - `CLAUDE.md`:架構段路徑與別名說明更新為 `src/`,並加治理文件指引。
- **文件治理系統**:新增 `AGENTS.md`、`CHANGELOG.md`(root)與 `docs/{PLAN,PROGRESS,DECISION,TASK,MEMORY,ARCHITECTURE}.md`。`DESIGN.md` 由 Codex 另建。
- **Dead-code/檔案檢查**:無孤兒檔;無有意義的死碼(`getCasesForSuite` 為未使用但保留的便利 helper;其餘「未使用 export」皆為模組內部使用的型別,屬誤報)。`.critter` CSS 仍由 bat 使用,無 owl/deer 殘留。
- **驗證**:`npm run build` 綠燈(`/`、`/product-map`、`/regression`);`npm run lint` 乾淨;`npm run test:regression` 14/14 通過。

## 在此之前(重構前的既有成果摘要)

- Regression 知識庫(`/regression` + `TrialForestPortal` + Sheet 同步管線)、產品世界地圖、quest 輪播、critter 動畫(jelly/wolf/bat/lol-dragon,雪碧圖重排成等距格)已完成。詳見 `PLAN.md` 已完成 milestone 與 `CHANGELOG.md`。
