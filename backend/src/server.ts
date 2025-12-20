import express from 'express';
import cors from 'cors';
import path from 'path';
import { getCardTemplates } from './templates.js';
import { emailService } from './email.js';

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
    const { recipient, email, templateId, cardImage } = req.body;

    const templates = await getCardTemplates();
    const template = templates.find(t => t.name === templateId);
    const templateName = template?.name || 'Неизвестный шаблон';

    const result = await emailService.sendGreetingCard({
      to: email,
      recipient,
      templateName,
      cardImage,
    });

    if (result.success) {
      console.log('✅ Email отправлен:', result.message);
      res.json({ success: true });
    } else {
      console.error('❌ Email ошибка:', result.error);
      res.status(500).json({ success: false, error: result.error });
    }

  } catch (error: any) {
    console.error('❌ Send card error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send card'
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(process.cwd(), 'dist/client');
  console.log('📁 Client path:', clientPath);

  app.use(express.static(clientPath));
}

if (process.env.NODE_ENV === 'development') {
  const clientPath = path.join(process.cwd(), 'dist/client');
  console.log('📁 Client path:', clientPath);

  app.use(express.static(clientPath));
  app.listen(3000, () => {
    console.log(`🚀 Сервер запущен на http://localhost:3000`);
  });
}


export default app;
