/**
 * 案件関連のtRPC Router
 * 案件の登録、取得、更新など
 */

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// 案件登録用のスキーマ
const CreateProjectSchema = z.object({
    userId: z.string().uuid(),
    category: z.enum(["photographer", "model", "artist", "creator"]),
    title: z.string().min(1, "依頼タイトルを入力してください"),
    detail: z.string().min(1, "依頼詳細を入力してください"),
    minBudget: z.number().int().min(0, "0以上の数値を入力してください"),
    maxBudget: z.number().int().min(0, "0以上の数値を入力してください"),
});

export const projectRouter = createTRPCRouter({
    // 案件を登録
    createProject: publicProcedure
        .input(CreateProjectSchema)
        .mutation(async ({ input, ctx }) => {

            // 最低報酬額が最高報酬額以下であることを確認
            if (input.minBudget > input.maxBudget) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "最低報酬額は最高報酬額以下にしてください",
                });
            }

            const project = await ctx.prisma.orderProject.create({
                data: {
                    userId: input.userId,
                    category: input.category,
                    title: input.title,
                    detail: input.detail,
                    minBudget: input.minBudget,
                    maxBudget: input.maxBudget,
                },
            });

            return {
                success: true,
                projectId: project.id,
            };
        }),

    // ユーザーの案件一覧を取得
    getUserProjects: publicProcedure
        .input(
            z.object({
                userId: z.string().uuid(),
            })
        )
        .query(async ({ input, ctx }) => {
            const projects = await ctx.prisma.orderProject.findMany({
                where: {
                    userId: input.userId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return projects;
        }),

    // 案件の詳細を取得
    getProjectById: publicProcedure
        .input(
            z.object({
                projectId: z.string().uuid(),
            })
        )
        .query(async ({ input, ctx }) => {
            const project = await ctx.prisma.orderProject.findUnique({
                where: {
                    id: input.projectId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            ordererProfile: true,
                        },
                    },
                },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "案件が見つかりませんでした",
                });
            }

            return project;
        }),
});
