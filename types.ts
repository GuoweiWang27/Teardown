export type Language = 'en' | 'cn';

export interface CameraPart {
  id: string;
  name: string;
  name_cn?: string; // Chinese Name
  // If loading a real 3D model, this matches the name of the mesh inside the GLB file
  meshName?: string; 
  // Fallback geometric representation
  type: 'box' | 'cylinder' | 'sphere' | 'group';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  color: string;
  explosionDirection: [number, number, number]; // Vector [x, y, z] for movement
  description?: string;
}

export interface CameraModel {
  id: string;
  brand: string;
  model: string;
  description: string;
  description_cn?: string; // Chinese Description
  techHighlight: string;
  techHighlight_cn?: string; // Chinese Tech Highlight
  // URL to the real .glb/.gltf file (e.g., '/models/hasselblad.glb')
  modelUrl?: string; 
  // Optional: If omitted, the Smart Engine will auto-detect all meshes in the 3D file
  parts?: CameraPart[];
}

export interface AIAnalysisResult {
  standardName: string;
  functionPrinciple: string;
  specifics: string;
  partNumber?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}