import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../contexts/authContext';
import { CampagneProvider } from '../contexts/campagneContext';
import { ThemeProvider } from '../contexts/themeContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <CampagneProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="connexion" options={{ headerShown: false }} />
              <Stack.Screen name="campagnes" options={{ title: 'Mes campagnes' }} />
              <Stack.Screen name="(onglets)" options={{ headerShown: false }} />
              <Stack.Screen name="personnage/[id]" options={{ title: 'Personnage' }} />
              <Stack.Screen name="personnage/ajout" options={{ title: 'Nouveau personnage', presentation: 'modal' }} />
              <Stack.Screen name="personnage/journal/[id]" options={{ title: 'Nouvelle entrée de journal', presentation: 'modal' }} />
              <Stack.Screen name="campagne/nouvelle" options={{ title: 'Nouvelle campagne', presentation: 'modal' }} />
            </Stack>
          </CampagneProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
