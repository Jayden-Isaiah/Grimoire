export const CAMPAGNES_TEMPORAIRES = [
  { id: 'c1', nom: 'Les Terres du Nord', avatar: 'dragon' },
  { id: 'c2', nom: 'La Cité Engloutie', avatar: 'chateau' },
];

export const PERSONNAGES_TEMPORAIRES = [
  {
    id: 'p1', campagneId: 'c1', nom: 'Aldric', race: 'Humain', classe: 'Guerrier', niveau: 3,
    pvMax: 28, pvActuels: 28, force: 16, dexterite: 12, constitution: 14, intelligence: 10, sagesse: 11, charisme: 9,
    biographie: 'Ancien garde de la cité, il protège le groupe.', statutSync: 'SYNCHRONISE',
  },
  {
    id: 'p2', campagneId: 'c1', nom: 'Lyra', race: 'Elfe', classe: 'Magicienne', niveau: 3,
    pvMax: 16, pvActuels: 9, force: 8, dexterite: 14, constitution: 12, intelligence: 17, sagesse: 13, charisme: 11,
    biographie: null, statutSync: 'EN_ATTENTE',
  },
  {
    id: 'p3', campagneId: 'c1', nom: 'Borin', race: 'Nain', classe: 'Clerc', niveau: 2,
    pvMax: 19, pvActuels: 0, force: 13, dexterite: 9, constitution: 15, intelligence: 10, sagesse: 16, charisme: 12,
    biographie: null, statutSync: 'SYNCHRONISE',
  },
];

export const ajouterPersonnageTemporaire = (personnage) => {
  PERSONNAGES_TEMPORAIRES.push(personnage);
};