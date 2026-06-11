// Page Management
function initPages() {
  document.getElementById('btn-add-page').addEventListener('click', addPage);
}

function renderPages() {
  if (!currentProject) return;
  
  const pagesList = document.getElementById('pages-list');
  pagesList.innerHTML = '';
  
  currentProject.pages.forEach(page => {
    const pageElement = document.createElement('div');
    pageElement.className = `page-item ${page.id === currentProject.currentPageId ? 'active' : ''}`;
    pageElement.innerHTML = `
      <span>Page ${page.number}</span>
      <button class="page-item-delete" onclick="event.stopPropagation(); deletePage('${page.id}')">×</button>
    `;
    pageElement.addEventListener('click', () => switchPage(page.id));
    pagesList.appendChild(pageElement);
  });
}

function addPage() {
  if (!currentProject) return;
  
  const newPageNumber = currentProject.pages.length + 1;
  const newPage = {
    id: `page-${Date.now()}`,
    number: newPageNumber,
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
    theme: getCurrentTheme()
  };
  
  currentProject.pages.push(newPage);
  currentProject.currentPageId = newPage.id;
  markDirty();
  renderPages();
  renderPreview();
}

function deletePage(pageId) {
  if (!currentProject || currentProject.pages.length <= 1) {
    showNotification('Cannot delete the last page', 'error');
    return;
  }
  
  currentProject.pages = currentProject.pages.filter(p => p.id !== pageId);
  
  if (currentProject.currentPageId === pageId) {
    currentProject.currentPageId = currentProject.pages[0].id;
  }
  
  markDirty();
  renderPages();
  renderPreview();
}

function switchPage(pageId) {
  if (!currentProject) return;
  currentProject.currentPageId = pageId;
  renderPages();
  renderPreview();
}

function getCurrentPage() {
  if (!currentProject) return null;
  return currentProject.pages.find(p => p.id === currentProject.currentPageId);
}
