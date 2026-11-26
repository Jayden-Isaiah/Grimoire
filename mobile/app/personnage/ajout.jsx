import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Bouton from '../../components/Bouton';
import ChampTexte from '../../components/ChampTexte';
import { CARACTERISTIQUES, STATUTS_SYNC } from '../../constants';
import { ajouterPersonnageTemporaire } from '../../constants/donneesTemporaires';
import { useCampagne } from '../../contexts/campagneContext';
import { useTheme } from '../../contexts/themeContext';
import SelecteurImage from '../../components/SelecteurImage';
import { convertirFormulaire, validerPersonnage } from '../../utils/validation';

const FORMULAIRE_VIDE = {
  nom: '',
  race: '',
  classe: '',
  niveau: '1',
  pvMax: '10',
  pvActuels: '',
  force: '10',
  dexterite: '10',
  constitution: '10',
  intelligence: '10',
  sagesse: '10',
  charisme: '10',
  biographie: '',
  image: null,
};

export default function AjoutPersonnage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { campagneActive } = useCampagne();
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreurGenerale, setErreurGenerale] = useState(null);

  const modifier = (champ) => (texte) => setFormulaire((precedent) => ({ ...precedent, [champ]: texte }));

  const enregistrer = async () => {
    const donnees = convertirFormulaire(formulaire);
    const validation = validerPersonnage(donnees);
    setErreurs(validation.erreurs);
    if (!validation.valide) {
      setErreurGenerale('Corrigez les champs en rouge.');
      return;
    }
    setEnregistrement(true);
    setErreurGenerale(null);
    try {
      const personnage = {
        ...donnees,
        id: Crypto.randomUUID(),
        campagneId: campagneActive.id,
        statutSync: STATUTS_SYNC.EN_ATTENTE,
      };
      ajouterPersonnageTemporaire(personnage);
      router.replace(`/personnage/${personnage.id}`);
    } catch {
      setErreurGenerale('Impossible d’enregistrer le personnage.');
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: theme.fond }}
        contentContainerStyle={styles.contenu}
        keyboardShouldPersistTaps="handled"
      >
        <SelecteurImage
          libelle="Image de la bannière (facultatif)"
          valeur={formulaire.image}
          onChange={modifier('image')}
        />
        <ChampTexte libelle="Nom" valeur={formulaire.nom} onChangeText={modifier('nom')} erreur={erreurs.nom} />
        <ChampTexte libelle="Race" valeur={formulaire.race} onChangeText={modifier('race')} erreur={erreurs.race} />
        <ChampTexte libelle="Classe" valeur={formulaire.classe} onChangeText={modifier('classe')} erreur={erreurs.classe} />

        <View style={styles.ligne}>
          <View style={styles.colonne}>
            <ChampTexte
              libelle="Niveau"
              valeur={formulaire.niveau}
              onChangeText={modifier('niveau')}
              erreur={erreurs.niveau}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.colonne}>
            <ChampTexte
              libelle="PV max"
              valeur={formulaire.pvMax}
              onChangeText={modifier('pvMax')}
              erreur={erreurs.pvMax}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.colonne}>
            <ChampTexte
              libelle="PV actuels"
              valeur={formulaire.pvActuels}
              onChangeText={modifier('pvActuels')}
              erreur={erreurs.pvActuels}
              keyboardType="number-pad"
              placeholder={formulaire.pvMax}
            />
          </View>
        </View>

        <Text style={[styles.section, { color: theme.texte }]}>Caractéristiques</Text>
        <View style={styles.grille}>
          {CARACTERISTIQUES.map(({ cle, libelle }) => (
            <View key={cle} style={styles.tiers}>
              <ChampTexte
                libelle={libelle}
                valeur={formulaire[cle]}
                onChangeText={modifier(cle)}
                erreur={erreurs[cle]}
                keyboardType="number-pad"
              />
            </View>
          ))}
        </View>

        <ChampTexte
          libelle="Biographie (facultatif)"
          valeur={formulaire.biographie}
          onChangeText={modifier('biographie')}
          multiline
          numberOfLines={4}
        />
        {erreurGenerale ? <Text style={[styles.erreur, { color: theme.danger }]}>{erreurGenerale}</Text> : null}
        <Bouton titre="Créer le personnage" onPress={enregistrer} chargement={enregistrement} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
  },
  contenu: {
    padding: 16,
  },
  ligne: {
    flexDirection: 'row',
    gap: 8,
  },
  colonne: {
    flex: 1,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
  },
  tiers: {
    width: '31%',
  },
  erreur: {
    marginBottom: 16,
  },
});
