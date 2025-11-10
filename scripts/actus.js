console.log("✅ Script actus.js chargé !");

// === Chargement des actualités ===
async function chargerActus() {
  try {
    const res = await fetch('/content/actus.json', { cache: "no-store" });
    const data = await res.json();
    const actus = data.actus || [];

    // tri par date décroissante
    actus.sort((a, b) => new Date(b.date) - new Date(a.date));

    // stock pour la page détail
    localStorage.setItem('actus', JSON.stringify(actus));

    afficherActus(actus);
  } catch (err) {
    console.error('❌ Erreur chargement actus :', err);
  }
}

// === Affichage des actus ===
function afficherActus(actus) {
  const containerAccueil = document.querySelector('.news-grid');   // Accueil (3)
  const containerPage    = document.querySelector('.actus-list');  // Page Actualités (toutes)

  if (containerAccueil) {
    const recentes = actus.slice(0, 3);
    containerAccueil.innerHTML = recentes
      .map(a => creerCarteActu(a))
      .join('');
  }

  if (containerPage) {
    containerPage.innerHTML = actus
      .map(a => creerCarteActu(a, true))
      .join('');
  }

  // Forcer visible si un CSS "fade-in" bloque
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

// === Carte d’actu (anchor cliquable + data-title) ===
function creerCarteActu(a, complet = false) {
  const date = new Date(a.date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // on tronque côté rendu (3 lignes contrôlées au CSS)
  const texte = a.text || "";

  // on encode le titre pour le passer en data-*
  const dataTitle = encodeURIComponent(a.title || "");

  return `
    <a class="news-card fade-in" href="actu-detail.html" data-title="${dataTitle}">
      ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ''}
      <div class="news-content">
        <p class="news-date">${date}</p>
        <h3 class="news-title">${a.title}</h3>
        <p class="news-summary">${texte}</p>
        <span class="news-readmore">Lire la suite →</span>
      </div>
    </a>
  `;
}

// === Interception du clic pour pousser la bonne actu dans localStorage ===
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.news-card[href]');
  if (!link) return;

  const encoded = link.dataset.title || "";
  const title = decodeURIComponent(encoded);
  const actus = JSON.parse(localStorage.getItem('actus') || '[]');
  const actu = actus.find(a => (a.title || "") === title);

  if (actu) {
    localStorage.setItem('actu-detail', JSON.stringify(actu));
    // on laisse la navigation <a href="actu-detail.html"> se faire
  }
});

// Lancement
document.addEventListener('DOMContentLoaded', chargerActus);
