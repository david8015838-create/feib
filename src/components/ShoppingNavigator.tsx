"use client";

import { useState } from "react";
import feibRules from "@/data/feib_rules.json";
import { findLocalRecommendation } from "@/utils/localRules";
import { ModelRotator } from "@/utils/modelRotator";

export default function ShoppingNavigator() {
  const [store, setStore] = useState("遠東百貨信義A13");
  const [amount, setAmount] = useState<number>(12000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    // 1. 優先檢查本地規則 (不消耗 API Key)
    const localRec = findLocalRecommendation(store, amount);
    if (localRec) {
      const feedbackAmount =
        localRec.feedbackAmount ?? Math.round(amount * (parseFloat(localRec.rate) / 100));
      const feedbackRate = localRec.feedbackRate ?? localRec.rate;
      setResult({
        recommended_card: localRec.card,
        feedback_amount: feedbackAmount,
        feedback_rate: feedbackRate,
        reason: localRec.reason,
        details: localRec.details,
        official_url: localRec.url
      });
      setError("");
      return;
    }

    // 2. 若無本地規則，則使用 API
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setError("請先在設定中輸入 Gemini API Key");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const rotator = new ModelRotator(apiKey);

      const prompt = `
        你是一個遠東商銀 AI 智策助手。
        請根據以下 2026 年的信用卡與帳戶規則 (JSON 格式)，為使用者的消費計算最佳回饋。
        
        規則數據庫：
        ${JSON.stringify(feibRules)}
        
        使用者輸入：
        消費通路/特店：${store}
        消費金額：${amount}
        
        任務：
        1. 嚴格比對消費通路與規則中的 channels 或 scenarios。
        2. 若使用者輸入一般通路 (如 7-11、全家、超商、餐飲等)，請主動思考「是否可透過行動支付 (LINE Pay) 獲得更高回饋」。
           - 如果是，請推薦「遠東快樂信用卡」並明確建議「綁定 LINE Pay 支付」。
        3. 【重要】若遇到「海外消費」或「日本」且金額較大 (如超過 2 萬台幣)：
           - 請優先計算「遠東頂級快樂卡」的回饋 (基本 1.5% + 滿額禮 + 指定國加碼)。
           - 對於 Bankee 卡，必須嚴格檢查「存款 60 萬」門檻。若使用者未提及有存款，請在計算結果中強調 Bankee 的 3% 需有 60 萬存款才能享有，並推薦門檻較低的「遠東頂級快樂卡」作為最佳解 (若其回饋更高)。
           - 請模仿以下邏輯進行比較： "雖然 Bankee 有 3%，但需存款 60 萬；遠東頂級快樂卡透過滿額加碼可達 3.58%，且無存款門檻，因此更推薦頂級快樂卡。"
        4. 計算回饋金額 (務必考慮加碼上限)。
        5. 回傳 JSON 格式結果，包含以下欄位：
           - recommended_card (字串): 推薦卡片名稱
           - feedback_amount (數字): 回饋金額 (四捨五入至整數)
           - feedback_rate (字串): 回饋率 (例如 "5%")
           - reason (字串): 推薦理由 (需包含綁定方式，例如：「建議使用 LINE Pay 綁定此卡支付，可享最高 5% 回饋」)
           - details (字串): 計算細節與門檻提醒 (例如 "LINE Pay 5% (需每月登錄，上限300元)")
           - official_url (字串): 對應的官網連結
           
        請只回傳 JSON 字串，不要有 markdown 標記。
      `;

      const text = await rotator.generateContent(prompt);
      
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const data = JSON.parse(cleanText);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(`計算失敗：${err.message || "請檢查 API Key 或稍後再試"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Shopping Navigator
        </h1>
        <span className="px-2 py-1 bg-primary-light dark:bg-primary/20 text-primary text-xs font-bold rounded">
          BETA
        </span>
      </div>

      {/* Input Card */}
      <div className="glass-card rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            地點/特店名稱
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
              storefront
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border-stone-200 dark:border-stone-700 focus:border-primary focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 transition-shadow shadow-sm"
              placeholder="輸入地點或特店名稱"
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            預計消費金額 (TWD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              $
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border-stone-200 dark:border-stone-700 focus:border-primary focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 transition-shadow shadow-sm font-display"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined">search_check</span>
          )}
          {loading ? "計算中..." : "開始計算最佳回饋"}
        </button>
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
      </div>

      {/* Results Card */}
      {result && (
        <div className="bg-gradient-to-br from-white to-stone-50 dark:from-surface-dark dark:to-[#3a2020] rounded-2xl p-0.5 shadow-lg border border-stone-200 dark:border-stone-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-surface-dark rounded-[14px] p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  recommend
                </span>
                推薦卡片
              </h3>
              <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-green-200 dark:border-green-800">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
                來源已驗證
              </span>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-10 rounded bg-gradient-to-r from-primary to-primary-dark shadow-md relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 skew-x-12"></div>
                <span className="text-white text-[10px] font-bold">FEIB</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                  {result.recommended_card}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {result.reason}
                </p>
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10 dark:border-primary/20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                    預估現金回饋
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-primary font-display">
                      {result.feedback_amount}
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      元
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                    回饋率
                  </p>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {result.feedback_rate}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-primary/10 dark:border-primary/20 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-black/20 text-slate-600 dark:text-slate-300 border border-stone-200 dark:border-stone-700">
                  {result.details}
                </span>
              </div>
              <a
                href={result.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  search
                </span>
                驗證官網數據
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
