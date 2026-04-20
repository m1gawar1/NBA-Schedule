import Image from "next/image";
import Link from "next/link";
import { getLogoUrl, getTeamById } from "@/lib/teams";
import { formatJSTFull, isPlayoff } from "@/lib/utils";
import CalendarButtons from "./CalendarButtons";
import styles from "./GameCard.module.css";

export default function GameCard({ game, compact = false }) {
  const homeTeamInfo = getTeamById(game.homeTeam.teamId);
  const awayTeamInfo = getTeamById(game.awayTeam.teamId);
  const playoff = isPlayoff(game.gameId);

  const isFinished = game.gameStatus === 3;
  const isLive = game.gameStatus === 2;

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ""}`}>
      {playoff && <span className={styles.playoffBadge}>PLAYOFFS</span>}
      {isLive && <span className={styles.liveBadge}>LIVE</span>}

      <p className={styles.datetime}>{formatJSTFull(game.gameDateTimeUTC)}</p>

      <div className={styles.matchup}>
        <TeamSide team={game.awayTeam} teamInfo={awayTeamInfo} isFinished={isFinished} isHome={false} />
        <div className={styles.vs}>
          {isFinished ? (
            <span className={styles.score}>
              {game.awayTeam.score} - {game.homeTeam.score}
            </span>
          ) : (
            <span className={styles.atSign}>@</span>
          )}
        </div>
        <TeamSide team={game.homeTeam} teamInfo={homeTeamInfo} isFinished={isFinished} isHome={true} />
      </div>

      <p className={styles.arena}>
        {game.arenaName}, {game.arenaCity}
      </p>

      {!isFinished && !compact && <CalendarButtons game={game} />}
    </div>
  );
}

function TeamSide({ team, teamInfo, isFinished, isHome }) {
  const logoUrl = teamInfo ? getLogoUrl(team.teamId) : null;
  const slug = teamInfo?.slug;

  return (
    <div className={`${styles.teamSide} ${isHome ? styles.homeTeam : styles.awayTeam}`}>
      {logoUrl && (
        <div className={styles.teamLogo}>
          <Image src={logoUrl} alt={`${team.teamCity} ${team.teamName}`} width={48} height={48} />
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
        <span className={styles.homeAwayLabel}>{isHome ? "HOME" : "AWAY"}</span>
      </div>
    </div>
  );
}
