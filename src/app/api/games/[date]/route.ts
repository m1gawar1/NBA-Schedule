import { NextResponse } from "next/server";
import { fetchNBASchedule } from "@/lib/nba-data";

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
    .filter((g) => {
      const jst = new Date(new Date(g.gameDateTimeUTC).getTime() + 9 * 60 * 60 * 1000);
      return jst.toISOString().slice(0, 10) === date;
    })
    .sort(
      (a, b) =>
        new Date(a.gameDateTimeUTC).getTime() -
        new Date(b.gameDateTimeUTC).getTime()
    );

  return NextResponse.json({ date, games });
}
