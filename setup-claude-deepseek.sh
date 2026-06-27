#!/usr/bin/env bash
# =============================================================
# Claude Code + DeepSeek API 一键配置脚本
# 适用于全新 MacBook 快速上手
# =============================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}ℹ${NC} $1"; }
ok()    { echo -e "${GREEN}✔${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
err()   { echo -e "${RED}✘${NC} $1"; }

echo ""
echo "============================================"
echo " Claude Code + DeepSeek API 设置"
echo "============================================"
echo ""

# ─── 1. 检查 Node.js ─────────────────────────────────────
info "检查 Node.js……"
if command -v node &>/dev/null; then
  node_ver=$(node -v)
  ok "Node.js 已安装：$node_ver"
else
  warn "未检测到 Node.js，尝试通过 Homebrew 安装……"
  if ! command -v brew &>/dev/null; then
    info "安装 Homebrew……"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # M 芯片需要把 brew 加入 PATH
    if [[ "$(uname -m)" == "arm64" ]]; then
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
      eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    ok "Homebrew 安装完成"
  fi
  brew install node
  ok "Node.js 安装完成：$(node -v)"
fi

# ─── 2. 安装 Claude Code ────────────────────────────────
info "检查 Claude Code……"
if command -v claude &>/dev/null; then
  ok "Claude Code 已安装：$(claude --version 2>/dev/null || claude -v 2>/dev/null || echo 'unknown')"
else
  info "正在安装 Claude Code（全局 npm 包）……"
  npm install -g @anthropic-ai/claude-code
  ok "Claude Code 安装完成"
fi

info "检查 cc……"
if command -v cc &>/dev/null; then
  ok "cc 别名已可用：$(which cc)"
else
  warn "未找到 cc 命令，尝试创建别名……"
  npm bin -g 2>/dev/null | read -r global_bin
  if [[ -n "$global_bin" ]] && [[ -f "$global_bin/claude" ]]; then
    # 推荐用户通过 shell 配置来设置别名，但这里先提示
    warn "请将以下一行添加到你的 ~/.zshrc（或 ~/.bashrc）："
    echo "    alias cc=\"$(npm bin -g)/claude\""
  else
    warn "Claude Code 可执行文件路径：$(npm bin -g 2>/dev/null)/claude"
  fi
fi

# ─── 3. 配置 DeepSeek API ────────────────────────────────
echo ""
info "配置 DeepSeek API 模型提供商……"
echo ""
echo "  Claude Code 支持通过环境变量使用 OpenAI 兼容的 API。"
echo "  你需要一个 DeepSeek API Key（从 https://platform.deepseek.com/api_keys 获取）。"
echo ""

CLAUDE_DIR="$HOME/.claude"
mkdir -p "$CLAUDE_DIR"

SETTINGS_FILE="$CLAUDE_DIR/settings.json"
SETTINGS_EXISTS=false
[[ -f "$SETTINGS_FILE" ]] && SETTINGS_EXISTS=true

# 询问 API Key
read -rp "请输入你的 DeepSeek API Key（留空则跳过，稍后可手动配置）: " DEEPSEEK_API_KEY

if [[ -n "$DEEPSEEK_API_KEY" ]]; then
  # 写入 settings.json
  if $SETTINGS_EXISTS; then
    warn "settings.json 已存在，脚本将合并新配置，不会覆盖已有内容。"
    # 简单合并：读取原文件，去掉末尾的 }，追加配置后再补全 }
    TMP_FILE=$(mktemp)
    # 去掉原文件最后一行（即最后的 }）
    head -n -1 "$SETTINGS_FILE" > "$TMP_FILE"
    echo ',' >> "$TMP_FILE"
  else
    TMP_FILE=$(mktemp)
    echo '{' > "$TMP_FILE"
  fi

  cat >> "$TMP_FILE" << 'JSONEOF'
  "models": {
    "custom": [
      {
        "id": "deepseek-chat",
        "name": "DeepSeek V3",
        "provider": "openai-compatible",
        "apiKey": "DEEPSEEK_API_KEY_PLACEHOLDER",
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
        "apiKey": "DEEPSEEK_API_KEY_PLACEHOLDER",
        "baseUrl": "https://api.deepseek.com/v1",
        "contextWindow": 64000,
        "maxTokens": 8192,
        "billedAs": "reasoning",
        "available": true
      }
    ]
  }
JSONEOF
  echo '}' >> "$TMP_FILE"

  # 替换占位符为真实 API Key
  sed -i '' "s/DEEPSEEK_API_KEY_PLACEHOLDER/$DEEPSEEK_API_KEY/g" "$TMP_FILE"

  mv "$TMP_FILE" "$SETTINGS_FILE"
  ok "已写入 $SETTINGS_FILE"
else
  warn "跳过 API Key 配置。"
  warn "你稍后可以手动编辑 $SETTINGS_FILE 添加 DeepSeek 配置。"
fi

# ─── 4. 写入 .zshrc 环境变量简化切换 ────────────────────
echo ""
ZSHRC="$HOME/.zshrc"
DEEPSEEK_ENV_BLOCK=$(cat << 'ENVEOF'

# ---- Claude Code + DeepSeek ----
# 一键切到 DeepSeek（通过环境变量覆盖 settings.json 中的 API Key）
alias cc-deepseek='DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-}" claude'
# 如果你常用 DeepSeek，可以取消下面这行的注释来设置为默认模型：
# export DEEPSEEK_API_KEY="你的 API Key"
ENVEOF
)

# 检查 ~/.zshrc 是否已有相关配置
if grep -q "cc-deepseek" "$ZSHRC" 2>/dev/null; then
  ok "~/.zshrc 已有 cc-deepseek 别名，跳过。"
else
  echo "$DEEPSEEK_ENV_BLOCK" >> "$ZSHRC"
  ok "已将快捷别名追加到 ~/.zshrc"
fi

# ─── 5. 完成引导 ─────────────────────────────────────────
echo ""
echo "============================================"
echo " 🎉 配置完成！"
echo "============================================"
echo ""
echo "可用命令："
echo ""
echo "  claude                 启动 Claude Code（Anthropic 官方模型）"
echo "  cc                     如果配置了别名，同上"
echo "  cc switch              交互式切换模型提供商"
echo "  cc-deepseek            使用 DeepSeek API 启动（需先设置 API Key）"
echo ""
echo "使用 DeepSeek 的方式："
echo ""
echo "  方式一（推荐）："
echo "    cc switch              # 交互选择，选到你刚配的 DeepSeek 模型"
echo ""
echo "  方式二："
echo "    export DEEPSEEK_API_KEY=\"你的 Key\""
echo "    cc-deepseek"
echo ""
echo "  方式三（持久化）："
echo "    编辑 ~/.zshrc，取消注释 export DEEPSEEK_API_KEY=... 那行"
echo "    然后 source ~/.zshrc 后直接运行 claude"
echo ""
echo "获取 DeepSeek API Key："
echo "  https://platform.deepseek.com/api_keys"
echo ""
echo "注意：cc switch 会列出 settings.json 中配置的所有可用模型。"
echo "如果你刚才配置了 DeepSeek 并且 Key 正确，即可直接选择使用。"
echo ""
