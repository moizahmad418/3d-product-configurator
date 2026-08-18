# Deploying to GitHub Pages

## Short version

1. Push this folder's **contents** to a new GitHub repo on the `main` branch.
   Name the repo **anything you like**.
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish.
   It prints your live URL.

That's it. No file needs editing, and the repo name doesn't matter.

## Why the repo name doesn't matter

A GitHub Pages project site is served from a sub-folder:

    https://<username>.github.io/<repo-name>/

So the built files have to know that `<repo-name>` prefix, or every request for
JavaScript, CSS and 3D models goes to the wrong place and the page comes up
blank.

The workflow works the prefix out on its own, from the repository it is running
in:

| Repo name                | Base path used   | Live URL                                  |
| ------------------------ | ---------------- | ----------------------------------------- |
| `my-configurator`        | `/my-configurator/` | `username.github.io/my-configurator/`  |
| `product-configurator-3d`| `/product-configurator-3d/` | `username.github.io/product-configurator-3d/` |
| `username.github.io`     | `/`              | `username.github.io/`                     |

It passes that value to the build as `VITE_BASE_PATH`, which `vite.config.ts`
reads into Vite's `base` option. The app code already builds its model URLs as
`import.meta.env.BASE_URL + 'models/…'`, so the 3D assets follow along
automatically.

Rename the repo later and the next push just rebuilds with the new path.

## Running it locally

```bash
npm install     # npm.cmd install if PowerShell blocks "npm"
npm run dev     # open the URL it prints
```

Locally the base path is `/`, which is what you want for `localhost`.

To check a production build before pushing:

```bash
npm run build
npm run preview
```

## Notes

- **Don't commit `node_modules/` or `dist/`** — both are already in
  `.gitignore`. The workflow reinstalls and rebuilds them on GitHub.
- **The `three` bundle is ~1.4 MB** (about 400 KB gzipped) and the models add a
  few MB more. Fine for Pages, but the first load isn't instant.
- **Lint warnings won't block a deploy.** The workflow runs ESLint for
  visibility but is set to `continue-on-error`. A real TypeScript error *will*
  stop the deploy, which is intentional — it would produce a broken site.
- **Pull requests build but don't deploy**, so you can check a branch compiles
  without touching the live site.

## If the page comes up blank

Open the browser console (F12). If you see 404s for files under `/assets/…`,
the base path is wrong — check that Pages **Source** is set to **GitHub
Actions** and not "Deploy from a branch". The branch method serves whatever
files are sitting in the repo, un-built, which cannot work for a Vite project.
