import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@/libs/trpc";

export const trpcMiddleware = () => {
  const app = new Hono();
  const trpc = trpcServer({
    router: appRouter,
  });
  app.use("", trpc);
  return app;
};
