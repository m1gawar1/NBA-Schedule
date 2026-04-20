import { fetchWeekGames } from "@/lib/nba-data";
import WeekSchedule from "@/components/WeekSchedule";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "週間日程 | NBA Tip-Off Time",
  description: "前後1週間のNBA全試合日程を日本時間で確認",
};

export default async function SchedulePage() {
  const { grouped, todayKey } = await fetchWeekGames();
  return <WeekSchedule grouped={grouped} todayKey={todayKey} />;
}
