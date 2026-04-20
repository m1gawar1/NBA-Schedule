import GameCard from "./GameCard";
import styles from "./TodayGames.module.css";

export default function TodayGames({ games }) {
  if (!games || games.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>今日の試合</h2>
        <p className={styles.empty}>本日（JST）予定されている試合はありません</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.badge}>{games.length}</span>
        今日の試合
      </h2>
      <div className={styles.scroll}>
        {games.map((game) => (
          <div key={game.gameId} className={styles.cardWrap}>
            <GameCard game={game} compact={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
