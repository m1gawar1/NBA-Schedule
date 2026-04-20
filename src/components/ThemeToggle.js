"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button className={styles.btn} onClick={toggle} aria-label="テーマ切り替え">
      <span className={styles.icon}>{theme === "dark" ? "☀" : "☽"}</span>
      <span className={styles.label}>{theme === "dark" ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
