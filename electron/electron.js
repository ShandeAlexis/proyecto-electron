const path = require('path');
const { app, BrowserWindow, screen, shell } = require('electron');
 
const isDev = process.env.IS_DEV == "true" ? true : false;
 
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname, '../src/assets/logoicon.ico'), // Ruta a tu archivo ICO
     autoHideMenuBar: true,
     resizable: false,
     movable: false, // Esta opción deshabilita la capacidad de mover la ventana
     frame: true,
     webPreferences: {
       preload: path.join(__dirname, 'preload.js'),
       nodeIntegration: true,
       contextIsolation: false
     },
  });
 
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
 
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    //mainWindow.webContents.openDevTools();
  }
 
}
 
 
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});