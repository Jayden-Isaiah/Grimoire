import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CLASSES } from '../constants/classes';
import { useTheme } from '../contexts/themeContext';

export default function SelecteurClasse({ valeur, onChange, erreur }) {
  const { theme } = useTheme();

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.libelle, { color: theme.texte }]}>Classe</Text>
      <View style={styles.grille}>
        {CLASSES.map((classe) => {
          const choisie = valeur === classe.nom;
          return (
            <Pressable
              key={classe.nom}
              accessibilityRole="button"
              accessibilityLabel={`${classe.nom}, dé de vie d${classe.deVie}`}
              accessibilityState={{ selected: choisie }}
              onPress={() => onChange(classe.nom)}
              style={[
                styles.option,
                {
                  backgroundColor: choisie ? theme.primaire : theme.surface,
                  borderColor: choisie ? theme.primaire : erreur ? theme.danger : theme.bordure,
                },
              ]}
            >
              <Text style={[styles.nom, { color: choisie ? theme.surPrimaire : theme.texte }]}>{classe.nom}</Text>
              <Text style={[styles.de, { color: choisie ? theme.surPrimaire : theme.texteSecondaire }]}>d{classe.deVie}</Text>
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
    borderWidth: 1,
    borderRadius: 10,
  },
  nom: {
    fontSize: 14,
    fontWeight: '600',
  },
  de: {
    fontSize: 12,
  },
  erreur: {
    fontSize: 13,
    marginTop: 4,
  },
});
