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

    // 💾 sauvegarde pour la page de détail
    localStorage.setItem('actus', JSON.stringify(actus));

    afficherActus(actus);
  } catch (err) {
    console.error('❌ Erreur chargement actus :', err);
  }
}

// === Affichage des actus ===
function afficherActus(actus) {
  const containerAccueil = document.querySelector('.news-grid');
  const containerPage = document.querySelector('.actus-list');

  // Section accueil (3 plus récentes)
  if (containerAccueil) {
    const recentes = actus.slice(0, 3);
    containerAccueil.innerHTML = recentes.map(a => creerCarteActu(a)).join('');
  }

  // Page actualités (toutes)
  if (containerPage) {
    containerPage.innerHTML = actus.map(a => creerCarteActu(a, true)).join('');
  }

  // 🔧 Force affichage immédiat (évite les fades bloqués)
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

// === Création d'une carte actu ===
function creerCarteActu(a, complet = false) {
  const date = new Date(a.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Texte résumé ou complet
  const texte = complet
    ? a.text
    : (a.text.length > 120 ? a.text.slice(0, 120) + '...' : a.text);

  // Gestion multi-images
  const images = Array.isArray(a.images) ? a.images : (a.image ? [a.image] : []);
  const imagePrincipale = images[0] || '';

  // Encodage du titre pour l'attribut data-title
  const dataTitle = encodeURIComponent(a.title || "");

  return `
    <a class="news-card fade-in" href="actu-detail.html" data-title="${dataTitle}">
      ${imagePrincipale ? `<img src="${imagePrincipale}" alt="${a.title}">` : ''}
      <div class="news-content">
        <p class="news-date">${date}</p>
        <h3 class="news-title">${a.title}</h3>
        <p class="news-summary">${texte}</p>
        <span class="news-readmore">Lire la suite →</span>
      </div>
    </a>
  `;
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', chargerActus);

// === Gestion du clic sur une carte ===
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.news-card[href]');
  if (!link) return;

  const encoded = link.dataset.title || "";
  const title = decodeURIComponent(encoded);
  const actus = JSON.parse(localStorage.getItem('actus') || '[]');
  const actu = actus.find(a => (a.title || "") === title);

  if (actu) {
    localStorage.setItem('actu-detail', JSON.stringify(actu));
    // On laisse le lien faire sa navigation normale vers actu-detail.html
  }
});
