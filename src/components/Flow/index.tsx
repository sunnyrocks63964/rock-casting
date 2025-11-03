"use client";

import React, { useState, useEffect } from "react";
import flow01 from "./images/flow_01.png";
import flow02 from "./images/flow_02.png";
import flow03 from "./images/flow_03.png";
import flow04 from "./images/flow_04.png";
import flow05 from "./images/flow_05.png";
import flow06 from "./images/flow_06.png";
import DesktopFlow from "./DesktopFlow";
import MobileFlow from "./MobileFlow";

const Flow = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const steps = [
    {
      number: "1",
      title: "新規アカウント登録・ログイン",
      description:
        "会員登録無料。企業情報とメールアドレスでカンタンに登録をすることができます。",
      image: flow01.src,
    },
    {
      number: "2",
      title: "お仕事依頼（オファー作成）",
      description:
        "ご希望、プロの候補に応じた依頼をすることができます。候補者一覧からお仕事をリクエストができます",
      image: flow02.src,
    },
    {
      number: "3",
      title: "事務局審査",
      description:
        "利用審査の審査通過後、仕事のスムーズな受託について当社で審査を行います。",
      image: flow03.src,
    },
    {
      number: "4",
      title: "キャストとの調整",
      description:
        "品質のある方面ではコピー、お客さまとキャスト間でのやり取りが可能です。",
      image: flow04.src,
    },
    {
      number: "5",
      title: "お支払い",
      description:
        "すべての作業は事前審査に一率で明確にですぞ、オファー内でお時効を支払することができます。",
      image: flow05.src,
    },
    {
      number: "6",
      title: "キャスティング成立",
      description:
        "審査的な契約の成立はキャストと合作書してできたぞ、お気に入りをお願いできます。",
      image: flow06.src,
    },
  ];

  return isMobile ? (
    <MobileFlow steps={steps} />
  ) : (
    <DesktopFlow steps={steps} />
  );
};

export default Flow;
