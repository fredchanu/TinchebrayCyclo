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
          // Insère le contenu du footer dans le placeholder
          document.getElementById("footer-placeholder").innerHTML = html;

          // Met à jour dynamiquement l'année après l'injection du footer
          const yearSpan = document.getElementById("year");
          if (yearSpan) {
              yearSpan.textContent = new Date().getFullYear();
          }
      })
      .catch(err => console.error("Erreur lors du chargement du footer :", err));

  // Carousel logic
  const track = document.querySelector('.carousel-track');
  if (track) {
      const images = Array.from(track.children);
      const prevButton = document.querySelector('.prev');
      const nextButton = document.querySelector('.next');
      const imageWidth = images[0].getBoundingClientRect().width;

      let currentIndex = 0;

      function updateCarousel() {
          track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
      }

      if (prevButton && nextButton) {
          prevButton.addEventListener('click', () => {
              currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
              updateCarousel();
          });

          nextButton.addEventListener('click', () => {
              currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
              updateCarousel();
          });
      }
  }

  // Accordion logic
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion) => {
      accordion.addEventListener("click", function () {
          this.classList.toggle("active");

          const panel = this.nextElementSibling;
          if (panel) {
              if (panel.style.display === "block") {
                  panel.style.display = "none";
              } else {
                  panel.style.display = "block";
                  panel.style.animation = "slideDown 0.4s ease";
              }
          }
      });
  });
});
