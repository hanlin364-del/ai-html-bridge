# AI HTML Bridge

可视化 HTML 编辑器 + AI 对话桥接。在任意本地 .html 文件中注入可视化编辑器，选中页面元素后点「发送到 AI」按钮，元素信息自动复制到剪贴板，粘贴给 AI 即可精确定位修改。

[English](#english) | 中文

---

## 功能特性

- **可视化编辑** — 选中、拖拽、缩放、编辑文字、替换图片
- **AI 精准定位** — 选中元素后一键复制信息（标签、选择器路径、文字内容、坐标、样式）
- **无缝对接 AI** — Ctrl+V 粘贴到 AI 对话框，AI 就能精确定位到你想改的地方
- **通用支持** — 任意 HTML 文件均可使用，不限框架不限项目
- **零依赖** — 只需要 Node.js，基于 html-mender 构建

---

## 使用效果

`
用户: 帮我编辑 xxx.html
AI:   运行命令 → 生成 .editable.html → 自动打开浏览器
用户: 点击页面元素 → 点「发送到 AI」
用户: 回到 AI 对话框 Ctrl+V → "把这个标题改成红色"
AI:   根据选择器路径精准定位 → 修改源 HTML
`

---

## 安装方式一：OAT 平台（推荐）

\\\ash
skillhub install ai-html-bridge
\\\

---

## 安装方式二：从源码安装

\\\ash
git clone https://github.com/hanlin364-del/ai-html-bridge.git
cd ai-html-bridge
\\\

---

## 快速开始

### 前置要求

- Node.js 16+
- html-mender skill（脚本会自动检测安装）

### 运行

\\\ash
# 基本用法
node scripts/start-editor.mjs /path/to/page.html

# 自定义输出路径
node scripts/start-editor.mjs /path/to/page.html --out /tmp/edit.html

# 英文界面
node scripts/start-editor.mjs /path/to/page.html --lang en
\\\

---

## 使用步骤

1. **打开文件** — 在浏览器中打开生成的 .editable.html
2. **点击选中** — 鼠标点击页面任意元素，被选中元素会显示蓝色边框
3. **发送到 AI** — 点击工具栏左侧的「发送到 AI」按钮
4. **复制信息** — 元素信息已自动复制到剪贴板
5. **粘贴对话** — 回到 AI 对话框，Ctrl+V 粘贴，描述你想怎么改
6. **导出** — 改完后点「下载 HTML」导出干净源文件

---

## 元素信息格式

点击「发送到 AI」后，剪贴板内容示例：

\\\yaml
📍 选中元素：<div>
  ID: #main-header
  Class: .hero-section.container
  选择器路径: body > div#app > header#main-header.hero-section.container
  文字内容: 欢迎使用我们的产品
  位置: x=0, y=80, w=1200, h=400
  样式: 16px / rgb(51,51,51) / flex
\\\

---

## 文件结构

\\\
ai-html-bridge/
├── README.md
├── SKILL.md
├── scripts/
│   └── start-editor.mjs
└── assets/
    └── ai-bridge-runtime.js
\\\

---

## 依赖

| 依赖 | 说明 |
|------|------|
| Node.js 16+ | 运行脚本 |
| html-mender | 可视化编辑器（自动安装） |

---

## License

MIT

---

## English

### AI HTML Bridge — Visual HTML Editor + AI Chat Bridge

**AI HTML Bridge** injects a visual HTML editor into any local \.html\ file. After selecting an element in the browser, click "Send to AI" to copy the element's structural information to your clipboard — paste it into any AI chat and the AI knows exactly which element you want to modify.

### Quick Start

\\\ash
node scripts/start-editor.mjs /path/to/page.html
\\\

### Workflow

\\\
You: Edit this HTML file
AI:   Runs start-editor.mjs → generates .editable.html → opens browser
You:  Click an element → click "Send to AI"
You:  Ctrl+V in AI chat → "Make this header red"
AI:   Locates the element via selector → modifies source HTML
\\\

### Features

- Visual select / drag / resize / edit text / replace images
- One-click element info copy (tag, ID, class, selector path, text, position, styles)
- Works with any local HTML file
- Zero config, just run one command