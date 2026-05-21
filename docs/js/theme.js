const root = document.documentElement;
const btn  = document.getElementById('theme-toggle');
const KEY  = 'ma-theme';

function setTheme(dark) {
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem(KEY, dark ? 'dark' : 'light');
}

btn.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') !== 'dark');
});
