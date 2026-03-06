"use client";

import React, { useEffect } from "react";
import { Form, Input, Radio, InputNumber, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export type JobCategory = "photographer" | "model" | "artist" | "creator";

export interface ProjectFormValues {
    category: JobCategory;
    title: string;
    detail: string;
    minBudget: number;
    maxBudget: number;
}

interface MobileProjectFormProps {
    form: ReturnType<typeof Form.useForm>[0];
    initialValues?: Partial<ProjectFormValues>;
    defaultDetailTemplate?: string;
}

const MobileProjectForm: React.FC<MobileProjectFormProps> = ({
    form,
    initialValues,
    defaultDetailTemplate,
}) => {
    useEffect(() => {
        if (defaultDetailTemplate && !form.getFieldValue("detail")) {
            form.setFieldsValue({ detail: defaultDetailTemplate });
        }
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [form, defaultDetailTemplate, initialValues]);

    return (
        <>
            {/* Step1: カテゴリ選択 */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "25px 25px",
                    marginBottom: "20px",
                }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "black",
                        }}
                    >
                        Step1
                    </span>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            marginLeft: "0px",
                            color: "black",
                            display: "block",
                            marginTop: "4px",
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
                                    fontSize: "16px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                フォトグラファー
                            </Radio>
                            <Radio
                                value="model"
                                style={{
                                    fontSize: "16px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                モデル
                            </Radio>
                            <Radio
                                value="artist"
                                style={{
                                    fontSize: "16px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                            >
                                アーティスト
                            </Radio>
                            <Radio
                                value="creator"
                                style={{
                                    fontSize: "16px",
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
                    padding: "25px 25px",
                    marginBottom: "20px",
                }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "black",
                        }}
                    >
                        Step2
                    </span>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            marginLeft: "0px",
                            color: "black",
                            display: "block",
                            marginTop: "4px",
                        }}
                    >
                        仕事の内容を入力してください
                    </span>
                </div>
                <Form.Item
                    label={
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
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
                            height: "31px",
                            fontSize: "16px",
                            borderRadius: "3px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            border: "1px solid black",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
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
                            borderRadius: "3px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            border: "1px solid black",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
                            }}
                        >
                            勤務地
                        </span>
                    }
                    name="workLocation"
                >
                    <Input
                        style={{
                            height: "31px",
                            fontSize: "16px",
                            borderRadius: "3px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            border: "1px solid black",
                        }}
                    />
                </Form.Item>
            </div>

            {/* Step3: 報酬額設定 */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "25px 25px",
                    marginBottom: "40px",
                }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "black",
                        }}
                    >
                        Step3
                    </span>
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "400",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            marginLeft: "0px",
                            color: "black",
                            display: "block",
                            marginTop: "4px",
                        }}
                    >
                        報酬額を指定してください
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Form.Item
                        name="budgetType"
                        initialValue="fixed"
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            style={{
                                height: "27px",
                                fontSize: "16px",
                                borderRadius: "3px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                border: "1px solid black",
                                width: "128px",
                            }}
                        >
                            <Option value="fixed">固定報酬</Option>
                        </Select>
                    </Form.Item>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
                                    width: "110px",
                                    height: "27px",
                                    fontSize: "16px",
                                    borderRadius: "3px",
                                    border: "1px solid black",
                                }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            />
                        </Form.Item>
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
                            }}
                        >
                            円
                        </span>
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
                            }}
                        >
                            ～
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
                                    width: "110px",
                                    height: "27px",
                                    fontSize: "16px",
                                    borderRadius: "3px",
                                    border: "1px solid black",
                                }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            />
                        </Form.Item>
                        <span
                            style={{
                                fontSize: "16px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "black",
                            }}
                        >
                            円
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileProjectForm;
