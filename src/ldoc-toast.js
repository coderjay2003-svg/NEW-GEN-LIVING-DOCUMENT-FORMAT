/**
 * LDOC Unified Notification & Dialog Engine
 * Eliminates native alert() and confirm() across LDOC Studio and Creator.
 * Provides non-blocking toasts, recovery banners, and interactive modals.
 */
(function (global) {
  'use strict';

  // Ensure DOM container for toasts exists
  function ensureToastContainer() {
    let container = document.getElementById('ldoc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ldoc-toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      container.style.cssText = [
        'position: fixed',
        'bottom: 24px',
        'right: 24px',
        'display: flex',
        'flex-direction: column-reverse',
        'gap: 8px',
        'z-index: 100000',
        'pointer-events: none',
        'max-width: 420px'
      ].join(';');
      document.body.appendChild(container);
    }
    return container;
  }

  // Ensure banner container exists
  function ensureBannerContainer() {
    let banner = document.getElementById('ldoc-repair-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'ldoc-repair-banner';
      banner.style.cssText = [
        'position: fixed',
        'top: 48px',
        'left: 50%',
        'transform: translateX(-50%)',
        'display: none',
        'align-items: center',
        'gap: 12px',
        'padding: 10px 20px',
        'background: rgba(15, 23, 42, 0.95)',
        'backdrop-filter: blur(16px)',
        '-webkit-backdrop-filter: blur(16px)',
        'border: 1px solid rgba(167, 139, 250, 0.4)',
        'border-radius: 9999px',
        'box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(124, 58, 237, 0.25)',
        'color: #f8fafc',
        'font-size: 13px',
        'font-family: Plus Jakarta Sans, system-ui, sans-serif',
        'font-weight: 600',
        'z-index: 99999',
        'transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      ].join(';');
      document.body.appendChild(banner);
    }
    return banner;
  }

  const safeRaf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb) => setTimeout(cb, 16);

  const LDocToast = {
    show: function (message, type = 'info', duration = 3500) {
      if (typeof document === 'undefined') return;
      const container = ensureToastContainer();

      const toast = document.createElement('div');
      toast.className = `ldoc-toast ldoc-toast-${type}`;

      let icon = 'ℹ️';
      let border = 'rgba(56, 189, 248, 0.4)';
      let bg = 'rgba(15, 23, 42, 0.96)';
      let color = '#38bdf8';

      if (type === 'ok' || type === 'success') {
        icon = '✓';
        border = 'rgba(52, 211, 153, 0.45)';
        color = '#34d399';
      } else if (type === 'err' || type === 'error') {
        icon = '✕';
        border = 'rgba(248, 113, 113, 0.5)';
        color = '#f87171';
      } else if (type === 'warn' || type === 'warning') {
        icon = '⚠️';
        border = 'rgba(251, 191, 36, 0.5)';
        color = '#fbbf24';
      }

      toast.style.cssText = [
        `background: ${bg}`,
        `border: 1px solid ${border}`,
        'backdrop-filter: blur(20px)',
        '-webkit-backdrop-filter: blur(20px)',
        'border-radius: 10px',
        'padding: 10px 16px',
        'color: #f1f5f9',
        'font-size: 12.5px',
        'font-family: Plus Jakarta Sans, system-ui, sans-serif',
        'font-weight: 500',
        'box-shadow: 0 12px 36px rgba(0,0,0,0.7)',
        'display: flex',
        'align-items: center',
        'gap: 10px',
        'pointer-events: auto',
        'opacity: 0',
        'transform: translateY(12px)',
        'transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        'line-height: 1.4'
      ].join(';');

      toast.innerHTML = `<span style="color:${color};font-weight:700;font-size:14px">${icon}</span> <span>${message}</span>`;
      container.appendChild(toast);

      // Animate in
      safeRaf(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      // Auto dismiss
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => {
          if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 250);
      }, duration);
    },

    banner: function (message, isSuccess = false, actionButton = null) {
      if (typeof document === 'undefined') return;
      const banner = ensureBannerContainer();

      const color = isSuccess ? '#34d399' : '#fbbf24';
      const icon = isSuccess ? '✓' : '⚡';

      banner.innerHTML = `
        <span style="color:${color};font-size:15px">${icon}</span>
        <span>${message}</span>
        ${actionButton ? `<button id="ldoc-banner-action-btn" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;padding:3px 10px;font-size:11.5px;cursor:pointer;margin-left:6px">${actionButton.text}</button>` : ''}
        <button onclick="LDocToast.hideBanner()" style="background:none;border:none;color:#94a3b8;font-size:14px;cursor:pointer;padding:0 4px;margin-left:4px">✕</button>
      `;

      if (actionButton && actionButton.onClick) {
        const btn = banner.querySelector('#ldoc-banner-action-btn');
        if (btn) btn.onclick = actionButton.onClick;
      }

      banner.style.display = 'flex';
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(-10px)';

      safeRaf(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateX(-50%) translateY(0)';
      });

      if (isSuccess) {
        setTimeout(() => {
          LDocToast.hideBanner();
        }, 5000);
      }
    },

    hideBanner: function () {
      const banner = document.getElementById('ldoc-repair-banner');
      if (!banner) return;
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(-10px)';
      setTimeout(() => {
        banner.style.display = 'none';
      }, 250);
    },

    confirm: function (title, message, onConfirm, onCancel) {
      if (typeof document === 'undefined') {
        if (onConfirm) onConfirm();
        return;
      }

      let modal = document.getElementById('ldoc-confirm-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ldoc-confirm-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('tabindex', '-1');
        modal.style.cssText = [
          'position: fixed',
          'inset: 0',
          'background: rgba(0, 0, 0, 0.75)',
          'backdrop-filter: blur(12px)',
          '-webkit-backdrop-filter: blur(12px)',
          'display: flex',
          'align-items: center',
          'justify-content: center',
          'z-index: 100001',
          'opacity: 0',
          'pointer-events: none',
          'transition: opacity 0.2s ease'
        ].join(';');
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(167,139,250,0.35);box-shadow:0 24px 60px rgba(0,0,0,0.85);border-radius:14px;width:min(90vw,440px);padding:24px;color:#f8fafc;font-family:Plus Jakarta Sans,system-ui,sans-serif">
          <div style="font-size:16px;font-weight:700;color:#fef08a;margin-bottom:8px">${title || 'Confirm Action'}</div>
          <div style="font-size:13px;color:#cbd5e1;line-height:1.5;margin-bottom:20px">${message}</div>
          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button id="ldoc-confirm-cancel" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#cbd5e1;border-radius:8px;padding:7px 16px;font-size:12.5px;font-weight:600;cursor:pointer">Cancel</button>
            <button id="ldoc-confirm-ok" style="background:linear-gradient(135deg,#7c3aed,#a855f7);border:1px solid #c084fc;color:#fff;border-radius:8px;padding:7px 18px;font-size:12.5px;font-weight:700;cursor:pointer">Confirm</button>
          </div>
        </div>
      `;

      modal.style.pointerEvents = 'auto';
      modal.style.opacity = '1';

      const close = () => {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
      };

      modal.querySelector('#ldoc-confirm-ok').onclick = () => {
        close();
        if (onConfirm) onConfirm();
      };

      modal.querySelector('#ldoc-confirm-cancel').onclick = () => {
        close();
        if (onCancel) onCancel();
      };
    }
  };

  // ── Universal Transparent Help Pop-up System (Cursor + Touch) ──────────────
  let helpTooltipEl = null;
  let helpShowTimer = null;
  let helpHideTimer = null;
  let currentTargetEl = null;

  function ensureHelpTooltipContainer() {
    if (!helpTooltipEl && typeof document !== 'undefined') {
      helpTooltipEl = document.getElementById('ldoc-help-tooltip');
      if (!helpTooltipEl) {
        helpTooltipEl = document.createElement('div');
        helpTooltipEl.id = 'ldoc-help-tooltip';
        helpTooltipEl.setAttribute('role', 'tooltip');
        helpTooltipEl.setAttribute('aria-hidden', 'true');
        helpTooltipEl.style.cssText = [
          'position: fixed',
          'z-index: 1000002',
          'pointer-events: none',
          'max-width: 320px',
          'min-width: 140px',
          'padding: 8px 12px',
          'background: rgba(8, 14, 28, 0.82)',
          'backdrop-filter: blur(16px) saturate(180%)',
          '-webkit-backdrop-filter: blur(16px) saturate(180%)',
          'border: 1px solid rgba(56, 189, 248, 0.35)',
          'border-radius: 10px',
          'box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 16px rgba(56, 189, 248, 0.22)',
          'color: #f1f5f9',
          'font-family: Plus Jakarta Sans, system-ui, -apple-system, sans-serif',
          'font-size: 11.5px',
          'line-height: 1.45',
          'opacity: 0',
          'transform: translateY(4px) scale(0.96)',
          'transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
          'display: none',
          'box-sizing: border-box'
        ].join(';');
        document.body.appendChild(helpTooltipEl);
      }
    }
    return helpTooltipEl;
  }

  const HELP_CATALOG = {
    // Live Flow & Pretext Tools
    'live-flow-toggle-btn': {
      title: '🌊 Pretext Real-Time Text Flow',
      desc: 'Toggle 120fps magnetic fluid reflow. Words part around moving cards in real time with zero layout thrashing.',
      badge: '120fps Pretext Flow'
    },
    'pretext-split-cols-btn': {
      title: '📰 2-Column Magazine Split',
      desc: 'Splits active paragraph into two mathematically balanced editorial columns computed via Pretext arithmetic with zero drift.',
      badge: 'Pretext Column Engine'
    },
    'showcase-demo-btn': {
      title: '⚡ Pretext Living Showcase',
      desc: 'Loads complete interactive demo featuring Ethan Holland\'s video deep dive, action chips, and real-time fluid reflow.',
      badge: 'Interactive Demo'
    },
    'insert-video-btn': {
      title: '🎬 In-Canvas Video Player',
      desc: 'Inserts a draggable 16:9 YouTube or MP4 video card into this slide with real-time text avoidance.',
      badge: 'Media Obstacle Flow'
    },
    'free-text-btn': {
      title: '✍️ Add Free Text Box',
      desc: 'Creates a dynamic ambient text box with deterministic auto-grow height and multi-script auto-detection.',
      badge: 'Zero Reflow Lag'
    },
    'fit-slide-text-btn': {
      title: '🗜️ One-Click Shrink to Fit',
      desc: 'Binary-searches the maximum font size in <0.2ms to fit this text box perfectly without slide overflow.',
      badge: 'Binary Search Fit'
    },
    'dmenu-zero-drift': {
      title: '🔒 100% Zero-Drift Verified',
      desc: 'Audits bit-for-bit typography and line break parity across Screen, Editor, Viewer, and PDF export.',
      badge: 'Pretext Geometry Audit'
    },
    'save-active-btn': {
      title: '💾 Save .ldocx Document',
      desc: 'Compiles all slides, media cards, and text into a portable, cryptographically verified .ldocx archive.',
      hotkey: 'Ctrl+S'
    },
    'save-btn': {
      title: '💾 Save .ldocx Document',
      desc: 'Compiles and packages this living document into an archival .ldocx container with Merkle tree verification.',
      hotkey: 'Ctrl+S'
    },
    'ed-open-btn': {
      title: '📂 Open .ldocx Document',
      desc: 'Loads and decompresses any .ldocx archive with full multi-layer fidelity.',
      hotkey: 'Ctrl+O'
    },
    'build-btn': {
      title: '▶ Build & View',
      desc: 'Compiles active document and launches the interactive presentation viewer.'
    },
    'pages-toggle-btn': {
      title: '📑 Slide Deck Navigator',
      desc: 'Toggles the slide thumbnail sidebar to browse, reorder, or add new slides.',
      hotkey: 'Ctrl+Shift+A'
    },
    'ed-undo-btn': {
      title: '↩ Undo Edit',
      desc: 'Reverts your most recent text edit, layout move, or formatting change.',
      hotkey: 'Ctrl+Z'
    },
    'ed-redo-btn': {
      title: '↪ Redo Edit',
      desc: 'Re-applies the action that was recently undone.',
      hotkey: 'Ctrl+Y'
    },
    'fx-wizard-btn': {
      title: '🪄 FX & Atmosphere Wizard',
      desc: 'Configures live 3D shaders, cosmic background nebulae, and ambient particle effects.'
    },
    'fx-menu-btn': {
      title: '✨ Visual FX Menu',
      desc: 'Select dynamic canvas effects: fluid water waves, cyber stardust, or crystal shards.'
    },
    'hud-chip': {
      title: '🏷️ +Chip Menu',
      desc: 'Inserts interactive inline badges, action buttons, pay links, or video chips without mid-token line breaks.',
      badge: 'Unbreakable Token'
    },
    'hud-fit': {
      title: '⚡ One-Click Shrink-to-Fit',
      desc: 'Calculates the optimal font size using Pretext binary search in <0.2ms.',
      badge: 'Pretext Optimizer'
    },
    'hud-del': {
      title: '🗑️ Delete Element',
      desc: 'Removes the selected text box or media card from the active slide.'
    },
    'hud-dup': {
      title: '📋 Duplicate Element',
      desc: 'Duplicates this element with identical styling at an offset position.'
    },
    'ldoc-fit-indicator': {
      title: '📊 Capacity & Fit Gauge',
      desc: 'Visual capacity monitor showing active line count versus maximum capacity before page overflow.'
    },
    'ldoc-script-indicator': {
      title: '🌐 Multi-Script Indicator',
      desc: 'Indicates automatically detected script direction (Arabic/Hebrew RTL, CJK, Latin).'
    },
    'video-card-drag-bar': {
      title: '✋ Drag Video Card',
      desc: 'Drag this video player anywhere on the canvas. Text will part like water in real time.'
    },
    'video-flow-btn': {
      title: '🌊 Reflow Surrounding Text',
      desc: 'Re-carves paragraph boundaries around this card\'s active bounding box.'
    },
    'video-card-del': {
      title: '✕ Remove Video Card',
      desc: 'Deletes this video card from the slide.'
    }
  };

  const UI_SELECTOR = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[data-help]',
    '[data-tooltip]',
    '[title]',
    '.toolbar-btn',
    '.hud-btn',
    '.tab-btn',
    '.mode-pill-btn',
    '.ft-chip-item',
    '.dmenu-item',
    '.dmenu-zero-drift-badge',
    '.ldoc-fit-indicator',
    '.ldoc-script-indicator',
    '.video-flow-btn',
    '.video-card-drag-bar',
    '.video-card-del',
    '.btn',
    '.ft-fit-btn'
  ].join(',');

  function findUiElement(target) {
    if (!target || target === document.body || target === document.documentElement) return null;
    return target.closest(UI_SELECTOR);
  }

  function resolveHelpData(el) {
    if (!el || el.nodeType !== 1) return null;

    // 1. Explicit data attributes
    const dataHelp = el.getAttribute('data-help') || el.getAttribute('data-tooltip') || el.getAttribute('data-desc');
    const dataTitle = el.getAttribute('data-help-title');
    if (dataHelp) {
      return {
        title: dataTitle || el.getAttribute('aria-label') || (el.innerText ? el.innerText.trim().slice(0, 30) : 'UI Tool'),
        desc: dataHelp,
        hotkey: el.getAttribute('data-hotkey') || '',
        badge: el.getAttribute('data-badge') || ''
      };
    }

    // 2. Exact ID match in HELP_CATALOG
    if (el.id && HELP_CATALOG[el.id]) {
      return Object.assign({}, HELP_CATALOG[el.id]);
    }

    // 3. Class match in HELP_CATALOG
    if (el.classList) {
      for (const cls of el.classList) {
        if (HELP_CATALOG[cls]) return Object.assign({}, HELP_CATALOG[cls]);
      }
    }

    // 4. Stashed or current title attribute
    const titleAttr = el.__ldocTitle || el.getAttribute('title');
    if (titleAttr && titleAttr.trim()) {
      const raw = titleAttr.trim();
      let hotkey = '';
      const hkMatch = raw.match(/\((Ctrl\+[A-Za-z0-9+]+|F[0-9]+|Shift\+[A-Za-z0-9+]+)\)/i);
      if (hkMatch) hotkey = hkMatch[1];

      let cleanDesc = raw.replace(/\((Ctrl\+[A-Za-z0-9+]+|F[0-9]+|Shift\+[A-Za-z0-9+]+)\)/i, '').trim();

      if (cleanDesc.includes(':')) {
        const parts = cleanDesc.split(':');
        const t = parts[0].trim();
        const d = parts.slice(1).join(':').trim();
        return {
          title: t,
          desc: d,
          hotkey: hotkey,
          badge: (raw.toLowerCase().includes('pretext') || raw.toLowerCase().includes('zero-drift')) ? 'Pretext Powered' : ''
        };
      }

      const btnText = el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 32) : '';
      if (btnText && btnText !== cleanDesc && btnText.length > 1 && btnText.length < 30) {
        return {
          title: btnText,
          desc: cleanDesc,
          hotkey: hotkey,
          badge: (raw.toLowerCase().includes('pretext') || raw.toLowerCase().includes('zero-drift')) ? 'Pretext Powered' : ''
        };
      }

      return {
        title: el.getAttribute('aria-label') || 'Action Tool',
        desc: cleanDesc,
        hotkey: hotkey,
        badge: ''
      };
    }

    // 5. Buttons with aria-label or descriptive text
    const aria = el.getAttribute('aria-label');
    if (aria && aria.trim()) {
      return {
        title: (el.innerText ? el.innerText.trim().slice(0, 30) : '') || 'Action Tool',
        desc: aria.trim(),
        hotkey: '',
        badge: ''
      };
    }

    return null;
  }

  const LDocHelpTooltip = {
    show: function (target, isTouch = false) {
      if (!target) return;
      const data = resolveHelpData(target);
      if (!data || !data.desc) return;

      // Suppress browser native tooltip
      if (target.hasAttribute('title') && !target.__ldocTitle) {
        target.__ldocTitle = target.getAttribute('title');
        target.removeAttribute('title');
      }

      const tip = ensureHelpTooltipContainer();
      if (!tip) return;

      currentTargetEl = target;

      tip.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
          <div style="font-weight:800;color:#38bdf8;font-size:12px;letter-spacing:0.2px">${data.title || 'UI Tool'}</div>
          ${data.hotkey ? `<span style="background:rgba(255,255,255,0.12);padding:1px 6px;border-radius:4px;font-size:9.5px;color:#94a3b8;font-family:monospace;font-weight:600">${data.hotkey}</span>` : ''}
        </div>
        <div style="color:#cbd5e1;font-size:11px;line-height:1.45">${data.desc}</div>
        ${data.badge ? `<div style="margin-top:6px;display:inline-flex;align-items:center;gap:4px;font-size:9.5px;color:#34d399;font-weight:700">⚡ ${data.badge}</div>` : ''}
      `;

      tip.style.display = 'block';
      tip.style.opacity = '0';
      tip.style.transform = 'translateY(4px) scale(0.96)';

      const rect = target.getBoundingClientRect();
      const tipW = tip.offsetWidth || 240;
      const tipH = tip.offsetHeight || 60;

      let left = rect.left + (rect.width / 2) - (tipW / 2);
      left = Math.max(12, Math.min(left, (window.innerWidth || 1024) - tipW - 12));

      let top = rect.top - tipH - 8;
      if (top < 12) {
        top = rect.bottom + 8;
      }

      tip.style.left = Math.round(left) + 'px';
      tip.style.top = Math.round(top) + 'px';

      safeRaf(() => {
        tip.style.opacity = '1';
        tip.style.transform = 'translateY(0) scale(1)';
        tip.setAttribute('aria-hidden', 'false');
      });

      if (isTouch) {
        clearTimeout(helpHideTimer);
        helpHideTimer = setTimeout(LDocHelpTooltip.hide, 3400);
      }
    },

    hide: function () {
      clearTimeout(helpShowTimer);
      clearTimeout(helpHideTimer);
      if (!helpTooltipEl) return;

      helpTooltipEl.style.opacity = '0';
      helpTooltipEl.style.transform = 'translateY(4px) scale(0.96)';
      helpTooltipEl.setAttribute('aria-hidden', 'true');

      if (currentTargetEl && currentTargetEl.__ldocTitle) {
        currentTargetEl.setAttribute('title', currentTargetEl.__ldocTitle);
        delete currentTargetEl.__ldocTitle;
      }
      currentTargetEl = null;

      setTimeout(() => {
        if (helpTooltipEl && helpTooltipEl.getAttribute('aria-hidden') === 'true') {
          helpTooltipEl.style.display = 'none';
        }
      }, 180);
    },

    register: function (idOrClass, helpData) {
      if (idOrClass && helpData) {
        HELP_CATALOG[idOrClass] = helpData;
      }
    }
  };

  // Attach global UI event listeners for cursor and touch interactions
  if (typeof document !== 'undefined') {
    // 1. Cursor Hover (pointerover / pointerout)
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType === 'touch') return;
      const el = findUiElement(e.target);
      if (!el) {
        LDocHelpTooltip.hide();
        return;
      }
      if (el === currentTargetEl) return;
      clearTimeout(helpShowTimer);
      helpShowTimer = setTimeout(() => LDocHelpTooltip.show(el, false), 140);
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
      if (e.pointerType === 'touch') return;
      const el = findUiElement(e.target);
      if (el) {
        if (e.relatedTarget && el.contains(e.relatedTarget)) return;
        LDocHelpTooltip.hide();
      }
    }, { passive: true });

    // 2. Touch Interaction (pointerdown with touch or touchstart)
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      const el = findUiElement(e.target);
      if (el) {
        LDocHelpTooltip.show(el, true);
      } else {
        LDocHelpTooltip.hide();
      }
    }, { passive: true });

    document.addEventListener('touchstart', function (e) {
      if (typeof PointerEvent !== 'undefined') return;
      const touch = e.touches && e.touches[0];
      if (!touch) return;
      const el = findUiElement(document.elementFromPoint(touch.clientX, touch.clientY));
      if (el) {
        LDocHelpTooltip.show(el, true);
      } else {
        LDocHelpTooltip.hide();
      }
    }, { passive: true });

    // 3. Dismiss on scroll
    window.addEventListener('scroll', function () {
      LDocHelpTooltip.hide();
    }, { passive: true });
  }

  // Safe global aliases
  const targetScope = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
  targetScope.LDocToast = LDocToast;
  targetScope.LDocHelpTooltip = LDocHelpTooltip;
  global.LDocToast = LDocToast;
  global.LDocHelpTooltip = LDocHelpTooltip;
  global.toast = function (msg, type) {
    LDocToast.show(msg, type);
  };
  global.showToast = function (msg, type) {
    LDocToast.show(msg, type);
  };
  global.showRepairBanner = function (msg, isSuccess) {
    LDocToast.banner(msg, isSuccess);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LDocToast, LDocHelpTooltip };
  }

  // Safe non-blocking alert override in browser environment
  if (typeof window !== 'undefined') {
    window.alert = function (msg) {
      LDocToast.show(String(msg), 'info', 4000);
    };
  }

})(typeof window !== 'undefined' ? window : this);

