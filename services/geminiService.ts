import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePart = async (cameraName: string, partName: string, lang: Language): Promise<AIAnalysisResult> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for text tasks
  
  const langInstruction = lang === 'cn' 
    ? "Provide all responses in Simplified Chinese." 
    : "Provide all responses in English.";

  const systemPrompt = `You are a senior camera repair engineer and historian. 
  Your task is to explain specific camera parts to users who are dismantling them virtually.
  
  NOTE: The user is clicking on 3D mesh objects. The 'partName' might be a raw 3D file name like "Cylinder.005", "Object_12", "Material.001", or "Bolt_M3". 
  You must INTELLIGENTLY GUESS what this part likely is in the context of the camera model: "${cameraName}". 
  If the name is "Lens_Glass", assume it is the lens element. If it's "Cube.022", look at the context or generic probabilities for a camera (e.g., it might be a chassis part or button).
  
  Keep explanations concise, technical but accessible, and fascinating.
  Focus on the mechanical or electronic role of the part.
  ${langInstruction}`;

  const userPrompt = `Analyze the component with the raw 3D name: "${partName}" of the camera "${cameraName}".
  Return the result in strictly valid JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            standardName: {
              type: Type.STRING,
              description: "The inferred official technical name of the part (e.g. 'Shutter Speed Dial' instead of 'Cylinder.005'). Include English name if in Chinese mode.",
            },
            functionPrinciple: {
              type: Type.STRING,
              description: "A concise explanation (2-3 sentences) of what this part does and how it works physically.",
            },
            specifics: {
              type: Type.STRING,
              description: "Specific details about this part in this particular camera model (e.g., material, magnification, historical significance).",
            },
            partNumber: {
              type: Type.STRING,
              description: "A plausible or real OEM part number (e.g., 'CG2-5000'). If unknown, estimate a format like 'GEN-001'.",
            },
          },
          required: ["standardName", "functionPrinciple", "specifics"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("No text response from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      standardName: partName,
      functionPrinciple: lang === 'cn' ? "无法从 AI 获取数据。" : "Error retrieving data from AI Knowledge Engine.",
      specifics: lang === 'cn' ? "请检查网络连接。" : "Please check your network connection or API quota.",
      partNumber: "N/A"
    };
  }
};