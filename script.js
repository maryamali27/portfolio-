// Typed text effect
const phrases = [
  'Cybersecurity Engineer',
  'Full Stack Developer',
  'Systems Programmer',
  'Rust Developer',
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

// Navbar: dark-nav while hero is visible, light-nav when scrolled past
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('hero');

function updateNavbar() {
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (heroBottom > 68) {
    navbar.classList.add('dark-nav');
    navbar.classList.remove('light-nav');
  } else {
    navbar.classList.add('light-nav');
    navbar.classList.remove('dark-nav');
  }
  updateActiveNav();
}
updateNavbar();
window.addEventListener('scroll', updateNavbar);

// Active nav link
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const allCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    allCards.forEach(card => {
      const tags = card.dataset.tags || '';
      if (filter === 'all' || tags.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
    updateProjectCounts();
  });
});

function updateProjectCounts() {
  const rebootGrid = document.getElementById('projectsGrid');
  const githubGrid = document.getElementById('githubGrid');
  const rebootVisible = rebootGrid.querySelectorAll('.project-card:not(.hidden)').length;
  const githubVisible = githubGrid.querySelectorAll('.project-card:not(.hidden)').length;
  document.getElementById('rebootCount').textContent =
    rebootVisible > 0 ? `${rebootVisible} project${rebootVisible !== 1 ? 's' : ''}` : '';
  document.getElementById('githubCount').textContent =
    githubVisible > 0 ? `${githubVisible} project${githubVisible !== 1 ? 's' : ''}` : '';
}
updateProjectCounts();

// Scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
  revealObserver.observe(el);
});

// Project carousels — drag, momentum, snap, arrow nav
document.querySelectorAll('.projects-grid').forEach(grid => {
  // Wrap grid in carousel container
  const wrap = document.createElement('div');
  wrap.className = 'carousel-wrap';
  grid.parentNode.insertBefore(wrap, grid);
  wrap.appendChild(grid);

  // Only add arrow buttons if enough cards to scroll
  if (grid.querySelectorAll('.project-card').length > 3) {
    const prev = document.createElement('button');
    prev.className = 'carousel-btn prev';
    prev.setAttribute('aria-label', 'Scroll left');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

    const next = document.createElement('button');
    next.className = 'carousel-btn next';
    next.setAttribute('aria-label', 'Scroll right');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    wrap.appendChild(prev);
    wrap.appendChild(next);

    const STEP = 320;
    prev.addEventListener('click', () => grid.scrollBy({ left: -STEP, behavior: 'smooth' }));
    next.addEventListener('click', () => grid.scrollBy({ left: STEP, behavior: 'smooth' }));
  }

  // Drag-to-scroll with momentum
  let isDragging = false, startX, scrollStart, lastX, lastTime, velocity;
  let rafId;

  grid.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    scrollStart = grid.scrollLeft;
    lastX = e.clientX;
    lastTime = Date.now();
    velocity = 0;
    cancelAnimationFrame(rafId);
    grid.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    grid.scrollLeft = scrollStart - (e.clientX - startX);
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastTime = now;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove('is-dragging');
    let vel = velocity * 12;
    function coast() {
      if (Math.abs(vel) < 0.5) return;
      grid.scrollLeft -= vel;
      vel *= 0.9;
      rafId = requestAnimationFrame(coast);
    }
    coast();
  });

  // Touch swipe
  let touchStartX, touchScrollStart;
  grid.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchScrollStart = grid.scrollLeft;
  }, { passive: true });
  grid.addEventListener('touchmove', e => {
    grid.scrollLeft = touchScrollStart - (e.touches[0].clientX - touchStartX);
  }, { passive: true });
});

// 3D tilt effect on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const grid = card.closest('.projects-grid');
    if (grid && grid.classList.contains('is-dragging')) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s cubic-bezier(.2,0,.2,1), box-shadow .25s ease';
  });
});

// Contact form — opens default email client
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const body = `Hi Maryam,\n\nMy name is ${name} (${email}).\n\n${message}`;
  const mailto = `mailto:meemeeah64@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  btnText.textContent = 'Opening email client...';
  formNote.textContent = 'Your email client should open. If not, email meemeeah64@gmail.com directly.';
  formNote.className = 'form-note success';

  setTimeout(() => {
    btnText.textContent = 'Send Message';
    formNote.textContent = '';
    form.reset();
  }, 4000);
});
