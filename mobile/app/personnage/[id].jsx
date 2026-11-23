import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BarrePV from '../../components/BarrePV';
import EtatChargement from '../../components/EtatChargement';
import EtatErreur from '../../components/EtatErreur';
import LanceurDe from '../../components/LanceurDe';
import { CARACTERISTIQUES } from '../../constants';
import { useTheme } from '../../contexts/themeContext';
import { calculerModificateur, formaterModificateur } from '../../utils/caracteristiques';

export default function DetailPersonnage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [personnage, setPersonnage] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [selection, setSelection] = useState(CARACTERISTIQUES[0]);

  const charger = async () => {
  };

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
});
