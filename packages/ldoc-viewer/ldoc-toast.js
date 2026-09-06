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

  // Safe global aliases
  global.LDocToast = LDocToast;
  global.toast = function (msg, type) {
    LDocToast.show(msg, type);
  };
  global.showToast = function (msg, type) {
    LDocToast.show(msg, type);
  };
  global.showRepairBanner = function (msg, isSuccess) {
    LDocToast.banner(msg, isSuccess);
  };

  // Safe non-blocking alert override in browser environment
  if (typeof window !== 'undefined') {
    window.alert = function (msg) {
      LDocToast.show(String(msg), 'info', 4000);
    };
  }

})(typeof window !== 'undefined' ? window : this);
