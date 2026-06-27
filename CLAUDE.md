# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

刘逸伦的个人知识枢纽 — 博客、AI 学习收集、欧洲旅行知识库、个人履历。暗色主题、科技感视觉、多页设计。

## Commands

```bash
npm run dev         # 启动开发服务器 (Vite HMR)
npm run build       # 生产构建到 dist/
npm run preview     # 预览生产构建
npm run lint        # ESLint 检查
```

## Architecture

- **React 19 + Vite 8** SPA，JSX 无 TypeScript
- **react-router-dom v7**：多路由 — `/`（首页）、`/blog` + `/blog/:slug`（博客）、`/ai` + `/ai/:slug`（AI 收集）、`/explore`（探索世界）、`/about`（关于我）、`/cc-install`（Claude Code 安装教程）
- **内容管理**：Markdown 文件 + `import.meta.glob` 动态加载 + 自写 frontmatter 解析器（`src/utils/frontmatter.js`）
- **Markdown 渲染**：`react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-raw`
- **部署**：Vercel（`vercel.json` 配置 SPA rewrites，所有路径→`/index.html`）
- **字体**：Google Fonts — DM Sans（UI）、Noto Sans SC（正文/中文名）、Noto Serif SC（标题 serif）

## 路由与模块

| 路由 | 页面 | 主题色 | 说明 |
|------|------|--------|------|
| `/` | HomePage | 紫（品牌色） | 首页门户，Hero + 模块入口卡片 |
| `/blog` / `/blog/:slug` | BlogList / BlogPost | 绿 `#34d399` | 个人博客，Markdown 驱动 |
| `/ai` / `/ai/:slug` | AIList / AIPost | 蓝 `#38bdf8` | AI 学习收集 |
| `/explore` | ExplorePage | 青柠 `#c3f400` | 欧洲旅行知识 + 小程序推广 |
| `/about` | AboutPage | 紫（品牌色） | 个人履历全览 |
| `/cc-install` | CCInstall | — | Claude Code 安装教程 |

## 目录结构

```
src/
├── main.jsx                  # 入口，BrowserRouter
├── App.jsx                   # 路由定义 + AppLayout
├── App.css                   # .app 容器
├── index.css                 # 全局设计系统 + CSS 变量 + 模块主题色
├── content/
│   ├── blog/                 # 博客 Markdown 文章
│   └── ai/                   # AI 相关 Markdown 文章
├── data/
│   └── europe-travel.json    # 欧洲旅行数据
├── components/               # 共享组件
│   ├── Navbar.jsx/.css       # 多页顶部导航
│   ├── Footer.jsx/.css       # 全局页脚
│   ├── ScrollReveal.jsx      # 滚动入场动画
│   ├── SplashCursor.jsx      # 鼠标拖尾粒子特效（仅首页）
│   ├── MarkdownRenderer.jsx/.css  # Markdown 渲染
│   ├── BlogCard.jsx/.css     # 文章卡片
│   ├── TagPill.jsx/.css      # 标签胶囊
│   └── ModuleHero.jsx/.css   # 模块顶部横幅
└── pages/                    # 页面组件
    ├── Home/                 # 首页
    ├── Blog/                 # 博客列表 + 详情
    ├── AI/                   # AI 收集列表 + 详情
    ├── Explore/              # 探索世界
    ├── About/                # 关于我（含 CareerTimeline, Projects, Strengths, ContactSection）
    └── CCInstall/            # Claude Code 教程
```

## 模块主题色系统

每个模块通过页面容器 CSS 覆盖 `--accent` 变量实现主题切换：

```css
.blog-page { --accent: var(--accent-blog); --accent-hover: var(--accent-blog-hover); ... }
.ai-page   { --accent: var(--accent-ai);   ... }
.explore-page { --accent: var(--accent-explore); ... }
```

全局 CSS 变量定义在 `index.css` 的 `:root` 中。

## 文章 Markdown 格式

```markdown
---
title: "文章标题"
date: "2026-06-27"
tags: ["标签1", "标签2"]
excerpt: "一句话摘要"
pinned: true    # 可选，置顶
---

文章正文（Markdown）...
```

## 联系方式

所有联系信息硬编码在 About 页面：电话 `18611488525`、邮箱 `47847796@qq.com`。如需更新，修改 `pages/About/AboutPage.jsx` 和 `pages/About/ContactSection.jsx`。
