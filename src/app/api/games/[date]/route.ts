import { NextResponse } from "next/server";
import { fetchNBASchedule } from "@/lib/nba-data";
import { getEffectiveDateKey } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const allGames = await fetchNBASchedule();
  const games = allGames
    .filter((g) => getEffectiveDateKey(g) === date)
    .sort(
      (a, b) =>
        new Date(a.gameDateTimeUTC).getTime() -
        new Date(b.gameDateTimeUTC).getTime()
    );

  return NextResponse.json({ date, games });
}
