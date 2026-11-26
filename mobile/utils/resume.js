// Calcul du résumé d'une campagne, SUR LE TÉLÉPHONE (fonctionne hors ligne).
// Responsable : Jayden. Livrable 1, section 5.3.
//
// Fonction pure : aucun appel réseau ni SQLite, mêmes entrées → même résultat.
// C'est ce qui la rend facile à tester (__tests__/resume.test.js).
//
// Même format que GET /campagnes/:id/resume (serveur/services/resumeService.js) :
// l'écran Résumé n'a pas à savoir d'où viennent les chiffres.

/**
 * @param {Array} personnages    Personnages de la campagne active
 * @param {Array} [entreesJournal] Entrées de journal de ces personnages (facultatif)
 * @returns {{
 *   nombrePersonnages: number,
 *   niveauMoyen: number,            // arrondi à une décimale (0 sans personnage)
 *   personnagesKo: number,          // personnages à 0 PV
 *   repartitionClasses: Array<{ classe: string, nombre: number }>,
 *   derniereEntreeJournal: object | null,
 * }}
 */
export const calculerResume = (personnages = [], entreesJournal = []) => {
  // `?? []` : accepte aussi null/undefined (liste pas encore chargée)
  const liste = personnages ?? [];
  const nombrePersonnages = liste.length;

  // Niveau moyen : on multiplie par 10 AVANT de diviser, puis on arrondit.
  // Calcul sur des entiers = pas d'erreur d'arrondi des nombres à virgule.
  const sommeNiveaux = liste.reduce((somme, p) => somme + Number(p.niveau), 0);
  const niveauMoyen =
    nombrePersonnages === 0 ? 0 : Math.round((sommeNiveaux * 10) / nombrePersonnages) / 10;

  const personnagesKo = liste.filter((p) => Number(p.pvActuels) === 0).length;

  return {
    nombrePersonnages,
    niveauMoyen,
    personnagesKo,
    repartitionClasses: compterParClasse(liste),
    derniereEntreeJournal: trouverDerniereEntree(entreesJournal ?? [], liste),
  };
};

/** [{ classe, nombre }] : la classe la plus nombreuse d'abord, puis ordre alphabétique. */
const compterParClasse = (personnages) => {
  const compteurs = {};
  for (const { classe } of personnages) {
    compteurs[classe] = (compteurs[classe] ?? 0) + 1;
  }

  return Object.entries(compteurs)
    .map(([classe, nombre]) => ({ classe, nombre }))
    .sort((a, b) => b.nombre - a.nombre || a.classe.localeCompare(b.classe, 'fr'));
};

/**
 * Entrée la plus récente : dateSession la plus récente, puis creeLe la plus récente.
 * Les dates « AAAA-MM-JJ » se comparent correctement comme du texte.
 */
const trouverDerniereEntree = (entrees, personnages) => {
  if (entrees.length === 0) return null;

  // [...entrees] : sort() modifie le tableau, on trie donc une copie
  const [derniere] = [...entrees].sort(
    (a, b) =>
      String(b.dateSession).localeCompare(String(a.dateSession)) ||
      String(b.creeLe ?? '').localeCompare(String(a.creeLe ?? '')),
  );

  // Même champ personnageNom que la réponse du serveur
  const personnage = personnages.find((p) => p.id === derniere.personnageId);
  return { ...derniere, personnageNom: personnage?.nom ?? null };
};
