# 遠東商銀 AI 智能刷卡推薦 — 專案上下文

> 最後更新：2026-03-04

---

## 專案概覽

**名稱**：遠東商銀 AI 智能刷卡推薦（OWEN）
**Repo**：https://github.com/david8015838-create/feib
**線上版**：https://david8015838-create.github.io/feib/
**本地路徑**：`/Users/chenyouwei/遠東商銀pwa/feib-pilot/`

---

## 技術架構

| 層級 | 技術 |
|------|------|
| 框架 | Next.js 14.2.3（Static Export） |
| UI | React 18 + TypeScript + Tailwind CSS |
| AI | Google Generative AI SDK（Gemini，ModelRotator 輪詢） |
| PWA | next-pwa（Workbox，離線可用） |
| 部署 | GitHub Pages（`gh-pages` branch，submodule `.gh-pages/`） |

**路由/Base Path**：生產環境 `/feib`，開發環境 `/`

---

## 目錄結構

```
src/
├── app/
│   ├── page.tsx              # 主頁面（Tab 切換：刷卡導航 / QA 客服）
│   ├── layout.tsx            # Root Layout + metadata
│   └── globals.css
├── components/
│   ├── ShoppingNavigator.tsx # 智能刷卡導航（本地規則 → API fallback）
│   ├── FeibQA.tsx            # 智能 QA 客服（Gemini + 知識庫 RAG）
│   ├── Header.tsx            # Header + 設定按鈕
│   └── SettingsModal.tsx     # Gemini API Key 設定（localStorage）
├── data/
│   ├── feib_knowledge_2026_v2.ts  ← FeibQA 使用的主要知識庫（已更新）
│   ├── feib_knowledge_2026_v2.md  ← 同上，markdown 版本
│   ├── feib_knowledge_2026.md     ← 備用知識庫（未直接 import）
│   ├── feib_knowledge_2026.ts     ← 備用知識庫（未直接 import）
│   ├── feib_rules.json            ← ShoppingNavigator API fallback 規則
│   ├── feib_qa.json               ← QA 備用問答資料庫
│   └── Exclusion_List.json        ← 零回饋黑洞清單
└── utils/
    ├── localRules.ts         # 本地回饋計算邏輯（不耗費 API）
    └── modelRotator.ts       # Gemini 模型輪詢（gemini-2.5-flash 優先）
```

---

## 功能說明

### 1. 智能刷卡導航（ShoppingNavigator）
- **流程**：輸入商店名稱 + 金額 → 本地規則優先計算（`localRules.ts`）→ 若無規則才呼叫 Gemini API（`feib_rules.json` 作 prompt）
- **結果**：推薦卡片、回饋率、回饋金額、官方連結、資料來源列表

### 2. 智能 QA 客服（FeibQA）
- **流程**：使用者輸入問題 → 呼叫 Gemini API，帶入 `feibKnowledge2026v2` + `feib_qa.json`
- **角色**：遠東商銀 2026 數位客服 OWEN
- **結果**：回答 + 固定顯示官方資料來源連結列

---

## 信用卡回饋邏輯（2026 年正確版）

### 遠東樂家+卡（有效至 2026/06/30）
| 通路 | 回饋率 | 上限/月 | 條件 |
|------|--------|---------|------|
| 寵物商店、動物醫院 | **10%** | 500 元 | 需遠銀帳戶自動扣繳 |
| 量販超市（愛買/家樂福/全聯）、加油、指定餐廳、遠傳/台灣大哥大 | **4%** | 200 元 | 需遠銀帳戶自動扣繳 |
| 一般消費 | 0.5% | 無上限 | — |

### 遠東快樂信用卡（有效至 2026/06/30）
| 通路 | 回饋率 | 上限/月 | 條件 |
|------|--------|---------|------|
| LINE Pay、SOGO、遠東百貨、愛買、city'super | **5%** | 300 元 | 需每月手動登錄，限 1 萬名 |
| 藥妝（屈臣氏/康是美/寶雅）、服飾（ZARA/UNIQLO/H&M）、咖啡（星巴克/路易莎）、網購（momo/蝦皮/coupang） | **5%** | 300 元（共享）| 需每月手動登錄 |

### 遠東樂行卡（有效至 2026/12/31）
| 通路 | 回饋率 | 上限/月 | 條件 |
|------|--------|---------|------|
| 高鐵、台鐵、航空、計程車、kkday、klook、eTag | **3%** | 300 元 | 需當月 27 日前登錄 + 一般消費滿 3,000 元 |
| 一般消費 | 1% | 無上限 | 當月消費滿 3,000 元 |

### 遠東頂級快樂卡（有效至 2026/12/31）
- 海外基本：**1.5%** 無上限
- 每滿 25,000 加碼：500 元
- 指定國（日本等）單月滿 50,000：再加碼 500 元

### Bankee 信用卡（常駐）
- 國內：1.2%（需月均餘額 ≥ 60 萬）；否則 0.15%
- 海外：3%（需月均餘額 ≥ 60 萬）；否則 0.15%

### Bankee 數位帳戶（常駐）
- 基本活存：**1.435%** 無上限
- 新戶優惠：推薦碼開戶享 **2.6%**（5 萬額度，6 個月）
- 月免費跨行轉帳 6 次、提款 6 次

---

## 零回饋黑洞（Exclusion List）

- **政府規費**：所得稅、牌照稅、各類規費、罰鍰
- **公用事業**：水費、電費、瓦斯費
- **電信**：中華電信費（遠傳/台灣大哥大自動扣繳可享樂家+卡 4%）
- **便利商店直刷**：7-11、全家、萊爾富、OK（改用 LINE Pay 可享快樂卡 5%）
- **Costco 實體**：遠東卡無法交易（僅富邦聯名卡）
- **學雜費**：各級學校學費

---

## 部署方式

```bash
# 1. 開發
npm run dev

# 2. 建置
npm run build

# 3. 部署（複製 out/ 到 .gh-pages submodule 並推送）
cp -r out/* .gh-pages/
cd .gh-pages && git add -A && git commit -m "deploy: ..." && git push origin HEAD

# 4. 推送主線
cd .. && git push origin main
```

---

## 客服資訊

- 信用卡客服：**(02) 8073-1166**（24 小時）
- 免付費專線：**0800-261-732**（24 小時）
- 國外撥打：886-2-8073-1166
- 官網：https://www.feib.com.tw/contactUs
- 信用卡登錄專區：https://ecard.feib.com.tw/ActivityPromotion/index.do
- Bankee 官網：https://www.bankee.com.tw/
