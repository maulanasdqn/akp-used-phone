import { Hono } from "hono";
import { logger } from "hono/logger";

export const loggerMiddleware = (app: Hono) => {
  app.use(logger());
  return app;
};
