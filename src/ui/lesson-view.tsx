import Link from "next/link";
import type { Lesson } from "@/domain/lesson";
import type { TopicSummary } from "@/domain/topic";
import { AnalogyTable } from "./analogy-table";
import { ComparisonTable } from "./comparison-table";
import { Equation } from "./equation";
import { CAVEAT_ID, CAVEAT_TITLE, sectionId, TAKEAWAY_ID, TAKEAWAY_TITLE } from "./lesson-outline";
import styles from "./lesson-view.module.css";

type Props = {
  topic: Pick<TopicSummary, "slug" | "title">;
  lesson: Lesson;
  position: number;
  total: number;
};

export function LessonView({ topic, lesson, position, total }: Props) {
  return (
    <article>
      <header>
        <p className={styles.crumb}>
          <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>, урок {position} из {total}
        </p>
        <h1>
          <Equation term={lesson.title} analogy={lesson.analogy} />
        </h1>
        <p className="lede">{lesson.plain}</p>
      </header>

      {lesson.sections.map((section, i) => (
        <section key={section.heading} id={sectionId(i)} className={styles.section}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, j) => (
            <p key={j}>{paragraph}</p>
          ))}
          {section.code && (
            <pre className={styles.code}>
              <code>{section.code}</code>
            </pre>
          )}
        </section>
      ))}

      {lesson.comparison && <ComparisonTable comparison={lesson.comparison} />}

      <AnalogyTable pairs={lesson.mapping} />

      {lesson.caveat && (
        <aside id={CAVEAT_ID} className={styles.caveat}>
          <h2>{CAVEAT_TITLE}</h2>
          <p>{lesson.caveat}</p>
        </aside>
      )}

      <footer id={TAKEAWAY_ID} className={styles.takeaway}>
        <h2>{TAKEAWAY_TITLE}</h2>
        <p>{lesson.takeaway}</p>
      </footer>
    </article>
  );
}
