---
title: "Claude Code 安装与 DeepSeek 配置完整指南"
date: "2026-06-26"
tags: ["Claude Code", "教程", "DeepSeek", "工具"]
excerpt: "在新 Mac 上从零搭建 Claude Code 开发环境，配置 DeepSeek API，免登录、免排队，开箱即用。2026 年最新版实测。"
pinned: true
sourceUrl: "https://daheiai.com/cc-install.html"
category: "教程"
---

## 这是什么？

本文是 daheiai.com 上 Claude Code 安装教程的参考版——按照 2026 年中的最新情况进行更新，并结合个人经验做了一些补充。

> **TL;DR —— 一句话速通**
>
> ```bash
> npm install -g @anthropic-ai/claude-code
> claude
> ```
>
> 等首次引导完成后，按 `Ctrl+C` 退出，再执行 `cc switch` 即可选择 DeepSeek。

### 相比原文的主要更新

- **版本无需回退：** 原文建议安装 2.1.153 以避开第三方 API 兼容性问题，最新版已修复，直接安装最新版即可。
- **内置 `cc switch`：** Claude Code 现已内置模型切换命令，不再必须依赖第三方 cc-switch 工具。下文两种方法都会介绍。
- **npm 安装：** 除了 `curl | sh`，现在也支持 `npm install -g`，对前端开发者更顺手。
- **settings.json 直配：** 可以直接编辑 `~/.claude/settings.json` 添加自定义模型，不需要额外工具。

---

## ① 安装 Claude Code

### 方式 A：npm 全局安装（推荐 · macOS / Linux）

```bash
npm install -g @anthropic-ai/claude-code
```

### 方式 B：官方安装脚本

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | sh
```

### 方式 C：Windows（PowerShell）

```powershell
irm https://claude.ai/install.ps1 | iex
```

> **检查是否安装成功：**
>
> ```bash
> claude --version
> # 输出版本号即表示成功
> ```
>
> 如果 `claude` 命令找不到，请确保 `~/.local/bin`（curl 安装）或 npm 全局 bin 目录已在你的 `$PATH` 中。

---

## ② 获取 DeepSeek API Key

1. 打开 [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) 并登录/注册。
2. 点击 **创建 API Key**，复制生成的密钥（以 `sk-` 开头）。
3. 充一点余额——DeepSeek 价格非常便宜，几块钱能用很久。

> ⚠️ **不要泄露 API Key！** 不要提交到 Git，不要截图分享。建议存到 `.env` 或系统密钥链中。

---

## ③ 配置 DeepSeek 模型

编辑 `~/.claude/settings.json`（如果不存在就创建它），添加以下内容：

```json
{
  "models": {
    "custom": [
      {
        "id": "deepseek-chat",
        "name": "DeepSeek V3",
        "provider": "openai-compatible",
        "apiKey": "sk-你的密钥",
        "baseUrl": "https://api.deepseek.com/v1",
        "contextWindow": 64000,
        "maxTokens": 8192,
        "billedAs": "input",
        "available": true
      },
      {
        "id": "deepseek-reasoner",
        "name": "DeepSeek R1",
        "provider": "openai-compatible",
        "apiKey": "sk-你的密钥",
        "baseUrl": "https://api.deepseek.com/v1",
        "contextWindow": 64000,
        "maxTokens": 8192,
        "billedAs": "reasoning",
        "available": true
      }
    ]
  }
}
```

---

## ④ 切换模型

配置好之后，你有两种方式切换到 DeepSeek。

### 方法一：内置 `cc switch`（推荐）

Claude Code 自带 `switch` 命令，无需安装任何额外工具：

```bash
# 在项目目录中执行
cc switch
```

运行后会列出你在 `settings.json` 中配置的所有可用模型，方向键选择、回车确认即可。Claude Code 会记住你的选择。

操作流程：输入 `cc switch` → 看到模型列表 → 选中 **DeepSeek V3** 或 **R1** → 回车确认，直接开始对话。

### 方法二：cc-switch 桌面工具（备选）

如果你更喜欢图形界面，可以使用社区工具 [cc-switch](https://github.com/farion1231/cc-switch)（108k+ Star，仍在活跃维护）。它支持 DeepSeek、智谱 GLM、MiniMax 等多种模型。

| 对比 | 内置 `cc switch` | cc-switch 桌面工具 |
|------|-----------------|-------------------|
| 安装 | 自带，零安装 | 需单独下载 |
| 界面 | 终端命令行 | 图形界面 |
| 支持的模型 | 以 settings.json 配置为准 | 内置模型库 + 自定义 |
| 维护状态 | Anthropic 官方维护 | 社区维护，活跃更新 |

> ⚠️ **首次运行登录跳过：** 如果 Claude Code 首次启动时检测到没有 Anthropic 官方模型账号，可能卡在登录界面。解决方法：
>
> ```bash
> echo '{"hasCompletedOnboarding": true}' > ~/.claude.json
> ```
>
> 然后重启 Claude Code 即可直接使用自定义模型。

---

## ⑤ 基础使用

| 功能 | 说明 |
|------|------|
| **启动** | 在项目目录下直接输入 `claude`，Claude Code 会自动读取项目上下文 |
| **恢复历史** | 在相同目录输入 `/resume`，可查看并恢复之前的会话 |
| **上下文管理** | `/context` 查看用量，`/compact` 手动压缩。自动压缩在对话过长时也会触发 |
| **常用命令** | `/help` 查看所有命令，`/clear` 清屏，`/cost` 查看本次会话消耗 |

### `claude` vs `cc`

两个命令完全等价——`claude` 是正式名，`cc` 是安装时创建的快捷别名。如果你发现 `cc` 不可用，可以在 `~/.zshrc` 中手动加一行：

```bash
alias cc="claude"
```

---

## ⑥ 常见问题

### DeepSeek API 怎么收费？

DeepSeek V3 输入 $0.27/百万 token，输出 $1.10/百万 token，价格约为 GPT-4o 的 1/30。日常编码使用，充值 $5 能用非常久。

### 安装后找不到 `claude` 命令？

检查 `~/.local/bin`（curl 安装）或 npm 全局 bin 目录是否在 `$PATH` 中：

```bash
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"
```

然后 `source ~/.zshrc` 或重启终端。

### 如何卸载 Claude Code？

npm 安装的：`npm uninstall -g @anthropic-ai/claude-code`

curl 安装的：删除 `~/.local/bin/claude` 和 `~/.local/share/claude`

完全清理：`rm -rf ~/.claude ~/.claude.json ~/.local/bin/claude ~/.local/share/claude`

### 切换 DeepSeek 后报错 "401 Unauthorized"？

通常是 API Key 错误。检查：

1. settings.json 中的 `apiKey` 是否正确（以 `sk-` 开头）
2. DeepSeek 账户余额是否充足
3. `baseUrl` 是否为 `https://api.deepseek.com/v1`（末尾不要加 `/chat/completions`）

### DeepSeek R1（reasoner）和 V3（chat）有什么区别？

- **DeepSeek V3**（deepseek-chat）：通用对话模型，响应快，适合日常编码、问答、重构。
- **DeepSeek R1**（deepseek-reasoner）：深度推理模型，会花更多时间思考，适合复杂问题、数学、逻辑推理。注意 R1 按 reasoning tokens 计费，价格略高。

### 配置文件 settings.json 格式报错怎么办？

JSON 格式很严格，常见错误：

- 多了一个逗号（对象最后一项后面不能有逗号）
- 少了引号（Key 必须用双引号）
- 注释不能用（JSON 不支持注释）

可以用 [JSONLint](https://jsonlint.com) 在线校验格式。

---

*参考来源：[daheiai.com](https://daheiai.com/cc-install.html) · [cc-switch](https://github.com/farion1231/cc-switch) · [DeepSeek](https://platform.deepseek.com/api_keys)*

*最后更新：2026 年 6 月*
