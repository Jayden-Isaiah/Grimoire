import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/themeContext';

const ICONES = {
  epee: '⚔️',
  dragon: '🐉',
  chateau: '🏰',
  grimoire: '📖',
  crane: '💀',
  etoile: '✨',
};

export default function CarteCampagne({ campagne, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Campagne ${campagne.nom}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.carte,
        {
          backgroundColor: theme.surface,
          borderColor: theme.bordure,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <Text style={styles.avatar}>{ICONES[campagne.avatar] ?? ICONES.grimoire}</Text>
      <Text style={[styles.nom, { color: theme.texte }]}>{campagne.nom}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 8,
  },
  nom: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
