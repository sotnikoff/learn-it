import type { ContentRepository } from "@/application/ports/content-repository";
import { TopicNotFoundError } from "@/domain/errors";
import type { Topic } from "@/domain/topic";

export const makeGetTopic =
  (content: ContentRepository) =>
  async (slug: string): Promise<Topic> => {
    const topic = await content.findTopic(slug);
    if (!topic) throw new TopicNotFoundError(slug);
    return topic;
  };
