import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { CAMPAGNES_TEMPORAIRES } from '../constants/donneesTemporaires';

export const useCampagnes = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const recharger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    setCampagnes([...CAMPAGNES_TEMPORAIRES]);
    setChargement(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      recharger();
    }, [recharger]),
  );

  return { campagnes, chargement, erreur, recharger };
};
