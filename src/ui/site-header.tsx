import Link from "next/link";
import styles from "./site-header.module.css";
import { ThemeSwitch } from "./theme-switch";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container-wide ${styles.inner}`}>
        <Link href="/" className={styles.wordmark}>
          Проще говоря
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  );
}
