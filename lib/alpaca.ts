// Uses global fetch (Node 18+/Next.js)

export interface Bar {
  t: string; // ISO time
  c: number; // close price
}

// Fetch weekly bars for SPY between ISO dates (YYYY-MM-DD)
export async function fetchSpyWeeklyBars(start: string, end: string) {
  const key = process.env.ALPACA_KEY_ID;
  const secret = process.env.ALPACA_SECRET_KEY;
  if (!key || !secret) {
    throw new Error('Alpaca API keys are not set in environment variables');
  }
  const url = `https://data.alpaca.markets/v2/stocks/SPY/bars?feed=iex&timeframe=1Week&start=${start}&end=${end}&adjustment=all&limit=1000`;
  const res = await fetch(url, {
    headers: {
      'APCA-API-KEY-ID': key,
      'APCA-API-SECRET-KEY': secret,
    },
  });
  if (!res.ok) {
    throw new Error(`Alpaca fetch failed: ${res.status}`);
  }
  const json = await res.json();
  const bars: Bar[] = json.bars;
  return bars.map(bar => ({
    time: Math.floor(new Date(bar.t).getTime() / 1000),
    value: bar.c,
  }));
} 