import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import { z } from "zod";

// Load .env explicitly from the project root directory
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  OAUTH_SERVER_URL: z.string().url("OAUTH_SERVER_URL must be a valid URL"),
  APP_ID: z.string().optional(),
  COOKIE_SECRET: z.string().optional(),
  BUILT_IN_FORGE_API_URL: z.string().url().optional(),
  BUILT_IN_FORGE_API_KEY: z.string().optional(),
  ownerOpenId: z.string().optional(),
  // Email (Resend) — used to notify the site owner about new leads.
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().min(1).default("LearnQuest <onboarding@resend.dev>"),
  NOTIFICATION_EMAIL: z
    .string()
    .email("NOTIFICATION_EMAIL must be a valid email address")
    .optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  if (result.data.NODE_ENV === "production" && !result.data.APP_ID) {
    console.error("❌ APP_ID is required in production for OAuth login.");
    process.exit(1);
  }

  if (result.data.NODE_ENV === "production" && (!result.data.COOKIE_SECRET || result.data.COOKIE_SECRET.length < 32)) {
    console.error("❌ COOKIE_SECRET must be at least 32 characters in production.");
    process.exit(1);
  }

  return {
    ...result.data,
    appId: result.data.APP_ID || "development-app",
    cookieSecret:
      result.data.COOKIE_SECRET || crypto.randomBytes(32).toString("hex"),
    forgeApiUrl: result.data.BUILT_IN_FORGE_API_URL,
    forgeApiKey: result.data.BUILT_IN_FORGE_API_KEY,
    resendApiKey: result.data.RESEND_API_KEY,
    emailFrom: result.data.EMAIL_FROM,
    notificationEmail: result.data.NOTIFICATION_EMAIL,
  };
};

export const env = parseEnv();
export const ENV = env;