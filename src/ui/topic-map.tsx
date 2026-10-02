import Link from "next/link";
import type { Topic } from "@/domain/topic";
import type { OutlineItem } from "./lesson-outline";
import styles from "./topic-map.module.css";

type Props = {
  topic: Pick<Topic, "slug" | "title" | "lessons">;
  currentSlug: string;
  /** Разделы текущего урока — показываются под ним. */
  outline: OutlineItem[];
};

function MapNav({ topic, currentSlug, outline }: Props) {
  return (
    <nav aria-label="Оглавление темы" className={styles.nav}>
      <p className={styles.back}>
        <Link href="/">Все темы</Link>
      </p>
      <p className={styles.topic}>
        <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
      </p>
      <ol className={styles.lessons}>
        {topic.lessons.map((lesson) => {
          const current = lesson.slug === currentSlug;
          return (
            <li key={lesson.slug} className={styles.lesson}>
              <Link
                href={`/topics/${topic.slug}/${lesson.slug}`}
                className={styles.lessonLink}
                aria-current={current ? "page" : undefined}
              >
                {lesson.title}
              </Link>
              {current && (
                <ul className={styles.outline}>
                  {outline.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Карта темы: на широком экране — липкая колонка слева,
 * на узком — сворачиваемый блок над уроком.
 */
export function TopicMap(props: Props) {
  return (
    <>
      <aside className={styles.sidebar}>
        <MapNav {...props} />
      </aside>
      <details className={styles.collapsible}>
        <summary className={styles.collapsibleSummary}>Оглавление темы</summary>
        <MapNav {...props} />
      </details>
    </>
  );
}
