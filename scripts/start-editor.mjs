#!/usr/bin/env node
/**
 * start-editor.mjs 鈥?涓€閿惎鍔ㄥ彲瑙嗗寲 HTML 缂栬緫鍣?+ AI 妗ユ帴
 *
 * 鐢ㄦ硶:
 *   node start-editor.mjs <input.html> [--out <path>] [--lang zh-CN|en]
 *
 * 娴佺▼:
 *   1. 璋冪敤 html-mender skill 鐨?inject-html-editor.mjs 鐢熸垚 .editable.html
 *   2. 杩藉姞 ai-bridge-runtime.js 琛ヤ竵
 *   3. 鎵撳紑娴忚鍣? */

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
    console.error(`鉂?File not found: ${inputPath}`);
    process.exit(1);
  }

  // 妫€鏌?html-mender skill 鏄惁瀹夎
  if (!existsSync(INJECT_SCRIPT)) {
    console.error("鉂?html-mender skill 鏈畨瑁咃紝姝ｅ湪瀹夎...");
    execSync("skillhub install html-mender", { stdio: "inherit", shell: "cmd.exe" });
    if (!existsSync(INJECT_SCRIPT)) {
      console.error("鉂?html-mender skill 瀹夎澶辫触锛岃鎵嬪姩瀹夎: skillhub install html-mender");
      process.exit(1);
    }
  }

  const dir = dirname(inputPath);
  const stem = basename(inputPath, extname(inputPath));
  const ext = extname(inputPath) || ".html";
  const outputPath = resolve(args.out || resolve(dir, `${stem}.editable${ext}`));
  await mkdir(dirname(outputPath), { recursive: true });

  // Step 1: 娉ㄥ叆 HTML Mender 缂栬緫鍣?  console.log("Step 1/3: 娉ㄥ叆鍙鍖栫紪杈戝櫒...");
  const injectCmd = `node "${INJECT_SCRIPT}" "${inputPath}" --out "${outputPath}" --lang ${args.lang} --mode basic`;
  try {
    execSync(injectCmd, { stdio: "inherit" });
  } catch (e) {
    console.error("鉂?缂栬緫鍣ㄦ敞鍏ュけ璐?", e.message);
    process.exit(1);
  }

  // Step 2: 杩藉姞 AI 妗ユ帴琛ヤ竵
  console.log("Step 2/3: 娉ㄥ叆 AI 瀵硅瘽妗ユ帴...");
  await injectAiBridge(outputPath);

  // Step 3: 鎵撳紑娴忚鍣?  console.log("Step 3/3: 鎵撳紑娴忚鍣?..");
  openInBrowser(outputPath);

  console.log(`\n鉁?缂栬緫鍣ㄥ凡鍚姩: ${outputPath}`);
  console.log("\n馃搵 浣跨敤璇存槑:");
  console.log("  1. 鍗曞嚮閫変腑椤甸潰鍏冪礌锛堟枃瀛?鍥剧墖/鍗＄墖绛夛級");
  console.log("  2. 鍙屽嚮鎴栨寜 Enter 缂栬緫鏂囧瓧");
  console.log("  3. 鎷栨嫿杈规绉诲姩鍏冪礌锛屾嫋鎷芥墜鏌勮皟鏁村ぇ灏?);
  console.log("  4. 鐐广€岎煉?鍙戦€佸埌AI銆嶆寜閽紝鍏冪礌淇℃伅鑷姩澶嶅埗鍒板壀璐存澘");
  console.log("  5. 鍥炲埌 AI 瀵硅瘽妗?Ctrl+V 绮樿创锛屽憡璇?AI 瑕佹€庝箞璋冩暣");
  console.log("  6. 缂栬緫瀹屾垚鍚庣偣銆屼笅杞?HTML銆嶅鍑哄共鍑€婧愮爜");
}

async function injectAiBridge(filePath) {
  let html = await readFile(filePath);
  const bridgeRuntime = await readFile(BRIDGE_RUNTIME);

  // 绉婚櫎鏃цˉ涓?  const oldStart = html.indexOf(START_MARKER);
  const oldEnd = html.indexOf(END_MARKER);
  if (oldStart >= 0 && oldEnd >= 0) {
    html = html.slice(0, oldStart) + html.slice(oldEnd + END_MARKER.length);
  }

  const patch = [
    START_MARKER,
    `<script data-ai-bridge="patch">\n${bridgeRuntime}\n</script>`,
    END_MARKER,
  ].join("\n");

  // 娉ㄥ叆鍒?</body> 涔嬪墠
  const bodyEnd = html.lastIndexOf("</body>");
  if (bodyEnd >= 0) {
    html = html.slice(0, bodyEnd) + patch + "\n" + html.slice(bodyEnd);
  } else {
    html += "\n" + patch;
  }

  await writeFile(filePath, html, "utf8");
  console.log("  鉁?AI 妗ユ帴琛ヤ竵宸叉敞鍏?);
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
  console.log(`AI HTML Bridge 鈥?鍙鍖?HTML 缂栬緫鍣?+ AI 瀵硅瘽妗ユ帴

鐢ㄦ硶:
  node scripts/start-editor.mjs <input.html> [options]

鍙傛暟:
  --out <path>    鑷畾涔夎緭鍑鸿矾寰?(榛樿: <input>.editable.html)
  --lang <value>  缂栬緫鍣ㄨ瑷€: zh-CN (榛樿) 鎴?en
  --help          鏄剧ず甯姪

绀轰緥:
  node scripts/start-editor.mjs /path/to/page.html
  node scripts/start-editor.mjs /path/to/page.html --out /tmp/edit.html --lang en`);
}
