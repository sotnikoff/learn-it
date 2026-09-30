import Link from "next/link";
import type { LessonSummary } from "@/domain/lesson";

type Props = {
  topicSlug: string;
  lessons: LessonSummary[];
};

export function LessonList({ topicSlug, lessons }: Props) {
  return (
    <ol>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>
          <Link href={`/topics/${topicSlug}/${lesson.slug}`}>{lesson.title}</Link>
          {" — "}
          {lesson.analogy}
        </li>
      ))}
    </ol>
  );
}
