export type Language = 'en' | 'cn';

export type LocalizedText = {
  en: string;
  cn: string;
};

export type CameraAvailability = 'live' | 'coming-soon';

export interface CameraPart {
  id: string;
  meshName: string;
  label: LocalizedText;
  summary: LocalizedText;
  detail: LocalizedText;
  evidence: LocalizedText;
  explosionDirection: [number, number, number];
}

export interface CameraAttribution {
  label: string;
  url: string;
  license: string;
}

export interface CameraModel {
  id: string;
  brand: string;
  model: string;
  description: LocalizedText;
  techHighlight: LocalizedText;
  availability: CameraAvailability;
  availabilityNote: LocalizedText;
  imagePath: string;
  modelUrl?: string;
  parts?: CameraPart[];
  attribution?: CameraAttribution;
}

export interface TeardownChapter {
  id: string;
  progress: number;
  title: LocalizedText;
  kicker: LocalizedText;
  description: LocalizedText;
  representedIn3D: boolean;
  partIds: string[];
}

export interface ReferenceSource {
  label: LocalizedText;
  url: string;
  kind: 'model' | 'service-reference';
}
