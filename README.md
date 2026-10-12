# 无机化学实验数据处理网站

辅助无机化学实验教学的**纯前端静态网站**。学生在实验中记录原始数据后，网站按每个实验固定的数据处理流程**即时**给出最终结果和异常反馈——及时发现问题时无需等实验结束。

- **技术栈**：Vue 3 + Vite + TypeScript；测试用 Vitest。
- **架构**：**配置驱动的实验引擎**（`src/engine/`），添加新实验只需新增一个配置文件，无需改 UI 或路由。
- **部署**：纯前端、无后端、无数据库，`npm run build` 产出的 `dist/` 可直接放到任意静态服务器 / 局域网目录 / web 空间。

## 运行

```bash
npm install
npm run dev       # 本地开发，打开 http://localhost:5173
npm test          # 运行引擎单元测试 (Vitest)
npm run build     # 生产构建，输出到 dist/
npm run preview   # 本地预览生产构建
```

## 目录结构

```
src/
├── engine/            # 纯 TS 引擎核心（不依赖 Vue，可单测）
│   ├── types.ts       # ExperimentModule 数据模型
│   ├── evaluate.ts    # 纯求值函数：推导链 + 结果格式化 + 校验
│   ├── format.ts      # 小数位 / 有效数字格式化
│   ├── registry.ts    # 实验模块注册表
│   └── __tests__/     # Vitest 单测
├── experiments/       # 实验模块配置（每个实验一个文件）
│   └── magnesium.ts   # 例：金属镁相对原子质量的测定
├── lib/vaporPressure.ts  # 水的饱和蒸气压查表等公共参考数据
├── composables/useExperiment.ts  # 把引擎绑定到 Vue 响应式系统
└── components/        # ExperimentForm / ExperimentsHome / FieldInput
```

## 新增一个实验模块

1. 新建 `src/experiments/<name>.ts`，导出一个 `ExperimentModule` 对象：
   - `inputs`：输入字段（id、标签、单位、合理区间 range）
   - `derived`：推导链（id + 纯函数表达式，**顺序即依赖顺序**）
   - `results`：最终展示的结果字段（引用 derived id，配置小数位/有效数字）
   - `validations`：校验/反馈规则（severity: error/warning/info，产出中文提示）
   - `constants` / `tables`：模块常量与参考查表
2. 在 `src/engine/registry.ts` 的 `MODULES` 数组末尾追加一项。
3. 完成后即可通过路由 `/experiments/<id>` 访问，无需改动组件或路由。

## 已含实验

- **金属镁相对原子质量的测定**：差量法求镁质量 → 排水集气测 H₂ 体积 → 理想气体定律（含水蒸气压与液面差校正）求 n(H₂) → 得 Ar(Mg) 并与理论值 24.305 比较计算相对误差。

> 数据全部在浏览器本地计算，不会上传到任何服务器。

## 多人协作

仓库使用 Git 工作流，团队成员共同维护 `main` 分支：

```bash
git clone <你的远端地址>
npm install
# 改代码 / 新增实验模块（见上）
npm test && npm run build
git add -A && git commit -m "..."
git push origin main     # 推送后自动触发线上部署
```

## 部署（GitHub Actions → 学校云服务器）

站点是**纯前端静态站**，`npm run build` 产出 `dist/`，由 Nginx 静态托管。

- **首次搭建服务器**（只需做一次）：
  ```bash
  scp -P 683 deploy/setup-server.sh deploy/nginx.conf root@114.214.241.56:/tmp/
  ssh -p 683 root@114.214.241.56 'bash /tmp/setup-server.sh'
  ```
- **一次性配置 GitHub Actions**（推送即部署）：在仓库
  `Settings → Secrets and variables → Actions` 添加 Secret——
  `DEPLOY_HOST / DEPLOY_PORT / DEPLOY_USER / DEPLOY_PASS`（或密钥 `DEPLOY_KEY`）/ `DEPLOY_DIR`。
- 之后每次 `git push origin main`，GitHub Actions 自动构建并 rsync 到服务器，
  线上立即更新（详见 `.github/workflows/deploy.yml`）。
- **手动发布**（不想用 CI 时）：`bash deploy/deploy.sh`。
- 站点目录：`/var/www/chemlab`；Nginx 配置模板见 `deploy/nginx.conf`。

> ⚠️ 服务器 SSH 密码属于敏感凭据，请放入 GitHub Secret，勿提交到仓库。
