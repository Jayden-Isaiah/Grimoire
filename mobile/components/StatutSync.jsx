import { StyleSheet, Text } from 'react-native';
import { STATUTS_SYNC } from '../constants';
import { useTheme } from '../contexts/themeContext';

export default function StatutSync({ statut }) {
  const { theme } = useTheme();

  if (statut === STATUTS_SYNC.EN_ATTENTE) {
    return <Text style={[styles.texte, { color: theme.texteSecondaire }]}>En attente de synchronisation</Text>;
  }
  if (statut === STATUTS_SYNC.ERREUR) {
    return <Text style={[styles.texte, { color: theme.danger }]}>Erreur de synchronisation</Text>;
  }
  return null;
}

const styles = StyleSheet.create({
  texte: {
    fontSize: 13,
    marginTop: 4,
  },
});
