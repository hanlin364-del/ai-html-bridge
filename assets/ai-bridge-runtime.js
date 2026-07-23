// ai-bridge-runtime.js
// 注入到 HTML Mender 编辑器页面，在工具栏添加「发送到AI」按钮
(function () {
  'use strict';

  var BRIDGE_KEY = '__htmlMenderAiBridge';
  var injected = false;
  var retryCount = 0;
  var MAX_RETRY = 30;

  // ---- 工具函数 ----
  function getSelectorPath(el) {
    if (!el || el.nodeType !== 1) return '';
    var parts = [];
    var node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      var part = node.tagName.toLowerCase();
      if (node.id) {
        part += '#' + node.id;
        parts.unshift(part);
        break;
      }
      if (node.className && typeof node.className === 'string') {
        var cls = node.className.trim().split(/\s+/).slice(0, 3).join('.');
        if (cls) part += '.' + cls;
      }
      var parent = node.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children).filter(function (c) {
          return c.tagName === node.tagName;
        });
        if (siblings.length > 1) {
          part += ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')';
        }
      }
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  }

  function getTextSummary(el) {
    if (!el) return '';
    var text = el.textContent || el.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 150) text = text.slice(0, 150) + '…';
    return text;
  }

  function getElementInfo(el) {
    if (!el) return null;
    var rect = el.getBoundingClientRect();
    var styles = window.getComputedStyle(el);
    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      className:
        typeof el.className === 'string'
          ? el.className.trim().replace(/\s+/g, ' ')
          : '',
      selectorPath: getSelectorPath(el),
      textSummary: getTextSummary(el),
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      styles: {
        fontSize: styles.fontSize,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        display: styles.display,
        position: styles.position,
        margin: styles.margin,
        padding: styles.padding,
      },
      innerHTML: el.innerHTML.length > 500 ? el.innerHTML.slice(0, 500) + '…' : el.innerHTML,
    };
  }

  function buildDescription(info) {
    if (!info) return '没有选中元素';
    var lines = [];
    lines.push('📍 选中元素：<' + info.tagName + '>');
    if (info.id) lines.push('  ID: #' + info.id);
    if (info.className) lines.push('  Class: .' + info.className.split(/\s+/).join('.'));
    lines.push('  选择器路径: ' + info.selectorPath);
    if (info.textSummary) lines.push('  文字内容: ' + info.textSummary);
    lines.push(
      '  位置: x=' +
        info.rect.x +
        ', y=' +
        info.rect.y +
        ', w=' +
        info.rect.width +
        ', h=' +
        info.rect.height
    );
    lines.push(
      '  样式: ' +
        info.styles.fontSize +
        ' / ' +
        info.styles.color +
        ' / ' +
        info.styles.display
    );
    return lines.join('\n');
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText =
      'position:fixed;top:60px;left:50%;transform:translateX(-50%);' +
      'background:rgba(15,23,42,0.92);color:#fff;padding:10px 24px;' +
      'border-radius:8px;font-size:13px;z-index:999999;pointer-events:none;' +
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
      'box-shadow:0 4px 20px rgba(0,0,0,0.25);';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2200);
  }

  function showElementDialog(info, description) {
    var existing = document.getElementById('ai-bridge-dialog');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'ai-bridge-dialog';
    overlay.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);' +
      'z-index:999998;display:flex;align-items:center;justify-content:center;';

    var dialog = document.createElement('div');
    dialog.style.cssText =
      'background:#fff;border-radius:12px;padding:24px;max-width:560px;' +
      'width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);' +
      'font-family:Inter,system-ui,-apple-system,sans-serif;';

    var title = document.createElement('h3');
    title.textContent = '选中元素信息';
    title.style.cssText = 'margin:0 0 16px;font-size:16px;color:#1a1a1a;';
    dialog.appendChild(title);

    var pre = document.createElement('pre');
    pre.textContent = description;
    pre.style.cssText =
      'background:#f5f7f9;border:1px solid #e8e8ec;border-radius:8px;' +
      'padding:14px;font-size:12px;line-height:1.7;white-space:pre-wrap;' +
      'word-break:break-all;max-height:320px;overflow-y:auto;margin:0 0 16px;';
    dialog.appendChild(pre);

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;';

    var copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 复制';
    copyBtn.style.cssText =
      'padding:8px 16px;border:1px solid #d0d5dd;border-radius:6px;' +
      'background:#fff;color:#424242;cursor:pointer;font-size:13px;';
    copyBtn.addEventListener('click', function () {
      var range = document.createRange();
      range.selectNodeContents(pre);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand('copy');
        copyBtn.textContent = '✅ 已复制';
        setTimeout(function () {
          copyBtn.textContent = '📋 复制';
        }, 1500);
      } catch (e) {
        copyBtn.textContent = '❌ 复制失败';
      }
    });

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ 关闭';
    closeBtn.style.cssText =
      'padding:8px 16px;border:none;border-radius:6px;' +
      'background:#2367eb;color:#fff;cursor:pointer;font-size:13px;';
    closeBtn.addEventListener('click', function () {
      overlay.remove();
    });

    btnRow.appendChild(copyBtn);
    btnRow.appendChild(closeBtn);
    dialog.appendChild(btnRow);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  // ---- 核心注入逻辑 ----
  function getEditor() {
    // 优先从 bootstrap 获取
    if (window.__htmlSlideMenderBootstrap && window.__htmlSlideMenderBootstrap.editor) {
      return window.__htmlSlideMenderBootstrap.editor;
    }
    // 回退：遍历 HtmlSlideMenderExtension 查找
    var ns = window.HtmlSlideMenderExtension;
    if (ns) {
      // 可能存在实例属性
      for (var key in ns) {
        var val = ns[key];
        if (val && typeof val === 'object' && val.toolbar && val.selectedItem) {
          return val;
        }
      }
    }
    return null;
  }

  function injectButton() {
    if (injected) return;
    retryCount++;

    var editor = getEditor();
    if (!editor) {
      if (retryCount < MAX_RETRY) {
        setTimeout(injectButton, 400);
      }
      return;
    }

    var toolbar = editor.toolbar;
    if (!toolbar) {
      if (retryCount < MAX_RETRY) {
        setTimeout(injectButton, 400);
      }
      return;
    }

    // Shadow DOM 内检查
    if (toolbar.querySelector('[data-action="send-to-ai"]')) {
      injected = true;
      return;
    }

    // 创建按钮
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-action', 'send-to-ai');
    btn.style.cssText =
      'flex-shrink:0;border:0;border-left:1px solid rgba(148,163,184,0.34);' +
      'background:linear-gradient(135deg,#2367eb,#0f766e);color:#fff;' +
      'font:inherit;font-size:12px;font-weight:600;padding:0 14px;' +
      'cursor:pointer;display:inline-flex;align-items:center;gap:4px;' +
      'white-space:nowrap;height:100%;';
    btn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
      '</svg>发送到AI';

    // 插入到「下载HTML」按钮之前
    var downloadBtn = toolbar.querySelector('[data-action="download"]');
    if (downloadBtn && downloadBtn.parentElement) {
      downloadBtn.parentElement.insertBefore(btn, downloadBtn);
    } else {
      // 回退：找到 .group-default 或 toolbar-body
      var group = toolbar.querySelector('.group-default') || toolbar.querySelector('.toolbar-body');
      if (group) {
        group.appendChild(btn);
      } else {
        toolbar.appendChild(btn);
      }
    }

    // 点击事件
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var item = editor.selectedItem ? editor.selectedItem() : null;
      var el = item && item.element ? item.element : null;

      if (!el) {
        // 尝试获取选中项的其他方式
        var selectedId = editor.selectedId;
        if (selectedId && editor.items) {
          var it = editor.items.get(selectedId);
          el = it && it.element ? it.element : null;
        }
      }

      if (!el) {
        showToast('👆 请先点击选中一个页面元素');
        return;
      }

      var info = getElementInfo(el);
      var description = buildDescription(info);

      // 复制到剪贴板
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(description)
          .then(function () {
            showToast('✅ 元素信息已复制，到AI对话框 Ctrl+V 粘贴');
          })
          .catch(function () {
            showElementDialog(info, description);
          });
      } else {
        showElementDialog(info, description);
      }

      // 通过 localStorage 跨页面通信
      try {
        var payload = {
          source: 'html-mender-ai-bridge',
          timestamp: Date.now(),
          elementInfo: info,
          description: description,
        };
        localStorage.setItem(BRIDGE_KEY, JSON.stringify(payload));
        window.dispatchEvent(
          new CustomEvent('html-mender-element-selected', { detail: payload })
        );
      } catch (err) {}
    });

    injected = true;
    console.log('[AI Bridge] 发送到AI按钮已注入');
  }

  // ---- 启动 ----
  function start() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(injectButton, 600);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(injectButton, 600);
      });
    }

    // 定期检查按钮是否还存在（编辑器可能重建工具栏）
    setInterval(function () {
      if (injected) {
        var editor = getEditor();
        if (editor && editor.toolbar) {
          // 在 Shadow DOM 内检查
          var btn = editor.toolbar.querySelector('[data-action="send-to-ai"]');
          if (!btn) {
            injected = false;
            retryCount = 0;
            injectButton();
          }
        }
      }
    }, 2000);
  }

  start();
})();
