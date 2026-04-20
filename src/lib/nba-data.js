const SCHEDULE_URL =
  "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";

/**
 * レギュラーシーズン or プレーオフかどうか（プレシーズン除外）
 */
function isRegularOrPlayoff(game) {
  return (
    game.gameId.startsWith("002") || game.gameId.startsWith("004")
  );
}

/**
 * NBA CDN からスケジュールを取得し、全試合の配列を返す
 * Next.js ISR: 1時間ごとにrevalidate
 */
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

/**
 * 特定チームの試合だけ抽出（teamIdで絞り込み）
 */
export async function fetchTeamGames(teamId) {
  const allGames = await fetchNBASchedule();
  return allGames.filter(
    (g) =>
      g.homeTeam.teamId === teamId || g.awayTeam.teamId === teamId
  );
}

/**
 * 今日（JST）の試合を取得
 */
export async function fetchTodayGames() {
  const allGames = await fetchNBASchedule();
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return allGames.filter((g) => {
    const gameDate = new Date(g.gameDateTimeUTC);
    const gameDateJST = new Date(gameDate.getTime() + 9 * 60 * 60 * 1000);
    return gameDateJST.toDateString() === nowJST.toDateString();
  });
}
