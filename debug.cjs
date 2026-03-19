const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({ show: false });
  win.webContents.on('console-message', (e, level, msg, line, sourceId) => {
    console.log('[BROWSER]', msg);
  });
  win.loadURL('http://localhost:5173');
  setTimeout(() => app.quit(), 8000);
});
