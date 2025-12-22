'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getCardTemplates } from "@/lib/templates";
import type { FormData } from "@/app/types"
import { generateImage } from '@/lib/image';
import { convertBufferToWebP } from "@/lib/utils/imageConverter";

export async function POST(req: NextRequest) {
  try {
    const { sender, recipient, email, templateId } = await req.json();

    const templates = await getCardTemplates();
    const template = templates.find(t => t.name === templateId);
    if (!template) {
      throw new Error('Шаблон не найден');
    }

    const imageData: FormData = {
      senderName: sender,
      recipientName: recipient,
      recipientEmail: email,
      noEmail: false,
      message: ''
    };
    const cardImageBuffer = await generateImage(imageData, template);
    const bytes = await cardImageBuffer.arrayBuffer();
    const image = await convertBufferToWebP(Buffer.from(bytes));

    return NextResponse.json(image.toJSON());
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
