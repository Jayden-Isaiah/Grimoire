// Tests du journal de session (validateur, service, contrôleur). Responsable : Jayden.
// Nécessite MySQL démarré (base grimoire_test, créée automatiquement).
import request from 'supertest';
import { ajouter, lister } from '../controleurs/journalControleur.js';
import { estDateValide, validerEntreeJournal } from '../validateurs/journalValidateur.js';
import {
  creerAppTest, insererCompteEtCampagne, insererPersonnage, nouvelId, pool,
  preparerBaseTest, supprimerComptes,
} from './outils/donneesTest.js';

const entreeValide = (champs = {}) => ({
  id: nouvelId(),
  titre: 'Le pont de glace',
  contenu: 'Aldric a tenu le pont seul.',
  dateSession: '2026-11-08',
  ...champs,
});

// ---------------------------------------------------------------------------
// Validateur : fonction pure, aucun accès à la base
// ---------------------------------------------------------------------------
describe('validerEntreeJournal', () => {
  it('accepte une entrée valide', () => {
    expect(validerEntreeJournal(entreeValide())).toEqual({ valide: true, erreurs: {} });
  });

  it('refuse un titre ou un contenu vide (espaces seulement)', () => {
    const { valide, erreurs } = validerEntreeJournal(entreeValide({ titre: '   ', contenu: '' }));

    expect(valide).toBe(false);
    expect(erreurs).toHaveProperty('titre');
    expect(erreurs).toHaveProperty('contenu');
  });

  it('refuse un titre de plus de 100 caractères', () => {
    const { erreurs } = validerEntreeJournal(entreeValide({ titre: 'a'.repeat(101) }));
    expect(erreurs.titre).toMatch(/100/);
  });

  it('refuse un id qui n’est pas un UUID', () => {
    expect(validerEntreeJournal(entreeValide({ id: 'e1' })).erreurs).toHaveProperty('id');
  });

  it('refuse un corps de requête absent', () => {
    expect(validerEntreeJournal(undefined).valide).toBe(false);
  });
});

describe('estDateValide', () => {
  it.each(['2026-11-08', '2024-02-29'])('accepte %s', (date) => {
    expect(estDateValide(date)).toBe(true);
  });

  it.each(['2026-02-30', '2025-02-29', '2026-13-01', '08/11/2026', '', null])('refuse %s', (date) => {
    expect(estDateValide(date)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// API : contrôleur + service + MySQL
// ---------------------------------------------------------------------------
describe('/personnages/:id/journal', () => {
  let joueur;
  let rival;
  let personnageId;
  let utilisateurConnecte;

  const app = creerAppTest(
    () => utilisateurConnecte,
    (a) => {
      a.get('/personnages/:id/journal', lister);
      a.post('/personnages/:id/journal', ajouter);
    },
  );
  const url = () => `/personnages/${personnageId}/journal`;

  beforeAll(async () => {
    await preparerBaseTest();
    joueur = await insererCompteEtCampagne();
    rival = await insererCompteEtCampagne();
    personnageId = await insererPersonnage(joueur.campagneId, { nom: 'Aldric' });
  });

  beforeEach(() => {
    utilisateurConnecte = joueur.utilisateurId;
  });

  afterAll(async () => {
    await supprimerComptes([joueur.utilisateurId, rival.utilisateurId]);
    await pool.end();
  });

  it('POST crée une entrée valide (201)', async () => {
    const entree = entreeValide({ titre: '  Titre avec espaces  ' });
    const reponse = await request(app).post(url()).send(entree);

    expect(reponse.status).toBe(201);
    expect(reponse.body).toMatchObject({
      id: entree.id,
      personnageId,
      titre: 'Titre avec espaces', // espaces retirés
      dateSession: '2026-11-08',
    });
  });

  it('POST ne duplique pas une entrée envoyée deux fois (200)', async () => {
    const entree = entreeValide();
    await request(app).post(url()).send(entree);
    const deuxieme = await request(app).post(url()).send(entree); // rejeu de la synchro

    expect(deuxieme.status).toBe(200);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM EntreeJournal WHERE id = ?', [
      entree.id,
    ]);
    expect(total).toBe(1);
  });

  it('POST refuse des données invalides (400) avec le détail par champ', async () => {
    const reponse = await request(app).post(url()).send(entreeValide({ titre: '', dateSession: '2026-02-30' }));

    expect(reponse.status).toBe(400);
    expect(reponse.body.details).toHaveProperty('titre');
    expect(reponse.body.details).toHaveProperty('dateSession');
  });

  it("POST répond 404 pour le personnage d'un autre compte", async () => {
    utilisateurConnecte = rival.utilisateurId;
    const reponse = await request(app).post(url()).send(entreeValide());

    expect(reponse.status).toBe(404);
  });

  it('POST répond 409 si l’id est déjà utilisé pour un autre personnage', async () => {
    const entree = entreeValide();
    await request(app).post(url()).send(entree);

    const autrePersonnage = await insererPersonnage(joueur.campagneId, { nom: 'Lyra' });
    const reponse = await request(app).post(`/personnages/${autrePersonnage}/journal`).send(entree);

    expect(reponse.status).toBe(409);
  });

  it('GET liste les entrées, de la session la plus récente à la plus ancienne', async () => {
    await request(app).post(url()).send(entreeValide({ titre: 'Futur proche', dateSession: '2026-12-01' }));
    const reponse = await request(app).get(url());

    expect(reponse.status).toBe(200);
    expect(reponse.body[0].titre).toBe('Futur proche');
    const dates = reponse.body.map((e) => e.dateSession);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("GET répond 404 pour le personnage d'un autre compte", async () => {
    utilisateurConnecte = rival.utilisateurId;
    expect((await request(app).get(url())).status).toBe(404);
  });
});
