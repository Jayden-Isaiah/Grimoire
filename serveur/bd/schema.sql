-- =============================================================================
-- Grimoire : schéma de la base MySQL du serveur
-- Livrable 1, section 5 (modèle de données). Responsable : Jayden.
-- =============================================================================
--
-- Création de la base (recommandé) : depuis serveur/, `npm run bd:creer`.
--   Le script lit MYSQL_DATABASE dans .env, crée la base si elle n'existe pas,
--   puis exécute ce fichier. Il n'y a donc PAS de CREATE DATABASE / USE ici :
--   le même fichier sert à créer `grimoire` (dev) et `grimoire_test` (tests).
--
-- Alternative manuelle (Workbench ou terminal) :
--   CREATE DATABASE grimoire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   mysql -u root -p grimoire < bd/schema.sql
--
-- Après une modification de ce fichier : `npm run bd:reinitialiser`
-- (supprime et recrée la base de dev), puis `npm run donnees-demo`.
-- CREATE TABLE IF NOT EXISTS ne modifie pas une table qui existe déjà.
--
-- Conventions :
-- - Tables en PascalCase, colonnes en camelCase (mêmes noms que l'API et le mobile).
-- - id CHAR(36) = UUID généré par le TÉLÉPHONE et réutilisé tel quel ici :
--   une entité a le même id partout, donc un POST rejoué ne crée pas de doublon.
-- - Dates en UTC (database.js force le fuseau +00:00). DATETIME(3) garde les
--   millisecondes : utile pour « la dernière écriture gagne » selon modifieLe.
-- - `force` est un mot réservé de MySQL : toujours l'écrire `force` (accents graves).
-- - Les CHECK reprennent les règles de validation du Livrable 1. Ils sont
--   appliqués par MySQL 8.0.16 et plus : la base refuse une donnée invalide
--   même si un validateur l'a laissée passer.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Utilisateur : un compte joueur.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Utilisateur (
  id             CHAR(36)     PRIMARY KEY,
  courriel       VARCHAR(255) NOT NULL UNIQUE,          -- courriel unique
  motDePasseHash VARCHAR(255) NOT NULL,                 -- bcrypt, jamais le mot de passe
  nomAffiche     VARCHAR(60)  NOT NULL,
  creeLe         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

-- -----------------------------------------------------------------------------
-- Session : ouverte par POST /auth/connexion (Utilisateur 1 → N Session).
-- Le téléphone garde le jeton ; le serveur n'en garde que le haché SHA-256
-- (64 caractères hexadécimaux). La déconnexion supprime la ligne.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Session (
  id            CHAR(36)    PRIMARY KEY,
  utilisateurId CHAR(36)    NOT NULL,
  jetonHash     CHAR(64)    NOT NULL UNIQUE,
  expireLe      DATETIME(3) NOT NULL,                   -- jeton expiré refusé
  creeLe        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (utilisateurId) REFERENCES Utilisateur (id) ON DELETE CASCADE,
  INDEX idxSessionUtilisateur (utilisateurId)
);

-- -----------------------------------------------------------------------------
-- PreferenceUtilisateur : thème choisi (Utilisateur 1 → 1, grâce au UNIQUE).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS PreferenceUtilisateur (
  id            CHAR(36) PRIMARY KEY,
  utilisateurId CHAR(36) NOT NULL UNIQUE,
  theme         ENUM ('PARCHEMIN', 'DONJON', 'ARCANE') NOT NULL DEFAULT 'PARCHEMIN',
  FOREIGN KEY (utilisateurId) REFERENCES Utilisateur (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Campagne : le « profil » choisi après la connexion (Utilisateur 1 → N Campagne).
-- Suppression LOGIQUE : supprime = TRUE (la campagne disparaît des listes, mais
-- un téléphone hors ligne peut encore synchroniser sans erreur de clé étrangère).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Campagne (
  id            CHAR(36)    PRIMARY KEY,
  utilisateurId CHAR(36)    NOT NULL,
  nom           VARCHAR(60) NOT NULL,
  description   TEXT,
  avatar        VARCHAR(20) NOT NULL,                   -- clé de AVATARS (mobile/constants)
  supprime      BOOLEAN     NOT NULL DEFAULT FALSE,
  creeLe        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  modifieLe     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT chkCampagneNom CHECK (CHAR_LENGTH(TRIM(nom)) BETWEEN 2 AND 60),
  FOREIGN KEY (utilisateurId) REFERENCES Utilisateur (id) ON DELETE CASCADE,
  -- Sert à « mes campagnes » ET à GET /sync?depuis= (changements depuis une date)
  INDEX idxCampagneUtilisateurModifie (utilisateurId, modifieLe)
);

-- -----------------------------------------------------------------------------
-- Personnage : fiche d'un personnage (Campagne 1 → N Personnage).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Personnage (
  id           CHAR(36)    PRIMARY KEY,
  campagneId   CHAR(36)    NOT NULL,
  nom          VARCHAR(40) NOT NULL,
  race         VARCHAR(40) NOT NULL,
  classe       VARCHAR(40) NOT NULL,
  niveau       TINYINT     NOT NULL,
  pvMax        SMALLINT    NOT NULL,
  pvActuels    SMALLINT    NOT NULL,
  `force`      TINYINT     NOT NULL,                    -- mot réservé : accents graves
  dexterite    TINYINT     NOT NULL,
  constitution TINYINT     NOT NULL,
  intelligence TINYINT     NOT NULL,
  sagesse      TINYINT     NOT NULL,
  charisme     TINYINT     NOT NULL,
  biographie   TEXT,
  creeLe       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  modifieLe    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  -- Règles du Livrable 1 (section 5)
  CONSTRAINT chkPersonnageNom    CHECK (CHAR_LENGTH(TRIM(nom)) BETWEEN 2 AND 40),
  CONSTRAINT chkPersonnageNiveau CHECK (niveau BETWEEN 1 AND 20),
  CONSTRAINT chkPersonnagePv     CHECK (pvMax >= 1 AND pvActuels BETWEEN 0 AND pvMax),
  CONSTRAINT chkPersonnageCaracteristiques CHECK (
    `force`      BETWEEN 1 AND 20 AND
    dexterite    BETWEEN 1 AND 20 AND
    constitution BETWEEN 1 AND 20 AND
    intelligence BETWEEN 1 AND 20 AND
    sagesse      BETWEEN 1 AND 20 AND
    charisme     BETWEEN 1 AND 20
  ),

  FOREIGN KEY (campagneId) REFERENCES Campagne (id) ON DELETE CASCADE,
  INDEX idxPersonnageCampagneModifie (campagneId, modifieLe)
);

-- -----------------------------------------------------------------------------
-- EntreeJournal : ce qui s'est passé pendant une session de jeu
-- (Personnage 1 → N EntreeJournal). Une entrée n'est pas modifiée après coup :
-- creeLe suffit pour la synchronisation.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS EntreeJournal (
  id           CHAR(36)     PRIMARY KEY,
  personnageId CHAR(36)     NOT NULL,
  titre        VARCHAR(100) NOT NULL,
  contenu      TEXT         NOT NULL,
  dateSession  DATE         NOT NULL,                   -- jour de la partie (AAAA-MM-JJ)
  creeLe       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT chkJournalTitre   CHECK (CHAR_LENGTH(TRIM(titre)) > 0),
  CONSTRAINT chkJournalContenu CHECK (CHAR_LENGTH(TRIM(contenu)) > 0),
  FOREIGN KEY (personnageId) REFERENCES Personnage (id) ON DELETE CASCADE,
  -- Le journal s'affiche du plus récent au plus ancien
  INDEX idxJournalPersonnageDate (personnageId, dateSession, creeLe)
);
