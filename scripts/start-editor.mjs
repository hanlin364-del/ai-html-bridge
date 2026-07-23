#!/usr/bin/env node
/**
 * start-editor.mjs — 一键启动可视化 HTML 编辑器 + AI 桥接
 *
 * 用法:
 *   node start-editor.mjs <input.html> [--out <path>] [--lang zh-CN|en]
 *
 * 流程:
 *   1. 调用 html-mender skill 的 inject-html-editor.mjs 生成 .editable.html
 *   2. 追加 ai-bridge-runtime.js 补丁
 *   3. 打开浏览器
 */

import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { execSync, spawn } from "node:child_process";

const SCRIPT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_DIR = resolve(SCRIPT_DIR, "..");
const HTML_MENDER_SKILL_DIR = resolve(
  process.env.USERPROFILE || process.env.HOME,
  ".qclaw/skills/html-mender"
);
const INJECT_SCRIPT = resolve(HTML_MENDER_SKILL_DIR, "scripts/inject-html-editor.mjs");
const BRIDGE_RUNTIME = resolve(SCRIPT_DIR, "assets/ai-bridge-runtime.js");

const START_MARKER = "<!-- ai-bridge-patch:start -->";
const END_MARKER = "<!-- ai-bridge-patch:end -->";

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error?.message || String(error) }, null, 2));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.input) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = resolve(args.input);
  if (!existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  // 检查 html-mender skill 是否安装
  if (!existsSync(INJECT_SCRIPT)) {
    console.error("❌ html-mender skill 未安装，正在安装...");
    execSync("skillhub install html-mender", { stdio: "inherit", shell: "cmd.exe" });
    if (!existsSync(INJECT_SCRIPT)) {
      console.error("❌ html-mender skill 安装失败，请手动安装: skillhub install html-mender");
      process.exit(1);
    }
  }

  const dir = dirname(inputPath);
  const stem = basename(inputPath, extname(inputPath));
  const ext = extname(inputPath) || ".html";
  const outputPath = resolve(args.out || resolve(dir, `${stem}.editable${ext}`));
  await mkdir(dirname(outputPath), { recursive: true });

  // Step 1: 注入 HTML Mender 编辑器
  console.log("Step 1/3: 注入可视化编辑器...");
  const injectCmd = `node "${INJECT_SCRIPT}" "${inputPath}" --out "${outputPath}" --lang ${args.lang} --mode basic`;
  try {
    execSync(injectCmd, { stdio: "inherit" });
  } catch (e) {
    console.error("❌ 编辑器注入失败:", e.message);
    process.exit(1);
  }

  // Step 2: 追加 AI 桥接补丁
  console.log("Step 2/3: 注入 AI 对话桥接...");
  await injectAiBridge(outputPath);

  // Step 3: 打开浏览器
  console.log("Step 3/3: 打开浏览器...");
  openInBrowser(outputPath);

  console.log(`\n✅ 编辑器已启动: ${outputPath}`);
  console.log("\n📋 使用说明:");
  console.log("  1. 单击选中页面元素（文字/图片/卡片等）");
  console.log("  2. 双击或按 Enter 编辑文字");
  console.log("  3. 拖拽边框移动元素，拖拽手柄调整大小");
  console.log("  4. 点「💬 发送到AI」按钮，元素信息自动复制到剪贴板");
  console.log("  5. 回到 AI 对话框 Ctrl+V 粘贴，告诉 AI 要怎么调整");
  console.log("  6. 编辑完成后点「下载 HTML」导出干净源码");
}

async function injectAiBridge(filePath) {
  let html = await readFile(filePath);
  const bridgeRuntime = await readFile(BRIDGE_RUNTIME);

  // 移除旧补丁
  const oldStart = html.indexOf(START_MARKER);
  const oldEnd = html.indexOf(END_MARKER);
  if (oldStart >= 0 && oldEnd >= 0) {
    html = html.slice(0, oldStart) + html.slice(oldEnd + END_MARKER.length);
  }

  const patch = [
    START_MARKER,
    `<script data-ai-bridge="patch">\n${bridgeRuntime}\n</script>`,
    END_MARKER,
  ].join("\n");

  // 注入到 </body> 之前
  const bodyEnd = html.lastIndexOf("</body>");
  if (bodyEnd >= 0) {
    html = html.slice(0, bodyEnd) + patch + "\n" + html.slice(bodyEnd);
  } else {
    html += "\n" + patch;
  }

  await writeFile(filePath, html, "utf8");
  console.log("  ✓ AI 桥接补丁已注入");
}

async function readFile(path) {
  return readFileSync(path, "utf8");
}

function openInBrowser(filePath) {
  const { platform } = process;
  const url = `file:///${filePath.replace(/\\/g, "/")}`;
  if (platform === "win32") {
    execSync(`start "" "${filePath}"`, { stdio: "ignore", shell: "cmd.exe" });
  } else if (platform === "darwin") {
    execSync(`open "${filePath}"`, { stdio: "ignore" });
  } else {
    execSync(`xdg-open "${filePath}"`, { stdio: "ignore" });
  }
}

function parseArgs(argv) {
  const args = { input: "", out: "", lang: "zh-CN", help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--lang") {
      args.lang = argv[++i] === "en" ? "en" : "zh-CN";
    } else if (!arg.startsWith("--")) {
      args.input = arg;
    }
  }
  return args;
}

function printUsage() {
  console.log(`AI HTML Bridge — 可视化 HTML 编辑器 + AI 对话桥接

用法:
  node scripts/start-editor.mjs <input.html> [options]

参数:
  --out <path>    自定义输出路径 (默认: <input>.editable.html)
  --lang <value>  编辑器语言: zh-CN (默认) 或 en
  --help          显示帮助

示例:
  node scripts/start-editor.mjs /path/to/page.html
  node scripts/start-editor.mjs /path/to/page.html --out /tmp/edit.html --lang en`);
}
