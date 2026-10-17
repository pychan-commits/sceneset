import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createEventForUser, createWorkspaceForUser, listEventsForUser, listWorkspacesForUser } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
  workspace: router({
    list: protectedProcedure.query(({ ctx }) => listWorkspacesForUser(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({ name: z.string().min(2).max(160) }))
      .mutation(({ ctx, input }) => createWorkspaceForUser(ctx.user.id, input.name)),
  }),
  events: router({
    list: protectedProcedure.query(({ ctx }) => listEventsForUser(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        workspaceId: z.number().int().positive(),
        name: z.string().min(2).max(180),
        eventDate: z.coerce.date(),
        venue: z.string().max(180).optional(),
        city: z.string().max(120).optional(),
        goal: z.string().max(2000).optional(),
        attendeeTarget: z.number().int().min(0).max(100000).optional(),
      }))
      .mutation(({ ctx, input }) => createEventForUser(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
