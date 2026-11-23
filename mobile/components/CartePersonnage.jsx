import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import BarrePV from './BarrePV';
import StatutSync from './StatutSync';

export default function CartePersonnage({ personnage, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.carte,
        { backgroundColor: theme.surface, borderColor: theme.bordure, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.entete}>
        <Text style={[styles.nom, { color: theme.texte }]}>{personnage.nom}</Text>
        <Text style={[styles.niveau, { color: theme.primaire }]}>Niv. {personnage.niveau}</Text>
      </View>
      <Text style={[styles.sousTitre, { color: theme.texteSecondaire }]}>
        {personnage.race} · {personnage.classe}
      </Text>
      <BarrePV pvActuels={personnage.pvActuels} pvMax={personnage.pvMax} />
      <StatutSync statut={personnage.statutSync} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: '700',
  },
  niveau: {
    fontWeight: '700',
  },
  sousTitre: {
    marginBottom: 8,
  },
});
