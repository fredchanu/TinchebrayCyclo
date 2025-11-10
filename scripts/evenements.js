console.log("✅ evenements.js chargé");

// util
const parseISO = (s) => new Date(s);
const isFutureOrToday = (d) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const dt = new Date(d);   dt.setHours(0,0,0,0);
  return dt >= today;
};

async function chargerEvenements() {
  try {
    const res = await fetch('/content/evenements.json', { cache: 'no-store' });
    const data = await res.json();
    let events = Array.isArray(data) ? data : (data.evenements || []);

    // tri par date décroissante (plus récent en haut)
    events.sort((a,b) => parseISO(b.date) - parseISO(a.date));

    afficherAccueil(events);
    afficherPage(events);
  } catch (e) {
    console.error('❌ Erreur chargement événements :', e);
  }
}

// === ACCUEIL : bloque visuel existant, on remplace juste les contenus ===
function afficherAccueil(events) {
  const bloc = document.querySelector('.home-event'); // le conteneur de ta section "Prochains événements"
  if (!bloc) return;

  // prochaine date >= aujourd’hui ; sinon, le plus récent par défaut
  const prochain = events.slice().reverse().find(e => isFutureOrToday(e.date)) || events[0];
  if (!prochain) return;

  // cibles attendues (adapte les sélecteurs si besoin)
  const img  = bloc.querySelector('.home-event-image');      // <img>
  const date = bloc.querySelector('.home-event-date');       // <span> ou <p>
  const titre= bloc.querySelector('.home-event-title');      // <h3> ou <h2>
  const desc = bloc.querySelector('.home-event-desc');       // <p>
  const btnS = bloc.querySelector('.home-event-cta');        // bouton "S’inscrire"
  const btnP = bloc.querySelector('.home-event-more');       // bouton "En savoir plus"

  // injection
  if (img && prochain.image) img.src = prochain.image;
  if (titre) titre.textContent = prochain.titre || 'Événement';
  if (desc)  desc.textContent  = prochain.description || '';
  if (date)  date.textContent  = new Date(prochain.date).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  // bouton s'inscrire (affiché seulement si lien)
  if (btnS) {
    if (prochain.lien) {
      btnS.style.display = '';
      btnS.setAttribute('href', prochain.lien);
      btnS.setAttribute('target', '_blank');
      btnS.setAttribute('rel', 'noopener');
    } else {
      btnS.style.display = 'none';
    }
  }

  // bouton "En savoir plus" → va vers la page événements
  if (btnP) {
    btnP.setAttribute('href', 'evenements.html');
  }
}

// === PAGE EVENEMENTS : liste complète (à venir en haut, passés en bas) ===
function afficherPage(events) {
  const list = document.querySelector('.events-list'); // conteneur liste
  if (!list) return;

  const aVenir = events.filter(e => isFutureOrToday(e.date))
                       .sort((a,b) => parseISO(a.date) - parseISO(b.date)); // proche d’abord
  const passes = events.filter(e => !isFutureOrToday(e.date));

  const tpl = (e, badge) => {
    const d = new Date(e.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    return `
      <article class="event-card">
        <div class="event-media">
          ${e.image ? `<img src="${e.image}" alt="${e.titre}">` : ''}
          ${badge ? `<span class="event-badge">${badge}</span>` : ''}
        </div>
        <div class="event-body">
          <p class="event-date">${d}</p>
          <h3 class="event-title">${e.titre || 'Événement'}</h3>
          <p class="event-desc">${e.description || ''}</p>
          <div class="event-actions">
            ${e.lien ? `<a class="btn-yellow" href="${e.lien}" target="_blank" rel="noopener">S’inscrire</a>` : ''}
          </div>
        </div>
      </article>
    `;
  };

  list.innerHTML = `
    ${aVenir.length ? `<h2 class="events-section-title">À venir</h2>` : ''}
    ${aVenir.map(e => tpl(e, 'À venir')).join('')}
    ${passes.length ? `<h2 class="events-section-title">Archives</h2>` : ''}
    ${passes.map(e => tpl(e, 'Terminé')).join('')}
  `;
}

document.addEventListener('DOMContentLoaded', chargerEvenements);
