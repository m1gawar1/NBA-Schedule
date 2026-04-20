"use client";

import { useState } from "react";
import Image from "next/image";
import GameCard from "./GameCard";
import TeamCard from "./TeamCard";
import CalendarPopup from "./CalendarPopup";
import { WEST_TEAMS, EAST_TEAMS } from "@/lib/teams";
import styles from "./HomeClient.module.css";

const DAY_JA = ["日","月","火","水","木","金","土"];

function fmtDateLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00+09:00");
  return `${d.getMonth() + 1}月${d.getDate()}日（${DAY_JA[d.getDay()]}）`;
}

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HomeClient({ initialGames, initialDate }) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const isToday = selectedDate === todayStr;

  const loadGames = async (date) => {
    setLoading(true);
    setShowCalendar(false);
    try {
      const res = await fetch(`/api/games/${date}`);
      const data = await res.json();
      setGames(data.games ?? []);
      setSelectedDate(date);
    } catch {
      setGames([]);
      setSelectedDate(date);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (days) => {
    const d = new Date(selectedDate + "T12:00:00+09:00");
    d.setDate(d.getDate() + days);
    loadGames(fmt(d));
  };

  const goToday = () => {
    if (isToday) return;
    loadGames(todayStr);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>NBA Tip-Off Time</h1>
        <p className={styles.subtitle}>全試合日程を日本時間で確認</p>
      </div>

      {/* Date navigation controls */}
      <div className={styles.controls}>
        <button className={styles.arrowBtn} onClick={() => navigate(-1)} aria-label="前の日">&lt;</button>

        <div className={styles.dateWrap}>
          <button
            className={`${styles.dateDisplay} ${isToday ? styles.dateToday : ""}`}
            onClick={() => setShowCalendar(v => !v)}
          >
            <span className={styles.dateText}>{fmtDateLabel(selectedDate)}</span>
            <Image src="/calendar-icon.png" alt="カレンダー" width={22} height={22} className={styles.calIcon} />
          </button>
          {showCalendar && (
            <CalendarPopup
              selectedDate={selectedDate}
              onSelect={(date) => loadGames(date)}
              onClose={() => setShowCalendar(false)}
            />
          )}
        </div>

        <button className={styles.arrowBtn} onClick={() => navigate(1)} aria-label="次の日">&gt;</button>
      </div>

      {/* 今日に戻る */}
      {!isToday && (
        <div className={styles.todayRow}>
          <button className={styles.todayBtn} onClick={goToday}>今日に戻る</button>
        </div>
      )}

      {/* Game grid */}
      <div className={`${styles.gamesArea} ${loading ? styles.loading : ""}`}>
        {games.length === 0 ? (
          <p className={styles.empty}>この日は試合がありません</p>
        ) : (
          <div className={styles.gameGrid}>
            {games.map(game => <GameCard key={game.gameId} game={game} />)}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Team grids */}
      <section className={styles.conferenceSection}>
        <h2 className="section-heading">Western Conference</h2>
        <div className="team-grid">
          {WEST_TEAMS.map(team => <TeamCard key={team.teamId} team={team} />)}
        </div>
      </section>
      <section className={styles.conferenceSection}>
        <h2 className="section-heading">Eastern Conference</h2>
        <div className="team-grid">
          {EAST_TEAMS.map(team => <TeamCard key={team.teamId} team={team} />)}
        </div>
      </section>
    </div>
  );
}
