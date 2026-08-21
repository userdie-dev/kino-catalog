# Kino Katalog

Каталог фильмов, сериалов и актёров на [Nuxt 4](https://nuxt.com) и [Nuxt UI 4](https://ui.nuxt.com), данные — из [TMDB API](https://www.themoviedb.org/documentation/api). Интерфейс на русском языке.

## Возможности

- Главная страница с подборками: популярные и высокорейтинговые фильмы, фильмы в прокате, ожидаемые премьеры, популярные сериалы и актёры.
- Списки фильмов (`/movies`), сериалов (`/tv`) и актёров (`/actors`) с переключением режима (популярное / топ рейтинга) и поиском.
- Страницы фильма, сериала и актёра: описание, актёрский состав, фильмография, похожие тайтлы, трейлер.
- Личный список сохранённых фильмов (`/saved`), хранится локально в браузере.

## Стек

- [Nuxt 4](https://nuxt.com) + [Nuxt UI 4](https://ui.nuxt.com) + Tailwind CSS 4
- [tmdb-js-web](https://www.npmjs.com/package/tmdb-js-web) — запросы к TMDB напрямую из браузера
- Vitest + Vue Test Utils для тестов

## Настройка

Установите зависимости:

```bash
pnpm install
```

Создайте файл `.env` на основе `.env.example` и укажите свой TMDB API-ключ (v4 Read Access Token):

```bash
NUXT_PUBLIC_TMDB_API_KEY=your_tmdb_read_access_token
```

## Разработка

Запуск дев-сервера на `http://localhost:3000`:

```bash
pnpm dev
```

## Продакшн

Сборка приложения:

```bash
pnpm build
```

Локальный просмотр production-сборки:

```bash
pnpm preview
```

Подробнее — в [документации по деплою Nuxt](https://nuxt.com/docs/getting-started/deployment).

## Тесты и линтинг

```bash
pnpm test          # запуск тестов
pnpm test:watch    # тесты в watch-режиме
pnpm test:coverage # тесты с покрытием
pnpm lint          # линтинг
pnpm typecheck     # проверка типов
```

## Renovate

Установите [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) на репозиторий — конфигурация уже есть в `renovate.json`.
