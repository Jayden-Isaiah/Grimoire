import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

export const useAnimationDe = () => {
  const rotation = useSharedValue(0);
  const echelle = useSharedValue(1);

  const lancerAnimation = () => {
    // Réinitialise l'angle pour pouvoir relancer plusieurs fois
    rotation.value = 0;

    // Rotation rapide de 2 tours complets (720 degrés) avec ralentissement naturel
    rotation.value = withTiming(720, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Effet de rebond : agrandissement puis retour à la taille normale
    echelle.value = withSequence(
      withTiming(1.25, { duration: 150, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  };

  const styleDe = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: echelle.value },
    ],
  }));

  return { styleDe, lancerAnimation };
};
