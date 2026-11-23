import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import StatutSync from './StatutSync';

export default function BannierePersonnage({ personnage, onPress }) {
  const { theme } = useTheme();
  const ratioPV = personnage.pvMax > 0 ? Math.min(Math.max(personnage.pvActuels / personnage.pvMax, 0), 1) : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${personnage.nom}, ${personnage.classe} niveau ${personnage.niveau}`}
      onPress={onPress}
      style={({ pressed }) => [styles.banniere, { borderColor: theme.bordure, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <ImageBackground
        source={personnage.image ? { uri: personnage.image } : undefined}
        style={[styles.fond, { backgroundColor: theme.primaire }]}
        imageStyle={styles.image}
      >
        {!personnage.image ? <Text style={styles.initiale}>{personnage.nom.charAt(0)}</Text> : null}
        <View style={styles.voile}>
          <View style={styles.ligne}>
            <Text style={styles.nom} numberOfLines={1}>{personnage.nom}</Text>
            <Text style={styles.niveau}>Niv. {personnage.niveau}</Text>
          </View>
          <Text style={styles.sousTitre}>
            {personnage.race} · {personnage.classe}
          </Text>
          <View style={styles.piste}>
            <View style={[styles.remplissage, { width: `${ratioPV * 100}%`, backgroundColor: theme.danger }]} />
          </View>
          <Text style={styles.pv}>
            PV {personnage.pvActuels} / {personnage.pvMax}
          </Text>
        </View>
      </ImageBackground>
      <View style={[styles.pied, { backgroundColor: theme.surface }]}>
        <StatutSync statut={personnage.statutSync} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banniere: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fond: {
    height: 150,
    justifyContent: 'flex-end',
  },
  image: {
    resizeMode: 'cover',
  },
  initiale: {
    position: 'absolute',
    right: 16,
    top: -10,
    fontSize: 120,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.15)',
  },
  voile: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nom: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  niveau: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sousTitre: {
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
  },
  piste: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  remplissage: {
    height: '100%',
  },
  pv: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  pied: {
    paddingHorizontal: 16,
  },
});