"use client";
import App from '@/app/app';
import './index.css'
import { Kurale } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const kurale = Kurale({
  weight: '400',
  subsets: ['cyrillic'] as const
});

export default function Home() {
  return (
    <html lang='ru'>
      <head>
        <meta charSet='UTF-8' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Year Card Generator</title>
        <meta name='description' content='New Year Card Generator' />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={kurale.className}>
        <SpeedInsights />
        <Analytics />
        <App />
      </body>
    </html>
  );
}
