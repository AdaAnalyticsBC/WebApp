import { NextRequest, NextResponse } from 'next/server';
import { fetchSpyWeeklyBars } from '@/lib/alpaca';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start') ?? '2020-01-01';
  const end = searchParams.get('end') ?? new Date().toISOString().substring(0, 10);

  try {
    const bars = await fetchSpyWeeklyBars(start, end);
    return NextResponse.json({ bars });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 