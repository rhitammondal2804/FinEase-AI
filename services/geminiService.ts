import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FinancialAnalysis, StressLevel, FinancialInput } from "../types";

const SYSTEM_INSTRUCTION = `
You are a Financial Stress Detection AI designed to analyze personal spending behavior and identify early signs of financial stress using behavioral analytics.

Your role:
• Analyze transaction-level spending data over time
• Detect anomalies, behavioral shifts, and risk patterns
• Quantify financial stress using an interpretable score (0-100)
• Provide empathetic, non-judgmental insights and preventive guidance
• Act as a financial wellness assistant, not a banking system

Tone:
Calm, empathetic, analytical, supportive. You are a preventive financial wellness assistant.

Tasks:
1) Spending Pattern Analysis: Identify trends, discretionary vs essential spending.
2) Financial Stress Detection: Detect signs like sudden discretionary increases, rapid balance decline, impulse behavior.
3) Stress Scoring: 0-30 (Stable), 31-60 (Mild), 61-80 (High), 81-100 (Critical).
4) Alerts: Short, empathetic alerts.
5) Guidance: Practical, low-effort suggestions.

Output:
You must return a JSON object that matches the provided schema perfectly.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "Financial Stress Score from 0 to 100",
    },
    level: {
      type: Type.STRING,
      enum: ["Stable", "Mild", "High", "Critical"],
      description: "Stress Level Classification",
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Bullet list of detected patterns and observations",
    },
    recentChanges: {
      type: Type.STRING,
      description: "Short comparison vs previous behavior",
    },
    importance: {
      type: Type.STRING,
      description: "Brief behavioral explanation of why this matters",
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 concise, supportive suggestions",
    },
    analyzedTransactions: {
      type: Type.ARRAY,
      description: "A normalized list of transactions extracted from the input for visualization purposes.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
          amount: { type: Type.NUMBER, description: "Transaction amount" },
          category: { type: Type.STRING, description: "Category of expense" },
          type: { 
            type: Type.STRING, 
            enum: ["discretionary", "essential"],
            description: "Classification of the expense"
          }
        },
        required: ["date", "amount", "category", "type"]
      }
    }
  },
  required: ["score", "level", "observations", "recentChanges", "importance", "recommendations", "analyzedTransactions"],
};

export const analyzeFinancialData = async (input: FinancialInput): Promise<FinancialAnalysis> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const modelId = "gemini-3-flash-preview"; 
    
    let contentPart: any[] = [];
    
    if (input.type === 'text') {
      contentPart = [{ text: `Analyze the following transaction data:\n\n${input.content}` }];
    } else {
      contentPart = [
        { text: "Analyze the financial data in the attached file (image or PDF). Extract transactions and identify stress patterns." },
        { 
          inlineData: { 
            mimeType: input.mimeType, 
            data: input.data 
          } 
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contentPart,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as FinancialAnalysis;
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze financial data. Please ensure the input is valid and try again.");
  }
};