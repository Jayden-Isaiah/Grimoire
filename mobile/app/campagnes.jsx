import { FlatList, StyleSheet, Text, View } from 'react-native';
import BanniereHorsLigne from '../components/BanniereHorsLigne';
import Bouton from '../components/Bouton';
import CarteCampagne from '../components/CarteCampagne';
import EtatChargement from '../components/EtatChargement';
import EtatErreur from '../components/EtatErreur';
import EtatVide from '../components/EtatVide';
import { useTheme } from '../contexts/themeContext';
import { useCampagnes } from '../hooks/useCampagnes';
import { useRouter } from 'expo-router';
import { useCampagne } from '../contexts/campagneContext';


export default function Campagnes() {
  const { theme } = useTheme();
  const { campagnes, chargement, erreur, recharger } = useCampagnes();
  const router = useRouter();
  const { choisirCampagne } = useCampagne();

  const choisir = (campagne) => {
    choisirCampagne(campagne);
    router.replace('/resume');
  };

  const creerCampagne = () => {
  };

  if (chargement && campagnes.length === 0) {
    return <EtatChargement message="Chargement des campagnes…" />;
  }
  if (erreur) {
    return <EtatErreur message={erreur} onReessayer={recharger} />;
  }

  return (
    <View style={[styles.conteneur, { backgroundColor: theme.fond }]}>
      <BanniereHorsLigne />
      <FlatList
        data={campagnes}
        keyExtractor={(campagne) => campagne.id}
        numColumns={2}
        columnWrapperStyle={styles.colonnes}
        contentContainerStyle={styles.liste}
        onRefresh={recharger}
        refreshing={chargement}
        ListHeaderComponent={<Text style={[styles.titre, { color: theme.texte }]}>Qui joue aujourd’hui?</Text>}
        ListEmptyComponent={<EtatVide titre="Aucune campagne" message="Créez votre première campagne pour commencer." />}
        ListFooterComponent={<Bouton titre="Nouvelle campagne" variante="secondaire" onPress={creerCampagne} />}
        renderItem={({ item }) => <CarteCampagne campagne={item} onPress={() => choisir(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
  },
  liste: {
    padding: 16,
    flexGrow: 1,
  },
  colonnes: {
    gap: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
});
