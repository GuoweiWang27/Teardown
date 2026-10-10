import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { CameraModel, CameraPart, Language } from '../types';
import CameraModel3D from './CameraModel3D';

interface CameraCanvasProps {
  model: CameraModel;
  explosionLevel: number;
  onPartSelect: (part: CameraPart) => void;
  selectedPartId: string | null;
  lang: Language;
}

const CameraCanvas: React.FC<CameraCanvasProps> = ({
  model,
  explosionLevel,
  onPartSelect,
  selectedPartId,
  lang,
}) => (
  <div className="camera-canvas">
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [7, 4.2, 7], fov: 46 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#12110f']} />
      <fog attach="fog" args={['#12110f', 13, 28]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#e7dcc6', '#17120d', 1.1]} />
      <directionalLight position={[6, 8, 4]} intensity={3.2} castShadow />
      <spotLight
        position={[-7, 4, 7]}
        color="#d79b42"
        angle={0.45}
        penumbra={0.8}
        intensity={30}
      />

      <Suspense fallback={null}>
        <CameraModel3D
          model={model}
          explosionLevel={explosionLevel}
          onPartSelect={onPartSelect}
          selectedPartId={selectedPartId}
          lang={lang}
        />
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.42}
          scale={16}
          blur={2.8}
          far={5}
          color="#050403"
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.4}
        maxDistance={24}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI * 0.82}
        target={[0, 0.2, 0]}
      />
    </Canvas>
  </div>
);

export default CameraCanvas;
