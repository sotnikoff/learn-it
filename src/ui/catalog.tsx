import Link from "next/link";
import type { Category } from "@/domain/category";
import styles from "./catalog.module.css";
import { Equation } from "./equation";
import { plural } from "./plural";

/** Категории — раскрывающиеся блоки, внутри — темы. */
export function Catalog({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return <p>Тем пока нет.</p>;

  return (
    <div className={styles.catalog}>
      {categories.map((category) => (
        <details key={category.slug} id={category.slug} className={styles.category}>
          <summary className={styles.summary}>
            <h3 className={styles.name}>{category.title}</h3>
            <span className={styles.count}>
              {plural(category.topics.length, ["тема", "темы", "тем"])}
              <span className={styles.chevron} aria-hidden="true" />
            </span>
            <span className={styles.description}>{category.description}</span>
          </summary>

          <ul className={styles.topics}>
            {category.topics.map((topic) => (
              <li key={topic.slug}>
                <Link href={`/topics/${topic.slug}`} className={styles.topic}>
                  <Equation term={topic.title} analogy={topic.analogy} size="compact" />
                  <span className={styles.meta}>
                    {plural(topic.lessonCount, ["урок", "урока", "уроков"])}
                  </span>
                  <span className={styles.blurb}>{topic.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
