import { NextRequest, NextResponse } from 'next/server';
import { getCardTemplates } from "@/lib/templates";
import { emailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient, email, templateId, cardImage } = body;

    const templates = await getCardTemplates();
    const template = templates.find(t => t.name === templateId);
    const templateName = template?.name || 'Неизвестный шаблон';

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
