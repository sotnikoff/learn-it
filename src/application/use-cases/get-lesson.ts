import type { ContentRepository } from "@/application/ports/content-repository";
import { LessonNotFoundError, TopicNotFoundError } from "@/domain/errors";
import type { Lesson, LessonSummary } from "@/domain/lesson";
import type { Topic } from "@/domain/topic";

export type LessonInContext = {
  topic: Topic;
  lesson: Lesson;
  previous: LessonSummary | null;
  next: LessonSummary | null;
  /** Номер урока в теме, считая с 1. */
  position: number;
  total: number;
};

export const makeGetLesson =
  (content: ContentRepository) =>
  async (topicSlug: string, lessonSlug: string): Promise<LessonInContext> => {
    const topic = await content.findTopic(topicSlug);
    if (!topic) throw new TopicNotFoundError(topicSlug);

    const index = topic.lessons.findIndex((l) => l.slug === lessonSlug);
    const lesson =
      index === -1 ? null : await content.findLesson(topicSlug, lessonSlug);
    if (!lesson) throw new LessonNotFoundError(topicSlug, lessonSlug);

    return {
      topic,
      lesson,
      previous: topic.lessons[index - 1] ?? null,
      next: topic.lessons[index + 1] ?? null,
      position: index + 1,
      total: topic.lessons.length,
    };
  };
