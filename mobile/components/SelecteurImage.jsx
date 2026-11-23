import * as ImagePicker from 'expo-image-picker';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/themeContext';
import Bouton from './Bouton';

export default function SelecteurImage({ libelle, valeur, onChange }) {
  const { theme } = useTheme();

  const choisirImage = async () => {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!resultat.canceled) {
      onChange(resultat.assets[0].uri);
    }
  };

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.libelle, { color: theme.texte }]}>{libelle}</Text>
      {valeur ? (
        <Image source={{ uri: valeur }} style={[styles.apercu, { borderColor: theme.bordure }]} />
      ) : (
        <View style={[styles.apercu, styles.vide, { borderColor: theme.bordure, backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.texteSecondaire }}>Aucune image</Text>
        </View>
      )}
      <View style={styles.boutons}>
        <View style={styles.bouton}>
          <Bouton titre={valeur ? 'Changer l’image' : 'Choisir une image'} variante="secondaire" onPress={choisirImage} />
        </View>
        {valeur ? (
          <View style={styles.bouton}>
            <Bouton titre="Retirer" variante="secondaire" onPress={() => onChange(null)} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 16,
  },
  libelle: {
    fontSize: 13,
    marginBottom: 4,
  },
  apercu: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  vide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutons: {
    flexDirection: 'row',
    gap: 8,
  },
  bouton: {
    flex: 1,
  },
});