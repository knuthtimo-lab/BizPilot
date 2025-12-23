
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Invoice, JobPosting, Subscription } from "../types";

// Always create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractInvoiceData = async (base64Data: string, mimeType: string): Promise<Partial<Invoice>> => {
  const ai = getAI();
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: cleanBase64 } },
          { text: "Extract invoice details: vendor name, total amount, currency (ISO), date (YYYY-MM-DD), and a logical expense category. If it's a multi-page document, use the summary from the first page or total totals." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["vendorName", "amount", "currency", "date", "category"]
        }
      }
    });
    // response.text is a property, not a method.
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini API Error in extractInvoiceData:", error);
    throw error;
  }
};

export const generateJobDescription = async (title: string, seniority: string, skills: string[], companyInfo: string): Promise<Partial<JobPosting>> => {
  const ai = getAI();
  const prompt = `Create a professional job description for a ${seniority} ${title}. 
  CRITICAL REQUIREMENT: In the 'About Us' section, strictly use the information provided here: "${companyInfo}". Do not invent a generic history. If this field contains specific details like "for dipers" or "startup in Berlin", include them exactly.
  Required skills: ${skills.join(', ')}. 
  Structure: 'About Us', 'Responsibilities', 'Requirements', and 'Benefits'. 
  Also generate 5 relevant interview questions for this role based on the seniority.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING, description: "The full Markdown formatted job description" },
          interviewQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["content", "interviewQuestions"]
      }
    }
  });

  // response.text is a property, not a method.
  const text = response.text || "{}";
  return JSON.parse(text.trim());
};

export const analyzeSpendings = async (invoices: Invoice[]): Promise<any> => {
  const ai = getAI();
  const prompt = `Analyze these business expenses and identify potential savings or duplicate subscriptions. 
  Expenses: ${JSON.stringify(invoices)}. 
  Return a list of identified risks or saving opportunities. Make actions specific (e.g., 'Switch to Annual', 'Negotiate Lease').`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            reason: { type: Type.STRING },
            estimatedSaving: { type: Type.NUMBER },
            action: { type: Type.STRING }
          },
          required: ["vendorName", "reason", "estimatedSaving", "action"]
        }
      }
    }
  });

  // response.text is a property, not a method.
  const text = response.text || "[]";
  return JSON.parse(text.trim());
};

export const identifySubscriptions = async (invoices: Invoice[]): Promise<Partial<Subscription>[]> => {
  const ai = getAI();
  const prompt = `Review this list of invoices and identify which ones represent recurring monthly or yearly subscriptions. 
  Group them by vendor. Determine the typical monthly cost and estimate the next renewal date based on the latest invoice date + 30 days.
  Invoices: ${JSON.stringify(invoices)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            monthlyCost: { type: Type.NUMBER },
            renewalDate: { type: Type.STRING, description: "Estimated next billing date YYYY-MM-DD" },
            isFlagged: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Reason why it might be a saving area, if any." }
          },
          required: ["vendorName", "monthlyCost", "renewalDate", "isFlagged"]
        }
      }
    }
  });

  // response.text is a property, not a method.
  const text = response.text || "[]";
  return JSON.parse(text.trim());
};
