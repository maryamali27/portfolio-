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
