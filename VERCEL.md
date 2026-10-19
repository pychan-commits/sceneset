# Vercel deployment

SceneSet's Vercel deployment is a static client deployment. Vercel runs `pnpm build:vercel`, which uses `vite.vercel.config.ts` and emits the browser bundle to `dist/public`.

The Express/TypeScript server remains available for the managed full-stack deployment, but it is not deployed as Vercel serverless functions. `.vercelignore` keeps backend source and database migration files out of the Vercel deployment context, preventing raw `.ts` files from being treated as public routes.

`vercel.json` rewrites the client-side routes (`/app/*`, `/share/*`, `/shared`, and `/login`) to the built `index.html` while leaving static assets and `/api/platform/config.js` as real files.

Deployment changes should be committed from the connected GitHub identity so Vercel can verify the author.
