export interface LocalRecommendation {
  card: string;
  rate: string;
  reason: string;
  details: string;
  url: string;
  feedbackAmount?: number;
  feedbackRate?: string;
}

export interface LocalRule {
  keywords: string[];
  minAmount?: number;
  recommendation?: LocalRecommendation;
  calculate?: (input: string, amount: number) => LocalRecommendation;
}

export const localRules: LocalRule[] = [
  {
    keywords: ["7-11", "全家", "萊爾富", "OK", "超商", "便利商店"],
    recommendation: {
      card: "遠東快樂信用卡",
      rate: "5%",
      reason: "建議使用 LINE Pay 綁定此卡支付，可享最高 5% 回饋",
      details: "需每月登錄，名額有限。基本回饋依通路而定，綁定 LINE Pay 享 5% 刷卡金回饋 (上限 300 元/月)。",
      url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html"
    }
  },
  {
    keywords: ["LINE Pay", "linepay", "Line Pay"],
    recommendation: {
      card: "遠東快樂信用卡",
      rate: "5%",
      reason: "綁定 LINE Pay 支付享 5% 刷卡金回饋",
      details: "需每月登錄 (限1萬名)。回饋上限 300 元/月。",
      url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html"
    }
  },
  {
    keywords: ["寵物", "動物醫院", "魚中魚", "東森寵物", "寵物公園"],
    recommendation: {
      card: "遠東樂家+卡",
      rate: "10%",
      reason: "指定寵物連鎖商店/動物醫院享 10% 高額回饋",
      details: "基本 0.5% + 寵物加碼 9.5% (上限 500 元/月)。需遠銀帳戶自動扣繳。",
      url: "https://www.feib.com.tw/YACard"
    }
  },
  {
    keywords: ["加油", "中油", "台塑", "全國加油站"],
    recommendation: {
      card: "遠東樂家+卡",
      rate: "5%",
      reason: "加油享 5% 回饋 (需一般消費滿額)",
      details: "需當期一般消費滿 3,000 元且遠銀帳戶自動扣繳。基本 0.5% + 加碼 4.5% (上限 300~500 元/月)。",
      url: "https://www.feib.com.tw/YACard"
    }
  },
  {
    keywords: ["愛買", "全聯", "家樂福", "大潤發", "超市", "量販"],
    recommendation: {
      card: "遠東樂家+卡",
      rate: "5%",
      reason: "指定超市量販享 5% 回饋",
      details: "需當期一般消費滿 3,000 元且遠銀帳戶自動扣繳。基本 0.5% + 加碼 4.5%。",
      url: "https://www.feib.com.tw/YACard"
    }
  },
  {
    keywords: ["SOGO", "遠東百貨", "遠百", "巨城"],
    recommendation: {
      card: "C'est Moi 旅遊悠遊卡",
      rate: "HAPPY GO 4倍",
      reason: "遠東集團百貨消費享 HAPPY GO 點數 4 倍送",
      details: "每 100 元贈 4 點 (約 1% 回饋)，無上限。",
      url: "https://www.feib.com.tw/detail?id=414"
    }
  },
  {
    keywords: ["高鐵", "台鐵", "機票", "航空"],
    recommendation: {
      card: "遠東樂行卡",
      rate: "3%",
      reason: "交通通勤類消費享 3% 回饋",
      details: "當期一般消費滿 3,000 元且登錄，享 3% 刷卡金回饋 (上限 300 元/月)。",
      url: "https://www.feib.com.tw/upload/creditcard/HWCard/index.html"
    }
  },
  {
    keywords: ["海外", "日本", "韓國", "國外", "美金", "日幣", "歐元"],
    minAmount: 20000,
    calculate: (input, amount) => {
      const base = amount * 0.015;
      const bonusTimes = Math.floor(amount / 25000);
      const bonus = bonusTimes * 500;
      const isJapanOrKorea = input.includes("日本") || input.includes("韓國");
      const countryBonus = isJapanOrKorea && amount >= 50000 ? 500 : 0;
      const total = Math.round(base + bonus + countryBonus);
      const rate = ((total / amount) * 100).toFixed(2);
      const detailsParts = [
        `基本海外 1.5% (${Math.round(base)} 元)`,
        `每滿 2.5 萬加碼 ${bonus} 元`,
        countryBonus > 0 ? "指定國家加碼 500 元" : null,
        "Bankee 3% 需數位帳戶月均餘額 60 萬 (未達則 0.15%)"
      ].filter(Boolean);
      return {
        card: "遠東頂級快樂卡",
        rate: `${rate}%`,
        reason: "大額海外消費以滿額禮加碼回饋更高，且無 60 萬存款門檻",
        details: detailsParts.join("；"),
        url: "https://www.feib.com.tw/upload/creditcard/HappyCardinfinite/index.html",
        feedbackAmount: total,
        feedbackRate: `${rate}%`
      };
    }
  },
  {
    keywords: ["海外", "日本", "韓國", "國外", "美金", "日幣", "歐元"],
    recommendation: {
      card: "Bankee 信用卡",
      rate: "3%",
      reason: "海外消費享 3% 回饋無上限",
      details: "需 Bankee 數位帳戶月均餘額達 60 萬 (未達則為 0.15%)。回饋無上限。",
      url: "https://www.bankee.com.tw/"
    }
  },
  {
    keywords: ["星巴克", "路易莎", "咖啡"],
    recommendation: {
      card: "遠東快樂信用卡",
      rate: "5%",
      reason: "指定咖啡品牌享 5% 回饋",
      details: "需每月登錄。5% 刷卡金回饋 (上限 300 元/月)。",
      url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html"
    }
  },
  {
    keywords: ["momo", "PChome", "蝦皮", "酷澎", "Coupang"],
    recommendation: {
      card: "遠東快樂信用卡",
      rate: "5%",
      reason: "指定網購平台享 5% 回饋",
      details: "需每月登錄。5% 刷卡金回饋 (上限 300 元/月)。",
      url: "https://www.feib.com.tw/upload/creditcard/HappyCardRed/index.html"
    }
  }
];

export function findLocalRecommendation(input: string, amount?: number): LocalRecommendation | null {
  const normalizedInput = input.toLowerCase();
  for (const rule of localRules) {
    const matchesKeyword = rule.keywords.some(keyword =>
      normalizedInput.includes(keyword.toLowerCase())
    );
    if (!matchesKeyword) {
      continue;
    }
    if (rule.minAmount !== undefined && amount !== undefined && amount < rule.minAmount) {
      continue;
    }
    if (rule.calculate && amount !== undefined) {
      return rule.calculate(input, amount);
    }
    if (rule.recommendation) {
      return rule.recommendation;
    }
  }
  return null;
}
