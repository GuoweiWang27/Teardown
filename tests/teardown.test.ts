import { describe, expect, it } from 'vitest';
import { CAMERA_MODELS, CANON_AT1_CHAPTERS } from '../constants';
import {
  canOpenTeardown,
  canonicalizeMeshName,
  getExplosionDistance,
  filterCameras,
  getChapterForProgress,
  getPartsForChapter,
} from '../lib/teardown';

describe('catalog truth boundary', () => {
  it('allows only Canon AT-1 to open the teardown laboratory', () => {
    expect(CAMERA_MODELS.filter(canOpenTeardown).map((camera) => camera.id)).toEqual([
      'canon-at-1',
    ]);
  });

  it('keeps every unavailable camera as a reference card without fake parts', () => {
    const referenceCards = CAMERA_MODELS.filter(
      (camera) => camera.availability === 'coming-soon',
    );

    expect(referenceCards).toHaveLength(11);
    for (const camera of referenceCards) {
      expect(camera.modelUrl).toBeUndefined();
      expect(camera.parts).toBeUndefined();
    }
  });

  it('maps exactly six reviewed meshes for Canon AT-1', () => {
    const canon = CAMERA_MODELS.find((camera) => camera.id === 'canon-at-1');

    expect(canon?.parts?.map((part) => part.meshName)).toEqual([
      'Body',
      'Battery_Check',
      'Spool',
      'Film_Advance',
      'Shutter',
      'Shutter_Speed',
    ]);

    for (const part of canon?.parts ?? []) {
      expect(part.summary.en.length).toBeGreaterThan(20);
      expect(part.summary.cn.length).toBeGreaterThan(10);
      expect(part.explosionDirection).toHaveLength(3);
    }
  });

  it('normalizes Sketchfab export names without conflating shutter controls', () => {
    expect(
      canonicalizeMeshName('#CAM0001_Shutter_#CAM0001_Textures_0'),
    ).toBe('Shutter');
    expect(
      canonicalizeMeshName('#CAM0001_Shutter_Speed_#CAM0001_Textures_0'),
    ).toBe('Shutter_Speed');
    expect(canonicalizeMeshName('Body')).toBe('Body');
  });
});

describe('guided teardown progress', () => {
  it('covers an ordered zero-to-one-hundred journey', () => {
    expect(CANON_AT1_CHAPTERS.map((chapter) => chapter.progress)).toEqual([
      0,
      32,
      66,
      100,
    ]);
  });

  it.each([
    [0, 'assembled'],
    [31, 'controls'],
    [65, 'film-path'],
    [100, 'service-boundary'],
  ] as const)('maps %i percent to %s', (progress, id) => {
    expect(getChapterForProgress(CANON_AT1_CHAPTERS, progress).id).toBe(id);
  });

  it('keeps the maximum visual separation inside the camera viewport', () => {
    expect(getExplosionDistance(0, 0.5)).toBe(0);
    expect(getExplosionDistance(32, 1)).toBeCloseTo(0.4);
    expect(getExplosionDistance(100, 1)).toBe(1.25);
    expect(getExplosionDistance(140, 1)).toBe(1.25);
  });
});

describe('catalog and guide interactions', () => {
  it('searches brand, model, and localized technical content', () => {
    expect(filterCameras(CAMERA_MODELS, 'canon').map((camera) => camera.id)).toEqual([
      'canon-at-1',
      'canon-5d4',
      'canon-ae1',
    ]);
    expect(filterCameras(CAMERA_MODELS, '指针').map((camera) => camera.id)).toEqual([
      'canon-at-1',
    ]);
    expect(filterCameras(CAMERA_MODELS, '  ').map((camera) => camera.id)).toHaveLength(12);
  });

  it('returns only reviewed parts named by the active chapter', () => {
    const canon = CAMERA_MODELS.find((camera) => camera.id === 'canon-at-1');
    const controls = CANON_AT1_CHAPTERS.find((chapter) => chapter.id === 'controls');

    expect(getPartsForChapter(canon?.parts ?? [], controls!).map((part) => part.id)).toEqual([
      'battery-check',
      'film-advance',
      'shutter-release',
      'shutter-speed',
    ]);
  });
});
