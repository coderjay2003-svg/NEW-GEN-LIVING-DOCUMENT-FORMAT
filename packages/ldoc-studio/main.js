// ════════════════════════════════════════════════════════════════════════════
// LDOC STUDIO PRO — ELECTRON WORKSTATION DESKTOP ENTRY POINT
// Pure 100% Offline Architecture • Zero Localhost • 120Hz Hardware Pipeline
// ════════════════════════════════════════════════════════════════════════════

const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');

// ── FORCE PURE DARK WORKSTATION THEME & BLACK CHROME ─────────────────────────
nativeTheme.themeSource = 'dark';

// ── 120Hz HIGH-REFRESH RATE & DISCRETE GPU PIPELINE FLAGS ───────────────────
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('force-gpu-mem-available-mb', '4096');
app.commandLine.appendSwitch('gpu-rasterization-msaa-sample-count', '4');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,CanvasOopRasterization,UseSkiaRenderer,TouchpadAndWheelScrollLatching,SmoothScrolling');
app.commandLine.appendSwitch('enable-smooth-scrolling');
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('renderer-process-limit', '16');

// ── AIR-GAPPED OFFLINE LICENSE PERSISTENCE ──────────────────────────────────
function getLicenseFilePath() {
  // 1. Local folder check (ensures isolated per-package activation)
  const localPath = path.join(__dirname, 'license.json');
  if (fs.existsSync(localPath)) return localPath;

  // 2. Dedicated instance AppData directory
  const dir = path.join(app.getPath('userData'), 'LDOCStudio_Locked');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'license.json');
}

function readStoredLicense() {
  try {
    const p = getLicenseFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.activated) return parsed;
    }
  } catch (err) {
    console.warn('[License Notice] Read error:', err.message);
  }
  return null;
}

function saveStoredLicense(key, email) {
  try {
    const data = {
      activated: true,
      license_key: key,
      email: email || 'pro-workstation-user',
      date: new Date().toISOString(),
      tier: 'pro_lifetime'
    };
    const jsonStr = JSON.stringify(data, null, 2);

    // Save locally in application directory if writable
    try {
      const localPath = path.join(__dirname, 'license.json');
      fs.writeFileSync(localPath, jsonStr, 'utf8');
    } catch (e) {}

    // Save in dedicated user data directory
    const userPath = path.join(app.getPath('userData'), 'LDOCStudio_Locked', 'license.json');
    const userDir = path.dirname(userPath);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    fs.writeFileSync(userPath, jsonStr, 'utf8');
    return true;
  } catch (err) {
    console.error('[License Error] Save failed:', err.message);
    return false;
  }
}

// ── BROWSER WINDOW INITIALIZATION ───────────────────────────────────────────
let mainWindow = null;

function createWindow() {
  const iconPath = path.join(__dirname, 'app.ico');

  // Disable native Win32 white menu bar completely
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1560,
    height: 980,
    minWidth: 1080,
    minHeight: 720,
    title: 'LDOC Studio Pro • Living Document Workstation',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    backgroundColor: '#0d1117',
    darkTheme: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: process.platform === 'win32' ? {
      color: '#090c14',
      symbolColor: '#e2e8f0',
      height: 32
    } : undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false
    }
  });

  mainWindow.setMenuBarVisibility(false);

  // ZERO LOCALHOST: Direct pure offline file protocol load!
  const indexPath = path.join(__dirname, 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Application menu is disabled in favor of native dark titleBarOverlay and custom in-app header


// ── IPC CHANNELS ────────────────────────────────────────────────────────────
ipcMain.handle('license:get', async () => {
  return readStoredLicense();
});

ipcMain.handle('license:save', async (event, data) => {
  const { key, email } = data || {};
  return saveStoredLicense(key, email);
});

ipcMain.handle('app:info', async () => {
  return {
    version: app.getVersion(),
    isElectron: true,
    platform: process.platform,
    userData: app.getPath('userData'),
    isZeroLocalhost: true
  };
});

// ── APPLICATION LIFECYCLE ───────────────────────────────────────────────────
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
