/**
 * UTC日時文字列をJST（日本時間）の各フィールドに変換
 */
export function toJST(utcDateString) {
  return new Date(utcDateString);
}

/**
 * JST表示用フォーマット（例: 2026年1月8日（木）10:00）
 */
export function formatJSTFull(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * JST表示用（日付のみ）
 */
export function formatJSTDate(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

/**
 * JST表示用（時刻のみ）
 */
export function formatJSTTime(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 今日（JST）の試合かどうか判定
 */
export function isTodayJST(utcDateString) {
  const gameDate = new Date(utcDateString);
  const gameDateJST = new Date(gameDate.getTime() + 9 * 60 * 60 * 1000);
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return gameDateJST.toDateString() === nowJST.toDateString();
}

/**
 * JST月を取得（0=10月, 1=11月... シーズン月順）
 * 表示用の月番号（1-12）を返す
 */
export function getJSTMonth(utcDateString) {
  const date = new Date(utcDateString);
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return jstDate.getMonth() + 1; // 1-12
}

/**
 * JST年月を取得（例: "2026-01"）
 */
export function getJSTYearMonth(utcDateString) {
  const date = new Date(utcDateString);
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = jstDate.getFullYear();
  const m = String(jstDate.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * プレイオフかどうか判定（gameIdが"004"で始まる）
 */
export function isPlayoff(gameId) {
  return gameId.startsWith("004");
}

/**
 * 時間未定（TBD）かどうか判定
 * - gameStatusText が "TBD" / "time-tbd" を含む場合
 * - gameDateTimeUTC が UTC 0:00:00（時刻プレースホルダー）の場合
 */
export function isTBD(game) {
  const statusText = (game.gameStatusText || "").toLowerCase();
  if (statusText.includes("tbd")) return true;
  // 深夜0時UTCは「時間未定」の慣例的な仮置き値
  if (game.gameDateTimeUTC?.endsWith("T00:00:00Z")) return true;
  return false;
}

/**
 * TBD用の日付表示（時刻なし）
 * 例: "2026年4月27日（月）"
 */
export function formatJSTDateOnly(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
