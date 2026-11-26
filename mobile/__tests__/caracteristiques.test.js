import { calculerModificateur, formaterModificateur, lancerCaracteristique } from '../utils/caracteristiques';

describe('calculerModificateur', () => {
  it('retourne +2 pour une valeur de 15', () => {
    expect(calculerModificateur(15)).toEqual(2);
  });

  it('retourne -1 pour une valeur de 8', () => {
    expect(calculerModificateur(8)).toEqual(-1);
  });

  it('retourne 0 pour une valeur de 10', () => {
    expect(calculerModificateur(10)).toEqual(0);
  });
});

describe('formaterModificateur', () => {
  it('ajoute un signe + aux valeurs positives ou nulles', () => {
    expect(formaterModificateur(1)).toEqual("+1");
    expect(formaterModificateur(null)).toEqual("+null");
    expect(formaterModificateur(-9)).toEqual("-9");
  });
});

describe('lancerCaracteristique', () => {
  it('additionne le d20 et le modificateur', () => {
    const resultat = lancerCaracteristique(15, () => 0.7);
    expect(resultat.de).toBe(15);
    expect(resultat.modificateur).toBe(2);
    expect(resultat.total).toBe(17);
  });
});
