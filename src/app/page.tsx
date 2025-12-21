"use client";
import App from '@/app/app';
import './index.css'
import { Kurale } from "next/font/google"

const kurale = Kurale({
  weight: '400',
  subsets: ['cyrillic', 'cyrillic-ext']
});

export default function Home() {
  return (
    <html lang='ru'>
      <head>
        <meta charSet='UTF-8' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Year Card Generator</title>
        <meta name='description' content='New Year Card Generator' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={kurale.className}>
        <App />
      </body>
    </html>
  );
}
