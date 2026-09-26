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
    card.hidden = card.hasAttribute('data-project-hidden') || !matchesFilter || (card.hasAttribute('data-expanded-card') && !workExpanded);
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

const footerTagField = document.querySelector('.contact-tags');
const footerSection = document.querySelector('.contact-section');
const footerTags = footerTagField ? [...footerTagField.querySelectorAll('li')] : [];
const reduceFooterMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let footerBodies = [];
let footerAnimationFrame = 0;
let footerLastTime = 0;
let footerIsRunning = false;
let footerHasLaunched = false;
const footerRestAngles = [-8, 7, -5, 0, 9, -7, 6, -10];

function positionFooterTags() {
  if (!footerTagField || !footerTags.length || reduceFooterMotion) return;
  const field = footerTagField.getBoundingClientRect();
  footerBodies = footerTags.map((tag, index) => {
    const width = tag.offsetWidth;
    const height = tag.offsetHeight;
    const lanes = Math.min(4, footerTags.length);
    const lane = index % lanes;
    const laneWidth = field.width / lanes;
    const x = Math.max(0, Math.min(field.width - width, lane * laneWidth + (laneWidth - width) / 2 + (index >= lanes ? laneWidth * .12 : -laneWidth * .08)));
    const y = -height - 12 - Math.floor(index / lanes) * (height + 18);
    const body = { tag, x, y, width, height, vx: 0, vy: 0, angle: footerRestAngles[index] || 0, spin: 0 };
    tag.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}deg)`;
    return body;
  });
}

function resolveFooterCollisions() {
  for (let firstIndex = 0; firstIndex < footerBodies.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < footerBodies.length; secondIndex += 1) {
      const first = footerBodies[firstIndex];
      const second = footerBodies[secondIndex];
      const overlapX = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
      const overlapY = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);
      if (overlapX <= 0 || overlapY <= 0) continue;

      if (overlapX < overlapY) {
        const direction = first.x < second.x ? -1 : 1;
        first.x += direction * overlapX * .5;
        second.x -= direction * overlapX * .5;
        const firstVelocity = first.vx;
        first.vx = second.vx * .72;
        second.vx = firstVelocity * .72;
      } else {
        const direction = first.y < second.y ? -1 : 1;
        first.y += direction * overlapY * .5;
        second.y -= direction * overlapY * .5;
        const firstVelocity = first.vy;
        first.vy = second.vy * .68;
        second.vy = firstVelocity * .68;
      }
    }
  }
}

function animateFooterTags(time) {
  if (!footerIsRunning || !footerTagField) return;
  const field = footerTagField.getBoundingClientRect();
  const delta = Math.min((time - footerLastTime) / 1000 || 0, .032);
  footerLastTime = time;
  let movingBodies = 0;

  footerBodies.forEach((body) => {
    body.vy += 1150 * delta;
    body.x += body.vx * delta;
    body.y += body.vy * delta;
    body.angle += body.spin * delta;

    if (body.x < 18) { body.x = 18; body.vx = Math.abs(body.vx) * .7; }
    if (body.x + body.width > field.width - 18) { body.x = field.width - body.width - 18; body.vx = -Math.abs(body.vx) * .7; }
    if (body.y < 0 && body.vy < 0) { body.y = 0; body.vy = Math.abs(body.vy) * .72; }
    if (body.y + body.height > field.height) {
      body.y = field.height - body.height;
      body.vy = -Math.abs(body.vy) * .54;
      body.vx *= .86;
      if (Math.abs(body.vy) < 22) body.vy = 0;
    }
    if (Math.abs(body.vx) + Math.abs(body.vy) + Math.abs(body.spin) > 8) movingBodies += 1;
  });

  resolveFooterCollisions();
  footerBodies.forEach((body) => {
    body.tag.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
  });

  if (movingBodies > 0) footerAnimationFrame = window.requestAnimationFrame(animateFooterTags);
  else footerIsRunning = false;
}

function launchFooterTags() {
  if (!footerTagField || !footerBodies.length || reduceFooterMotion) return;
  window.cancelAnimationFrame(footerAnimationFrame);
  positionFooterTags();
  footerBodies.forEach((body, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    body.vx = direction * (18 + (index % 4) * 12);
    body.vy = 35 + (index % 3) * 28;
    body.angle = footerRestAngles[index] || 0;
    body.spin = 0;
  });
  footerIsRunning = true;
  footerLastTime = performance.now();
  footerAnimationFrame = window.requestAnimationFrame(animateFooterTags);
}

if (footerSection && footerTagField && footerTags.length && !reduceFooterMotion) {
  positionFooterTags();
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !footerHasLaunched) {
        footerHasLaunched = true;
        launchFooterTags();
        footerObserver.disconnect();
      }
    });
  }, { threshold: .05 });
  footerObserver.observe(footerSection);
  window.addEventListener('resize', () => {
    if (!footerHasLaunched) positionFooterTags();
  });
}
