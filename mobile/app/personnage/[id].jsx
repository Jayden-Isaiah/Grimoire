import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BarrePV from '../../components/BarrePV';
import Bouton from '../../components/Bouton';
import CarteEntreeJournal from '../../components/CarteEntreeJournal';
import EtatChargement from '../../components/EtatChargement';
import EtatErreur from '../../components/EtatErreur';
import LanceurDe from '../../components/LanceurDe';
import { CARACTERISTIQUES } from '../../constants';
import { useTheme } from '../../contexts/themeContext';
import { calculerModificateur, formaterModificateur } from '../../utils/caracteristiques';
import { useEffect, useState } from 'react';
import { PERSONNAGES_TEMPORAIRES } from '../../constants/donneesTemporaires';
import { useJournal } from '../../hooks/useJournal';

export default function DetailPersonnage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const { entrees } = useJournal([id]);
  const [personnage, setPersonnage] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [selection, setSelection] = useState(CARACTERISTIQUES[0]);

  const charger = async () => {
    setChargement(true);
    setErreur(null);
    setPersonnage(PERSONNAGES_TEMPORAIRES.find((p) => p.id === id) ?? null);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, [id]);

  if (chargement) {
    return <EtatChargement />;
  }
  if (erreur || !personnage) {
    return <EtatErreur message={erreur ?? 'Ce personnage est introuvable.'} onReessayer={charger} />;
  }

  return (
    <ScrollView style={{ backgroundColor: theme.fond }} contentContainerStyle={styles.contenu}>
      <Text style={[styles.nom, { color: theme.texte }]}>{personnage.nom}</Text>
      <Text style={[styles.sousTitre, { color: theme.texteSecondaire }]}>
        {personnage.race} · {personnage.classe} · Niveau {personnage.niveau}
      </Text>
      <View style={styles.pv}>
        <BarrePV pvActuels={personnage.pvActuels} pvMax={personnage.pvMax} />
      </View>

      <View style={styles.grille}>
        {CARACTERISTIQUES.map((caracteristique) => {
          const valeur = personnage[caracteristique.cle];
          const choisie = selection.cle === caracteristique.cle;
          return (
            <Pressable
              key={caracteristique.cle}
              accessibilityRole="button"
              accessibilityLabel={`${caracteristique.libelle} ${valeur}`}
              accessibilityState={{ selected: choisie }}
              onPress={() => setSelection(caracteristique)}
              style={[
                styles.case,
                { backgroundColor: theme.surface, borderColor: choisie ? theme.primaire : theme.bordure },
              ]}
            >
              <Text style={[styles.abreviation, { color: theme.texteSecondaire }]}>{caracteristique.abreviation}</Text>
              <Text style={[styles.valeur, { color: theme.texte }]}>{valeur}</Text>
              <Text style={{ color: theme.primaire }}>{formaterModificateur(calculerModificateur(valeur))}</Text>
            </Pressable>
          );
        })}
      </View>

      <LanceurDe libelle={selection.libelle} valeur={personnage[selection.cle]} />

      {personnage.biographie ? (
        <View style={styles.biographie}>
          <Text style={[styles.titreSection, { color: theme.texte }]}>Biographie</Text>
          <Text style={[styles.texteBiographie, { color: theme.texte }]}>{personnage.biographie}</Text>
        </View>
      ) : null}

      <View style={styles.journal}>
        <Text style={[styles.titreSection, { color: theme.texte }]}>Journal de session</Text>
        {entrees.length === 0 ? (
          <Text style={[styles.journalVide, { color: theme.texteSecondaire }]}>Aucune entrée pour l’instant.</Text>
        ) : (
          entrees.map((entree) => <CarteEntreeJournal key={entree.id} entree={entree} />)
        )}
        <Bouton titre="Ajouter une entrée" variante="secondaire" onPress={() => router.push(`/personnage/journal/${id}`)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: {
    padding: 16,
  },
  nom: {
    fontSize: 28,
    fontWeight: '800',
  },
  sousTitre: {
    fontSize: 16,
  },
  pv: {
    marginVertical: 16,
  },
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  case: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 12,
  },
  abreviation: {
    fontSize: 13,
    fontWeight: '700',
  },
  valeur: {
    fontSize: 22,
    fontWeight: '800',
  },
  biographie: {
    marginTop: 24,
  },
  titreSection: {
    fontWeight: '700',
    marginBottom: 8,
  },
  texteBiographie: {
    lineHeight: 22,
  },
  journal: {
    marginTop: 24,
    marginBottom: 16,
  },
  journalVide: {
    marginBottom: 8,
  },
});
