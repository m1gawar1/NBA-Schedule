"use client";

import Image from "next/image";
import { buildGoogleCalendarUrl, buildICSDataUrl } from "@/lib/calendar";
import styles from "./CalendarButtons.module.css";

const ICS_GUIDES = [
  { label: "Google カレンダー", url: "https://support.google.com/calendar/answer/37118?hl=ja&co=GENIE.Platform%3DDesktop" },
  { label: "Outlook",           url: "https://support.microsoft.com/ja-jp/office/outlook-%E3%81%AB%E4%BA%88%E5%AE%9A%E8%A1%A8%E3%82%92%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B-8e8364e1-400e-4c0f-a573-fe76b5a2d379" },
  { label: "Apple カレンダー",  url: "https://support.apple.com/ja-jp/guide/calendar/icl1023/mac" },
];

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
        <div className={styles.icsGroup}>
          <button
            className={`${styles.btn} ${styles.ics}`}
            onClick={handleICSMulti}
            title="全試合をiCal形式でダウンロード（PCのみ）"
          >
            <Image src="/calendar-icon.png" alt="" width={14} height={14} className={styles.icon} />
            全試合 .ics ダウンロード
            {label && <span className={styles.count}>（{games.length}試合）</span>}
            <span className={styles.pcOnly}>PC のみ</span>
          </button>
          <div className={styles.guides}>
            取り込み方：
            {ICS_GUIDES.map((g, i) => (
              <span key={g.label}>
                <a href={g.url} target="_blank" rel="noopener noreferrer" className={styles.guideLink}>
                  {g.label}
                </a>
                {i < ICS_GUIDES.length - 1 && <span className={styles.sep}>·</span>}
              </span>
            ))}
          </div>
        </div>
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
