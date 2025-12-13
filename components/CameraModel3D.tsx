import React, { useRef, useState, useMemo, useEffect, ReactNode, ErrorInfo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, RoundedBox, useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { CameraModel, CameraPart, Language } from '../types';

interface CameraModel3DProps {
  model: CameraModel;
  explosionLevel: number;
  onPartSelect: (part: CameraPart) => void;
  selectedPartId: string | null;
  lang: Language;
  scale: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  modelName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// --- ERROR BOUNDARY ---
// Catches errors in the 3D loader so the whole app doesn't crash (white screen)
class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Model Load Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          {this.props.fallback}
          <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
            <div className="bg-red-900/90 border border-red-500 text-white p-3 rounded shadow-xl backdrop-blur-md w-64 text-center">
              <div className="text-red-300 font-bold mb-1 text-sm">⚠ Load Failed</div>
              <div className="text-[10px] text-red-100 mb-2 break-all">
                Could not load file for {this.props.modelName}.
              </div>
              <div className="text-[10px] text-slate-400 bg-black/30 p-1 rounded">
                Check path in constants.ts
              </div>
              <div className="text-[10px] text-cyan-300 mt-2">
                Showing procedural fallback.
              </div>
            </div>
          </Html>
        </group>
      );
    }
    return this.props.children;
  }
}

// --- MATERIALS ---
const MATERIALS = {
  body: new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.9,
    metalness: 0.1,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: '#d4d4d8',
    roughness: 0.3,
    metalness: 1.0,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    thickness: 1.5,
    ior: 1.5,
    clearcoat: 1,
  }),
  sensor: new THREE.MeshStandardMaterial({
    color: '#10b981',
    roughness: 0.3,
    metalness: 0.8,
    emissive: '#064e3b',
    emissiveIntensity: 0.2,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    roughness: 0.2,
    metalness: 1.0,
  }),
  leather: new THREE.MeshStandardMaterial({
    color: '#111',
    roughness: 0.8,
    normalScale: new THREE.Vector2(1, 1),
  })
};

// --- REAL GLTF RENDERING (SMART ENGINE) ---
const RealGLTFModel: React.FC<CameraModel3DProps & { url: string }> = ({ model, explosionLevel, onPartSelect, selectedPartId, url, lang, scale }) => {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Safe access to parts
  const modelParts = useMemo(() => model.parts || [], [model.parts]);
  
  const meshData = useRef<Map<string, { 
    originalPos: THREE.Vector3, 
    explosionDir: THREE.Vector3,
    isManualPart: boolean 
  }>>(new Map());

  const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null);
  const [modelScale, setModelScale] = useState<number>(1);

  useEffect(() => {
    // Robust cleanup to avoid memory leaks if component unmounts quickly
    return () => {
      // Optional cleanup
    };
  }, []);

  // Initialization: Analyze the model structure AND Normalization
  useEffect(() => {
    try {
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 5; 
      // Calculate scale to make the largest dimension exactly 5 units
      const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;
      setModelScale(scaleFactor);

      clonedScene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          // Check if this mesh matches a manually defined part
          const manualPart = modelParts.find(p => p.meshName === mesh.name);
          const originalPos = mesh.position.clone();
          let explosionDir = new THREE.Vector3(0,0,0);

          if (manualPart) {
            explosionDir.set(...manualPart.explosionDirection);
          } else {
            // AUTOMATIC MODE: Calculate direction from center outwards
            if (mesh.geometry) {
               mesh.geometry.computeBoundingBox();
               const meshCenter = new THREE.Vector3();
               mesh.geometry.boundingBox?.getCenter(meshCenter);
               meshCenter.applyMatrix4(mesh.matrix);
               
               // Calculate vector from model center to mesh center
               const dir = new THREE.Vector3().subVectors(meshCenter, center).normalize();
               
               // Add some randomness to make it look organic
               dir.x += (Math.random() - 0.5) * 0.3;
               dir.y += (Math.random() - 0.5) * 0.3;
               dir.z += (Math.random() - 0.5) * 0.3;
               dir.z *= 2.5; // Bias towards Z axis (front/back) usually looks better for cameras
               
               explosionDir.copy(dir);
            }
          }

          meshData.current.set(mesh.uuid, {
            originalPos,
            explosionDir,
            isManualPart: !!manualPart
          });
          
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
               const mat = mesh.material as THREE.MeshStandardMaterial;
               mat.envMapIntensity = 1;
               mat.needsUpdate = true;
          }
        }
      });
    } catch (e) {
      console.error("Error processing GLTF scene:", e);
    }
  }, [clonedScene, modelParts]);

  useFrame(() => {
    const factor = explosionLevel / 100;
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const data = meshData.current.get(obj.uuid);
        if (data) {
          // Dynamic Distance Math:
          // We multiply by (1 / modelScale) to ensure the visual explosion distance 
          // is consistent regardless of whether the original model was 1 meter or 1 millimeter.
          const dynamicDist = (1 / modelScale) * 4 * factor;
          obj.position.copy(data.originalPos).add(data.explosionDir.clone().multiplyScalar(dynamicDist));

          let isSelected = false;
          if (data.isManualPart) {
             const part = modelParts.find(p => p.meshName === obj.name);
             if (part && part.id === selectedPartId) isSelected = true;
          } else {
             if (selectedPartId === obj.name) isSelected = true;
          }

          const isHovered = hoveredMeshName === obj.name;
          const isAnySelected = !!selectedPartId;
          const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
          
          if (isSelected) {
            mat.emissive = new THREE.Color('#06b6d4');
            mat.emissiveIntensity = 0.5;
          } else if (isHovered && !isSelected) {
            mat.emissive = new THREE.Color('#22d3ee');
            mat.emissiveIntensity = 0.2;
          } else {
            mat.emissive = new THREE.Color(0,0,0);
          }
          
          if (isAnySelected && !isSelected) {
            mat.transparent = true;
            mat.opacity = 0.2;
          } else {
            mat.transparent = false;
            mat.opacity = 1;
          }
        }
      }
    });
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    const hitObject = e.object as THREE.Mesh;
    const manualPart = modelParts.find(p => p.meshName === hitObject.name);
    
    if (manualPart) {
      onPartSelect(manualPart);
    } else {
      // AUTO-GENERATED PART DATA
      const autoPart: CameraPart = {
        id: hitObject.name,
        name: hitObject.name,
        name_cn: hitObject.name,
        type: 'box',
        position: [0,0,0],
        scale: [1,1,1],
        color: '#fff',
        explosionDirection: [0,0,0]
      };
      onPartSelect(autoPart);
    }
  };

  return (
    <group 
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredMeshName(e.object.name);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredMeshName(null);
      }}
    >
      {/* 
        Center component ensures the model is visually centered in the scene 
        regardless of its internal origin point. 
        'top' places the bottom of the bounding box on the ground plane (y=0).
      */}
      <Center top>
        <primitive object={clonedScene} scale={[modelScale * scale, modelScale * scale, modelScale * scale]} />
      </Center>
    </group>
  );
};

// --- PROCEDURAL FALLBACK COMPONENTS ---
const ProceduralLens: React.FC<{ color: string; scale: [number, number, number] }> = ({ color, scale }) => (
  <group scale={new THREE.Vector3(...scale)}>
    <Cylinder args={[1, 1, 1, 32]} material={MATERIALS.body} />
    <Cylinder args={[1.02, 1.02, 0.1, 32]} position={[0, 0.4, 0]} material={MATERIALS.metal} />
    <mesh position={[0, 0.45, 0]} scale={[0.8, 0.2, 0.8]}>
      <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <primitive object={MATERIALS.glass} />
    </mesh>
  </group>
);

const ProceduralBody: React.FC<{ color: string; scale: [number, number, number]; isMetal?: boolean }> = ({ color, scale, isMetal }) => (
  <group scale={new THREE.Vector3(...scale)}>
    <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>
      <primitive object={isMetal ? MATERIALS.metal : MATERIALS.leather} />
    </RoundedBox>
    {[[-0.4, 0.4, 0.5], [0.4, 0.4, 0.5], [-0.4, -0.4, 0.5], [0.4, -0.4, 0.5]].map((pos, i) => (
      <mesh key={i} position={new THREE.Vector3(...pos)} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>
    ))}
  </group>
);

const HighFidelityPart: React.FC<{ part: CameraPart; explosionLevel: number; isSelected: boolean; isAnySelected: boolean; onClick: (e: any) => void; lang: Language }> = ({ part, explosionLevel, isSelected, isAnySelected, onClick, lang }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      const factor = explosionLevel / 100;
      meshRef.current.position.set(
        part.position[0] + (part.explosionDirection[0] * factor),
        part.position[1] + (part.explosionDirection[1] * factor),
        part.position[2] + (part.explosionDirection[2] * factor)
      );
    }
  });

  const displayName = lang === 'cn' && part.name_cn ? part.name_cn : part.name;
  const nameLower = part.name.toLowerCase();
  
  let RenderComponent;
  if (nameLower.includes('lens') || part.type === 'cylinder') RenderComponent = <ProceduralLens color={part.color} scale={[1,1,1]} />;
  else if (nameLower.includes('sensor')) RenderComponent = <Box args={[1, 1, 0.1]}><primitive object={MATERIALS.sensor} /></Box>;
  else if (nameLower.includes('mirror') || nameLower.includes('prism')) RenderComponent = <Box args={[1, 1, 1]}><meshPhysicalMaterial color="#fff" metalness={1} roughness={0} clearcoat={1} transparent opacity={0.7}/></Box>;
  else if (nameLower.includes('gold') || nameLower.includes('brass')) RenderComponent = <ProceduralBody color="#fbbf24" scale={[1,1,1]} isMetal={true} />;
  else RenderComponent = <ProceduralBody color={part.color} scale={[1,1,1]} isMetal={false} />;

  return (
    <group 
      ref={meshRef} 
      rotation={part.rotation ? new THREE.Euler(...part.rotation) : new THREE.Euler(0,0,0)}
      scale={new THREE.Vector3(...part.scale)}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group>
        {RenderComponent}
        {isSelected && (
          <mesh scale={[1.05, 1.05, 1.05]}>
             {part.type === 'cylinder' ? <cylinderGeometry args={[1,1,1,32]}/> : <boxGeometry args={[1,1,1]}/>}
             <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} side={THREE.BackSide} />
          </mesh>
        )}
      </group>
      {hovered && !isSelected && explosionLevel > 10 && (
         <Html distanceFactor={10}>
           <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-cyan-500/50 shadow-xl backdrop-blur-sm whitespace-nowrap z-50">
             {displayName}
           </div>
         </Html>
      )}
    </group>
  );
};

// Extracted for reuse as fallback
const ProceduralModel: React.FC<CameraModel3DProps> = ({ model, explosionLevel, onPartSelect, selectedPartId, lang, scale }) => {
  const modelParts = model.parts || [];
  return (
    <group scale={[scale, scale, scale]}>
      {modelParts.map((part) => (
        <HighFidelityPart
          key={part.id}
          part={part}
          explosionLevel={explosionLevel}
          isSelected={selectedPartId === part.id}
          isAnySelected={!!selectedPartId}
          onClick={() => onPartSelect(part)}
          lang={lang}
        />
      ))}
      {/* Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
        <gridHelper args={[50, 50, 0x334155, 0x1e293b]} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]} />
      </mesh>
    </group>
  );
};

// --- MAIN EXPORT ---
const CameraModel3D: React.FC<CameraModel3DProps> = (props) => {
  // Check if the current model has a valid URL
  if (props.model.modelUrl) {
    return (
      <ModelErrorBoundary 
        modelName={props.model.model} 
        fallback={<ProceduralModel {...props} />}
      >
        <RealGLTFModel {...props} url={props.model.modelUrl} />
      </ModelErrorBoundary>
    );
  }

  return <ProceduralModel {...props} />;
};

export default CameraModel3D;