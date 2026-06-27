# CHANGELOG

## [Unreleased] — 2026-06-27

### 🐛 Bug 修复
- 修复 `ExplorePage.jsx` 渲染期间访问 ref 导致的 React 违规警告（wikiCacheRef → wikiUrls state）
- 修复 `ExplorePage.css` 中 CSS 语法错误（`.leaflet-overlay-pane path` 缺少闭合 `}`）
- 移除 `catch (e)` 中未使用的 `e` 参数（BlogPost, AIPost）

### ♻️ 代码重构
- **提取共享工具函数**：
  - `src/utils/images.js` — `imgStyle()`、`fetchWikipediaImage()` 函数
  - `src/utils/posts.js` — `loadPostsFromModules()`、`extractTags()` 函数
- **消除代码重复**：
  - `imgStyle` 从 2 处重复减为 1 处共享
  - `fetchWikipediaImage` 从 2 处重复减为 1 处共享
  - 文章加载逻辑（frontmatter 解析 + slug 提取 + 排序）从 3 处减为 1 处共享
  - `.filter-tag` CSS 从 2 处减为 1 处共享（`index.css`）
- **优化组件**：
  - `AttractionDetail.jsx`：`useState`+`useEffect` 模式改为 `useMemo` 纯函数计算，消除 React Compiler 警告
  - `AttractionDetail.jsx`：移除未使用的 `prevImg`/`nextImg`/`hasImage`/`heroStyle`

### 🧹 死代码清理
- 删除未引用的 `EuropeMap.jsx` 组件
- 删除 `ExplorePage.css` 中旧的 `attraction-popup-*` 样式（已被浮动 overlay 替代）
- 删除 `ExplorePage.css` 中无用的 `.europe-map`、`.country-zone-name` 选择器
- 移除 `ExplorePage.jsx` 中未使用的 `mapReady` state
- 移除 `ExplorePage.jsx` 中未使用的 `wikiCacheTick` state

### 🎯 代码质量
- 修复 `ExplorePage.jsx` 中 4 个 useEffect 缺失依赖数组警告
- 修复 HomePage 正则表达式中不必要的转义字符
- 修复 `skills-lock.json` 未加入 `.gitignore` 的问题
- 统一导入顺序规范

### 📦 GitHub 开源准备
- 重写 `README.md`（项目介绍、截图、安装、使用、贡献指南）
- 创建 `LICENSE`（MIT）
- 创建 `CHANGELOG.md`
- 更新 `.gitignore`（添加 `skills-lock.json`）
- 添加 `.nvmrc`（Node.js 版本管理）
- 移除废弃的 `@amap/amap-jsapi-loader` 依赖
