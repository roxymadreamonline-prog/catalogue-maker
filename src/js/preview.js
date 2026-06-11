// A4 Preview Rendering
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const DPI = 96;
const MM_TO_PX = DPI / 25.4;

function renderPreview() {
  const page = getCurrentPage();
  if (!page) return;

  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  preview.style.backgroundColor = 'white';

  // Apply theme background
  if (getCurrentTheme() === 'dark') {
    preview.style.backgroundColor = '#1D1D1F';
    preview.style.color = '#F5F5F7';
  } else if (getCurrentTheme() === 'glass') {
    preview.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    preview.style.backdropFilter = `blur(${document.getElementById('glass-blur')?.value || 10}px)`;
  }

  // Header
  if (page.header.enabled) {
    const headerHTML = renderPageHeader(page);
    preview.innerHTML += headerHTML;
  }

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'cards-grid';
  cardsGrid.style.gridTemplateColumns = `repeat(${page.layout.columns}, 1fr)`;
  cardsGrid.style.gap = `${page.layout.gap}px`;

  page.cards.forEach(card => {
    const cardElement = renderCard(card, page);
    cardsGrid.appendChild(cardElement);
  });

  preview.appendChild(cardsGrid);

  // Update layout controls
  updateLayoutControls(page);
  updateHeaderUI(page);
}

function renderCard(card, page) {
  const cardContainer = document.createElement('div');
  cardContainer.className = `card`;
  cardContainer.dataset.cardId = card.id;

  // Calculate card dimensions
  const { width, height } = getCardDimensions(page.layout);
  cardContainer.style.width = `${width}px`;
  cardContainer.style.height = `${height}px`;

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'card-image-container';
  imageContainer.style.flex = '1';

  if (card.imageUrl) {
    const img = document.createElement('img');
    img.src = card.imageUrl;
    img.className = 'card-image';
    imageContainer.appendChild(img);

    // Mini Thumbnail
    if (card.thumbnail.enabled && card.thumbnail.imageUrl) {
      const thumbnail = document.createElement('div');
      thumbnail.className = `card-thumbnail ${card.thumbnail.position}`;
      thumbnail.style.width = `${card.thumbnail.size}px`;
      thumbnail.style.height = `${card.thumbnail.size}px`;

      const thumbImg = document.createElement('img');
      thumbImg.src = card.thumbnail.imageUrl;
      thumbnail.appendChild(thumbImg);
      imageContainer.appendChild(thumbnail);
    }
  } else {
    imageContainer.innerHTML = `<div class="text-secondary">Click to add image</div>`;
  }

  cardContainer.appendChild(imageContainer);

  // Caption
  const caption = document.createElement('div');
  caption.className = 'card-caption';
  caption.textContent = card.caption || 'New Product';
  caption.style.fontSize = `${document.getElementById('text-size')?.value || 12}px`;
  caption.style.lineHeight = document.getElementById('text-line-height')?.value || 1.4;
  cardContainer.appendChild(caption);

  // Controls overlay
  const controls = document.createElement('div');
  controls.className = 'card-controls';
  controls.innerHTML = `
    <button class="card-btn" onclick="editCard('${card.id}')" title="Edit">✎</button>
    <button class="card-btn" onclick="duplicateCard('${card.id}')" title="Duplicate">⊙</button>
    <button class="card-btn danger" onclick="removeCard('${card.id}')" title="Delete">🗑</button>
  `;
  cardContainer.appendChild(controls);

  // Click to edit caption
  caption.addEventListener('click', (e) => {
    e.stopPropagation();
    editCard(card.id);
  });

  return cardContainer;
}

function getCardDimensions(layout) {
  let width, height;

  if (layout.cardSize === 'small') {
    width = 120 * MM_TO_PX;
    height = 160 * MM_TO_PX;
  } else if (layout.cardSize === 'medium') {
    width = 150 * MM_TO_PX;
    height = 200 * MM_TO_PX;
  } else if (layout.cardSize === 'large') {
    width = 180 * MM_TO_PX;
    height = 240 * MM_TO_PX;
  } else if (layout.cardSize === 'custom') {
    width = layout.customWidth * MM_TO_PX;
    height = layout.customHeight * MM_TO_PX;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

function updateLayoutControls(page) {
  document.getElementById('layout-columns').value = page.layout.columns;
  document.getElementById('layout-gap').value = page.layout.gap;
  document.getElementById('layout-card-size').value = page.layout.cardSize;
  document.getElementById('custom-width').value = page.layout.customWidth;
  document.getElementById('custom-height').value = page.layout.customHeight;
}
