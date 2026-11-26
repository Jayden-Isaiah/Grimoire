import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';

export default function SelecteurOptions({ libelle, options, valeur, onChange, erreur }) {
  const { theme } = useTheme();

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.libelle, { color: theme.texte }]}>{libelle}</Text>
      <View style={styles.grille}>
        {options.map((option) => {
          const choisie = valeur === option.valeur;
          return (
            <Pressable
              key={option.valeur}
              accessibilityRole="button"
              accessibilityLabel={`${option.titre}, ${option.sousTitre}`}
              accessibilityState={{ selected: choisie }}
              onPress={() => onChange(option.valeur)}
              style={[
                styles.option,
                {
                  backgroundColor: choisie ? theme.primaire : theme.surface,
                  borderColor: choisie ? theme.primaire : erreur ? theme.danger : theme.bordure,
                },
              ]}
            >
              <Text style={[styles.titre, { color: choisie ? theme.surPrimaire : theme.texte }]}>{option.titre}</Text>
              <Text style={[styles.sousTitre, { color: choisie ? theme.surPrimaire : theme.texteSecondaire }]}>
                {option.sousTitre}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  titre: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 11,
    textAlign: 'center',
  },
  erreur: {
    fontSize: 13,
    marginTop: 4,
  },
});
