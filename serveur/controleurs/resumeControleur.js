// Contrôleur du résumé de campagne. Responsable : Jayden.
// Route : GET /campagnes/:id/resume (déclarée dans routes/campagnesRoutes.js).
//
// Contrat avec le middleware authentifier (Sarragossa) : après lui,
// req.utilisateur.id contient l'id du compte connecté.
import { calculerResume } from '../services/resumeService.js';

export const resume = async (req, res, next) => {
  try {
    const resumeCampagne = await calculerResume(req.params.id, req.utilisateur.id);

    // Campagne absente OU d'un autre compte : même réponse, pour ne pas révéler qu'elle existe
    if (!resumeCampagne) {
      return res.status(404).json({ erreur: 'Campagne introuvable' });
    }

    res.status(200).json(resumeCampagne);
  } catch (erreur) {
    next(erreur); // → middleware/gestionErreurs.js (500)
  }
};
