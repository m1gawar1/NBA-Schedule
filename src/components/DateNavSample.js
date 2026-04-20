"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./DateNavSample.module.css";

// ── モックデータ ──────────────────────────────────────────
const TODAY = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);

function makeUTC(dateStr, hour, min) {
  // dateStr: "YYYY-MM-DD" (JST), hour/min はJST
  // JSTはUTC+9なのでUTCに変換
  const jst = new Date(`${dateStr}T${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}:00+09:00`);
  return jst.toISOString();
}

function offset(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return fmt(d);
}

const MOCK_GAMES = {
  [offset(-2)]: [
    { id: "g001", away: { tricode: "BOS", name: "Celtics",     color: "#007A33", score: 112 }, home: { tricode: "NYK", name: "Knicks",      color: "#006BB6", score: 108 }, time: makeUTC(offset(-2), 8, 0),  arena: "TD Garden",            status: 3 },
    { id: "g002", away: { tricode: "LAL", name: "Lakers",      color: "#552583", score: 98  }, home: { tricode: "GSW", name: "Warriors",    color: "#1D428A", score: 115 }, time: makeUTC(offset(-2), 10, 30), arena: "Chase Center",          status: 3 },
    { id: "g003", away: { tricode: "MIA", name: "Heat",        color: "#98002E", score: 103 }, home: { tricode: "CHI", name: "Bulls",       color: "#CE1141", score: 99  }, time: makeUTC(offset(-2), 8, 30), arena: "United Center",         status: 3 },
  ],
  [offset(-1)]: [
    { id: "g004", away: { tricode: "PHX", name: "Suns",        color: "#1D1160", score: 84  }, home: { tricode: "OKC", name: "Thunder",     color: "#007AC1", score: 119 }, time: makeUTC(offset(-1), 1, 30),  arena: "Paycom Center",         status: 3 },
    { id: "g005", away: { tricode: "PHI", name: "76ers",       color: "#006BB6", score: 91  }, home: { tricode: "BOS", name: "Celtics",     color: "#007A33", score: 123 }, time: makeUTC(offset(-1), 2, 0),   arena: "TD Garden",             status: 3 },
  ],
  [offset(0)]: [
    { id: "g006", away: { tricode: "PHX", name: "Suns",        color: "#1D1160"             }, home: { tricode: "OKC", name: "Thunder",     color: "#007AC1"             }, time: makeUTC(offset(0), 10, 30), arena: "Paycom Center",          status: 2 },
    { id: "g007", away: { tricode: "PHI", name: "76ers",       color: "#006BB6"             }, home: { tricode: "BOS", name: "Celtics",     color: "#007A33"             }, time: makeUTC(offset(0), 8, 0),   arena: "TD Garden",             status: 1 },
    { id: "g008", away: { tricode: "DEN", name: "Nuggets",     color: "#0E2240"             }, home: { tricode: "MIN", name: "Timberwolves",color: "#0C2340"             }, time: makeUTC(offset(0), 10, 0),  arena: "Target Center",         status: 1 },
    { id: "g009", away: { tricode: "MIL", name: "Bucks",       color: "#00471B"             }, home: { tricode: "IND", name: "Pacers",      color: "#002D62"             }, time: makeUTC(offset(0), 8, 30),  arena: "Gainbridge Fieldhouse", status: 1 },
  ],
  [offset(1)]: [
    { id: "g010", away: { tricode: "PHX", name: "Suns",        color: "#1D1160"             }, home: { tricode: "OKC", name: "Thunder",     color: "#007AC1"             }, time: makeUTC(offset(1), 10, 30), arena: "Paycom Center",          status: 1 },
    { id: "g011", away: { tricode: "CLE", name: "Cavaliers",   color: "#860038"             }, home: { tricode: "NYK", name: "Knicks",      color: "#006BB6"             }, time: makeUTC(offset(1), 8, 0),   arena: "Madison Square Garden", status: 1 },
  ],
  [offset(2)]: [
    { id: "g012", away: { tricode: "LAL", name: "Lakers",      color: "#552583"             }, home: { tricode: "PHX", name: "Suns",        color: "#1D1160"             }, time: makeUTC(offset(2), 11, 0),  arena: "Footprint Center",       status: 1 },
    { id: "g013", away: { tricode: "BKN", name: "Nets",        color: "#000000"             }, home: { tricode: "ATL", name: "Hawks",       color: "#E03A3E"             }, time: makeUTC(offset(2), 8, 0),   arena: "State Farm Arena",       status: 1 },
    { id: "g014", away: { tricode: "SAC", name: "Kings",       color: "#5A2D81"             }, home: { tricode: "POR", name: "Trail Blazers",color: "#E03A3E"            }, time: makeUTC(offset(2), 11, 0),  arena: "Moda Center",            status: 1 },
  ],
  [offset(3)]: [],
  [offset(4)]: [
    { id: "g015", away: { tricode: "GSW", name: "Warriors",    color: "#1D428A"             }, home: { tricode: "LAC", name: "Clippers",    color: "#C8102E"             }, time: makeUTC(offset(4), 11, 30), arena: "Intuit Dome",            status: 1 },
  ],
};

const DAY_JA = ["日", "月", "火", "水", "木", "金", "土"];

function fmtDateLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00+09:00");
  return `${d.getMonth() + 1}月${d.getDate()}日（${DAY_JA[d.getDay()]}）`;
}

function fmtTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────

export default function DateNavSample() {
  const [selectedDate, setSelectedDate] = useState(offset(0));
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const todayStr = offset(0);
  const games = MOCK_GAMES[selectedDate] ?? null; // null = データなし（範囲外）

  const navigate = (days) => {
    setLoading(true);
    setTimeout(() => {
      const d = new Date(selectedDate + "T12:00:00+09:00");
      d.setDate(d.getDate() + days);
      setSelectedDate(fmt(d));
      setLoading(false);
    }, 250); // ローディング演出
  };

  const goToDate = (e) => {
    setLoading(true);
    setShowCalendar(false);
    setTimeout(() => {
      setSelectedDate(e.target.value);
      setLoading(false);
    }, 250);
  };

  const isToday = selectedDate === todayStr;

  return (
    <div className="container">
      {/* ページ説明バナー */}
      <div className={styles.sampleBanner}>
        ⚗️ これはUIサンプルページです。モックデータで動作します。
      </div>

      <div className={styles.section}>
        {/* ─ ヘッダー行 ─ */}
        <div className={styles.controls}>
          {/* 前へ */}
          <button className={styles.arrowBtn} onClick={() => navigate(-1)} aria-label="前の日">
            ←
          </button>

          {/* 日付表示 + カレンダーボタン */}
          <div className={styles.datePicker}>
            <button
              className={`${styles.dateDisplay} ${isToday ? styles.dateToday : ""}`}
              onClick={() => setShowCalendar((v) => !v)}
            >
              <span className={styles.dateText}>{fmtDateLabel(selectedDate)}</span>
              {isToday && <span className={styles.todayPill}>TODAY</span>}
              <span className={styles.calIcon}>📅</span>
            </button>

            {showCalendar && (
              <div className={styles.calendarPopup}>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={selectedDate}
                  onChange={goToDate}
                />
              </div>
            )}
          </div>

          {/* 次へ */}
          <button className={styles.arrowBtn} onClick={() => navigate(1)} aria-label="次の日">
            →
          </button>

          {/* 今日に戻る */}
          {!isToday && (
            <button className={styles.todayBtn} onClick={() => { setLoading(true); setTimeout(() => { setSelectedDate(todayStr); setLoading(false); }, 250); }}>
              今日
            </button>
          )}
        </div>

        {/* ─ ゲームリスト ─ */}
        <div className={`${styles.gamesArea} ${loading ? styles.loading : ""}`}>
          {games === null ? (
            <p className={styles.empty}>このサンプルにはデータがありません</p>
          ) : games.length === 0 ? (
            <p className={styles.empty}>この日は試合がありません</p>
          ) : (
            <div className={styles.gameList}>
              {games.map((game) => (
                <MockGameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MockGameCard({ game }) {
  const isFinished = game.status === 3;
  const isLive = game.status === 2;

  return (
    <div className={`${styles.gameCard} ${isLive ? styles.liveCard : ""} ${isFinished ? styles.finishedCard : ""}`}>
      {isLive && <span className={styles.liveBadge}>● LIVE</span>}

      <p className={styles.gameTime}>{fmtTime(game.time)}</p>

      <div className={styles.matchup}>
        <div className={styles.teamSide}>
          <div className={styles.colorDot} style={{ background: game.away.color }} />
          <span className={`${styles.tricode} ${isFinished && game.away.score > game.home.score ? styles.winner : ""}`}>
            {game.away.tricode}
          </span>
        </div>

        <div className={styles.center}>
          {isFinished ? (
            <span className={styles.score}>{game.away.score}–{game.home.score}</span>
          ) : (
            <span className={styles.vs}>@</span>
          )}
        </div>

        <div className={`${styles.teamSide} ${styles.teamSideRight}`}>
          <span className={`${styles.tricode} ${isFinished && game.home.score > game.away.score ? styles.winner : ""}`}>
            {game.home.tricode}
          </span>
          <div className={styles.colorDot} style={{ background: game.home.color }} />
        </div>
      </div>

      <p className={styles.arena}>{game.arena}</p>
    </div>
  );
}
