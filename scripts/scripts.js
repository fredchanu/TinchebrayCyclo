document.addEventListener("DOMContentLoaded", () => {
    // Fetch and load menu
    fetch("/components/menu.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("menu-placeholder").innerHTML = html;
        })
        .catch(err => console.error("Erreur lors du chargement du menu :", err));

    // Fetch and load footer
    fetch("/components/footer.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("footer-placeholder").innerHTML = html;
        })
        .catch(err => console.error("Erreur lors du chargement du footer :", err));
});

const track = document.querySelector('.carousel-track');
const images = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const imageWidth = images[0].getBoundingClientRect().width;

let currentIndex = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
});


  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      this.classList.toggle("active");

      const panel = this.nextElementSibling;

      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
        panel.style.animation = "slideDown 0.4s ease";
      }
    });
  });

    // Mettre à jour automatiquement l'année dans le footer
    document.getElementById('year').textContent = new Date().getFullYear();




