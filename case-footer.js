const footerTagField = document.querySelector('.contact-tags');
const footerSection = document.querySelector('.contact-section');
const footerTags = footerTagField ? [...footerTagField.querySelectorAll('li')] : [];
const reduceFooterMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrowFooter = window.matchMedia('(max-width: 520px)');
const footerStartAngles = [-8, 7, -5, 4, 9, -7, 6, -10];
let footerBodies = [];
let footerAnimationFrame = 0;
let footerLastTime = 0;
let footerHasLaunched = false;

function getFooterRows(widths, availableWidth, gap) {
  const firstRowWidth = widths.slice(0, 6).reduce((sum, width) => sum + width, 0) + gap * 5;
  if (firstRowWidth <= availableWidth) return [[0, 1, 2, 3, 4, 5], [6, 7]];

  const rows = [[]];
  let rowWidth = 0;
  widths.forEach((width, index) => {
    const nextWidth = rowWidth + (rows[rows.length - 1].length ? gap : 0) + width;
    if (nextWidth > availableWidth && rows[rows.length - 1].length) {
      rows.push([]);
      rowWidth = 0;
    }
    rows[rows.length - 1].push(index);
    rowWidth += (rows[rows.length - 1].length > 1 ? gap : 0) + width;
  });
  return rows;
}

function positionFooterTags(above = false) {
  if (!footerTagField || !footerTags.length) return;
  const footerInner = footerTagField.parentElement;
  footerInner.style.minHeight = '';
  if (reduceFooterMotion || narrowFooter.matches) return;
  const fieldWidth = footerTagField.clientWidth;
  const widths = footerTags.map((tag) => tag.offsetWidth);
  const heights = footerTags.map((tag) => tag.offsetHeight);
  const gap = 12;
  const rowGap = 10;
  const rows = getFooterRows(widths, fieldWidth - 24, gap);
  const rowHeights = rows.map((row) => Math.max(...row.map((index) => heights[index])));
  const totalHeight = rowHeights.reduce((sum, height) => sum + height, 0) + rowGap * (rows.length - 1);
  const socialBottom = footerInner.querySelector('.contact-socials').getBoundingClientRect().bottom - footerTagField.getBoundingClientRect().top;
  let rowY = Math.ceil(socialBottom + 64);
  footerInner.style.minHeight = Math.max(420, rowY + totalHeight + 32) + 'px';
  const targets = [];

  rows.forEach((row, rowIndex) => {
    const rowWidth = row.reduce((sum, index) => sum + widths[index], 0) + gap * (row.length - 1);
    let x = (fieldWidth - rowWidth) / 2;
    row.forEach((index) => {
      targets[index] = { x, y: rowY + (rowHeights[rowIndex] - heights[index]) / 2 };
      x += widths[index] + gap;
    });
    rowY += rowHeights[rowIndex] + rowGap;
  });

  footerBodies = footerTags.map((tag, index) => {
    const target = targets[index];
    const y = above ? -heights[index] - 24 - (index % 3) * 22 : target.y;
    const angle = above ? footerStartAngles[index] : 0;
    tag.classList.toggle('is-settled', !above);
    tag.style.animationDelay = '-' + (index * .9) + 's';
    tag.style.transform = 'translate3d(' + target.x + 'px, ' + y + 'px, 0) rotate(' + angle + 'deg)';
    return { tag, x: target.x, y, targetY: target.y, vy: 0, angle, settled: !above };
  });
}

function animateFooterTags(time) {
  const delta = Math.min((time - footerLastTime) / 1000 || 0, .032);
  footerLastTime = time;
  let moving = false;

  footerBodies.forEach((body) => {
    if (body.settled) return;
    body.vy += 1700 * delta;
    body.y += body.vy * delta;
    body.angle *= Math.max(0, 1 - 8 * delta);
    if (body.y >= body.targetY) {
      body.y = body.targetY;
      body.vy = -Math.abs(body.vy) * .2;
      if (Math.abs(body.vy) < 45) {
        body.vy = 0;
        body.angle = 0;
        body.settled = true;
        body.tag.classList.add('is-settled');
      }
    }
    body.tag.style.transform = 'translate3d(' + body.x + 'px, ' + body.y + 'px, 0) rotate(' + body.angle + 'deg)';
    if (!body.settled) moving = true;
  });

  if (moving) footerAnimationFrame = window.requestAnimationFrame(animateFooterTags);
}

if (footerSection && footerTagField && footerTags.length && !reduceFooterMotion) {
  if (!narrowFooter.matches) positionFooterTags(true);
  const footerObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || footerHasLaunched) return;
    footerHasLaunched = true;
    footerObserver.disconnect();
    if (narrowFooter.matches) return;
    footerLastTime = performance.now();
    footerAnimationFrame = window.requestAnimationFrame(animateFooterTags);
  }, { threshold: .05 });
  footerObserver.observe(footerSection);
  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(footerAnimationFrame);
    positionFooterTags(!footerHasLaunched);
  });
}
