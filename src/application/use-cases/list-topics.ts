import type { ContentRepository } from "@/application/ports/content-repository";
import type { TopicSummary } from "@/domain/topic";

export const makeListTopics =
  (content: ContentRepository) => (): Promise<TopicSummary[]> =>
    content.listTopics();
