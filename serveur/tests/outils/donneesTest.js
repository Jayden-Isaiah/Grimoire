// Outils partagés par les tests qui utilisent MySQL (résumé, journal). Responsable : Jayden.
//
// - La base de test est `grimoire_test` (tests/configuration.js), jamais celle de dev.
// - Chaque fichier de test crée SES données avec des UUID aléatoires, puis les
//   supprime : les fichiers peuvent tourner en parallèle sans se gêner.
// - MySQL doit être démarré (mêmes identifiants que dans .env).
import crypto from 'node:crypto';
import express from 'express';
import pool from '../../database.js';
import { creerBase } from '../../scripts/creerBase.js';

/** Crée grimoire_test et ses tables si besoin (sans effacer les autres tests). */
export const preparerBaseTest = () => creerBase({ nomBase: process.env.MYSQL_DATABASE });

const nouvelId = () => crypto.randomUUID();

/** Insère un personnage ; `champs` remplace les valeurs par défaut. */
export const insererPersonnage = async (campagneId, champs = {}) => {
  const p = {
    id: nouvelId(), nom: 'Test', race: 'Humain', classe: 'Guerrier',
    niveau: 1, pvMax: 10, pvActuels: 10, ...champs,
  };
  await pool.query(
    `INSERT INTO Personnage
       (id, campagneId, nom, race, classe, niveau, pvMax, pvActuels,
        \`force\`, dexterite, constitution, intelligence, sagesse, charisme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 10, 10, 10, 10, 10, 10)`,
    [p.id, campagneId, p.nom, p.race, p.classe, p.niveau, p.pvMax, p.pvActuels],
  );
  return p.id;
};

/** Insère un compte et une campagne lui appartenant. */
export const insererCompteEtCampagne = async () => {
  const utilisateurId = nouvelId();
  const campagneId = nouvelId();
  await pool.query(
    'INSERT INTO Utilisateur (id, courriel, motDePasseHash, nomAffiche) VALUES (?, ?, ?, ?)',
    [utilisateurId, `${utilisateurId}@test.local`, 'haché-factice', 'Testeur'],
  );
  await pool.query('INSERT INTO Campagne (id, utilisateurId, nom, avatar) VALUES (?, ?, ?, ?)', [
    campagneId, utilisateurId, 'Campagne test', 'dragon',
  ]);
  return { utilisateurId, campagneId };
};

/** Supprime les comptes créés par le test (CASCADE efface tout le reste). */
export const supprimerComptes = (utilisateurIds) =>
  pool.query('DELETE FROM Utilisateur WHERE id IN (?)', [utilisateurIds]);

/**
 * Petite application Express pour tester un contrôleur avec Supertest,
 * avec un utilisateur « connecté » simulé (remplace le middleware authentifier).
 *
 * @param {() => string} utilisateurConnecte Fonction qui retourne l'id du compte
 * @param {(app) => void} declarerRoutes      Déclare les routes à tester
 */
export const creerAppTest = (utilisateurConnecte, declarerRoutes) => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.utilisateur = { id: utilisateurConnecte() }; // même contrat que authentifier
    next();
  });
  declarerRoutes(app);
  return app;
};

export { nouvelId, pool };
