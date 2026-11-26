# Grimoire

Application Android de gestion de fiches de personnages pour jeux de rôle (système générique), réalisée dans le cadre du cours 420-512-MV – Développement d'applications mobiles, Cégep Marie-Victorin, automne 2026.

## Équipe

| Membre | Responsabilité principale |
| --- | --- |
| Adam Roy | Navigation, écrans, composants, thèmes |
| Sarragossa Kaiss | Serveur Express, authentification, contrôle d'accès |
| Jayden Saint-Cyr | Base de données serveur, modèle de données, résumé, APK |
| Kevin Emmanuel Jean | SQLite mobile, chiffrement, synchronisation, animations |

## Technologies

- Mobile : React Native + Expo SDK 58 (JavaScript) dans Expo Go, expo-router, axios, expo-sqlite, expo-secure-store, expo-crypto (AES-GCM), NetInfo, Reanimated
- Serveur : Node.js + Express 5 (JavaScript, modules ES), MySQL avec mysql2, bcryptjs, dotenv, nodemon
- Tests : Jest, Supertest, jest-expo

## Structure du dépôt

```
grimoire/
├── mobile/
│   ├── app/                     Routes expo-router
│   │   ├── _layout.jsx          Fournisseurs de contexte + Stack
│   │   ├── index.jsx            Redirection de départ
│   │   ├── connexion.jsx
│   │   ├── campagnes.jsx        Sélection du profil (campagne)
│   │   ├── (onglets)/           Résumé, personnages, paramètres
│   │   └── personnage/          [id].jsx (détail), ajout.jsx
│   ├── animations/              Dé, barre de PV, transition de campagne, cascade
│   ├── assets/colorsPalette.js  Trois thèmes : parchemin, donjon, arcane
│   ├── components/              Composants réutilisables
│   ├── constants/               URL de l'API, statuts, caractéristiques, données temporaires
│   ├── contexts/                authContext, campagneContext, themeContext
│   ├── database/                SQLite locale, migrations, accès aux données
│   ├── hooks/                   useCampagnes, usePersonnages, useReseau, useSynchronisation
│   ├── securite/                Clé AES, chiffrement, session sécurisée
│   ├── services/                Instance axios et appels REST
│   ├── sync/                    File de synchronisation, politique de conflit
│   ├── utils/                   Fonctions pures testées
│   └── __tests__/
├── serveur/
│   ├── app.js                   Configuration Express et routes
│   ├── server.js                Démarrage du serveur
│   ├── database.js              Pool de connexions MySQL (mysql2)
│   ├── bd/schema.sql            Création de la base et des tables
│   ├── controleurs/
│   ├── middleware/
│   ├── routes/
│   ├── services/                Requêtes SQL
│   ├── validateurs/
│   ├── scripts/                 creerBase.js (création de la base), initialiser.js (données de démonstration)
│   └── tests/
├── docs/                    Planification, modèle de données (modele-donnees.md)
└── .github/                 Modèles d'issue et de pull request
```

## Démarrage du serveur

1. Démarrer MySQL 8 (service Windows `MySQL80`).
2. Installer, créer la base et lancer le serveur :

```bash
cd serveur
npm install
cp .env.example .env       # puis renseigner MYSQL_PASSWORD
npm run bd:creer           # crée la base MYSQL_DATABASE et ses tables (bd/schema.sql)
npm run donnees-demo       # comptes, campagnes, personnages et journal de démonstration
npm run dev
```

Dans `.env`, renseignez `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` et `MYSQL_DATABASE`.

| Commande | Effet |
| --- | --- |
| `npm run bd:creer` | Crée la base et les tables si elles n'existent pas (sans rien effacer). |
| `npm run bd:reinitialiser` | **Supprime** la base de développement puis la recrée. À utiliser après une modification de `bd/schema.sql`. |
| `npm run donnees-demo` | Remet les comptes de démonstration à neuf. Rejouable, ne touche pas aux autres comptes. |

Le modèle de données (entités, relations, règles) est décrit dans [docs/modele-donnees.md](docs/modele-donnees.md).

La colonne `force` est un mot réservé de MySQL : écrivez-la entre accents graves (`` `force` ``) dans les requêtes SQL.

Vérification : `http://localhost:3000/sante`.

## Démarrage de l'application mobile

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Scannez le code QR avec Expo Go. Dans `.env`, `EXPO_PUBLIC_BACKEND_IP` doit contenir l'adresse IP de l'ordinateur qui exécute le serveur, sur le même réseau que le téléphone.

Pour ajouter une dépendance mobile, utilisez `npx expo install <paquet>`.

## Données temporaires (livrable 2)

Le prototype n'est pas encore relié à l'API. Les éléments suivants sont temporaires et seront remplacés au livrable 3 :

- La connexion accepte n'importe quel courriel et mot de passe non vides (`mobile/contexts/authContext.js`, constante `SESSION_TEMPORAIRE`).
- Les campagnes et les personnages affichés viennent de `mobile/constants/donneesTemporaires.js`.
- Les personnages ajoutés sont gardés en mémoire seulement : ils disparaissent au redémarrage de l'application.
- Le bouton « Nouvelle campagne » et la synchronisation ne sont pas encore actifs.

## Identifiants de démonstration

Pour l'instant, l'application mobile accepte n'importe quels identifiants (voir « Données temporaires »). Les comptes ci-dessous servent au serveur et seront utilisés par l'application à partir du livrable 3.

Créés par `npm run donnees-demo` (dans `serveur/`). Mot de passe commun : `Grimoire123!`

| Courriel | Contenu |
| --- | --- |
| `joueur@grimoire.test` | 2 campagnes : « Les Terres du Nord » (Aldric, Lyra, Borin à 0 PV) et « La Cité Engloutie » (Maelis, Tobias), avec des entrées de journal. |
| `rival@grimoire.test` | 1 campagne. Sert à vérifier qu'un compte ne voit jamais les données d'un autre (réponse 404). |

## Tests

```bash
cd serveur
npm test

cd ../mobile
npm test
```

Les tests du serveur qui touchent aux données (résumé, journal) utilisent une base séparée, `grimoire_test`, créée automatiquement : MySQL doit être démarré, avec les identifiants du `.env`. La base de développement n'est jamais modifiée par les tests.

## Génération de l'APK

À compléter.

## Limites connues

- Livrable 2 : l'application utilise des données temporaires et n'appelle pas encore l'API (voir « Données temporaires »).
- L'image de bannière d'un personnage est conservée seulement sur l'appareil qui l'a choisie : elle n'est pas envoyée au serveur.
- Au cégep, Expo Go ne peut joindre l'ordinateur que depuis le conteneur du cours (`ssh`) : lancer `npx expo start` dans le conteneur.
- Les tests du serveur qui touchent aux données exigent un serveur MySQL démarré.

## Ressources externes

| Ressource | Utilisation | Licence |
| --- | --- | --- |
| Expo, expo-router, expo-sqlite, expo-secure-store, expo-crypto, expo-image-picker | Application mobile, navigation, stockage local, chiffrement, choix d'image | MIT |
| React Native, React Native Reanimated, NetInfo | Interface, animations, état du réseau | MIT |
| axios | Appels à l'API REST | MIT |
| Express, cors, dotenv, mysql2, bcryptjs, nodemon | Serveur, base de données, hachage des mots de passe | MIT |
| Jest, jest-expo, Supertest | Tests automatisés | MIT |
| Émojis des avatars et des onglets | Icônes affichées par le système du téléphone | — |

Les notes de cours 420-512 (https://cegepmv.github.io/420512/) ont servi de référence pour la structure du projet (expo-router, contextes, Reanimated, Express et mysql2).

## Utilisation de l'intelligence artificielle

L'équipe a utilisé Claude (Anthropic) comme outil d'apprentissage et de soutien :

- **Génération initiale** : structure du dépôt, squelette des écrans et des composants (fonctions vides), schéma de la base de données.
- **Explications** : fonctionnement d'expo-router, des contextes, de Reanimated, de mysql2 et du contrôle d'accès.
- **Débogage et revue** : relecture des pull requests, correction d'erreurs (import en double, calcul des modificateurs, fichiers `.env.example` supprimés).
- **Tests** : aide à la rédaction des tests de validation du formulaire.
- **Documentation** : document de planification du livrable 1 et sections de ce README.

Chaque membre a relu, testé et adapté le code produit avec cet outil, et doit pouvoir l'expliquer et le modifier.
