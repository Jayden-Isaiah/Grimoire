import { useEffect, useState } from 'react';
import { CAMPAGNES_TEMPORAIRES } from '../constants/donneesTemporaires';

export const useCampagnes = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const recharger = async () => {
    setChargement(true);
    setErreur(null);
    setCampagnes(CAMPAGNES_TEMPORAIRES);
    setChargement(false);
  };

  useEffect(() => {
    recharger();
  }, []);

  return { campagnes, chargement, erreur, recharger };
};