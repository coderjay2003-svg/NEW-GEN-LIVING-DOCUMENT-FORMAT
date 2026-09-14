// ════════════════════════════════════════════════════════════════════════════
// LDOC STUDIO PRO — PRELOAD SCRIPT BRIDGE
// Safe Context Isolation • Native System API Exposure • Zero Localhost
// ════════════════════════════════════════════════════════════════════════════

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  isZeroLocalhost: true,
  getLicense: () => ipcRenderer.invoke('license:get'),
  saveLicense: (data) => ipcRenderer.invoke('license:save', data),
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  onMenuAction: (callback) => ipcRenderer.on('menu:action', (event, action) => callback(action)),
  onFileOpened: (callback) => ipcRenderer.on('file:opened', (event, filePath) => callback(filePath))
});
