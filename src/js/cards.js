// Card Management with Mini Thumbnail Support
function initCards() {
  // Layout controls
  document.getElementById('layout-columns').addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.layout.columns = parseInt(e.target.value);
      markDirty();
      renderPreview();
    }
  });

  document.getElementById('layout-gap').addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.layout.gap = parseInt(e.target.value);
      markDirty();
      renderPreview();
    }
  });

  document.getElementById('layout-card-size').addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.layout.cardSize = e.target.value;
      markDirty();
      renderPreview();
    }
    document.getElementById('custom-size-controls').style.display = 
      e.target.value === 'custom' ? 'block' : 'none';
  });

  document.getElementById('custom-width').addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.layout.customWidth = parseInt(e.target.value);
      markDirty();
      renderPreview();
    }
  });

  document.getElementById('custom-height').addEventListener('change', (e) => {
    const page = getCurrentPage();
    if (page) {
      page.layout.customHeight = parseInt(e.target.value);
      markDirty();
      renderPreview();
    }
  });

  // Text controls
  document.getElementById('text-size').addEventListener('change', (e) => {
    markDirty();
    renderPreview();
  });

  document.getElementById('text-line-height').addEventListener('change', (e) => {
    markDirty();
    renderPreview();
  });
}

function addCard() {
  const page = getCurrentPage();
  if (!page) return;

  const newCard = {
    id: `card-${Date.now()}`,
    imageUrl: '',
    caption: 'New Product',
    thumbnail: {
      enabled: false,
      imageUrl: '',
      position: 'top-right',
      size: 40
    }
  };

  page.cards.push(newCard);
  markDirty();
  renderPreview();
}

function removeCard(cardId) {
  const page = getCurrentPage();
  if (!page) return;

  page.cards = page.cards.filter(c => c.id !== cardId);
  markDirty();
  renderPreview();
}

function duplicateCard(cardId) {
  const page = getCurrentPage();
  if (!page) return;

  const card = page.cards.find(c => c.id === cardId);
  if (!card) return;

  const newCard = JSON.parse(JSON.stringify(card));
  newCard.id = `card-${Date.now()}`;
  page.cards.push(newCard);
  markDirty();
  renderPreview();
}

function editCard(cardId) {
  const page = getCurrentPage();
  const card = page?.cards.find(c => c.id === cardId);
  if (!card) return;

  // Open modal
  const modal = document.getElementById('modal-edit-card');
  const overlay = document.getElementById('modal-overlay');
  
  document.getElementById('modal-caption').value = card.caption;
  document.getElementById('modal-thumbnail').value = card.thumbnail.imageUrl || '';
  document.getElementById('modal-thumbnail-position').value = card.thumbnail.position;
  document.getElementById('modal-thumbnail-size').value = card.thumbnail.size;

  // Store current card ID
  window.currentEditingCardId = cardId;

  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeEditModal() {
  document.getElementById('modal-edit-card').style.display = 'none';
  document.getElementById('modal-overlay').style.display = 'none';
  window.currentEditingCardId = null;
}

function saveCardEdit() {
  const page = getCurrentPage();
  const cardId = window.currentEditingCardId;
  const card = page?.cards.find(c => c.id === cardId);
  if (!card) return;

  card.caption = document.getElementById('modal-caption').value;
  card.thumbnail = {
    enabled: !!document.getElementById('modal-thumbnail').value,
    imageUrl: document.getElementById('modal-thumbnail').value,
    position: document.getElementById('modal-thumbnail-position').value,
    size: parseInt(document.getElementById('modal-thumbnail-size').value)
  };

  markDirty();
  closeEditModal();
  renderPreview();
}
