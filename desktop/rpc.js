// main.js
const { app, BrowserWindow } = require('electron');
const RPC = require('discord-rpc');

let mainWindow;

// Create the main window
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Initialize Discord RPC
  const clientId = 'YOUR_DISCORD_APP_CLIENT_ID'; // Replace with your client ID
  RPC.register(clientId);
  const rpc = new RPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    rpc.setActivity({
      details: 'Talking with my buddies on Sherbert',
      state: 'Join at https:www.sherbert.cc',
      startTimestamp: new Date(),
      largeImageKey: 'The image key',
      largeImageText: 'Sherbert for desktop!',
    });
  });

  rpc.login({ clientId }).catch(console.error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
