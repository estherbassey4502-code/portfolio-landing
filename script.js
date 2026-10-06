const root = document.documentElement;
// Cursor-led review tour. Wheel and touch input continue scrolling the page.
const rentlensScroll = document.querySelector('.rentlens-scroll');
if (rentlensScroll) {
  const frame = rentlensScroll.parentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const image = rentlensScroll.querySelector('img');
  let animation = 0;
  let visible = false;
  const stopTour = () => {
    cancelAnimationFrame(animation);
    animation = 0;
    frame.classList.remove('rentlens-demo-playing');
  };
  const play = () => {
    if (!visible || motion.matches || animation || !image.complete || !image.naturalWidth) return;
    const start = performance.now();
    frame.classList.add('rentlens-demo-playing');
    const tick = now => {
      const elapsed = (now - start) % 13000;
      const progress = Math.min(1, Math.max(0, (elapsed - 1800) / 6500));
      const eased = progress * progress * (3 - 2 * progress);
      const reset = Math.min(1, Math.max(0, (elapsed - 10800) / 1400));
      const position = elapsed < 10800 ? eased : 1 - reset * reset * (3 - 2 * reset);
      rentlensScroll.scrollTop = (rentlensScroll.scrollHeight - rentlensScroll.clientHeight) * position;
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) play(); else stopTour();
  }, { threshold: .3 });
  observer.observe(rentlensScroll);
  image.addEventListener('load', play);
  motion.addEventListener('change', () => {
    stopTour();
    if (motion.matches) rentlensScroll.scrollTop = 0;
    else play();
  });
}
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

function positionShowcasePill(event) {
  const bounds = showcase.getBoundingClientRect();
  const x = Math.min(event.clientX - bounds.left + 18, bounds.width - showcasePill.offsetWidth - 12);
  const y = Math.min(event.clientY - bounds.top + 18, bounds.height - showcasePill.offsetHeight - 12);
  showcasePill.style.transform = `translate3d(${Math.max(12, x)}px, ${Math.max(12, y)}px, 0)`;
}

showcase.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch') return;
  positionShowcasePill(event);
  showcase.classList.add('is-pointer-inside');
});

showcase.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  positionShowcasePill(event);
});

showcase.addEventListener('pointerleave', () => {
  showcase.classList.remove('is-pointer-inside');
});

document.querySelectorAll('[data-case-study-hover]').forEach((artwork) => {
  const pill = artwork.querySelector('.case-study-pill');

  const positionPill = (event) => {
    const bounds = artwork.getBoundingClientRect();
    const x = Math.min(event.clientX - bounds.left + 18, bounds.width - pill.offsetWidth - 12);
    const y = Math.min(event.clientY - bounds.top + 18, bounds.height - pill.offsetHeight - 12);
    pill.style.transform = `translate3d(${Math.max(12, x)}px, ${Math.max(12, y)}px, 0)`;
  };

  artwork.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    positionPill(event);
    artwork.classList.add('is-pointer-inside');
  });

  artwork.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    positionPill(event);
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
let workFilter = 'all';

function updateMoreWork() {
  workFilters.forEach((button) => {
    const isActive = button.dataset.filter === workFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  moreWorkCards.forEach((card) => {
    const matchesFilter = workFilter === 'all' || card.dataset.categories.split(' ').includes(workFilter);
    card.hidden = card.hasAttribute('data-project-hidden') || !matchesFilter;
  });
}

workFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    workFilter = filterButton.dataset.filter;
    updateMoreWork();
  });
});

const allyChatVisual = document.querySelector('.ally-chat-visual');
const allyTypingText = document.querySelector('.ally-typing-text');
const allyMessages = [
  'Show me my payslip.',
  'How many sick days do I have?',
  'Explain my leave policy.',
  'Show my attendance summary.',
  'What benefits am I eligible for?',
  'Explain my payroll deductions.'
];
let allyTypingTimer;

function playAllyTyping() {
  if (!allyChatVisual || !allyTypingText) return;
  window.clearTimeout(allyTypingTimer);
  allyTypingText.textContent = '';
  allyChatVisual.classList.add('is-typing');
  let messageIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  function typeCharacter() {
    const message = allyMessages[messageIndex];
    allyTypingText.textContent = message.slice(0, characterIndex);

    if (!isDeleting && characterIndex < message.length) {
      characterIndex += 1;
      allyTypingTimer = window.setTimeout(typeCharacter, 85);
    } else if (!isDeleting) {
      isDeleting = true;
      allyTypingTimer = window.setTimeout(typeCharacter, 1400);
    } else if (characterIndex > 0) {
      characterIndex -= 1;
      allyTypingTimer = window.setTimeout(typeCharacter, 35);
    } else {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % allyMessages.length;
      allyTypingTimer = window.setTimeout(typeCharacter, 350);
    }
  }

  allyTypingTimer = window.setTimeout(typeCharacter, 350);
}

if (allyChatVisual && allyTypingText) {
  const allyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) playAllyTyping();
    });
  }, { threshold: .45 });

  allyObserver.observe(allyChatVisual);
  allyChatVisual.addEventListener('pointerenter', playAllyTyping);
  allyChatVisual.addEventListener('click', playAllyTyping);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    allyObserver.disconnect();
    allyTypingText.textContent = 'Ask about payslips, leave, attendance, or benefits.';
    allyChatVisual.classList.remove('is-typing');
  }
}
