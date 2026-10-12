#!/usr/bin/env bash
# ============================================================================
# 手动部署脚本：本地构建 dist/ 并 rsync 上传到学校云服务器。
# 适用于不想/不能跑 GitHub Actions（CI）时的手动发布方式。
#
# 用法：
#   bash deploy/deploy.sh
#
# 依赖：本机已配置服务器 SSH 免密登录（或用 SSH_AGENT）；否则会提示输入密码。
# 配置项可被环境变量覆盖，例如：
#   SSHPORT=683 bash deploy/deploy.sh
# ============================================================================
set -euo pipefail

# --- 服务器信息 ---
SSH_USER="${SSH_USER:-root}"
SSH_HOST="${SSH_HOST:-114.214.241.56}"
SSHPORT="${SSHPORT:-683}"
SITE_DIR="${SITE_DIR:-/var/www/chemlab}"

echo "==> 构建生产包 (dist/)"
npm run build

echo "==> 上传到 ${SSH_USER}@${SSH_HOST}:${SITE_DIR}/ (端口 ${SSHPORT})"
# --delete 保持与本地 dist 完全一致；-a 归档保留权限；--omit-dir-times 避免目录 mtime 干扰缓存
rsync -a --delete \
  -e "ssh -p ${SSHPORT}" \
  ./dist/ "${SSH_USER}@${SSH_HOST}:${SITE_DIR}/"

echo "==> 上传完成。访问："
echo "    http://114.214.241.56:8080  （如解析了域名则用域名）"
