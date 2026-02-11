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

// 案件更新用のスキーマ
const UpdateProjectSchema = z.object({
    projectId: z.string().uuid(),
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

    // 案件を更新
    updateProject: publicProcedure
        .input(UpdateProjectSchema)
        .mutation(async ({ input, ctx }) => {
            // 案件が存在するか確認
            const existingProject = await ctx.prisma.orderProject.findUnique({
                where: {
                    id: input.projectId,
                },
            });

            if (!existingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "案件が見つかりませんでした",
                });
            }

            // ユーザーが案件の所有者か確認
            if (existingProject.userId !== input.userId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "この案件を編集する権限がありません",
                });
            }

            // 最低報酬額が最高報酬額以下であることを確認
            if (input.minBudget > input.maxBudget) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "最低報酬額は最高報酬額以下にしてください",
                });
            }

            const project = await ctx.prisma.orderProject.update({
                where: {
                    id: input.projectId,
                },
                data: {
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
                            organization: {
                                select: {
                                    companyName: true,
                                },
                            },
                            ordererProfile: {
                                select: {
                                    fullName: true,
                                },
                            },
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

    // 全ての案件を取得
    getAllProjects: publicProcedure.query(async ({ ctx }) => {
        const projects = await ctx.prisma.orderProject.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        organization: {
                            select: {
                                companyName: true,
                            },
                        },
                        ordererProfile: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });

        return projects;
    }),

    // 案件を削除
    deleteProject: publicProcedure
        .input(
            z.object({
                projectId: z.string().uuid(),
                userId: z.string().uuid(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // 案件が存在するか確認
            const existingProject = await ctx.prisma.orderProject.findUnique({
                where: {
                    id: input.projectId,
                },
            });

            if (!existingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "案件が見つかりませんでした",
                });
            }

            // ユーザーが案件の所有者か確認
            if (existingProject.userId !== input.userId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "この案件を削除する権限がありません",
                });
            }

            // 案件を物理削除
            await ctx.prisma.orderProject.delete({
                where: {
                    id: input.projectId,
                },
            });

            return {
                success: true,
            };
        }),
});
