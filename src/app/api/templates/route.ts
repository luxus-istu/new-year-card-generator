import { NextResponse } from 'next/server';
import { getCardTemplates } from "@/lib/templates";

export async function GET() {
  try {
    const templates = await getCardTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('API templates error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to load templates' }),
      { status: 500 }
    );
  }
}
