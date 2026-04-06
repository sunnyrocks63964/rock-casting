"use client";

import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import cast01 from "./images/cast_01.png";
import { buildCastDisplayItems } from "./castData";
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

  const allCasts = useMemo(() => buildCastDisplayItems(cast01.src), []);

  const desktopCasts = allCasts.filter((cast) => cast.category === activeTab);

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
          casts={allCasts}
        />
      ) : (
        <DesktopCast
          activeTab={activeTab}
          tabs={tabs}
          casts={desktopCasts}
          onTabChange={setActiveTab}
        />
      )}
    </section>
  );
};

export default Cast;
