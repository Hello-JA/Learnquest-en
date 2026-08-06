import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createRegistration } from "./db";
import { notifyOwner } from "./_core/notification";

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
          // Save to database
          await createRegistration({
            name: input.name,
            email: input.email,
            role: input.role,
          });

          // Send email notification to owner
          const emailContent = `New Registration Submission\n\nName: ${input.name}\nEmail: ${input.email}\nRole: ${input.role}\n\nPlease follow up with this prospect.`;
          
          await notifyOwner({
            title: "New LearnQuest Registration",
            content: emailContent,
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
  }),
});

export type AppRouter = typeof appRouter;
