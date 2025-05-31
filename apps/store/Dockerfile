FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock components.json eslint.config.mjs ./
COPY nx.json tsconfig.base.json ./
COPY shared/ ./shared/
COPY prisma/ ./prisma/
COPY apps/store/ ./apps/store/

RUN bun install --frozen-lockfile
RUN bun run db:generate
RUN bun run store:build

FROM nginx:alpine AS production

COPY --from=build /app/dist/apps/store /usr/share/nginx/html
COPY apps/store/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
