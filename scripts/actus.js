
fetch('../data/actus.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('actus-container');
    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('actus-card');
      card.innerHTML = `
        <img src="${item.image}" alt="${item.titre}">
        <h3>${item.titre}</h3>
        <p class="date">${item.date}</p>
        <p>${item.texte}</p>
      `;
      container.appendChild(card);
    });
  });
