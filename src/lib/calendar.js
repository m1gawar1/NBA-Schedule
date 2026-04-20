/**
 * Google Calendar イベント追加URL を生成（OAuth不要）
 */
export function buildGoogleCalendarUrl(game) {
  const startUTC = new Date(game.gameDateTimeUTC);
  const endUTC = new Date(startUTC.getTime() + 2.5 * 60 * 60 * 1000);

  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const isPlayoff = game.gameId.startsWith("004");
  const label = isPlayoff ? "NBA プレーオフ" : "NBA 2025-26 シーズン";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${game.awayTeam.teamCity} ${game.awayTeam.teamName} @ ${game.homeTeam.teamCity} ${game.homeTeam.teamName}`,
    dates: `${fmt(startUTC)}/${fmt(endUTC)}`,
    details: label,
    location: `${game.arenaName}, ${game.arenaCity}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * .ics文字列を生成（複数試合対応）
 */
export function buildICSContent(games) {
  const escape = (s) =>
    (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const events = games
    .map((game) => {
      const start = new Date(game.gameDateTimeUTC);
      const end = new Date(start.getTime() + 2.5 * 60 * 60 * 1000);
      const isPlayoff = game.gameId.startsWith("004");
      const label = isPlayoff ? "NBA プレーオフ" : "NBA 2025-26 シーズン";
      const summary = `${game.awayTeam.teamCity} ${game.awayTeam.teamName} @ ${game.homeTeam.teamCity} ${game.homeTeam.teamName}`;
      const location = `${game.arenaName}, ${game.arenaCity}`;
      const uid = `${game.gameId}@nba-tipoff-time`;

      return [
        "BEGIN:VEVENT",
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${escape(summary)}`,
        `LOCATION:${escape(location)}`,
        `DESCRIPTION:${escape(label)}`,
        `UID:${uid}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NBA Tip-Off Time//EN",
    "CALSCALE:GREGORIAN",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * .icsダウンロード用のData URL
 */
export function buildICSDataUrl(games) {
  const content = buildICSContent(games);
  const encoded = encodeURIComponent(content);
  return `data:text/calendar;charset=utf-8,${encoded}`;
}
