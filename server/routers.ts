import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createRegistration } from "./db";
import { sendOwnerEmail } from "./_core/email";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  registrations: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        role: z.string().refine(val => ["student", "parent", "teacher"].includes(val), {
          message: "Please select a valid role"
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          // Save to database (best-effort — a missing/unreachable DB must not
          // block the owner notification, which is how leads are actually seen).
          try {
            await createRegistration({
              name: input.name,
              email: input.email,
              role: input.role,
            });
          } catch (dbError) {
            console.error("[Registration] DB write failed, continuing:", dbError);
          }

          // Notify the site owner by email.
          await sendOwnerEmail({
            subject: `New LearnQuest registration: ${input.name}`,
            text: [
              `New registration from the sign-up form.`,
              ``,
              `Name:  ${input.name}`,
              `Email: ${input.email}`,
              `Role:  ${input.role}`,
              ``,
              `Reply to this email to follow up with them directly.`,
            ].join("\n"),
            replyTo: input.email,
          });

          return {
            success: true,
            message: "Registration successful! We'll be in touch soon.",
          };
        } catch (error) {
          console.error("Registration error:", error);
          throw new Error("Failed to process registration. Please try again.");
        }
      }),

    waitlist: publicProcedure
      .input(
        z.object({
          email: z.string().email("Valid email is required"),
          plan: z.string().min(1, "Plan is required"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await sendOwnerEmail({
            subject: `Plan interest: ${input.plan}`,
            text: [
              `Someone asked to be notified about the "${input.plan}" plan from the pricing page.`,
              ``,
              `Email: ${input.email}`,
              `Plan:  ${input.plan}`,
              ``,
              `Reply to this email to reach out to them.`,
            ].join("\n"),
            replyTo: input.email,
          });

          return {
            success: true,
            message: "You're on the list! We'll email you when it's ready.",
          };
        } catch (error) {
          console.error("Waitlist error:", error);
          throw new Error("Failed to join the waitlist. Please try again.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
