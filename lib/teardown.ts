import { CameraModel, CameraPart, TeardownChapter } from '../types';

export const canonicalizeMeshName = (meshName: string): string =>
  meshName
    .replace(/^#CAM\d+_/, '')
    .replace(/_#CAM\d+_Textures_\d+$/, '');

export const canOpenTeardown = (camera: CameraModel): boolean =>
  camera.availability === 'live' && Boolean(camera.modelUrl && camera.parts?.length);

export const getChapterForProgress = (
  chapters: TeardownChapter[],
  progress: number,
): TeardownChapter => {
  if (chapters.length === 0) {
    throw new Error('At least one teardown chapter is required.');
  }

  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;

  return chapters.reduce((closest, chapter) =>
    Math.abs(chapter.progress - normalizedProgress) <
    Math.abs(closest.progress - normalizedProgress)
      ? chapter
      : closest,
  );
};

export const getExplosionDistance = (progress: number, normalizedScale: number): number => {
  const clampedProgress = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;
  const safeScale = Number.isFinite(normalizedScale) && normalizedScale > 0 ? normalizedScale : 1;
  return ((1.25 * clampedProgress) / 100) / safeScale;
};

export const filterCameras = (cameras: CameraModel[], query: string): CameraModel[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return cameras;

  return cameras.filter((camera) =>
    [
      camera.brand,
      camera.model,
      camera.description.en,
      camera.description.cn,
      camera.techHighlight.en,
      camera.techHighlight.cn,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
};

export const getPartsForChapter = (
  parts: CameraPart[],
  chapter: TeardownChapter,
): CameraPart[] => {
  const partsById = new Map(parts.map((part) => [part.id, part]));
  return chapter.partIds.flatMap((partId) => {
    const part = partsById.get(partId);
    return part ? [part] : [];
  });
};
