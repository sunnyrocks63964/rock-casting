/**
 * メインtRPC Router
 * すべてのサブルーターを統合
 */

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

