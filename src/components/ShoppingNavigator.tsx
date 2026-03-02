"use client";

import { useState } from "react";
import feibRules from "@/data/feib_rules.json";
import { calculateReward } from "@/utils/localRules";
import { ModelRotator } from "@/utils/modelRotator";

export default function ShoppingNavigator() {
  const [store, setStore] = useState("遠東百貨信義A13");
  const [amount, setAmount] = useState<number>(12000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    // 1. 優先檢查本地規則 (不消耗 API Key)
    const localRec = calculateReward(store, amount);
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
           - isBlackhole (布林值): 若該通路直接刷卡無回饋，請設為 true
           - suggestedCombination (物件): 若為黑洞通路，請提供最佳路徑組合
             - card (字串): "遠東快樂信用卡"
             - payment (字串): "LINE Pay"
             - rate (字串): "5%"
             - amount (數字): 計算出的 5% 回饋金額
             - warning (字串): "實體刷卡無回饋。請綁定 LINE Pay 支付，並確保已完成每月活動登錄（限 1 萬名）。"
           
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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-white to-stone-50 dark:from-surface-dark dark:to-[#3a2020] rounded-2xl p-0.5 shadow-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
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
                <div className={`w-16 h-10 rounded shadow-md relative overflow-hidden flex-shrink-0 flex items-center justify-center ${result.isBlackhole ? 'bg-slate-200 dark:bg-slate-800' : 'bg-gradient-to-r from-primary to-primary-dark'}`}>
                  <div className="absolute inset-0 bg-white/10 skew-x-12"></div>
                  <span className={`${result.isBlackhole ? 'text-slate-500' : 'text-white'} text-[10px] font-bold`}>FEIB</span>
                </div>
                <div>
                  <h4 className={`font-bold leading-tight ${result.isBlackhole ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {result.recommended_card}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {result.reason}
                  </p>
                </div>
              </div>
              <div className={`${result.isBlackhole ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200' : 'bg-primary/5 dark:bg-primary/10 border-primary/10'} rounded-xl p-4 border dark:border-primary/20`}>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                      預估現金回饋
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-extrabold font-display ${result.isBlackhole ? 'text-slate-400' : 'text-primary'}`}>
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
                    <span className={`text-lg font-bold ${result.isBlackhole ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {result.feedback_rate}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary/10 dark:border-primary/20 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-black/20 text-slate-600 dark:text-slate-300 border border-stone-200 dark:border-stone-700">
                    {result.details}
                  </span>
                </div>
                {result.official_url && (
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
                )}
              </div>
            </div>
          </div>

          {/* 最佳路徑 / 建議支付組合 */}
          {result.suggestedCombination && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 shadow-sm animate-in zoom-in-95 duration-500 delay-150">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                  auto_awesome
                </span>
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  最佳路徑：建議支付組合
                </h3>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-white dark:bg-black/40 rounded-lg border border-amber-200 dark:border-amber-700 shadow-sm">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-0.5">推薦卡片</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{result.suggestedCombination.card}</p>
                    </div>
                    <span className="material-symbols-outlined text-amber-400 text-sm">add</span>
                    <div className="px-3 py-1.5 bg-white dark:bg-black/40 rounded-lg border border-amber-200 dark:border-amber-700 shadow-sm">
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-0.5">支付方式</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{result.suggestedCombination.payment}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3 border border-amber-100 dark:border-amber-900/50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300">預期回饋</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-amber-600 font-display">{result.suggestedCombination.amount}</span>
                        <span className="text-xs font-bold text-amber-800">元 ({result.suggestedCombination.rate})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-amber-100/50 dark:bg-amber-900/30 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[16px] mt-0.5">info</span>
                    <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200 font-medium italic">
                      {result.suggestedCombination.warning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
