export const RACES = [
  { nom: 'Humain', description: 'Polyvalent' },
  { nom: 'Elfe', description: 'Agile' },
  { nom: 'Nain', description: 'Robuste' },
  { nom: 'Halfelin', description: 'Chanceux' },
  { nom: 'Gnome', description: 'Ingénieux' },
  { nom: 'Demi-elfe', description: 'Charismatique' },
  { nom: 'Demi-orc', description: 'Endurant' },
  { nom: 'Drakéide', description: 'Souffle draconique' },
  { nom: 'Tieffelin', description: 'Héritage infernal' },
];

export const trouverRace = (nom) => RACES.find((race) => race.nom === nom) ?? null;
