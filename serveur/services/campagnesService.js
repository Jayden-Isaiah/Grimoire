import pool from '../database.js';

export const listerParUtilisateur = (utilisateurId) => {
};

export const trouverPourUtilisateur = (id, utilisateurId) => {
};

export const creer = (campagne, utilisateurId) => {
};

// Le résumé est codé dans son propre fichier (responsable : Jayden) pour que deux
// personnes ne modifient pas ce fichier en même temps. Signature :
// calculerResume(campagneId, utilisateurId) → résumé, ou null (campagne absente / d'un autre compte).
export { calculerResume } from './resumeService.js';
