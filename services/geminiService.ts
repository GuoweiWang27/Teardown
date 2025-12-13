import { AIAnalysisResult, Language } from "../types";

// 1. 读取 API Key (使用验证过的兼容逻辑)
const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
const apiKey = 
  (viteEnv as any)?.VITE_VECTORENGINE_API_KEY || 
  (viteEnv as any)?.VECTORENGINE_API_KEY || 
  (typeof process !== 'undefined' && (process.env.VECTORENGINE_API_KEY || process.env.API_KEY)) ||
  '';

if (!apiKey) {
  console.error("🚨 致命错误：未找到 VITE_VECTORENGINE_API_KEY，请检查 Cloudflare 环境变量设置！");
}

// 2. 配置 Vector Engine (使用 HTTPS)
const API_URL = 'https://api.vectorengine.ai/v1/chat/completions';

// 3. 模型名称 (你的分组是 Gemini，使用 1.5-flash 最稳)
const modelId = "gemini-2.5-flash"; 

export const analyzePart = async (cameraName: string, partName: string, lang: Language): Promise<AIAnalysisResult> => {
  
  const langInstruction = lang === 'cn' 
    ? "Provide all responses in Simplified Chinese." 
    : "Provide all responses in English.";

  // 定义期望的 JSON 结构 (因为不用 SDK 了，我们需要在 Prompt 里明确告诉 AI 返回什么结构)
  const jsonSchema = {
    standardName: "The inferred official technical name of the part.",
    functionPrinciple: "A concise explanation (2-3 sentences) of what this part does and how it works physically.",
    specifics: "Specific details about this part in this particular camera model.",
    partNumber: "A plausible or real OEM part number."
  };

  const systemPrompt = `You are a senior camera repair engineer and historian. 
  Your task is to explain specific camera parts to users who are dismantling them virtually.
  
  NOTE: The user is clicking on 3D mesh objects. The 'partName' might be a raw 3D file name like "Cylinder.005" or "Bolt_M3". 
  You must INTELLIGENTLY GUESS what this part likely is in the context of the camera model: "${cameraName}". 
  
  Keep explanations concise, technical but accessible, and fascinating.
  Focus on the mechanical or electronic role of the part.
  ${langInstruction}

  IMPORTANT: You must return strictly valid JSON matching this structure:
  ${JSON.stringify(jsonSchema, null, 2)}`;

  const userPrompt = `Analyze the component with the raw 3D name: "${partName}" of the camera "${cameraName}".`;

  try {
    // 使用原生 fetch 发送请求
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }, // 强制 JSON 模式
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      return JSON.parse(content) as AIAnalysisResult;
    }
    throw new Error("No content in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // 保持你原有的错误回退逻辑
    return {
      standardName: partName,
      functionPrinciple: lang === 'cn' ? "无法从 AI 获取数据。" : "Error retrieving data from AI Knowledge Engine.",
      specifics: lang === 'cn' ? "请检查网络连接。" : "Please check your network connection or API quota.",
      partNumber: "N/A"
    };
  }
};