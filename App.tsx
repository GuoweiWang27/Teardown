import React, { useState, useEffect } from 'react';
import { CAMERA_MODELS } from './constants';
import { CameraModel, CameraPart, AIAnalysisResult, Language } from './types';
import CameraCanvas from './components/CameraCanvas';
import ExplosionSlider from './components/ExplosionSlider';
import ScaleController from './components/ScaleController';
import InfoPanel from './components/InfoPanel';
import { analyzePart } from './services/geminiService';
import { t } from './translations';

// --- HELPER COMPONENT FOR IMAGES ---
const CameraImage: React.FC<{ camera: CameraModel }> = ({ camera }) => {
  // Try JPG first, then PNG, then placeholder
  const [imgSrc, setImgSrc] = useState<string>(`/images/${camera.id}.jpg`);
  const [triedPng, setTriedPng] = useState(false);

  const handleError = () => {
    if (!triedPng) {
      setTriedPng(true);
      setImgSrc(`/images/${camera.id}.png`);
      return;
    }
    // If local image is missing/broken, fallback to a clean text placeholder
    // Using placehold.co with theme colors: Slate-800 bg, Cyan-400 text
    setImgSrc(`https://placehold.co/800x600/1e293b/22d3ee?text=${encodeURIComponent(camera.model)}&font=roboto`);
  };

  return (
    <div className="h-48 w-full bg-slate-900 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
      <img 
        src={imgSrc} 
        alt={camera.model}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        onError={handleError}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-30 group-hover:opacity-0 transition-opacity pointer-events-none"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraModel | null>(null);
  const [explosionLevel, setExplosionLevel] = useState<number>(0);
  const [modelScale, setModelScale] = useState<number>(1.0);
  const [selectedPart, setSelectedPart] = useState<CameraPart | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<Language>('en');

  // Reset state when camera changes
  useEffect(() => {
    if (selectedCamera) {
      setExplosionLevel(0);
      setModelScale(1.0);
      setSelectedPart(null);
      setAiAnalysis(null);
    }
  }, [selectedCamera]);

  const handlePartSelect = async (part: CameraPart) => {
    if (selectedPart?.id === part.id) return;
    
    setSelectedPart(part);
    setLoadingAI(true);
    setAiAnalysis(null);

    if (selectedCamera) {
      const partName = (lang === 'cn' && part.name_cn) ? part.name_cn : part.name;
      const cameraName = selectedCamera.model;
      
      const result = await analyzePart(cameraName, partName, lang);
      setAiAnalysis(result);
    }
    setLoadingAI(false);
  };

  const closePanel = () => {
    setSelectedPart(null);
    setAiAnalysis(null);
  };

  const filteredCameras = CAMERA_MODELS.filter(cam => 
    cam.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cam.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-slate-900 text-white overflow-hidden relative">
      
      {/* Header / Nav */}
      <header className="absolute top-0 left-0 w-full z-10 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-500 text-3xl">☷</span> 
              {t(lang, 'title')}
            </h1>
            <div className="flex items-center gap-3 ml-9">
              <p className="text-xs text-slate-400 uppercase tracking-widest">{t(lang, 'subtitle')}</p>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest border-l border-slate-700 pl-3">
                by Guowei Wang
              </span>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700 ml-4">
             <button 
               onClick={() => setLang('en')}
               className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
             >
               EN
             </button>
             <button 
               onClick={() => setLang('cn')}
               className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'cn' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
             >
               中
             </button>
          </div>
        </div>
        
        {selectedCamera && (
          <button 
            onClick={() => setSelectedCamera(null)}
            className="pointer-events-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 backdrop-blur border border-slate-600 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t(lang, 'back')}
          </button>
        )}
      </header>

      {/* View Selection */}
      {!selectedCamera ? (
        <div className="w-full h-full overflow-y-auto pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <h2 className="text-3xl font-light mb-2">{t(lang, 'selectModel')}</h2>
                <p className="text-slate-400 max-w-lg">
                  {t(lang, 'selectModelDesc')}
                </p>
              </div>
              <input 
                type="text" 
                placeholder={t(lang, 'searchPlaceholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((camera) => (
                <div 
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className="group bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col"
                >
                  {/* Robust Camera Image Component */}
                  <CameraImage camera={camera} />

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-cyan-500 text-xs font-mono font-bold uppercase tracking-wider">{camera.brand}</span>
                      <h3 className="text-2xl font-bold text-white mb-2">{camera.model}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {(lang === 'cn' && camera.description_cn) ? camera.description_cn : camera.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="inline-block bg-slate-900/50 rounded px-2 py-1 border border-slate-700">
                        <span className="text-xs text-slate-300 font-mono">
                          {t(lang, 'techHighlight')}: {(lang === 'cn' && camera.techHighlight_cn) ? camera.techHighlight_cn : camera.techHighlight}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCameras.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                {t(lang, 'noResults')} "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 3D Lab View */
        <>
          <CameraCanvas 
            model={selectedCamera} 
            explosionLevel={explosionLevel} 
            onPartSelect={handlePartSelect} 
            selectedPartId={selectedPart?.id || null} 
            lang={lang}
            scale={modelScale}
          />
          
          <div className="absolute top-24 left-6 z-10 pointer-events-none">
            <h2 className="text-4xl font-bold text-white/10 select-none uppercase">{selectedCamera.brand}</h2>
            <h2 className="text-6xl font-bold text-white/5 select-none uppercase -mt-4">{selectedCamera.model}</h2>
          </div>

          <ExplosionSlider value={explosionLevel} onChange={setExplosionLevel} lang={lang} />
          
          <ScaleController scale={modelScale} onScaleChange={setModelScale} lang={lang} />
          
          <InfoPanel 
            part={selectedPart} 
            analysis={aiAnalysis} 
            loading={loadingAI} 
            onClose={closePanel} 
            lang={lang}
          />
          
          {/* Help Tooltip */}
          {explosionLevel === 0 && !selectedPart && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-slate-400 text-sm animate-bounce pointer-events-none">
              {t(lang, 'helpTooltip')}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;