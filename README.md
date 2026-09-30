# Проще говоря

Сайт, который объясняет сложные ИТ-темы бытовыми аналогиями. Первая тема — Apache Kafka через Почту России.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Архитектура

Гексагональная (порты и адаптеры). Зависимости направлены внутрь:

```
app ──▶ composition ──▶ application ──▶ domain
                │            ▲
                └▶ infrastructure ┘
```

| Слой | Папка | Что внутри |
|---|---|---|
| Домен | `src/domain` | Типы `Topic`, `Lesson`, ошибки. Без зависимостей. |
| Приложение | `src/application` | Порт `ContentRepository` и сценарии (`list-topics`, `get-topic`, `get-lesson`). |
| Инфраструктура | `src/infrastructure` | Адаптеры порта. Сейчас один — `JsonContentRepository`. |
| Сборка | `src/composition/container.ts` | Единственное место, где выбирается адаптер. |
| Входной адаптер | `src/app`, `src/ui` | Страницы Next.js, компоненты и их стили. |

Правила:

- `domain` и `application` не импортируют Next.js, `fs` и `zod`.
- Страницы обращаются только к сценариям из `container.ts`, к адаптерам — никогда.

## Как добавить тему

Код менять не нужно.

1. Создайте папку `content/topics/<slug>/`.
2. Положите в неё `topic.json`: `title`, `analogy`, `summary` и `lessons` — список slug-ов уроков в порядке прохождения.
3. Для каждого урока создайте `lessons/<slug>.json`. Образец — любой файл в `content/topics/kafka/lessons/`.

Slug — строчные латинские буквы, цифры и дефис. Формат файлов проверяется при сборке (`src/infrastructure/content/json/schemas.ts`): ошибка в контенте остановит сборку с указанием файла.

## Как заменить источник данных

1. Напишите класс, реализующий `ContentRepository` (`src/application/ports/content-repository.ts`), например `src/infrastructure/content/http/http-content-repository.ts`.
2. Зарегистрируйте его в `sources` в `src/composition/container.ts`:

   ```ts
   const sources = {
     json: () => new JsonContentRepository(...),
     http: () => new HttpContentRepository(process.env.CONTENT_API_URL!),
   };
   ```

3. Запустите с `CONTENT_SOURCE=http`.

Домен, сценарии, страницы и компоненты при этом не меняются.

## Оформление

Стили живут только во входном адаптере: токены и базовые правила — в `src/app/globals.css`, стили компонентов — в `*.module.css` рядом с ними в `src/ui`.

- **Цвета.** Каждый токен — пара «день / ночь» через `light-dark()`. Чтобы перекрасить сайт, достаточно поменять значения в `:root`.
- **Темы.** По умолчанию тема берётся из настроек ОС (`color-scheme: light dark`). Переключатель «Авто / День / Ночь» ставит `data-theme` на `<html>` и запоминает выбор в `localStorage`; «Авто» возвращает следование за ОС.
- **Шрифты.** Geologica для заголовков и Literata для текста, подключены в `src/app/fonts.ts`.
