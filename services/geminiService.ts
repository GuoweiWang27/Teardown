import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult, Language } from "../types";

// 1. 读取 API Key (确保是 string)
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || "";

if (!apiKey) {
  console.error("🚨 致命错误：未找到 VITE_GEMINI_API_KEY，请检查 Cloudflare 环境变量设置！");
}

// 2. 初始化 SDK
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzePart = async (cameraName: string, partName: string, lang: Language): Promise<AIAnalysisResult> => {
  const modelId = "gemini-2.5-flash"; 
  
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
        // ✅ 核心修复：直接使用字符串定义类型，不再依赖 import 导入
        responseSchema: {
          type: "OBJECT",
          properties: {
            standardName: {
              type: "STRING",
              description: "The inferred official technical name of the part.",
            },
            functionPrinciple: {
              type: "STRING",
              description: "A concise explanation (2-3 sentences) of what this part does and how it works physically.",
            },
            specifics: {
              type: "STRING",
              description: "Specific details about this part in this particular camera model.",
            },
            partNumber: {
              type: "STRING",
              description: "A plausible or real OEM part number.",
            },
          },
          required: ["standardName", "functionPrinciple", "specifics"],
        },
      },
    });

    // ✅ 这里的 text() 必须有括号
    // response.text 是一个 getter 属性，不是方法
    const text = response.text;
    if (text) {
      return JSON.parse(text) as AIAnalysisResult;
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