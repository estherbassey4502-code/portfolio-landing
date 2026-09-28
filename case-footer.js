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
