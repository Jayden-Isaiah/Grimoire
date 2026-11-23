import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { entreeCascade } from '../../animations/apparitionCascade';
import BanniereHorsLigne from '../../components/BanniereHorsLigne';
import BannierePersonnage from '../../components/BannierePersonnage';
import ChampTexte from '../../components/ChampTexte';
import EtatChargement from '../../components/EtatChargement';
import EtatErreur from '../../components/EtatErreur';
import EtatVide from '../../components/EtatVide';
import { useCampagne } from '../../contexts/campagneContext';
import { useTheme } from '../../contexts/themeContext';
import { usePersonnages } from '../../hooks/usePersonnages';

export default function Personnages() {
  const { theme } = useTheme();
  const router = useRouter();
  const { campagneActive } = useCampagne();
  const { personnages, chargement, erreur, recharger } = usePersonnages(campagneActive?.id);
  const [recherche, setRecherche] = useState('');

  const filtrer = (liste, texte) => {
    const terme = texte.trim().toLowerCase();
    if (!terme) {
      return liste;
    }
    return liste.filter(
      (personnage) =>
        personnage.nom.toLowerCase().includes(terme) || personnage.classe.toLowerCase().includes(terme),
    );
  };

  const ouvrirPersonnage = (personnage) => {
    router.push(`/personnage/${personnage.id}`);
  };

  const ouvrirAjout = () => {
    router.push('/personnage/ajout');
  };

  if (chargement) {
    return <EtatChargement />;
  }
  if (erreur) {
    return <EtatErreur message={erreur} onReessayer={recharger} />;
  }

  return (
    <View style={[styles.conteneur, { backgroundColor: theme.fond }]}>
      <BanniereHorsLigne />
      <FlatList
        data={filtrer(personnages, recherche)}
        keyExtractor={(personnage) => personnage.id}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <ChampTexte libelle="Rechercher" valeur={recherche} onChangeText={setRecherche} placeholder="Nom ou classe" />
        }
        ListEmptyComponent={
          <EtatVide
            titre={recherche ? 'Aucun résultat' : 'Aucun personnage'}
            message={recherche ? 'Essayez un autre nom ou une autre classe.' : 'Ajoutez votre premier personnage.'}
          />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={entreeCascade(index)}>
            <BannierePersonnage personnage={item} onPress={() => ouvrirPersonnage(item)} />
          </Animated.View>
        )}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter un personnage"
        onPress={ouvrirAjout}
        style={[styles.flottant, { backgroundColor: theme.primaire }]}
      >
        <Text style={[styles.plus, { color: theme.surPrimaire }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
  },
  liste: {
    padding: 16,
    paddingBottom: 96,
    flexGrow: 1,
  },
  flottant: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  plus: {
    fontSize: 30,
    lineHeight: 32,
  },
});