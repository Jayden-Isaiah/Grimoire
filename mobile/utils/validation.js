import { CARACTERISTIQUES } from '../constants';

const estEntierEntre = (valeur, min, max) => Number.isInteger(valeur) && valeur >= min && valeur <= max;

const longueur = (texte) => (typeof texte === 'string' ? texte.trim().length : 0);

export const validerPersonnage = (personnage) => {
  const erreurs = {};

  if (longueur(personnage.nom) < 2 || longueur(personnage.nom) > 40) {
    erreurs.nom = 'Le nom doit contenir entre 2 et 40 caractères.';
  }
  if (longueur(personnage.race) === 0) {
    erreurs.race = 'La race est requise.';
  }
  if (longueur(personnage.classe) === 0) {
    erreurs.classe = 'La classe est requise.';
  }
  if (!estEntierEntre(personnage.niveau, 1, 20)) {
    erreurs.niveau = 'Entre 1 et 20.';
  }
  if (!estEntierEntre(personnage.pvMax, 1, 999)) {
    erreurs.pvMax = 'Au moins 1.';
  }
  if (!estEntierEntre(personnage.pvActuels, 0, personnage.pvMax)) {
    erreurs.pvActuels = 'Entre 0 et les PV max.';
  }
  for (const { cle } of CARACTERISTIQUES) {
    if (!estEntierEntre(personnage[cle], 1, 20)) {
      erreurs[cle] = 'Entre 1 et 20.';
    }
  }

  return { valide: Object.keys(erreurs).length === 0, erreurs };
};

export const convertirFormulaire = (formulaire) => {
  const nombre = (texte) => (texte === '' ? NaN : Number(texte));
  const personnage = {
    nom: formulaire.nom.trim(),
    race: formulaire.race.trim(),
    classe: formulaire.classe.trim(),
    niveau: nombre(formulaire.niveau),
    pvMax: nombre(formulaire.pvMax),
    pvActuels: nombre(formulaire.pvActuels === '' ? formulaire.pvMax : formulaire.pvActuels),
    biographie: formulaire.biographie.trim() || null,
    image: formulaire.image ?? null,
  };
  for (const { cle } of CARACTERISTIQUES) {
    personnage[cle] = nombre(formulaire[cle]);
  }
  return personnage;
};