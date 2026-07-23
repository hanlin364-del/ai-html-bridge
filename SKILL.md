---
name: ai-html-bridge
description: "可视化 HTML 编辑器 + AI 对话桥接。在任意本地 HTML 文件中注入可视化编辑器，选中页面元素后点「发送到AI」按钮，元素信息（标签、选择器路径、文字、位置、样式）自动复制到剪贴板，粘贴到 AI 对话框即可让 AI 精确定位修改。基于 html-mender skill 扩展，支持所有本地 HTML 文件。"
version: 1.0.0
metadata:
  openclaw:
    homepage: ""
    requires:
      skills:
        - html-mender
      bins:
        - node
---

# AI HTML Bridge — 可视化编辑 + AI 对话桥接

## 功能

在任意本地 `.html` 文件中注入：
1. **HTML Mender 可视化编辑器** — 选中/拖拽/缩放/编辑文字/图片
2. **AI 桥接按钮** — 选中元素后一键复制信息到剪贴板，粘贴到 AI 对话框即可精确告知要修改的位置

## 使用场景

- 用户说「编辑这个 HTML」「可视化调整」「我要选位置让你改」
- 用户想点击 HTML 页面上的某个位置，然后告诉 AI 要怎么调整
- 适用于：落地页、demo 页面、HTML PPT、AI 生成的网页等

## 工作流

```
用户: 帮我编辑 xxx.html
AI:  运行 start-editor.mjs → 生成 .editable.html → 打开浏览器
用户: 在浏览器中点击页面元素 → 点「💬 发送到AI」
用户: 回到 AI 对话框 Ctrl+V 粘贴 → "把这个标题改成红色"
AI:  根据粘贴的选择器路径定位代码 → 修改源 HTML → 重新生成
```

## 一键启动

```bash
node <skill-dir>/scripts/start-editor.mjs <input.html>
```

参数：
- `<input.html>` — 要编辑的 HTML 文件路径（必填）
- `--out <path>` — 自定义输出路径（可选，默认 `<input>.editable.html`）
- `--lang zh-CN|en` — 编辑器语言（可选，默认 zh-CN）

## 元素信息格式

点击「💬 发送到AI」后，剪贴板内容格式：

```
📍 选中元素：<div>
  ID: #ai-panel
  Class: .ai-panel.hidden
  选择器路径: body > div#ai-panel.ai-panel.hidden
  文字内容: 请帮我翻译这份文档…
  位置: x=320, y=156, w=480, h=52
  样式: 14px / rgb(26,26,26) / flex
```

## 依赖

- `html-mender` skill（自动安装）
- Node.js

## 技术实现

1. 调用 html-mender 的 `inject-html-editor.mjs` 生成 `.editable.html`
2. 追加 `ai-bridge-runtime.js` 补丁到文件末尾
3. 补丁在编辑器就绪后通过 `window.__htmlSlideMenderBootstrap.editor` 访问编辑器实例
4. 在 Shadow DOM 的 toolbar 中插入按钮
5. 点击时通过 `editor.selectedItem()` 获取选中元素的 DOM 节点
6. 提取元素信息并复制到剪贴板
