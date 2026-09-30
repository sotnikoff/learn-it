import Link from "next/link";
import type { TopicSummary } from "@/domain/topic";
import { Equation } from "./equation";
import styles from "./topic-list.module.css";

export function TopicList({ topics }: { topics: TopicSummary[] }) {
  if (topics.length === 0) return <p>Тем пока нет.</p>;

  return (
    <ul className={styles.list}>
      {topics.map((topic) => (
        <li key={topic.slug} className={styles.item}>
          <h3>
            <Link href={`/topics/${topic.slug}`} className={styles.link}>
              <Equation term={topic.title} analogy={topic.analogy} size="row" />
            </Link>
          </h3>
          <p className={styles.summary}>{topic.summary}</p>
        </li>
      ))}
    </ul>
  );
}
