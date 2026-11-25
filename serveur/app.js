import cors from 'cors';
import express from 'express';
import gestionErreurs from './middleware/gestionErreurs.js';
import authRoutes from './routes/authRoutes.js';
import campagnesRoutes from './routes/campagnesRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import personnagesRoutes from './routes/personnagesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/sante', (req, res) => {
  res.status(200).json({ statut: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/campagnes', campagnesRoutes);
// Journal AVANT /personnages : sinon personnagesRoutes intercepte /personnages/:id/journal
app.use('/personnages/:id/journal', journalRoutes);
app.use('/personnages', personnagesRoutes);

app.use(gestionErreurs);

export default app;
