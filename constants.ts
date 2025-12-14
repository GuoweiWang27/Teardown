import { CameraModel } from './types';

// NOTE: LOCAL DEVELOPMENT INSTRUCTIONS
// 1. Create a folder named "public" in your project root if it doesn't exist.
// 2. Create a folder named "models" inside "public".
// 3. Place your 'canon_at-1.glb' file inside 'public/models/'.
// 4. The path below '/models/canon_at-1.glb' will now work automatically.

// === NEW MODEL TEMPLATE (Copy & Paste this to add more) ===
// {
//   id: 'my-new-camera',
//   brand: 'Brand',
//   model: 'Model Name',
//   description: 'Description here',
//   techHighlight: 'Key tech',
//   modelUrl: '/models/my_file.glb', // Just put the file in public/models/
//   parts: [] // Leave empty! The Smart Engine will auto-detect meshes.
// },
// ==========================================================

export const CAMERA_MODELS: CameraModel[] = [
  {
    id: 'canon-at-1',
    brand: 'Canon',
    model: 'AT-1',
    description: 'The simplified Match Needle version of the AE-1.',
    description_cn: 'AE-1 的指针式测光简化版本。',
    techHighlight: 'Match Needle Metering, FD Mount',
    techHighlight_cn: '指针重合测光, FD 卡口',
    // UPDATED PATH: Pointing to the structured local folder
    modelUrl: '/models/canon_at-1.glb',
    // We define some key parts, but the "Smart Engine" will handle the rest automatically
    parts: [
      { 
        id: 'lens-fd', 
        name: 'Canon Lens FD 50mm 1:1.8', 
        name_cn: '佳能 FD 50mm 1:1.8 镜头',
        meshName: 'Lens_Group', // Try to name your main lens mesh "Lens_Group" in Blender if possible
        type: 'cylinder', 
        position: [0, 0, 1.2], 
        scale: [1, 1, 1], 
        color: '#111', 
        explosionDirection: [0, 0, 2] 
      },
      {
        id: 'body-main',
        name: 'Main Body Chassis',
        name_cn: '机身主体',
        meshName: 'Body_Main',
        type: 'box',
        position: [0, 0, 0],
        scale: [1, 1, 1], 
        color: '#111',
        explosionDirection: [0, 0, 0]
      }
    ]
  },
  {
    id: 'hasselblad-500cm',
    brand: 'Hasselblad',
    model: '500cm',
    description: 'The legendary modular medium format camera.',
    description_cn: '传奇的模块化中画幅相机。',
    techHighlight: 'Modular Design, Leaf Shutter',
    techHighlight_cn: '模块化设计, 镜间快门',
    // ==============================================================
    // 修改重点：
    // 1. modelUrl: 使用 GitHub raw 链接加载大文件（避免 Cloudflare 25MB 限制）
    // 2. parts: 设为空数组 []。这将激活 "Smart Engine"，自动识别零件并生成爆炸图。
    // ==============================================================
    modelUrl: 'https://pub-f8d77afad3c343f4b5854e8f73932d50.r2.dev/500cm.glb',
    parts: [] 
  },
  {
    id: 'leica-m6',
    brand: 'Leica',
    model: 'M6',
    description: 'The classic rangefinder used by street photographers.',
    description_cn: '街头摄影师钟爱的经典旁轴相机。',
    techHighlight: 'Rangefinder Mechanism, Cloth Shutter',
    techHighlight_cn: '黄斑测距, 布帘快门',
    parts: [
      { id: 'chassis', name: 'Main Chassis', name_cn: '主底盘', type: 'box', position: [0, 0, 0], scale: [3, 1.5, 0.8], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'top-plate', name: 'Top Plate (Brass)', name_cn: '黄铜顶盖', type: 'box', position: [0, 0.8, 0], scale: [3, 0.4, 0.8], color: '#d4d4d8', explosionDirection: [0, 1, 0] },
      { id: 'bottom-plate', name: 'Bottom Plate', name_cn: '底盖', type: 'box', position: [0, -0.8, 0], scale: [3, 0.2, 0.8], color: '#d4d4d8', explosionDirection: [0, -1, 0] },
      { id: 'lens-mount', name: 'M Mount', name_cn: 'M 卡口', type: 'cylinder', position: [0, 0, 0.5], rotation: [Math.PI/2, 0, 0], scale: [1, 0.2, 1], color: '#a1a1aa', explosionDirection: [0, 0, 0.5] },
      { id: 'lens', name: 'Summicron 35mm', name_cn: 'Summicron 35mm 镜头', type: 'cylinder', position: [0, 0, 1], rotation: [Math.PI/2, 0, 0], scale: [0.7, 0.8, 0.7], color: '#27272a', explosionDirection: [0, 0, 1.5] },
      { id: 'rangefinder', name: 'Rangefinder Mechanism', name_cn: '联动测距机构', type: 'box', position: [0.5, 0.5, -0.2], scale: [1.5, 0.4, 0.4], color: '#fbbf24', explosionDirection: [0, 0.5, -0.5] }
    ]
  },
  {
    id: 'canon-5d4',
    brand: 'Canon',
    model: 'EOS 5D Mark IV',
    description: 'The workhorse DSLR for professionals.',
    description_cn: '专业摄影师的单反主力机型。',
    techHighlight: 'Pentaprism, Mirror Box, Full Frame CMOS',
    techHighlight_cn: '五棱镜, 反光镜箱, 全画幅 CMOS',
    parts: [
      { id: 'body', name: 'Magnesium Alloy Body', name_cn: '镁合金机身', type: 'box', position: [0, -0.2, 0], scale: [3, 2, 1.5], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'prism', name: 'Pentaprism', name_cn: '五棱镜', type: 'box', position: [0, 1.2, 0], scale: [1.5, 0.8, 1.5], color: '#e4e4e7', explosionDirection: [0, 1.5, 0] },
      { id: 'mirror', name: 'Main Mirror', name_cn: '主反光镜', type: 'box', position: [0, 0, 0.2], rotation: [Math.PI/4, 0, 0], scale: [1.2, 0.1, 0.8], color: '#a1a1aa', explosionDirection: [0, 0, 1] },
      { id: 'sensor', name: 'Full Frame CMOS Sensor', name_cn: '全画幅 CMOS 传感器', type: 'box', position: [0, 0, -0.5], scale: [1.2, 0.8, 0.1], color: '#10b981', explosionDirection: [0, 0, -1] },
      { id: 'lens', name: 'EF 24-70mm Lens', name_cn: 'EF 24-70mm 镜头', type: 'cylinder', position: [0, -0.2, 1.5], rotation: [Math.PI/2, 0, 0], scale: [1, 1.8, 1], color: '#27272a', explosionDirection: [0, 0, 2] },
      { id: 'grip', name: 'Battery Grip', name_cn: '电池手柄', type: 'box', position: [-1.2, -0.5, 0.5], scale: [0.8, 1.5, 0.8], color: '#27272a', explosionDirection: [-1, 0, 0] }
    ]
  },
  {
    id: 'sx-70',
    brand: 'Polaroid',
    model: 'SX-70',
    description: 'A masterpiece of foldable engineering.',
    description_cn: '可折叠工程学的杰作。',
    techHighlight: 'Foldable Optical Path, Fresnel Mirror',
    techHighlight_cn: '折叠光路, 菲涅尔反射镜',
    parts: [
      { id: 'base', name: 'Base / Film Door', name_cn: '底座 / 胶片仓门', type: 'box', position: [0, -1, 0], scale: [2.5, 0.2, 3], color: '#71717a', explosionDirection: [0, -1, 0] },
      { id: 'bellows', name: 'Rubber Bellows', name_cn: '橡胶皮腔', type: 'box', position: [0, 0, 0], rotation: [-Math.PI/6, 0, 0], scale: [2.2, 1.5, 2], color: '#18181b', explosionDirection: [0, 0.5, 0] },
      { id: 'mirror', name: 'Fresnel Mirror', name_cn: '菲涅尔反射镜', type: 'box', position: [0, -0.5, -0.5], rotation: [-Math.PI/6, 0, 0], scale: [2, 0.1, 2.5], color: '#3b82f6', explosionDirection: [0, 0, -1] },
      { id: 'lens-block', name: 'Lens & Shutter Unit', name_cn: '镜头与快门单元', type: 'box', position: [0, 0.5, 1.2], scale: [2, 0.8, 0.5], color: '#a1a1aa', explosionDirection: [0, 0, 1] },
      { id: 'viewfinder', name: 'Viewfinder Cap', name_cn: '取景器盖', type: 'box', position: [0, 1.2, -1], scale: [1, 0.4, 0.8], color: '#71717a', explosionDirection: [0, 1, -0.5] }
    ]
  },
  {
    id: 'sony-a7iv',
    brand: 'Sony',
    model: 'A7 IV',
    description: 'Modern hybrid mirrorless standard.',
    description_cn: '现代混合微单的标准。',
    techHighlight: 'IBIS Mechanism, Stacked Logic Board',
    techHighlight_cn: '五轴防抖, 堆叠主板',
    parts: [
      { id: 'body', name: 'Main Chassis', name_cn: '相机骨架', type: 'box', position: [0, 0, 0], scale: [2.8, 1.8, 1], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'ibis', name: 'IBIS Unit (5-Axis)', name_cn: 'IBIS 防抖组件', type: 'box', position: [0, 0, -0.2], scale: [1.5, 1, 0.3], color: '#f59e0b', explosionDirection: [0, 0, -0.5] },
      { id: 'sensor', name: 'BSI CMOS Sensor', name_cn: '背照式 CMOS', type: 'box', position: [0, 0, -0.1], scale: [1.4, 0.9, 0.05], color: '#10b981', explosionDirection: [0, 0, 0.5] },
      { id: 'motherboard', name: 'Main Logic Board', name_cn: '主逻辑板', type: 'box', position: [0, 0, -0.6], scale: [2.5, 1.5, 0.1], color: '#047857', explosionDirection: [0, 0, -1.5] },
      { id: 'lens', name: 'E-Mount Lens', name_cn: 'E 卡口镜头', type: 'cylinder', position: [0, 0, 1], rotation: [Math.PI/2, 0, 0], scale: [0.9, 1.2, 0.9], color: '#27272a', explosionDirection: [0, 0, 2] }
    ]
  },
  {
    id: 'rolleiflex',
    brand: 'Rolleiflex',
    model: '2.8F',
    description: 'The iconic twin lens reflex (TLR).',
    description_cn: '标志性的双反相机。',
    techHighlight: 'Twin Lens Path, Waist Level Finder',
    techHighlight_cn: '双镜头光路, 腰平取景',
    parts: [
      { id: 'body', name: 'TLR Body', name_cn: '双反机身', type: 'box', position: [0, 0, 0], scale: [1.8, 3, 1.8], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'view-lens', name: 'Viewing Lens (Top)', name_cn: '取景镜头 (上)', type: 'cylinder', position: [0, 0.8, 1], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.5, 0.6], color: '#a1a1aa', explosionDirection: [0, 0, 1.5] },
      { id: 'take-lens', name: 'Taking Lens (Bottom)', name_cn: '摄影镜头 (下)', type: 'cylinder', position: [0, -0.5, 1], rotation: [Math.PI/2, 0, 0], scale: [0.7, 0.5, 0.7], color: '#a1a1aa', explosionDirection: [0, 0, 1.5] },
      { id: 'finder', name: 'Folding Finder Hood', name_cn: '折叠取景罩', type: 'box', position: [0, 1.6, 0], scale: [1.8, 0.4, 1.8], color: '#27272a', explosionDirection: [0, 1, 0] },
      { id: 'crank', name: 'Transport Crank', name_cn: '过片摇把', type: 'box', position: [1, -0.5, 0], scale: [0.2, 0.8, 0.2], color: '#d4d4d8', explosionDirection: [1, 0, 0] }
    ]
  },
  {
    id: 'nikon-z9',
    brand: 'Nikon',
    model: 'Z9',
    description: 'Flagship mirrorless without a mechanical shutter.',
    description_cn: '取消了机械快门的旗舰微单。',
    techHighlight: 'Sensor Shield, Stacked Sensor',
    techHighlight_cn: '传感器防护盾, 堆栈式传感器',
    parts: [
      { id: 'body', name: 'Pro Body with Grip', name_cn: '一体化手柄机身', type: 'box', position: [0, -0.5, 0], scale: [3.2, 3, 1.2], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'sensor-shield', name: 'Sensor Shield', name_cn: '传感器防护盾', type: 'box', position: [0, 0.5, 0.7], scale: [1.4, 1, 0.05], color: '#52525b', explosionDirection: [0, 0, 1] },
      { id: 'sensor', name: 'Stacked CMOS', name_cn: '堆栈式 CMOS', type: 'box', position: [0, 0.5, 0.5], scale: [1.4, 1, 0.1], color: '#10b981', explosionDirection: [0, 0, -0.5] },
      { id: 'lens', name: 'Z Mount Lens', name_cn: 'Z 卡口镜头', type: 'cylinder', position: [0, 0.5, 1.5], rotation: [Math.PI/2, 0, 0], scale: [1.1, 1.5, 1.1], color: '#27272a', explosionDirection: [0, 0, 2] }
    ]
  },
  {
    id: 'fuji-x100vi',
    brand: 'Fujifilm',
    model: 'X100VI',
    description: 'Premium compact with a hybrid viewfinder.',
    description_cn: '搭载混合取景器的高级卡片机。',
    techHighlight: 'Hybrid Viewfinder, Leaf Shutter Lens',
    techHighlight_cn: '混合取景器, 镜间快门镜头',
    parts: [
      { id: 'body', name: 'Compact Body', name_cn: '紧凑机身', type: 'box', position: [0, 0, 0], scale: [2.8, 1.6, 0.8], color: '#d4d4d8', explosionDirection: [0,0,0] },
      { id: 'lens', name: '23mm Fixed Lens', name_cn: '23mm 固定镜头', type: 'cylinder', position: [0.4, 0, 0.8], rotation: [Math.PI/2, 0, 0], scale: [0.8, 0.8, 0.8], color: '#a1a1aa', explosionDirection: [0, 0, 1.5] },
      { id: 'finder', name: 'Hybrid Viewfinder', name_cn: '混合取景器', type: 'box', position: [-1, 0.6, 0], scale: [0.6, 0.5, 0.8], color: '#18181b', explosionDirection: [0, 0.5, 0] },
      { id: 'top-dials', name: 'Control Dials', name_cn: '控制拨盘', type: 'box', position: [0.8, 0.9, 0], scale: [1, 0.2, 0.5], color: '#a1a1aa', explosionDirection: [0, 1, 0] }
    ]
  },
  {
    id: 'gopro-12',
    brand: 'GoPro',
    model: 'Hero 12',
    description: 'The ultimate action camera.',
    description_cn: '终极运动相机。',
    techHighlight: 'High Density Stack, Heat Sink',
    techHighlight_cn: '高密度堆叠, 散热片',
    parts: [
      { id: 'housing', name: 'Waterproof Housing', name_cn: '防水外壳', type: 'box', position: [0, 0, 0], scale: [1.5, 1, 0.8], color: '#18181b', explosionDirection: [0,0,0] },
      { id: 'lens-module', name: 'Lens Module', name_cn: '镜头模组', type: 'box', position: [-0.4, 0, 0.5], scale: [0.5, 0.5, 0.2], color: '#27272a', explosionDirection: [0, 0, 1.5] },
      { id: 'screen-front', name: 'Front LCD', name_cn: '前置液晶屏', type: 'box', position: [0.4, 0, 0.45], scale: [0.5, 0.5, 0.05], color: '#3b82f6', explosionDirection: [0, 0, 1] },
      { id: 'screen-back', name: 'Touch Screen', name_cn: '后置触摸屏', type: 'box', position: [0, 0, -0.45], scale: [1.3, 0.8, 0.05], color: '#3b82f6', explosionDirection: [0, 0, -1] },
      { id: 'battery', name: 'Enduro Battery', name_cn: 'Enduro 电池', type: 'box', position: [0, 0, 0], scale: [0.8, 0.8, 0.2], color: '#3f3f46', explosionDirection: [1.5, 0, 0] }
    ]
  },
  {
    id: 'canon-ae1',
    brand: 'Canon',
    model: 'AE-1',
    description: 'The camera that brought microprocessors to photography.',
    description_cn: '将微处理器带入摄影领域的相机。',
    techHighlight: 'Electronically Controlled Cloth Shutter',
    techHighlight_cn: '电子控制布帘快门',
    parts: [
      { id: 'body', name: 'Plastic/Metal Body', name_cn: '塑料/金属机身', type: 'box', position: [0, 0, 0], scale: [3, 1.8, 1], color: '#d4d4d8', explosionDirection: [0,0,0] },
      { id: 'lens', name: 'FD 50mm Lens', name_cn: 'FD 50mm 镜头', type: 'cylinder', position: [0, 0, 1], rotation: [Math.PI/2, 0, 0], scale: [0.8, 0.8, 0.8], color: '#18181b', explosionDirection: [0, 0, 1.5] },
      { id: 'prism', name: 'Pentaprism Hump', name_cn: '五棱镜顶', type: 'box', position: [0, 1, 0], scale: [1.2, 0.5, 1], color: '#d4d4d8', explosionDirection: [0, 1, 0] },
      { id: 'battery-door', name: 'Battery Door (4LR44)', name_cn: '电池仓门 (4LR44)', type: 'box', position: [-1.2, 0, 0.5], scale: [0.2, 0.5, 0.2], color: '#18181b', explosionDirection: [-1, 0, 1] }
    ]
  }
];