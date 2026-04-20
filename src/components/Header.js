import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <span className={styles.logoText}>NBA Tip-Off Time</span>
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav}>
            <Link href="/how-to" className={styles.navLink}>使い方</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
