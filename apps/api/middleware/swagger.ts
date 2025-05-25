import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";

export const swaggerMiddleware = () => {
  const app = new Hono();
  app.use("", swaggerUI({ url: "/docs" }));
  return app;
};
