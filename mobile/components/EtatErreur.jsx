import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import Bouton from './Bouton';

export default function EtatErreur({ message, onReessayer }) {
  const { theme } = useTheme();

  return (
    <View style={styles.conteneur} accessibilityRole="alert">
      <Text style={[styles.titre, { color: theme.danger }]}>Oups</Text>
      <Text style={[styles.message, { color: theme.texte }]}>{message}</Text>
      {onReessayer ? <Bouton titre="Réessayer" variante="secondaire" onPress={onReessayer} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titre: {
    fontSize: 22,
    fontWeight: '700',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
});
