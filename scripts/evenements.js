console.log("✅ evenements.js chargé");

async function chargerAccueilEvenement() {
  try {
    // Lecture du fichier JSON
    const res = await fetch('/content/evenements.json', { cache: "no-store" });
    const data = await res.json();
    const events = data.evenements || [];

    if (!events.length) {
      console.warn("Aucun événement trouvé dans le JSON");
      return;
    }

    // On trie les événements par date décroissante
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // On sélectionne le premier événement à venir
    const aujourdHui = new Date();
    const prochain = events.find(e => new Date(e.date) >= aujourdHui) || events[events.length - 1];

    afficherAccueilEvenement(prochain);

  } catch (err) {
    console.error("❌ Erreur chargement des événements :", err);
  }
}

function afficherAccueilEvenement(e) {
  if (!e) return;

  // Sélecteurs de ta section accueil
  const img = document.querySelector(".home-event-image");
  const date = document.querySelector(".home-event-date");
  const titre = document.querySelector(".home-event-title");
  const desc = document.querySelector(".home-event-desc");
  const lien = document.querySelector(".home-event-cta");

  // Mise à jour du contenu
  if (img && e.image) img.src = e.image;
  if (titre) titre.textContent = e.titre || "Événement à venir";
  if (desc) desc.textContent = e.description || "Les détails seront bientôt disponibles.";

  if (date && e.date) {
    const dateFormatee = new Date(e.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    date.textContent = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1);
  }

  if (lien) {
    if (e.lien && e.lien.trim() !== "") {
      lien.href = e.lien;
      lien.style.display = "inline-block";
    } else {
      lien.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", chargerAccueilEvenement);
