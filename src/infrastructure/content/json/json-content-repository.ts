import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import type { ContentRepository } from "@/application/ports/content-repository";
import type { Lesson } from "@/domain/lesson";
import type { Topic, TopicSummary } from "@/domain/topic";
import { lessonFileSchema, topicFileSchema } from "./schemas";

// Slug попадает в путь к файлу, поэтому пропускаем только безопасные символы.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Адаптер: контент лежит в локальных JSON-файлах.
 *
 *   <rootDir>/<topic>/topic.json
 *   <rootDir>/<topic>/lessons/<lesson>.json
 */
export class JsonContentRepository implements ContentRepository {
  constructor(private readonly rootDir: string) {}

  async listTopics(): Promise<TopicSummary[]> {
    const entries = await readdir(this.rootDir, { withFileTypes: true });
    const slugs = entries
      .filter((e) => e.isDirectory() && SLUG.test(e.name))
      .map((e) => e.name)
      .sort();

    const topics = await Promise.all(slugs.map((slug) => this.findTopic(slug)));
    return topics
      .filter((t): t is Topic => t !== null)
      .map(({ slug, title, analogy, summary }) => ({ slug, title, analogy, summary }));
  }

  async findTopic(slug: string): Promise<Topic | null> {
    if (!SLUG.test(slug)) return null;
    const file = await this.read(path.join(slug, "topic.json"), topicFileSchema);
    if (!file) return null;

    const lessons = await Promise.all(
      file.lessons.map(async (lessonSlug) => {
        const lesson = await this.findLesson(slug, lessonSlug);
        if (!lesson) {
          throw new Error(
            `Тема «${slug}» ссылается на урок «${lessonSlug}», но файла урока нет`,
          );
        }
        return { slug: lesson.slug, title: lesson.title, analogy: lesson.analogy };
      }),
    );

    return { slug, title: file.title, analogy: file.analogy, summary: file.summary, lessons };
  }

  async findLesson(topicSlug: string, lessonSlug: string): Promise<Lesson | null> {
    if (!SLUG.test(topicSlug) || !SLUG.test(lessonSlug)) return null;
    const file = await this.read(
      path.join(topicSlug, "lessons", `${lessonSlug}.json`),
      lessonFileSchema,
    );
    return file ? { slug: lessonSlug, ...file } : null;
  }

  /** Отсутствующий файл — это «не найдено»; битый файл — ошибка. */
  private async read<S extends z.ZodType>(
    relativePath: string,
    schema: S,
  ): Promise<z.infer<S> | null> {
    let raw: string;
    try {
      raw = await readFile(path.join(this.rootDir, relativePath), "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }

    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      throw new Error(`Некорректный контент в ${relativePath}: ${parsed.error.message}`);
    }
    return parsed.data;
  }
}
