import Link from "next/link";
import Image from "next/image";
import { getLogoUrl } from "@/lib/teams";
import styles from "./TeamCard.module.css";

export default function TeamCard({ team }) {
  const logoUrl = getLogoUrl(team.teamId);

  return (
    <Link href={`/team/${team.slug}`} className={styles.card} style={{ "--team-color": team.primaryColor }}>
      <div className={styles.logoWrap}>
        <Image
          src={logoUrl}
          alt={`${team.city} ${team.name}`}
          width={80}
          height={80}
          className={styles.logo}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.city}>{team.city}</p>
        <p className={styles.name}>{team.name}</p>
        <p className={styles.tricode}>{team.tricode}</p>
      </div>
    </Link>
  );
}
