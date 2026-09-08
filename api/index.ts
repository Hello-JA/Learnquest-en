/**
 * Vercel serverless entry point for the API.
 *
 * The local dev/prod server (server/_core/index.ts) runs a long-lived Express
 * process. Vercel instead invokes this exported Express app per request, so we
 * mount only what the deployed site needs: the tRPC router behind /api/trpc.
 * OAuth and the storage proxy are intentionally left out — the landing page
 * doesn't use them and they need infrastructure that isn't wired up here.
 */
import "../server/_core/env"; // validates env vars on cold start
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Anything else under /api that reaches this function is unknown.
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
