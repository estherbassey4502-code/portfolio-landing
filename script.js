const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');

function getSavedTheme() {
  try { return localStorage.getItem('portfolio-theme'); }
  catch { return null; }
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
}

setTheme(getSavedTheme() || (colorPreference.matches ? 'dark' : 'light'));

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  try { localStorage.setItem('portfolio-theme', nextTheme); }
  catch { /* Keep the theme active for this visit. */ }
});

colorPreference.addEventListener('change', (event) => {
  if (!getSavedTheme()) setTheme(event.matches ? 'dark' : 'light');
});

const showcase = document.querySelector('.work-showcase');
const showcasePill = showcase.querySelector('.showcase-cursor-pill');
const interactionDemo = showcase.querySelector('.interaction-demo');
let showcaseOrganized = false;

let interactionTimers = [];

function playInteractionDemo() {
  interactionTimers.forEach(clearTimeout);
  interactionTimers = [];
  interactionDemo.classList.remove('is-stacking', 'is-ready', 'is-expanded');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    interactionDemo.classList.add('is-ready', 'is-expanded');
    return;
  }

  void interactionDemo.offsetWidth;
  interactionDemo.classList.add('is-stacking');
  interactionTimers.push(setTimeout(() => {
    interactionDemo.classList.add('is-ready');
    interactionDemo.classList.remove('is-stacking');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      interactionDemo.classList.add('is-expanded');
      interactionTimers.push(setTimeout(playInteractionDemo, 4300));
    }));
  }, 1900));
}

requestAnimationFrame(() => setTimeout(playInteractionDemo, 300));
interactionDemo.addEventListener('pointerenter', playInteractionDemo);

function setShowcaseState(organized) {
  showcaseOrganized = organized;
  showcase.classList.toggle('is-organized', organized);
  showcase.setAttribute('aria-pressed', String(organized));
  showcase.setAttribute('aria-label', organized
    ? 'Mess up the precisely arranged capability cards'
    : 'Make the four capability cards behave by arranging them into a precise layout');
  showcasePill.textContent = organized ? 'Click to mess them up again' : 'Click to make the pixels behave';
}

function toggleShowcase() {
  setShowcaseState(!showcaseOrganized);
}

showcase.addEventListener('click', toggleShowcase);
showcase.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggleShowcase();
});

showcase.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch') return;
  showcase.classList.add('is-pointer-inside');
});

showcase.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  const bounds = showcase.getBoundingClientRect();
  const x = Math.min(event.clientX - bounds.left + 18, bounds.width - showcasePill.offsetWidth - 12);
  const y = Math.min(event.clientY - bounds.top + 18, bounds.height - showcasePill.offsetHeight - 12);
  showcasePill.style.transform = `translate3d(${Math.max(12, x)}px, ${Math.max(12, y)}px, 0)`;
});

showcase.addEventListener('pointerleave', () => {
  showcase.classList.remove('is-pointer-inside');
});

document.querySelectorAll('[data-case-study-hover]').forEach((artwork) => {
  const pill = artwork.querySelector('.case-study-pill');

  artwork.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    artwork.classList.add('is-pointer-inside');
  });

  artwork.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = artwork.getBoundingClientRect();
    const x = Math.min(event.clientX - bounds.left + 18, bounds.width - pill.offsetWidth - 12);
    const y = Math.min(event.clientY - bounds.top + 18, bounds.height - pill.offsetHeight - 12);
    pill.style.transform = `translate3d(${Math.max(12, x)}px, ${Math.max(12, y)}px, 0)`;
  });

  artwork.addEventListener('pointerleave', () => artwork.classList.remove('is-pointer-inside'));
});

function syncNavigation() {
  const workSection = document.querySelector('#selected-work');
  const aboutSection = document.querySelector('#about');
  const header = document.querySelector('.site-header');
  header.classList.toggle('is-scrolled', window.scrollY > 48);
  const activationLine = header.getBoundingClientRect().bottom + 100;
  let currentSection = null;
  if (aboutSection && aboutSection.getBoundingClientRect().top <= activationLine) {
    currentSection = '#about';
  } else if (workSection && workSection.getBoundingClientRect().top <= activationLine) {
    currentSection = '#selected-work';
  } else if (window.location.hash === '#resume') {
    currentSection = '#resume';
  }
  document.querySelectorAll('.desktop-nav a').forEach((link) => {
    const isActive = link.getAttribute('href') === currentSection;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', syncNavigation);
window.addEventListener('scroll', syncNavigation, { passive: true });
window.addEventListener('resize', syncNavigation);
syncNavigation();

const workFilters = document.querySelectorAll('.more-work-filter');
const moreWorkCards = document.querySelectorAll('.more-work-card');
const seeAllButton = document.querySelector('.more-work-see-all');
let workFilter = 'all';
let workExpanded = false;

function updateMoreWork() {
  workFilters.forEach((button) => {
    const isActive = button.dataset.filter === workFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  moreWorkCards.forEach((card) => {
    const matchesFilter = workFilter === 'all' || card.dataset.categories.split(' ').includes(workFilter);
    card.hidden = !matchesFilter || (card.hasAttribute('data-expanded-card') && !workExpanded);
  });
  seeAllButton.textContent = workExpanded ? 'See less' : 'See all';
  seeAllButton.setAttribute('aria-expanded', String(workExpanded));
}

workFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    workFilter = filterButton.dataset.filter;
    updateMoreWork();
  });
});

seeAllButton.addEventListener('click', () => {
  workExpanded = !workExpanded;
  if (workExpanded) workFilter = 'all';
  updateMoreWork();
  if (!workExpanded) document.querySelector('#more-work').scrollIntoView({ behavior: 'smooth' });
});

const photoGallery = document.querySelector('.about-me-photos');
const photoButtons = [...photoGallery.querySelectorAll('.about-photo')];
let selectedPhoto = 0;

function showPhoto(index) {
  photoGallery.dataset.active = String(index);
  photoButtons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === index)));
}

photoButtons.forEach((button, index) => {
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') showPhoto(index);
  });
  button.addEventListener('focus', () => showPhoto(index));
  button.addEventListener('click', () => {
    selectedPhoto = index;
    showPhoto(index);
  });
});

photoGallery.addEventListener('pointerleave', (event) => {
  if (event.pointerType !== 'touch') showPhoto(selectedPhoto);
});
