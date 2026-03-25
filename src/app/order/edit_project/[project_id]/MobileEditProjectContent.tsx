"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import { Form, Button, message } from "antd";
import MobileProjectForm, { type ProjectFormValues } from "@/components/ProjectForm/MobileProjectForm";

function MobileEditProjectContent() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.project_id as string;
    const { userId, isLoading, hasOrdererProfile } = useUser();
    const [form] = Form.useForm();

    const { data: projectData, isLoading: isLoadingProject, error: projectError } = trpc.project.getProjectById.useQuery(
        { projectId },
        { enabled: !!projectId, retry: false }
    );

    const updateProjectMutation = trpc.project.updateProject.useMutation();

    // 認証・権限チェック
    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/top/caster"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    // 案件オーナーチェック + フォーム初期化
    useEffect(() => {
        if (isLoadingProject || !projectData || !userId) return;

        if (projectError) {
            console.error("案件情報取得エラー:", projectError);
            message.error("案件情報の取得に失敗しました");
            router.push("/order/mypage");
            return;
        }

        if (projectData.userId !== userId) {
            message.error("この案件を編集する権限がありません");
            router.push("/order/mypage");
            return;
        }

        form.setFieldsValue({
            category: projectData.category,
            title: projectData.title,
            detail: projectData.detail,
            minBudget: projectData.minBudget,
            maxBudget: projectData.maxBudget,
        });
    }, [projectData, isLoadingProject, projectError, userId, form, router]);

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

    if (isLoading || !userId || !hasOrdererProfile || isLoadingProject || !projectData) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                読み込み中...
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <LoginedHeader />
            <LoginedNavBar />
            <div style={{ flex: 1, backgroundColor: "#060606", padding: "20px 15px" }}>
                <div style={{ maxWidth: "100%", margin: "0 auto" }}>
                    <h1
                        style={{
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginBottom: "20px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        案件を編集
                    </h1>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ width: "100%" }}>
                        <MobileProjectForm
                            form={form}
                            initialValues={{
                                category: projectData.category,
                                title: projectData.title,
                                detail: projectData.detail,
                                minBudget: projectData.minBudget,
                                maxBudget: projectData.maxBudget,
                            }}
                        />
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateProjectMutation.isPending}
                                style={{
                                    backgroundColor: "#d70202",
                                    borderColor: "#d70202",
                                    height: "38px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    borderRadius: "90px",
                                    padding: "0 40px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    width: "277px",
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

export default MobileEditProjectContent;
