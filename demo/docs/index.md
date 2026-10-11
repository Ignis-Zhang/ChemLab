# COD Lab Demo

欢迎来到 **COD（Computer Organization and Design）Lab Demo**。

这是一个用 **MkDocs + Material for MkDocs** 搭建的文档站 demo，用于复刻
[soc.ustc.edu.cn](https://soc.ustc.edu.cn/COD/lab3/) 课程的 UI 架构。

## 架构特征

- **三段式布局**：顶部导航栏 / 左侧多级侧边栏 / 右侧页面内目录（TOC）
- **搜索**：右上角内置全文搜索
- **深色 / 浅色主题**：跟随系统，可手动切换
- **代码高亮**：指令代码块带复制按钮

!!! tip "实验提示"
    完整代码在 [GitHub](https://github.com) 上开源，配合评论区插件即可复用
    原站的"提交与讨论"能力。

## 快速开始

在 `docs/` 下编写 Markdown，然后构建站点：

```bash
# 本地预览（开发）
mkdocs serve

# 构建静态站点（部署到 GitHub Pages 等平台）
mkdocs build
```
