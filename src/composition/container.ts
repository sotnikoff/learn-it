import path from "node:path";
import type { ContentRepository } from "@/application/ports/content-repository";
import { makeGetLesson } from "@/application/use-cases/get-lesson";
import { makeGetTopic } from "@/application/use-cases/get-topic";
import { makeListTopics } from "@/application/use-cases/list-topics";
import { JsonContentRepository } from "@/infrastructure/content/json/json-content-repository";

/**
 * Composition root — единственное место, где приложение узнаёт про конкретные адаптеры.
 * Чтобы сменить источник правды, добавьте сюда новую ветку и задайте CONTENT_SOURCE.
 */
const sources: Record<string, () => ContentRepository> = {
  json: () => new JsonContentRepository(path.join(process.cwd(), "content", "topics")),
};

function createContentRepository(): ContentRepository {
  const source = process.env.CONTENT_SOURCE ?? "json";
  const create = sources[source];
  if (!create) {
    throw new Error(
      `Неизвестный CONTENT_SOURCE «${source}». Доступны: ${Object.keys(sources).join(", ")}`,
    );
  }
  return create();
}

const content = createContentRepository();

export const listTopics = makeListTopics(content);
export const getTopic = makeGetTopic(content);
export const getLesson = makeGetLesson(content);
