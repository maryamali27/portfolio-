// Project filter + search (combined)
const filterBtns = document.querySelectorAll('.filter-btn');
const allCards = document.querySelectorAll('.project-card');
const searchInput = document.getElementById('projectSearch');
const searchClear = document.getElementById('searchClear');

function applyFilters() {
  const query = (searchInput.value || '').toLowerCase().trim();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  searchInput.parentElement.classList.toggle('has-value', query.length > 0);
  allCards.forEach(card => {
    const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
    const desc  = (card.querySelector('.project-desc')?.textContent  || '').toLowerCase();
    const tags  = card.dataset.tags || '';
    const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
  });
  updateProjectCounts();
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  applyFilters();
  searchInput.focus();
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
