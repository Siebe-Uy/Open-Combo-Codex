import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ cards: [] });
  }

  const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return NextResponse.json({ cards: [] });
  }

  const data = (await response.json()) as { data?: Array<{ name: string; type: string }> };
  const cards = data.data?.slice(0, 12).map((card) => ({ name: card.name, type: card.type })) ?? [];

  return NextResponse.json({ cards });
}
