import Link from "next/link";
import type { TopicSummary } from "@/domain/topic";

export function TopicList({ topics }: { topics: TopicSummary[] }) {
  if (topics.length === 0) return <p>Тем пока нет.</p>;

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.slug}>
          <h3>
            <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
          </h3>
          <p>
            <strong>Аналогия:</strong> {topic.analogy}
          </p>
          <p>{topic.summary}</p>
        </li>
      ))}
    </ul>
  );
}
