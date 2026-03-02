"use client";

import { useState } from "react";
import SettingsModal from "./SettingsModal";

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            遠東商銀ＡＩ智能刷卡推薦（OWEN)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700"
          >
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-sm">
              settings
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              API 設定
            </span>
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
