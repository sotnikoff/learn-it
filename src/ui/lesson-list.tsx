import Link from "next/link";
import type { LessonSummary } from "@/domain/lesson";
import styles from "./lesson-list.module.css";

type Props = {
  topicSlug: string;
  lessons: LessonSummary[];
};

export function LessonList({ topicSlug, lessons }: Props) {
  return (
    <ol className={styles.list}>
      {lessons.map((lesson) => (
        <li key={lesson.slug} className={styles.item}>
          <Link href={`/topics/${topicSlug}/${lesson.slug}`} className={styles.link}>
            <span className={styles.title}>{lesson.title}</span>
            <span className="visually-hidden"> — </span>
            <span className={styles.analogy}>{lesson.analogy}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
