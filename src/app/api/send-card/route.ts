import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Отправка:', body);
    // TODO: Перенесите сюда вашу логику отправки email (nodemailer)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send card error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to send card' }),
      { status: 500 }
    );
  }
}
