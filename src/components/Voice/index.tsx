"use client";

import React, { useState, useEffect } from "react";
import voice01 from "./images/voice_01.png";
import voice02 from "./images/voice02.png";
import DesktopVoice from "./DesktopVoice";
import MobileVoice from "./MobileVoice";

const Voice = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const voices = [
    {
      category: "マッチングした業種：",
      categoryLine2: "スクールカメラマン",
      name: "費用：",
      nameLine2: "1案件3万円",
      content:
        "弊社の年間行事撮影を他社に依頼していましたが、クオリティが低く困っていました。ROCK CASTINGさんに相談したところ、代表がスクールカメラマン出身で教育現場に精通されていたため依頼を決定。結果、写真のクオリティが格段に向上し、同じ担当カメラマンを全行事で継続していただけるため、毎回探す手間もなくなりました。プリント納品まで対応いただき、保護者からも好評で、年間を通してお任せできる安心感があります。",
      profileImage: voice01,
      accent: "blue",
    },
    {
      category: "マッチングした業種：",
      categoryLine2: "広告カメラマン、モデル",
      name: "費用：",
      nameLine2: "1案件10万円",
      content:
        "初依頼の際に実生活依頼量約が高い受けてとりました。業界経験がなくカメラマンとモデルの組み合わせ依頼したが、ROCK CASTINGさんに相談したところ、急加盟先の紹介をすることで、自分たちのクライアントのニーズに合わせた実施ができました。急成長が予測されにアピーリングしてくださり、撮影から制品までご対応いただく業界にて実績高い方々をご紹介させていただきました。今回協議品としてそでてきました。当初加留がない構件でも安心して入れたお頼れました。",
      profileImage: voice02,
      accent: "default",
    },
    {
      category: "マッチングした業種：",
      categoryLine2: "カメラマン・ヘアメイク、",
      categoryLine3: "スタイリスト",
      name: "費用：",
      nameLine2: "1案件20万円",
      content:
        "写真業界での経営に大きな影響があり、スタイリスト、ヘアメイクとしてプロジェクトの成功に貢献できることができました。ROCK CASTINGさんに協働したところ、人材のマッチングだけでなく企業選定も支援しいただきました。そのおかげで最適な人材をアサインしてもらい続けるため、人材との全然の勤開闊性を送迎できました。明日も株式上アイケアなサバイバル開闢としていました。明日にとおそれるので人材のセス助からプシートップでアクシして頂けるため信頼して仕事ができました。",
      profileImage: voice01,
      accent: "default",
    },
  ];

  return isMobile ? (
    <MobileVoice voices={voices} />
  ) : (
    <DesktopVoice voices={voices} />
  );
};

export default Voice;
