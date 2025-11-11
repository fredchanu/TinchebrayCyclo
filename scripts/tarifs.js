// scripts/tarifs.js
fetch('content/tarifs.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.benefits');
    const licence = data.licence[0]; // première entrée (ex: licence adulte)
    const tarifItem = document.createElement('li');
    tarifItem.innerHTML = `<strong>📢 Licence ${data.annee} :</strong> Seulement <strong>${licence.prix}€</strong> grâce au soutien du club`;
    container.appendChild(tarifItem);
  })
  .catch(err => console.error('Erreur de chargement des tarifs :', err));
