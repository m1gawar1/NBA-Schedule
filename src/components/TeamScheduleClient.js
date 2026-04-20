"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { getLogoUrl } from "@/lib/teams";
import { getJSTYearMonth, isPlayoff } from "@/lib/utils";
import GameCard from "./GameCard";
import MonthFilter from "./MonthFilter";
import CalendarButtons from "./CalendarButtons";
import FavoriteButton from "./FavoriteButton";
import styles from "./TeamScheduleClient.module.css";

export default function TeamScheduleClient({ team, games }) {
  const [selectedMonth, setSelectedMonth] = useState("all");

  // 利用可能な月リストを生成
  const availableMonths = useMemo(() => {
    const months = new Set();
    for (const game of games) {
      if (isPlayoff(game.gameId)) {
        months.add("playoff");
      } else {
        months.add(getJSTYearMonth(game.gameDateTimeUTC));
      }
    }
    return Array.from(months).sort();
  }, [games]);

  // フィルタリング済みゲーム
  const filteredGames = useMemo(() => {
    if (selectedMonth === "all") return games;
    if (selectedMonth === "playoff") {
      return games.filter((g) => isPlayoff(g.gameId));
    }
    return games.filter(
      (g) => !isPlayoff(g.gameId) && getJSTYearMonth(g.gameDateTimeUTC) === selectedMonth
    );
  }, [games, selectedMonth]);

  // 未消化の試合（カレンダー追加用）
  const upcomingGames = useMemo(
    () => filteredGames.filter((g) => g.gameStatus !== 3),
    [filteredGames]
  );

  const logoUrl = getLogoUrl(team.teamId);

  return (
    <div className="container">
      {/* チームヘッダー */}
      <div className={styles.header} style={{ "--team-color": team.primaryColor }}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <Image
              src={logoUrl}
              alt={`${team.city} ${team.name}`}
              width={120}
              height={120}
              priority
            />
          </div>
          <div className={styles.teamMeta}>
            <p className={styles.teamCity}>{team.city}</p>
            <h1 className={styles.teamName}>{team.name}</h1>
            <p className={styles.tricode}>{team.tricode}</p>
            <div className={styles.actions}>
              <FavoriteButton slug={team.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* 一括カレンダー追加 */}
      {upcomingGames.length > 0 && (
        <div className={styles.bulkButtons}>
          <p className={styles.bulkLabel}>
            未消化試合 <strong>{upcomingGames.length}件</strong> を一括追加:
          </p>
          <CalendarButtons games={upcomingGames} label={true} />
        </div>
      )}

      {/* 月別フィルター */}
      <MonthFilter
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
        onSelect={setSelectedMonth}
      />

      {/* 試合リスト */}
      {filteredGames.length === 0 ? (
        <p className={styles.empty}>該当する試合がありません</p>
      ) : (
        <div className={styles.gameList}>
          {filteredGames.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
