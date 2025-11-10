console.log("✅ rando.js chargé");

// --- Outil date ---
const parseISO = s => new Date(s);
const isFutureOrToday = d => {
  const t = new Date(); t.setHours(0,0,0,0);
  const dt = new Date(d); dt.setHours(0,0,0,0);
  return dt >= t;
};

// --- Charger et afficher ---
async function chargerRando() {
  try {
    const res = await fetch('/content/evenements.json', { cache: 'no-store' });
    const data = await res.json();
    const events = data.evenements || [];
    events.sort((a,b) => parseISO(b.date) - parseISO(a.date));

    const prochaine = events.slice().reverse().find(e => isFutureOrToday(e.date)) || events[0];
    const passees = events.filter(e => !isFutureOrToday(e.date));

    afficherRando(prochaine);
    afficherArchives(passees);
  } catch (err) {
    console.error('❌ Erreur chargement événements :', err);
  }
}

// --- Afficher la rando courante ---
function afficherRando(e) {
  if (!e) return;

  // Hero
  const h1 = document.querySelector('.hero-content h1');
  const heroP = document.querySelector('.hero-content p');
  if (h1) h1.textContent = e.titre;
  if (heroP) heroP.textContent = `Rejoignez-nous à Tinchebray le ${new Date(e.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })} pour un moment sportif et convivial !`;

  // Infos pratiques
  const infos = document.querySelector('.section.green .container');
  if (infos) {
    infos.innerHTML = `
      <h2>Infos pratiques</h2>
      <p><strong>📅 Date :</strong> ${new Date(e.date).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}</p>
      <p><strong>📍 Lieu :</strong> Départ depuis le champ de foire de Tinchebray</p>
      <p><strong>🕘 Horaires :</strong> Accueil à partir de 7h30, départs libres jusqu’à 9h30</p>
      <p><strong>🥪 Ravitaillements :</strong> Oui, sur les parcours</p>
      <p><strong>💰 Tarifs :</strong> 5€ licenciés / 8€ non-licenciés / gratuit -12 ans</p>
      <div class="cta-center" style="margin-top:2rem;">
        ${e.lien ? `<a href="${e.lien}" target="_blank" rel="noopener noreferrer" class="cta">Je participe</a>` : `<p>Les inscriptions ouvriront bientôt.</p>`}
      </div>
    `;
  }

  // Flyer
  const flyer = document.querySelector('.flyer-img');
  if (flyer && e.image) flyer.src = e.image;
  if (flyer) flyer.alt = `Flyer ${e.titre}`;
}

// --- Afficher les randos passées ---
function afficherArchives(list) {
  const cont = document.querySelector('.section.green.arc-top .container');
  if (!cont) return;
  if (!list.length) return;

  const html = `
    <h2>Éditions précédentes</h2>
    <div class="events-archives">
      ${list.map(ev => `
        <div class="archive-card">
          ${ev.image ? `<img src="${ev.image}" alt="${ev.titre}">` : ''}
          <div class="archive-body">
            <h3>${ev.titre}</h3>
            <p>${ev.description || ''}</p>
            <p class="archive-date">${new Date(ev.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  cont.innerHTML += html;
}

// --- Lancer ---
document.addEventListener('DOMContentLoaded', chargerRando);
