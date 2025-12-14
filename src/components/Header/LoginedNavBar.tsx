"use client";

import React from "react";
import Link from "next/link";

// Figmaから取得した画像URL
const img211 = "https://www.figma.com/api/mcp/asset/c9f50273-2f4c-4a14-b11b-8ad5d78c21f1";

const LoginedNavBar = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: "87px",
                left: 0,
                right: 0,
                height: "39px",
                backgroundColor: "#ff6d00",
                zIndex: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "clamp(20px, 4vw, 60px)",
                gap: "clamp(20px, 3vw, 40px)",
            }}
        >
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                キャスト検索
            </Link>
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                メッセージ
            </Link>
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                案件管理
            </Link>
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                パッケージ予約
            </Link>
            <Link
                href="#"
                style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    lineHeight: "normal",
                    textAlign: "center",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            >
                お気に入り
            </Link>
            <img
                src={img211}
                alt="通知"
                style={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                }}
            />
        </div>
    );
};

export default LoginedNavBar;

