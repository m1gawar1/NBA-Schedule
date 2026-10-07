import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

// ヘッダー下を流れるテロップ
const TICKER_ITEMS = [
  "🏀 NBA全試合 日本時間で秒速チェック",
  "📅 推しの試合をワンタップでカレンダーへ",
  "🔥 LIVE中の試合はピカピカ光る",
  "⭐ お気に入り登録で推しチームをすぐ開ける",
  "⏰ ティップオフまでのカウントダウン付き",
];

export default function Header() {
  // ループを途切れさせないため2周分並べる
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <span className={`${styles.logoText} hype-text`}>NBA Tip-Off Time</span>
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav}>
            <Link href="/how-to" className={styles.navLink}>❓使い方</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {items.map((t, i) => (
            <span key={i} className={styles.tickerItem}>{t}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
