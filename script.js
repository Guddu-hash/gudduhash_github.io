// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ============ Scroll-spy active nav link ============
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('[data-nav]');

function updateActiveNav(){
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 120 && rect.bottom >= 120){ current = sec.id; }
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav, {passive:true});
updateActiveNav();

// ============ Reveal on scroll ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => revealObserver.observe(el));

// Hero title line-by-line reveal (staggered via CSS transition-delay)
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.hero-title').classList.add('animate'), 200);
});

// ============ Animated stat counters ============
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.5});
statNums.forEach(el => statObserver.observe(el));

function animateCount(el){
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if(progress < 1){ requestAnimationFrame(tick); }
  }
  requestAnimationFrame(tick);
}

// ============ Pipeline fill line synced to scroll ============
const pipeline = document.getElementById('pipeline');
const pipelineFill = document.getElementById('pipelineFill');

function updatePipelineFill(){
  if(!pipeline) return;
  const rect = pipeline.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const total = rect.height;
  const visible = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
  const pct = total > 0 ? (visible / total) * 100 : 0;
  pipelineFill.style.height = pct + '%';
}
window.addEventListener('scroll', updatePipelineFill, {passive:true});
window.addEventListener('resize', updatePipelineFill);
updatePipelineFill();

// ============ Cursor glow (desktop only, subtle) ============
const glow = document.getElementById('cursorGlow');
let glowActive = false;
if(window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    if(!glowActive){ glow.style.opacity = '0.5'; glowActive = true; }
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; glowActive = false; });
}

// ============ Project card tilt ============
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});
