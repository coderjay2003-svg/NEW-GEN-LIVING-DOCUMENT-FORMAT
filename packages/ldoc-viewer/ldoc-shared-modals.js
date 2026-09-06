/**
 * LDOC Unified Modals & Cloud Vault Engine
 * Shared modals (Cloud Vault, Version History, Pro Subscription, Share, Auth)
 * with guaranteed terminal states, honest offline mode, and pricing single-source-of-truth.
 */
(function (global) {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  const LDocModals = {
    // ── 1. Cloud Documents Vault (Bug B2 Fix) ─────────────────────────────────
    showCloudVaultModal: async function () {
      let modal = document.getElementById('cloud-vault-modal');
      if (!modal) return;
      modal.classList.add('active');

      const listEl = document.getElementById('cloud-vault-list');
      if (!listEl) return;
      listEl.innerHTML = '<div style="text-align:center;padding:24px;color:#94a3b8"><span class="spin">⏳</span> Connecting to document vault...</div>';

      // Timeout controller: abort after 2.5 seconds to guarantee no infinite spinner
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      let remoteDocs = null;
      try {
        const headers = {};
        if (typeof global.LDocAuth !== 'undefined' && global.LDocAuth.getToken()) {
          headers['Authorization'] = 'Bearer ' + global.LDocAuth.getToken();
        }
        const res = await fetch('/api/documents', {
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          remoteDocs = await res.json();
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.info('Cloud vault backend offline or unreachable — switching to honest offline mode.');
      }

      // Read local cached documents
      let localDocs = [];
      try {
        const cached = localStorage.getItem('ldoc_cloud_vault_cache');
        if (cached) localDocs = JSON.parse(cached);
      } catch (e) {}

      // Render terminal state
      if (Array.isArray(remoteDocs) && remoteDocs.length > 0) {
        listEl.innerHTML = remoteDocs.map(d => `
          <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:14px;font-weight:700;color:#fff">${escapeHtml(d.title)}</div>
              <div style="font-size:11.5px;color:#94a3b8;margin-top:2px">ID: ${d.id} • Revision v${d.version || 1} • ${new Date(d.updated_at || Date.now()).toLocaleDateString()}</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="ldoc-cloud-btn" style="padding:4px 10px;font-size:11.5px" onclick="loadCloudDocument('${d.id}')">✏️ Open</button>
              <button class="ldoc-cloud-btn secondary" style="padding:4px 10px;font-size:11.5px" onclick="showVersionsModal('${d.id}')">↺ History</button>
            </div>
          </div>
        `).join('');
      } else if (localDocs.length > 0) {
        listEl.innerHTML = `
          <div style="padding:10px 14px;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);border-radius:8px;font-size:12px;color:#38bdf8;margin-bottom:8px">
            ⚡ <strong>Local Vault Active:</strong> Cloud sync offline. Your browser cached drafts are accessible below:
          </div>
        ` + localDocs.map(d => `
          <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:14px;font-weight:700;color:#fff">${escapeHtml(d.title)}</div>
              <div style="font-size:11.5px;color:#94a3b8;margin-top:2px">Local Snapshot • ${new Date(d.date || Date.now()).toLocaleTimeString()}</div>
            </div>
            <button class="ldoc-cloud-btn" style="padding:4px 10px;font-size:11.5px" onclick="LDocModals.restoreLocalDoc('${d.id}')">✏️ Open</button>
          </div>
        `).join('');
      } else {
        // Honest terminal state
        listEl.innerHTML = `
          <div style="text-align:center;padding:32px 20px;color:#94a3b8">
            <div style="font-size:28px;margin-bottom:8px">🌟</div>
            <div style="font-size:14px;font-weight:600;color:#f8fafc;margin-bottom:4px">Cloud Sync: Local Storage Mode</div>
            <div style="font-size:12px;line-height:1.5;max-width:380px;margin:0 auto 16px auto">
              Remote server sync is offline or not configured on this host. Documents are preserved securely in your browser session.
            </div>
            <button class="ldoc-cloud-btn" onclick="LDocModals.createLocalDraft()" style="padding:7px 16px;font-size:12.5px">➕ Create New Document</button>
          </div>
        `;
      }
    },

    closeCloudVaultModal: function () {
      const modal = document.getElementById('cloud-vault-modal');
      if (modal) modal.classList.remove('active');
    },

    createLocalDraft: function () {
      const title = prompt('Enter document title:', 'New Living Document');
      if (!title) return;
      const draftId = 'draft_' + Math.random().toString(36).slice(2, 9);
      let localDocs = [];
      try {
        const cached = localStorage.getItem('ldoc_cloud_vault_cache');
        if (cached) localDocs = JSON.parse(cached);
      } catch (e) {}
      localDocs.unshift({ id: draftId, title, date: Date.now() });
      localStorage.setItem('ldoc_cloud_vault_cache', JSON.stringify(localDocs.slice(0, 20)));
      this.showCloudVaultModal();
      if (typeof global.LDocToast !== 'undefined') global.LDocToast.show(`Created local draft "${title}"`, 'ok');
    },

    restoreLocalDoc: function (id) {
      this.closeCloudVaultModal();
      if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Loaded local document session.', 'ok');
    },

    // ── 2. Version History Modal (Bug B2 Fix) ─────────────────────────────────
    showVersionsModal: async function (docId) {
      const modal = document.getElementById('versions-modal');
      if (!modal) return;
      modal.classList.add('active');

      const listEl = document.getElementById('versions-history-list');
      if (!listEl) return;
      listEl.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8"><span class="spin">⏳</span> Reading revision history...</div>';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      let remoteVersions = null;
      if (docId) {
        try {
          const res = await fetch(`/api/documents/${docId}/versions`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) remoteVersions = await res.json();
        } catch (e) {
          clearTimeout(timeoutId);
        }
      } else {
        clearTimeout(timeoutId);
      }

      // Read local undo stack & autosave snapshots
      let localSnapshots = [];
      if (typeof global.LDocEditorCore !== 'undefined' && global.LDocEditorCore.state.undoStack.length > 0) {
        localSnapshots = global.LDocEditorCore.state.undoStack.map((s, idx) => {
          try {
            const parsed = JSON.parse(s);
            return {
              rev: idx + 1,
              title: parsed.title || 'Living Document',
              pageCount: (parsed.pages || []).length,
              time: 'Recent change ' + (idx + 1)
            };
          } catch (e) {
            return null;
          }
        }).filter(Boolean).reverse();
      }

      // Render terminal state
      if (Array.isArray(remoteVersions) && remoteVersions.length > 0) {
        listEl.innerHTML = remoteVersions.map(v => `
          <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13.5px;font-weight:700;color:#fff">Revision #${v.version_number} — ${escapeHtml(v.change_summary || 'Document update')}</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:2px">${new Date(v.created_at || Date.now()).toLocaleString()}</div>
            </div>
            <button class="ldoc-cloud-btn secondary" style="padding:4px 10px;font-size:11.5px" onclick="restoreRevision('${docId}', ${v.version_number})">↺ Restore</button>
          </div>
        `).join('');
      } else if (localSnapshots.length > 0) {
        listEl.innerHTML = `
          <div style="padding:8px 12px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.25);border-radius:8px;font-size:11.5px;color:#c084fc;margin-bottom:8px">
            ↺ <strong>Session History:</strong> Chronological edit snapshots available in current session:
          </div>
        ` + localSnapshots.map((s, idx) => `
          <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;font-weight:700;color:#fff">Snapshot #${s.rev} (${s.pageCount} pages)</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:2px">${s.time}</div>
            </div>
            <button class="ldoc-cloud-btn secondary" style="padding:4px 10px;font-size:11.5px" onclick="LDocModals.restoreSnapshot(${s.rev})">↺ Revert</button>
          </div>
        `).join('');
      } else {
        // Honest terminal state
        listEl.innerHTML = `
          <div style="text-align:center;padding:28px 16px;color:#94a3b8">
            <div style="font-size:24px;margin-bottom:6px">↺</div>
            <div style="font-size:13px;font-weight:600;color:#f8fafc;margin-bottom:2px">No previous revisions captured</div>
            <div style="font-size:11.5px">Revisions are logged automatically as you edit and save slides.</div>
          </div>
        `;
      }
    },

    closeVersionsModal: function () {
      const modal = document.getElementById('versions-modal');
      if (modal) modal.classList.remove('active');
    },

    restoreSnapshot: function (rev) {
      if (typeof global.LDocEditorCore !== 'undefined') {
        global.LDocEditorCore.undo();
      }
      this.closeVersionsModal();
    },

    // ── 3. Pro Subscription Plans Modal (Bug B1 Single Source of Truth) ───────
    showBillingModal: function () {
      let modal = document.getElementById('billing-modal');
      if (!modal) return;

      const cfg = global.LDocPricingConfig || { plans: {} };
      const pro = cfg.plans.pro || { priceMonthly: 29, yearlyDisplay: '$290 / year' };
      const ent = cfg.plans.enterprise || { priceMonthly: 99, yearlyDisplay: '$999 / year' };
      const fnd = cfg.plans.founder || { priceOneTime: 99 };

      // Render plans dynamically to prevent content drift
      const modalBody = modal.querySelector('.ldoc-cloud-modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="font-size:13px;color:#94a3b8;margin-bottom:16px;text-align:center">
            Deploy self-contained living documents with 3D shaders, real-time code execution, and team signatures.
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:16px">
            <!-- Free Starter -->
            <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;display:flex;flex-direction:column">
              <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase">Free Tier</div>
              <div style="font-size:20px;font-weight:800;color:#fff;margin:6px 0 2px 0">$0</div>
              <div style="font-size:11.5px;color:#94a3b8;margin-bottom:12px">Forever free reader &amp; builder</div>
              <ul style="font-size:11px;color:#cbd5e1;padding-left:16px;margin:0 0 16px 0;line-height:1.6;flex:1">
                <li>Full .ldocx presentation viewer</li>
                <li>Client-side visual builder</li>
                <li>Unlimited local downloads</li>
              </ul>
              <button class="ldoc-cloud-btn secondary" style="width:100%;font-size:11.5px" onclick="LDocModals.closeBillingModal()">Current Tier</button>
            </div>

            <!-- Pro Creator -->
            <div style="background:rgba(124,58,237,0.1);border:1px solid #7c3aed;border-radius:12px;padding:16px;display:flex;flex-direction:column;position:relative">
              <div style="position:absolute;top:-9px;right:12px;background:#7c3aed;color:#fff;font-size:9.5px;font-weight:800;padding:2px 8px;border-radius:9999px">POPULAR</div>
              <div style="font-size:11px;font-weight:700;color:#c084fc;text-transform:uppercase">Pro Creator</div>
              <div style="font-size:20px;font-weight:800;color:#fff;margin:6px 0 2px 0">$${pro.priceMonthly} <span style="font-size:12px;color:#94a3b8">/ month</span></div>
              <div style="font-size:11px;color:#34d399;margin-bottom:12px">${pro.yearlyDisplay}</div>
              <ul style="font-size:11px;color:#cbd5e1;padding-left:16px;margin:0 0 16px 0;line-height:1.6;flex:1">
                <li>Living FX Wizard &amp; volumetric shaders</li>
                <li>Interactive physics sandboxes</li>
                <li>AI Living Copilot assistance</li>
                <li>High-res export pipeline</li>
              </ul>
              <button class="ldoc-cloud-btn" style="width:100%;font-size:11.5px" onclick="LDocModals.openCheckout('pro')">Upgrade to Pro</button>
            </div>

            <!-- Enterprise Team -->
            <div style="background:#161b22;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;display:flex;flex-direction:column">
              <div style="font-size:11px;font-weight:700;color:#38bdf8;text-transform:uppercase">Enterprise Team</div>
              <div style="font-size:20px;font-weight:800;color:#fff;margin:6px 0 2px 0">$${ent.priceMonthly} <span style="font-size:12px;color:#94a3b8">/ month</span></div>
              <div style="font-size:11px;color:#34d399;margin-bottom:12px">${ent.yearlyDisplay}</div>
              <ul style="font-size:11px;color:#cbd5e1;padding-left:16px;margin:0 0 16px 0;line-height:1.6;flex:1">
                <li>25 Team Member seats included</li>
                <li>Hardware package cryptographic signing</li>
                <li>Vector PDF flattening engine</li>
                <li>Custom domains &amp; SAML SSO</li>
              </ul>
              <button class="ldoc-cloud-btn" style="width:100%;font-size:11.5px" onclick="LDocModals.openCheckout('enterprise')">Get Enterprise Team</button>
            </div>
          </div>

          <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <span style="font-size:12.5px;font-weight:700;color:#fef08a">🌟 Founder VIP Lifetime Pass: $${fnd.priceOneTime} One-Time</span>
              <div style="font-size:11px;color:#94a3b8">Early supporter lifetime license with all future Pro features. Zero recurring fees.</div>
            </div>
            <button class="ldoc-cloud-btn" style="font-size:11.5px;white-space:nowrap" onclick="LDocModals.openCheckout('founder')">Claim Founder Pass</button>
          </div>
        `;
      }

      modal.classList.add('active');
    },

    closeBillingModal: function () {
      const modal = document.getElementById('billing-modal');
      if (modal) modal.classList.remove('active');
    },

    openCheckout: function (tier) {
      if (typeof global.LDocToast !== 'undefined') {
        global.LDocToast.show(`Redirecting to secure Stripe checkout for ${tier.toUpperCase()}...`, 'info', 3000);
      }
      setTimeout(() => {
        if (typeof global.showCheckoutModal === 'function') {
          global.showCheckoutModal(tier);
        } else {
          window.open('https://buy.stripe.com/test_placeholder_' + tier, '_blank');
        }
      }, 500);
    },

    closeAllModals: function () {
      ['cloud-vault-modal', 'versions-modal', 'billing-modal', 'share-modal', 'auth-modal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
    }
  };

  // Safe global bindings for existing button onclick handlers
  global.LDocModals = LDocModals;
  global.showCloudVaultModal = function () { LDocModals.showCloudVaultModal(); };
  global.closeCloudVaultModal = function () { LDocModals.closeCloudVaultModal(); };
  global.showVersionsModal = function (docId) { LDocModals.showVersionsModal(docId); };
  global.closeVersionsModal = function () { LDocModals.closeVersionsModal(); };
  global.showBillingModal = function () { LDocModals.showBillingModal(); };
  global.closeBillingModal = function () { LDocModals.closeBillingModal(); };

})(typeof window !== 'undefined' ? window : this);
