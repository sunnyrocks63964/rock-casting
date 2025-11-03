"use client";

import React, { useState, useEffect } from "react";
import cast01 from "./images/cast_01.png";
import DesktopCast from "./DesktopCast";
import MobileCast from "./MobileCast";

const Cast = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("photographer");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    { id: "photographer", label: "フォトグラファー" },
    { id: "model", label: "モデル" },
    { id: "artist", label: "アーティスト" },
    { id: "creator", label: "クリエイター" },
  ];

  const casts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `名前名前`,
    description:
      "モデル歴14年のフリーモデル。室内から外まで対応します。年間200本以上を撮影いたします。広告の仕事を上達継続していい、広告やポートレイト",
    image: cast01.src,
  }));

  return isMobile ? (
    <MobileCast
      tabs={tabs}
      casts={casts}
    />
  ) : (
    <DesktopCast
      activeTab={activeTab}
      tabs={tabs}
      casts={casts}
      onTabChange={setActiveTab}
    />
  );
};

export default Cast;
