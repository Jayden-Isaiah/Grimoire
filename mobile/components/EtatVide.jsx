import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import Bouton from './Bouton';

export default function EtatVide({ titre, message, titreAction, onAction }) {
  const { theme } = useTheme();

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.titre, { color: theme.texte }]}>{titre}</Text>
      {message ? <Text style={[styles.message, { color: theme.texteSecondaire }]}>{message}</Text> : null}
      {onAction ? <Bouton titre={titreAction} onPress={onAction} /> : null}
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
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
});
