import { Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { ICONES_AVATARS } from '../constants';
import { useTheme } from '../contexts/themeContext';
import { useTransitionCampagne } from '../animations/transitionCampagne';


export default function CarteCampagne({ campagne, onPress }) {
  const { theme } = useTheme();
  const { styleAvatar, lancerTransition } = useTransitionCampagne();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Campagne ${campagne.nom}`}
      onPress={() => lancerTransition(() => onPress?.(campagne))}
      style={({ pressed }) => [
        styles.carte,
        {
          backgroundColor: theme.surface,
          borderColor: theme.bordure,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <Animated.Text style={[styles.avatar, styleAvatar]}>
        {ICONES_AVATARS[campagne.avatar] ?? ICONES_AVATARS.grimoire}
      </Animated.Text>
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