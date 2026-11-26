// Routes du journal de session. Responsable : Jayden.
// Monté dans app.js sur /personnages/:id/journal (AVANT /personnages).
import express from 'express';
import { ajouter, lister } from '../controleurs/journalControleur.js';
import authentifier from '../middleware/authentifier.js';

// mergeParams : donne accès au :id déclaré dans app.js (l'id du personnage)
const router = express.Router({ mergeParams: true });

router.use(authentifier);
router.get('/', lister);
router.post('/', ajouter);

export default router;
