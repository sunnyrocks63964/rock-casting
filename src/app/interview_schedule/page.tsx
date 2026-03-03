"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InterviewSchedule from "@/components/InterviewSchedule";

export default function InterviewSchedulePage() {
    return (
        <main
            style={{
                backgroundColor: "#060606",
                minHeight: "100vh",
            }}
        >
            <Header />
            <InterviewSchedule />
            <Footer />
        </main>
    );
}
