import React from 'react';
import { Language, TeardownChapter } from '../types';
import { t } from '../translations';

interface ExplosionSliderProps {
  value: number;
  onChange: (value: number) => void;
  activeChapter: TeardownChapter;
  lang: Language;
}

const ExplosionSlider: React.FC<ExplosionSliderProps> = ({
  value,
  onChange,
  activeChapter,
  lang,
}) => (
  <div className="explosion-control">
    <div className="explosion-control__header">
      <label htmlFor="teardown-position">{t(lang, 'sliderLevel')}</label>
      <strong>{activeChapter.title[lang]}</strong>
      <output htmlFor="teardown-position">{Math.round(value)}%</output>
    </div>
    <input
      id="teardown-position"
      type="range"
      min="0"
      max="100"
      step="1"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      aria-valuetext={`${activeChapter.title[lang]} · ${Math.round(value)}%`}
    />
    <div className="explosion-control__ends" aria-hidden="true">
      <span>{t(lang, 'sliderIntegrate')}</span>
      <span>{t(lang, 'sliderDismantle')}</span>
    </div>
  </div>
);

export default ExplosionSlider;
