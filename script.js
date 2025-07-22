// Animated background: floating orbs
const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');
let width, height, orbs;

function getAccentColors() {
  const styles = getComputedStyle(document.body);
  return [styles.getPropertyValue('--accent').trim(), styles.getPropertyValue('--accent-alt').trim()];
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function randomColor() {
  const [accent, accentAlt] = getAccentColors();
  return Math.random() > 0.5 ? accent : accentAlt;
}

function createOrbs(num) {
  return Array.from({length: num}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 30 + Math.random() * 40,
    dx: -0.5 + Math.random(),
    dy: -0.5 + Math.random(),
    color: randomColor(),
    alpha: 0.18 + Math.random() * 0.12
  }));
}

function animateOrbs() {
  ctx.clearRect(0, 0, width, height);
  for (const orb of orbs) {
    ctx.save();
    ctx.globalAlpha = orb.alpha;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, 2 * Math.PI);
    ctx.fillStyle = orb.color;
    ctx.shadowColor = orb.color;
    ctx.shadowBlur = 32;
    ctx.fill();
    ctx.restore();
    orb.x += orb.dx;
    orb.y += orb.dy;
    if (orb.x < -orb.r) orb.x = width + orb.r;
    if (orb.x > width + orb.r) orb.x = -orb.r;
    if (orb.y < -orb.r) orb.y = height + orb.r;
    if (orb.y > height + orb.r) orb.y = -orb.r;
  }
  requestAnimationFrame(animateOrbs);
}

function initBg() {
  resizeCanvas();
  orbs = createOrbs(18);
  animateOrbs();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  orbs = createOrbs(18);
});

initBg();

// Recreate orbs with new theme colors
function updateOrbsOnThemeChange() {
  orbs = createOrbs(18);
}

// Enhanced fade-in on scroll for [data-scroll] elements
function handleScrollFadeIn() {
  document.querySelectorAll('[data-scroll]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', handleScrollFadeIn);
window.addEventListener('load', handleScrollFadeIn);

// Navbar transparency on scroll
const nav = document.querySelector('.fixed-nav');
function handleNavScroll() {
  if (window.scrollY > 10) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll);
window.addEventListener('load', handleNavScroll);

// Smooth scroll with offset for fixed navbar
function scrollWithOffset(e) {
  if (this.hash) {
    e.preventDefault();
    const target = document.querySelector(this.hash);
    if (target) {
      const navHeight = document.querySelector('.fixed-nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', scrollWithOffset);
});

// Contact form handler
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.reset();
    form.innerHTML = '<div class="form-success">Thank you for reaching out! I will get back to you soon.</div>';
  });
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const iconMoon = document.querySelector('.theme-icon-moon');
const iconSun = document.querySelector('.theme-icon-sun');
function updateThemeIcon() {
  const isDark = body.getAttribute('data-theme') === 'dark';
  if (iconMoon && iconSun) {
    iconMoon.style.display = isDark ? 'inline' : 'none';
    iconSun.style.display = isDark ? 'none' : 'inline';
  }
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
    updateOrbsOnThemeChange();
  });
  updateThemeIcon();
}
// Also update orbs if theme is changed by other means
const observer = new MutationObserver(() => {
  updateOrbsOnThemeChange();
  updateThemeIcon();
});
observer.observe(body, { attributes: true, attributeFilter: ['data-theme'] });

// Burger menu for mobile nav
const burger = document.getElementById('burger-menu');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('show');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
} 
