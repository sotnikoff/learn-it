import type { Lesson } from "@/domain/lesson";
import { AnalogyTable } from "./analogy-table";

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article>
      <header>
        <h1>{lesson.title}</h1>
        <p>
          <strong>{lesson.term}</strong> — это как <em>{lesson.analogy}</em>.
        </p>
        <p>{lesson.plain}</p>
      </header>

      {lesson.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      ))}

      <AnalogyTable pairs={lesson.mapping} />

      {lesson.caveat && (
        <aside>
          <h2>Где аналогия хромает</h2>
          <p>{lesson.caveat}</p>
        </aside>
      )}

      <footer>
        <h2>Запомнить</h2>
        <p>{lesson.takeaway}</p>
      </footer>
    </article>
  );
}
