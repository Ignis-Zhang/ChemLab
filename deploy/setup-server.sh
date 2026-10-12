#!/usr/bin/env bash
# ============================================================================
# 学校云服务器初始化脚本（Ubuntu / Debian）
# 在服务器上以 root 运行一次：安装 Nginx、创建站点目录、放入站点配置。
#
#   在你的电脑上执行（把端口/地址换成你的）：
#     scp -P 683 deploy/setup-server.sh deploy/nginx.conf \
#         root@114.214.241.56:/tmp/
#     ssh -p 683 root@114.214.241.56 'bash /tmp/setup-server.sh'
#
# 站点目录与 nginx.conf 中的 root 一致，均为 /var/www/chemlab。
# ============================================================================
set -euo pipefail

SITE_DIR=/var/www/chemlab
SITE_DOMAIN=${1:-_}                      # 可传域名，默认 _（按 IP 访问）

echo "==> 安装 Nginx"
if ! command -v nginx >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y nginx
fi

echo "==> 创建站点目录（可写，便于后续 rsync 覆盖）"
mkdir -p "$SITE_DIR"

echo "==> 放置 Nginx 配置"
install -m 644 /tmp/nginx.conf /etc/nginx/sites-available/chemlab
ln -sf /etc/nginx/sites-available/chemlab /etc/nginx/sites-enabled/chemlab
rm -f /etc/nginx/sites-enabled/default   # 移除默认站点

echo "==> 校验并重载 Nginx"
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

echo "==> 完成。"
echo "    上传方式（在你的电脑，或 GitHub Actions）："
echo "      rsync -a --delete -e 'ssh -p 683' ./dist/ root@114.214.241.56:$SITE_DIR/"
echo "    访问地址："
echo "      域名:  http://$SITE_DOMAIN   |   无域名: http://114.214.241.56"
