export type LessonSection = {
  heading: string;
  paragraphs: string[];
};

/** Одна строка таблицы «в технологии → в жизни». */
export type AnalogyPair = {
  tech: string;
  real: string;
};

export type LessonSummary = {
  slug: string;
  title: string;
  analogy: string;
};

export type Lesson = LessonSummary & {
  term: string;
  plain: string;
  sections: LessonSection[];
  mapping: AnalogyPair[];
  /** Где аналогия перестаёт работать. */
  caveat?: string;
  takeaway: string;
};
