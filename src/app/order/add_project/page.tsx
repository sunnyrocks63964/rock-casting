"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc/client";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import { Form, Input, Radio, InputNumber, Button, message } from "antd";

const { TextArea } = Input;

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

type JobCategory = "photographer" | "model" | "artist" | "creator";

function AddProjectContent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [form] = Form.useForm();

    // 現在のユーザー情報を取得
    const { data: userData, isLoading: isLoadingUser, error: userError } = trpc.auth.getCurrentUser.useQuery(
        { userId: userId! },
        {
            enabled: !!userId,
            retry: false,
        }
    );

    // 案件登録のmutation
    const createProjectMutation = trpc.project.createProject.useMutation();

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
            setIsLoading(false);
        }
    }, [userData, isLoadingUser, userError, router]);

    // フォーム送信処理
    const handleSubmit = async (values: {
        category: JobCategory;
        title: string;
        detail: string;
        minBudget: number;
        maxBudget: number;
    }) => {
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
                router.push("/order/message_list");
            }
        } catch (error) {
            console.error("案件登録エラー:", error);
            message.error("案件の登録に失敗しました");
        }
    };

    if (isLoading) {
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

    if (!isAuthorized || !userId) {
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
                        新しい仕事を依頼
                    </h1>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            detail: DEFAULT_DETAIL_TEMPLATE,
                        }}
                        style={{ width: "100%" }}
                    >
                        {/* Step1: カテゴリ選択 */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "30px 40px",
                                marginBottom: "20px",
                            }}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    Step1
                                </span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        marginLeft: "20px",
                                    }}
                                >
                                    依頼したいカテゴリを選んでください
                                </span>
                            </div>
                            <Form.Item
                                name="category"
                                rules={[{ required: true, message: "カテゴリを選択してください" }]}
                            >
                                <Radio.Group>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <Radio
                                            value="photographer"
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            フォトグラファー
                                        </Radio>
                                        <Radio
                                            value="model"
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            モデル
                                        </Radio>
                                        <Radio
                                            value="artist"
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            アーティスト
                                        </Radio>
                                        <Radio
                                            value="creator"
                                            style={{
                                                fontSize: "20px",
                                                fontFamily: "'Noto Sans JP', sans-serif",
                                            }}
                                        >
                                            クリエイター
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </Form.Item>
                        </div>

                        {/* Step2: 依頼内容 */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "30px 40px",
                                marginBottom: "20px",
                            }}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    Step2
                                </span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        marginLeft: "20px",
                                    }}
                                >
                                    仕事の内容を入力してください
                                </span>
                            </div>
                            <Form.Item
                                label={
                                    <span
                                        style={{
                                            fontSize: "20px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        依頼タイトル
                                    </span>
                                }
                                name="title"
                                rules={[{ required: true, message: "依頼タイトルを入力してください" }]}
                            >
                                <Input
                                    style={{
                                        height: "38px",
                                        fontSize: "16px",
                                        borderRadius: "10px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <span
                                        style={{
                                            fontSize: "20px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                        }}
                                    >
                                        依頼詳細
                                    </span>
                                }
                                name="detail"
                                rules={[{ required: true, message: "依頼詳細を入力してください" }]}
                            >
                                <TextArea
                                    rows={20}
                                    style={{
                                        fontSize: "16px",
                                        borderRadius: "10px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                />
                            </Form.Item>
                        </div>

                        {/* Step3: 報酬額設定 */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "30px 40px",
                                marginBottom: "40px",
                            }}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    Step3
                                </span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        marginLeft: "20px",
                                    }}
                                >
                                    報酬額を指定してください
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Form.Item
                                    name="minBudget"
                                    rules={[
                                        { required: true, message: "最低報酬額を入力してください" },
                                        { type: "number", min: 0, message: "0以上の数値を入力してください" },
                                    ]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber
                                        placeholder="0"
                                        style={{
                                            width: "160px",
                                            height: "39px",
                                            fontSize: "16px",
                                            borderRadius: "10px",
                                        }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                                    />
                                </Form.Item>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    円
                                </span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        margin: "0 10px",
                                    }}
                                >
                                    ~
                                </span>
                                <Form.Item
                                    name="maxBudget"
                                    rules={[
                                        { required: true, message: "最高報酬額を入力してください" },
                                        { type: "number", min: 0, message: "0以上の数値を入力してください" },
                                    ]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber
                                        placeholder="0"
                                        style={{
                                            width: "160px",
                                            height: "39px",
                                            fontSize: "16px",
                                            borderRadius: "10px",
                                        }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                                    />
                                </Form.Item>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                    }}
                                >
                                    円
                                </span>
                            </div>
                        </div>

                        {/* 送信ボタン */}
                        <div style={{ textAlign: "center" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
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
                                新しい仕事を登録する
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function AddProjectPage() {
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
            <AddProjectContent />
        </Suspense>
    );
}
