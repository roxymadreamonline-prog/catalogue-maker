// Export System
function initExport() {
  document.getElementById('btn-export-png').addEventListener('click', exportPNG);
  document.getElementById('btn-export-pdf').addEventListener('click', exportPDF);
}

async function exportPNG() {
  const preview = document.getElementById('preview');
  if (!preview || !currentProject) return;

  try {
    const canvas = await renderCanvasFromPreview(preview);
    const imageData = canvas.toDataURL('image/png');

    const filename = `${currentProject.name}-page-${currentProject.currentPageId}.png`;
    const result = await window.electronAPI.exportPNG(
      imageData,
      filename,
      document.getElementById('export-transparent').checked
    );

    if (result.success) {
      showNotification('Exported as PNG');
    }
  } catch (error) {
    console.error('Export error:', error);
    showNotification('Failed to export PNG', 'error');
  }
}

async function exportPDF() {
  const preview = document.getElementById('preview');
  if (!preview || !currentProject) return;

  try {
    const canvas = await renderCanvasFromPreview(preview);
    const imageData = canvas.toDataURL('image/png');

    const filename = `${currentProject.name}-page-${currentProject.currentPageId}.pdf`;
    const result = await window.electronAPI.exportPDF(imageData, filename);

    if (result.success) {
      showNotification('Exported as PDF');
    }
  } catch (error) {
    console.error('Export error:', error);
    showNotification('Failed to export PDF', 'error');
  }
}

async function renderCanvasFromPreview(element) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const rect = element.getBoundingClientRect();
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      resolve(canvas);
    }, 100);
  });
}
