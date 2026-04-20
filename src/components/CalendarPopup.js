"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CalendarPopup.module.css";

const DAY_JA = ["日","月","火","水","木","金","土"];
const MONTH_JA = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

function parseJSTDate(dateStr) {
  return new Date(dateStr + "T12:00:00+09:00");
}

export default function CalendarPopup({ selectedDate, onSelect, onClose }) {
  const todayStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const initDate = parseJSTDate(selectedDate);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth()); // 0-11
  const ref = useRef(null);

  // 外クリックで閉じる
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  // カレンダーの日付セル生成
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=日
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDay = (day) => {
    if (!day) return;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onSelect(`${viewYear}-${m}-${d}`);
  };

  return (
    <div className={styles.calPopup} ref={ref}>
      {/* 月ナビ */}
      <div className={styles.calHeader}>
        <button className={styles.calNavBtn} onClick={prevMonth}>‹</button>
        <span className={styles.calMonthLabel}>{viewYear}年 {MONTH_JA[viewMonth]}</span>
        <button className={styles.calNavBtn} onClick={nextMonth}>›</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className={styles.calGrid}>
        {DAY_JA.map((d, i) => (
          <span key={d} className={`${styles.calDayName} ${i === 0 ? styles.sun : ""} ${i === 6 ? styles.sat : ""}`}>{d}</span>
        ))}

        {/* 日付セル */}
        {cells.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />;
          const m = String(viewMonth + 1).padStart(2, "0");
          const dateStr = `${viewYear}-${m}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const dow = (firstDay + day - 1) % 7;
          return (
            <button
              key={day}
              className={`${styles.calDay}
                ${isSelected ? styles.calDaySelected : ""}
                ${isToday && !isSelected ? styles.calDayToday : ""}
                ${dow === 0 ? styles.sun : ""}
                ${dow === 6 ? styles.sat : ""}
              `}
              onClick={() => handleDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
