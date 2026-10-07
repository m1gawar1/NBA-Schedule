import { NextResponse } from "next/server";
import { fetchGamesByDate } from "@/lib/nba-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  try {
    const games = await fetchGamesByDate(date);
    return NextResponse.json({ date, games });
  } catch {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 502 });
  }
}
