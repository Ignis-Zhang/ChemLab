# 项目说明（InorgChemExp — 无机化学实验）

本目录为「无机化学实验」课程的工作目录。涉及实验文档、参考 PDF、实验报告等。

## 协作约定（务必遵守）

### 1. 读取 PDF 一律用文字提取，绝不读 PNG 文件

当用户要求「读取 / 识别 / OCR」某个 PDF 时，必须**直接**从 PDF 提取文字再使用。

**实际使用的工具**：本机没有 `pdftotext` 命令，因此统一用项目虚拟环境的 **PyMuPDF（pymupdf）** 提取文字：
```bash
.venv/bin/python -c "import pymupdf; d=pymupdf.open('<文件>.pdf'); [print(p.get_text('text')) for p in d]"
```

**禁止**读取/识别任何 PNG 文件（包括 `.ocr/` 目录下由 PDF 生成的 `lab1_p*.png`，或其他渲染出来的图片）。原因是当前模型后端不支持 PNG 图片文件识别，多次读取 PNG 会造成会话卡顿和报错。

读取完成后，应向用户确认「本次未读取任何 PNG」。

### 2. 始终用中文回复

用户使用中文交流，一律用中文回复；文件中代码/变量名等技术内容可按规范使用英文，但叙述、解释、总结、提问等一律用中文。

### 3. 文件存放位置

- 临时/草稿文件：放到会话的 outputs 目录。
- 最终交付物（报告、文档等）：保存到本目录（InorgChemExp）并使用 computer:// 链接提供给用户。
- 实验参考 PDF 放在 `reference/` 目录下。

## 相关文件布局

- `reference/` — 实验参考文档（如 `Lab1.pdf`、`无机化学实验.pdf`）
- `.ocr/` — OCR 生成的 PNG（仅作历史存档，不需要读取）
- `src/`、`dist/` 等 — 项目代码（Vite + TypeScript）
