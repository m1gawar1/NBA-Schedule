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
        <h1 className={styles.heroTitle}>NBA Tip-Off Time</h1>
        <p className={styles.heroSub}>NBA全チームの試合日程を<strong>日本時間</strong>で確認・Googleカレンダーに追加</p>
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
