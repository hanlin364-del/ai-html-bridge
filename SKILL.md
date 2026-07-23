---
name: ai-html-bridge
description: "鍙鍖?HTML 缂栬緫鍣?+ AI 瀵硅瘽妗ユ帴銆傚湪浠绘剰鏈湴 HTML 鏂囦欢涓敞鍏ュ彲瑙嗗寲缂栬緫鍣紝閫変腑椤甸潰鍏冪礌鍚庣偣銆屽彂閫佸埌AI銆嶆寜閽紝鍏冪礌淇℃伅锛堟爣绛俱€侀€夋嫨鍣ㄨ矾寰勩€佹枃瀛椼€佷綅缃€佹牱寮忥級鑷姩澶嶅埗鍒板壀璐存澘锛岀矘璐村埌 AI 瀵硅瘽妗嗗嵆鍙 AI 绮剧‘瀹氫綅淇敼銆傚熀浜?html-mender skill 鎵╁睍锛屾敮鎸佹墍鏈夋湰鍦?HTML 鏂囦欢銆?
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

# AI HTML Bridge 鈥?鍙鍖栫紪杈?+ AI 瀵硅瘽妗ユ帴

## 鍔熻兘

鍦ㄤ换鎰忔湰鍦?`.html` 鏂囦欢涓敞鍏ワ細
1. **HTML Mender 鍙鍖栫紪杈戝櫒** 鈥?閫変腑/鎷栨嫿/缂╂斁/缂栬緫鏂囧瓧/鍥剧墖
2. **AI 妗ユ帴鎸夐挳** 鈥?閫変腑鍏冪礌鍚庝竴閿鍒朵俊鎭埌鍓创鏉匡紝绮樿创鍒?AI 瀵硅瘽妗嗗嵆鍙簿纭憡鐭ヨ淇敼鐨勪綅缃?
## 浣跨敤鍦烘櫙

- 鐢ㄦ埛璇淬€岀紪杈戣繖涓?HTML銆嶃€屽彲瑙嗗寲璋冩暣銆嶃€屾垜瑕侀€変綅缃浣犳敼銆?- 鐢ㄦ埛鎯崇偣鍑?HTML 椤甸潰涓婄殑鏌愪釜浣嶇疆锛岀劧鍚庡憡璇?AI 瑕佹€庝箞璋冩暣
- 閫傜敤浜庯細钀藉湴椤点€乨emo 椤甸潰銆丠TML PPT銆丄I 鐢熸垚鐨勭綉椤电瓑

## 宸ヤ綔娴?
```
鐢ㄦ埛: 甯垜缂栬緫 xxx.html
AI:  杩愯 start-editor.mjs 鈫?鐢熸垚 .editable.html 鈫?鎵撳紑娴忚鍣?鐢ㄦ埛: 鍦ㄦ祻瑙堝櫒涓偣鍑婚〉闈㈠厓绱?鈫?鐐广€岎煉?鍙戦€佸埌AI銆?鐢ㄦ埛: 鍥炲埌 AI 瀵硅瘽妗?Ctrl+V 绮樿创 鈫?"鎶婅繖涓爣棰樻敼鎴愮孩鑹?
AI:  鏍规嵁绮樿创鐨勯€夋嫨鍣ㄨ矾寰勫畾浣嶄唬鐮?鈫?淇敼婧?HTML 鈫?閲嶆柊鐢熸垚
```

## 涓€閿惎鍔?
```bash
node <skill-dir>/scripts/start-editor.mjs <input.html>
```

鍙傛暟锛?- `<input.html>` 鈥?瑕佺紪杈戠殑 HTML 鏂囦欢璺緞锛堝繀濉級
- `--out <path>` 鈥?鑷畾涔夎緭鍑鸿矾寰勶紙鍙€夛紝榛樿 `<input>.editable.html`锛?- `--lang zh-CN|en` 鈥?缂栬緫鍣ㄨ瑷€锛堝彲閫夛紝榛樿 zh-CN锛?
## 鍏冪礌淇℃伅鏍煎紡

鐐瑰嚮銆岎煉?鍙戦€佸埌AI銆嶅悗锛屽壀璐存澘鍐呭鏍煎紡锛?
```
馃搷 閫変腑鍏冪礌锛?div>
  ID: #ai-panel
  Class: .ai-panel.hidden
  閫夋嫨鍣ㄨ矾寰? body > div#ai-panel.ai-panel.hidden
  鏂囧瓧鍐呭: 璇峰府鎴戠炕璇戣繖浠芥枃妗ｂ€?  浣嶇疆: x=320, y=156, w=480, h=52
  鏍峰紡: 14px / rgb(26,26,26) / flex
```

## 渚濊禆

- `html-mender` skill锛堣嚜鍔ㄥ畨瑁咃級
- Node.js

## 鎶€鏈疄鐜?
1. 璋冪敤 html-mender 鐨?`inject-html-editor.mjs` 鐢熸垚 `.editable.html`
2. 杩藉姞 `ai-bridge-runtime.js` 琛ヤ竵鍒版枃浠舵湯灏?3. 琛ヤ竵鍦ㄧ紪杈戝櫒灏辩华鍚庨€氳繃 `window.__htmlSlideMenderBootstrap.editor` 璁块棶缂栬緫鍣ㄥ疄渚?4. 鍦?Shadow DOM 鐨?toolbar 涓彃鍏ユ寜閽?5. 鐐瑰嚮鏃堕€氳繃 `editor.selectedItem()` 鑾峰彇閫変腑鍏冪礌鐨?DOM 鑺傜偣
6. 鎻愬彇鍏冪礌淇℃伅骞跺鍒跺埌鍓创鏉?