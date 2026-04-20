import { fetchTodayGames } from "@/lib/nba-data";
import { WEST_TEAMS, EAST_TEAMS } from "@/lib/teams";
import TodayGames from "@/components/TodayGames";
import TeamCard from "@/components/TeamCard";
import styles from "./page.module.css";

export default async function Home() {
  const todayGames = await fetchTodayGames();

  return (
    <div className="container">
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>2025–26 Season</p>
        <h1 className={styles.heroTitle}>NBA<br /><span>Tip-Off</span><br />Time</h1>
        <p className={styles.heroSub}>全30チームの試合日程を<strong>日本時間</strong>で。<br />Googleカレンダーへのワンクリック追加対応。</p>
      </section>

      {/* 今日の試合 */}
      <TodayGames games={todayGames} />

      {/* Western Conference */}
      <section className={styles.conferenceSection}>
        <h2 className="section-heading">Western Conference</h2>
        <div className="team-grid">
          {WEST_TEAMS.map((team) => (
            <TeamCard key={team.teamId} team={team} />
          ))}
        </div>
      </section>

      {/* Eastern Conference */}
      <section className={styles.conferenceSection}>
        <h2 className="section-heading">Eastern Conference</h2>
        <div className="team-grid">
          {EAST_TEAMS.map((team) => (
            <TeamCard key={team.teamId} team={team} />
          ))}
        </div>
      </section>
    </div>
  );
}
