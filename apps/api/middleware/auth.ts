import { Hono } from "hono";

export const authMiddleware = (token: string) => {
  const app = new Hono();

  app.use("/*", async (c, next) => {
    if (c.req.path.startsWith("/auth/")) return next();

    const authHeader = c.req.header("Authorization");
    const bearerToken = authHeader?.split(" ")[1];

    if (bearerToken !== token) {
      return c.json({ message: "Not Authorized" }, 401);
    }

    return next();
  });

  return app;
};
