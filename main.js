const { app, BrowserWindow, Menu, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

Menu.setApplicationMenu(null);
app.setAppUserModelId('com.futmob.guest');

let win = null;
let isQuitting = false;
let storageCleared = false;

const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');
let settings = { saveProgress: true };
function loadSettings() {
  try { settings = Object.assign(settings, JSON.parse(fs.readFileSync(settingsFile(), 'utf8'))); } catch (e) {}
}
function saveSettings() {
  try { fs.writeFileSync(settingsFile(), JSON.stringify(settings)); } catch (e) {}
}

function showWindow() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#0d0f1a',
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const sendState = () => win.webContents.send('win:maximized', win.isMaximized());
  win.on('maximize', sendState);
  win.on('unmaximize', sendState);
  win.webContents.on('did-finish-load', sendState);

  // X button: if "Save Progress locally" is off, wipe local storage first, then quit
  win.on('close', (e) => {
    if (settings.saveProgress !== false || storageCleared) { isQuitting = true; app.quit(); return; }
    e.preventDefault();
    session.defaultSession.clearStorageData({ storages: ['localstorage', 'indexdb', 'cachestorage'] })
      .catch(() => {})
      .then(() => { storageCleared = true; isQuitting = true; app.quit(); });
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

ipcMain.on('win:minimize', () => win && win.minimize());
ipcMain.on('win:toggle-maximize', () => win && (win.isMaximized() ? win.unmaximize() : win.maximize()));
ipcMain.on('win:close', () => win && win.close());

ipcMain.handle('settings:get', () => settings);
ipcMain.handle('settings:set', (_e, key, value) => {
  if (key === 'saveProgress') { settings.saveProgress = !!value; saveSettings(); }
  return settings;
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }
else {
  app.on('second-instance', showWindow);
  app.whenReady().then(() => { loadSettings(); createWindow(); });
}
app.on('before-quit', (e) => {
  if (settings.saveProgress === false && !storageCleared) {
    e.preventDefault();
    session.defaultSession.clearStorageData({ storages: ['localstorage', 'indexdb', 'cachestorage'] })
      .catch(() => {})
      .then(() => { storageCleared = true; isQuitting = true; app.quit(); });
    return;
  }
  isQuitting = true;
});
