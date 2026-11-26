import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Bouton from '../../components/Bouton';
import ChampTexte from '../../components/ChampTexte';
import { AVATARS, ICONES_AVATARS, STATUTS_SYNC } from '../../constants';
import { ajouterCampagneTemporaire } from '../../constants/donneesTemporaires';
import { useTheme } from '../../contexts/themeContext';
import { validerCampagne } from '../../utils/validation';

export default function NouvelleCampagne() {
  const { theme } = useTheme();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [erreurs, setErreurs] = useState({});

  const enregistrer = () => {
    const campagne = { nom: nom.trim(), description: description.trim() || null, avatar };
    const validation = validerCampagne(campagne);
    setErreurs(validation.erreurs);
    if (!validation.valide) {
      return;
    }
    ajouterCampagneTemporaire({ ...campagne, id: Crypto.randomUUID(), statutSync: STATUTS_SYNC.EN_ATTENTE });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: theme.fond }}
        contentContainerStyle={styles.contenu}
        keyboardShouldPersistTaps="handled"
      >
        <ChampTexte libelle="Nom de la campagne" valeur={nom} onChangeText={setNom} erreur={erreurs.nom} maxLength={60} />
        <ChampTexte
          libelle="Description (facultatif)"
          valeur={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={[styles.libelle, { color: theme.texte }]}>Avatar</Text>
        <View style={styles.grille}>
          {AVATARS.map((cle) => {
            const choisi = avatar === cle;
            return (
              <Pressable
                key={cle}
                accessibilityRole="button"
                accessibilityLabel={`Avatar ${cle}`}
                accessibilityState={{ selected: choisi }}
                onPress={() => setAvatar(cle)}
                style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.surface,
                    borderColor: choisi ? theme.primaire : theme.bordure,
                    borderWidth: choisi ? 3 : 1,
                  },
                ]}
              >
                <Text style={styles.icone}>{ICONES_AVATARS[cle]}</Text>
              </Pressable>
            );
          })}
        </View>
        {erreurs.avatar ? <Text style={[styles.erreur, { color: theme.danger }]}>{erreurs.avatar}</Text> : null}

        <Bouton titre="Créer la campagne" onPress={enregistrer} />
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
  libelle: {
    fontSize: 13,
    marginBottom: 8,
  },
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    fontSize: 32,
  },
  erreur: {
    marginBottom: 16,
  },
});
