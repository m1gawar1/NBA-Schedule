import { getEffectiveDateKey } from "@/lib/utils";
import { getTeamById, getTeamByEspnAbbr, getEspnAbbr } from "@/lib/teams";

// NBA公式CDNが403を返すようになったため ESPN の公開APIから取得する
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";

// ESPN の seasonType → 旧NBA gameId の接頭辞（2=レギュラー, 3=プレーオフ）
const GAME_ID_PREFIX = { 2: "002", 3: "004" };

const STATUS_BY_STATE = { pre: 1, in: 2, post: 3 };

const DAY_MS = 24 * 60 * 60 * 1000;

async function fetchJSON(url) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`ESPN fetch failed: ${res.status} ${url}`);
  return res.json();
}

/**
 * 現在のシーズン年（ESPN形式: 2026-27 → 2027）
 * 7月以降は次のシーズンを対象にする
 */
function getCurrentSeasonYear() {
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = nowJST.getUTCFullYear();
  return nowJST.getUTCMonth() + 1 >= 7 ? y + 1 : y;
}

function normalizeTeam(competitor) {
  const team = getTeamByEspnAbbr(competitor.team.abbreviation);
  if (!team) return null;
  // スコアは scoreboard では文字列、チーム日程では { value } で返る
  const raw = competitor.score;
  const score = raw == null ? undefined : Number(typeof raw === "object" ? raw.value : raw);
  return {
    teamId: team.teamId,
    teamCity: team.city,
    teamName: team.name,
    teamTricode: team.tricode,
    score,
  };
}

/**
 * ESPN のイベントを旧NBA CDN と同じ形の game オブジェクトに変換
 * 対象外（プレシーズン・オールスター等）は null
 */
function normalizeEvent(event) {
  const comp = event.competitions?.[0];
  const seasonType = Number(event.seasonType?.type ?? event.season?.type);
  const prefix = GAME_ID_PREFIX[seasonType];
  if (!comp || !prefix) return null;

  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  const homeTeam = home && normalizeTeam(home);
  const awayTeam = away && normalizeTeam(away);
  if (!homeTeam || !awayTeam) return null;

  const status = comp.status || event.status;
  const gameStatus = STATUS_BY_STATE[status?.type?.state] ?? 1;
  if (gameStatus === 1) {
    homeTeam.score = undefined;
    awayTeam.score = undefined;
  }

  // 時間未定は「ET日付の UTC 00:00」に揃える（utils.js の TBD 判定・翌日扱いと合わせる）
  const tbd = (comp.timeValid ?? event.timeValid) === false;
  const gameDateTimeUTC = tbd
    ? `${new Date(event.date).toLocaleDateString("en-CA", { timeZone: "America/New_York" })}T00:00:00Z`
    : new Date(event.date).toISOString().replace(/\.\d{3}Z$/, "Z");

  return {
    gameId: `${prefix}${event.id}`,
    gameStatus,
    gameStatusText: tbd ? "TBD" : status?.type?.shortDetail || "",
    gameDateTimeUTC,
    arenaName: comp.venue?.fullName || "",
    arenaCity: comp.venue?.address?.city || "",
    homeTeam,
    awayTeam,
  };
}

function byTime(a, b) {
  return new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC);
}

/**
 * チームのシーズン全試合（レギュラー + プレーオフ）
 */
export async function fetchTeamGames(teamId) {
  const team = getTeamById(teamId);
  if (!team) return [];
  const abbr = getEspnAbbr(team).toLowerCase();
  const season = getCurrentSeasonYear();

  const [regular, playoff] = await Promise.all([
    fetchJSON(`${ESPN_BASE}/teams/${abbr}/schedule?season=${season}&seasontype=2`),
    // プレーオフは開始前だと存在しないことがあるため失敗しても空扱い
    fetchJSON(`${ESPN_BASE}/teams/${abbr}/schedule?season=${season}&seasontype=3`).catch(() => ({ events: [] })),
  ]);

  return [...(regular.events || []), ...(playoff.events || [])]
    .map(normalizeEvent)
    .filter(Boolean)
    .sort(byTime);
}

/**
 * 指定したJST日付キー（"YYYY-MM-DD"）群の試合を取得
 * JSTの日付DはET（米国東部）の前日夜にあたるため、ETのD-1日とD日を取得して絞り込む
 */
async function fetchGamesByDateKeys(dateKeys) {
  const etDates = new Set();
  for (const key of dateKeys) {
    const d = new Date(`${key}T00:00:00Z`);
    for (const t of [d.getTime() - DAY_MS, d.getTime()]) {
      etDates.add(new Date(t).toISOString().slice(0, 10).replace(/-/g, ""));
    }
  }

  const boards = await Promise.all(
    [...etDates].map((d) => fetchJSON(`${ESPN_BASE}/scoreboard?dates=${d}`))
  );

  const keySet = new Set(dateKeys);
  const seen = new Set();
  const games = [];
  for (const board of boards) {
    for (const event of board.events || []) {
      const game = normalizeEvent(event);
      if (!game || seen.has(game.gameId)) continue;
      if (!keySet.has(getEffectiveDateKey(game))) continue;
      seen.add(game.gameId);
      games.push(game);
    }
  }
  return games.sort(byTime);
}

/**
 * 指定日（JST）の試合を時間順で取得
 */
export async function fetchGamesByDate(dateKey) {
  return fetchGamesByDateKeys([dateKey]);
}

/**
 * 今日（JST）の試合を時間順で取得
 * TBDは翌日扱いのため、今日のキーと照合
 */
export async function fetchTodayGames() {
  const todayKey = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return fetchGamesByDate(todayKey);
}

/**
 * 前後1週間（JST）の全試合を日付ごとにグループ化して返す
 * TBDは翌日扱い
 */
export async function fetchWeekGames() {
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const todayKey = nowJST.toISOString().slice(0, 10);
  const todayMs = new Date(`${todayKey}T00:00:00Z`).getTime();

  // 7日前〜7日後
  const keys = [];
  for (let i = -7; i <= 7; i++) {
    keys.push(new Date(todayMs + i * DAY_MS).toISOString().slice(0, 10));
  }

  const games = await fetchGamesByDateKeys(keys);

  // 有効日付キーでグループ化
  const grouped = {};
  for (const game of games) {
    const key = getEffectiveDateKey(game);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(game);
  }

  return { grouped, todayKey };
}
