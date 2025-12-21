import App from '@/app/app';
import './index.css'
import { Kurale } from "next/font/google"

const kurale = Kurale({
  weight: ["400"],
  subsets: ['cyrillic']
});


export default function Home() {
  return (
    <html lang='ru' className={kurale.className}>
      <head>
        <title>New Year Card Generator</title>
        <meta name='description' content='New Year Card Generator' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
