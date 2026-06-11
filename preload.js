const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveProject: (projectData) => ipcRenderer.invoke('save-project', projectData),
  loadProject: () => ipcRenderer.invoke('load-project'),
  exportPNG: (imageData, filename, transparent) => ipcRenderer.invoke('export-png', { imageData, filename, transparent }),
  exportPDF: (imageData, filename) => ipcRenderer.invoke('export-pdf', { imageData, filename }),
  importFiles: () => ipcRenderer.invoke('import-files'),
  scanFolder: () => ipcRenderer.invoke('scan-folder'),
  getFiles: (filter) => ipcRenderer.invoke('get-files', filter),
  renameFile: (oldPath, newName) => ipcRenderer.invoke('rename-file', { oldPath, newName }),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  readFileDataURL: (filePath) => ipcRenderer.invoke('read-file-dataurl', filePath)
});
