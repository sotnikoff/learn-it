import Link from "next/link";
import type { LessonSummary } from "@/domain/lesson";

type Props = {
  topicSlug: string;
  previous: LessonSummary | null;
  next: LessonSummary | null;
};

export function LessonNav({ topicSlug, previous, next }: Props) {
  return (
    <nav aria-label="Соседние уроки">
      <ul>
        {previous && (
          <li>
            Назад: <Link href={`/topics/${topicSlug}/${previous.slug}`}>{previous.title}</Link>
          </li>
        )}
        {next && (
          <li>
            Дальше: <Link href={`/topics/${topicSlug}/${next.slug}`}>{next.title}</Link>
          </li>
        )}
        <li>
          <Link href={`/topics/${topicSlug}`}>Все уроки темы</Link>
        </li>
      </ul>
    </nav>
  );
}
