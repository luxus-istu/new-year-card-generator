import path from "path"
import fs from "fs/promises"
import type { Template, TemplateMeta } from '@new-year-card-generator/shared';

export async function getCardTemplates(): Promise<Template[]> {
  const templatesDir = path.join(process.cwd(), 'templates');
  const entries = await fs.readdir(templatesDir, { withFileTypes: true });
  const templates: Template[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const folderName = entry.name;
    const jsonPath = path.join(templatesDir, folderName, 'template.json');

    try {
      const jsonRaw = await fs.readFile(jsonPath, 'utf-8');
      const meta: TemplateMeta = JSON.parse(jsonRaw);

      templates.push({
        name: meta.name,
        preview: `/templates/${folderName}/${meta.preview || meta.image}`,
        fullImage: `/templates/${folderName}/${meta.image}`,
        initialsX: meta.initialsX,
        initialsY: meta.initialsY,
        initialsFontSize: meta.initialsFontSize,
        initialsColor: meta.initialsColor,
        recipientX: meta.recipientX,
        recipientY: meta.recipientY,
        recipientFontSize: meta.recipientFontSize,
        recipientColor: meta.recipientColor
      });
    } catch (err) {
      console.error(`Ошибка в папке ${folderName}:`, err);
    }
  }
  return templates;
}
