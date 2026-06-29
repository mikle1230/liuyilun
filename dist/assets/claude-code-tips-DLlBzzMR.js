var e=`---\r
title: "Claude Code 使用技巧收集"\r
date: "2026-06-25"\r
tags: ["Claude Code", "AI", "工具"]\r
excerpt: "日常使用 Claude Code 的一些实用技巧和配置心得，持续更新中。"\r
pinned: true\r
---\r
\r
## Claude Code 简介\r
\r
[Claude Code](https://docs.anthropic.com/en/docs/claude-code) 是 Anthropic 推出的命令行 AI 编程助手，可以直接在终端中使用。\r
\r
## 安装方法\r
\r
\`\`\`bash\r
npm install -g @anthropic-ai/claude-code\r
claude\r
\`\`\`\r
\r
## 使用 DeepSeek 作为后端\r
\r
如果你有 DeepSeek API Key，可以配置 Claude Code 使用 DeepSeek 模型：\r
\r
\`\`\`json\r
{\r
  "env": {\r
    "ANTHROPIC_API_KEY": "your-deepseek-api-key",\r
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic"\r
  }\r
}\r
\`\`\`\r
\r
更多详细配置，请参考本站的 [Claude Code 安装教程](/cc-install)。\r
\r
## 常用命令\r
\r
| 命令 | 说明 |\r
|------|------|\r
| \`claude\` | 启动交互式会话 |\r
| \`claude "问题"\` | 单次问答 |\r
| \`claude --model opus\` | 指定模型 |\r
| \`/clear\` | 清空对话 |\r
| \`/config\` | 打开配置 |\r
\r
## 实用技巧\r
\r
### 1. 项目级配置\r
\r
在项目根目录创建 \`CLAUDE.md\` 文件，Claude Code 会自动读取：\r
\r
\`\`\`markdown\r
# 项目说明\r
\r
- 技术栈：React + Vite\r
- 部署：Vercel\r
\`\`\`\r
\r
### 2. 善用 Hooks\r
\r
Claude Code 支持在特定事件触发自定义脚本，这在自动化工作流中非常有用。\r
\r
### 3. 上下文管理\r
\r
- 定期使用 \`/clear\` 清理上下文\r
- 将大型任务拆分成小块\r
- 善用 CLAUDE.md 提供项目背景\r
\r
---\r
\r
*持续更新中…*\r
`;export{e as default};