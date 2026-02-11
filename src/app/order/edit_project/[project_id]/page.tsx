"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import { Form, Button, message } from "antd";
import ProjectForm, { type ProjectFormValues } from "@/components/ProjectForm";

function EditProjectContent() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.project_id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [form] = Form.useForm();

    // 案件データを取得
    const { data: projectData, isLoading: isLoadingProject, error: projectError } = trpc.project.getProjectById.useQuery(
        { projectId },
        {
            enabled: !!projectId,
            retry: false,
        }
    );

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 案件更新のmutation
    const updateProjectMutation = trpc.project.updateProject.useMutation();

    // 認証チェック
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                router.push("/login");
                return;
            }

            setUserId(session.user.id);
        };

        checkAuth();
    }, [router]);

    // ユーザーデータ取得後の権限チェック
    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        if (userError) {
            console.error("ユーザー情報取得エラー:", userError);
            router.push("/login");
            return;
        }

        if (userData) {
            if (!userData.hasOrdererProfile) {
                router.push("/top/caster");
                return;
            }
            setIsAuthorized(true);
        }
    }, [userData, isLoadingUser, userError, router]);

    // 案件データ取得後の権限チェックとフォーム初期化
    useEffect(() => {
        if (isLoadingProject) {
            return;
        }

        if (projectError) {
            console.error("案件情報取得エラー:", projectError);
            message.error("案件情報の取得に失敗しました");
            router.push("/order/mypage");
            return;
        }

        if (projectData && userId) {
            // 案件の所有者か確認
            if (projectData.userId !== userId) {
                message.error("この案件を編集する権限がありません");
                router.push("/order/mypage");
                return;
            }

            // フォームに初期値を設定
            form.setFieldsValue({
                category: projectData.category,
                title: projectData.title,
                detail: projectData.detail,
                minBudget: projectData.minBudget,
                maxBudget: projectData.maxBudget,
            });

            setIsLoading(false);
        }
    }, [projectData, isLoadingProject, projectError, userId, form, router]);

    // フォーム送信処理
    const handleSubmit = async (values: ProjectFormValues) => {
        if (!userId || !projectId) {
            message.error("ユーザー情報または案件情報が取得できませんでした");
            return;
        }

        if (values.minBudget > values.maxBudget) {
            message.error("最低報酬額は最高報酬額以下にしてください");
            return;
        }

        try {
            const result = await updateProjectMutation.mutateAsync({
                projectId,
                userId,
                category: values.category,
                title: values.title,
                detail: values.detail,
                minBudget: values.minBudget,
                maxBudget: values.maxBudget,
            });

            if (result.success) {
                message.success("案件を更新しました");
                router.push("/order/mypage");
            }
        } catch (error) {
            console.error("案件更新エラー:", error);
            message.error("案件の更新に失敗しました");
        }
    };

    if (isLoading || isLoadingProject || isLoadingUser) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                読み込み中...
            </div>
        );
    }

    if (!isAuthorized || !userId || !projectData) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <LoginedHeader />
            <LoginedNavBar />
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#060606",
                    padding: "20px 200px",
                }}
            >
                <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                    <h1
                        style={{
                            color: "white",
                            fontSize: "36px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginBottom: "40px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        案件を編集
                    </h1>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        style={{ width: "100%" }}
                    >
                        <ProjectForm form={form} />
                        {/* 送信ボタン */}
                        <div style={{ textAlign: "center" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateProjectMutation.isPending}
                                style={{
                                    backgroundColor: "#d70202",
                                    borderColor: "#d70202",
                                    height: "74px",
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    borderRadius: "90px",
                                    padding: "0 80px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                変更を保存する
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function EditProjectPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                    }}
                >
                    読み込み中...
                </div>
            }
        >
            <EditProjectContent />
        </Suspense>
    );
}
