import type { TopicSummary } from "./topic";

export type Category = {
  slug: string;
  title: string;
  description: string;
  /** Темы в порядке показа. */
  topics: TopicSummary[];
};
