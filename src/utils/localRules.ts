import exclusionList from "@/data/Exclusion_List.json";

export interface LocalRecommendation {
  card: string;
  rate: string;
  reason: string;
  details: string;
  url: string;
  feedbackAmount: number;
  feedbackRate: string;
  isBlackhole?: boolean;
  suggestedCombination?: {
    card: string;
    payment: string;
    rate: string;
    amount: number;
    warning: string;
  };
}

interface LocalCandidate extends LocalRecommendation {
  rateValue: number;
  requiresRegistration: boolean;
}

interface LocalRule {
  name: string;
  keywords: string[];
  url: string;
  requiresRegistration: boolean;
  calculate: (store: string, amount: number, bankeeBalance?: number) => LocalCandidate | null;
}

const normalize = (value: string) => value.toLowerCase();

const matchesKeywords = (store: string, keywords: string[]) => {
  const normalizedStore = normalize(store);
  return keywords.some(keyword => normalizedStore.includes(normalize(keyword)));
};

const formatRate = (value: number) => `${value.toFixed(2)}%`;

const buildCandidate = (data: {
  card: string;
  total: number;
  reason: string;
  details: string;
  url: string;
  requiresRegistration: boolean;
  amount: number;
}): LocalCandidate => {
  const rateValue = data.amount > 0 ? data.total / data.amount : 0;
  const rateLabel = formatRate(rateValue * 100);
  return {
    card: data.card,
    rate: rateLabel,
    reason: data.reason,
    details: data.details,
    url: data.url,
    feedbackAmount: data.total,
    feedbackRate: rateLabel,
    rateValue,
    requiresRegistration: data.requiresRegistration
  };
};

const cappedBonusReward = (amount: number, baseRate: number, bonusRate: number, bonusCap: number) => {
  const base = amount * baseRate;
  const bonus = Math.min(amount * bonusRate, bonusCap);
  const total = Math.round(base + bonus);
  return {
    total,
    baseDisplay: Math.round(base),
    bonusDisplay: Math.round(bonus)
  };
};

const buildZeroResult = (reason: string, details: string, suggested?: LocalRecommendation["suggestedCombination"]) => ({
  card: "無回饋",
  rate: "0.00%",
  reason,
  details,
  url: "https://www.feib.com.tw/",
  feedbackAmount: 0,
  feedbackRate: "0.00%",
  isBlackhole: true,
  suggestedCombination: suggested
});

const matchesAny = (store: string, keywords: string[]) => matchesKeywords(store, keywords);

// 樂家+卡：寵物關鍵字（享 10% 高回饋）
const PET_KEYWORDS = ["寵物", "動物醫院", "魚中魚", "東森寵物", "寵物公園"];

// 樂家+卡：量販/加油/餐廳/電信關鍵字（享 4% 回饋）
const YACARD_BONUS_KEYWORDS = [
  "量販", "超市", "愛買", "家樂福", "美廉社", "全聯", "小北百貨",
  "加油",
  "餐廳", "影城", "影院",
  "遠傳", "台灣大哥大"
];

const localRules: LocalRule[] = [
  {
    name: "遠東樂家+卡",
    keywords: [...PET_KEYWORDS, ...YACARD_BONUS_KEYWORDS],
    url: "https://www.feib.com.tw/YACard",
    requiresRegistration: false,
    calculate: (store, amount) => {
      if (amount <= 0) return null;

      const isPet = matchesKeywords(store, PET_KEYWORDS);

      if (isPet) {
        // 寵物：0.5% 基本 + 9.5% 加碼，上限 500 元/月
        const result = cappedBonusReward(amount, 0.005, 0.095, 500);
        return buildCandidate({
          card: "遠東樂家+卡",
          total: result.total,
          reason: "寵物通路 10% 回饋，上限 500 元/月",
          details: `基本 0.5% (${result.baseDisplay} 元) + 寵物加碼 9.5% (上限 500 元，實得 ${result.bonusDisplay} 元)；需遠銀帳戶自動扣繳`,
          url: "https://www.feib.com.tw/YACard",
          requiresRegistration: false,
          amount
        });
      } else {
        // 量販/加油/餐廳/電信：0.5% 基本 + 3.5% 加碼，上限 200 元/月
        const result = cappedBonusReward(amount, 0.005, 0.035, 200);
        return buildCandidate({
          card: "遠東樂家+卡",
          total: result.total,
          reason: "量販/加油/餐廳/電信通路 4% 回饋，上限 200 元/月",
          details: `基本 0.5% (${result.baseDisplay} 元) + 指定加碼 3.5% (上限 200 元，實得 ${result.bonusDisplay} 元)；需遠銀帳戶自動扣繳`,
          url: "https://www.feib.com.tw/YACard",
          requiresRegistration: false,
          amount
        });
      }
    }
  },
  {
    name: "遠東快樂信用卡",
    keywords: [
      // 行動支付
      "LINE Pay", "line pay", "linepay",
      // 百貨
      "SOGO", "遠東百貨", "愛買", "city'super", "citysuper",
      // 藥妝
      "屈臣氏", "康是美", "寶雅",
      // 服飾
      "ZARA", "UNIQLO", "H&M", "NET",
      // 咖啡
      "星巴克", "路易莎", "Starbucks", "Louisa",
      // 網購
      "momo", "蝦皮", "coupang", "酷澎", "PChome"
    ],
    url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html",
    requiresRegistration: true,
    calculate: (_store, amount) => {
      if (amount <= 0) return null;
      const result = cappedBonusReward(amount, 0.005, 0.045, 300);
      const details = `需每月手動登錄（限 1 萬名）；基本 0.5% (${result.baseDisplay} 元) + 加碼 4.5% (上限 300 元，實得 ${result.bonusDisplay} 元)；優惠期至 2026/06/30`;
      return buildCandidate({
        card: "遠東快樂信用卡",
        total: result.total,
        reason: "LINE Pay、百貨、藥妝、服飾、咖啡、網購 5% 回饋，上限 300 元",
        details,
        url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html",
        requiresRegistration: true,
        amount
      });
    }
  },
  {
    name: "遠東樂行卡",
    keywords: [
      "高鐵", "台鐵", "捷運", "航空", "機票", "航班",
      "kkday", "klook", "旅遊訂票",
      "計程車", "小黃", "eTag",
      "停車場"
    ],
    url: "https://www.feib.com.tw/upload/creditcard/HWCard/index.html",
    requiresRegistration: true,
    calculate: (_store, amount) => {
      if (amount <= 0) return null;
      // 3% = 1% 基本 + 2% 加碼，上限 300 元/月
      const base = Math.round(amount * 0.01);
      const bonus = Math.min(Math.round(amount * 0.02), 300);
      const total = base + bonus;
      return buildCandidate({
        card: "遠東樂行卡",
        total,
        reason: "交通/旅遊通路 3% 回饋，上限 300 元/月",
        details: `基本 1% (${base} 元) + 交通加碼 2% (上限 300 元，實得 ${bonus} 元)；需當月 27 日前手動登錄`,
        url: "https://www.feib.com.tw/upload/creditcard/HWCard/index.html",
        requiresRegistration: true,
        amount
      });
    }
  },
  {
    name: "遠東頂級快樂卡",
    keywords: ["海外", "國外", "日本", "韓國", "美金", "日幣", "歐元"],
    url: "https://www.feib.com.tw/upload/creditcard/HappyCardinfinite/index.html",
    requiresRegistration: false,
    calculate: (store, amount) => {
      if (amount <= 0) return null;
      const base = amount * 0.015;
      const bonusTimes = Math.floor(amount / 25000);
      const bonus = bonusTimes * 500;
      const isJapan = store.includes("日本");
      const countryBonus = isJapan && amount >= 50000 ? 500 : 0;
      const total = Math.round(base + bonus + countryBonus);
      const detailsParts = [
        `基本海外 1.5% (${Math.round(base)} 元)`,
        `海外滿額加碼 ${bonus} 元`,
        countryBonus > 0 ? "日本滿 5 萬加碼 500 元" : null
      ].filter(Boolean);
      return buildCandidate({
        card: "遠東頂級快樂卡",
        total,
        reason: "海外消費 1.5% 無上限，滿額禮加碼回饋",
        details: detailsParts.join("；"),
        url: "https://www.feib.com.tw/upload/creditcard/HappyCardinfinite/index.html",
        requiresRegistration: false,
        amount
      });
    }
  },
  {
    name: "Bankee 信用卡",
    keywords: ["海外", "國外", "日本", "韓國", "美金", "日幣", "歐元"],
    url: "https://www.bankee.com.tw/",
    requiresRegistration: false,
    calculate: (_store, amount, bankeeBalance) => {
      if (amount <= 0) return null;
      const meetsThreshold = (bankeeBalance ?? 0) >= 600000;
      const rateValue = meetsThreshold ? 0.03 : 0.0015;
      const total = Math.round(amount * rateValue);
      const details = meetsThreshold
        ? "Bankee 數位帳戶月均餘額達 60 萬，海外 3% 無上限"
        : "需 Bankee 數位帳戶月均餘額達 60 萬，未達則 0.15%";
      return buildCandidate({
        card: "Bankee 信用卡",
        total,
        reason: meetsThreshold ? "海外消費 3% 無上限" : "未達 60 萬門檻，海外回饋 0.15%",
        details,
        url: "https://www.bankee.com.tw/",
        requiresRegistration: false,
        amount
      });
    }
  }
];

const compareCandidate = (a: LocalCandidate, b: LocalCandidate) => {
  if (a.rateValue !== b.rateValue) {
    return a.rateValue > b.rateValue ? a : b;
  }
  if (a.requiresRegistration !== b.requiresRegistration) {
    return a.requiresRegistration ? b : a;
  }
  if (a.feedbackAmount !== b.feedbackAmount) {
    return a.feedbackAmount > b.feedbackAmount ? a : b;
  }
  return a;
};

export function calculateReward(
  store: string,
  amount: number,
  options?: { bankeeBalance?: number }
): LocalRecommendation | null {
  if (!store || amount <= 0) {
    return null;
  }

  if (matchesAny(store, exclusionList.governmentFees)) {
    return buildZeroResult("⚠️ 此為非一般消費項目，遠東卡不提供現金回饋。", "此為非一般消費項目");
  }
  if (matchesAny(store, exclusionList.utilities)) {
    return buildZeroResult("⚠️ 此為非一般消費項目，遠東卡不提供現金回饋。", "此為非一般消費項目");
  }
  if (matchesAny(store, exclusionList.tuition)) {
    return buildZeroResult("⚠️ 此為非一般消費項目，遠東卡不提供現金回饋。", "非指定代繳活動不提供回饋");
  }
  // 中華電信費為零回饋（遠傳/台灣大哥大 可透過樂家+卡享 4% 回饋）
  if (matchesAny(store, exclusionList.telecom)) {
    return buildZeroResult("⚠️ 中華電信費為零回饋項目。若為遠傳或台灣大哥大帳單，可改用遠東樂家+卡自動扣繳享 4% 回饋。", "非指定代繳活動不提供回饋");
  }

  if (matchesAny(store, exclusionList.costcoKeywords)) {
    if (!matchesAny(store, exclusionList.costcoOnlineKeywords)) {
      return buildZeroResult("🚫 好市多實體賣場僅支援富邦聯名卡，遠東卡無法支付。", "此為非一般消費項目");
    }
    const total = Math.round(amount * 0.005);
    return {
      card: "基本回饋",
      rate: "0.50%",
      reason: "Costco 線上購物僅享基本回饋 0.5%",
      details: "線上購物不觸發加碼",
      url: "https://www.feib.com.tw/",
      feedbackAmount: total,
      feedbackRate: "0.50%"
    };
  }

  if (matchesAny(store, exclusionList.insuranceKeywords)) {
    const meetsThreshold = (options?.bankeeBalance ?? 0) >= 600000;
    const rateValue = meetsThreshold ? 0.012 : 0.0015;
    const total = Math.round(amount * rateValue);
    return {
      card: "Bankee 信用卡",
      rate: formatRate(rateValue * 100),
      reason: meetsThreshold ? "保費僅享 Bankee 基本回饋 1.2%" : "保費僅享 Bankee 基本回饋 0.15%",
      details: "分期與現金回饋不可併用",
      url: "https://www.bankee.com.tw/",
      feedbackAmount: total,
      feedbackRate: formatRate(rateValue * 100)
    };
  }

  const hasMobilePay = matchesAny(store, exclusionList.paymentKeywords);
  if (matchesAny(store, exclusionList.convenienceKeywords) && !hasMobilePay) {
    const suggestedAmount = Math.round(amount * 0.05);
    return buildZeroResult(
      "🚫 實體刷卡無回饋。請綁定 LINE Pay 支付。",
      "此為非一般消費項目",
      {
        card: "遠東快樂信用卡",
        payment: "LINE Pay",
        rate: "5%",
        amount: suggestedAmount,
        warning: "請確保已完成每月活動登錄（限 1 萬名）。優惠期至 2026/06/30。"
      }
    );
  }

  return calculateBestLocalRecommendation(store, amount, options);
}

export function calculateBestLocalRecommendation(
  store: string,
  amount: number,
  options?: { bankeeBalance?: number }
): LocalRecommendation | null {
  if (!store || amount <= 0) {
    return null;
  }
  const candidates = localRules
    .filter(rule => matchesKeywords(store, rule.keywords))
    .map(rule => rule.calculate(store, amount, options?.bankeeBalance))
    .filter((candidate): candidate is LocalCandidate => Boolean(candidate));
  if (candidates.length === 0) {
    return {
      card: "基本回饋",
      rate: "0.50%",
      reason: "一般消費享基本回饋 0.5%",
      details: "無指定通路加碼",
      url: "https://www.feib.com.tw/",
      feedbackAmount: Math.round(amount * 0.005),
      feedbackRate: "0.50%"
    };
  }
  const best = candidates.reduce(compareCandidate);
  return {
    card: best.card,
    rate: best.rate,
    reason: best.reason,
    details: best.details,
    url: best.url,
    feedbackAmount: best.feedbackAmount,
    feedbackRate: best.feedbackRate,
    isBlackhole: best.isBlackhole,
    suggestedCombination: best.suggestedCombination
  };
}
