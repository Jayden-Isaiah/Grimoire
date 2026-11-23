import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import colorsPalette from '../../assets/colorsPalette';
import Bouton from '../../components/Bouton';
import { useAuth } from '../../contexts/authContext';
import { useCampagne } from '../../contexts/campagneContext';
import { useTheme } from '../../contexts/themeContext';
import { useReseau } from '../../hooks/useReseau';
import { useSynchronisation } from '../../hooks/useSynchronisation';
import { useRouter } from 'expo-router';


export default function Parametres() {
  const { theme, nomTheme, changerTheme } = useTheme();
  const { session, deconnecter } = useAuth();
  const { campagneActive, quitterCampagne } = useCampagne();
  const { horsLigne } = useReseau();
  const { enCours, synchroniserMaintenant } = useSynchronisation();
  const operationsEnAttente = 0;
  const router = useRouter();

  const changerDeCampagne = () => {
    quitterCampagne();
    router.replace('/campagnes');
  };

  const seDeconnecter = async () => {
    await deconnecter();
    quitterCampagne();
    router.replace('/connexion');
  };

  return (
    <ScrollView style={{ backgroundColor: theme.fond }} contentContainerStyle={styles.contenu}>
      <Text style={{ color: theme.texteSecondaire }}>Connecté en tant que {session?.utilisateur?.nomAffiche}</Text>
      <Text style={{ color: theme.texteSecondaire }}>Campagne : {campagneActive?.nom}</Text>

      <Text style={[styles.section, { color: theme.texte }]}>Thème</Text>
      <View style={styles.themes}>
        {Object.entries(colorsPalette).map(([cle, palette]) => {
          const actif = cle === nomTheme;
          return (
            <Pressable
              key={cle}
              accessibilityRole="button"
              accessibilityState={{ selected: actif }}
              onPress={() => changerTheme(cle)}
              style={[
                styles.optionTheme,
                { backgroundColor: palette.fond, borderColor: actif ? palette.primaire : palette.bordure },
              ]}
            >
              <View style={[styles.pastille, { backgroundColor: palette.primaire }]} />
              <Text style={{ color: palette.texte, fontWeight: actif ? '700' : '400' }}>{palette.nom}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.section, { color: theme.texte }]}>Synchronisation</Text>
      <Text style={[styles.etatSync, { color: theme.texteSecondaire }]}>
        {horsLigne ? 'Hors ligne. ' : ''}
        {operationsEnAttente === 0 ? 'Tout est synchronisé.' : `${operationsEnAttente} modification(s) en attente.`}
      </Text>
      <Bouton
        titre="Synchroniser maintenant"
        variante="secondaire"
        onPress={synchroniserMaintenant}
        chargement={enCours}
        desactive={horsLigne}
      />

      <Text style={[styles.section, { color: theme.texte }]}>Compte</Text>
      <View style={styles.boutons}>
        <Bouton titre="Changer de campagne" variante="secondaire" onPress={changerDeCampagne} />
        <Bouton titre="Se déconnecter" onPress={seDeconnecter} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: {
    padding: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  themes: {
    flexDirection: 'row',
    gap: 8,
  },
  optionTheme: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  pastille: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 6,
  },
  etatSync: {
    marginBottom: 8,
  },
  boutons: {
    gap: 8,
  },
});
