import { getEffectiveDateKey } from "@/lib/utils";

const SCHEDULE_URL =
  "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";

function isRegularOrPlayoff(game) {
  return (
    game.gameId.startsWith("002") || game.gameId.startsWith("004")
  );
}

export async function fetchNBASchedule() {
  const res = await fetch(SCHEDULE_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("NBA schedule fetch failed");
  const data = await res.json();

  const games = [];
  for (const gameDate of data.leagueSchedule.gameDates) {
    for (const game of gameDate.games) {
      if (!isRegularOrPlayoff(game)) continue;
      games.push(game);
    }
  }
  return games;
}

export async function fetchTeamGames(teamId) {
  const allGames = await fetchNBASchedule();
  return allGames.filter(
    (g) => g.homeTeam.teamId === teamId || g.awayTeam.teamId === teamId
  );
}

/**
 * 今日（JST）の試合を時間順で取得
 * TBDは翌日扱いのため、今日のキーと照合
 */
export async function fetchTodayGames() {
  const allGames = await fetchNBASchedule();
  const todayKey = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return allGames
    .filter((g) => getEffectiveDateKey(g) === todayKey)
    .sort((a, b) => new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC));
}

/**
 * 前後1週間（JST）の全試合を日付ごとにグループ化して返す
 * TBDは翌日扱い
 */
export async function fetchWeekGames() {
  const allGames = await fetchNBASchedule();
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);

  const todayJST = new Date(nowJST);
  todayJST.setHours(0, 0, 0, 0);

  const weekAgoKey  = new Date(todayJST.getTime() - 7  * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const weekAheadKey = new Date(todayJST.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const filtered = allGames
    .filter((g) => {
      const key = getEffectiveDateKey(g);
      return key >= weekAgoKey && key < weekAheadKey;
    })
    .sort((a, b) => new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC));

  // 有効日付キーでグループ化
  const grouped = {};
  for (const game of filtered) {
    const key = getEffectiveDateKey(game);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(game);
  }

  const todayKey = todayJST.toISOString().slice(0, 10);
  return { grouped, todayKey };
}
