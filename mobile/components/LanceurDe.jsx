import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimationDe } from '../animations/animationDe';
import { useTheme } from '../contexts/themeContext';
import Bouton from './Bouton';

export default function LanceurDe({ libelle, valeur }) {
  const { theme } = useTheme();
  const { styleDe, lancerAnimation } = useAnimationDe();
  const [resultat, setResultat] = useState(null);

  const lancer = () => {
  };

  return (
    <View style={[styles.conteneur, { backgroundColor: theme.surface, borderColor: theme.bordure }]}>
      <Text style={[styles.titre, { color: theme.texte }]}>Jet de {libelle}</Text>
      <Animated.View style={[styles.de, { borderColor: theme.primaire }, styleDe]}>
        <Text style={[styles.valeurDe, { color: theme.primaire }]}>{resultat ? resultat.de : 'd20'}</Text>
      </Animated.View>
      {resultat ? (
        <Text accessibilityLiveRegion="polite" style={[styles.total, { color: theme.texte }]}>
          {resultat.de} {resultat.modificateur >= 0 ? '+' : ''}{resultat.modificateur} = {resultat.total}
        </Text>
      ) : null}
      <Bouton titre="Lancer le dé" onPress={lancer} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  titre: {
    fontSize: 16,
    fontWeight: '600',
  },
  de: {
    width: 84,
    height: 84,
    borderWidth: 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  valeurDe: {
    fontSize: 28,
    fontWeight: '800',
  },
  total: {
    fontSize: 22,
    marginBottom: 8,
  },
});
