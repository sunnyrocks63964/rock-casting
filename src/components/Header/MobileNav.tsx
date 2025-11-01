"use client";

import React from "react";
import Link from "next/link";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "343px",
        height: "645px",
        background: "rgba(0, 0, 0, 0.90)",
        borderRadius: "10px",
        zIndex: 40,
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
        }}
        aria-label="閉じる"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 23 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.707107"
            y1="1.29289"
            x2="21.9203"
            y2="22.5061"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="21.9203"
            y1="1.70711"
            x2="0.707107"
            y2="22.9203"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* メニュー項目 */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginTop: "60px",
          alignItems: "center",
        }}
      >
        <Link
          href="#pricing"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "700",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          料金
        </Link>
        <Link
          href="#casts"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "700",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          キャスト一覧
        </Link>
        <Link
          href="/receive-work"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          仕事を受ける
        </Link>
        <Link
          href="/order-work"
          onClick={onClose}
          style={{
            color: "white",
            fontSize: "12px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            width: "100%",
          }}
        >
          仕事を依頼する
        </Link>

        {/* 新規登録ボタン */}
        <Link
          href="/register"
          onClick={onClose}
          style={{
            marginTop: "30px",
            width: "218px",
            height: "38px",
            background: "#D70202",
            borderRadius: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontFamily: "Noto Sans JP",
            fontWeight: "700",
            textDecoration: "none",
          }}
        >
          新規登録はこちら
        </Link>

        {/* ログインボタン */}
        <Link
          href="/login"
          onClick={onClose}
          style={{
            width: "218px",
            height: "38px",
            background: "white",
            borderRadius: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            fontSize: "14px",
            fontFamily: "Noto Sans JP",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          ログインはこちら
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;

