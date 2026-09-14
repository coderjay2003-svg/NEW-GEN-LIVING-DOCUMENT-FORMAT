/**
 * Lightweight Chrome DevTools Protocol (CDP) Controller for Browser-in-the-Loop Tests
 * Zero-dependency: uses Node.js child_process, http, and built-in WebSocket.
 */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ChromeController {
  constructor(options = {}) {
    this.chromePath = options.chromePath || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    if (!fs.existsSync(this.chromePath)) {
      this.chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    }
    this.port = options.port || 9333;
    this.userDataDir = path.join(os.tmpdir(), `ldoc-cdp-${Date.now()}`);
    this.proc = null;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async start() {
    if (!fs.existsSync(this.userDataDir)) {
      fs.mkdirSync(this.userDataDir, { recursive: true });
    }

    const args = [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${this.userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1280,900',
      'about:blank'
    ];

    this.proc = spawn(this.chromePath, args, { stdio: 'ignore' });

    // Wait for CDP endpoint and page target to be responsive
    let pageTarget = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const list = await this._httpGet(`http://127.0.0.1:${this.port}/json/list`);
        if (Array.isArray(list) && list.length > 0) {
          pageTarget = list.find(t => t.type === 'page') || list[0];
          if (pageTarget && pageTarget.webSocketDebuggerUrl) break;
        }
      } catch (e) {}
    }

    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error(`Failed to find page target on Chrome CDP port ${this.port}`);
    }

    // Connect WebSocket to page target
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    this.ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      } catch (e) {}
    };

    // Enable Page and Runtime domains
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
    await this.send('CSS.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await this.send('Runtime.evaluate', {
          expression: 'document.readyState',
          returnByValue: true
        });
        const state = res && res.result ? res.result.value : '';
        if (state === 'complete' || state === 'interactive') break;
      } catch (e) {}
    }
    await new Promise(r => setTimeout(r, 500));
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res && res.exceptionDetails) {
      throw new Error(`Evaluation failed: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res && res.result ? res.result.value : undefined;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      const buf = Buffer.from(res.data, 'base64');
      fs.writeFileSync(outputPath, buf);
      return buf;
    }
    throw new Error('Failed to capture screenshot');
  }

  async close() {
    try {
      if (this.ws) this.ws.close();
    } catch (e) {}
    try {
      if (this.proc) this.proc.kill('SIGTERM');
    } catch (e) {}
    try {
      if (fs.existsSync(this.userDataDir)) {
        fs.rmSync(this.userDataDir, { recursive: true, force: true });
      }
    } catch (e) {}
  }

  _httpGet(url) {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
        });
      }).on('error', reject);
    });
  }
}

module.exports = { ChromeController };
