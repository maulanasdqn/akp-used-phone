FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock eslint.config.mjs ./
COPY nx.json tsconfig.base.json ./
COPY shared/ ./shared/
COPY prisma/ ./prisma/
COPY apps/api/ ./apps/api/

RUN bun install --frozen-lockfile
RUN bun run db:generate
RUN bun run api:build

FROM oven/bun:1-slim AS production

WORKDIR /app

COPY --from=base /app/dist/apps/api ./dist/apps/api
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

EXPOSE 3000

CMD ["bun", "run", "dist/apps/api/main.js"]
