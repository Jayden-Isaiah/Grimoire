// Tests du calcul du résumé (services/resumeService.js + contrôleur). Responsable : Jayden.
// Nécessite MySQL démarré (base grimoire_test, créée automatiquement).
import request from 'supertest';
import { resume } from '../controleurs/resumeControleur.js';
import { calculerResume } from '../services/resumeService.js';
import {
  creerAppTest, insererCompteEtCampagne, insererPersonnage, nouvelId, pool,
  preparerBaseTest, supprimerComptes,
} from './outils/donneesTest.js';

let joueur; // { utilisateurId, campagneId } avec 3 personnages
let vide; // compte dont la campagne n'a aucun personnage
let utilisateurConnecte;

const app = creerAppTest(
  () => utilisateurConnecte,
  (a) => a.get('/campagnes/:id/resume', resume),
);

beforeAll(async () => {
  await preparerBaseTest();

  joueur = await insererCompteEtCampagne();
  await insererPersonnage(joueur.campagneId, { nom: 'Aldric', classe: 'Guerrier', niveau: 3 });
  await insererPersonnage(joueur.campagneId, { nom: 'Lyra', classe: 'Magicienne', niveau: 3 });
  const borin = await insererPersonnage(joueur.campagneId, {
    nom: 'Borin', classe: 'Clerc', niveau: 2, pvMax: 19, pvActuels: 0,
  });

  // Deux entrées : la plus récente (dateSession) doit être choisie
  await pool.query(
    `INSERT INTO EntreeJournal (id, personnageId, titre, contenu, dateSession) VALUES
       (?, ?, 'Ancienne', 'Texte', '2026-11-01'),
       (?, ?, 'Récente', 'Texte', '2026-11-15')`,
    [nouvelId(), borin, nouvelId(), borin],
  );

  vide = await insererCompteEtCampagne();
});

afterAll(async () => {
  await supprimerComptes([joueur.utilisateurId, vide.utilisateurId]);
  await pool.end(); // sinon Jest attend la fermeture des connexions
});

describe('calculerResume (service)', () => {
  it('calcule le total, le niveau moyen, les KO, les classes et la dernière entrée', async () => {
    const r = await calculerResume(joueur.campagneId, joueur.utilisateurId);

    expect(r.nombrePersonnages).toBe(3);
    expect(r.niveauMoyen).toBe(2.7); // (3 + 3 + 2) / 3, comme mobile/utils/resume.js
    expect(r.personnagesKo).toBe(1);
    expect(r.repartitionClasses).toEqual([
      { classe: 'Clerc', nombre: 1 },
      { classe: 'Guerrier', nombre: 1 },
      { classe: 'Magicienne', nombre: 1 },
    ]);
    expect(r.derniereEntreeJournal).toMatchObject({
      titre: 'Récente',
      dateSession: '2026-11-15',
      personnageNom: 'Borin',
    });
  });

  it('retourne des zéros pour une campagne sans personnage', async () => {
    expect(await calculerResume(vide.campagneId, vide.utilisateurId)).toEqual({
      nombrePersonnages: 0,
      niveauMoyen: 0,
      personnagesKo: 0,
      repartitionClasses: [],
      derniereEntreeJournal: null,
    });
  });

  it("retourne null pour la campagne d'un autre compte", async () => {
    expect(await calculerResume(joueur.campagneId, vide.utilisateurId)).toBeNull();
  });

  it('retourne null pour une campagne supprimée', async () => {
    await pool.query('UPDATE Campagne SET supprime = TRUE WHERE id = ?', [vide.campagneId]);
    expect(await calculerResume(vide.campagneId, vide.utilisateurId)).toBeNull();
    await pool.query('UPDATE Campagne SET supprime = FALSE WHERE id = ?', [vide.campagneId]);
  });
});

describe('GET /campagnes/:id/resume', () => {
  it('répond 200 avec le résumé du propriétaire', async () => {
    utilisateurConnecte = joueur.utilisateurId;
    const reponse = await request(app).get(`/campagnes/${joueur.campagneId}/resume`);

    expect(reponse.status).toBe(200);
    expect(reponse.body.nombrePersonnages).toBe(3);
  });

  it("répond 404 pour la campagne d'un autre compte (sans révéler qu'elle existe)", async () => {
    utilisateurConnecte = vide.utilisateurId;
    const reponse = await request(app).get(`/campagnes/${joueur.campagneId}/resume`);

    expect(reponse.status).toBe(404);
    expect(reponse.body.erreur).toBe('Campagne introuvable');
  });
});
