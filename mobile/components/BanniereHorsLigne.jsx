import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import { useReseau } from '../hooks/useReseau';

export default function BanniereHorsLigne() {
  const { theme } = useTheme();
  const { horsLigne } = useReseau();

  if (!horsLigne) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={[styles.banniere, { backgroundColor: theme.danger }]}>
      <Text style={styles.texte}>Hors ligne : vos changements seront synchronisés au retour du réseau</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banniere: {
    padding: 8,
  },
  texte: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
