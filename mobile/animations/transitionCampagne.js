import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const useTransitionCampagne = () => {
  const echelle = useSharedValue(1);
  const opacite = useSharedValue(1);

  const lancerTransition = (surFin) => {
    echelle.value = withTiming(1.5, { duration: 300 });
    opacite.value = withTiming(0.1, { duration: 300 });

    setTimeout(() => {
      if (typeof surFin === 'function') {
        surFin();
      }
    }, 300);
  };

  const styleAvatar = useAnimatedStyle(() => ({
    opacity: opacite.value,
    transform: [{ scale: echelle.value }],
  }));

  return { styleAvatar, lancerTransition };
};