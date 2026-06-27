# 🅼 刘逸伦 · 个人知识枢纽

> 记录思考 · 收集知识 · 探索世界

一个融合博客、AI 学习笔记、欧洲旅行地图与个人履历的暗色主题个人网站，构建于 **React 19 + Vite 8** 之上。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ 功能特性

| 模块 | 路由 | 特点 |
|------|------|------|
| 🏠 **首页** | `/` | 打字机动画 Hero + 精选文章 + 小程序推广 |
| 📝 **博客** | `/blog` | Markdown 驱动、标签筛选、标签分组 |
| 🤖 **AI 收集** | `/ai` | AI 工具/教程/资讯，分类+标签双维过滤 |
| 🗺️ **探索世界** | `/explore` | Leaflet 暗色地图，3 层级交互（国家→城市→景点） |
| 🧑 **关于我** | `/about` | 19 年行业履历时间线、项目展示、联系信息 |

### 探索世界地图

- **Leaflet + CartoDB 暗色瓦片** — 全球 24 个欧洲国家
- **三层级交互** — 国家边界金色高亮 → 城市金色标记 → 景点蓝色标记
- **浮动信息卡** — 悬停景点显示预览，点击进入详情
- **搜索** — 搜索国家、城市、景点
- **Wikipedia 图片回退** — 为无图片景点自动获取 Wikipedia 缩略图

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
git clone https://github.com/liuyilun/liuyilun-site.git
cd liuyilun-site
npm install
```

### 开发

```bash
npm run dev
```

启动 Vite 开发服务器（默认 http://localhost:5173），支持 HMR 热更新。

### 构建

```bash
npm run build     # 生产构建到 dist/
npm run preview   # 预览生产构建
```

### 代码检查

```bash
npm run lint      # ESLint 检查
```

## 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19 (JSX, no TypeScript) |
| **构建** | Vite 8 |
| **路由** | react-router-dom v7 |
| **地图** | Leaflet 1.9.4 + CartoDB dark_all 瓦片 |
| **Markdown** | react-markdown + remark-gfm + rehype-highlight + rehype-raw |
| **样式** | 纯 CSS + CSS 自定义属性（设计系统） |
| **部署** | Vercel (SPA rewrites) |
| **字体** | DM Sans, Noto Sans SC, Noto Serif SC (Google Fonts) |

## 📁 项目结构

```
src/
├── main.jsx                  # 入口
├── App.jsx                   # 路由定义
├── index.css                 # 全局设计系统 + CSS 变量
├── content/                  # Markdown 内容（blog/ ai/）
├── data/                     # JSON 数据（europe-travel.json）
├── components/               # 共享组件
│   ├── Navbar.jsx            # 顶部导航
│   ├── Footer.jsx            # 全局页脚
│   ├── ScrollReveal.jsx      # 滚动入场动画
│   ├── MarkdownRenderer.jsx  # Markdown 渲染
│   └── ...
├── pages/                    # 页面组件
│   ├── Home/                 # 首页
│   ├── Blog/                 # 博客
│   ├── AI/                   # AI 收集
│   ├── Explore/              # 探索世界（地图+景点）
│   ├── About/                # 关于我
│   └── CCInstall/            # Claude Code 安装教程
└── utils/                    # 工具函数
    ├── frontmatter.js        # Markdown frontmatter 解析
    ├── images.js             # 图片工具（imgStyle, fetchWikipediaImage）
    └── posts.js              # 文章加载工具
```

## 🎨 设计系统

- **暗色主题**：Zinc 中性色盘 + 金色（`#c9a96e`）强调色
- **噪声纹理**：全局 SVG 噪声叠加
- **滚动动画**：ScrollReveal 组件实现淡入/上移/模糊入场
- **模块主题色**：博客(绿)、AI(蓝)、探索(青柠) 各模块通过 CSS 变量切换

## 🤝 贡献

欢迎提交 Issue 和 PR！请确保代码通过 `npm run lint` 检查。

## 📄 许可

[MIT](LICENSE)
