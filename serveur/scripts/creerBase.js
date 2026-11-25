// Crée la base MySQL et ses tables à partir de bd/schema.sql. Responsable : Jayden.
//
//   npm run bd:creer          → crée la base de .env (MYSQL_DATABASE) si elle n'existe pas
//   npm run bd:reinitialiser  → SUPPRIME puis recrée cette base (développement seulement)
//
// Les tests appellent aussi creerBase() pour préparer `grimoire_test`
// (voir tests/configuration.js), sans toucher à la base de développement.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ quiet: true });

const CHEMIN_SCHEMA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../bd/schema.sql');

// Un nom de base ne peut pas être passé avec « ? » : on le vérifie donc nous-mêmes
const NOM_BASE_VALIDE = /^[A-Za-z0-9_]+$/;

/**
 * Crée la base (si absente) puis toutes les tables.
 * @param {object} options
 * @param {string} [options.nomBase] Base à créer (par défaut : MYSQL_DATABASE)
 * @param {boolean} [options.reinitialiser] true = supprimer la base d'abord
 */
export const creerBase = async ({
  nomBase = process.env.MYSQL_DATABASE,
  reinitialiser = false,
} = {}) => {
  if (!nomBase || !NOM_BASE_VALIDE.test(nomBase)) {
    throw new Error(`Nom de base invalide : « ${nomBase} » (lettres, chiffres et _ seulement)`);
  }

  // Connexion SANS base choisie : la base n'existe peut-être pas encore.
  // multipleStatements : nécessaire pour exécuter tout schema.sql d'un coup.
  const connexion = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true,
  });

  try {
    if (reinitialiser) {
      await connexion.query(`DROP DATABASE IF EXISTS \`${nomBase}\``);
    }
    await connexion.query(
      `CREATE DATABASE IF NOT EXISTS \`${nomBase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connexion.query(`USE \`${nomBase}\``);

    const schema = await fs.readFile(CHEMIN_SCHEMA, 'utf8');
    await connexion.query(schema);
  } finally {
    await connexion.end();
  }
};

// Exécution en ligne de commande seulement (pas quand un test importe le fichier)
const estLanceDirectement = process.argv[1] === fileURLToPath(import.meta.url);

if (estLanceDirectement) {
  const reinitialiser = process.argv.includes('--reinitialiser');
  try {
    await creerBase({ reinitialiser });
    console.log(`✅ Base « ${process.env.MYSQL_DATABASE} » prête${reinitialiser ? ' (réinitialisée)' : ''}.`);
  } catch (erreur) {
    console.error('❌ Création de la base impossible :', erreur.message);
    process.exitCode = 1;
  }
}
