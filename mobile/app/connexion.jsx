import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Bouton from '../components/Bouton';
import ChampTexte from '../components/ChampTexte';
import { useTheme } from '../contexts/themeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/authContext';


export default function Connexion() {
  const { theme } = useTheme();
  const router = useRouter();
  const { connecter } = useAuth();
  const [courriel, setCourriel] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setErreur(null);
    setChargement(true);
    try {
      await connecter(courriel.trim(), motDePasse);
      router.replace('/campagnes');
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.conteneur, { backgroundColor: theme.fond }]}
    >
      <View>
        <Text style={[styles.titre, { color: theme.primaire }]}>Grimoire</Text>
        <Text style={[styles.sousTitre, { color: theme.texteSecondaire }]}>
          Vos personnages, partout, même hors ligne
        </Text>
        <ChampTexte
          libelle="Courriel"
          valeur={courriel}
          onChangeText={setCourriel}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />
        <ChampTexte libelle="Mot de passe" valeur={motDePasse} onChangeText={setMotDePasse} secureTextEntry />
        {erreur ? <Text style={[styles.erreur, { color: theme.danger }]}>{erreur}</Text> : null}
        <Bouton titre="Se connecter" onPress={soumettre} chargement={chargement} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titre: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  erreur: {
    marginBottom: 16,
  },
});
