
import { GoogleGenAI } from "@google/genai";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    // Correct initialization using process.env.API_KEY directly in a named parameter
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateServiceDescription(serviceName: string): Promise<string> {
    try {
      // Correct usage of generateContent with model and contents parameters
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Napiš krátký, profesionální a lákavý popis pro službu autoservisu s názvem: ${serviceName}. Popis by měl mít cca 20 slov a být v češtině.`,
      });
      // response.text is a getter, not a method
      return response.text || "Popis se nepodařilo vygenerovat.";
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "Chyba při generování popisu.";
    }
  }

  async generateSeoText(topic: string): Promise<string> {
    try {
      // Correct usage of generateContent with model and contents parameters
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Napiš jeden odstavec SEO textu pro web autoservisu na téma: ${topic}. Zaměř se na důvěryhodnost a profesionalitu. Česky.`,
      });
      // response.text is a getter, not a method
      return response.text || "Text se nepodařilo vygenerovat.";
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "Chyba při generování SEO textu.";
    }
  }
}
