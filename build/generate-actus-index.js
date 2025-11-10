// === Génération automatique de /content/actus/.meta/index.json ===
// Version stable compatible Netlify + Decap CMS

const fs = require("fs");
const path = require("path");

async function generateActusIndex() {
  const actusDir = path.join(process.cwd(), "content", "actus");
  const metaDir = path.join(actusDir, ".meta");
  const indexFile = path.join(metaDir, "index.json");

  try {
    // Crée le dossier .meta s'il n'existe pas
    fs.mkdirSync(metaDir, { recursive: true });

    const files = fs.readdirSync(actusDir);
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json");

    fs.writeFileSync(indexFile, JSON.stringify(jsonFiles, null, 2));
    console.log(`✅ index.json généré dans .meta (${jsonFiles.length} fichiers)`);
  } catch (err) {
    console.error("❌ Erreur génération index.json :", err);
    process.exit(1);
  }
}

generateActusIndex();
