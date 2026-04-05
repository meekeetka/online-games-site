const CATEGORY_LABELS = {
  puzzle: 'Puzzle',
  arcade: 'Arcade',
  strategy: 'Strategy',
  word: 'Word',
  cards: 'Cards',
};

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function createCard(g, isFeatured = false) {
  const a = document.createElement('a');
  a.className = 'game-card' + (isFeatured ? ' featured' : '');
  a.href = `game.html?id=${encodeURIComponent(g.id)}`;
  const catLabel = CATEGORY_LABELS[g.category] || g.category || '';
  a.innerHTML = `
    <div class="card-img-wrap">
      <img src="${escapeAttr(g.coverUrl)}" alt="${escapeAttr(g.title)}" width="400" height="225" loading="lazy" />
      ${isFeatured ? '<span class="card-badge featured-badge">Featured</span>' : ''}
      ${catLabel ? `<span class="card-badge cat-badge" style="${isFeatured ? 'left:auto;right:.6rem' : ''}">${escapeHtml(catLabel)}</span>` : ''}
      <div class="card-play-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="rgba(79,138,255,0.9)"/>
          <path d="M26 20l20 12-20 12V20z" fill="#fff"/>
        </svg>
      </div>
    </div>
    <div class="game-card-body">
      <h2>${escapeHtml(g.title)}</h2>
      <p>${escapeHtml(g.description || '')}</p>
    </div>
  `;
  return a;
}

let allGames = [];
let currentCat = 'all';

function renderGrids() {
  const featuredGrid = document.getElementById('featured-grid');
  const grid = document.getElementById('grid');
  const featuredCount = document.getElementById('featured-count');
  const allCount = document.getElementById('all-count');
  const featuredSection = document.getElementById('featured-section');

  const filtered = currentCat === 'all'
    ? allGames
    : allGames.filter(g => g.category === currentCat);

  const featured = filtered.filter(g => g.featured);
  const rest = filtered.filter(g => !g.featured);

  featuredSection.style.display = featured.length ? '' : 'none';
  featuredGrid.innerHTML = '';
  for (const g of featured) featuredGrid.appendChild(createCard(g, true));
  featuredCount.textContent = featured.length || '';

  grid.innerHTML = '';
  if (rest.length === 0 && featured.length === 0) {
    grid.innerHTML = '<p class="empty-state">No games found in this category.</p>';
    allCount.textContent = '0';
  } else {
    for (const g of rest) grid.appendChild(createCard(g, false));
    allCount.textContent = rest.length;
  }
}

async function loadGames() {
  const grid = document.getElementById('grid');
  grid.innerHTML = [1,2,3,4].map(() =>
    `<div class="skeleton" style="aspect-ratio:16/9;height:auto;min-height:180px"></div>`
  ).join('');

  try {
    const res = await fetch('games.json');
    if (!res.ok) throw new Error('games.json not found');
    allGames = await res.json();

    document.getElementById('filters').addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderGrids();
    });

    renderGrids();
  } catch {
    grid.innerHTML =
      '<p class="empty-state">Could not load games.json.<br>Run <code>cd site-upgraded && python3 -m http.server 8080</code> and open <code>http://127.0.0.1:8080</code>.</p>';
  }
}

loadGames();
