# Проще говоря

Сайт объясняет сложные ИТ-темы бытовыми аналогиями («Kafka = Почта России»). Next.js 16 (App Router), TypeScript, гексагональная архитектура, обычный CSS.

## Команды

```
npm run dev         # http://localhost:3000
npm run build       # сборка + проверка контента схемой
npm run typecheck   # tsc --noEmit
```

Тестов и линтера нет. После любых правок запускай `npm run typecheck` и `npm run build`.

## Архитектура

Зависимости направлены только внутрь:

```
app, ui ──▶ composition ──▶ application ──▶ domain
                 │               ▲
                 └▶ infrastructure ┘
```

| Слой | Папка | Что здесь лежит | Что можно импортировать |
|---|---|---|---|
| Домен | `src/domain` | Типы (`Category`, `Topic`, `Lesson`) и ошибки | Ничего, кроме других файлов домена |
| Приложение | `src/application` | Порты (`ports/`) и сценарии (`use-cases/`) | Только `domain` |
| Инфраструктура | `src/infrastructure` | Адаптеры портов | `application/ports`, `domain`, внешние библиотеки |
| Сборка | `src/composition/container.ts` | Выбор адаптера, экспорт готовых сценариев | Всё |
| Вход | `src/app`, `src/ui` | Страницы, компоненты, стили | `composition`, типы из `domain` и `application` |

### Правила

1. В `domain` и `application` нет импортов `next`, `react`, `zod`, `node:*`, CSS и ничего из `infrastructure`.
2. Страницы и компоненты получают данные только через сценарии из `@/composition/container`. Импорт из `@/infrastructure` в `src/app` и `src/ui` запрещён.
3. Конкретный адаптер упоминается в одном файле — `container.ts`.
4. Все методы портов асинхронные (`Promise`), даже если текущий адаптер синхронный.
5. Адаптер возвращает доменные типы и проверяет внешние данные на границе (`schemas.ts`). Нет данных — возвращает `null`; битые данные — бросает ошибку.
6. «Не найдено» превращается в ошибку в сценарии (`NotFoundError` из `domain/errors.ts`), а в 404 — на странице через `orNotFound` из `src/app/_lib/or-not-found.ts`.
7. Компоненты в `src/ui` презентационные: получают готовые объекты через пропсы, данные сами не загружают.
8. Значение, которое вычисляется из данных (номер урока, соседние уроки), считается в сценарии, а не в компоненте.

### Как делать типовые изменения

**Новая тема или урок** — только контент, код не трогать:
1. файлы в `content/topics/<slug>/` — формат в `src/infrastructure/content/json/schemas.ts`, образец — `content/topics/kafka/`;
2. slug новой темы — в список `topics` нужной категории в `content/categories.json`. Порядок в списке — порядок на главной.

Каждая тема должна входить ровно в одну категорию: тема без категории, повтор или ссылка на несуществующую тему ломают сборку. Новая категория — новый объект в `categories.json`. Slug: строчные латинские буквы, цифры, дефис.

**Новое поле у урока или темы** — по порядку:
1. тип в `src/domain`;
2. схема в `src/infrastructure/content/json/schemas.ts`;
3. файлы контента;
4. компонент в `src/ui`.

**Новый сценарий** — файл в `src/application/use-cases` в виде фабрики `makeXxx(content: ContentRepository)`, затем экспорт из `container.ts`. Если не хватает данных — сначала метод в порте, потом его реализация в каждом адаптере.

**Новый источник данных** — класс в `src/infrastructure/content/<имя>/`, реализующий `ContentRepository`, и одна строка в `sources` в `container.ts`. Включается через `CONTENT_SOURCE=<имя>`. Остальные слои не меняются.

### Проверка границ

Обе команды должны ничего не выводить:

```
grep -rnE "infrastructure|\.css|from \"(next|react|zod|node:)" src/domain src/application
grep -rn "infrastructure" src/app src/ui
```

## Стили

Обычный CSS: глобальные токены в `src/app/globals.css` и CSS Modules рядом с компонентами (`src/ui/<имя>.module.css`). Tailwind, CSS-in-JS и UI-библиотеки не добавлять.

### Правила

1. **Цвета — только через токены**: `var(--bg)`, `--surface`, `--ink`, `--muted`, `--brand`, `--on-brand`, `--link`, `--tint`, `--line`. Никаких hex, `rgb()` и именованных цветов в модулях.
2. **Новый цвет** добавляется в `:root` в `globals.css` парой `light-dark(день, ночь)`. Отдельных блоков под ночную тему и медиазапросов `prefers-color-scheme` в модулях не писать.
3. **Шрифты — только через токены**: `var(--font-display)` (Geologica) для заголовков, подписей и элементов интерфейса; `var(--font-body)` (Literata) для текста. Новые шрифты не подключать.
4. **Радиус** — `var(--radius)`; у «таблеток» — `999px`.
5. **Один компонент — один модуль.** Классы в модуле в camelCase. В `globals.css` живут только токены, базовые правила для тегов и общие классы `container`, `container-wide`, `lede`, `section-title`, `visually-hidden`.
6. **Без атрибута `style`** в JSX.
7. **Размеры в `rem`**, для заголовков — `clamp()`. Ширину задают классы: `container` — читальная колонка (`--measure`) для обычных страниц, `container-wide` (`--wide`) — шапка, подвал и страница урока с боковой колонкой. Каждая страница сама оборачивает своё содержимое в один из них; компоненты свою ширину не ограничивают.
8. **Разметка семантическая**: заголовки по уровням, списки — `ul`/`ol`, таблицы — с `caption` и `scope`. Декоративные знаки получают `aria-hidden`, а смысл дублируется текстом в `visually-hidden`.

### Визуальный язык

- Главный элемент — формула «термин = аналогия», компонент `Equation` (`src/ui/equation.tsx`). Всё, что представляет тему или урок заголовком, использует его, а не собственную вёрстку.
- Фирменный фиолетовый `--brand` — для знака «=», акцентных границ и выбранного состояния. Для текста и ссылок он слишком бледный: использовать `--link`. Текст на фоне `--brand` — `--on-brand`.
- Вторичный текст — `--muted`. Поверхности (таблица, кнопки навигации) — `--surface` с границей `--line`. Врезки — `--tint`.
- Выравнивание по левому краю, одна колонка. Исключение — страница урока: слева карта темы (`TopicMap`), справа урок; уже 62rem — одна колонка, а карта сворачивается в блок над уроком. Без карточных сеток, теней, градиентов и текста капсом.
- Раскрывающиеся блоки — нативный `<details>`/`<summary>` (каталог на главной, карта темы на узком экране), без JS.
- Якоря разделов урока задаются только через `src/ui/lesson-outline.ts` — им пользуются и текст урока, и карта темы.
- Нумерация только там, где есть реальная последовательность (список уроков).
- Движение — только отклик на действие (наведение, фокус, переключение темы), через `transition` на 0.15–0.2s. Анимаций появления нет. `prefers-reduced-motion` уже учтён глобально.
- Тексты интерфейса — на русском, простыми словами, без стрелок в ссылках и кнопках.

### Темы

- По умолчанию `color-scheme: light dark` — тема берётся из ОС.
- Ручной выбор — атрибут `data-theme="light|dark"` на `<html>`; его ставят `ThemeSwitch` и `ThemeScript` (`src/ui`). Ключ в `localStorage` — `THEME_STORAGE_KEY` из `src/ui/theme.ts`.
- Компонентам знать о текущей теме не нужно: токены переключаются сами. Не читать `data-theme` и не ветвить стили по нему.

### Проверка стилей

- Любое визуальное изменение смотреть в обеих темах и на ширине около 380px — без горизонтальной прокрутки.
- Фокус с клавиатуры должен быть виден.
- Команда не должна ничего выводить (цвета вне токенов):

```
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/ui src/app --include="*.module.css" --include="*.tsx"
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
