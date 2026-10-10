import React from 'react';
import {
  Language,
  LocalizedText,
  ReferenceSource,
  TeardownChapter,
} from '../types';
import { t } from '../translations';

interface TeardownGuideProps {
  chapters: TeardownChapter[];
  activeChapter: TeardownChapter;
  unrepresented: LocalizedText[];
  sources: ReferenceSource[];
  lang: Language;
  onSelect: (progress: number) => void;
}

const TeardownGuide: React.FC<TeardownGuideProps> = ({
  chapters,
  activeChapter,
  unrepresented,
  sources,
  lang,
  onSelect,
}) => (
  <aside className="lab-guide">
    <div className="lab-guide__heading">
      <span>CANON AT-1 / FILE 001</span>
      <h1>{activeChapter.title[lang]}</h1>
      <p>{activeChapter.description[lang]}</p>
      <strong
        className={`representation-tag ${
          activeChapter.representedIn3D ? 'representation-tag--real' : ''
        }`}
      >
        {t(lang, activeChapter.representedIn3D ? 'representationReal' : 'representationGuide')}
      </strong>
    </div>

    <nav className="chapter-rail" aria-label={lang === 'cn' ? '拆解章节' : 'Teardown chapters'}>
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          type="button"
          className="chapter-tab"
          aria-pressed={chapter.id === activeChapter.id}
          onClick={() => onSelect(chapter.progress)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>
            <small>{chapter.kicker[lang]}</small>
            <strong>{chapter.title[lang]}</strong>
          </span>
          <output>{chapter.progress}%</output>
        </button>
      ))}
    </nav>

    <section className="boundary-card">
      <h2>{t(lang, 'notRepresented')}</h2>
      <p>{t(lang, 'modelBoundary')}</p>
      <ol>
        {unrepresented.map((item, index) => (
          <li key={item.en}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item[lang]}
          </li>
        ))}
      </ol>
    </section>

    <section className="source-list">
      <h2>{t(lang, 'sources')}</h2>
      {sources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
          <span>{source.kind === 'model' ? '3D' : 'DOC'}</span>
          {source.label[lang]}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </section>
  </aside>
);

export default TeardownGuide;
