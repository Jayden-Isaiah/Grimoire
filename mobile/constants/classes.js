export const CLASSES = [
  { nom: 'Barbare', deVie: 12 },
  { nom: 'Guerrier', deVie: 10 },
  { nom: 'Paladin', deVie: 10 },
  { nom: 'Rôdeur', deVie: 10 },
  { nom: 'Barde', deVie: 8 },
  { nom: 'Clerc', deVie: 8 },
  { nom: 'Druide', deVie: 8 },
  { nom: 'Moine', deVie: 8 },
  { nom: 'Occultiste', deVie: 8 },
  { nom: 'Roublard', deVie: 8 },
  { nom: 'Ensorceleur', deVie: 6 },
  { nom: 'Magicien', deVie: 6 },
];

export const trouverClasse = (nom) => CLASSES.find((classe) => classe.nom === nom) ?? null;
