import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';

export default function EtatChargement({ message = 'Chargement…' }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.conteneur, { backgroundColor: theme.fond }]}>
      <ActivityIndicator size="large" color={theme.primaire} />
      <Text style={[styles.message, { color: theme.texteSecondaire }]}>{message}</Text>
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
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});
