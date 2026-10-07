import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/lib/teams";
import { fetchTeamGames } from "@/lib/nba-data";
import TeamScheduleClient from "@/components/TeamScheduleClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  return {
    title: `${team.city} ${team.name} の日程 | NBA Tip-Off Time`,
    description: `${team.city} ${team.name} の2026-27シーズン試合日程を日本時間で確認。Googleカレンダーへの追加も簡単。`,
  };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  // 日時順で返る。取得失敗時はエラーページにせずメッセージを出す
  let games: unknown[] = [];
  let fetchError = false;
  try {
    games = await fetchTeamGames(team.teamId);
  } catch {
    fetchError = true;
  }

  return <TeamScheduleClient team={team} games={games} fetchError={fetchError} />;
}
