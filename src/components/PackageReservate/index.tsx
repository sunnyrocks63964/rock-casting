"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputNumber, Button } from "antd";
import Image from "next/image";
import topOrderBgIcon from "../TopOrder/images/top_order_bg.png";

type ProfessionType = 
    | "photographer"
    | "model"
    | "stylist"
    | "hair_makeup"
    | "video_creator"
    | "web_designer";

interface Profession {
    id: ProfessionType;
    name: string;
    imagePath: string;
}

const professions: Profession[] = [
    { id: "photographer", name: "フォトグラファー", imagePath: "/images/package/package_01-photographer.png" },
    { id: "model", name: "モデル", imagePath: "/images/package/package_02-model.png" },
    { id: "stylist", name: "スタイリスト", imagePath: "/images/package/package_03-stylist.png" },
    { id: "hair_makeup", name: "ヘアメイク", imagePath: "/images/package/package_04-hair_makeup.png" },
    { id: "video_creator", name: "動画クリエイター", imagePath: "/images/package/package_05-video_creater.png" },
    { id: "web_designer", name: "WEBデザイナー", imagePath: "/images/package/package_06-web_designer.png" },
];

const PackageReservate = () => {
    const router = useRouter();
    const [counts, setCounts] = useState<Record<ProfessionType, number>>({
        photographer: 0,
        model: 0,
        stylist: 0,
        hair_makeup: 0,
        video_creator: 0,
        web_designer: 0,
    });

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    const handleCountChange = (professionId: ProfessionType, value: number | null) => {
        setCounts((prev) => ({
            ...prev,
            [professionId]: value ?? 0,
        }));
    };

    const handleSearchClick = () => {
        // 選択された職種と人数をURLパラメータとして渡す
        const selectedProfessions: Array<{ profession: ProfessionType; count: number }> = [];
        
        Object.entries(counts).forEach(([profession, count]) => {
            if (count > 0) {
                selectedProfessions.push({
                    profession: profession as ProfessionType,
                    count,
                });
            }
        });

        if (selectedProfessions.length === 0) {
            return;
        }

        // URLパラメータを構築
        const params = new URLSearchParams();
        selectedProfessions.forEach(({ profession, count }) => {
            params.append("professions", `${profession}:${count}`);
        });

        router.push(`/order/package_reservate/serched?${params.toString()}`);
    };

    return (
        <>
            {/* パッケージ予約とは？セクション（黒背景） */}
            <div
                style={{
                    backgroundColor: "#060606",
                    paddingTop: "120px",
                    paddingBottom: "60px",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "40px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "clamp(20px, 2.5vw, 27px) clamp(50px, 5vw, 100px)",
                            margin: "0 auto",
                            maxWidth: "958px",
                            boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={topOrderBgIcon.src}
                            alt="パッケージ予約"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: 0.3,
                            }}
                        />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    marginBottom: "16px",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    color: "black",
                                    textAlign: "center",
                                }}
                            >
                                パッケージ予約とは？
                            </h2>
                            <p
                                style={{
                                    fontSize: "16px",
                                    lineHeight: "1.8",
                                    color: "black",
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                同じ職種のキャストや、異なる職種のキャストを複数名まとめて予約できる機能です。システムが自動的にキャストを選出し、契約手続きまで一括で完了させます。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 希望職種を選択セクション（白背景） */}
            <div
                style={{
                    backgroundColor: "white",
                    paddingTop: "60px",
                    paddingBottom: "80px",
                }}
            >
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        padding: "0 clamp(20px, 4vw, 60px)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "36px",
                            fontWeight: "700",
                            marginBottom: "50px",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: "black",
                            textAlign: "center",
                        }}
                    >
                        希望職種を選択
                    </h2>

                    {/* 職種グリッド */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
                            gap: "50px",
                            marginBottom: "60px",
                            justifyContent: "center",
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {professions.map((profession) => (
                            <div
                                key={profession.id}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: "100%",
                                    maxWidth: "300px",
                                    margin: "0 auto",
                                }}
                            >
                                {/* 職種カード（画像と職種名） */}
                                <div
                                    style={{
                                        backgroundColor: "#282828",
                                        borderRadius: "10px",
                                        padding: "25px",
                                        border: "1px solid #d3d3d3",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                                        width: "100%",
                                    }}
                                >
                                    {/* 画像 */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "167px",
                                            position: "relative",
                                            marginBottom: "24px",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Image
                                            src={profession.imagePath}
                                            alt={profession.name}
                                            fill
                                            style={{
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    {/* 職種名 */}
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            marginBottom: 0,
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            color: "white",
                                            textAlign: "center",
                                        }}
                                    >
                                        {profession.name}
                                    </h3>
                                </div>

                                {/* 人数選択（カードの外） */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        width: "100%",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            color: "black",
                                        }}
                                    >
                                        人数を選択
                                    </span>
                                    <InputNumber
                                        min={0}
                                        value={counts[profession.id]}
                                        onChange={(value) => handleCountChange(profession.id, value)}
                                        controls={false}
                                        style={{
                                            width: "50px",
                                            height: "27px",
                                            border: "1px solid black",
                                        }}
                                        styles={{
                                            input: {
                                                backgroundColor: "white",
                                                borderColor: "black",
                                                color: "black",
                                                border: "none",
                                            },
                                        }}
                                        onFocus={(e) => {
                                            const target = e.currentTarget;
                                            target.style.borderColor = "black";
                                            target.style.boxShadow = "none";
                                        }}
                                        onBlur={(e) => {
                                            const target = e.currentTarget;
                                            target.style.borderColor = "black";
                                        }}
                                        onMouseEnter={(e) => {
                                            const target = e.currentTarget;
                                            target.style.borderColor = "black";
                                        }}
                                        onMouseLeave={(e) => {
                                            const target = e.currentTarget;
                                            target.style.borderColor = "black";
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontFamily: "'Noto Sans JP', sans-serif",
                                            color: "black",
                                        }}
                                    >
                                        人
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* キャストを検索するボタン */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "60px",
                        }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSearchClick}
                            style={{
                                backgroundColor: "#d70202",
                                borderColor: "#d70202",
                                height: "74px",
                                fontSize: "24px",
                                fontWeight: "700",
                                padding: "0 100px",
                                borderRadius: "90px",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                color: "white",
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget;
                                target.style.backgroundColor = "#e52222";
                                target.style.borderColor = "#e52222";
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget;
                                target.style.backgroundColor = "#d70202";
                                target.style.borderColor = "#d70202";
                            }}
                        >
                            キャストを検索する
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PackageReservate;
