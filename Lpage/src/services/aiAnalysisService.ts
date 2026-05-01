import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ErrorInsight {
  explanation: string;
  correction: string;
}

/**
 * Explains a syntax or runtime error using Gemini AI and provides a correction.
 */
export async function explainError(
  code: string,
  language: string,
  error: string
): Promise<ErrorInsight> {
  if (!genAI) {
    return {
      explanation: "Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file to enable AI error insights.",
      correction: ""
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      As an expert programming assistant, analyze the following code and the resulting error.
      
      Language: ${language}
      
      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Error:
      ${error}
      
      Please provide:
      1. A brief, clear explanation of why this error occurred.
      2. A corrected version of the specific code snippet that caused the error.
      
      Return your response in JSON format:
      {
        "explanation": "Your explanation here",
        "correction": "The full corrected code here"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from the response
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const parsed = JSON.parse(jsonStr);
      return {
        explanation: parsed.explanation || "No explanation provided.",
        correction: parsed.correction || ""
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return {
        explanation: "The AI provided a response but it couldn't be parsed. Error: " + text,
        correction: ""
      };
    }
  } catch (err: any) {
    console.error("AI Analysis Error:", err);
    const errorMessage = err?.message || String(err);
    return {
      explanation: `AI Service Error: ${errorMessage}. Please verify your API key is active and your region is supported.`,
      correction: ""
    };
  }
}
