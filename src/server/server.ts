import express from 'express';
import cors from 'cors';
import path from 'path';
import { getCardTemplates } from './templates.js';

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const templatesPath = path.join(process.cwd(), 'templates');
app.use('/templates', express.static(templatesPath));

app.get('/api/templates', async (req, res) => {
  try {
    const templates = await getCardTemplates();
    res.json(templates);
  } catch (error) {
    console.error('API templates error:', error);
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

app.post('/api/send-card', async (req, res) => {
  try {
    console.log('Отправка:', req.body);
    // TODO: логика отправки email
    res.json({ success: true });
  } catch (error) {
    console.error('Send card error:', error);
    res.status(500).json({ error: 'Failed to send card' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(process.cwd(), 'dist/client');
  console.log('📁 Client path:', clientPath);

  app.use(express.static(clientPath));
}

export default app;
