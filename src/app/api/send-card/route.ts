'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getCardTemplates } from "@/lib/templates";
import { emailService } from "@/lib/email";
import type { FormData } from "@/app/types"
import { generateImage } from '@/lib/image';
import Sharp from "sharp";

async function convertBufferToWebP(
  inputBuffer: Buffer,
  options?: Sharp.WebpOptions
): Promise<Buffer> {
  return await Sharp(inputBuffer)
    .webp(options)
    .toBuffer();
}


export async function POST(req: NextRequest) {
  try {
    const { sender, recipient, email, templateId, message, captchaToken } = await req.json();
    if (!captchaToken) {
      return Response.json(
        { error: 'Отсутствует токен капчи' },
        { status: 400 }
      );
    }

    const SERVER_KEY = process.env.SMART_CAPTCHA_SERVER_KEY;
    if (!SERVER_KEY) {
      console.error('SMART_CAPTCHA_SERVER_KEY не настроен');
      return Response.json(
        { error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      );
    }
    const headersList = req.headers;
    const clientIp = headersList.get("x-forwarded-for");

    const VERIFY_URL = 'https://smartcaptcha.yandexcloud.net/validate';

    const params = new URLSearchParams();
    params.append('secret', SERVER_KEY);
    params.append('token', captchaToken);

    if (clientIp) {
      params.append('ip', clientIp);
    }

    const verificationResponse = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const verificationResult = await verificationResponse.json();

    if (verificationResult.status !== 'ok') {
      console.error('Ошибка проверки капчи:', verificationResult);
      return Response.json(
        { error: 'Проверка "Я не робот" не пройдена. Попробуйте еще раз.' },
        { status: 400 }
      );
    }

    const templates = await getCardTemplates();
    const template = templates.find(t => t.name === templateId);
    if (!template) {
      throw new Error('Шаблон не найден');
    }
    const templateName = template.name;

    const imageData: FormData = {
      senderName: sender,
      recipientName: recipient,
      recipientEmail: email,
      noEmail: false,
      message: message
    };
    const cardImageBuffer = await generateImage(imageData, template);
    const bytes = await cardImageBuffer.arrayBuffer();
    const image = await convertBufferToWebP(Buffer.from(bytes));

    const result = await emailService.sendGreetingCard({
      to: email,
      recipient,
      templateName,
      cardImage: image,
      message: imageData.message
    });
    if (result.success) {
      console.log('✅ Email отправлен:', result.message);
      return NextResponse.json({ success: true });
    } else {
      console.error('❌ Email ошибка:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Send card error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send card'
      },
      { status: 500 }
    );
  }
}
