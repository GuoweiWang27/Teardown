import React, { Suspense, useMemo, useState } from 'react';
import { CAMERA_MODELS } from './constants';
import { canOpenTeardown, filterCameras } from './lib/teardown';
import { CameraModel, Language } from './types';
import { t } from './translations';

const TeardownLab = React.lazy(() => import('./components/TeardownLab'));

interface CameraImageProps {
  camera: CameraModel;
}

const CameraImage: React.FC<CameraImageProps> = ({ camera }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="camera-card__image-wrap">
      {failed ? (
        <div className="camera-card__image-fallback" aria-hidden="true">
          <span>{camera.brand.slice(0, 2).toUpperCase()}</span>
          <strong>{camera.model}</strong>
        </div>
      ) : (
        <img
          className="camera-card__image"
          src={camera.imagePath}
          alt={`${camera.brand} ${camera.model}`}
          loading={camera.availability === 'live' ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
      <span className="camera-card__index" aria-hidden="true">
        {String(CAMERA_MODELS.findIndex((item) => item.id === camera.id) + 1).padStart(3, '0')}
      </span>
    </div>
  );
};

interface CameraCardContentProps {
  camera: CameraModel;
  lang: Language;
  live: boolean;
}

const CameraCardContent: React.FC<CameraCardContentProps> = ({ camera, lang, live }) => (
  <>
    <CameraImage camera={camera} />
    <div className="camera-card__body">
      <div className="camera-card__meta">
        <span>{camera.brand}</span>
        <span className={`status-badge ${live ? 'status-badge--live' : ''}`}>
          {t(lang, live ? 'liveBadge' : 'comingBadge')}
        </span>
      </div>
      <h2>{camera.model}</h2>
      <p className="camera-card__description">{camera.description[lang]}</p>
      <div className="camera-card__mechanism">
        <span>{t(lang, 'techHighlight')}</span>
        <strong>{camera.techHighlight[lang]}</strong>
      </div>
      <div className="camera-card__footer">
        <span>{camera.availabilityNote[lang]}</span>
        <strong>{t(lang, live ? 'openTeardown' : 'referenceCard')}</strong>
      </div>
    </div>
  </>
);

const App: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<Language>('cn');

  const filteredCameras = useMemo(
    () => filterCameras(CAMERA_MODELS, searchQuery),
    [searchQuery],
  );

  const openCamera = (camera: CameraModel) => {
    if (canOpenTeardown(camera)) setSelectedCamera(camera);
  };

  return (
    <div className={`site-shell ${selectedCamera ? 'site-shell--lab' : ''}`}>
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-lockup__mark" aria-hidden="true">
            T/
          </span>
          <div>
            <strong>{t(lang, 'title')}</strong>
            <small>{t(lang, 'subtitle')}</small>
          </div>
        </div>

        <div className="site-header__actions">
          <div className="language-toggle" aria-label={lang === 'cn' ? '语言' : 'Language'}>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" aria-pressed={lang === 'cn'} onClick={() => setLang('cn')}>
              中
            </button>
          </div>
          {selectedCamera && (
            <button className="back-button" type="button" onClick={() => setSelectedCamera(null)}>
              <span aria-hidden="true">←</span>
              {t(lang, 'back')}
            </button>
          )}
        </div>
      </header>

      {selectedCamera ? (
        <Suspense
          fallback={
            <main className="lab-loading" aria-live="polite">
              <span className="lab-loading__dial" aria-hidden="true" />
              <p>{t(lang, 'loadingLab')}</p>
            </main>
          }
        >
          <TeardownLab model={selectedCamera} lang={lang} />
        </Suspense>
      ) : (
        <main className="catalog-page">
          <section className="catalog-hero" aria-labelledby="catalog-title">
            <div>
              <p className="catalog-eyebrow">{t(lang, 'catalogEyebrow')}</p>
              <h1 id="catalog-title">
                {lang === 'cn' ? (
                  <>
                    一台真实拆解
                    <br />
                    十一台正在制作
                  </>
                ) : (
                  t(lang, 'selectModel')
                )}
              </h1>
              <p className="catalog-intro">{t(lang, 'selectModelDesc')}</p>
            </div>
            <label className="catalog-search">
              <span>{t(lang, 'searchLabel')}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t(lang, 'searchPlaceholder')}
              />
            </label>
          </section>

          <section className="catalog-grid" aria-label={t(lang, 'selectModel')}>
            {filteredCameras.map((camera) => {
              const live = canOpenTeardown(camera);
              return live ? (
                <button
                  key={camera.id}
                  type="button"
                  className="camera-card camera-card--live"
                  onClick={() => openCamera(camera)}
                  aria-label={`${t(lang, 'openTeardown')}: ${camera.brand} ${camera.model}`}
                >
                  <CameraCardContent camera={camera} lang={lang} live />
                </button>
              ) : (
                <article key={camera.id} className="camera-card camera-card--reference">
                  <CameraCardContent camera={camera} lang={lang} live={false} />
                </article>
              );
            })}
          </section>

          {filteredCameras.length === 0 && (
            <p className="catalog-empty">
              {t(lang, 'noResults')} “{searchQuery}”
            </p>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
