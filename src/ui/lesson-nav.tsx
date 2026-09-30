import Link from "next/link";
import type { LessonSummary } from "@/domain/lesson";
import styles from "./lesson-nav.module.css";

type Props = {
  topicSlug: string;
  previous: LessonSummary | null;
  next: LessonSummary | null;
};

export function LessonNav({ topicSlug, previous, next }: Props) {
  return (
    <nav aria-label="Соседние уроки" className={styles.nav}>
      <div className={styles.steps}>
        {previous && (
          <Link href={`/topics/${topicSlug}/${previous.slug}`} className={styles.step}>
            <span className={styles.label}>Назад</span>
            <span className="visually-hidden">: </span>
            <span className={styles.title}>{previous.title}</span>
          </Link>
        )}
        {next && (
          <Link
            href={`/topics/${topicSlug}/${next.slug}`}
            className={`${styles.step} ${styles.next}`}
          >
            <span className={styles.label}>Дальше</span>
            <span className="visually-hidden">: </span>
            <span className={styles.title}>{next.title}</span>
          </Link>
        )}
      </div>
      <p className={styles.all}>
        <Link href={`/topics/${topicSlug}`}>Все уроки темы</Link>
      </p>
    </nav>
  );
}
