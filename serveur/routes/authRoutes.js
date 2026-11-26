import express from 'express';
import {
  connecter,
  creerUtilisateur,
  trouverUtilisateurParJeton,
  deconnecter,
} from '../services/authService.js';
 
const router = express.Router();

router.post('/inscription', async (req, res) => {
  try {
    const { courriel, motDePasse, nomAffiche } = req.body;
 
    if (!courriel || !motDePasse || !nomAffiche) {
      return res.status(400).json({
        erreur: 'Tous les champs sont obligatoires',
      });
    }
 
    const utilisateur = await creerUtilisateur({
      courriel,
      motDePasse,
      nomAffiche,
    });
 
    res.status(201).json(utilisateur);
  } catch (erreur) {
    console.error(erreur);
 
    if (erreur.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erreur: 'Cette adresse courriel est déjà utilisée',
      });
    }
 
    res.status(500).json({
      erreur: 'Erreur serveur',
    });
  }
});

router.post('/connexion', async (req, res) => {
  try {
    const { courriel, motDePasse } = req.body;
 
    if (!courriel || !motDePasse) {
      return res.status(400).json({
        erreur: 'Courriel et mot de passe obligatoires',
      });
    }
 
    const resultat = await connecter(courriel, motDePasse);
 
    if (!resultat) {
      return res.status(401).json({
        erreur: 'Courriel ou mot de passe invalide',
      });
    }
 
    res.status(200).json(resultat);
  } catch (erreur) {
    res.status(500).json({
      erreur: 'Erreur serveur',
    });
  }
});

router.get('/session', async (req, res) => {
  try {
    const autorisation = req.headers.authorization;
 
    if (!autorisation || !autorisation.startsWith('Bearer ')) {
      return res.status(401).json({
        erreur: 'Authentification requise',
      });
    }
 
    const jeton = autorisation.substring(7);
    const utilisateur = await trouverUtilisateurParJeton(jeton);
 
    if (!utilisateur) {
      return res.status(401).json({
        erreur: 'Session invalide ou expirée',
      });
    }
 
    res.status(200).json(utilisateur);
  } catch (erreur) {
    res.status(500).json({
      erreur: 'Erreur serveur',
    });
  }
});

router.post('/deconnexion', async (req, res) => {
  try {
    const autorisation = req.headers.authorization;
 
    if (!autorisation || !autorisation.startsWith('Bearer ')) {
      return res.status(401).json({
        erreur: 'Authentification requise',
      });
    }
 
    const jeton = autorisation.substring(7);
 
    await deconnecter(jeton);
 
    res.status(200).json({
      message: 'Déconnexion réussie',
    });
  } catch (erreur) {
    console.error(erreur);
    
    res.status(500).json({
      erreur: 'Erreur serveur',
    });
  }
});
 
export default router;