"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RocknRoll_One } from "next/font/google";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const rocknrollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 770);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      
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
            width: "100%",
            padding: "0 clamp(20px, 3vw, 60px)",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ロゴ */}
          <Link
            href="/top"
            className={rocknrollOne.className}
            style={{
              fontSize: "clamp(14px, 1.25vw, 24px)",
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
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

          {/* デスクトップナビゲーション */}
          {!isMobile && <DesktopNav />}
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMobile && <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </>
  );
};

export default Header;

