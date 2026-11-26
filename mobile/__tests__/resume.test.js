import { calculerResume } from '../utils/resume';

// Mêmes personnages que constants/donneesTemporaires.js et que le seed du serveur
const aldric = { id: 'p1', nom: 'Aldric', classe: 'Guerrier', niveau: 3, pvActuels: 28 };
const lyra = { id: 'p2', nom: 'Lyra', classe: 'Magicienne', niveau: 3, pvActuels: 9 };
const borin = { id: 'p3', nom: 'Borin', classe: 'Clerc', niveau: 2, pvActuels: 0 };

describe('calculerResume', () => {
  it('retourne des zéros sans personnage', () => {
    expect(calculerResume([])).toEqual({
      nombrePersonnages: 0,
      niveauMoyen: 0,
      personnagesKo: 0,
      repartitionClasses: [],
      derniereEntreeJournal: null,
    });
  });

  it('accepte une liste pas encore chargée (null)', () => {
    expect(calculerResume(null).nombrePersonnages).toBe(0);
  });

  it('calcule le total, le niveau moyen, les KO et les classes', () => {
    const resume = calculerResume([aldric, lyra, borin]);

    expect(resume.nombrePersonnages).toBe(3);
    expect(resume.niveauMoyen).toBe(2.7); // (3 + 3 + 2) / 3 = 2,666… → 2,7
    expect(resume.personnagesKo).toBe(1); // Borin
    // Égalité (1 chacun) → ordre alphabétique
    expect(resume.repartitionClasses).toEqual([
      { classe: 'Clerc', nombre: 1 },
      { classe: 'Guerrier', nombre: 1 },
      { classe: 'Magicienne', nombre: 1 },
    ]);
  });

  it('place la classe la plus nombreuse en premier', () => {
    const autreGuerrier = { ...aldric, id: 'p4', nom: 'Brann' };
    const resume = calculerResume([lyra, aldric, autreGuerrier]);

    expect(resume.repartitionClasses[0]).toEqual({ classe: 'Guerrier', nombre: 2 });
  });

  it('arrondit le niveau moyen à une décimale', () => {
    const niveaux = [1, 2, 2, 4].map((niveau, i) => ({ ...lyra, id: `n${i}`, niveau }));
    expect(calculerResume(niveaux).niveauMoyen).toBe(2.3); // 9 / 4 = 2,25 → 2,3
  });

  it('trouve la dernière entrée de journal et le nom de son personnage', () => {
    const entrees = [
      { id: 'e1', personnageId: 'p1', titre: 'Le pont de glace', dateSession: '2026-11-08' },
      { id: 'e2', personnageId: 'p3', titre: 'Embuscade des loups', dateSession: '2026-11-15' },
    ];

    const { derniereEntreeJournal } = calculerResume([aldric, borin], entrees);

    expect(derniereEntreeJournal.titre).toBe('Embuscade des loups');
    expect(derniereEntreeJournal.personnageNom).toBe('Borin');
  });

  it('ne modifie pas le tableau reçu', () => {
    const entrees = [
      { id: 'e1', personnageId: 'p1', dateSession: '2026-11-01' },
      { id: 'e2', personnageId: 'p1', dateSession: '2026-11-20' },
    ];
    calculerResume([aldric], entrees);
    expect(entrees.map((e) => e.id)).toEqual(['e1', 'e2']);
  });
});
