import { convertirFormulaire, validerPersonnage } from '../utils/validation';

const personnageValide = (changements = {}) => ({
  nom: 'Aldric',
  race: 'Humain',
  classe: 'Guerrier',
  niveau: 3,
  pvMax: 28,
  pvActuels: 28,
  force: 16,
  dexterite: 12,
  constitution: 14,
  intelligence: 10,
  sagesse: 11,
  charisme: 9,
  ...changements,
});

describe('validerPersonnage', () => {
  it('accepte un personnage valide', () => {
    const { valide, erreurs } = validerPersonnage(personnageValide());
    expect(valide).toBe(true);
    expect(erreurs).toEqual({});
  });

  it('refuse un nom vide', () => {
    const { valide, erreurs } = validerPersonnage(personnageValide({ nom: '' }));
    expect(valide).toBe(false);
    expect(erreurs.nom).toBeDefined();
  });

  it('refuse un niveau hors de 1 à 20', () => {
    expect(validerPersonnage(personnageValide({ niveau: 0 })).erreurs.niveau).toBeDefined();
    expect(validerPersonnage(personnageValide({ niveau: 21 })).erreurs.niveau).toBeDefined();
  });

  it('refuse des PV actuels supérieurs aux PV max', () => {
    const { erreurs } = validerPersonnage(personnageValide({ pvMax: 10, pvActuels: 11 }));
    expect(erreurs.pvActuels).toBeDefined();
  });

  it('refuse une caractéristique hors de 1 à 20', () => {
    expect(validerPersonnage(personnageValide({ force: 25 })).erreurs.force).toBeDefined();
  });
});

describe('convertirFormulaire', () => {
  it('convertit les champs texte en nombres', () => {
    const formulaire = {
      nom: ' Lyra ',
      race: 'Elfe',
      classe: 'Magicienne',
      niveau: '3',
      pvMax: '16',
      pvActuels: '',
      force: '8',
      dexterite: '14',
      constitution: '12',
      intelligence: '17',
      sagesse: '13',
      charisme: '11',
      biographie: '',
      image: null,
    };
    const personnage = convertirFormulaire(formulaire);
    expect(personnage.nom).toBe('Lyra');
    expect(personnage.niveau).toBe(3);
    expect(personnage.pvActuels).toBe(16);
    expect(personnage.biographie).toBeNull();
    expect(validerPersonnage(personnage).valide).toBe(true);
  });

  it('transforme un champ numérique vide en valeur invalide', () => {
    const personnage = convertirFormulaire({
      nom: 'Test', race: 'Humain', classe: 'Barde', niveau: '', pvMax: '10', pvActuels: '10',
      force: '10', dexterite: '10', constitution: '10', intelligence: '10', sagesse: '10', charisme: '10',
      biographie: '', image: null,
    });
    expect(validerPersonnage(personnage).erreurs.niveau).toBeDefined();
  });
});