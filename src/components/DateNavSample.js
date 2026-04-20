"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./DateNavSample.module.css";

// ── モックデータ ───────────────────────────────────────────
const TODAY = new Date();
const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function makeUTC(dateStr, hour, min) {
  return new Date(`${dateStr}T${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}:00+09:00`).toISOString();
}

function offset(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return fmt(d);
}

const MOCK_GAMES = {
  [offset(-2)]: [
    { id:"g001", away:{tricode:"BOS",color:"#007A33",score:112}, home:{tricode:"NYK",color:"#006BB6",score:108}, time:makeUTC(offset(-2),8,0),  arena:"TD Garden",            status:3 },
    { id:"g002", away:{tricode:"LAL",color:"#552583",score:98},  home:{tricode:"GSW",color:"#1D428A",score:115}, time:makeUTC(offset(-2),10,30), arena:"Chase Center",          status:3 },
    { id:"g003", away:{tricode:"MIA",color:"#98002E",score:103}, home:{tricode:"CHI",color:"#CE1141",score:99},  time:makeUTC(offset(-2),8,30),  arena:"United Center",         status:3 },
  ],
  [offset(-1)]: [
    { id:"g004", away:{tricode:"PHX",color:"#1D1160",score:84},  home:{tricode:"OKC",color:"#007AC1",score:119}, time:makeUTC(offset(-1),1,30),  arena:"Paycom Center",          status:3 },
    { id:"g005", away:{tricode:"PHI",color:"#006BB6",score:91},  home:{tricode:"BOS",color:"#007A33",score:123}, time:makeUTC(offset(-1),2,0),   arena:"TD Garden",              status:3 },
  ],
  [offset(0)]: [
    { id:"g006", away:{tricode:"PHX",color:"#1D1160"}, home:{tricode:"OKC",color:"#007AC1"}, time:makeUTC(offset(0),10,30), arena:"Paycom Center",          status:2 },
    { id:"g007", away:{tricode:"PHI",color:"#006BB6"}, home:{tricode:"BOS",color:"#007A33"}, time:makeUTC(offset(0),8,0),  arena:"TD Garden",              status:1 },
    { id:"g008", away:{tricode:"DEN",color:"#0E2240"}, home:{tricode:"MIN",color:"#0C2340"}, time:makeUTC(offset(0),10,0), arena:"Target Center",          status:1 },
    { id:"g009", away:{tricode:"MIL",color:"#00471B"}, home:{tricode:"IND",color:"#002D62"}, time:makeUTC(offset(0),8,30), arena:"Gainbridge Fieldhouse",  status:1 },
  ],
  [offset(1)]: [
    { id:"g010", away:{tricode:"PHX",color:"#1D1160"}, home:{tricode:"OKC",color:"#007AC1"}, time:makeUTC(offset(1),10,30), arena:"Paycom Center",         status:1 },
    { id:"g011", away:{tricode:"CLE",color:"#860038"}, home:{tricode:"NYK",color:"#006BB6"}, time:makeUTC(offset(1),8,0),  arena:"Madison Square Garden", status:1 },
  ],
  [offset(2)]: [
    { id:"g012", away:{tricode:"LAL",color:"#552583"}, home:{tricode:"PHX",color:"#1D1160"}, time:makeUTC(offset(2),11,0), arena:"Footprint Center",       status:1 },
    { id:"g013", away:{tricode:"BKN",color:"#555555"}, home:{tricode:"ATL",color:"#E03A3E"}, time:makeUTC(offset(2),8,0),  arena:"State Farm Arena",       status:1 },
    { id:"g014", away:{tricode:"SAC",color:"#5A2D81"}, home:{tricode:"POR",color:"#E03A3E"}, time:makeUTC(offset(2),11,0), arena:"Moda Center",            status:1 },
  ],
  [offset(3)]: [],
  [offset(4)]: [
    { id:"g015", away:{tricode:"GSW",color:"#1D428A"}, home:{tricode:"LAC",color:"#C8102E"}, time:makeUTC(offset(4),11,30), arena:"Intuit Dome",           status:1 },
  ],
};

// ── 日付ユーティリティ ──────────────────────────────────────
const DAY_JA = ["日","月","火","水","木","金","土"];
const MONTH_JA = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

function parseJSTDate(dateStr) {
  return new Date(dateStr + "T12:00:00+09:00");
}

function fmtDateLabel(dateStr) {
  const d = parseJSTDate(dateStr);
  return `${d.getMonth()+1}月${d.getDate()}日（${DAY_JA[d.getDay()]}）`;
}

function fmtTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString("ja-JP", {
    timeZone:"Asia/Tokyo", hour:"2-digit", minute:"2-digit",
  });
}

// ── カレンダー ─────────────────────────────────────────────
function CalendarPopup({ selectedDate, onSelect, onClose }) {
  const todayStr = fmt(TODAY);
  const initDate = parseJSTDate(selectedDate);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth()); // 0-11
  const ref = useRef(null);

  // 外クリックで閉じる
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  };

  // カレンダーの日付セル生成
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=日
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDay = (day) => {
    if (!day) return;
    const m = String(viewMonth+1).padStart(2,"0");
    const d = String(day).padStart(2,"0");
    onSelect(`${viewYear}-${m}-${d}`);
  };

  return (
    <div className={styles.calPopup} ref={ref}>
      {/* 月ナビ */}
      <div className={styles.calHeader}>
        <button className={styles.calNavBtn} onClick={prevMonth}>‹</button>
        <span className={styles.calMonthLabel}>{viewYear}年 {MONTH_JA[viewMonth]}</span>
        <button className={styles.calNavBtn} onClick={nextMonth}>›</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className={styles.calGrid}>
        {DAY_JA.map((d, i) => (
          <span key={d} className={`${styles.calDayName} ${i===0?styles.sun:""} ${i===6?styles.sat:""}`}>{d}</span>
        ))}

        {/* 日付セル */}
        {cells.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />;
          const m = String(viewMonth+1).padStart(2,"0");
          const dateStr = `${viewYear}-${m}-${String(day).padStart(2,"0")}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const dow = (firstDay + day - 1) % 7;
          return (
            <button
              key={day}
              className={`${styles.calDay}
                ${isSelected ? styles.calDaySelected : ""}
                ${isToday && !isSelected ? styles.calDayToday : ""}
                ${dow===0 ? styles.sun : ""}
                ${dow===6 ? styles.sat : ""}
              `}
              onClick={() => handleDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── メインコンポーネント ────────────────────────────────────
export default function DateNavSample() {
  const [selectedDate, setSelectedDate] = useState(fmt(TODAY));
  const [showCalendar, setShowCalendar]  = useState(false);
  const [loading, setLoading]            = useState(false);
  const todayStr = fmt(TODAY);

  const games = MOCK_GAMES[selectedDate] ?? null;
  const isToday = selectedDate === todayStr;

  const navigate = (days) => {
    setLoading(true);
    const d = parseJSTDate(selectedDate);
    d.setDate(d.getDate() + days);
    setTimeout(() => { setSelectedDate(fmt(d)); setLoading(false); }, 200);
  };

  const handleSelect = (dateStr) => {
    setShowCalendar(false);
    setLoading(true);
    setTimeout(() => { setSelectedDate(dateStr); setLoading(false); }, 200);
  };

  const goToday = () => {
    if (isToday) return;
    setLoading(true);
    setTimeout(() => { setSelectedDate(todayStr); setLoading(false); }, 200);
  };

  return (
    <div className="container">
      <div className={styles.sampleBanner}>
        ⚗️ UIサンプルページ — モックデータで動作します
      </div>

      <div className={styles.section}>
        {/* ─ ナビ行：< 日付 > を等間隔・中央揃え ─ */}
        <div className={styles.controls}>
          <button className={styles.arrowBtn} onClick={() => navigate(-1)} aria-label="前の日">&lt;</button>

          <div className={styles.dateWrap}>
            <button
              className={`${styles.dateDisplay} ${isToday ? styles.dateToday : ""}`}
              onClick={() => setShowCalendar(v => !v)}
            >
              <span className={styles.dateText}>{fmtDateLabel(selectedDate)}</span>
              <span className={styles.calIcon}>📅</span>
            </button>
            {showCalendar && (
              <CalendarPopup
                selectedDate={selectedDate}
                onSelect={handleSelect}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>

          <button className={styles.arrowBtn} onClick={() => navigate(1)} aria-label="次の日">&gt;</button>
        </div>

        {/* 今日ボタン（今日以外のときだけ表示） */}
        {!isToday && (
          <div className={styles.todayRow}>
            <button className={styles.todayBtn} onClick={goToday}>今日に戻る</button>
          </div>
        )}

        {/* ─ ゲームリスト ─ */}
        <div className={`${styles.gamesArea} ${loading ? styles.loading : ""}`}>
          {games === null ? (
            <p className={styles.empty}>このサンプルにはデータがありません</p>
          ) : games.length === 0 ? (
            <p className={styles.empty}>この日は試合がありません</p>
          ) : (
            <div className={styles.gameList}>
              {games.map(game => <MockGameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MockGameCard({ game }) {
  const isFinished = game.status === 3;
  const isLive     = game.status === 2;
  return (
    <div className={`${styles.gameCard} ${isLive ? styles.liveCard : ""} ${isFinished ? styles.finishedCard : ""}`}>
      {isLive && <span className={styles.liveBadge}>● LIVE</span>}
      <p className={styles.gameTime}>{fmtTime(game.time)}</p>
      <div className={styles.matchup}>
        <div className={styles.teamSide}>
          <div className={styles.colorDot} style={{background: game.away.color}} />
          <span className={`${styles.tricode} ${isFinished && game.away.score > game.home.score ? styles.winner : ""}`}>{game.away.tricode}</span>
        </div>
        <div className={styles.center}>
          {isFinished
            ? <span className={styles.score}>{game.away.score}–{game.home.score}</span>
            : <span className={styles.vs}>@</span>
          }
        </div>
        <div className={`${styles.teamSide} ${styles.teamSideRight}`}>
          <span className={`${styles.tricode} ${isFinished && game.home.score > game.away.score ? styles.winner : ""}`}>{game.home.tricode}</span>
          <div className={styles.colorDot} style={{background: game.home.color}} />
        </div>
      </div>
      <p className={styles.arena}>{game.arena}</p>
    </div>
  );
}
