import { Language } from './types';

export const TRANSLATIONS = {
  en: {
    title: "Teardown.ai",
    subtitle: "Reveal the mechanism.",
    back: "Back to Library",
    selectModel: "Select a Model",
    selectModelDesc: "Explore internal mechanisms of iconic photography equipment. Select a camera to enter the teardown laboratory.",
    searchPlaceholder: "Search models...",
    noResults: "No cameras found matching",
    techHighlight: "Tech Highlight",
    sliderIntegrate: "Integrate",
    sliderDismantle: "Dismantle",
    sliderLevel: "Explosion Level",
    analyzing: "Analyzing structure via Gemini AI...",
    standardDesignation: "Standard Designation",
    functionPrinciple: "Function & Principle",
    modelSpecifics: "Model Specifics",
    oemPartNo: "OEM PART NO.",
    noAnalysis: "No analysis data available.",
    helpTooltip: "Use slider to dismantle · Click parts to analyze",
    selectedComponent: "Selected Component",
    scaleLabel: "Scale"
  },
  cn: {
    title: "拆镜实验室",
    subtitle: "揭示原理",
    back: "返回库",
    selectModel: "选择机型",
    selectModelDesc: "探索经典摄影器材的内部构造。选择一台相机进入拆解实验室。",
    searchPlaceholder: "搜索机型...",
    noResults: "未找到匹配的机型",
    techHighlight: "技术亮点",
    sliderIntegrate: "复原",
    sliderDismantle: "拆解",
    sliderLevel: "拆解程度",
    analyzing: "正在通过 Gemini AI 分析结构...",
    standardDesignation: "标准名称",
    functionPrinciple: "功能原理",
    modelSpecifics: "机型特性",
    oemPartNo: "原厂零件号",
    noAnalysis: "暂无分析数据。",
    helpTooltip: "拖动滑块拆解 · 点击部件进行分析",
    selectedComponent: "选中部件",
    scaleLabel: "缩放"
  }
};

export const t = (lang: Language, key: keyof typeof TRANSLATIONS.en) => {
  return TRANSLATIONS[lang][key];
};