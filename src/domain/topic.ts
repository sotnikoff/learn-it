import type { LessonSummary } from "./lesson";

export type TopicSummary = {
  slug: string;
  title: string;
  analogy: string;
  summary: string;
  lessonCount: number;
};

export type Topic = TopicSummary & {
  /** Уроки в порядке прохождения. */
  lessons: LessonSummary[];
};
