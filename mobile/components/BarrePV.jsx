import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimationBarrePV } from '../animations/animationBarrePV';
import { useTheme } from '../contexts/themeContext';

export default function BarrePV({ pvActuels, pvMax }) {
  const { theme } = useTheme();
  const ratio = pvMax > 0 ? Math.min(Math.max(pvActuels / pvMax, 0), 1) : 0;
  const { styleRemplissage } = useAnimationBarrePV(ratio);

  return (
    <View accessibilityLabel={`Points de vie : ${pvActuels} sur ${pvMax}`}>
      <View style={[styles.piste, { backgroundColor: theme.bordure }]}>
        <Animated.View
          style={[styles.remplissage, { backgroundColor: theme.danger, width: `${ratio * 100}%` }, styleRemplissage]}
        />
      </View>
      <Text style={[styles.texte, { color: theme.texteSecondaire }]}>
        PV {pvActuels} / {pvMax}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  piste: {
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  remplissage: {
    height: '100%',
    borderRadius: 6,
  },
  texte: {
    fontSize: 13,
    marginTop: 2,
  },
});
