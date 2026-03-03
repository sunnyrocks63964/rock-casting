"use client";

import React, { Suspense } from "react";
import LoginedHeader from "@/components/Header/LoginedHeader";
import LoginedNavBar from "@/components/Header/LoginedNavBar";
import Footer from "@/components/Footer";
import PackageReservateSearched from "@/components/PackageReservateSearched";

export default function PackageReservateSearchedPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#060606",
                color: "white",
            }}
        >
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}
            >
                <LoginedHeader />
                <LoginedNavBar />
            </div>

            <Suspense
                fallback={
                    <div
                        style={{
                            minHeight: "100vh",
                            backgroundColor: "#060606",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontSize: "16px",
                                color: "white",
                            }}
                        >
                            読み込み中...
                        </div>
                    </div>
                }
            >
                <PackageReservateSearched />
            </Suspense>

            <Footer />
        </main>
    );
}
