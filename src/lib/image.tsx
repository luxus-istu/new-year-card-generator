import type { Template, FormData } from "@/app/types";
import { ImageResponse } from 'next/og';
import sharp from "sharp";
import path from "path";
import { readFile } from "fs/promises";

export async function generateImage(data: FormData, template: Template): Promise<ImageResponse> {
  const backgroundPath = path.join(process.cwd(), 'public', template.url.replace(/^\//, ''));
  const notePath = path.join(process.cwd(), 'public', 'note.png');
  const fontPath = path.join(process.cwd(), 'public', 'Kurale-Regular.ttf');

  const [backgroundBuffer, noteBuffer, fontBuffer] = await Promise.all([
    readFile(backgroundPath),
    readFile(notePath),
    readFile(fontPath),
  ]);

  // Размеры фона
  const backgroundMetadata = await sharp(backgroundBuffer).metadata();
  const width = backgroundMetadata.width!;
  const height = backgroundMetadata.height!;

  const backgroundSrc = `data:image/png;base64,${backgroundBuffer.toString('base64')}`;
  const noteSrc = `data:image/png;base64,${noteBuffer.toString('base64')}`;

  // Размер записки (~38% ширины фона)
  const noteBaseWidth = Math.round(width * 0.38);
  const noteMetadata = await sharp(noteBuffer).metadata();
  const noteAspectRatio = noteMetadata.height! / noteMetadata.width!;
  const noteWidth = noteBaseWidth;
  const noteHeight = Math.round(noteWidth * noteAspectRatio);

  // Случайный поворот
  const randomRotation = (Math.random() * 16 - 8).toFixed(2);
  const edgePadding = Math.round(width * 0.015);

  const noteStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: edgePadding,
    right: edgePadding,
    transform: `rotate(${randomRotation}deg)`,
  };

  // Данные
  const senderName = data.senderName.trim().slice(0, 50) || 'Аноним';
  const recipientName = data.recipientName.trim().slice(0, 50) || 'Другу';
  const recipientEmail = data.recipientEmail.trim().slice(0, 100);

  // === ОДИНАКОВЫЙ АДАПТИВНЫЙ ШРИФТ ДЛЯ ВСЕГО ТЕКСТА ===
  const uniformFontSize = Math.round(noteWidth * 0.07); // чуть меньше, чтобы длинный текст влезал
  const lineThickness = Math.round(noteWidth * 0.007);
  const lineWidthPercent = '65%';

  // Адаптивные отступы
  const paddingTopBottom = `${Math.round(noteHeight * 0.18)}px ${Math.round(noteWidth * 0.12)}px ${Math.round(noteHeight * 0.15)}px ${Math.round(noteWidth * 0.09)}px`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundImage: `url(${backgroundSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <img
          src={noteSrc}
          width={noteWidth}
          height={noteHeight}
          style={noteStyle}
        />

        <div
          style={{
            ...noteStyle,
            width: noteWidth,
            height: noteHeight,
            padding: paddingTopBottom,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            fontFamily: '"Kurale-Regular"',
            fontSize: uniformFontSize,
            fontWeight: 'normal',
            color: '#4a2c1b',
            textShadow: '1px 1px 3px rgba(255,255,255,0.8)',
            pointerEvents: 'none' as const,
            lineHeight: '1.45', // чуть больше, чтобы текст "дышал"
            textAlign: 'left' as const,
          }}
        >
          {/* От кого */}
          <span style={{ marginBottom: '12px' }}>От кого</span>
          <span style={{
            marginBottom: '35px',
            maxWidth: '95%',
            wordBreak: 'break-word' as const
          }}>
            {senderName}
          </span>
          <div style={{
            height: lineThickness,
            backgroundColor: '#6b4a3a',
            width: lineWidthPercent,
            marginBottom: '60px' // ← БОЛЬШЕ ОТСТУП ПОСЛЕ ЛИНИИ
          }} />

          {/* Кому */}
          <span style={{ marginBottom: '12px' }}>Кому</span>
          <span style={{
            marginBottom: '35px',
            maxWidth: '95%',
            wordBreak: 'break-word' as const
          }}>
            {recipientName}
          </span>
          <div style={{
            height: lineThickness,
            backgroundColor: '#6b4a3a',
            width: lineWidthPercent,
            marginBottom: '60px' // ← БОЛЬШЕ ОТСТУП
          }} />

          {/* Почта */}
          <span style={{ marginBottom: '12px' }}>Почта</span>
          <span
            style={{
              maxWidth: '95%',
              wordBreak: 'break-all' as const,
              marginBottom: '35px',
              fontSize: `${Math.round(noteWidth * 0.06)}`
            }}
          >
            {recipientEmail}
          </span>
          <div style={{
            height: lineThickness,
            backgroundColor: '#6b4a3a',
            width: lineWidthPercent
          }} />
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'Kurale-Regular',
          data: fontBuffer,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
