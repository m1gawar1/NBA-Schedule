"use client";

import Image from "next/image";
import { buildGoogleCalendarUrl, buildICSDataUrl } from "@/lib/calendar";
import styles from "./CalendarButtons.module.css";

export default function CalendarButtons({ game, games, label }) {
  const isMulti = Array.isArray(games) && games.length > 0;

  const handleGoogleSingle = () => {
    window.open(buildGoogleCalendarUrl(game), "_blank");
  };

  const handleICSMulti = () => {
    const dataUrl = buildICSDataUrl(games);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "nba-schedule.ics";
    a.click();
  };

  if (isMulti) {
    return (
      <div className={styles.wrap}>
        <button
          className={`${styles.btn} ${styles.ics}`}
          onClick={handleICSMulti}
          title="全試合をiCal形式でダウンロード（Google・Apple・Outlook対応）"
        >
          <Image src="/calendar-icon.png" alt="" width={14} height={14} className={styles.icon} />
          全試合 .ics ダウンロード
          {label && <span className={styles.count}>（{games.length}試合）</span>}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${styles.google}`}
        onClick={handleGoogleSingle}
      >
        <Image src="/calendar-icon.png" alt="" width={14} height={14} className={styles.icon} />
        Googleカレンダーに追加
      </button>
    </div>
  );
}
