import { trouverClasse } from '../constants/classes';
import { calculerModificateur } from './caracteristiques';

export const calculerPvMax = (nomClasse, niveau, constitution) => {
  const classe = trouverClasse(nomClasse);
  if (!classe || !Number.isInteger(niveau) || niveau < 1 || !Number.isInteger(constitution)) {
    return NaN;
  }
  const modificateur = calculerModificateur(constitution);
  const premierNiveau = Math.max(1, classe.deVie + modificateur);
  const parNiveauSuivant = Math.max(1, classe.deVie / 2 + 1 + modificateur);
  return premierNiveau + (niveau - 1) * parNiveauSuivant;
};
