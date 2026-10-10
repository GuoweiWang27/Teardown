import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceFiles = [
  'App.tsx',
  'translations.ts',
  'vite.config.ts',
  'components/CameraModel3D.tsx',
  'components/InfoPanel.tsx',
  'services/geminiService.ts',
];

const sourceCorpus = sourceFiles
  .map((file) => resolve(process.cwd(), file))
  .filter(existsSync)
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

describe('source truth and security boundary', () => {
  it.each([
    'INTELLIGENTLY GUESS',
    'VITE_VECTORENGINE_API_KEY',
    'process.env.API_KEY',
    'OEM PART NO',
    'ProceduralModel',
    'ProceduralBody',
  ])('does not ship the forbidden source pattern %s', (pattern) => {
    expect(sourceCorpus).not.toContain(pattern);
  });
});
