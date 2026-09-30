import type { Metadata } from "next";
import { orNotFound } from "@/app/_lib/or-not-found";
import { getTopic, listTopics } from "@/composition/container";
import { LessonList } from "@/ui/lesson-list";

type Props = {
  params: Promise<{ topicSlug: string }>;
};

export async function generateStaticParams() {
  const topics = await listTopics();
  return topics.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicSlug } = await params;
  const topic = await orNotFound(getTopic(topicSlug));
  return { title: topic.title, description: topic.summary };
}

export default async function TopicPage({ params }: Props) {
  const { topicSlug } = await params;
  const topic = await orNotFound(getTopic(topicSlug));

  return (
    <>
      <h1>{topic.title}</h1>
      <p>
        <strong>Аналогия:</strong> {topic.analogy}
      </p>
      <p>{topic.summary}</p>
      <h2>Уроки</h2>
      <LessonList topicSlug={topic.slug} lessons={topic.lessons} />
    </>
  );
}
