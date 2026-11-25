// Validation d'une entrée de journal (POST /personnages/:id/journal). Responsable : Jayden.
// Règles du Livrable 1 (section 5) : titre et contenu requis, date valide.
// Les mêmes règles sont imposées par les CHECK de bd/schema.sql.
//
// Retour : { valide: boolean, erreurs: { champ: 'message' } }
// Le mobile affiche erreurs.titre sous le champ Titre, etc.

export const TITRE_MAX = 100; // = VARCHAR(100) dans schema.sql

// UUID v1 à v8 (le mobile génère des v4 avec expo-crypto)
const FORMAT_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Vrai pour une vraie date « AAAA-MM-JJ » (refuse 2026-02-30, 2026-13-01…). */
export const estDateValide = (valeur) => {
  if (typeof valeur !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;

  const [annee, mois, jour] = valeur.split('-').map(Number);
  const date = new Date(Date.UTC(annee, mois - 1, jour));
  // JavaScript « corrige » le 30 février en 2 mars : si la date a changé, elle était invalide
  return date.getUTCFullYear() === annee && date.getUTCMonth() === mois - 1 && date.getUTCDate() === jour;
};

const estTexteNonVide = (valeur) => typeof valeur === 'string' && valeur.trim() !== '';

export const validerEntreeJournal = (donnees) => {
  const { id, titre, contenu, dateSession } = donnees ?? {};
  const erreurs = {};

  // L'id vient du téléphone (offline first) : il doit être un UUID
  if (typeof id !== 'string' || !FORMAT_UUID.test(id)) {
    erreurs.id = 'Identifiant UUID requis';
  }

  if (!estTexteNonVide(titre)) {
    erreurs.titre = 'Le titre est requis';
  } else if (titre.trim().length > TITRE_MAX) {
    erreurs.titre = `Le titre ne doit pas dépasser ${TITRE_MAX} caractères`;
  }

  if (!estTexteNonVide(contenu)) {
    erreurs.contenu = 'Le contenu est requis';
  }

  if (!estDateValide(dateSession)) {
    erreurs.dateSession = 'Date de session invalide (format AAAA-MM-JJ)';
  }

  return { valide: Object.keys(erreurs).length === 0, erreurs };
};
