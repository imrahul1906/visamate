# VisaMate

A monorepo for the VisaMate project, managed with **npm workspaces**.

---

## Project Structure

```
VisaMate/
├── package.json          ← Root workspace controller (run commands here)
├── README.md
├── node_modules/         ← All dependencies live here (auto-generated)
│
├── web/                  ← Next.js web app
│   ├── package.json
│   └── ...
│
└── scripts/              ← Standalone scripts (e.g. itinerary generator)
    └── itenrary/
        └── generate/
            └── generate.ts
```

---

## Getting Started

> All commands are run from the **root `VisaMate/` folder**, not inside `web/`.

### 1. Install all dependencies

```bash
npm install
```

This single command installs dependencies for **all packages** in the monorepo.
You never need to `cd` into `web/` and run `npm install` separately.

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Start production server

```bash
npm run start
```

### 5. Run the itinerary generator script

```bash
npm run generate
```

### 6. Lint

```bash
npm run lint
```

---

## How npm Workspaces Works

When you run `npm install` at the root, npm:

1. Reads the `workspaces` field in the root `package.json`
2. Finds all listed packages (`web/`, etc.)
3. Installs **all dependencies** into the root `node_modules/`
4. Creates **symlinks** inside `web/node_modules/` pointing back to the root

This means:
- Dependencies shared across packages (e.g. `jszip`, `pdf-lib`) are installed **once**, not duplicated
- Each package still works independently — `import` statements inside `web/` resolve correctly through the symlinks
- No version conflicts — there is only one copy of each dependency

---

## Adding a New Package (Future)

If you add another app or library (e.g. a `shared/` utilities package):

1. Create the folder with its own `package.json`
2. Add it to the root `package.json` workspaces array:

```json
"workspaces": [
  "web",
  "shared"
]
```

3. Run `npm install` from root — done.

---

## CI / Deployment

In your CI pipeline (GitHub Actions, Vercel, etc.), you only need:

```bash
npm install          # installs everything
npm run build        # builds the web app
```

No need to `cd` into subfolders or run multiple install steps.

> **Vercel note:** Set the root directory to `web/` in Vercel project settings,
> but keep `npm install` running from the monorepo root by setting the
> install command to `cd ../.. && npm install` or use Vercel's monorepo preset.

---

## Scripts Reference

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies across the monorepo |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build Next.js for production |
| `npm run start` | Start Next.js production server |
| `npm run lint` | Run ESLint on the web app |
| `npm run generate` | Run the itinerary generator script |