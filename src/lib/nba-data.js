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
 * 今日（JST）の試合を時間順で取得
 */
export async function fetchTodayGames() {
  const allGames = await fetchNBASchedule();
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return allGames
    .filter((g) => {
      const gameDateJST = new Date(new Date(g.gameDateTimeUTC).getTime() + 9 * 60 * 60 * 1000);
      return gameDateJST.toDateString() === nowJST.toDateString();
    })
    .sort((a, b) => new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC));
}

/**
 * 前後1週間（JST）の全試合を日付ごとにグループ化して返す
 */
export async function fetchWeekGames() {
  const allGames = await fetchNBASchedule();
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);

  // 今日のJST日付（時刻を0にリセット）
  const todayJST = new Date(nowJST);
  todayJST.setHours(0, 0, 0, 0);

  const weekAgo   = new Date(todayJST.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAhead = new Date(todayJST.getTime() + 8 * 24 * 60 * 60 * 1000); // +7日の終わり

  // 対象期間でフィルタ → 時間順ソート
  const filtered = allGames
    .filter((g) => {
      const gameDateJST = new Date(new Date(g.gameDateTimeUTC).getTime() + 9 * 60 * 60 * 1000);
      return gameDateJST >= weekAgo && gameDateJST < weekAhead;
    })
    .sort((a, b) => new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC));

  // JST日付文字列（"2026-04-20"）でグループ化
  const grouped = {};
  for (const game of filtered) {
    const jst = new Date(new Date(game.gameDateTimeUTC).getTime() + 9 * 60 * 60 * 1000);
    const key = jst.toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(game);
  }

  // 今日のキーも返す（ハイライト用）
  const todayKey = todayJST.toISOString().slice(0, 10);

  return { grouped, todayKey };
}
