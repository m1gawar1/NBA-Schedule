"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { getLogoUrl } from "@/lib/teams";
import { getJSTYearMonth, getSeasonLabel, isPlayoff, isPreseason } from "@/lib/utils";
import GameCard from "./GameCard";
import MonthFilter from "./MonthFilter";
import CalendarButtons from "./CalendarButtons";
import FavoriteButton from "./FavoriteButton";
import styles from "./TeamScheduleClient.module.css";

export default function TeamScheduleClient({ team, games, fetchError = false }) {
  const [selectedMonth, setSelectedMonth] = useState("all");

  // 利用可能な月リストを生成
  const availableMonths = useMemo(() => {
    const months = new Set();
    for (const game of games) {
      if (isPlayoff(game.gameId)) {
        months.add("playoff");
      } else if (isPreseason(game.gameId)) {
        months.add("preseason");
      } else {
        months.add(getJSTYearMonth(game.gameDateTimeUTC));
      }
    }
    // プレシーズンは先頭、プレーオフは末尾
    const order = (m) => (m === "preseason" ? "0" : m === "playoff" ? "9" : m);
    return Array.from(months).sort((a, b) => order(a).localeCompare(order(b)));
  }, [games]);

  // フィルタリング済みゲーム
  const filteredGames = useMemo(() => {
    if (selectedMonth === "all") return games;
    if (selectedMonth === "playoff") {
      return games.filter((g) => isPlayoff(g.gameId));
    }
    if (selectedMonth === "preseason") {
      return games.filter((g) => isPreseason(g.gameId));
    }
    return games.filter(
      (g) =>
        !isPlayoff(g.gameId) &&
        !isPreseason(g.gameId) &&
        getJSTYearMonth(g.gameDateTimeUTC) === selectedMonth
    );
  }, [games, selectedMonth]);

  // 未消化の試合（一括カレンダー追加用）。プレシーズンは含めない
  const upcomingGames = useMemo(
    () => filteredGames.filter((g) => g.gameStatus !== 3 && !isPreseason(g.gameId)),
    [filteredGames]
  );

  // .ics のファイル名（例: OKC-Thunder-2026-27.ics / 月選択時は OKC-Thunder-2026-27-11月.ics）
  const icsFileName = useMemo(() => {
    const season = upcomingGames.length > 0 ? `-${getSeasonLabel(upcomingGames[0].gameDateTimeUTC)}` : "";
    const suffix =
      selectedMonth === "all" ? "" : selectedMonth === "playoff" ? "-プレーオフ" : `-${Number(selectedMonth.slice(5, 7))}月`;
    return `${team.tricode}-${team.name.replace(/\s+/g, "-")}${season}${suffix}.ics`;
  }, [team, upcomingGames, selectedMonth]);

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
          <CalendarButtons games={upcomingGames} label={true} fileName={icsFileName} />
        </div>
      )}

      {/* 月別フィルター */}
      <MonthFilter
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
        onSelect={setSelectedMonth}
      />

      {/* 試合リスト */}
      {fetchError ? (
        <p className={styles.empty}>日程データを取得できませんでした。時間をおいて再度お試しください</p>
      ) : filteredGames.length === 0 ? (
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
