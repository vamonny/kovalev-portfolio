# Kirill Kovalev — Graphic Design & Visual Systems Portfolio

Интерактивное портфолио графического дизайнера и арт-директора **Кирилла Ковалёва** (*«Everything Is Connected»*).

## Стек

- **React 19 + TypeScript + Vite 8**
- **Tailwind CSS v4**
- **Custom WebGL2 Shaders** (`WebThreads`, `GlassIconReveal`, `PortfolioWarpCarousel`, `GooeyNav`)
- **Web Audio API** (синтез микро-звуков и звуковое интро без сторонних аудиофайлов)
- **Motion / GSAP / React Router**

## Локальный запуск

```bash
npm install --legacy-peer-deps
npm run dev
```

Проверка типов и продакшн-сборка:

```bash
npm run lint
npm run build
```

## Публикация на GitHub

```bash
git init
git branch -M main
git add .
git commit -m "Initial portfolio release"
git remote add origin https://github.com/<ТВОЙ_ЛОГИН>/<НАЗВАНИЕ_РЕПО>.git
git push -u origin main
```

После пуша репозиторий можно подключить напрямую к **Vercel** (`vercel.json` и `.npmrc` с `legacy-peer-deps=true` уже настроены — деплой пойдёт автоматически при каждом `git push`).
