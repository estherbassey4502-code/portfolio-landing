const caseStudies = {
  'employee-hub': {
    title: 'Employee Hub',
    subtitle: 'Everything work, right where employees need it.',
    focus: 'Employee experience · Product design',
    disciplines: 'PRODUCT DESIGN — EMPLOYEE EXPERIENCE — COMPLEX SYSTEMS',
    imageLabel: 'Employee Hub interface',
    coverViewBox: '320 870 5120 3515',
    wideImage: './assets/employee-clockin-normal-2x.png',
    storyImages: ['./assets/employee-clockin-away-2x.png', './assets/employee-clockin-normal-2x.png'],
    intro: ['An employee-facing workspace can bring the practical parts of work into one place: schedules, leave, tasks and personal information.', 'The design story is about making those everyday moments feel connected and easy to act on.'],
    overview: ['One place for the workday.', 'Employee Hub is framed as a starting point for the information and actions employees return to most often.'],
    overviewDetail: 'A good home screen needs to answer two questions quickly: what is happening today, and what should I do next?',
    context: ['Work tools can feel scattered.', 'When information sits in separate workflows, even simple tasks can require too much searching and switching.', 'How might the most important parts of a workday feel easier to find and finish?'],
    contextDetail: 'The opportunity is to make the relationship between time, tasks and employee support more visible without crowding the interface.',
    research: ['Understand the employee journey.', 'The case-study narrative can follow the journey from checking in to completing tasks and planning time away.'],
    researchDetail: 'Looking at these moments together helps reveal where the home experience needs immediate answers and where deeper detail belongs.',
    decisions: [['Start with the next useful action.', 'Put the tasks people need today ahead of less urgent information.'], ['Make status visible.', 'Show what is complete, what needs attention and where to go next.']],
    delivered: ['A clearer home for everyday work.', 'The screen arrangement brings the daily schedule, leave actions, payroll and tasks into a single view.'],
    deliveredDetail: 'Supporting screens can then expand each area without asking the dashboard to carry every detail at once.',
    closing: ['Connect the work back to the person doing it.', 'The strongest version of this story will show how a connected workspace helps employees move through a day with more confidence.'],
    closingDetail: 'The final case study can close with verified outcomes and the design lessons from the real project.',
    next: { title: 'Vacation Rentals', href: './vacation-rentals.html' }
  },
  moments: {
    title: 'Moments',
    subtitle: 'Turning everyday experiences into moments worth discovering.',
    focus: 'Discovery · Experience design',
    disciplines: 'EXPERIENCE DESIGN — PRODUCT DESIGN — DISCOVERY',
    imageLabel: 'Moments postcard editor interface',
    coverViewBox: '320 9176 5120 3510',
    wideImage: './assets/moments-state-base-2x.png',
    storyImages: ['./assets/moments-state-text-2x.png', './assets/moments-state-music-2x.png'],
    intro: ['Moments explores how an everyday experience can become something personal and shareable.', 'The editor makes space for words, imagery, music and small details that give each moment its character.'],
    overview: ['Make sharing feel expressive.', 'The experience begins with a simple canvas and grows through choices that let each person shape what they want to say.'],
    overviewDetail: 'Rather than treating creation as a form to complete, the interface can feel like a place to experiment.',
    context: ['Creation should feel inviting, not complicated.', 'Too many controls can interrupt an idea before it becomes a finished moment.', 'How might people make a moment feel like their own without slowing them down?'],
    contextDetail: 'The design challenge is to offer meaningful creative range while keeping the next step obvious.',
    research: ['Map the path from idea to share.', 'The story can follow a creator from their first thought through editing, previewing and publishing.'],
    researchDetail: 'At each stage, the interface should help them keep a sense of what the final moment will feel like.',
    decisions: [['Keep the canvas central.', 'Let people see the result as they change backgrounds, words and other details.'], ['Make options easy to discover.', 'Organize creative tools so exploration stays playful and understandable.']],
    delivered: ['An adaptable creation flow.', 'The screen arrangement shows how the editor can accommodate different content choices without losing its center.'],
    deliveredDetail: 'The final screens can demonstrate how visual, text and music decisions come together in a coherent composition.',
    closing: ['Leave space for personality.', 'A good creative tool gives people enough structure to begin and enough freedom to make the result feel theirs.'],
    closingDetail: 'The finished case study can add the actual design process and verified response to the experience.',
    next: { title: 'Rentlens', href: './project-case-study.html?project=rentlens' }
  },
  rentlens: {
    title: 'Rentlens',
    subtitle: 'Know what it’s like to live there, before you do.',
    focus: 'PropTech · Product design',
    disciplines: 'PRODUCT DESIGN — PROPERTY DISCOVERY — AI',
    imageLabel: 'Rentlens property discovery and reviews interface',
    coverImage: './assets/selected-rentlens-background-4x.png',
    wideImage: './assets/rentlens-reviews-full-4x.png',
    storyImages: ['./assets/selected-rentlens-background-4x.png', './assets/rentlens-reviews-full-4x.png'],
    intro: ['A property viewing can show the space, but it rarely tells the whole story of living there.', 'Rentlens brings resident perspectives into discovery so renters can look beyond the photos and ask better questions.'],
    overview: ['See past the viewing.', 'The concept combines property search with reviews and concise summaries of everyday living conditions.'],
    overviewDetail: 'A renter can move from a location or building name to the details that matter when deciding where to live.',
    context: ['A listing is only one side of the story.', 'Questions about safety, utilities, staff and day-to-day comfort often remain unanswered in a traditional property search.', 'How might renters feel better informed before making a decision?'],
    contextDetail: 'The challenge is to turn many individual experiences into a useful overview without erasing their nuance.',
    research: ['Find the questions that matter most.', 'Resident feedback can reveal recurring themes alongside the trade-offs that make each building different.'],
    researchDetail: 'The story can explore how renters compare those themes and where they need to read the underlying reviews.',
    decisions: [['Make review themes scannable.', 'Surface a concise summary while keeping the underlying resident feedback accessible.'], ['Balance positives and trade-offs.', 'Let renters compare practical details without flattening every property into one score.']],
    delivered: ['A more informed property search.', 'The screen arrangement connects search, suggested places, property cards and review summaries.'],
    deliveredDetail: 'A detailed view can give renters a clearer picture of what residents appreciate and what they would change.',
    closing: ['Help renters ask better questions.', 'The design direction is less about declaring a perfect property and more about making uncertainty easier to navigate.'],
    closingDetail: 'The final case study can add verified research, decisions and outcomes from the project.',
    next: { title: 'Employee Hub', href: './project-case-study.html?project=employee-hub' }
  }
};

const requestedProject = new URLSearchParams(location.search).get('project');
const project = caseStudies[requestedProject] || caseStudies['employee-hub'];
document.title = `${project.title} — Esther Bassey`;

function textAt(id, value) { document.getElementById(id).textContent = value; }
function leadAt(id, [lead, detail]) {
  const element = document.getElementById(id);
  const strong = document.createElement('strong');
  strong.textContent = lead;
  element.append(strong, document.createTextNode(` — ${detail}`));
}
function imageAt(id, src, label) {
  const image = document.getElementById(id);
  image.src = src;
  image.alt = label;
}

const cover = document.getElementById('case-cover');
if (project.coverImage) {
  const image = document.createElement('img');
  image.src = project.coverImage;
  image.alt = project.imageLabel;
  cover.append(image);
} else {
  cover.innerHTML = `<svg class="draft-cover-svg" viewBox="${project.coverViewBox}" role="img" aria-label="${project.imageLabel}" xmlns="http://www.w3.org/2000/svg"><image href="./assets/selected-work-4x.png" width="5760" height="13488" /></svg>`;
}
textAt('case-title', project.title);
textAt('case-subtitle', project.subtitle);
textAt('case-intro-one', project.intro[0]);
textAt('case-intro-two', project.intro[1]);
textAt('case-disciplines', project.disciplines);
textAt('case-project', project.title);
textAt('case-focus', project.focus);
imageAt('case-wide-image', project.wideImage, `${project.imageLabel} — draft screen placement`);
leadAt('case-overview-lead', project.overview);
textAt('case-overview-detail', project.overviewDetail);
leadAt('case-context-lead', project.context);
textAt('case-context-detail', project.contextDetail);
textAt('case-context-question', project.context[2]);
imageAt('case-story-image-one', project.storyImages[0], `${project.imageLabel} — draft supporting screen`);
leadAt('case-research-lead', project.research);
textAt('case-research-detail', project.researchDetail);
leadAt('case-decision-one', project.decisions[0]);
leadAt('case-decision-two', project.decisions[1]);
imageAt('case-story-image-two', project.storyImages[1], `${project.imageLabel} — draft detail screen`);
leadAt('case-delivered-lead', project.delivered);
textAt('case-delivered-detail', project.deliveredDetail);
leadAt('case-closing-lead', project.closing);
textAt('case-closing-detail', project.closingDetail);
document.getElementById('case-next-link').href = project.next.href;
document.getElementById('case-next-title').innerHTML = `${project.next.title} <i aria-hidden="true">↗</i>`;
if (location.hash) {
  window.addEventListener('load', () => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}
