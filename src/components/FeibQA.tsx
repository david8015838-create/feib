"use client";

import { useState } from "react";
import qaKnowledge from "@/data/feib_qa.json";
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

      const prompt = `
        你是一個遠東商銀智能 QA 客服。
        請根據以下官方知識庫回答使用者問題。
        
        知識庫：
        ${JSON.stringify(qaKnowledge)}
        
        使用者問題：${question}
        
        回答規範：
        1. 嚴格依據知識庫內容回答。
        2. 若問題與遠東商銀無關，請回答「抱歉，此問題與遠東商銀業務無關，無法提供服務。」
        3. 必須在回答末尾附上知識庫中對應的官方連結 (url)。
        4. 使用繁體中文，語氣專業親切。
      `;

      const text = await rotator.generateContent(prompt);
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
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chatResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
