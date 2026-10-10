import React, { useMemo, useState } from 'react';
import {
  CANON_AT1_CHAPTERS,
  CANON_AT1_SOURCES,
  CANON_AT1_UNREPRESENTED,
} from '../constants';
import { getChapterForProgress, getPartsForChapter } from '../lib/teardown';
import { CameraModel, CameraPart, Language } from '../types';
import { t } from '../translations';
import CameraCanvas from './CameraCanvas';
import ExplosionSlider from './ExplosionSlider';
import InfoPanel from './InfoPanel';
import TeardownGuide from './TeardownGuide';

interface TeardownLabProps {
  model: CameraModel;
  lang: Language;
}

const TeardownLab: React.FC<TeardownLabProps> = ({ model, lang }) => {
  const [explosionLevel, setExplosionLevel] = useState(0);
  const [selectedPart, setSelectedPart] = useState<CameraPart | null>(null);

  const activeChapter = getChapterForProgress(CANON_AT1_CHAPTERS, explosionLevel);
  const chapterParts = useMemo(() => {
    const parts = model.parts ?? [];
    const mapped = getPartsForChapter(parts, activeChapter);
    return mapped.length > 0 ? mapped : parts;
  }, [activeChapter, model.parts]);

  const selectChapter = (progress: number) => {
    setExplosionLevel(progress);
    setSelectedPart(null);
  };

  const selectPart = (part: CameraPart) => {
    setSelectedPart((current) => (current?.id === part.id ? null : part));
  };

  return (
    <main className="lab-page">
      <TeardownGuide
        chapters={CANON_AT1_CHAPTERS}
        activeChapter={activeChapter}
        unrepresented={CANON_AT1_UNREPRESENTED}
        sources={CANON_AT1_SOURCES}
        lang={lang}
        onSelect={selectChapter}
      />

      <section className="lab-stage" aria-label={`${model.brand} ${model.model} 3D`}>
        <CameraCanvas
          model={model}
          explosionLevel={explosionLevel}
          onPartSelect={selectPart}
          selectedPartId={selectedPart?.id ?? null}
          lang={lang}
        />

        <div className="lab-stage__title" aria-hidden="true">
          <span>{model.brand}</span>
          <strong>{model.model}</strong>
        </div>

        <p className="canvas-help">{t(lang, 'canvasHelp')}</p>

        <div className="part-dock" aria-label={t(lang, 'chapterParts')}>
          <span className="part-dock__label">{t(lang, 'chapterParts')}</span>
          <div className="part-dock__list">
            {chapterParts.map((part) => (
              <button
                key={part.id}
                type="button"
                aria-pressed={selectedPart?.id === part.id}
                onClick={() => selectPart(part)}
              >
                <span aria-hidden="true">{part.meshName.replaceAll('_', ' ')}</span>
                <strong>{part.label[lang]}</strong>
              </button>
            ))}
          </div>
        </div>

        <ExplosionSlider
          value={explosionLevel}
          onChange={setExplosionLevel}
          activeChapter={activeChapter}
          lang={lang}
        />
      </section>

      <InfoPanel part={selectedPart} onClose={() => setSelectedPart(null)} lang={lang} />
    </main>
  );
};

export default TeardownLab;
