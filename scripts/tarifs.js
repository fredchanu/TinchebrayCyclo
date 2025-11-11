fetch('content/tarifs.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.benefits');
    if (!container || !data.licences || data.licences.length === 0) return;

    const annee = data.annee || "en cours";
    data.licences.forEach(licence => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>📢 Licence ${annee} :</strong> ${licence.type} – <strong>${licence.tarif}</strong>`;
      container.appendChild(item);
    });
  })
  .catch(err => console.error('Erreur de chargement des tarifs :', err));
