"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import { Form, Button, message } from "antd";
import MobileProjectForm, { type ProjectFormValues } from "@/components/ProjectForm/MobileProjectForm";

const DEFAULT_DETAIL_TEMPLATE = `【 概要 】 
採用サイトおよび会社紹介パンフレットに使用する、スチール写真の撮影をお願いいたします。

【 依頼内容 】 
弊社オフィス内での業務風景や、社員のポートレート、集合写真などの撮影（計100枚程度を想定）
・執務エリアでの作業風景
・会議・打ち合わせの様子
・社員のプロフィール写真
・オフィス外観・内装のイメージカット

【 納期 】
 ◯月◯日ごろ（詳細は打ち合わせにて決定）

【 契約金額(税抜) 】
 ◯◯円〜（ご提案内容や実績に応じて相談させてください）

【 重視する点・経験 】
・人物の自然な表情を引き出せる方
・ビジネスシーンにふさわしい明るさ・色調のレタッチスキル（Photoshop等）
・企業の広報用写真の撮影実績がある方

【 応募方法 】
・簡単な自己紹介と、過去のポートフォリオ（WebサイトやSNSでも可）をご提示ください。
・条件提示にてお見積もり金額の入力をお願いします。`;

function MobileAddProjectContent() {
    const router = useRouter();
    const { userId, isLoading, hasOrdererProfile } = useUser();
    const [form] = Form.useForm();

    const createProjectMutation = trpc.project.createProject.useMutation();

    useEffect(() => {
        if (isLoading) return;
        if (!userId) { router.push("/login"); return; }
        if (!hasOrdererProfile) { router.push("/top/caster"); return; }
    }, [isLoading, userId, hasOrdererProfile, router]);

    const handleSubmit = async (values: ProjectFormValues) => {
        if (!userId) {
            message.error("ユーザー情報が取得できませんでした");
            return;
        }
        if (values.minBudget > values.maxBudget) {
            message.error("最低報酬額は最高報酬額以下にしてください");
            return;
        }
        try {
            const result = await createProjectMutation.mutateAsync({
                userId,
                category: values.category,
                title: values.title,
                detail: values.detail,
                minBudget: values.minBudget,
                maxBudget: values.maxBudget,
            });
            if (result.success) {
                message.success("案件を登録しました");
                router.push("/order/mypage");
            }
        } catch (error) {
            console.error("案件登録エラー:", error);
            message.error("案件の登録に失敗しました");
        }
    };

    if (isLoading || !userId || !hasOrdererProfile) {
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
                        新しい仕事を依頼
                    </h1>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ width: "100%" }}>
                        <MobileProjectForm form={form} defaultDetailTemplate={DEFAULT_DETAIL_TEMPLATE} />
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
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
                                案件登録する
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MobileAddProjectContent;
