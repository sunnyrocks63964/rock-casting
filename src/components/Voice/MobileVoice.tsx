import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import voiceCoverSp from "./images/voice_cover_sp.png";

interface Voice {
  category: string;
  categoryLine2: string;
  categoryLine3?: string;
  name: string;
  nameLine2: string;
  content: string;
  profileImage: StaticImageData;
  accent: string;
}

interface MobileVoiceProps {
  voices: Voice[];
}

const MobileVoice = ({ voices }: MobileVoiceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 5秒ごとに自動で次のスライドに切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % voices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [voices.length]);

  return (
    <section
      style={{
        paddingTop: "3rem",
        paddingBottom: "3rem",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              color: "black",
              marginBottom: "0.5rem",
              fontFamily: "RocknRoll One",
            }}
          >
            VOICE
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "black",
              fontFamily: "Noto Sans JP",
            }}
          >
            お客様の声
          </p>
        </div>

        {/* カルーセル */}
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              transition: "transform 0.5s ease",
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {voices.map((voice, index) => (
              <div
                key={index}
                style={{
                  minWidth: "100%",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #b1b1b1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    maxWidth: "342px",
                    margin: "0 auto",
                  }}
                >
                  {/* 上部の背景画像エリア */}
                  <div
                    style={{
                      position: "relative",
                      height: "234px",
                      backgroundColor: "white",
                      borderBottom: "1px solid #d7d7d7",
                    }}
                  >
                    {/* 背景画像 */}
                    <Image
                      src={voiceCoverSp}
                      alt="background"
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    {/* カテゴリテキスト */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        color: "white",
                        maxWidth: "150px",
                        zIndex: 1,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Noto Sans JP",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        {voice.category}
                        <br />
                        {voice.categoryLine2}
                        {voice.categoryLine3 && (
                          <>
                            <br />
                            {voice.categoryLine3}
                          </>
                        )}
                      </p>
                    </div>

                    {/* プロフィール画像 */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "1.5rem",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid white",
                        backgroundColor: "white",
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src={voice.profileImage}
                        alt="profile"
                        width={80}
                        height={80}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* 費用テキスト */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                        color: "white",
                        zIndex: 1,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Noto Sans JP",
                          fontSize: "14px",
                          fontWeight: "bold",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        {voice.name}
                        <br />
                        {voice.nameLine2}
                      </p>
                    </div>
                  </div>

                  {/* コンテンツエリア */}
                  <div
                    style={{
                      padding: "1.5rem 1rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Noto Sans JP",
                        fontSize: "14px",
                        color: "black",
                        lineHeight: "1.7",
                        margin: 0,
                      }}
                    >
                      {voice.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* インジケーター */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {voices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "#d1d5db" : "#e5e7eb",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileVoice;

