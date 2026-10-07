import Image from "next/image";
import Link from "next/link";
import { getLogoUrl, getTeamById } from "@/lib/teams";
import { formatJSTTime, isPlayoff, isPreseason, isTBD, formatJSTDateTBD } from "@/lib/utils";
import CalendarButtons from "./CalendarButtons";
import Countdown from "./Countdown";
import styles from "./WeekSchedule.module.css";

const DAY_JA = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateHeader(dateKey, isToday) {
  const date = new Date(dateKey + "T00:00:00+09:00");
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = DAY_JA[date.getDay()];
  return { label: `${m}月${d}日（${w}）`, isWeekend: date.getDay() === 0 || date.getDay() === 6 };
}

export default function WeekSchedule({ grouped, todayKey }) {
  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>📆 <span className="hype-text">週間日程</span></h1>
        <p className={styles.sub}>前後1週間の全試合を日本時間で一気見👀</p>
      </div>

      <div className={styles.timeline}>
        {dateKeys.map((key) => {
          const games = grouped[key];
          const isToday = key === todayKey;
          const { label, isWeekend } = formatDateHeader(key, isToday);

          return (
            <section key={key} className={styles.dayBlock} id={key}>
              <div className={`${styles.dateHeader} ${isToday ? styles.today : ""} ${isWeekend ? styles.weekend : ""}`}>
                <span className={styles.dateLabel}>{label}</span>
                {isToday && <span className={styles.todayBadge}>🔥 TODAY</span>}
                <span className={styles.gameCount}>🏀×{games.length}</span>
              </div>

              <div className={styles.gameGrid}>
                {games.map((game) => (
                  <WeekGameCard key={game.gameId} game={game} />
                ))}
              </div>
            </section>
          );
        })}

        {dateKeys.length === 0 && (
          <p className={styles.empty}>😴 この期間は試合なし…</p>
        )}
      </div>
    </div>
  );
}

function WeekGameCard({ game }) {
  const homeInfo = getTeamById(game.homeTeam.teamId);
  const awayInfo = getTeamById(game.awayTeam.teamId);
  const playoff = isPlayoff(game.gameId);
  const isFinished = game.gameStatus === 3;
  const isLive = game.gameStatus === 2;
  const tbd = isTBD(game);

  return (
    <div className={`${styles.gameCard} ${isLive ? styles.liveCard : ""}`}>
      {playoff && <span className={styles.playoffBadge}>🏆 PO</span>}
      {isPreseason(game.gameId) && <span className={`${styles.playoffBadge} ${styles.preseasonBadge}`}>🧪 PRE</span>}
      {isLive && <span className={styles.liveDot} />}

      <p className={`${styles.gameTime} ${tbd ? styles.tbdTime : ""}`}>
        {tbd
          ? <>{formatJSTDateTBD(game.gameDateTimeUTC)}<br />時間未定</>
          : formatJSTTime(game.gameDateTimeUTC)
        }
        {!tbd && game.gameStatus === 1 && <Countdown utc={game.gameDateTimeUTC} />}
      </p>

      <div className={styles.teams}>
        <TeamChip team={game.awayTeam} info={awayInfo} isWinner={isFinished && game.awayTeam.score > game.homeTeam.score} />
        <span className={styles.separator}>
          {isFinished
            ? <span className={styles.scoreInline}>{game.awayTeam.score}–{game.homeTeam.score}</span>
            : <span className={styles.vsText}>VS</span>
          }
        </span>
        <TeamChip team={game.homeTeam} info={homeInfo} isWinner={isFinished && game.homeTeam.score > game.awayTeam.score} right />
      </div>

      <p className={styles.arena}>{game.arenaName}</p>

      {!isFinished && (
        <div className={styles.calBtn}>
          <CalendarButtons game={game} />
        </div>
      )}
    </div>
  );
}

function TeamChip({ team, info, isWinner, right }) {
  const logoUrl = info ? getLogoUrl(team.teamId) : null;
  const slug = info?.slug;
  const tricode = info?.tricode || team.teamTricode;

  const inner = (
    <div
      className={`${styles.teamChip} ${right ? styles.teamChipRight : ""} ${isWinner ? styles.winner : ""}`}
      style={{ "--team-color": info?.primaryColor }}
    >
      {logoUrl && (
        <Image src={logoUrl} alt={tricode} width={28} height={28} style={{ objectFit: "contain" }} />
      )}
      <span className={styles.tricode}>{tricode}</span>
    </div>
  );

  return slug
    ? <Link href={`/team/${slug}`} className={styles.teamLink}>{inner}</Link>
    : inner;
}
