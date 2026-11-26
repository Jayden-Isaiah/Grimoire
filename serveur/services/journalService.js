// Requêtes SQL du journal de session. Responsable : Jayden.
//
// Contrôle du propriétaire : chaque fonction reçoit utilisateurId et vérifie,
// EN SQL, que le personnage appartient à une campagne de ce compte. Une entrée
// d'un autre compte est traitée comme inexistante (→ 404).
import pool from '../database.js';

// Colonnes renvoyées au mobile (même ordre partout)
const COLONNES = 'id, personnageId, titre, contenu, dateSession, creeLe';

/** Vrai si le personnage existe ET appartient au compte (campagne non supprimée). */
const personnageAppartientA = async (personnageId, utilisateurId) => {
  const [lignes] = await pool.query(
    `SELECT p.id
     FROM Personnage p
     JOIN Campagne c ON c.id = p.campagneId
     WHERE p.id = ? AND c.utilisateurId = ? AND c.supprime = FALSE`,
    [personnageId, utilisateurId],
  );
  return lignes.length > 0;
};

/**
 * Entrées d'un personnage, de la session la plus récente à la plus ancienne.
 * @returns Un tableau (vide si aucune entrée), ou null si le personnage n'est pas accessible.
 */
export const listerEntrees = async (personnageId, utilisateurId) => {
  if (!(await personnageAppartientA(personnageId, utilisateurId))) return null;

  const [entrees] = await pool.query(
    `SELECT ${COLONNES} FROM EntreeJournal
     WHERE personnageId = ?
     ORDER BY dateSession DESC, creeLe DESC`,
    [personnageId],
  );
  return entrees;
};

/**
 * Ajoute une entrée avec l'id fourni par le téléphone. Opération IDEMPOTENTE :
 * si le téléphone renvoie la même entrée (synchronisation rejouée après une
 * coupure), on renvoie l'entrée déjà enregistrée au lieu d'en créer une deuxième.
 *
 * @param {string} personnageId
 * @param {{ id, titre, contenu, dateSession }} entree Données déjà validées
 * @param {string} utilisateurId
 * @returns
 *   null                               → personnage inaccessible (404)
 *   { entree, dejaRecue: false }       → créée (201)
 *   { entree, dejaRecue: true }        → déjà reçue, rien de créé (200)
 *   { conflit: true }                  → cet id appartient à un autre personnage (409)
 */
export const ajouterEntree = async (personnageId, entree, utilisateurId) => {
  if (!(await personnageAppartientA(personnageId, utilisateurId))) return null;

  let dejaRecue = false;
  try {
    await pool.query(
      'INSERT INTO EntreeJournal (id, personnageId, titre, contenu, dateSession) VALUES (?, ?, ?, ?, ?)',
      [entree.id, personnageId, entree.titre.trim(), entree.contenu.trim(), entree.dateSession],
    );
  } catch (erreur) {
    // ER_DUP_ENTRY : la clé primaire (id) existe déjà → requête rejouée
    if (erreur.code !== 'ER_DUP_ENTRY') throw erreur;
    dejaRecue = true;
  }

  const [[enregistree]] = await pool.query(`SELECT ${COLONNES} FROM EntreeJournal WHERE id = ?`, [
    entree.id,
  ]);

  // Même id, mais pour un autre personnage : ce n'est pas un simple rejeu
  if (enregistree.personnageId !== personnageId) return { conflit: true };

  return { entree: enregistree, dejaRecue };
};
