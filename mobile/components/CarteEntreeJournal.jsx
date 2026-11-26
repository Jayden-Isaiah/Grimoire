import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import { formaterDate } from '../utils/dates';
import StatutSync from './StatutSync';

export default function CarteEntreeJournal({ entree, nomPersonnage }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.carte, { backgroundColor: theme.surface, borderColor: theme.bordure }]}>
      <View style={styles.entete}>
        <Text style={[styles.titre, { color: theme.texte }]} numberOfLines={1}>
          {entree.titre}
        </Text>
        <Text style={[styles.date, { color: theme.primaire }]}>{formaterDate(entree.dateSession)}</Text>
      </View>
      {nomPersonnage ? <Text style={[styles.personnage, { color: theme.texteSecondaire }]}>{nomPersonnage}</Text> : null}
      <Text style={[styles.contenu, { color: theme.texte }]}>{entree.contenu}</Text>
      <StatutSync statut={entree.statutSync} />
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  titre: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
  },
  personnage: {
    fontSize: 13,
    marginTop: 2,
  },
  contenu: {
    marginTop: 6,
    lineHeight: 20,
  },
});
