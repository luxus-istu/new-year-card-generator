import type { Template, FormData } from "@/app/types";
import { ImageResponse } from 'next/og';
import sharp from "sharp";
import path from "path";
import { readFile } from "fs/promises";

export async function generateImage(data: FormData, template: Template): Promise<ImageResponse> {
  const backgroundPath = path.join(process.cwd(), 'public', template.url.replace(/^\//, ''));
  const notePath = path.join(process.cwd(), 'public', 'note.png');
  const fontPath = path.join(process.cwd(), 'public', 'Kurale-Regular.ttf'); // ← замени на свой шрифт

  const [backgroundBuffer, noteBuffer, fontBuffer] = await Promise.all([
    readFile(backgroundPath),
    readFile(notePath),
    readFile(fontPath),
  ]);

  // Оригинальные размеры фона
  const backgroundMetadata = await sharp(backgroundBuffer).metadata();
  const width = backgroundMetadata.width!;
  const height = backgroundMetadata.height!;

  const backgroundSrc = `data:image/png;base64,${backgroundBuffer.toString('base64')}`;
  const noteSrc = `data:image/png;base64,${noteBuffer.toString('base64')}`;

  // Адаптивный размер записки (~38% от ширины)
  const noteBaseWidth = Math.round(width * 0.38);
  const noteMetadata = await sharp(noteBuffer).metadata();
  const noteAspectRatio = noteMetadata.height! / noteMetadata.width!;
  const noteWidth = noteBaseWidth;
  const noteHeight = Math.round(noteWidth * noteAspectRatio);

  // Случайный поворот (±8°)
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
        {/* Записка */}
        <img
          src={noteSrc}
          width={noteWidth}
          height={noteHeight}
          style={noteStyle}
        />

        {/* Текст — ещё немного опущены вторая и третья строки */}
        <div
          style={{
            ...noteStyle,
            width: noteWidth,
            height: noteHeight,
            padding: '18% 12% 12% 12%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            fontSize: `${Math.round(width * 0.02)}px`,
            fontFamily: '"Kurale-Regular"',
            color: '#502929',
            textShadow: '1px 1px 3px rgba(255,255,255,0.7)',
            pointerEvents: 'none',
          }}
        >
          {/* Отправитель — ближе к верху */}
          <span style={{ marginTop: '6%' }}>{senderName}</span>

          {/* Получатель — опущен чуть ниже предыдущего варианта */}
          <span style={{ marginTop: '10%' }}>{recipientName}</span>

          {/* Email — тоже опущен ещё немного */}
          <span
            style={{
              fontSize: `${Math.round(width * 0.025)}px`,
              wordBreak: 'break-all',
              marginTop: '14%',
            }}
          >
            {recipientEmail}
          </span>
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
