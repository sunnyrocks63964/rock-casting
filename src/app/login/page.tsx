"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Login from "../../components/Login";

export default function LoginPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#060606",
                color: "white",
            }}
        >
            <Header />
            <Login />
            <Footer />
        </main>
    );
}

