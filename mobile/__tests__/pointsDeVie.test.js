import { calculerPvMax } from '../utils/pointsDeVie';

describe('calculerPvMax', () => {
  it('donne le maximum du dé + CON au niveau 1', () => {
    expect(calculerPvMax('Magicien', 1, 10)).toBe(6);
    expect(calculerPvMax('Barbare', 1, 8)).toBe(11);
  });

  it('ajoute la moyenne du dé + CON à chaque niveau suivant', () => {
    expect(calculerPvMax('Guerrier', 3, 14)).toBe(28);
    expect(calculerPvMax('Clerc', 2, 15)).toBe(17);
  });

  it('donne au moins 1 PV par niveau, même avec une très faible CON', () => {
    expect(calculerPvMax('Magicien', 2, 1)).toBe(2);
  });

  it('retourne NaN pour une classe inconnue ou un niveau invalide', () => {
    expect(calculerPvMax('Chevalier', 1, 10)).toBeNaN();
    expect(calculerPvMax('Guerrier', 0, 10)).toBeNaN();
  });
});
