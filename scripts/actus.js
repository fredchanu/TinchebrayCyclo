// === ACTUS DYNAMIQUES ===
// Charge les fichiers JSON du dossier /content/actus et les affiche
// sur la page d'accueil (3 dernières) et sur la page actualites.html (toutes)

async function chargerActus() {
  try {
    const response = await fetch('/content/actus/');
    const text = await response.text();

    // Récupération des noms de fichiers (Netlify liste le contenu d'un dossier)
    const matches = [...text.matchAll(/href="([^"]+\.json)"/g)].map(m => m[1]);
    const fichiers = matches.filter(f => f.endsWith('.json'));

    const actus = [];

    for (const fichier of fichiers) {
      const res = await fetch(`/content/actus/${fichier}`);
      const data = await res.json();
      actus.push(data);
    }

    // Tri par date décroissante
    actus.sort((a, b) => new Date(b.date) - new Date(a.date));

    afficherActus(actus);
  } catch (err) {
    console.error('Erreur chargement actus :', err);
  }
}

function afficherActus(actus) {
  const isAccueil = document.body.innerHTML.includes('section-news');
  const containerAccueil = document.querySelector('.news-grid');
  const containerPage = document.querySelector('.actus-list');

  if (isAccueil && containerAccueil) {
    // Affiche les 3 dernières actus sur l'accueil
    const recentes = actus.slice(0, 3);
    containerAccueil.innerHTML = recentes.map(a => creerCarteActu(a)).join('');
  }

  if (containerPage) {
    // Page actualites.html -> toutes les actus
    containerPage.innerHTML = actus.map(a => creerCarteActu(a, true)).join('');
  }
}

function creerCarteActu(a, complet = false) {
  const date = new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const texte = complet ? a.text : (a.text.length > 120 ? a.text.slice(0, 120) + '...' : a.text);

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

// Lancer automatiquement au chargement
document.addEventListener('DOMContentLoaded', chargerActus);
