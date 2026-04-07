const CATEGORY_LABELS = {
  strategy: 'Strategy',
  board: 'Board',
  puzzle: 'Puzzle',
  cards: 'Cards',
  arcade: 'Arcade',
  word: 'Word',
  quiz: 'Quiz',
};

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const titleEl = document.getElementById('game-title');
  const crumbEl = document.getElementById('crumb-title');
  const frame = document.getElementById('game-frame');
  const ratioEl = document.getElementById('player-ratio');
  const descEl = document.getElementById('game-desc');
  const fallback = document.getElementById('fallback');
  const fallbackLink = document.getElementById('fallback-link');
  const newtabBtn = document.getElementById('newtab-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const catTag = document.getElementById('game-category-tag');

  if (!id) { titleEl.textContent = 'Game not found'; return; }

  try {
    const res = await fetch('games.json');
    if (!res.ok) throw new Error();
    const games = await res.json();
    const game = games.find(g => g.id === id);

    if (!game) { titleEl.textContent = 'Game not found'; return; }

    document.title = `${game.title} — Game Zone`;
    titleEl.textContent = game.title;
    crumbEl.textContent = game.title;
    frame.title = game.title;
    descEl.textContent = game.description || '';

    const catLabel = CATEGORY_LABELS[game.category] || game.category;
    if (catLabel) { catTag.textContent = catLabel; catTag.classList.remove('hidden'); }

    if (game.aspectRatio === '4/3') ratioEl.dataset.ratio = '4/3';

    const url = game.embedUrl;
    const externalUrl = game.openInNewTabUrl || url;
    frame.src = url;
    fallbackLink.href = externalUrl;
    newtabBtn.href = externalUrl;

    frame.addEventListener('error', () => fallback.classList.remove('hidden'));

    fullscreenBtn.addEventListener('click', () => {
      if (frame.requestFullscreen) frame.requestFullscreen();
      else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    });

  } catch {
    titleEl.textContent = 'Failed to load game';
  }
}

main();
