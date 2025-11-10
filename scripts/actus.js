console.log("✅ Script actus.js chargé !");

// === Chargement des actualités ===
async function chargerActus() {
  try {
    // on évite le cache
    const res = await fetch('/content/actus.json', { cache: "no-store" });
    const data = await res.json();

    // lecture du bon tableau
    const actus = data.actus || [];

    // tri par date décroissante
    actus.sort((a, b) => new Date(b.date) - new Date(a.date));

    afficherActus(actus);
  } catch (err) {
    console.error('❌ Erreur chargement actus :', err);
  }
}

// === Affichage des actus ===
function afficherActus(actus) {
  const containerAccueil = document.querySelector('.news-grid');
  const containerPage = document.querySelector('.actus-list');

  // section accueil (3 plus récentes)
  if (containerAccueil) {
    const recentes = actus.slice(0, 3);
    containerAccueil.innerHTML = recentes.map(a => creerCarteActu(a)).join('');
  }

  // page actualités (toutes)
  if (containerPage) {
    containerPage.innerHTML = actus.map(a => creerCarteActu(a, true)).join('');
  }

  // 🔧 Force l'affichage immédiat (bypass fade-in caché)
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

// === Modèle d'une carte actu ===
function creerCarteActu(a, complet = false) {
  const date = new Date(a.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const texte = complet
    ? a.text
    : (a.text.length > 120 ? a.text.slice(0, 120) + '...' : a.text);

  return `
    <div class="news-card fade-in">
      ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ''}
      <div class="news-content">
        <p class="news-date">${date}</p>
        <h3 class="news-title">${a.title}</h3>
        <p class="news-summary">${texte}</p>
      </div>
    </div>
  `;
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', chargerActus);

// === Affichage complet au clic ===
document.addEventListener('click', (e) => {
  const card = e.target.closest('.news-card');
  if (!card) return;

  const title = card.querySelector('.news-title').textContent;
  const actu = JSON.parse(localStorage.getItem('actus') || '[]')
    .find(a => a.title === title);

  if (actu) {
    localStorage.setItem('actu-detail', JSON.stringify(actu));
    window.location.href = 'actu-detail.html';
  }
});
