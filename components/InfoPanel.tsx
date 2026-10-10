import React from 'react';
import { CameraPart, Language } from '../types';
import { t } from '../translations';

interface InfoPanelProps {
  part: CameraPart | null;
  onClose: () => void;
  lang: Language;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ part, onClose, lang }) => {
  if (!part) {
    return (
      <aside className="part-panel part-panel--empty">
        <span className="part-panel__crosshair" aria-hidden="true">
          +
        </span>
        <p>{t(lang, 'partPrompt')}</p>
      </aside>
    );
  }

  return (
    <aside className="part-panel part-panel--open" aria-live="polite">
      <button className="part-panel__close" type="button" onClick={onClose} aria-label={t(lang, 'close')}>
        <span aria-hidden="true">×</span>
      </button>

      <header className="part-panel__header">
        <span>{t(lang, 'selectedComponent')}</span>
        <small>{part.meshName}</small>
        <h2>{part.label[lang]}</h2>
        <p>{part.summary[lang]}</p>
      </header>

      <section className="part-panel__section">
        <h3>{t(lang, 'details')}</h3>
        <p>{part.detail[lang]}</p>
      </section>

      <section className="part-panel__section part-panel__section--evidence">
        <h3>{t(lang, 'evidence')}</h3>
        <p>{part.evidence[lang]}</p>
      </section>
    </aside>
  );
};

export default InfoPanel;
