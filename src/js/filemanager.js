// File Manager
let currentFileFilter = 'all';

function initFileManager() {
  // File tabs
  document.querySelectorAll('.file-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      currentFileFilter = e.target.dataset.filter;
      document.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      loadFiles(currentFileFilter);
    });
  });

  // Search
  document.getElementById('file-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.file-item').forEach(item => {
      const filename = item.dataset.filename.toLowerCase();
      item.style.display = filename.includes(query) ? 'flex' : 'none';
    });
  });

  // Import buttons
  document.getElementById('btn-import').addEventListener('click', importFiles);
  document.getElementById('btn-scan').addEventListener('click', scanFolder);

  // Load initial files
  loadFiles('all');
}

async function loadFiles(filter) {
  const result = await window.electronAPI.getFiles(filter);
  if (!result.success) return;

  const filesList = document.getElementById('files-list');
  filesList.innerHTML = '';

  if (result.files.length === 0) {
    filesList.innerHTML = '<div class="text-secondary text-center" style="padding: 20px;">No files</div>';
    return;
  }

  result.files.forEach(file => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.dataset.filename = file.filename;
    item.dataset.path = file.path;
    item.innerHTML = `
      <span class="file-item-name">${file.filename}</span>
      <div class="file-item-actions">
        <button class="file-item-action" title="Add as main image" onclick="addImageToCard('${file.path}')">+</button>
        <button class="file-item-action" title="Add as thumbnail" onclick="addImageAsThumbnail('${file.path}')">T</button>
        <button class="file-item-action" title="Rename" onclick="renameFile('${file.path}', '${file.filename}')">✎</button>
        <button class="file-item-action" title="Delete" onclick="deleteFile('${file.path}')">🗑</button>
      </div>
    `;
    filesList.appendChild(item);
  });
}

async function importFiles() {
  const result = await window.electronAPI.importFiles();
  if (result.success) {
    loadFiles(currentFileFilter);
    showNotification(`${result.files.length} file(s) imported`);
  }
}

async function scanFolder() {
  const result = await window.electronAPI.scanFolder();
  if (result.success) {
    loadFiles(currentFileFilter);
    showNotification(`${result.files.length} file(s) scanned and imported`);
  }
}

async function addImageToCard(filePath) {
  const result = await window.electronAPI.readFileDataURL(filePath);
  if (result.success) {
    const page = getCurrentPage();
    if (!page || page.cards.length === 0) {
      showNotification('Add a card first', 'error');
      return;
    }
    const lastCard = page.cards[page.cards.length - 1];
    lastCard.imageUrl = result.dataUrl;
    markDirty();
    renderPreview();
    showNotification('Image added to card');
  }
}

async function addImageAsThumbnail(filePath) {
  const result = await window.electronAPI.readFileDataURL(filePath);
  if (result.success) {
    const page = getCurrentPage();
    if (!page || page.cards.length === 0) {
      showNotification('Add a card first', 'error');
      return;
    }
    const lastCard = page.cards[page.cards.length - 1];
    lastCard.thumbnail = {
      enabled: true,
      imageUrl: result.dataUrl,
      position: 'top-right',
      size: 40
    };
    markDirty();
    renderPreview();
    showNotification('Thumbnail added to card');
  }
}

async function renameFile(filePath, oldName) {
  const newName = prompt('New filename:', oldName);
  if (!newName || newName === oldName) return;

  const result = await window.electronAPI.renameFile(filePath, newName);
  if (result.success) {
    loadFiles(currentFileFilter);
    showNotification('File renamed');
  } else {
    showNotification('Failed to rename file', 'error');
  }
}

async function deleteFile(filePath) {
  if (!confirm('Delete this file?')) return;

  const result = await window.electronAPI.deleteFile(filePath);
  if (result.success) {
    loadFiles(currentFileFilter);
    showNotification('File deleted');
  } else {
    showNotification('Failed to delete file', 'error');
  }
}
