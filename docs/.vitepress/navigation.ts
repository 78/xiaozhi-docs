export const sections = [
  { slug: 'getting-started', zh: '快速开始', en: 'Getting started' },
  { slug: 'hardware', zh: '硬件与接线', en: 'Hardware & wiring' },
  { slug: 'firmware', zh: '固件与烧录', en: 'Firmware & flashing' },
  { slug: 'console', zh: '控制台指南', en: 'Console guide' },
  { slug: 'mcp', zh: 'MCP 与扩展', en: 'MCP & integrations' },
  { slug: 'development', zh: '开发指南', en: 'Development' },
  { slug: 'reference', zh: '协议与参考', en: 'Protocols & reference' },
  { slug: 'faq', zh: '常见问题', en: 'Troubleshooting' },
  { slug: 'community', zh: '社区与贡献', en: 'Community' }
] as const

const guides: Record<string, { slug: string; zh: string; en: string; externalZh?: string }[]> = {
  "getting-started": [
    {
      "slug": "wifi-and-binding",
      "zh": "配网与绑定设备",
      "en": "Wi-Fi & device binding"
    }
  ],
  "hardware": [
    {
      "slug": "choosing-hardware",
      "zh": "如何选择第一套硬件",
      "en": "Choose hardware"
    },
    {
      "slug": "supported-boards",
      "zh": "支持的板型与变体",
      "en": "Supported boards"
    },
    {
      "slug": "breadboard-esp32-s3",
      "zh": "基础 ESP32-S3 面包板",
      "en": "ESP32-S3 breadboard"
    },
    {
      "slug": "breadboard-esp32-c3",
      "zh": "ESP32-C3 面包板",
      "en": "ESP32-C3 breadboard"
    },
    {
      "slug": "breadboard-esp32",
      "zh": "经典 ESP32 面包板",
      "en": "Classic ESP32"
    },
    {
      "slug": "displays/st7789",
      "zh": "ST7789 彩屏",
      "en": "ST7789 display"
    },
    {
      "slug": "breadboard-4g",
      "zh": "4G 面包板：ML307R / NT26K",
      "en": "4G breadboard"
    },
    {
      "slug": "breadboard-camera",
      "zh": "S3 摄像头面包板",
      "en": "Camera breadboard"
    },
    {
      "slug": "boards/xmini-c3",
      "zh": "Xmini-C3 与 V3",
      "en": "Xmini-C3 & V3"
    },
    {
      "slug": "external-wake-module",
      "zh": "外接 ASR 唤醒模块",
      "en": "External ASR module"
    },
    {
      "slug": "battery-power",
      "zh": "电池供电与充电",
      "en": "Battery power"
    },
    {
      "slug": "audio-output",
      "zh": "扬声器、耳机与音箱",
      "en": "Audio outputs"
    },
    {
      "slug": "design-guidelines",
      "zh": "硬件设计要点",
      "en": "Hardware design"
    }
  ],
  "firmware": [
    {
      "slug": "online-builder",
      "zh": "在线编译与网页烧录",
      "en": "Online builder"
    },
    {
      "slug": "downloads",
      "zh": "下载与选择固件",
      "en": "Choose firmware"
    },
    {
      "slug": "flashing",
      "zh": "烧录与升级",
      "en": "Flash & update"
    },
    {
      "slug": "releases/v2.5.2",
      "zh": "v2.5.2 历史固件",
      "en": "v2.5.2 archive"
    },
    {
      "slug": "releases/v2.2.4",
      "zh": "v2.2.4 历史固件",
      "en": "v2.2.4 archive"
    },
    {
      "slug": "releases/v1.9.4",
      "zh": "v1.9.4 及旧附件索引",
      "en": "v1.9.4 archive"
    }
  ],
  "console": [
    {
      "slug": "github-verification",
      "zh": "GitHub 认证与权益",
      "en": "GitHub verification"
    },
    {
      "slug": "voice-cloning",
      "zh": "声音复刻",
      "en": "Voice cloning"
    },
    {
      "slug": "knowledge-base",
      "zh": "知识库",
      "en": "Knowledge base"
    }
  ],
  "mcp": [
    {
      "slug": "quickstart",
      "zh": "MCP 快速开始",
      "en": "MCP quickstart"
    },
    {
      "slug": "connect-existing-servers",
      "zh": "连接已有 MCP 服务",
      "en": "Connect MCP servers"
    },
    {
      "slug": "examples/web-search",
      "zh": "联网搜索示例",
      "en": "Web search example"
    }
  ],
  "development": [
    {
      "slug": "build-firmware",
      "zh": "搭建环境与本地构建",
      "en": "Build firmware"
    },
    {
      "slug": "custom-board",
      "zh": "修改引脚与自定义板型",
      "en": "Custom boards"
    },
    {
      "slug": "audio-and-aec",
      "zh": "音频处理与 AEC",
      "en": "Audio & AEC"
    },
    {
      "slug": "wake-words",
      "zh": "唤醒词与识别方案",
      "en": "Wake words"
    },
    {
      "slug": "mcp-gpio",
      "zh": "用 MCP 控制 GPIO",
      "en": "MCP GPIO tools"
    },
    {
      "slug": "custom-prompts",
      "zh": "提示音与语言资源",
      "en": "Prompt audio"
    },
    {
      "slug": "archive/p3-prompts",
      "zh": "P3 提示音历史方案",
      "en": "P3 archive"
    }
  ],
  "reference": [
    {
      "slug": "websocket",
      "zh": "WebSocket 版本入口",
      "en": "WebSocket reference"
    },
    {
      "slug": "ota",
      "zh": "OTA、激活与更新",
      "en": "OTA reference"
    },
    {
      "slug": "display-emotions",
      "zh": "心情与表情显示",
      "en": "Emotion display"
    }
  ],
  "faq": [
    {
      "slug": "account-and-binding",
      "zh": "登录、账号与解绑",
      "en": "Accounts & binding"
    },
    {
      "slug": "serial-logs",
      "zh": "获取串口日志",
      "en": "Serial logs"
    }
  ],
  "community": [
    {
      "slug": "open-hardware",
      "zh": "开源硬件项目",
      "en": "Open hardware"
    },
    {
      "slug": "projects/sf32lb52-plugin",
      "zh": "SF32LB52 教程 ↗",
      "externalZh": "https://openkits-wiki.easyeda.com/zh-hans/hspi-sf32lb52/training/xiaozhi-ai/",
      "en": "SF32LB52 project"
    },
    {
      "slug": "projects/astronaut-storyteller",
      "zh": "太空人故事机改造",
      "en": "Storyteller project"
    },
    {
      "slug": "projects/wake-on-lan",
      "zh": "网络唤醒电脑",
      "en": "Wake-on-LAN"
    },
    {
      "slug": "mcp-tools",
      "zh": "社区 MCP 工具",
      "en": "Community MCP tools"
    },
    {
      "slug": "resources",
      "zh": "音乐、歌词与资源",
      "en": "Music & resources"
    },
    {
      "slug": "contributing",
      "zh": "参与文档贡献",
      "en": "Contribute"
    }
  ]
}

export function sidebar(locale: 'zh' | 'en') {
  return sections.map(section => ({
    text: section[locale],
    collapsed: true,
    link: `/${locale}/${section.slug}/`,
    ...(guides[section.slug] ? {
      items: guides[section.slug].map(guide => ({
        text: guide[locale], link: locale === 'zh' && guide.externalZh ? guide.externalZh : `/${locale}/${section.slug}/${guide.slug}`
      }))
    } : {})
  }))
}
