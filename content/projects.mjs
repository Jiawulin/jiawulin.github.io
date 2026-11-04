export const publication = {
  tmviewerDemo: "http://tmviewer.com/",
  screenshotsApproved: true,
};

export const profile = {
  name: "Jiawulin",
  github: "https://github.com/Jiawulin",
  zh: "创造实用、好用的软件。",
  en: "Making useful software, thoughtfully.",
};

export const projects = [
  {
    id: "jigeqiu",
    name: { zh: "记个球", en: "JIGEQIU" },
    subtitle: "JIGEQIU",
    logo: "logo.ico",
    cover: "desktop-light.webp",
    images: [
      "desktop-light.webp",
      "bookmark-library.webp",
      "search-engines.webp",
      "launchpad.webp",
    ],
    website: "https://jigeqiu.com/",
    websiteLabel: "jigeqiu.com",
    source: "https://github.com/Jiawulin/jigeqiu",
    releases: "https://github.com/Jiawulin/jigeqiu/releases",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    category: {
      zh: "网址收藏 · 个人工作台",
      en: "Bookmarks · Personal workspace",
    },
    summary: {
      zh: "把网址收藏整理成你的个人工作台。",
      en: "A personal workspace for your bookmarks.",
    },
    description: {
      zh: "用熟悉的桌面找到常用网站，用清晰的目录整理全部收藏。可本机部署，也可作为静态站点运行，无需账号、业务后端或数据库。",
      en: "A familiar desktop for the sites you use every day, with nested folders for everything else. Self-host it or deploy a static site, without an account, application backend, or database.",
    },
    intro: {
      zh: "收藏不应该只是浏览器里越来越长的列表。记个球把收藏库、桌面快捷方式和全局搜索放在一起：收藏库负责整理，桌面负责常用入口，启动台让所有网址都能被找到。",
      en: "Bookmarks should be more than an ever-growing list. JIGEQIU brings a library, desktop shortcuts, and global search together. Organize in the library, pin daily essentials to the desktop, and find everything in the launchpad.",
    },
    features: {
      zh: [
        [
          "各归其位",
          "多层目录、搜索、批量整理与回收站，让收藏保有清晰的结构。",
        ],
        [
          "随手可达",
          "独立桌面快捷方式、文件夹与任务栏，不改变收藏库的原有归属。",
        ],
        ["一个搜索框", "检索收藏、切换搜索引擎，输入斜杠即可使用快捷指令。"],
        [
          "由你保管",
          "收藏存于浏览器，可导入浏览器书签，并导出 HTML 或 JSON 资产备份。",
        ],
      ],
      en: [
        [
          "A place for everything",
          "Nested folders, search, bulk organization, and a recycle bin keep your library in order.",
        ],
        [
          "Close at hand",
          "Independent desktop shortcuts, folders, and taskbar pins leave the underlying library intact.",
        ],
        [
          "One search away",
          "Search bookmarks, switch engines, or type a slash to access quick commands.",
        ],
        [
          "Yours to keep",
          "Bookmarks stay in your browser. Import browser bookmarks and export HTML or JSON asset backups.",
        ],
      ],
    },
    technical: {
      zh: [
        ["运行方式", "现代浏览器 · 本机启动 · HTTPS 静态部署"],
        ["数据存储", "LocalStorage · IndexedDB"],
        ["源码许可", "MIT"],
      ],
      en: [
        [
          "Runs on",
          "Modern browsers · Local development · HTTPS static hosting",
        ],
        ["Storage", "LocalStorage · IndexedDB"],
        ["Source license", "MIT"],
      ],
    },
    captions: {
      zh: ["桌面工作台", "收藏库与目录", "自定义搜索引擎", "全量启动台"],
      en: [
        "The desktop workspace",
        "Library and folders",
        "Custom search engines",
        "The launchpad",
      ],
    },
  },
  {
    id: "tmviewer",
    name: { zh: "天幕看图", en: "TianMu Viewer" },
    subtitle: "TIANMU VIEWER",
    logo: "logo.webp",
    cover: "infinite-canvas.webp",
    images: [
      "infinite-canvas.webp",
      "classic-canvas.webp",
      "filmstrip.webp",
      "grid.webp",
      "stack.webp",
      "short-video.webp",
      "honeycomb.webp",
      "details.webp",
    ],
    website: publication.tmviewerDemo,
    websiteLabel: publication.tmviewerDemo
      ? new URL(publication.tmviewerDemo).hostname
      : "",
    stack: ["React", "TypeScript", "Tauri", "Rust", "SQLite"],
    category: {
      zh: "照片与视频 · 媒体浏览器",
      en: "Photos & video · Media browser",
    },
    summary: {
      zh: "换一种方式，重逢你的照片和视频。",
      en: "A fresh perspective on your photos and videos.",
    },
    description: {
      zh: "为本机照片和视频打造的媒体浏览器。从无限屏漫游到网格审阅，让散落在文件夹中的画面重新连接起来。",
      en: "A media browser for local photos and videos. From an infinite canvas to a focused grid, rediscover the moments scattered across your folders.",
    },
    intro: {
      zh: "添加本机文件夹，便能在统一范围中浏览照片与视频。天幕看图在本机建立只读索引，不移动原始文件；在线体验则使用独立的演示图库，展示浏览与交互方式。",
      en: "Add local folders to browse photos and videos in one place. TianMu Viewer builds a local, read-only index without moving your originals. The web experience uses a separate demo library to showcase browsing and interactions.",
    },
    features: {
      zh: [
        [
          "跨越文件夹",
          "在统一媒体库中浏览多个本机来源，不必反复进入深层目录。",
        ],
        ["自由观看", "在无限屏中漫游，或用网格、时间轴与画廊专注浏览。"],
        ["看清细节", "查看图片详情、缩放与对比，在浏览与审阅之间自然切换。"],
        ["图片与视频", "同一工作区浏览照片和视频，支持视频播放与放映体验。"],
      ],
      en: [
        [
          "Beyond folders",
          "Browse multiple local sources in one library, without navigating deep folder trees.",
        ],
        [
          "Your point of view",
          "Explore an infinite canvas, or focus with grid, timeline, and gallery views.",
        ],
        [
          "Closer to the details",
          "Inspect, zoom, and compare images as you move between browsing and reviewing.",
        ],
        [
          "Still and moving",
          "Browse photos and videos in the same workspace, with playback and slideshow views.",
        ],
      ],
    },
    technical: {
      zh: [
        ["桌面应用", "Tauri · Rust · SQLite"],
        ["界面", "React · TypeScript"],
        ["在线体验", "独立演示图库，不读取本机媒体"],
      ],
      en: [
        ["Desktop application", "Tauri · Rust · SQLite"],
        ["Interface", "React · TypeScript"],
        ["Web experience", "Separate demo library; no access to local media"],
      ],
    },
    captions: {
      zh: [
        "照片墙",
        "经典无限屏",
        "胶片流",
        "网格审阅",
        "堆叠放映",
        "短视频流",
        "蜂巢",
        "图片详情",
      ],
      en: [
        "Photo wall",
        "The classic infinite canvas",
        "Filmstrip",
        "A focused grid",
        "Stack slideshow",
        "Short-video feed",
        "Honeycomb",
        "Image details",
      ],
    },
    imageDescriptions: {
      zh: [
        "把照片铺成一面连续的墙，在同一画布上自由浏览。",
        "像浏览星图一样探索照片，让散落的画面在无限空间中相遇。",
        "沿着胶片流连续翻阅，在横向延展的画面中发现下一张照片。",
        "以整齐的网格快速扫视图库，查看标题、格式与文件信息。",
        "让照片层叠呈现，在前后交错的画面间逐张观看。",
        "以短视频流专注观看视频，保留播放进度、音量和全屏等控件。",
        "用蜂巢式圆形布局组织照片，换一种节奏浏览同一份图库。",
        "放大检查画面，同时查看文件属性，在浏览与细看之间自然切换。",
      ],
      en: [
        "Arrange photos into a continuous wall and explore them on a shared canvas.",
        "Explore photos like a star map, with moments spread across an infinite space.",
        "Browse a continuous filmstrip and discover the next photo along the way.",
        "Scan an orderly grid with titles, formats, and file information close at hand.",
        "View photos one by one as they overlap in a layered presentation.",
        "Focus on videos in a dedicated feed with playback, volume, and fullscreen controls.",
        "Explore the same library through a distinctive circular honeycomb arrangement.",
        "Inspect the image up close alongside file properties, without leaving the viewing flow.",
      ],
    },
  },
];
