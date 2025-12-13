import React from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface ExplosionSliderProps {
  value: number;
  onChange: (val: number) => void;
  lang: Language;
}

const ExplosionSlider: React.FC<ExplosionSliderProps> = ({ value, onChange, lang }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 z-20">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono uppercase tracking-widest">
          <span>{t(lang, 'sliderIntegrate')}</span>
          <span className="text-cyan-400 font-bold">{t(lang, 'sliderLevel')}: {Math.round(value)}%</span>
          <span>{t(lang, 'sliderDismantle')}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
        />
        <div className="flex justify-between mt-2 px-1">
          <div className="w-0.5 h-2 bg-slate-600"></div>
          <div className="w-0.5 h-2 bg-slate-600"></div>
          <div className="w-0.5 h-2 bg-slate-600"></div>
        </div>
      </div>
    </div>
  );
};

export default ExplosionSlider;