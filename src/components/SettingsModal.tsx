"use client";

import { useState, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const key = localStorage.getItem("gemini_api_key");
    if (key) setApiKey(key);
  }, []);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    onClose();
    alert("API Key 已儲存！");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            設定 API Key
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="輸入您的 API Key"
              className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-700 focus:border-primary focus:ring-primary text-slate-900 dark:text-white outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">
              您的 Key 僅儲存於本地瀏覽器，不會上傳至伺服器。
            </p>
          </div>
          
          <button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            儲存設定
          </button>
        </div>
      </div>
    </div>
  );
}
