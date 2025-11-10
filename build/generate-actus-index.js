// === Génération automatique de /content/actus/index.json ===
// Version CommonJS (compatible Netlify Node 18)

const fs = require("fs");
const path = require("path");

async function generateActusIndex() {
  const actusDir = path.join(process.cwd(), "content", "actus");
  const indexFile = path.join(actusDir, "index.json");

  try {
    const files = fs.readdirSync(actusDir);
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json");

    fs.writeFileSync(indexFile, JSON.stringify(jsonFiles, null, 2));
    console.log(`✅ index.json généré avec ${jsonFiles.length} fichiers.`);
  } catch (err) {
    console.error("❌ Erreur génération index.json :", err);
    process.exit(1);
  }
}

generateActusIndex();
