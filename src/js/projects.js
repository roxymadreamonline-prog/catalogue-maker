// Project Management
let currentProject = null;
let projectDirty = false;

const defaultProject = {
  name: 'Untitled Catalogue',
  pages: [
    {
      id: 'page-1',
      number: 1,
      cards: [],
      layout: {
        columns: 3,
        gap: 20,
        cardSize: 'medium',
        customWidth: 80,
        customHeight: 120
      },
      header: {
        enabled: false,
        text: '',
        style: 'plain',
        language: 'en'
      },
      theme: 'default'
    }
  ],
  currentPageId: 'page-1',
  savedAt: null
};

function initProjects() {
  document.getElementById('btn-new').addEventListener('click', newProject);
  document.getElementById('btn-open').addEventListener('click', openProject);
  document.getElementById('btn-save').addEventListener('click', saveProject);

  // Auto-save on changes
  setInterval(autoSaveProject, 30000); // Every 30 seconds

  // Try to restore last session
  restoreLastSession();
}

function newProject() {
  currentProject = JSON.parse(JSON.stringify(defaultProject));
  currentProject.name = `Catalogue ${Date.now()}`;
  projectDirty = false;
  renderPages();
  renderPreview();
  showNotification('New project created');
}

async function openProject() {
  const result = await window.electronAPI.loadProject();
  if (result.success && result.data) {
    currentProject = result.data;
    projectDirty = false;
    renderPages();
    renderPreview();
    showNotification('Project loaded');
  } else {
    showNotification('No saved project found', 'error');
  }
}

async function saveProject() {
  if (!currentProject) return;
  
  const result = await window.electronAPI.saveProject(currentProject);
  if (result.success) {
    currentProject.savedAt = new Date().toISOString();
    projectDirty = false;
    showNotification('Project saved');
  } else {
    showNotification('Failed to save project', 'error');
  }
}

async function autoSaveProject() {
  if (projectDirty && currentProject) {
    await window.electronAPI.saveProject(currentProject);
    projectDirty = false;
  }
}

async function restoreLastSession() {
  const result = await window.electronAPI.loadProject();
  if (result.success && result.data) {
    currentProject = result.data;
    renderPages();
    renderPreview();
  } else {
    newProject();
  }
}

function markDirty() {
  projectDirty = true;
}

function getCurrentProject() {
  return currentProject;
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    background: ${type === 'success' ? '#34C759' : '#FF3B30'};
    color: white;
    border-radius: 8px;
    font-size: 13px;
    z-index: 9999;
    animation: slideUp 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
