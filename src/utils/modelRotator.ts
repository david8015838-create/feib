import { GoogleGenerativeAI } from "@google/generative-ai";

// 支援的模型列表 (包含使用者要求的模型與標準 fallback)
// 注意：部分模型 ID 可能需要根據實際 Google AI Studio 開放狀況調整，這裡盡量包含可能有效的 ID
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-tts",
  "gemma-3-1b",
  "gemma-3-4b",
  "gemma-3-12b",
  "gemma-3-27b"
];

// 使用者要求的模型名稱映射 (若 API 支援別名)
// 這裡實作簡單的輪詢機制
export class ModelRotator {
  private apiKey: string;
  private currentIndex: number = 0;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<string> {
    let lastError: any = null;

    // 嘗試所有候選模型
    for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
      // 輪換邏輯：從 currentIndex 開始嘗試，失敗則換下一個
      const modelIndex = (this.currentIndex + i) % MODEL_CANDIDATES.length;
      const modelName = MODEL_CANDIDATES[modelIndex];

      try {
        console.log(`Trying model: ${modelName}`);
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // 成功後，更新 currentIndex 以便下次優先使用此模型 (或保持輪換，看策略)
        // 這裡策略是：如果成功，下次繼續用這個，失敗才換
        this.currentIndex = modelIndex; 
        
        return text;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
        // 繼續嘗試下一個迴圈
      }
    }

    throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown error"}`);
  }
}
