const navigation = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-button');
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeToggle.setAttribute('aria-pressed', String(dark));
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('portfolio-theme', next); } catch { /* Theme remains active for this visit. */ }
  syncTheme();
});
syncTheme();
const links = [...document.querySelectorAll('.contents a')];
const sections = links.map(link => document.querySelector(link.hash));
function updateNavigation() {
  navigation.classList.toggle('is-scrolled', window.scrollY > 48);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 200) current = section;
  }
  for (const link of links) {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();
