import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../contexts/themeContext';

const icone = (symbole) => ({ focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{symbole}</Text>
);

export default function OngletsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.texte,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.bordure },
        tabBarActiveTintColor: theme.primaire,
        tabBarInactiveTintColor: theme.texteSecondaire,
      }}
    >
      <Tabs.Screen name="resume" options={{ title: 'Résumé', tabBarIcon: icone('🏠') }} />
      <Tabs.Screen name="personnages" options={{ title: 'Personnages', tabBarIcon: icone('🛡️') }} />
      <Tabs.Screen name="parametres" options={{ title: 'Paramètres', tabBarIcon: icone('⚙️') }} />
    </Tabs>
  );
}
