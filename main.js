const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.setPath('userData', path.join(app.getPath('appData'), 'QuizBiblique'));
app.commandLine.appendSwitch('disk-cache-dir', path.join(app.getPath('temp'), 'quiz-bible-cache'));
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
