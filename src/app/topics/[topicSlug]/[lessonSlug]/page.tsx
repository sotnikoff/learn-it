import type { Metadata } from "next";
import { orNotFound } from "@/app/_lib/or-not-found";
import { getLesson, getTopic, listTopics } from "@/composition/container";
import { LessonLayout } from "@/ui/lesson-layout";
import { LessonNav } from "@/ui/lesson-nav";
import { lessonOutline } from "@/ui/lesson-outline";
import { LessonView } from "@/ui/lesson-view";
import { TopicMap } from "@/ui/topic-map";

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
  const { topic, lesson, previous, next, position, total } = await orNotFound(
    getLesson(topicSlug, lessonSlug),
  );

  return (
    <LessonLayout
      sidebar={<TopicMap topic={topic} currentSlug={lesson.slug} outline={lessonOutline(lesson)} />}
    >
      <LessonView topic={topic} lesson={lesson} position={position} total={total} />
      <LessonNav topicSlug={topic.slug} previous={previous} next={next} />
    </LessonLayout>
  );
}
