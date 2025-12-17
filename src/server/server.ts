import express from 'express';
import cors from 'cors';
import path from 'path';
import { getCardTemplates } from './templates.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const templatesPath = path.join(process.cwd(), 'templates');
app.use('/templates', express.static(templatesPath));
console.log('🖼️  Templates:', templatesPath);

app.get('/api/templates', async (req, res) => {
  const templates = await getCardTemplates();
  res.json(templates);
});

app.post('/api/send-card', async (req, res) => {
  console.log('Отправка:', req.body);
  res.json({ success: true });
});

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(process.cwd(), 'dist/client');

  app.use(express.static(clientPath));
}


app.listen(PORT, () => {
  console.log(`🚀 Express: http://localhost:${PORT}`);
});
