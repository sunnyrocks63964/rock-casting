"use client";

import React from "react";
import Link from "next/link";
import { RocknRoll_One } from "next/font/google";

const rocknrollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
});

const Header = () => {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #374151",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ロゴ */}
        <Link
          href="/"
          className={rocknrollOne.className}
          style={{
            fontSize: "1.5rem",
            color: "white",
            textDecoration: "none",
            transition: "color 0.3s ease",
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
          ROCK CASTING
        </Link>

        {/* 右側のナビゲーションとログインボタン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* ナビゲーションリンク */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Link
              href="#pricing"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
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
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
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
              href="#receive-work"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
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
              href="#order-work"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
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
              仕事を発注する
            </Link>
          </nav>

          {/* ログインボタン */}
          <Link
            href="/login"
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "white";
            }}
          >
            ログインはこちら
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
