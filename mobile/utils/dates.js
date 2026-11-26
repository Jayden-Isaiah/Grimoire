const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const deuxChiffres = (nombre) => String(nombre).padStart(2, '0');

export const dateDuJour = () => {
  const maintenant = new Date();
  return `${maintenant.getFullYear()}-${deuxChiffres(maintenant.getMonth() + 1)}-${deuxChiffres(maintenant.getDate())}`;
};

export const formaterDate = (dateSession) => {
  const [annee, mois, jour] = dateSession.split('-').map(Number);
  return `${jour} ${MOIS[mois - 1]} ${annee}`;
};
