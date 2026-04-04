"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import cast01 from "./images/cast_01.png";
import DesktopCast from "./DesktopCast";
import MobileCast from "./MobileCast";

/** Header の固定バー高さ（src/components/Header/index.tsx の height と一致） */
const CAST_ANCHOR_SCROLL_MARGIN_PX = 60;

const Cast = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("photographer");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 770);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (window.location.hash !== "#casts") return;
    const element = document.getElementById("casts");
    if (element === null) return;
    const alignToCasts = () => {
      element.scrollIntoView({ block: "start" });
    };
    alignToCasts();
    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(alignToCasts);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isMobile]);

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

  return (
    <section
      id="casts"
      style={{
        scrollMarginTop: `${CAST_ANCHOR_SCROLL_MARGIN_PX}px`,
      }}
    >
      {isMobile ? (
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
      )}
    </section>
  );
};

export default Cast;
