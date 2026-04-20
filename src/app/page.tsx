import { fetchNBASchedule } from "@/lib/nba-data";
import { getEffectiveDateKey } from "@/lib/utils";
import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NBA Tip-Off Time | NBA全チーム日程を日本時間で確認",
  description: "NBA全30チームの試合日程を日本時間で確認。Googleカレンダーへのワンクリック追加対応。",
};

export default async function Home() {
  // today in JST
  const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const allGames = await fetchNBASchedule();
  const todayGames = allGames
    .filter((g) => getEffectiveDateKey(g) === todayJST)
    .sort((a, b) => new Date(a.gameDateTimeUTC).getTime() - new Date(b.gameDateTimeUTC).getTime());

  return <HomeClient initialGames={todayGames} initialDate={todayJST} />;
}
