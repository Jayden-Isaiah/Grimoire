import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import Bouton from '../../../components/Bouton';
import ChampTexte from '../../../components/ChampTexte';
import { STATUTS_SYNC } from '../../../constants';
import { ajouterEntreeJournalTemporaire } from '../../../constants/donneesTemporaires';
import { useTheme } from '../../../contexts/themeContext';
import { dateDuJour } from '../../../utils/dates';
import { validerEntreeJournal } from '../../../utils/validation';

export default function AjoutEntreeJournal() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [dateSession, setDateSession] = useState(dateDuJour());
  const [contenu, setContenu] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState(null);

  const enregistrer = () => {
    const entree = { titre: titre.trim(), contenu: contenu.trim(), dateSession: dateSession.trim() };
    const validation = validerEntreeJournal(entree);
    setErreurs(validation.erreurs);
    if (!validation.valide) {
      setErreurGenerale('Corrigez les champs en rouge.');
      return;
    }
    ajouterEntreeJournalTemporaire({
      ...entree,
      id: Crypto.randomUUID(),
      personnageId: id,
      creeLe: new Date().toISOString(),
      statutSync: STATUTS_SYNC.EN_ATTENTE,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: theme.fond }}
        contentContainerStyle={styles.contenu}
        keyboardShouldPersistTaps="handled"
      >
        <ChampTexte libelle="Titre" valeur={titre} onChangeText={setTitre} erreur={erreurs.titre} maxLength={100} />
        <ChampTexte
          libelle="Date de la session (AAAA-MM-JJ)"
          valeur={dateSession}
          onChangeText={setDateSession}
          erreur={erreurs.dateSession}
          keyboardType="numbers-and-punctuation"
        />
        <ChampTexte
          libelle="Ce qui s’est passé"
          valeur={contenu}
          onChangeText={setContenu}
          erreur={erreurs.contenu}
          multiline
          numberOfLines={6}
          style={styles.zoneTexte}
        />
        {erreurGenerale ? <Text style={[styles.erreur, { color: theme.danger }]}>{erreurGenerale}</Text> : null}
        <Bouton titre="Ajouter l’entrée" onPress={enregistrer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
  },
  contenu: {
    padding: 16,
  },
  zoneTexte: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  erreur: {
    marginBottom: 16,
  },
});
