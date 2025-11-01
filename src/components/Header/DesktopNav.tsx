import React from "react";
import Link from "next/link";

const DesktopNav = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
      }}
    >
      {/* ナビゲーションリンク */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}
      >
        <Link
          href="#pricing"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "clamp(12px, 1.05vw, 20px)",
            fontWeight: "700",
            transition: "color 0.3s ease",
            padding: "0 clamp(20px, 3.4vw, 65px) 0 0",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "white";
          }}
        >
          料金
        </Link>
        <Link
          href="#casts"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "clamp(12px, 1.05vw, 20px)",
            fontWeight: "700",
            transition: "color 0.3s ease",
            padding: "0 clamp(25px, 4.2vw, 80px) 0 0",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "white";
          }}
        >
          キャスト一覧
        </Link>
        <Link
          href="/receive-work"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "clamp(12px, 1.05vw, 20px)",
            fontWeight: "500",
            transition: "color 0.3s ease",
            padding: "0 clamp(25px, 4.2vw, 80px) 0 0",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "white";
          }}
        >
          仕事を受ける
        </Link>
        <Link
          href="/order-work"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "clamp(12px, 1.05vw, 20px)",
            fontWeight: "500",
            transition: "color 0.3s ease",
            padding: "0 clamp(25px, 4.2vw, 80px) 0 0",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = "white";
          }}
        >
          仕事を依頼する
        </Link>
      </nav>

      {/* ログインボタン */}
      <Link
        href="/login"
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "clamp(8px, 0.6vw, 12px) clamp(15px, 1.6vw, 30px)",
          borderRadius: "90px",
          textDecoration: "none",
          fontSize: "clamp(12px, 1.05vw, 20px)",
          fontWeight: "700",
          border: "1px solid white",
          transition: "all 0.3s ease",
          display: "inline-block",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLElement;
          target.style.backgroundColor = "black";
          target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLElement;
          target.style.backgroundColor = "white";
          target.style.color = "black";
        }}
      >
        ログインはこちら
      </Link>
    </div>
  );
};

export default DesktopNav;

