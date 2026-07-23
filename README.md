# AI HTML Bridge

鍙鍖?HTML 缂栬緫鍣?+ AI 瀵硅瘽妗ユ帴銆傚湪浠绘剰鏈湴 `.html` 鏂囦欢涓敞鍏ュ彲瑙嗗寲缂栬緫鍣紝閫変腑椤甸潰鍏冪礌鍚庣偣銆屽彂閫佸埌 AI銆嶆寜閽紝鍏冪礌淇℃伅鑷姩澶嶅埗鍒板壀璐存澘锛岀矘璐寸粰 AI 鍗冲彲绮剧‘瀹氫綅淇敼銆?
[English](#english) | 涓枃

---

## 鍔熻兘鐗规€?
- 馃柋锔?**鍙鍖栫紪杈?* 鈥?閫変腑銆佹嫋鎷姐€佺缉鏀俱€佺紪杈戞枃瀛椼€佹浛鎹㈠浘鐗?- 馃挰 **AI 绮惧噯瀹氫綅** 鈥?閫変腑鍏冪礌鍚庝竴閿鍒朵俊鎭紙鏍囩銆侀€夋嫨鍣ㄨ矾寰勩€佹枃瀛楀唴瀹广€佸潗鏍囥€佹牱寮忥級
- 馃敆 **鏃犵紳瀵规帴 AI** 鈥?Ctrl+V 绮樿创鍒?AI 瀵硅瘽妗嗭紝AI 灏辫兘绮剧‘瀹氫綅鍒颁綘鎯虫敼鐨勫湴鏂?- 馃實 **閫氱敤鏀寔** 鈥?浠绘剰 HTML 鏂囦欢鍧囧彲浣跨敤锛屼笉闄愭鏋朵笉闄愰」鐩?- 馃敡 **闆朵緷璧?* 鈥?鍙渶瑕?Node.js锛屽熀浜?html-mender 鏋勫缓

---

## 浣跨敤鏁堟灉

```
鐢ㄦ埛: 甯垜缂栬緫 xxx.html
AI:   杩愯鍛戒护 鈫?鐢熸垚 .editable.html 鈫?鑷姩鎵撳紑娴忚鍣?鐢ㄦ埛: 鐐瑰嚮椤甸潰鍏冪礌 鈫?鐐广€岎煉?鍙戦€佸埌AI銆?鐢ㄦ埛: 鍥炲埌 AI 瀵硅瘽妗?Ctrl+V 鈫?"鎶婅繖涓爣棰樻敼鎴愮孩鑹?
AI:   鏍规嵁閫夋嫨鍣ㄨ矾寰勭簿鍑嗗畾浣?鈫?淇敼婧?HTML
```

---

## 瀹夎鏂瑰紡涓€锛歄AT 骞冲彴锛堟帹鑽愶級

```bash
skillhub install ai-html-bridge
```

> 闇€瑕佸厛瀹夎 [SkillHub CLI](https://github.com/your-skillhub/skillhub-cli)

---

## 瀹夎鏂瑰紡浜岋細浠庢簮鐮佸畨瑁?
```bash
git clone https://github.com/hanlin364-del/ai-html-bridge.git
cd ai-html-bridge
# 鐩存帴浣跨敤锛屾垨澶嶅埗鍒?QClaw skills 鐩綍
```

---

## 蹇€熷紑濮?
### 鍓嶇疆瑕佹眰

- Node.js 16+
- 宸插畨瑁?html-mender skill锛堣剼鏈細鑷姩妫€娴嬪苟瀹夎锛?
### 杩愯

```bash
# 鍩烘湰鐢ㄦ硶锛堟寚瀹?HTML 鏂囦欢锛?node scripts/start-editor.mjs /path/to/page.html

# 鑷畾涔夎緭鍑鸿矾寰?node scripts/start-editor.mjs /path/to/page.html --out /tmp/edit.html

# 鑻辨枃鐣岄潰
node scripts/start-editor.mjs /path/to/page.html --lang en
```

鎵ц鍚庝細锛?1. 璇诲彇婧?HTML 鏂囦欢
2. 娉ㄥ叆鍙鍖栫紪杈戝櫒
3. 娉ㄥ叆 AI 妗ユ帴琛ヤ竵
4. 鑷姩鍦ㄦ祻瑙堝櫒涓墦寮€ `.editable.html`

---

## 浣跨敤姝ラ

1. **鎵撳紑鏂囦欢** 鈥?鍦ㄦ祻瑙堝櫒涓墦寮€鐢熸垚鐨?`.editable.html`
2. **鐐瑰嚮閫変腑** 鈥?榧犳爣鐐瑰嚮椤甸潰浠绘剰鍏冪礌锛岃閫変腑鍏冪礌浼氭樉绀鸿摑鑹茶竟妗?3. **鍙戦€佸埌 AI** 鈥?鐐瑰嚮宸ュ叿鏍忓乏渚х殑銆岎煉?鍙戦€佸埌 AI銆嶆寜閽?4. **澶嶅埗淇℃伅** 鈥?鍏冪礌淇℃伅宸茶嚜鍔ㄥ鍒跺埌鍓创鏉?5. **绮樿创瀵硅瘽** 鈥?鍥炲埌 AI 瀵硅瘽妗嗭紝Ctrl+V 绮樿创锛屾弿杩颁綘鎯虫€庝箞鏀?6. **瀵煎嚭** 鈥?鏀瑰畬鍚庣偣銆屼笅杞?HTML銆嶅鍑哄共鍑€婧愭枃浠?
---

## 鍏冪礌淇℃伅鏍煎紡

鐐瑰嚮銆屽彂閫佸埌 AI銆嶅悗锛屽壀璐存澘鍐呭绀轰緥锛?
```yaml
馃搷 閫変腑鍏冪礌锛?div>
  ID: #main-header
  Class: .hero-section.container
  閫夋嫨鍣ㄨ矾寰? body > div#app > header#main-header.hero-section.container
  鏂囧瓧鍐呭: 娆㈣繋浣跨敤鎴戜滑鐨勪骇鍝?鈥?璁╁姙鍏粠"鎿嶄綔"鍙樻垚"瀵硅瘽"
  浣嶇疆: x=0, y=80, w=1200, h=400
  鏍峰紡: 16px / rgb(51,51,51) / flex
```

AI 鏀跺埌杩欎簺淇℃伅鍚庯紝鍙互绮惧噯瀹氫綅鍒拌鍏冪礌骞剁粰鍑轰慨鏀瑰缓璁€?
---

## 鏂囦欢缁撴瀯

```
ai-html-bridge/
鈹溾攢鈹€ README.md                        # 鏈枃妗?鈹溾攢鈹€ SKILL.md                        # QClaw Skill 鍏冩暟鎹?鈹溾攢鈹€ scripts/
鈹?  鈹斺攢鈹€ start-editor.mjs            # 涓€閿惎鍔ㄨ剼鏈?鈹斺攢鈹€ assets/
    鈹斺攢鈹€ ai-bridge-runtime.js        # AI 妗ユ帴杩愯鏃惰ˉ涓?```

---

## 鎶€鏈師鐞?
1. 璋冪敤 `html-mender` 鐨?`inject-html-editor.mjs` 鍦ㄦ簮 HTML 涓敞鍏ュ彲瑙嗗寲缂栬緫鍣?2. 鍦?`</body>` 鍓嶈拷鍔?`ai-bridge-runtime.js` 琛ヤ竵
3. 琛ヤ竵閫氳繃 `window.__htmlSlideMenderBootstrap.editor` 璁块棶缂栬緫鍣ㄥ疄渚?4. 鍦ㄧ紪杈戝櫒宸ュ叿鏍忔彃鍏ャ€岎煉?鍙戦€佸埌 AI銆嶆寜閽?5. 鐐瑰嚮鏃堕€氳繃 `editor.selectedItem()` 鑾峰彇閫変腑鍏冪礌鐨?DOM 鑺傜偣
6. 鎻愬彇鍏冪礌淇℃伅骞跺鍒跺埌鍓创鏉匡紝鍚屾椂寮圭獥灞曠ず

---

## 渚濊禆

| 渚濊禆 | 璇存槑 |
|------|------|
| Node.js 16+ | 杩愯鑴氭湰 |
| html-mender | 鍙鍖栫紪杈戝櫒锛堣嚜鍔ㄦ娴嬪畨瑁咃級 |

---

## License

MIT

---

## English

### AI HTML Bridge 鈥?Visual HTML Editor + AI Chat Bridge

**AI HTML Bridge** injects a visual HTML editor into any local `.html` file. After selecting an element in the browser, click "馃挰 Send to AI" to copy the element's structural information to your clipboard 鈥?paste it into any AI chat and the AI knows exactly which element you want to modify.

### Quick Start

```bash
# Requires: Node.js 16+, html-mender (auto-installed)
node scripts/start-editor.mjs /path/to/page.html
```

### Workflow

```
You: Edit this HTML file
AI:   Runs start-editor.mjs 鈫?generates .editable.html 鈫?opens browser
You:  Click an element 鈫?click "馃挰 Send to AI"
You:  Ctrl+V in AI chat 鈫?"Make this header red"
AI:   Locates the element via selector 鈫?modifies source HTML
```

### Features

- Visual select / drag / resize / edit text / replace images
- One-click element info copy (tag, ID, class, selector path, text, position, styles)
- Works with any local HTML file
- Zero config, just run one command
