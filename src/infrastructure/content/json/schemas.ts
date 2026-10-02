import { z } from "zod";

export const topicFileSchema = z.object({
  title: z.string().min(1),
  analogy: z.string().min(1),
  summary: z.string().min(1),
  /** Slug-и уроков в порядке прохождения. */
  lessons: z.array(z.string().min(1)),
});

export const lessonFileSchema = z.object({
  title: z.string().min(1),
  term: z.string().min(1),
  analogy: z.string().min(1),
  plain: z.string().min(1),
  sections: z.array(
    z.object({
      heading: z.string().min(1),
      paragraphs: z.array(z.string().min(1)).min(1),
    }),
  ),
  mapping: z.array(z.object({ tech: z.string().min(1), real: z.string().min(1) })),
  caveat: z.string().min(1).optional(),
  takeaway: z.string().min(1),
});

export const categoriesFileSchema = z.array(
  z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1),
    /** Slug-и тем в порядке показа. */
    topics: z.array(z.string().min(1)).min(1),
  }),
);

export type TopicFile = z.infer<typeof topicFileSchema>;
export type LessonFile = z.infer<typeof lessonFileSchema>;
