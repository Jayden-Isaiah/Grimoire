export const calculerModificateur = (valeur) => Math.floor((valeur - 10) / 2);

export const formaterModificateur = (modificateur) =>
  modificateur >= 0 ? `+${modificateur}` : `${modificateur}`;

export const lancerD20 = (aleatoire = Math.random) => Math.floor(aleatoire() * 20) + 1;

export const lancerCaracteristique = (valeur, aleatoire = Math.random) => {
  const de = lancerD20(aleatoire);
  const modificateur = calculerModificateur(valeur);
  return { de, modificateur, total: de + modificateur };
};