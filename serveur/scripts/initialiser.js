// Données de démonstration (README → « Identifiants de démonstration »).
// Responsable : Jayden.
//
//   npm run donnees-demo
//
// Rejouable : le script SUPPRIME d'abord les comptes de démonstration (leurs
// campagnes, personnages, journaux et sessions suivent grâce à ON DELETE CASCADE),
// puis les recrée. On retrouve donc toujours les mêmes données, par exemple
// juste avant une démonstration. Les autres comptes ne sont jamais touchés.
//
// Les personnages de « Les Terres du Nord » sont les mêmes que dans
// mobile/constants/donneesTemporaires.js : l'écran Résumé affiche les mêmes
// chiffres avant et après le branchement de l'API.
import bcrypt from 'bcryptjs';
import pool, { transaction } from '../database.js';

// Mot de passe commun aux comptes de démonstration (documenté dans le README)
const MOT_DE_PASSE_DEMO = 'Grimoire123!';

// UUID fixes (format v4 valide) : mêmes id à chaque exécution.
// Dernier bloc : 1… = utilisateur, 2… = campagne, 3… = personnage, 4… = entrée de journal.
const id = (suffixe) => `00000000-0000-4000-a000-${suffixe}`;

const UTILISATEURS = [
  { id: id('100000000001'), courriel: 'joueur@grimoire.test', nomAffiche: 'Jordan Joueur', theme: 'PARCHEMIN' },
  // Deuxième compte : sert à vérifier qu'on ne voit JAMAIS les données d'un autre compte (404)
  { id: id('100000000002'), courriel: 'rival@grimoire.test', nomAffiche: 'Rémi Rival', theme: 'DONJON' },
];

const CAMPAGNES = [
  {
    id: id('200000000001'), utilisateurId: UTILISATEURS[0].id, nom: 'Les Terres du Nord', avatar: 'dragon',
    description: 'Un hiver sans fin s’abat sur les royaumes du nord.',
  },
  {
    id: id('200000000002'), utilisateurId: UTILISATEURS[0].id, nom: 'La Cité Engloutie', avatar: 'chateau',
    description: 'Une ville ancienne refait surface à marée basse.',
  },
  {
    id: id('200000000003'), utilisateurId: UTILISATEURS[1].id, nom: 'Campagne du rival', avatar: 'crane',
    description: 'Invisible pour joueur@grimoire.test.',
  },
];

// Ordre des caractéristiques : force, dextérité, constitution, intelligence, sagesse, charisme
const PERSONNAGES = [
  {
    id: id('300000000001'), campagneId: CAMPAGNES[0].id, nom: 'Aldric', race: 'Humain', classe: 'Guerrier',
    niveau: 3, pvMax: 28, pvActuels: 28, carac: [16, 12, 14, 10, 11, 9],
    biographie: 'Ancien garde de la cité, il protège le groupe.',
  },
  {
    id: id('300000000002'), campagneId: CAMPAGNES[0].id, nom: 'Lyra', race: 'Elfe', classe: 'Magicienne',
    niveau: 3, pvMax: 16, pvActuels: 9, carac: [8, 14, 12, 17, 13, 11], biographie: null,
  },
  {
    // À 0 PV : apparaît dans « À 0 PV » du résumé
    id: id('300000000003'), campagneId: CAMPAGNES[0].id, nom: 'Borin', race: 'Nain', classe: 'Clerc',
    niveau: 2, pvMax: 19, pvActuels: 0, carac: [13, 9, 15, 10, 16, 12], biographie: null,
  },
  {
    id: id('300000000004'), campagneId: CAMPAGNES[1].id, nom: 'Maelis', race: 'Demi-elfe', classe: 'Barde',
    niveau: 5, pvMax: 33, pvActuels: 21, carac: [10, 15, 13, 12, 11, 18],
    biographie: 'Elle chante les légendes de la cité perdue.',
  },
  {
    id: id('300000000005'), campagneId: CAMPAGNES[1].id, nom: 'Tobias', race: 'Halfelin', classe: 'Roublard',
    niveau: 4, pvMax: 25, pvActuels: 25, carac: [9, 18, 12, 13, 10, 14], biographie: null,
  },
  {
    id: id('300000000006'), campagneId: CAMPAGNES[2].id, nom: 'Ombre', race: 'Tieffelin', classe: 'Sorcier',
    niveau: 6, pvMax: 38, pvActuels: 38, carac: [8, 14, 14, 12, 12, 18], biographie: null,
  },
];

const ENTREES_JOURNAL = [
  {
    id: id('400000000001'), personnageId: PERSONNAGES[0].id, dateSession: '2026-11-08',
    titre: 'Le pont de glace', contenu: 'Aldric a tenu le pont seul pendant que le groupe traversait.',
  },
  {
    id: id('400000000002'), personnageId: PERSONNAGES[2].id, dateSession: '2026-11-15',
    titre: 'Embuscade des loups', contenu: 'Borin est tombé en protégeant Lyra. Il faudra le soigner.',
  },
  {
    id: id('400000000003'), personnageId: PERSONNAGES[3].id, dateSession: '2026-11-12',
    titre: 'Arrivée à la cité', contenu: 'La marée a révélé une porte couverte de runes.',
  },
];

const insererDonneesDemo = async () => {
  // bcrypt est lent exprès (protège contre la force brute) : un seul calcul, hors transaction
  const motDePasseHash = await bcrypt.hash(MOT_DE_PASSE_DEMO, 10);

  await transaction(async (connexion) => {
    // 1. Remise à zéro des comptes de démo seulement (CASCADE supprime le reste)
    await connexion.query('DELETE FROM Utilisateur WHERE courriel IN (?)', [
      UTILISATEURS.map((u) => u.courriel),
    ]);

    // 2. Comptes et préférence de thème (relation 1 à 1)
    for (const u of UTILISATEURS) {
      await connexion.query(
        'INSERT INTO Utilisateur (id, courriel, motDePasseHash, nomAffiche) VALUES (?, ?, ?, ?)',
        [u.id, u.courriel, motDePasseHash, u.nomAffiche],
      );
      await connexion.query(
        'INSERT INTO PreferenceUtilisateur (id, utilisateurId, theme) VALUES (UUID(), ?, ?)',
        [u.id, u.theme],
      );
    }

    // 3. Campagnes
    for (const c of CAMPAGNES) {
      await connexion.query(
        'INSERT INTO Campagne (id, utilisateurId, nom, description, avatar) VALUES (?, ?, ?, ?, ?)',
        [c.id, c.utilisateurId, c.nom, c.description, c.avatar],
      );
    }

    // 4. Personnages (`force` entre accents graves : mot réservé de MySQL)
    for (const p of PERSONNAGES) {
      await connexion.query(
        `INSERT INTO Personnage
           (id, campagneId, nom, race, classe, niveau, pvMax, pvActuels,
            \`force\`, dexterite, constitution, intelligence, sagesse, charisme, biographie)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.campagneId, p.nom, p.race, p.classe, p.niveau, p.pvMax, p.pvActuels, ...p.carac, p.biographie],
      );
    }

    // 5. Journal de session
    for (const e of ENTREES_JOURNAL) {
      await connexion.query(
        'INSERT INTO EntreeJournal (id, personnageId, titre, contenu, dateSession) VALUES (?, ?, ?, ?, ?)',
        [e.id, e.personnageId, e.titre, e.contenu, e.dateSession],
      );
    }
  });

  console.log(`✅ Données de démonstration insérées (mot de passe : ${MOT_DE_PASSE_DEMO})`);
  for (const u of UTILISATEURS) console.log(`   - ${u.courriel}`);
};

try {
  await insererDonneesDemo();
} catch (erreur) {
  console.error('❌ Données de démonstration non insérées :', erreur.message);
  console.error('   La base existe-t-elle ? Lancez d’abord : npm run bd:creer');
  process.exitCode = 1;
} finally {
  await pool.end(); // ferme le pool, sinon le script ne se termine jamais
}
