// Theme Management
const themes = {
  default: 'theme-default',
  dark: 'theme-dark',
  glass: 'theme-glass'
};

let currentTheme = 'default';

function initThemes() {
  const savedTheme = localStorage.getItem('catalogue-theme') || 'default';
  setTheme(savedTheme);
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });

  // Glass theme controls
  const glassBlurInput = document.getElementById('glass-blur');
  const glassOpacityInput = document.getElementById('glass-opacity');
  
  if (glassBlurInput) {
    glassBlurInput.addEventListener('change', updateGlassTheme);
  }
  if (glassOpacityInput) {
    glassOpacityInput.addEventListener('change', updateGlassTheme);
  }
}

function setTheme(themeName) {
  currentTheme = themeName;
  document.body.className = document.body.className
    .split(' ')
    .filter(cls => !cls.startsWith('theme-'))
    .join(' ');
  
  document.body.classList.add(`theme-${themeName}`);
  
  // Update active button
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeName);
  });

  // Show/hide glass controls
  const glassControls = document.getElementById('glass-controls');
  if (glassControls) {
    glassControls.style.display = themeName === 'glass' ? 'block' : 'none';
  }

  localStorage.setItem('catalogue-theme', themeName);
  renderPreview();
}

function updateGlassTheme() {
  const blur = document.getElementById('glass-blur')?.value || 10;
  const opacity = document.getElementById('glass-opacity')?.value || 80;
  
  document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
  document.documentElement.style.setProperty('--glass-opacity', `${opacity}%`);
  
  renderPreview();
}

function getCurrentTheme() {
  return currentTheme;
}
