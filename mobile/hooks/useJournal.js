import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ENTREES_JOURNAL_TEMPORAIRES } from '../constants/donneesTemporaires';

const plusRecentesDabord = (a, b) =>
  b.dateSession.localeCompare(a.dateSession) || String(b.creeLe).localeCompare(String(a.creeLe));

export const useJournal = (personnageIds) => {
  const [entrees, setEntrees] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const cle = personnageIds.join(',');

  const recharger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    const ids = cle ? cle.split(',') : [];
    setEntrees(ENTREES_JOURNAL_TEMPORAIRES.filter((entree) => ids.includes(entree.personnageId)).sort(plusRecentesDabord));
    setChargement(false);
  }, [cle]);

  useFocusEffect(
    useCallback(() => {
      recharger();
    }, [recharger]),
  );

  return { entrees, chargement, erreur, recharger };
};
