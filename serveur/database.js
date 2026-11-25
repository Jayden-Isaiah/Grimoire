// Pool de connexions MySQL partagé par tout le serveur (cours 12).
// Responsable : Jayden. Utilisation dans un service :
//
//   import pool from '../database.js';
//   const [lignes] = await pool.query('SELECT * FROM Campagne WHERE utilisateurId = ?', [id]);
//   const [resultat] = await pool.query('INSERT INTO ...', [...]); // resultat.affectedRows
//
// Toujours des « ? » pour les valeurs : jamais de concaténation (injection SQL).
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config({ quiet: true });

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // Dates renvoyées en texte « AAAA-MM-JJ HH:MM:SS.mmm » au lieu d'objets Date :
    // le mobile reçoit exactement la valeur stockée (utile pour GET /sync?depuis=).
    dateStrings: true,
    // Les objets Date envoyés dans une requête sont convertis en UTC
    timezone: 'Z',
  })
  // Chaque nouvelle connexion travaille aussi en UTC (CURRENT_TIMESTAMP, NOW())
  .on('connection', (connexion) => connexion.query("SET time_zone = '+00:00'"))
  .promise();

/**
 * Exécute plusieurs requêtes « tout ou rien » : si une seule échoue, aucune
 * n'est conservée (ex. créer un compte ET sa préférence de thème).
 *
 *   await transaction(async (connexion) => {
 *     await connexion.query('INSERT INTO Utilisateur ...', [...]);
 *     await connexion.query('INSERT INTO PreferenceUtilisateur ...', [...]);
 *   });
 *
 * ⚠️ À l'intérieur, utiliser `connexion.query` et non `pool.query`, sinon la
 * requête passe par une autre connexion, hors de la transaction.
 */
export const transaction = async (travail) => {
  const connexion = await pool.getConnection();
  try {
    await connexion.beginTransaction();
    const resultat = await travail(connexion);
    await connexion.commit();
    return resultat;
  } catch (erreur) {
    await connexion.rollback();
    throw erreur;
  } finally {
    connexion.release(); // rend la connexion au pool, même en cas d'erreur
  }
};

export default pool;
