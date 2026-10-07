"use client";

import { useState } from "react";
import styles from "./MonthFilter.module.css";

// "2026-10" → "10月"（プレーオフは別ラベル）
function monthLabel(key) {
  if (key === "playoff") return "プレーオフ";
  return `${Number(key.slice(5, 7))}月`;
}

export default function MonthFilter({ availableMonths, selectedMonth, onSelect }) {
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.tab} ${selectedMonth === "all" ? styles.active : ""}`}
        onClick={() => onSelect("all")}
      >
        全試合
      </button>
      {availableMonths.map((m) => (
        <button
          key={m}
          className={`${styles.tab} ${selectedMonth === m ? styles.active : ""}`}
          onClick={() => onSelect(m)}
        >
          {monthLabel(m)}
        </button>
      ))}
    </div>
  );
}
