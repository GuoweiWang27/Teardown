import React, { ErrorInfo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { canonicalizeMeshName, getExplosionDistance } from '../lib/teardown';
import { CameraModel, CameraPart, Language } from '../types';
import { t } from '../translations';

interface CameraModel3DProps {
  model: CameraModel;
  explosionLevel: number;
  onPartSelect: (part: CameraPart) => void;
  selectedPartId: string | null;
  lang: Language;
}

interface ModelErrorBoundaryProps {
  children: ReactNode;
  lang: Language;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends React.Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Verified 3D asset load failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ModelLoadError lang={this.props.lang} />;
    }
    return this.props.children;
  }
}

const ModelLoadError: React.FC<{ lang: Language }> = ({ lang }) => (
  <Html center zIndexRange={[20, 0]}>
    <div className="model-error-card" role="alert">
      <span aria-hidden="true">!</span>
      <strong>{t(lang, 'loadFailed')}</strong>
      <p>{t(lang, 'loadFailedDesc')}</p>
    </div>
  </Html>
);

interface MaterialState {
  material: THREE.Material;
  originalOpacity: number;
  originalTransparent: boolean;
  originalEmissive?: THREE.Color;
  originalEmissiveIntensity?: number;
}

interface AnimatedMesh {
  mesh: THREE.Mesh;
  part: CameraPart;
  originalPosition: THREE.Vector3;
  direction: THREE.Vector3;
  materials: MaterialState[];
}

const cloneMeshMaterials = (mesh: THREE.Mesh): MaterialState[] => {
  const cloned = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((material) =>
    material.clone(),
  );
  mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];

  return cloned.map((material) => {
    const shaded = material as THREE.MeshStandardMaterial;
    return {
      material,
      originalOpacity: material.opacity,
      originalTransparent: material.transparent,
      originalEmissive: shaded.emissive?.clone(),
      originalEmissiveIntensity: shaded.emissiveIntensity,
    };
  });
};

interface VerifiedGLTFModelProps extends CameraModel3DProps {
  url: string;
}

const VerifiedGLTFModel: React.FC<VerifiedGLTFModelProps> = ({
  model,
  explosionLevel,
  onPartSelect,
  selectedPartId,
  url,
}) => {
  const { scene } = useGLTF(url);
  const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null);
  const animatedMeshes = useRef<AnimatedMesh[]>([]);

  const partByMeshName = useMemo(
    () => new Map((model.parts ?? []).map((part) => [part.meshName, part])),
    [model.parts],
  );

  const preparedScene = useMemo(() => {
    const clonedScene = scene.clone(true);
    const entries: AnimatedMesh[] = [];

    clonedScene.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh;
      const materials = cloneMeshMaterials(mesh);
      const part = partByMeshName.get(canonicalizeMeshName(mesh.name));

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (part) {
        entries.push({
          mesh,
          part,
          originalPosition: mesh.position.clone(),
          direction: new THREE.Vector3(...part.explosionDirection),
          materials,
        });
      }
    });

    clonedScene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const normalizedScale = maxDimension > 0 ? 5 / maxDimension : 1;

    animatedMeshes.current = entries;
    return {
      object: clonedScene,
      normalizedScale,
      centerOffset: [
        -center.x * normalizedScale,
        -center.y * normalizedScale,
        -center.z * normalizedScale,
      ] as [number, number, number],
    };
  }, [partByMeshName, scene]);

  useEffect(
    () => () => {
      document.body.style.cursor = '';
    },
    [],
  );

  useFrame(() => {
    const distance = getExplosionDistance(explosionLevel, preparedScene.normalizedScale);

    for (const entry of animatedMeshes.current) {
      entry.mesh.position.copy(entry.originalPosition).addScaledVector(entry.direction, distance);

      const selected = entry.part.id === selectedPartId;
      const hovered = entry.part.meshName === hoveredMeshName;
      const dimmed = Boolean(selectedPartId && !selected);

      for (const state of entry.materials) {
        const shaded = state.material as THREE.MeshStandardMaterial;
        if (shaded.emissive) {
          if (selected) shaded.emissive.set('#d64a2f');
          else if (hovered) shaded.emissive.set('#d79b42');
          else if (state.originalEmissive) shaded.emissive.copy(state.originalEmissive);

          shaded.emissiveIntensity = selected
            ? 0.36
            : hovered
              ? 0.18
              : (state.originalEmissiveIntensity ?? 0);
        }
        state.material.opacity = dimmed ? 0.28 : state.originalOpacity;
        state.material.transparent = dimmed || state.originalTransparent;
      }
    }
  });

  const partFromEvent = (event: ThreeEvent<PointerEvent>): CameraPart | undefined =>
    partByMeshName.get(canonicalizeMeshName(event.object.name));

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const part = partByMeshName.get(canonicalizeMeshName(event.object.name));
    if (!part) return;
    event.stopPropagation();
    onPartSelect(part);
  };

  return (
    <group
      onClick={handleClick}
      onPointerOver={(event) => {
        const part = partFromEvent(event);
        if (!part) return;
        event.stopPropagation();
        setHoveredMeshName(part.meshName);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredMeshName(null);
        document.body.style.cursor = '';
      }}
    >
      <group position={preparedScene.centerOffset}>
        <primitive
          object={preparedScene.object}
          scale={[
            preparedScene.normalizedScale,
            preparedScene.normalizedScale,
            preparedScene.normalizedScale,
          ]}
        />
      </group>
    </group>
  );
};

const CameraModel3D: React.FC<CameraModel3DProps> = (props) => {
  if (!props.model.modelUrl) return <ModelLoadError lang={props.lang} />;

  return (
    <ModelErrorBoundary lang={props.lang}>
      <VerifiedGLTFModel {...props} url={props.model.modelUrl} />
    </ModelErrorBoundary>
  );
};

export default CameraModel3D;
