import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/themeContext';

export default function Bouton({ titre, onPress, variante = 'principal', chargement = false, desactive = false }) {
  const { theme } = useTheme();
  const principal = variante === 'principal';
  const inactif = desactive || chargement;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactif }}
      onPress={onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.bouton,
        {
          backgroundColor: principal ? theme.primaire : 'transparent',
          borderColor: theme.primaire,
          opacity: inactif ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={principal ? theme.surPrimaire : theme.primaire} />
      ) : (
        <Text style={[styles.texte, { color: principal ? theme.surPrimaire : theme.primaire }]}>{titre}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  texte: {
    fontSize: 16,
    fontWeight: '600',
  },
});
