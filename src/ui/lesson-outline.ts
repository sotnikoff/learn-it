import type { Lesson } from "@/domain/lesson";

export type OutlineItem = { id: string; title: string };

export const MAPPING_ID = "mapping";
export const MAPPING_TITLE = "Словарик аналогии";
export const CAVEAT_ID = "caveat";
export const CAVEAT_TITLE = "Где аналогия хромает";
export const TAKEAWAY_ID = "takeaway";
export const TAKEAWAY_TITLE = "Запомнить";

export const sectionId = (index: number) => `section-${index + 1}`;

/** Якоря разделов урока — одни и те же для текста урока и оглавления. */
export function lessonOutline(lesson: Lesson): OutlineItem[] {
  const items = lesson.sections.map((section, i) => ({ id: sectionId(i), title: section.heading }));
  if (lesson.mapping.length > 0) items.push({ id: MAPPING_ID, title: MAPPING_TITLE });
  if (lesson.caveat) items.push({ id: CAVEAT_ID, title: CAVEAT_TITLE });
  items.push({ id: TAKEAWAY_ID, title: TAKEAWAY_TITLE });
  return items;
}
