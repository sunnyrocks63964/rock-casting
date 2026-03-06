"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RocknRoll_One } from "next/font/google";
import DesktopLoginedHeader from "./DesktopLoginedHeader";
import MobileLoginedNav from "./MobileLoginedNav";

const rocknrollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
});

const LoginedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 770);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // トップページへの遷移先を決定（パスベースの判定）
  const getTopPath = (): string => {
    if (pathname.startsWith("/caster") || pathname.startsWith("/top/caster")) {
      return "/top/caster";
    }
    if (pathname.startsWith("/order") || pathname.startsWith("/top/order")) {
      return "/top/order";
    }
    // デフォルト
    return "/top/order";
  };

  return (
    <>
      <header
        style={{
          backgroundColor: "#060606",
          borderBottom: "1px solid #374151",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "clamp(12px, 1.2vw, 20px) clamp(20px, 4vw, 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ロゴ */}
          <Link
            href={isMobile ? "/top" : getTopPath()}
            className={rocknrollOne.className}
            style={{
              fontSize: isMobile ? "clamp(14px, 1.25vw, 24px)" : "24px",
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
              whiteSpace: "nowrap",
              textAlign: "center",
              lineHeight: "normal",
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

          {/* ハンバーガーメニューボタン（モバイル用） */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
              }}
              aria-label="メニュー"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="10" fill="white" />
                <line
                  x1="9"
                  y1="18"
                  x2="39"
                  y2="18"
                  stroke="black"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="25"
                  x2="39"
                  y2="25"
                  stroke="black"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="32"
                  x2="39"
                  y2="32"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}

          {/* デスクトップヘッダー */}
          {!isMobile && <DesktopLoginedHeader />}
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMobile && (
        <MobileLoginedNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
};

export default LoginedHeader;
