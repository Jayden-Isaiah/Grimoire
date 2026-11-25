// Calcul du résumé d'une campagne (GET /campagnes/:id/resume). Responsable : Jayden.
// Livrable 1, section 5.3.
//
// Même format que mobile/utils/resume.js, pour que l'écran Résumé affiche la
// même chose avec les données locales (hors ligne) ou celles du serveur :
//
//   {
//     nombrePersonnages: 3,
//     niveauMoyen: 2.7,                    // arrondi à une décimale
//     personnagesKo: 1,                    // personnages à 0 PV
//     repartitionClasses: [{ classe: 'Clerc', nombre: 1 }, ...],  // plus nombreuse d'abord
//     derniereEntreeJournal: { id, titre, dateSession, personnageId, personnageNom } | null
//   }
//
// Les calculs sont faits PAR MySQL (COUNT, AVG, GROUP BY) : on ne transfère pas
// tous les personnages pour ne garder que quelques chiffres.
import pool from '../database.js';

/**
 * @param {string} campagneId    id de la campagne demandée
 * @param {string} utilisateurId id du compte connecté (req.utilisateur.id)
 * @returns Le résumé, ou null si la campagne n'existe pas, est supprimée ou
 *          appartient à un autre compte (→ 404, sans révéler qu'elle existe).
 */
export const calculerResume = async (campagneId, utilisateurId) => {
  // 1. Contrôle du propriétaire, dans la même requête que la recherche
  const [campagnes] = await pool.query(
    'SELECT id FROM Campagne WHERE id = ? AND utilisateurId = ? AND supprime = FALSE',
    [campagneId, utilisateurId],
  );
  if (campagnes.length === 0) return null;

  // 2. Les trois requêtes sont indépendantes : on les lance en même temps
  const [[[totaux]], [classes], [entrees]] = await Promise.all([
    // COUNT(*) donne toujours une ligne, même sans personnage (AVG et SUM valent alors NULL)
    pool.query(
      `SELECT COUNT(*)                    AS nombrePersonnages,
              ROUND(AVG(niveau), 1)       AS niveauMoyen,
              SUM(pvActuels = 0)          AS personnagesKo
       FROM Personnage
       WHERE campagneId = ?`,
      [campagneId],
    ),
    pool.query(
      `SELECT classe, COUNT(*) AS nombre
       FROM Personnage
       WHERE campagneId = ?
       GROUP BY classe
       ORDER BY nombre DESC, classe ASC`,
      [campagneId],
    ),
    // Dernière entrée : la session la plus récente, puis la plus récemment écrite
    pool.query(
      `SELECT e.id, e.titre, e.dateSession, e.personnageId, p.nom AS personnageNom
       FROM EntreeJournal e
       JOIN Personnage p ON p.id = e.personnageId
       WHERE p.campagneId = ?
       ORDER BY e.dateSession DESC, e.creeLe DESC
       LIMIT 1`,
      [campagneId],
    ),
  ]);

  // mysql2 renvoie COUNT/SUM/ROUND sous forme de texte ou de DECIMAL : Number(...) uniformise
  return {
    nombrePersonnages: Number(totaux.nombrePersonnages),
    niveauMoyen: Number(totaux.niveauMoyen ?? 0),
    personnagesKo: Number(totaux.personnagesKo ?? 0),
    repartitionClasses: classes.map(({ classe, nombre }) => ({ classe, nombre: Number(nombre) })),
    derniereEntreeJournal: entrees[0] ?? null,
  };
};
