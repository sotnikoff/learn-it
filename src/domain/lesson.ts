export type LessonSection = {
  heading: string;
  paragraphs: string[];
  /** Пример кода — показывается после абзацев. */
  code?: string;
};

/** Одна строка таблицы «в технологии → в жизни». */
export type AnalogyPair = {
  tech: string;
  real: string;
};

/** Таблица «понятие → как в каждом из вариантов», например в разных языках. */
export type Comparison = {
  columns: string[];
  rows: { label: string; cells: string[] }[];
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
  comparison?: Comparison;
  mapping: AnalogyPair[];
  /** Где аналогия перестаёт работать. */
  caveat?: string;
  takeaway: string;
};
