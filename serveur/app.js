import cors from 'cors';
import express from 'express';
import gestionErreurs from './middleware/gestionErreurs.js';
import authRoutes from './routes/authRoutes.js';
import campagnesRoutes from './routes/campagnesRoutes.js';
import personnagesRoutes from './routes/personnagesRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/sante', (req, res) => {
  res.status(200).json({ statut: 'ok' });
});

app.use('/campagnes', campagnesRoutes);
app.use('/personnages', personnagesRoutes);

app.use(gestionErreurs);


export default app;
