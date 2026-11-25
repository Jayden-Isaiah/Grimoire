// Contrôleur du journal de session. Responsable : Jayden.
// Routes (routes/journalRoutes.js) :
//   GET  /personnages/:id/journal  → 200 + tableau ; 404
//   POST /personnages/:id/journal  → 201 + entrée ; 200 si déjà reçue ; 400 ; 404 ; 409
//
// req.params.id = id du PERSONNAGE. req.utilisateur.id est fourni par le
// middleware authentifier (Sarragossa).
import { ajouterEntree, listerEntrees } from '../services/journalService.js';
import { validerEntreeJournal } from '../validateurs/journalValidateur.js';

const PERSONNAGE_INTROUVABLE = { erreur: 'Personnage introuvable' };

export const lister = async (req, res, next) => {
  try {
    const entrees = await listerEntrees(req.params.id, req.utilisateur.id);
    if (!entrees) return res.status(404).json(PERSONNAGE_INTROUVABLE);

    res.status(200).json(entrees);
  } catch (erreur) {
    next(erreur);
  }
};

export const ajouter = async (req, res, next) => {
  try {
    // 1. Validation AVANT tout accès à la base
    const { valide, erreurs } = validerEntreeJournal(req.body);
    if (!valide) {
      return res.status(400).json({ erreur: 'Données invalides', details: erreurs });
    }

    // 2. Enregistrement (avec contrôle du propriétaire)
    const resultat = await ajouterEntree(req.params.id, req.body, req.utilisateur.id);

    if (!resultat) return res.status(404).json(PERSONNAGE_INTROUVABLE);
    if (resultat.conflit) {
      return res.status(409).json({ erreur: 'Cet identifiant est déjà utilisé par une autre entrée' });
    }

    // 201 = créée maintenant ; 200 = le téléphone l'avait déjà envoyée
    res.status(resultat.dejaRecue ? 200 : 201).json(resultat.entree);
  } catch (erreur) {
    next(erreur);
  }
};
