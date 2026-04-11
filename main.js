const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

const userDataPath = path.join(app.getPath('appData'), 'QuizBiblique');
const cachePath = path.join(userDataPath, 'cache');

app.setPath('userData', userDataPath);
try {
    fs.mkdirSync(cachePath, { recursive: true });
    app.commandLine.appendSwitch('disk-cache-dir', cachePath);
} catch (error) {
    // Fallback to Electron default cache path if custom cache path cannot be created.
}
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        minWidth: 980,
        minHeight: 720,
        title: 'Quiz Biblique',
        icon: path.join(__dirname, 'assets', 'logo.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
