// Animations sur scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.2 // plus sensible
});

document.querySelectorAll('.slide-left, .slide-right, .fade-in, .zoom-in, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});


// Cascade pour les cartes actu
const cards = document.querySelectorAll('.news-card');
cards.forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.1}s`);
  card.classList.add('fade-in');
  observer.observe(card);
});

document.querySelectorAll(".accordion").forEach(button => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = panel.style.maxHeight;

    // Fermer tous les autres
    document.querySelectorAll(".panel").forEach(p => {
      p.style.maxHeight = null;
    });

    if (!isOpen) {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

document.querySelectorAll(".accordion").forEach(button => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = button.classList.contains("active");

    // Fermer tous les panels
    document.querySelectorAll(".accordion").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.style.maxHeight = null);

    if (!isOpen) {
      button.classList.add("active");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

document.getElementById("year").textContent = new Date().getFullYear();