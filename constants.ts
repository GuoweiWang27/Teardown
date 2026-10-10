import {
  CameraModel,
  CameraPart,
  LocalizedText,
  ReferenceSource,
  TeardownChapter,
} from './types';

const text = (en: string, cn: string): LocalizedText => ({ en, cn });

const COMING_SOON_NOTE = text(
  'Reference card · teardown asset under review',
  '资料卡 · 拆解资产审核中',
);

export const CANON_AT1_PARTS: CameraPart[] = [
  {
    id: 'body',
    meshName: 'Body',
    label: text('Body shell', '机身外壳'),
    summary: text(
      'The main exterior reference shell establishes the camera body, lens mount, and film-chamber proportions.',
      '主外壳用于建立机身、镜头卡口和胶片仓的整体比例关系。',
    ),
    detail: text(
      'This mesh remains the visual anchor while the mapped controls move away from it. The mirror box, shutter curtains, metering mechanism, and wiring are not separate geometry inside this asset.',
      '拆解时它作为视觉锚点，其余已映射操控件从机身分离。当前资产没有把反光镜箱、快门帘、测光机构和线路做成独立几何体。',
    ),
    evidence: text(
      'Directly mapped to the GLB mesh named “Body”; not a repair-grade internal CAD assembly.',
      '直接映射 GLB 中名为“Body”的 mesh；不是维修级内部 CAD 总成。',
    ),
    explosionDirection: [0, 0, 0],
  },
  {
    id: 'battery-check',
    meshName: 'Battery_Check',
    label: text('Battery-check control', '电池检测控制件'),
    summary: text(
      'This exterior control belongs to the camera’s battery-check interaction rather than the internal meter circuit itself.',
      '这是相机电池检测操作对应的外部控制件，并不等同于内部测光电路。',
    ),
    detail: text(
      'The AT-1 relies on battery power for metering. The 3D asset separates the exterior control, but it does not expose the switch contacts, meter electronics, or wiring behind it.',
      'AT-1 的测光依赖电池供电。3D 资产分离了外部控制件，但没有呈现其后的开关触点、测光电子单元或线路。',
    ),
    evidence: text(
      'Mapped to the source mesh “Battery_Check”; internal electrical construction is described, not modelled.',
      '映射源模型 mesh“Battery_Check”；内部电气结构仅作说明，没有建模。',
    ),
    explosionDirection: [1.25, -0.25, 0.6],
  },
  {
    id: 'spool',
    meshName: 'Spool',
    label: text('Film spool mesh', '胶片卷轴分件'),
    summary: text(
      'The spool-side mesh marks one endpoint of the 35 mm film path through the camera body.',
      '卷轴侧分件标出了 35 mm 胶片穿过机身时的一端位置。',
    ),
    detail: text(
      'A service teardown also distinguishes the winding shaft, sprocket, clutch, and torque-related parts. Those mechanisms are not separately represented by this single mesh.',
      '维修拆解还会区分卷片轴、链轮、离合机构和扭矩相关零件；这些机构没有被这个单一 mesh 分别呈现。',
    ),
    evidence: text(
      'Mapped to the source mesh “Spool”; treated as a location cue, not a complete transport assembly.',
      '映射源模型 mesh“Spool”；只作为位置线索，不把它宣称为完整输片总成。',
    ),
    explosionDirection: [-1.55, 0.15, -0.35],
  },
  {
    id: 'film-advance',
    meshName: 'Film_Advance',
    label: text('Film-advance control', '过片控制件'),
    summary: text(
      'The film-advance control transfers the user’s winding action toward the transport and shutter-cocking mechanisms.',
      '过片控制件把用户的卷片动作传递给输片与快门上弦机构。',
    ),
    detail: text(
      'Only the visible control is separated here. The gears, shaft, film counter coupling, and shutter-cocking linkage remain outside the model’s available geometry.',
      '这里仅分离可见控制件；齿轮、轴、计数器联动和快门上弦连杆并不在现有模型几何体中。',
    ),
    evidence: text(
      'Mapped to the source mesh “Film_Advance”; mechanism scope follows the repair-guide terminology.',
      '映射源模型 mesh“Film_Advance”；机构范围按维修资料术语说明。',
    ),
    explosionDirection: [1.15, 1.35, -0.2],
  },
  {
    id: 'shutter-release',
    meshName: 'Shutter',
    label: text('Shutter-release control mesh', '快门释放控制分件'),
    summary: text(
      'This mapped exterior control initiates the release sequence; it is not the focal-plane shutter curtain assembly.',
      '这个已映射的外部控制件用于启动释放过程，并不是焦平面快门帘总成。',
    ),
    detail: text(
      'The distinction matters: the service mechanism continues through internal levers and a shutter unit that the current GLB does not expose.',
      '必须区分两者：维修结构还包含内部连杆和快门单元，而当前 GLB 没有把它们展开。',
    ),
    evidence: text(
      'The source mesh is named “Shutter”; the safer label limits the claim to the visible release control.',
      '源 mesh 名为“Shutter”；为避免误导，这里只把它标为可见的快门释放控制件。',
    ),
    explosionDirection: [0.45, 1.7, 0.75],
  },
  {
    id: 'shutter-speed',
    meshName: 'Shutter_Speed',
    label: text('Shutter-speed control', '快门速度控制件'),
    summary: text(
      'The shutter-speed control selects the timing setting presented to the camera’s mechanical and electrical release system.',
      '快门速度控制件选择送入相机机械与电气释放系统的计时档位。',
    ),
    detail: text(
      'The separated mesh shows the external dial-level control only. Detents, contacts, timing electronics, and the shutter unit remain part of the unrepresented service structure.',
      '分离 mesh 只呈现外部拨盘层级；定位机构、触点、计时电子单元和快门总成仍属于未呈现的维修结构。',
    ),
    evidence: text(
      'Directly mapped to the GLB mesh “Shutter_Speed”; no OEM part number is inferred.',
      '直接映射 GLB mesh“Shutter_Speed”；不推测原厂零件号。',
    ),
    explosionDirection: [-0.85, 1.55, 0.5],
  },
];

export const CANON_AT1_CHAPTERS: TeardownChapter[] = [
  {
    id: 'assembled',
    progress: 0,
    title: text('Assembled reference', '整机基准'),
    kicker: text('01 · Exterior baseline', '01 · 外观基准'),
    description: text(
      'Start with the verified exterior asset. Rotate the camera to understand the body, controls, mount, and film-chamber proportions before separating anything.',
      '先从已核验的外观资产开始。旋转机身，理解外壳、操控件、卡口和胶片仓的比例，再进入分离步骤。',
    ),
    representedIn3D: true,
    partIds: ['body'],
  },
  {
    id: 'controls',
    progress: 32,
    title: text('External controls', '外部操控'),
    kicker: text('02 · Real mapped meshes', '02 · 真实映射分件'),
    description: text(
      'Separate the controls that genuinely exist as individual meshes: battery check, film advance, shutter release, and shutter-speed control.',
      '分离模型中确实独立存在的控制件：电池检测、过片、快门释放和快门速度控制。',
    ),
    representedIn3D: true,
    partIds: ['battery-check', 'film-advance', 'shutter-release', 'shutter-speed'],
  },
  {
    id: 'film-path',
    progress: 66,
    title: text('Film transport path', '胶片输送路径'),
    kicker: text('03 · Structure guide', '03 · 结构导览'),
    description: text(
      'Use the spool mesh as a location cue, then follow the documented relationship between winding shaft, sprocket, film counter, and shutter cocking. These internals are not separate 3D geometry.',
      '以卷轴 mesh 作为位置线索，再理解卷片轴、链轮、计数器与快门上弦之间的关系。这些内部机构并不是独立 3D 几何体。',
    ),
    representedIn3D: false,
    partIds: ['spool', 'film-advance', 'body'],
  },
  {
    id: 'service-boundary',
    progress: 100,
    title: text('Service boundary', '维修边界'),
    kicker: text('04 · What is not modelled', '04 · 模型未呈现内容'),
    description: text(
      'The available meshes are now fully separated. Continue with the structure map to see which service assemblies require a future measured model instead of invented geometry.',
      '现有 mesh 已全部展开。继续查看结构地图，明确哪些维修总成需要未来实测建模，而不能用虚构几何体替代。',
    ),
    representedIn3D: false,
    partIds: [],
  },
];

export const CANON_AT1_UNREPRESENTED = [
  text('Mirror box mechanism', '反光镜箱机构'),
  text('Focal-plane shutter curtains and timing unit', '焦平面快门帘与计时单元'),
  text('Match-needle metering and electrical unit', '指针重合测光与电气单元'),
  text('Film counter, winding shaft, sprocket, and clutch', '胶片计数器、卷片轴、链轮与离合机构'),
  text('Internal contacts, levers, springs, and wiring', '内部触点、连杆、弹簧与线路'),
];

export const CANON_AT1_SOURCES: ReferenceSource[] = [
  {
    label: text('3D model by AleixoAlonso · CC BY 4.0', '3D 模型：AleixoAlonso · CC BY 4.0'),
    url: 'https://sketchfab.com/3d-models/canon-at-1-retro-camera-9de66868d0f240e985da00c9480bfc82',
    kind: 'model',
  },
  {
    label: text('Canon AT-1 repair-guide index', 'Canon AT-1 维修资料目录'),
    url: 'https://www.manualslib.com/manual/4389883/Canon-At-1.html',
    kind: 'service-reference',
  },
  {
    label: text('Genuine Canon service-manual listing', 'Canon 原厂维修手册信息页'),
    url: 'https://uscamera.com/product/canon-at-1-service-manual/',
    kind: 'service-reference',
  },
];

export const CAMERA_MODELS: CameraModel[] = [
  {
    id: 'canon-at-1',
    brand: 'Canon',
    model: 'AT-1',
    description: text(
      'The simplified match-needle version of the AE-1.',
      'AE-1 的指针式测光简化版本。',
    ),
    techHighlight: text('Match-needle metering, FD mount', '指针重合测光，FD 卡口'),
    availability: 'live',
    availabilityNote: text('Reviewed 3D teardown · 6 mapped meshes', '已审核 3D 拆解 · 6 个映射分件'),
    imagePath: '/images/canon-at-1.png',
    modelUrl: 'https://pub-f8d77afad3c343f4b5854e8f73932d50.r2.dev/canon-at-1.glb',
    parts: CANON_AT1_PARTS,
    attribution: {
      label: 'Canon AT-1 Retro Camera by AleixoAlonso',
      url: 'https://sketchfab.com/3d-models/canon-at-1-retro-camera-9de66868d0f240e985da00c9480bfc82',
      license: 'CC BY 4.0',
    },
  },
  {
    id: 'hasselblad-500cm',
    brand: 'Hasselblad',
    model: '500cm',
    description: text('The legendary modular medium-format camera.', '传奇的模块化中画幅相机。'),
    techHighlight: text('Modular design, leaf shutter', '模块化设计，镜间快门'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/hasselblad-500cm.png',
  },
  {
    id: 'leica-m6',
    brand: 'Leica',
    model: 'M6',
    description: text(
      'The classic rangefinder used by street photographers.',
      '街头摄影师钟爱的经典旁轴相机。',
    ),
    techHighlight: text('Rangefinder mechanism, cloth shutter', '黄斑测距，布帘快门'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/leica-m6.png',
  },
  {
    id: 'canon-5d4',
    brand: 'Canon',
    model: 'EOS 5D Mark IV',
    description: text('The workhorse DSLR for professionals.', '专业摄影师的单反主力机型。'),
    techHighlight: text('Pentaprism, mirror box, full-frame CMOS', '五棱镜，反光镜箱，全画幅 CMOS'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/canon-5d4.png',
  },
  {
    id: 'sx-70',
    brand: 'Polaroid',
    model: 'SX-70',
    description: text('A masterpiece of foldable engineering.', '可折叠工程学的杰作。'),
    techHighlight: text('Foldable optical path, Fresnel mirror', '折叠光路，菲涅尔反射镜'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/sx-70.png',
  },
  {
    id: 'sony-a7iv',
    brand: 'Sony',
    model: 'A7 IV',
    description: text('Modern hybrid mirrorless standard.', '现代混合微单的标准。'),
    techHighlight: text('IBIS mechanism, stacked logic board', '五轴防抖，堆叠主板'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/sony-a7iv.png',
  },
  {
    id: 'sony-a7v',
    brand: 'Sony',
    model: 'A7 V',
    description: text(
      'A full-frame hybrid all-rounder built around a partially stacked sensor and integrated AI processing.',
      '采用部分堆栈式传感器与集成 AI 处理的全画幅混合全能机型。',
    ),
    techHighlight: text(
      'Partially stacked CMOS, BIONZ XR2, 7.5-stop IBIS',
      '部分堆栈式 CMOS，BIONZ XR2，7.5 档五轴防抖',
    ),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/sony-a7v.png',
  },
  {
    id: 'rolleiflex',
    brand: 'Rolleiflex',
    model: '2.8F',
    description: text('The iconic twin-lens reflex camera.', '标志性的双反相机。'),
    techHighlight: text('Twin-lens path, waist-level finder', '双镜头光路，腰平取景'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/rolleiflex.png',
  },
  {
    id: 'nikon-z9',
    brand: 'Nikon',
    model: 'Z9',
    description: text(
      'Flagship mirrorless camera without a mechanical shutter.',
      '取消机械快门的旗舰微单。',
    ),
    techHighlight: text('Sensor shield, stacked sensor', '传感器防护盾，堆栈式传感器'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/nikon-z9.png',
  },
  {
    id: 'fuji-x100vi',
    brand: 'Fujifilm',
    model: 'X100VI',
    description: text(
      'Premium compact camera with a hybrid viewfinder.',
      '搭载混合取景器的高级卡片机。',
    ),
    techHighlight: text('Hybrid viewfinder, leaf-shutter lens', '混合取景器，镜间快门镜头'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/fuji-x100vi.png',
  },
  {
    id: 'gopro-12',
    brand: 'GoPro',
    model: 'Hero 12',
    description: text('A compact action camera built for harsh environments.', '面向严苛环境的紧凑运动相机。'),
    techHighlight: text('High-density stack, heat management', '高密度堆叠，热管理'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/gopro-12.png',
  },
  {
    id: 'canon-ae1',
    brand: 'Canon',
    model: 'AE-1',
    description: text(
      'The camera that brought microprocessors to mass-market photography.',
      '将微处理器带入大众摄影市场的相机。',
    ),
    techHighlight: text('Electronically controlled cloth shutter', '电子控制布帘快门'),
    availability: 'coming-soon',
    availabilityNote: COMING_SOON_NOTE,
    imagePath: '/images/canon-ae1.png',
  },
];
