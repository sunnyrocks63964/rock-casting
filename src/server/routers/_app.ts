/**
 * メインtRPC Router
 * すべてのサブルーターを統合
 */

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { messageRouter } from "./message";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;

