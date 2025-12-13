import React from 'react';
import { AIAnalysisResult, CameraPart, Language } from '../types';
import { t } from '../translations';

interface InfoPanelProps {
  part: CameraPart | null;
  analysis: AIAnalysisResult | null;
  loading: boolean;
  onClose: () => void;
  lang: Language;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ part, analysis, loading, onClose, lang }) => {
  if (!part) return null;

  const displayName = lang === 'cn' && part.name_cn ? part.name_cn : part.name;

  return (
    <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 z-30">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-mono text-cyan-500 tracking-widest uppercase mb-1">{t(lang, 'selectedComponent')}</h2>
          <h1 className="text-2xl font-bold text-white leading-tight">{displayName}</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">{t(lang, 'analyzing')}</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-xs font-mono text-slate-400 uppercase mb-2">{t(lang, 'standardDesignation')}</h3>
              <p className="text-lg font-medium text-cyan-100">{analysis.standardName}</p>
            </div>

            <div>
              <h3 className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t(lang, 'functionPrinciple')}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">{analysis.functionPrinciple}</p>
            </div>

            <div>
              <h3 className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t(lang, 'modelSpecifics')}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm bg-slate-800/30 p-3 rounded border-l-2 border-purple-500">
                {analysis.specifics}
              </p>
            </div>

            {analysis.partNumber && (
              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-mono">{t(lang, 'oemPartNo')}</span>
                  <span className="font-mono text-sm text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900">
                    {analysis.partNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic">{t(lang, 'noAnalysis')}</p>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;