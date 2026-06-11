// Main App Controller
window.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  // Initialize all systems
  initThemes();
  initProjects();
  initPages();
  initCards();
  initHeaders();
  initFileManager();
  initExport();

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Fullscreen toggle
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

  // Add card button
  const layoutSection = document.querySelector('.sidebar-section:nth-child(3)');
  if (layoutSection) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-accent';
    btn.textContent = '+ Add Card';
    btn.id = 'btn-add-card';
    btn.style.marginTop = '12px';
    btn.style.width = '100%';
    layoutSection.appendChild(btn);
    btn.addEventListener('click', addCard);
  }

  // Initial render
  newProject();
}

function handleKeyboardShortcuts(e) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isCtrlCmd = isMac ? e.metaKey : e.ctrlKey;

  if (isCtrlCmd && e.key === 's') {
    e.preventDefault();
    saveProject();
  } else if (isCtrlCmd && e.key === 'o') {
    e.preventDefault();
    openProject();
  } else if (isCtrlCmd && e.key === 'e') {
    e.preventDefault();
    exportPNG();
  } else if (isCtrlCmd && e.key === 'f') {
    e.preventDefault();
    toggleFullscreen();
  } else if (e.key === 'Delete') {
    const preview = document.getElementById('preview');
    const cards = preview.querySelectorAll('.card');
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      removeCard(lastCard.dataset.cardId);
    }
  } else if (isCtrlCmd && e.key === 'd') {
    e.preventDefault();
    const preview = document.getElementById('preview');
    const cards = preview.querySelectorAll('.card');
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      duplicateCard(lastCard.dataset.cardId);
    }
  }
}

async function toggleFullscreen() {
  document.body.classList.toggle('fullscreen');
  const result = await window.electronAPI.toggleFullscreen();
  if (result.fullscreen) {
    showNotification('Fullscreen mode');
  }
}
