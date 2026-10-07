"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

const MIN = 60 * 1000;

/**
 * ティップオフまでのカウントダウン（24時間以内の未開始試合のみ表示）
 * サーバーとクライアントで時刻がずれるため、表示はマウント後に行う
 */
export default function Countdown({ utc }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  if (now == null) return null;
  const diff = new Date(utc).getTime() - now;
  if (diff <= 0 || diff > 24 * 60 * MIN) return null;

  const h = Math.floor(diff / (60 * MIN));
  const m = Math.floor((diff % (60 * MIN)) / MIN);
  const soon = diff <= 60 * MIN;
  const label = h > 0 ? `あと${h}時間${m}分` : `あと${m}分`;

  return (
    <span className={`${styles.chip} ${soon ? styles.soon : ""}`}>
      {soon ? "🚨" : "⏰"} {label}
    </span>
  );
}
