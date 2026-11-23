import { FadeInDown } from 'react-native-reanimated';
 
const DECALAGE_MS = 80;
const DUREE_MS = 400;
const INDEX_MAX = 8;
 
export const entreeCascade = (index) =>
  FadeInDown.duration(DUREE_MS).delay(Math.min(index, INDEX_MAX) * DECALAGE_MS);