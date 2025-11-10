// === Génération automatique de /content/actus/index.json ===
// Ce script est exécuté avant chaque déploiement Netlify.

import { readdir, writeFile } from "fs/promises";
import path from "path";

async function generateActusIndex() {
  const actusDir = path.join(process.cwd(), "content", "actus");
  const indexFile = path.join(actusDir, "index.json");

  try {
    const files = await readdir(actusDir);
    const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "index.json");

    // Écrit la liste triée alphabétiquement (le tri par date se fera côté JS)
    await writeFile(indexFile, JSON.stringify(jsonFiles, null, 2));
    console.log(`✅ index.json généré avec ${jsonFiles.length} fichiers.`);
  } catch (err) {
    console.error("❌ Erreur génération index.json :", err);
    process.exit(1);
  }
}

generateActusIndex();
