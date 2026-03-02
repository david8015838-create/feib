"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import feibRules from "@/data/feib_rules.json";

export default function BankeeSimulator() {
  const [referrals, setReferrals] = useState(0);
  const [question, setQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const interestRate = referrals >= 1 ? 2.6 : 1.435;
  const limit = referrals >= 1 ? "50,000" : "無上限";

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setChatResponse("請先在設定中輸入 Gemini API Key");
      return;
    }

    setLoading(true);
    setChatResponse("");

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Update to 2026 latest model: Gemini 2.5 Flash
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        你是一個 Bankee 產品專家。
        請根據以下 2026 年的 Bankee 規則回答使用者問題。
        
        Bankee 規則：
        ${JSON.stringify(feibRules.bank_account)}
        及 Bankee 信用卡規則：
        ${JSON.stringify(feibRules.cards.find(c => c.name === "Bankee 信用卡"))}
        
        使用者問題：${question}
        
        回答要求：
        1. 使用繁體中文。
        2. 強調這是 2026 年最新官方規則。
        3. 附上官網連結：${feibRules.bank_account.url}
      `;

      const result = await model.generateContent(prompt);
      setChatResponse(result.response.text());
    } catch (err) {
      setChatResponse("發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bankee 社群管家
        </h1>
      </div>

      {/* Simulator Card */}
      <div className="glass-card rounded-2xl p-6 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            預估活存利率
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold text-primary font-display">
              {interestRate}%
            </span>
          </div>
          <p className="text-xs text-slate-500 bg-stone-100 dark:bg-stone-800 inline-block px-3 py-1 rounded-full">
            額度：{limit}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>成功推薦人數</span>
            <span className="text-primary font-bold">{referrals} 人</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={referrals}
            onChange={(e) => setReferrals(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0 人</span>
            <span>1 人以上</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">forum</span>
          詢問 Bankee 規則
        </h3>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：Bankee 海外回饋有多少？"
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-700 focus:border-primary focus:ring-primary text-slate-900 dark:text-white text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>

          {chatResponse && (
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chatResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
