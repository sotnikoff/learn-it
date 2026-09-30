export class NotFoundError extends Error {}

export class TopicNotFoundError extends NotFoundError {
  constructor(topicSlug: string) {
    super(`Тема «${topicSlug}» не найдена`);
  }
}

export class LessonNotFoundError extends NotFoundError {
  constructor(topicSlug: string, lessonSlug: string) {
    super(`Урок «${lessonSlug}» в теме «${topicSlug}» не найден`);
  }
}
