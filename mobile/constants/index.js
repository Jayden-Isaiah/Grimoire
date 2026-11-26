export const URL_API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT ?? 3000}`;

export const STATUTS_SYNC = {
  EN_ATTENTE: 'EN_ATTENTE',
  SYNCHRONISE: 'SYNCHRONISE',
  ERREUR: 'ERREUR',
};

export const AVATARS = ['epee', 'dragon', 'chateau', 'grimoire', 'crane', 'etoile'];

export const ICONES_AVATARS = {
  epee: '⚔️',
  dragon: '🐉',
  chateau: '🏰',
  grimoire: '📖',
  crane: '💀',
  etoile: '✨',
};

export const CARACTERISTIQUES = [
  { cle: 'force', libelle: 'Force', abreviation: 'FOR' },
  { cle: 'dexterite', libelle: 'Dextérité', abreviation: 'DEX' },
  { cle: 'constitution', libelle: 'Constitution', abreviation: 'CON' },
  { cle: 'intelligence', libelle: 'Intelligence', abreviation: 'INT' },
  { cle: 'sagesse', libelle: 'Sagesse', abreviation: 'SAG' },
  { cle: 'charisme', libelle: 'Charisme', abreviation: 'CHA' },
];
