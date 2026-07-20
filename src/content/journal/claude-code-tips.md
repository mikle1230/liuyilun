---
title: "Claude Code 使用技巧收集"
date: "2026-06-25"
tags: ["Claude Code", "AI", "工具"]
excerpt: "日常使用 Claude Code 的一些实用技巧和配置心得，持续更新中。"
pinned: true
---

## Claude Code 简介

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) 是 Anthropic 推出的命令行 AI 编程助手，可以直接在终端中使用。

## 安装方法

```bash
npm install -g @anthropic-ai/claude-code
claude
```

## 使用 DeepSeek 作为后端

如果你有 DeepSeek API Key，可以配置 Claude Code 使用 DeepSeek 模型：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "your-deepseek-api-key",
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic"
  }
}
```

更多详细配置，请参考本站的 [Claude Code 安装教程](/cc-install)。

## 常用命令

| 命令 | 说明 |
|------|------|
| `claude` | 启动交互式会话 |
| `claude "问题"` | 单次问答 |
| `claude --model opus` | 指定模型 |
| `/clear` | 清空对话 |
| `/config` | 打开配置 |

## 实用技巧

### 1. 项目级配置

在项目根目录创建 `CLAUDE.md` 文件，Claude Code 会自动读取：

```markdown
# 项目说明

- 技术栈：React + Vite
- 部署：Vercel
```

### 2. 善用 Hooks

Claude Code 支持在特定事件触发自定义脚本，这在自动化工作流中非常有用。

### 3. 上下文管理

- 定期使用 `/clear` 清理上下文
- 将大型任务拆分成小块
- 善用 CLAUDE.md 提供项目背景

---

*持续更新中…*
