export const calculerModificateur = (valeur) => {
    let modificateur = ((valeur - 10) / 2).toFixed(0);
    return modificateur;
};

export const formaterModificateur = (modificateur) => {
    if (modificateur < 0) return `-${modificateur}`;
    return `${modificateur}`;
};

export const lancerD20 = (aleatoire = Math.random) => {
    return Math.floor((aleatoire * 20) + 1).toFixed(0);
};

export const lancerCaracteristique = (valeur, aleatoire = Math.random) => {
    let de = Math.floor((aleatoire * 20) + 1).toFixed(0);
    let modificateur = calculerModificateur(valeur);
    let total = de + modificateur;
    return { "de" : de, "modificateur" : modificateur, "total" : total }
};
