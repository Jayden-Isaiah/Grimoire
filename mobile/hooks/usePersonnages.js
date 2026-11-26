import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { PERSONNAGES_TEMPORAIRES } from '../constants/donneesTemporaires';

export const usePersonnages = (campagneId) => {
  const [personnages, setPersonnages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const recharger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    setPersonnages(PERSONNAGES_TEMPORAIRES.filter((personnage) => personnage.campagneId === campagneId));
    setChargement(false);
  }, [campagneId]);

  useFocusEffect(
    useCallback(() => {
      recharger();
    }, [recharger]),
  );

  return { personnages, chargement, erreur, recharger };
};