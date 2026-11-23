import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BanniereHorsLigne from '../../components/BanniereHorsLigne';
import Bouton from '../../components/Bouton';
import CartePersonnage from '../../components/CartePersonnage';
import EtatChargement from '../../components/EtatChargement';
import EtatErreur from '../../components/EtatErreur';
import EtatVide from '../../components/EtatVide';
import { useCampagne } from '../../contexts/campagneContext';
import { useTheme } from '../../contexts/themeContext';
import { usePersonnages } from '../../hooks/usePersonnages';
import { calculerResume } from '../../utils/resume';
import { useRouter } from 'expo-router';


const RESUME_VIDE = { nombrePersonnages: 0, niveauMoyen: 0, personnagesKo: 0, repartitionClasses: [] };

function CarteStat({ libelle, valeur }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.stat, { backgroundColor: theme.surface, borderColor: theme.bordure }]}>
      <Text style={[styles.valeurStat, { color: theme.primaire }]}>{valeur}</Text>
      <Text style={[styles.libelleStat, { color: theme.texteSecondaire }]}>{libelle}</Text>
    </View>
  );
}

export default function Resume() {
  const { theme } = useTheme();
  const { campagneActive } = useCampagne();
  const { personnages, chargement, erreur, recharger } = usePersonnages(campagneActive?.id);
  const resume = calculerResume(personnages) ?? RESUME_VIDE;
  const router = useRouter();

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
  if (personnages.length === 0) {
    return (
      <View style={[styles.conteneur, { backgroundColor: theme.fond }]}>
        <BanniereHorsLigne />
        <EtatVide
          titre="Aucun personnage"
          message="Cette campagne n’a pas encore de héros."
          titreAction="Créer un personnage"
          onAction={ouvrirAjout}
        />
      </View>
    );
  }

  return (
    <View style={[styles.conteneur, { backgroundColor: theme.fond }]}>
      <BanniereHorsLigne />
      <ScrollView contentContainerStyle={styles.contenu}>
        <Text style={[styles.titre, { color: theme.texte }]}>{campagneActive?.nom}</Text>
        <View style={styles.grille}>
          <CarteStat libelle="Personnages" valeur={resume.nombrePersonnages} />
          <CarteStat libelle="Niveau moyen" valeur={resume.niveauMoyen} />
          <CarteStat libelle="À 0 PV" valeur={resume.personnagesKo} />
        </View>
        <Text style={[styles.sousTitre, { color: theme.texte }]}>Classes</Text>
        {resume.repartitionClasses.map(({ classe, nombre }) => (
          <Text key={classe} style={{ color: theme.texteSecondaire }}>
            {classe} : {nombre}
          </Text>
        ))}
        <Text style={[styles.sousTitre, { color: theme.texte }]}>Personnages</Text>
        {personnages.map((personnage) => (
          <CartePersonnage key={personnage.id} personnage={personnage} onPress={() => ouvrirPersonnage(personnage)} />
        ))}
        <View style={styles.action}>
          <Bouton titre="Ajouter un personnage" onPress={ouvrirAjout} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
  },
  contenu: {
    padding: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  grille: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  valeurStat: {
    fontSize: 28,
    fontWeight: '800',
  },
  libelleStat: {
    fontSize: 13,
  },
  sousTitre: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  action: {
    marginTop: 16,
  },
});
