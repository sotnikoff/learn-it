import Link from "next/link";
import type { Lesson } from "@/domain/lesson";
import type { TopicSummary } from "@/domain/topic";
import { AnalogyTable } from "./analogy-table";
import { Equation } from "./equation";
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

      {lesson.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      ))}

      <AnalogyTable pairs={lesson.mapping} />

      {lesson.caveat && (
        <aside className={styles.caveat}>
          <h2>Где аналогия хромает</h2>
          <p>{lesson.caveat}</p>
        </aside>
      )}

      <footer className={styles.takeaway}>
        <h2>Запомнить</h2>
        <p>{lesson.takeaway}</p>
      </footer>
    </article>
  );
}
