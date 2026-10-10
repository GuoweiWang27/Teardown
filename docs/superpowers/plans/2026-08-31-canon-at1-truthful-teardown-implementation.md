# Canon AT-1 Truthful Teardown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace eleven fake procedural teardown experiences with honest coming-soon reference cards and turn Canon AT-1 into a deterministic, source-bounded, mobile-usable guided teardown.

**Architecture:** Keep catalog metadata and Canon content as typed local data, gate navigation through one pure availability function, and lazy-load the Three.js laboratory only for the live model. The laboratory renders only real GLB meshes; a separate guided structure map explains verified mechanisms that are not represented in 3D.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, React Three Fiber, Drei, Three.js, Vitest, semantic CSS, Playwright CLI.

**Permission boundary:** Work in the current clean checkout with the user's implementation authorization. Do not commit, push, deploy, purchase assets, or redistribute service-manual pages.

---

## File map

- Modify `types.ts`: localized content, availability, attribution, real mesh parts, and teardown chapters.
- Replace `constants.ts`: twelve reference cards, one live Canon model, six curated real-mesh mappings, four guided chapters, and source links.
- Create `lib/teardown.ts`: pure availability and progress-to-chapter functions.
- Create `tests/teardown.test.ts`: truth boundary, availability, mesh mapping, and chapter mapping tests.
- Modify `App.tsx`: semantic catalog and lazy laboratory entry.
- Create `components/TeardownLab.tsx`: laboratory layout and state orchestration.
- Create `components/TeardownGuide.tsx`: accessible chapter navigation and mechanism boundary map.
- Modify `components/CameraCanvas.tsx`: real-model-only canvas and honest load state.
- Rewrite `components/CameraModel3D.tsx`: cached deterministic mesh animation with no procedural fallback.
- Modify `components/ExplosionSlider.tsx`: chapter-aware responsive control.
- Rewrite `components/InfoPanel.tsx`: static curated part knowledge and source boundary.
- Delete `components/ScaleController.tsx`: OrbitControls already owns zoom and the component overlaps mobile controls.
- Delete `services/geminiService.ts`: remove unavailable and unverifiable runtime AI guessing.
- Create `index.css`: complete workshop-archive design and responsive layout.
- Modify `index.tsx`: import the stylesheet.
- Modify `index.html`: remove Tailwind CDN/import map and add metadata.
- Modify `vite.config.ts`: remove client secret injection and split Three.js vendor code.
- Modify `package.json` and `package-lock.json`: remove unused `@google/genai`, add Vitest, and add `test`/`typecheck` scripts.

### Task 1: Establish executable truth-boundary tests

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/teardown.test.ts`

- [x] **Step 1: Install the test runner without changing production dependencies**

Run:

```bash
npm uninstall @google/genai
npm install --save-dev vitest@^3.2.4
```

Expected: `@google/genai` disappears from `dependencies`; Vitest appears in `devDependencies`.

- [x] **Step 2: Add scripts**

Add to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "build": "vite build",
  "build:cloudflare": "node scripts/exclude-large-files.js && vite build && node scripts/exclude-large-files.js",
  "preview": "vite preview"
}
```

- [x] **Step 3: Write tests against the desired public data API**

Create `tests/teardown.test.ts` with this exact initial content:

```ts
import { describe, expect, it } from 'vitest';
import { CAMERA_MODELS, CANON_AT1_CHAPTERS } from '../constants';
import { canOpenTeardown, getChapterForProgress } from '../lib/teardown';

describe('catalog truth boundary', () => {
  it('allows only Canon AT-1 to open the teardown laboratory', () => {
    expect(CAMERA_MODELS.filter(canOpenTeardown).map(camera => camera.id))
      .toEqual(['canon-at-1']);
  });

  it('keeps every unavailable camera as a reference card without fake parts', () => {
    for (const camera of CAMERA_MODELS.filter(camera => camera.availability === 'coming-soon')) {
      expect(camera.modelUrl).toBeUndefined();
      expect(camera.parts).toBeUndefined();
    }
  });

  it('maps exactly six reviewed meshes for Canon AT-1', () => {
    const canon = CAMERA_MODELS.find(camera => camera.id === 'canon-at-1');
    expect(canon?.parts?.map(part => part.meshName)).toEqual([
      'Body', 'Battery_Check', 'Spool', 'Film_Advance', 'Shutter', 'Shutter_Speed'
    ]);
    for (const part of canon?.parts ?? []) {
      expect(part.summary.en.length).toBeGreaterThan(20);
      expect(part.summary.cn.length).toBeGreaterThan(10);
      expect(part.explosionDirection).toHaveLength(3);
    }
  });
});

describe('guided teardown progress', () => {
  it('covers an ordered zero-to-one-hundred journey', () => {
    expect(CANON_AT1_CHAPTERS.map(chapter => chapter.progress)).toEqual([0, 32, 66, 100]);
  });

  it.each([[0, 'assembled'], [31, 'controls'], [65, 'film-path'], [100, 'service-boundary']] as const)(
    'maps %i percent to %s',
    (progress, id) => expect(getChapterForProgress(CANON_AT1_CHAPTERS, progress).id).toBe(id)
  );
});
```

- [x] **Step 4: Run RED and confirm the failure is caused by missing availability APIs**

Run: `npm test`

Expected: FAIL because `lib/teardown.ts`, `availability`, `CANON_AT1_CHAPTERS`, and the new part shape do not exist yet.

### Task 2: Replace fake teardown data with a typed content model

**Files:**
- Modify: `types.ts`
- Replace: `constants.ts`
- Create: `lib/teardown.ts`
- Test: `tests/teardown.test.ts`

- [x] **Step 1: Define the data contracts**

Replace the legacy procedural types in `types.ts` with these exact public shapes:

```ts
export type Language = 'en' | 'cn';
export type LocalizedText = { en: string; cn: string };
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
  attribution?: { label: string; url: string; license: string };
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
```

- [x] **Step 2: Rebuild catalog constants**

Use this exact catalog roster. Copy each existing bilingual description and highlight verbatim into the new localized shape; do not synthesize new camera specifications.

| id | brand | model | imagePath | availability |
| --- | --- | --- | --- | --- |
| `canon-at-1` | Canon | AT-1 | `/images/canon-at-1.png` | `live` |
| `hasselblad-500cm` | Hasselblad | 500cm | `/images/hasselblad-500cm.png` | `coming-soon` |
| `leica-m6` | Leica | M6 | `/images/leica-m6.png` | `coming-soon` |
| `canon-5d4` | Canon | EOS 5D Mark IV | `/images/canon-5d4.png` | `coming-soon` |
| `sx-70` | Polaroid | SX-70 | `/images/sx-70.png` | `coming-soon` |
| `sony-a7iv` | Sony | A7 IV | `/images/sony-a7iv.png` | `coming-soon` |
| `sony-a7v` | Sony | A7 V | `/images/sony-a7v.png` | `coming-soon` |
| `rolleiflex` | Rolleiflex | 2.8F | `/images/rolleiflex.png` | `coming-soon` |
| `nikon-z9` | Nikon | Z9 | `/images/nikon-z9.png` | `coming-soon` |
| `fuji-x100vi` | Fujifilm | X100VI | `/images/fuji-x100vi.png` | `coming-soon` |
| `gopro-12` | GoPro | Hero 12 | `/images/gopro-12.png` | `coming-soon` |
| `canon-ae1` | Canon | AE-1 | `/images/canon-ae1.png` | `coming-soon` |

Give only `canon-at-1` these fields:

```ts
availability: 'live',
modelUrl: 'https://pub-f8d77afad3c343f4b5854e8f73932d50.r2.dev/canon-at-1.glb',
parts: CANON_AT1_PARTS,
attribution: {
  label: 'Canon AT-1 Retro Camera by AleixoAlonso',
  url: 'https://sketchfab.com/3d-models/canon-at-1-retro-camera-9de66868d0f240e985da00c9480bfc82',
  license: 'CC BY 4.0'
}
```

Give every other camera `availability: 'coming-soon'` and no `modelUrl` or `parts`. Delete all procedural box/cylinder arrays.

- [x] **Step 3: Implement pure gating and chapter lookup**

Create `lib/teardown.ts`:

```ts
import { CameraModel, TeardownChapter } from '../types';

export const canOpenTeardown = (camera: CameraModel): boolean =>
  camera.availability === 'live' && Boolean(camera.modelUrl && camera.parts?.length);

export const getChapterForProgress = (
  chapters: TeardownChapter[],
  progress: number,
): TeardownChapter => {
  if (chapters.length === 0) throw new Error('At least one teardown chapter is required.');
  const clamped = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;
  return chapters.reduce((closest, chapter) =>
    Math.abs(chapter.progress - clamped) < Math.abs(closest.progress - clamped)
      ? chapter
      : closest,
  );
};
```

- [x] **Step 4: Run GREEN**

Run: `npm test`

Expected: all truth-boundary and chapter mapping tests pass.

### Task 3: Build the honest catalog and guided laboratory shell

**Files:**
- Modify: `App.tsx`
- Create: `components/TeardownLab.tsx`
- Create: `components/TeardownGuide.tsx`
- Modify: `components/ExplosionSlider.tsx`
- Modify: `components/InfoPanel.tsx`
- Modify: `translations.ts`

- [x] **Step 1: Add a failing source-boundary test**

Extend `tests/teardown.test.ts` to assert that all chapter labels and availability notes exist in both languages, and that no part data exposes a `partNumber` field.

Run: `npm test`  
Expected: FAIL until constants and UI-facing content are complete.

- [x] **Step 2: Make catalog navigation status-aware**

In `App.tsx`, call `canOpenTeardown(camera)` before setting selection. Render live entries as `<button type="button">` and unavailable entries as `<article>` with a visible coming-soon badge. Load the lab with:

```ts
const TeardownLab = React.lazy(() => import('./components/TeardownLab'));
```

- [x] **Step 3: Orchestrate the laboratory without network AI state**

`TeardownLab.tsx` owns only:

```ts
const [explosionLevel, setExplosionLevel] = useState(0);
const [selectedPart, setSelectedPart] = useState<CameraPart | null>(null);
const activeChapter = getChapterForProgress(CANON_AT1_CHAPTERS, explosionLevel);
```

Chapter selection sets the exact chapter progress. Part selection reads the local `CameraPart` content and never performs fetch.

- [x] **Step 4: Make the guide accessible and explicit about representation**

`TeardownGuide.tsx` uses this interaction contract: each chapter is a real button, `aria-pressed` reflects the active chapter, and clicking emits the exact chapter progress. Beneath the active description, render the five-item boundary list `mirror box`, `focal-plane shutter curtains`, `metering unit`, `film counter`, and `wiring` with localized labels. Use `representedIn3D` to render exactly one of `真实 3D 分件 / Real 3D meshes` and `结构导览 / Structure guide`.

```tsx
<nav className="chapter-rail" aria-label={lang === 'cn' ? '拆解章节' : 'Teardown chapters'}>
  {chapters.map((chapter, index) => (
    <button
      key={chapter.id}
      type="button"
      className="chapter-tab"
      aria-pressed={chapter.id === activeChapter.id}
      onClick={() => onSelect(chapter.progress)}
    >
      <span>{String(index + 1).padStart(2, '0')}</span>
      <strong>{chapter.title[lang]}</strong>
    </button>
  ))}
</nav>
```

- [x] **Step 5: Replace the AI panel with local reviewed content**

`InfoPanel.tsx` receives `{ part, onClose, lang }`, displays localized `label`, `summary`, `detail`, and `evidence`, and removes loading, model-specific AI prose, and OEM-number UI.

- [x] **Step 6: Run GREEN and typecheck**

Run:

```bash
npm test
npm run typecheck
```

Expected: tests pass and TypeScript reports no errors.

### Task 4: Make the real GLB deterministic and remove block fallbacks

**Files:**
- Rewrite: `components/CameraModel3D.tsx`
- Modify: `components/CameraCanvas.tsx`
- Delete: `components/ScaleController.tsx`
- Delete: `services/geminiService.ts`

- [x] **Step 1: Add a failing mesh-mapping test**

Assert that the Canon part mapping has unique `meshName` values and finite explosion direction numbers.

Run: `npm test`  
Expected: FAIL if uniqueness/finite validation helpers are absent or data is invalid.

- [x] **Step 2: Cache real mesh animation state once**

During GLTF initialization, build an array of this exact shape:

```ts
type AnimatedMesh = {
  mesh: THREE.Mesh;
  part: CameraPart;
  originalPosition: THREE.Vector3;
  direction: THREE.Vector3;
};
```

Clone each mesh material once, then in `useFrame` loop over that array and reuse one scratch vector. Never call `scene.traverse`, `new THREE.Color`, or `.clone()` inside the frame loop.

Use this frame-loop contract:

```ts
const scratch = useMemo(() => new THREE.Vector3(), []);

useFrame(() => {
  const distance = (4 * explosionLevel) / 100 / normalizedScale;
  for (const entry of animatedMeshes.current) {
    scratch.copy(entry.direction).multiplyScalar(distance).add(entry.originalPosition);
    entry.mesh.position.copy(scratch);
    const selected = entry.part.id === selectedPartId;
    const hovered = entry.part.meshName === hoveredMeshName;
    const material = entry.mesh.material as THREE.MeshStandardMaterial;
    material.emissive.set(selected ? '#d64a2f' : hovered ? '#d79b42' : '#000000');
    material.emissiveIntensity = selected ? 0.36 : hovered ? 0.18 : 0;
    material.opacity = selectedPartId && !selected ? 0.28 : 1;
    material.transparent = Boolean(selectedPartId && !selected);
  }
});
```

- [x] **Step 3: Remove random and procedural representations**

Only mapped meshes move. Clicking unmapped geometry does nothing. Replace `ProceduralModel`, `ProceduralBody`, `ProceduralLens`, and the fallback grid with an HTML load-error card stating that the verified 3D asset could not load.

- [x] **Step 4: Remove the duplicate scale control**

Delete `ScaleController.tsx` and its state/props. Retain OrbitControls pinch/wheel zoom with sensible `minDistance` and `maxDistance`.

- [x] **Step 5: Run GREEN, typecheck, and build**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: all commands exit 0 and no missing `/index.css` warning appears after Task 5.

### Task 5: Ship the workshop-archive visual system and close the client-secret path

**Files:**
- Create: `index.css`
- Modify: `index.tsx`
- Modify: `index.html`
- Modify: `vite.config.ts`
- Modify: `App.tsx`
- Modify: `components/TeardownLab.tsx`
- Modify: `components/TeardownGuide.tsx`
- Modify: `components/ExplosionSlider.tsx`
- Modify: `components/InfoPanel.tsx`

- [x] **Step 1: Write a static boundary check**

Add a test or verification command that fails when source files contain `VITE_VECTORENGINE_API_KEY`, `process.env.API_KEY`, `OEM PART NO`, or `INTELLIGENTLY GUESS`.

Run the check before deletion to record RED.

- [x] **Step 2: Implement semantic CSS**

Start `index.css` with this exact visual token and reset layer, then implement the named semantic classes used by the components (`site-shell`, `site-header`, `catalog-*`, `lab-*`, `chapter-*`, `explosion-*`, `part-*`, `source-*`, and `status-*`) using CSS Grid/Flex rather than DOM measurement:

```css
:root {
  color-scheme: dark;
  --bench: #12110f;
  --bench-raised: #1b1916;
  --paper: #e7dcc6;
  --paper-muted: #a99f8d;
  --signal: #d64a2f;
  --brass: #d79b42;
  --rule: rgba(231, 220, 198, 0.18);
  --safe-top: max(16px, env(safe-area-inset-top));
  --safe-bottom: max(16px, env(safe-area-inset-bottom));
  font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  background: var(--bench);
  color: var(--paper);
}

* { box-sizing: border-box; }
html, body, #root { width: 100%; min-height: 100%; margin: 0; }
button, input { font: inherit; }
button:focus-visible, input:focus-visible, a:focus-visible {
  outline: 2px solid var(--brass);
  outline-offset: 3px;
}
```

Add `@media (max-width: 720px)` rules that:

- keep header controls within `env(safe-area-inset-*)`;
- turn chapter navigation into a horizontal scroller;
- place the slider above the bottom safe area;
- make the part panel a maximum-height bottom sheet;
- remove decorative copy that competes with the 3D viewport.

- [x] **Step 3: Remove CDN and secret injection**

Import `./index.css` from `index.tsx`. Remove Tailwind CDN, import map, and missing stylesheet ambiguity from `index.html`. Remove `loadEnv` and all `define` API-key mappings from `vite.config.ts`.

- [x] **Step 4: Add production metadata and source attribution**

Set title, description, theme color, and canonical viewport behavior in `index.html`. Render the CC BY 4.0 model credit and repair-guide links in the lab UI.

- [x] **Step 5: Run the boundary check GREEN**

Run:

```bash
rg -n "VITE_VECTORENGINE_API_KEY|process\.env\.API_KEY|OEM PART NO|INTELLIGENTLY GUESS" . \
  --glob '!docs/**' --glob '!node_modules/**' --glob '!dist/**'
```

Expected: no matches, exit code 1.

### Task 6: Verify behavior on desktop and mobile

**Files:**
- No production edits unless a verified QA failure requires a new RED/GREEN cycle.
- Browser artifacts: `output/playwright/`

- [x] **Step 1: Run the full local verification suite**

```bash
npm test
npm run typecheck
npm run build
npm audit --omit=dev
```

Expected: tests/typecheck/build exit 0; production audit reports zero high-severity issues.

- [x] **Step 2: Start a production preview**

Run: `npm run preview -- --host 127.0.0.1 --port 4173`

Expected: preview listens at `http://127.0.0.1:4173`.

- [x] **Step 3: Verify the catalog at 1440×900**

Check that Canon is the only active teardown button, all eleven other cameras display coming-soon status, search works, keyboard focus is visible, and no console error appears.

- [x] **Step 4: Verify the laboratory at 1440×900**

Open Canon, switch all four chapters, drag the slider, select parts from both 3D and the accessible list, close the panel, follow the attribution link target, and return to the catalog.

- [x] **Step 5: Verify 390×844 mobile behavior**

Check that the back button is fully visible, chapter controls horizontally scroll, the slider does not overlap any control, pinch/drag space remains usable, and the part bottom sheet can close without trapping the page.

- [x] **Step 6: Inspect diff and permission boundary**

Run:

```bash
git status --short
git diff --check
git diff --stat
```

Expected: only Teardown files and the two design/plan documents changed; no commit, push, or deployment performed.
