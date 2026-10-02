import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import type { ContentRepository } from "@/application/ports/content-repository";
import type { Category } from "@/domain/category";
import type { Lesson } from "@/domain/lesson";
import type { Topic, TopicSummary } from "@/domain/topic";
import { categoriesFileSchema, lessonFileSchema, topicFileSchema } from "./schemas";

// Slug попадает в путь к файлу, поэтому пропускаем только безопасные символы.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toSummary = ({ slug, title, analogy, summary, lessonCount }: Topic): TopicSummary => ({
  slug,
  title,
  analogy,
  summary,
  lessonCount,
});

/**
 * Адаптер: контент лежит в локальных JSON-файлах.
 *
 *   <contentDir>/categories.json
 *   <contentDir>/topics/<topic>/topic.json
 *   <contentDir>/topics/<topic>/lessons/<lesson>.json
 */
export class JsonContentRepository implements ContentRepository {
  constructor(private readonly contentDir: string) {}

  /** Каждая тема должна входить ровно в одну категорию — иначе это ошибка контента. */
  async listCategories(): Promise<Category[]> {
    const file = await this.read("categories.json", categoriesFileSchema);
    if (!file) throw new Error("Нет файла categories.json");

    const topics = new Map((await this.listTopics()).map((t) => [t.slug, t]));
    const placed = new Set<string>();

    const categories = file.map((category) => ({
      ...category,
      topics: category.topics.map((slug) => {
        const topic = topics.get(slug);
        if (!topic) {
          throw new Error(`Категория «${category.slug}» ссылается на тему «${slug}», но её нет`);
        }
        if (placed.has(slug)) {
          throw new Error(`Тема «${slug}» указана в categories.json больше одного раза`);
        }
        placed.add(slug);
        return topic;
      }),
    }));

    const orphans = [...topics.keys()].filter((slug) => !placed.has(slug));
    if (orphans.length > 0) {
      throw new Error(`Темы без категории в categories.json: ${orphans.join(", ")}`);
    }

    return categories;
  }

  async listTopics(): Promise<TopicSummary[]> {
    const entries = await readdir(path.join(this.contentDir, "topics"), { withFileTypes: true });
    const slugs = entries
      .filter((e) => e.isDirectory() && SLUG.test(e.name))
      .map((e) => e.name)
      .sort();

    const topics = await Promise.all(slugs.map((slug) => this.findTopic(slug)));
    return topics.filter((t): t is Topic => t !== null).map(toSummary);
  }

  async findTopic(slug: string): Promise<Topic | null> {
    if (!SLUG.test(slug)) return null;
    const file = await this.read(path.join("topics", slug, "topic.json"), topicFileSchema);
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

    return {
      slug,
      title: file.title,
      analogy: file.analogy,
      summary: file.summary,
      lessonCount: lessons.length,
      lessons,
    };
  }

  async findLesson(topicSlug: string, lessonSlug: string): Promise<Lesson | null> {
    if (!SLUG.test(topicSlug) || !SLUG.test(lessonSlug)) return null;
    const file = await this.read(
      path.join("topics", topicSlug, "lessons", `${lessonSlug}.json`),
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
      raw = await readFile(path.join(this.contentDir, relativePath), "utf8");
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
