"use client";

import { useState } from "react";
import qaKnowledge from "@/data/feib_qa.json";
import { feibKnowledge2026v2 } from "@/data/feib_knowledge_2026_v2";
import { ModelRotator } from "@/utils/modelRotator";

export default function FeibQA() {
  const [question, setQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

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
      const rotator = new ModelRotator(apiKey);

      const systemInstruction = `
        你現在是遠東商銀 2026 數位客服 OWEN。請嚴格遵守以下數據源與規則進行回答：

        1.  **數據真實性**：若資料庫 (RAG) 顯示通路為 0% (如稅款、超商直刷)，禁止根據 Gemini 的通用常識編造回饋趴數。

        2.  **引導路徑**：針對超商 (7-11/全家)，必須提示：『實體刷卡無回饋，請改用遠東快樂卡綁定 LINE Pay 支付以獲得 5% 加碼（需每月登錄，限 1 萬名）。』

        3.  **最新年份**：現在時間是 2026 年，所有關於『免年費條件』或『首刷禮』的回答必須標註『以當季官網公告為準』。

        4.  **分期警告**：只要使用者問及『分期』，必須附帶提醒：『分期付款通常會取消原有的現金回饋。』

        5.  **海外手續費**：當用戶問及 Netflix、Spotify 或任何國外消費時，必須在結尾自動加上：『提醒您，海外交易通常會產生 1.5% 的跨國交易手續費，建議試算時將此成本納入考量。』

        6.  **視覺強調**：必須完整保留並渲染知識庫中的 Markdown 粗體與 Emoji (例如 ⚠️)。

        7.  **範圍限制**：若問題完全與遠東商銀無關，請回覆：『抱歉，身為遠東商銀 AI 專員，我僅能為您提供本行信用卡與金融相關諮詢。』

        8.  **資料來源**：回答結尾請加上「📎 資料來源：以官網公告為準」，並視情況附上相關官網連結（如 https://www.feib.com.tw/ 或 https://www.bankee.com.tw/）。
      `;

      const prompt = `
        請優先根據以下「2026 遠東商銀信用卡：100% 真實數據手冊」以及「官方知識庫」回答使用者問題。
        
        【優先調用知識庫 - 2026 遠東商銀信用卡：100% 真實數據手冊】：
        ${feibKnowledge2026v2}
        
        【備用知識庫 - 官方 QA】：
        ${JSON.stringify(qaKnowledge)}
        
        使用者問題：${question}
        
        回答規範：
        1. 優先使用繁體中文，語氣專業且親切。
        2. 若知識庫中有對應的官方連結 (url)，請在回答末尾附上。
        3. 嚴格遵守 Exclusion List (黑洞清單) 中的零回饋項目。
      `;

      const text = await rotator.generateContent(prompt, systemInstruction);
      setChatResponse(text);
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
          智能 QA 客服
        </h1>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">support_agent</span>
          詢問遠東商銀業務
        </h3>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：信用卡如何掛失？"
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
            <div className="space-y-3">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {chatResponse}
              </div>
              <div className="bg-stone-50 dark:bg-black/20 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  📎 官方資料來源（以官網公告為準）
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "遠東商銀官網", url: "https://www.feib.com.tw/" },
                    { label: "Bankee 官網", url: "https://www.bankee.com.tw/" },
                    { label: "信用卡登錄專區", url: "https://ecard.feib.com.tw/ActivityPromotion/index.do" },
                    { label: "聯絡客服", url: "https://www.feib.com.tw/contactUs" },
                  ].map(({ label, url }) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-white dark:bg-black/20 text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
