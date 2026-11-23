import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
 
const DUREE_MS = 500;
 
export const useAnimationBarrePV = (ratio) => {
  const progression = useSharedValue(ratio);
 
  useEffect(() => {
    progression.value = withTiming(ratio, {
      duration: DUREE_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [ratio, progression]);
 
  const styleRemplissage = useAnimatedStyle(() => ({
    width: `${progression.value * 100}%`,
  }));
 
  return { styleRemplissage };
};