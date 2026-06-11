// Header System
function initHeaders() {
  const headerEnabled = document.getElementById('header-enabled');
  const headerControls = document.getElementById('header-controls');
  const headerText = document.getElementById('header-text');
  const headerStyle = document.getElementById('header-style');
  const headerLanguage = document.getElementById('header-language');

  headerEnabled.addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.header.enabled = e.target.checked;
      headerControls.style.display = e.target.checked ? 'block' : 'none';
      markDirty();
      renderPreview();
    }
  });

  headerText.addEventListener('input', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.header.text = e.target.value;
      markDirty();
      renderPreview();
    }
  });

  headerStyle.addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.header.style = e.target.value;
      markDirty();
      renderPreview();
    }
  });

  headerLanguage.addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.header.language = e.target.value;
      markDirty();
      renderPreview();
    }
  });
}

function renderPageHeader(page) {
  if (!page.header.enabled) return '';

  const text = page.header.text || 'Header';

  if (page.header.style === 'plain') {
    return `<div class="page-header"><div class="header-capsule">${text}</div></div>`;
  } else if (page.header.style === 'top-strip') {
    return `<div class="header-top-strip">${text}</div>`;
  } else if (page.header.style === 'soft-wave') {
    return `<div class="header-soft-wave">${text}</div>`;
  }

  return '';
}

function updateHeaderUI(page) {
  if (!page) return;

  document.getElementById('header-enabled').checked = page.header.enabled;
  document.getElementById('header-text').value = page.header.text;
  document.getElementById('header-style').value = page.header.style;
  document.getElementById('header-language').value = page.header.language;
  document.getElementById('header-controls').style.display = page.header.enabled ? 'block' : 'none';
}
