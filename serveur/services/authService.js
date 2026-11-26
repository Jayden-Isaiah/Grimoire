import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import pool from '../database.js';
 
const DUREE_SESSION_JOURS = 30;

function hacherJeton(jeton) {
  return crypto.createHash('sha256').update(jeton).digest('hex');
}

export async function connecter(courriel, motDePasse) {
  const [utilisateurs] = await pool.query(
    `SELECT id, courriel, motDePasseHash, nomAffiche
     FROM Utilisateur
     WHERE courriel = ?`,
    [courriel.toLowerCase().trim()]
  );
 
  if (utilisateurs.length === 0) {
    return null;
  }
 
  const utilisateur = utilisateurs[0];

  console.log('Courriel trouvé :', utilisateur.courriel);
    console.log('Mot de passe reçu :', motDePasse);
    console.log('Hash enregistré :', utilisateur.motDePasseHash);
 
  const motDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.motDePasseHash
  );

  console.log('Mot de passe valide:' , motDePasseValide);
 
  if (!motDePasseValide) {
    return null;
  }
 
  const jeton = crypto.randomBytes(32).toString('hex');
  const jetonHash = hacherJeton(jeton);
  const sessionId = crypto.randomUUID();
 
  const expireLe = new Date();
  expireLe.setDate(expireLe.getDate() + DUREE_SESSION_JOURS);
 
  await pool.query(
    `INSERT INTO Session (id, utilisateurId, jetonHash, expireLe)
     VALUES (?, ?, ?, ?)`,
    [sessionId, utilisateur.id, jetonHash, expireLe]
  );
 
  return {
    jeton,
    utilisateur: {
      id: utilisateur.id,
      courriel: utilisateur.courriel,
      nomAffiche: utilisateur.nomAffiche
    }
  };
}

export async function trouverUtilisateurParJeton(jeton) {
  if (!jeton) {
    return null;
  }
 
  const jetonHash = hacherJeton(jeton);
 
  const [resultats] = await pool.query(
    `SELECT u.id, u.courriel, u.nomAffiche
     FROM Session s
     INNER JOIN Utilisateur u ON u.id = s.utilisateurId
     WHERE s.jetonHash = ?
     AND s.expireLe > NOW()`,
    [jetonHash]
  );
 
  if (resultats.length === 0) {
    return null;
  }
 
  return resultats[0];
}

export async function deconnecter(jeton) {
  if (!jeton) {
    return;
  }
 
  await pool.query(
    'DELETE FROM Session WHERE jetonHash = ?',
    [hacherJeton(jeton)]
  );
}

export async function creerUtilisateur({
  courriel,
  motDePasse,
  nomAffiche
}) {
  const id = crypto.randomUUID();
  const preferenceId = crypto.randomUUID();
 
  const courrielNormalise = courriel.toLowerCase().trim();
  const nomNormalise = nomAffiche.trim();
 
  const motDePasseHash = await bcrypt.hash(motDePasse, 12);
 
  await pool.query(
    `INSERT INTO Utilisateur
     (id, courriel, motDePasseHash, nomAffiche)
     VALUES (?, ?, ?, ?)`,
    [id, courrielNormalise, motDePasseHash, nomNormalise]
  );
 
  await pool.query(
    `INSERT INTO PreferenceUtilisateur (id, utilisateurId)
     VALUES (?, ?)`,
    [preferenceId, id]
  );
 
  return {
    id,
    courriel: courrielNormalise,
    nomAffiche: nomNormalise
  };
}