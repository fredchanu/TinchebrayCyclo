console.log("✅ Script actus.js chargé !");

async function chargerActus() {
  try {
    const res = await fetch('/content/actus.json', { cache: "no-store" });
    const data = await res.json();
    const actus = data.actus || [];


    // Tri par date
    actus.sort((a, b) => new Date(b.date) - new Date(a.date));
    afficherActus(actus);
  } catch (err) {
    console.error('Erreur chargement actus :', err);
  }
}

function afficherActus(actus) {
  const isAccueil = document.querySelector('.news-grid');
  const containerPage = document.querySelector('.actus-list');

  if (isAccueil) {
    const recentes = actus.slice(0, 3);
    isAccueil.innerHTML = recentes.map(a => creerCarteActu(a)).join('');
  }
  if (containerPage) {
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
    </div>`;
}

document.addEventListener('DOMContentLoaded', chargerActus);
