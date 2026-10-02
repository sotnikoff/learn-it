import type { ContentRepository } from "@/application/ports/content-repository";
import type { Category } from "@/domain/category";

export const makeListCategories =
  (content: ContentRepository) => (): Promise<Category[]> =>
    content.listCategories();
