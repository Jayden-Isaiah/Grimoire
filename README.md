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
│   ├── constants/               URL de l'API, statuts, caractéristiques
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
│   ├── scripts/initialiser.js   Données de démonstration
│   └── tests/
├── docs/
└── .github/
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

## Identifiants de démonstration

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

À compléter.

## Ressources externes

À compléter.

## Utilisation de l'intelligence artificielle

À compléter : principaux usages (génération initiale, débogage, refactorisation, tests, documentation ou autre).
