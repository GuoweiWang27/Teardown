import React from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface ScaleControllerProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  lang: Language;
}

const ScaleController: React.FC<ScaleControllerProps> = ({ scale, onScaleChange, lang }) => {
  const handleDecrease = () => {
    const newScale = Math.max(0.5, scale - 0.1);
    onScaleChange(newScale);
  };

  const handleIncrease = () => {
    const newScale = Math.min(2.0, scale + 0.1);
    onScaleChange(newScale);
  };

  return (
    <div className="absolute bottom-8 right-6 z-20">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecrease}
            disabled={scale <= 0.5}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 rounded-lg text-cyan-400 text-xl font-bold transition-colors"
          >
            −
          </button>
          
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1">
              {t(lang, 'scaleLabel')}
            </span>
            <span className="text-cyan-400 font-bold text-sm font-mono">
              {Math.round(scale * 100)}%
            </span>
          </div>
          
          <button
            onClick={handleIncrease}
            disabled={scale >= 2.0}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 rounded-lg text-cyan-400 text-xl font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScaleController;

