import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';

export default function ChampTexte({ libelle, valeur, onChangeText, erreur, ...autres }) {
  const { theme } = useTheme();

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.libelle, { color: theme.texte }]}>{libelle}</Text>
      <TextInput
        value={valeur}
        onChangeText={onChangeText}
        accessibilityLabel={libelle}
        placeholderTextColor={theme.texteSecondaire}
        style={[
          styles.champ,
          {
            color: theme.texte,
            backgroundColor: theme.surface,
            borderColor: erreur ? theme.danger : theme.bordure,
          },
        ]}
        {...autres}
      />
      {erreur ? <Text style={[styles.erreur, { color: theme.danger }]}>{erreur}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 16,
  },
  libelle: {
    fontSize: 13,
    marginBottom: 4,
  },
  champ: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  erreur: {
    fontSize: 13,
    marginTop: 4,
  },
});
