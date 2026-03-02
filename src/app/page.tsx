"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ShoppingNavigator from "@/components/ShoppingNavigator";
import BankeeSimulator from "@/components/BankeeSimulator";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'navigator' | 'bankee'>('navigator');

  return (
    <>
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 pt-2">
        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-6">
          <button
            onClick={() => setActiveTab('navigator')}
            className={`flex flex-col items-center justify-center border-b-[3px] gap-2 pb-3 pt-4 flex-1 transition-all ${
              activeTab === 'navigator'
                ? 'border-primary text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                activeTab === 'navigator' ? 'text-primary' : ''
              }`}
              style={{ fontVariationSettings: activeTab === 'navigator' ? "'FILL' 1" : "'FILL' 0" }}
            >
              calculate
            </span>
            <span className={`text-sm font-bold tracking-wide ${activeTab === 'navigator' ? '' : 'font-medium'}`}>
              智能刷卡導航
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('bankee')}
            className={`flex flex-col items-center justify-center border-b-[3px] gap-2 pb-3 pt-4 flex-1 transition-all ${
              activeTab === 'bankee'
                ? 'border-primary text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                activeTab === 'bankee' ? 'text-primary' : ''
              }`}
              style={{ fontVariationSettings: activeTab === 'bankee' ? "'FILL' 1" : "'FILL' 0" }}
            >
              group
            </span>
            <span className={`text-sm font-bold tracking-wide ${activeTab === 'bankee' ? '' : 'font-medium'}`}>
              Bankee 社群管家
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in zoom-in-95 duration-300">
          {activeTab === 'navigator' ? <ShoppingNavigator /> : <BankeeSimulator />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-surface-dark border-t border-stone-200 dark:border-stone-800 px-6 py-2 flex justify-around items-center z-40 pb-safe">
        <a 
          className="flex flex-col items-center gap-1 p-2 group cursor-pointer w-24" 
          onClick={() => setActiveTab('navigator')}
        >
          <span 
            className={`material-symbols-outlined transition-colors ${activeTab === 'navigator' ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}`}
            style={{ fontVariationSettings: activeTab === 'navigator' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className={`text-[10px] font-medium transition-colors ${activeTab === 'navigator' ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}`}>
            刷卡導航
          </span>
        </a>
        <a 
          className="flex flex-col items-center gap-1 p-2 group cursor-pointer w-24"
          onClick={() => setActiveTab('bankee')}
        >
          <span 
            className={`material-symbols-outlined transition-colors ${activeTab === 'bankee' ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}`}
            style={{ fontVariationSettings: activeTab === 'bankee' ? "'FILL' 1" : "'FILL' 0" }}
          >
            group
          </span>
          <span className={`text-[10px] font-medium transition-colors ${activeTab === 'bankee' ? 'text-primary' : 'text-stone-400 group-hover:text-primary'}`}>
            Bankee
          </span>
        </a>
      </nav>
      
      {/* Safe Area Spacer */}
      <div className="h-[70px]"></div>
    </>
  );
}
