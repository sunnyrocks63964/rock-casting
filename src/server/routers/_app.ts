/**
 * メインtRPC Router
 * すべてのサブルーターを統合
 */

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { messageRouter } from "./message";
import { projectRouter } from "./project";
import { favoriteRouter } from "./favorite";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  message: messageRouter,
  project: projectRouter,
  favorite: favoriteRouter,
});

export type AppRouter = typeof appRouter;

