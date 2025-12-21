import path from 'path';
import fs from 'fs/promises';
import type { Template } from '@/app/types';

export async function getCardTemplates(): Promise<Template[]> {
  const templatesDir = path.join(process.cwd(), 'public', 'templates');

  try {
    await fs.access(templatesDir);
  } catch (error) {
    console.error('Папка templates не найдена в public/templates!');
    return [];
  }
  const fileNames = await fs.readdir(templatesDir);

  const imageExtensions = ['.jpg', '.jpeg', '.png'];

  const templates: Template[] = fileNames
    .filter(fileName => {
      const ext = path.extname(fileName).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(fileName => {
      return {
        name: fileName,
        url: `/templates/${fileName}`
      };
    });

  return templates;
}
