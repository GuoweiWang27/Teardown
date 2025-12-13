import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import CameraModel3D from './CameraModel3D';
import { CameraModel, CameraPart, Language } from '../types';

interface CameraCanvasProps {
  model: CameraModel;
  explosionLevel: number;
  onPartSelect: (part: CameraPart) => void;
  selectedPartId: string | null;
  lang: Language;
  scale: number;
}

const CameraCanvas: React.FC<CameraCanvasProps> = ({ model, explosionLevel, onPartSelect, selectedPartId, lang, scale }) => {
  return (
    <div className="w-full h-full bg-slate-900 absolute inset-0 z-0">
      {/* Increased FOV to 50 for a slightly wider angle to accommodate exploded parts */}
      <Canvas shadows camera={{ position: [6, 4, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <CameraModel3D 
            model={model} 
            explosionLevel={explosionLevel} 
            onPartSelect={onPartSelect} 
            selectedPartId={selectedPartId}
            lang={lang}
            scale={scale}
          />
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={15} blur={2.5} far={4} />
          
          <OrbitControls 
            makeDefault
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={2}
            // CRITICAL FIX: Increased maxDistance from 15 to 30.
            // When the camera explodes, the model effectively becomes much larger.
            // This allows the user to zoom out far enough to keep all flying parts within the viewport.
            maxDistance={30}
            target={[0, 0, 0]} // Force focus on center
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CameraCanvas;