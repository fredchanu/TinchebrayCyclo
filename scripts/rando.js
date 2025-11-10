console.log("✅ rando.js chargé");

// --- Utilitaires ---
const parseISO = s => new Date(s);
const isFutureOrToday = d => {
  const t = new Date(); t.setHours(0,0,0,0);
  const dt = new Date(d); dt.setHours(0,0,0,0);
  return dt >= t;
};

// --- Chargement ---
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

// --- Rando courante ---
function afficherRando(e) {
  if (!e) return;

  // HERO
  const h1 = document.querySelector('.hero-content h1');
  const heroP = document.querySelector('.hero-content p');
  if (h1) h1.textContent = e.titre || "Randonnée";
  if (heroP) heroP.textContent = `Rejoignez-nous à Tinchebray le ${new Date(e.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })} pour un moment sportif et convivial !`;

  // INFOS PRATIQUES
  const infos = document.getElementById('infos-rando');
  if (infos) {
    infos.innerHTML = `
      <h2>${e.titre}</h2>
      <p>${e.description || ''}</p>
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

  // FLYER
  const flyer = document.querySelector('.flyer-img');
  if (flyer && e.image) {
    flyer.src = e.image;
    flyer.alt = `Flyer ${e.titre}`;
  }
}

// --- ARCHIVES (anciennes randos + lien Facebook) ---
function afficherArchives(list) {
  const cont = document.getElementById('archives-container');
  if (!cont || !list.length) return;

  const dernierPasse = list
    .slice()
    .sort((a,b) => new Date(b.date) - new Date(a.date))[0];

  const fb = dernierPasse?.facebook_link;

  cont.innerHTML = `
    <h2>Éditions précédentes</h2>
    <p>Retrouvez les affiches et les photos des randonnées passées 👇</p>

    <div class="archives-grid">
      ${list.map(ev => `
        <div class="archive-card">
          <div class="archive-image">
            ${ev.image ? `<img src="${ev.image}" alt="${ev.titre}">` : ''}
            <div class="archive-overlay">
              <h3>${ev.titre}</h3>
              <p>${new Date(ev.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}</p>
              ${ev.facebook_link ? `<a href="${ev.facebook_link}" target="_blank" class="archive-btn">Voir les photos</a>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}



document.addEventListener('DOMContentLoaded', chargerRando);
