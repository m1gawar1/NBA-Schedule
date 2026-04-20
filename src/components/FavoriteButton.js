"use client";

import { useState, useEffect } from "react";
import styles from "./FavoriteButton.module.css";

const STORAGE_KEY = "favoriteTeams";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (slug) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { favorites, toggle };
}

export default function FavoriteButton({ slug }) {
  const { favorites, toggle } = useFavorites();
  const isFav = favorites.includes(slug);

  return (
    <button
      className={`${styles.btn} ${isFav ? styles.active : ""}`}
      onClick={() => toggle(slug)}
      aria-label={isFav ? "お気に入りから削除" : "お気に入りに追加"}
      title={isFav ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {isFav ? "★" : "☆"} {isFav ? "お気に入り済み" : "お気に入り"}
    </button>
  );
}
