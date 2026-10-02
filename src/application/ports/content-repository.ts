import type { Category } from "@/domain/category";
import type { Lesson } from "@/domain/lesson";
import type { Topic, TopicSummary } from "@/domain/topic";

/**
 * Порт источника контента. Приложение знает только этот интерфейс;
 * откуда реально берутся данные (файлы, CMS, API, БД) — решает адаптер.
 */
export interface ContentRepository {
  listCategories(): Promise<Category[]>;
  listTopics(): Promise<TopicSummary[]>;
  findTopic(slug: string): Promise<Topic | null>;
  findLesson(topicSlug: string, lessonSlug: string): Promise<Lesson | null>;
}
