import Image from "next/image";
import Link from "next/link";
import { getLogoUrl, getTeamById } from "@/lib/teams";
import { formatJSTFull, formatJSTDateTBD, isPlayoff, isPreseason, isTBD } from "@/lib/utils";
import CalendarButtons from "./CalendarButtons";
import Countdown from "./Countdown";
import styles from "./GameCard.module.css";

export default function GameCard({ game, compact = false }) {
  const homeTeamInfo = getTeamById(game.homeTeam.teamId);
  const awayTeamInfo = getTeamById(game.awayTeam.teamId);
  const playoff = isPlayoff(game.gameId);
  const preseason = isPreseason(game.gameId);

  const isFinished = game.gameStatus === 3;
  const isLive = game.gameStatus === 2;
  const tbd = isTBD(game);
  const awayWin = isFinished && game.awayTeam.score > game.homeTeam.score;
  const homeWin = isFinished && game.homeTeam.score > game.awayTeam.score;

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ""} ${tbd ? styles.tbdCard : ""} ${isLive ? styles.liveCard : ""}`}>
      {playoff && <span className={styles.playoffBadge}>🏆 PLAYOFFS</span>}
      {preseason && <span className={`${styles.playoffBadge} ${styles.preseasonBadge}`}>🧪 PRESEASON</span>}
      {isLive && <span className={styles.liveBadge}>🔥 LIVE</span>}

      {tbd ? (
        <p className={styles.datetime}>
          {formatJSTDateTBD(game.gameDateTimeUTC)}
          <span className={styles.tbdBadge}>時間未定</span>
        </p>
      ) : (
        <p className={styles.datetime}>
          {formatJSTFull(game.gameDateTimeUTC)}
          {game.gameStatus === 1 && <Countdown utc={game.gameDateTimeUTC} />}
        </p>
      )}

      <div className={styles.matchup}>
        <TeamSide team={game.awayTeam} teamInfo={awayTeamInfo} isWinner={awayWin} isHome={false} />
        <div className={styles.vs}>
          {isFinished ? (
            <span className={styles.score}>
              <span className={awayWin ? styles.winScore : ""}>{game.awayTeam.score}</span>
              <span className={styles.scoreSep}>-</span>
              <span className={homeWin ? styles.winScore : ""}>{game.homeTeam.score}</span>
            </span>
          ) : (
            <span className={styles.atSign}>VS</span>
          )}
        </div>
        <TeamSide team={game.homeTeam} teamInfo={homeTeamInfo} isWinner={homeWin} isHome={true} />
      </div>

      <p className={styles.arena}>
        {game.arenaName}, {game.arenaCity}
      </p>

      {!isFinished && !compact && <CalendarButtons game={game} />}
    </div>
  );
}

function TeamSide({ team, teamInfo, isWinner, isHome }) {
  const logoUrl = teamInfo ? getLogoUrl(team.teamId) : null;
  const slug = teamInfo?.slug;

  return (
    <div
      className={`${styles.teamSide} ${isHome ? styles.homeTeam : styles.awayTeam} ${isWinner ? styles.winner : ""}`}
      style={{ "--team-color": teamInfo?.primaryColor }}
    >
      {logoUrl && (
        <div className={styles.teamLogo}>
          <Image src={logoUrl} alt={`${team.teamCity} ${team.teamName}`} width={40} height={40} />
        </div>
      )}
      <div className={styles.teamInfo}>
        {slug ? (
          <Link href={`/team/${slug}`} className={styles.teamName}>
            {teamInfo?.tricode || team.teamTricode}
          </Link>
        ) : (
          <span className={styles.teamName}>{teamInfo?.tricode || team.teamTricode}</span>
        )}
        <span className={styles.homeAwayLabel}>
          {isWinner && "👑 "}{isHome ? "🏠 HOME" : "✈️ AWAY"}
        </span>
      </div>
    </div>
  );
}
