"use client";

import { useState } from "react";
import styles from "./MonthFilter.module.css";

const MONTH_LABELS = {
  "2025-10": "10月",
  "2025-11": "11月",
  "2025-12": "12月",
  "2026-01": "1月",
  "2026-02": "2月",
  "2026-03": "3月",
  "2026-04": "4月",
  "2026-05": "5月",
  "2026-06": "6月",
  playoff: "プレーオフ",
};

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
          {MONTH_LABELS[m] || m}
        </button>
      ))}
    </div>
  );
}
