import { NextRequest, NextResponse } from 'next/server';
import { getCardTemplates } from "@/lib/templates";
import { emailService } from "@/lib/email";
import type { FormData } from "@/app/types"
import { generateImage } from '@/lib/image';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, recipient, email, templateId } = body;
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
    };
    const cardImageBuffer = await generateImage(imageData, template);
    const bytes = await cardImageBuffer.arrayBuffer();
    const cardImage = Buffer.from(bytes);

    const result = await emailService.sendGreetingCard({
      to: email,
      recipient,
      templateName,
      cardImage,
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
