import type { Metadata } from "next";
import Link from "next/link";
import { orNotFound } from "@/app/_lib/or-not-found";
import { getLesson, getTopic, listTopics } from "@/composition/container";
import { LessonNav } from "@/ui/lesson-nav";
import { LessonView } from "@/ui/lesson-view";

type Props = {
  params: Promise<{ topicSlug: string; lessonSlug: string }>;
};

export async function generateStaticParams() {
  const topics = await Promise.all((await listTopics()).map((t) => getTopic(t.slug)));
  return topics.flatMap((topic) =>
    topic.lessons.map((lesson) => ({ topicSlug: topic.slug, lessonSlug: lesson.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicSlug, lessonSlug } = await params;
  const { topic, lesson } = await orNotFound(getLesson(topicSlug, lessonSlug));
  return { title: `${lesson.title} · ${topic.title}`, description: lesson.plain };
}

export default async function LessonPage({ params }: Props) {
  const { topicSlug, lessonSlug } = await params;
  const { topic, lesson, previous, next } = await orNotFound(
    getLesson(topicSlug, lessonSlug),
  );

  return (
    <>
      <p>
        <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
      </p>
      <LessonView lesson={lesson} />
      <LessonNav topicSlug={topic.slug} previous={previous} next={next} />
    </>
  );
}
