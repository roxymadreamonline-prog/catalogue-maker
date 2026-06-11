const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

let mainWindow;
const appDataPath = path.join(app.getPath('userData'), 'catalogue-maker');
const filesStoragePath = path.join(appDataPath, 'files');

// Ensure app data directories exist
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

if (!fs.existsSync(filesStoragePath)) {
  fs.mkdirSync(filesStoragePath, { recursive: true });
}

// File type folders
const fileTypeFolders = ['pdf', 'psd', 'eps', 'cdr', 'jpg', 'png', 'other'];
fileTypeFolders.forEach(type => {
  const typeFolder = path.join(filesStoragePath, type);
  if (!fs.existsSync(typeFolder)) {
    fs.mkdirSync(typeFolder, { recursive: true });
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

// IPC Handlers

// Save project
ipcMain.handle('save-project', async (event, projectData) => {
  try {
    const projectPath = path.join(appDataPath, 'current-project.json');
    fs.writeFileSync(projectPath, JSON.stringify(projectData, null, 2));
    return { success: true, path: projectPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Load project
ipcMain.handle('load-project', async (event) => {
  try {
    const projectPath = path.join(appDataPath, 'current-project.json');
    if (fs.existsSync(projectPath)) {
      const data = fs.readFileSync(projectPath, 'utf-8');
      return { success: true, data: JSON.parse(data) };
    }
    return { success: false, data: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Export as PNG
ipcMain.handle('export-png', async (event, { imageData, filename, transparent }) => {
  try {
    const dialogResult = await dialog.showSaveDialog(mainWindow, {
      defaultPath: filename || 'catalogue.png',
      filters: [{ name: 'PNG Images', extensions: ['png'] }]
    });

    if (dialogResult.canceled) return { success: false };

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(dialogResult.filePath, buffer);

    return { success: true, path: dialogResult.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Export as PDF
ipcMain.handle('export-pdf', async (event, { imageData, filename }) => {
  try {
    const dialogResult = await dialog.showSaveDialog(mainWindow, {
      defaultPath: filename || 'catalogue.pdf',
      filters: [{ name: 'PDF Documents', extensions: ['pdf'] }]
    });

    if (dialogResult.canceled) return { success: false };

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(dialogResult.filePath, buffer);

    return { success: true, path: dialogResult.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Import files
ipcMain.handle('import-files', async (event) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'PSD', extensions: ['psd'] }
      ]
    });

    if (result.canceled) return { success: false, files: [] };

    const importedFiles = [];
    for (const filePath of result.filePaths) {
      const filename = path.basename(filePath);
      const ext = path.extname(filename).toLowerCase().substring(1);
      let typeFolder = 'other';

      if (['jpg', 'jpeg'].includes(ext)) typeFolder = 'jpg';
      else if (ext === 'png') typeFolder = 'png';
      else if (ext === 'pdf') typeFolder = 'pdf';
      else if (ext === 'psd') typeFolder = 'psd';
      else if (ext === 'eps') typeFolder = 'eps';
      else if (['cdr', 'cd'].includes(ext)) typeFolder = 'cdr';

      const destFolder = path.join(filesStoragePath, typeFolder);
      let destPath = path.join(destFolder, filename);
      let counter = 1;

      // Avoid duplicate names
      while (fs.existsSync(destPath)) {
        const nameWithoutExt = path.parse(filename).name;
        const newFilename = `${nameWithoutExt}-${counter}.${ext}`;
        destPath = path.join(destFolder, newFilename);
        counter++;
      }

      fs.copyFileSync(filePath, destPath);
      importedFiles.push({
        filename: path.basename(destPath),
        path: destPath,
        type: typeFolder
      });
    }

    return { success: true, files: importedFiles };
  } catch (error) {
    return { success: false, error: error.message, files: [] };
  }
});

// Scan folder for files
ipcMain.handle('scan-folder', async (event) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });

    if (result.canceled) return { success: false, files: [] };

    const folderPath = result.filePaths[0];
    const scannedFiles = [];

    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase().substring(1);
          const validTypes = ['jpg', 'jpeg', 'png', 'pdf', 'psd', 'eps', 'cdr', 'cd'];

          if (validTypes.includes(ext)) {
            let typeFolder = 'other';
            if (['jpg', 'jpeg'].includes(ext)) typeFolder = 'jpg';
            else if (ext === 'png') typeFolder = 'png';
            else if (ext === 'pdf') typeFolder = 'pdf';
            else if (ext === 'psd') typeFolder = 'psd';
            else if (ext === 'eps') typeFolder = 'eps';
            else if (['cdr', 'cd'].includes(ext)) typeFolder = 'cdr';

            const destFolder = path.join(filesStoragePath, typeFolder);
            let destPath = path.join(destFolder, entry.name);
            let counter = 1;

            while (fs.existsSync(destPath)) {
              const nameWithoutExt = path.parse(entry.name).name;
              const newFilename = `${nameWithoutExt}-${counter}.${ext}`;
              destPath = path.join(destFolder, newFilename);
              counter++;
            }

            fs.copyFileSync(fullPath, destPath);
            scannedFiles.push({
              filename: path.basename(destPath),
              path: destPath,
              type: typeFolder
            });
          }
        }
      }
    }

    scanDir(folderPath);
    return { success: true, files: scannedFiles };
  } catch (error) {
    return { success: false, error: error.message, files: [] };
  }
});

// Get files list
ipcMain.handle('get-files', async (event, filter = 'all') => {
  try {
    const files = [];
    const types = filter === 'all' ? fileTypeFolders : [filter];

    for (const type of types) {
      const typeFolder = path.join(filesStoragePath, type);
      if (fs.existsSync(typeFolder)) {
        const entries = fs.readdirSync(typeFolder);
        for (const entry of entries) {
          files.push({
            filename: entry,
            path: path.join(typeFolder, entry),
            type: type
          });
        }
      }
    }

    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message, files: [] };
  }
});

// Rename file
ipcMain.handle('rename-file', async (event, { oldPath, newName }) => {
  try {
    const dir = path.dirname(oldPath);
    const newPath = path.join(dir, newName);
    fs.renameSync(oldPath, newPath);
    return { success: true, newPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Delete file
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Toggle fullscreen
ipcMain.handle('toggle-fullscreen', async (event) => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return { fullscreen: mainWindow.isFullScreen() };
  }
});

// Get file as data URL
ipcMain.handle('read-file-dataurl', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().substring(1);
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'pdf': 'application/pdf'
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    const base64 = data.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return { success: true, dataUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
