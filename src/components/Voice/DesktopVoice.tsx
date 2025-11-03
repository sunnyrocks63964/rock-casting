import React from "react";
import Image from "next/image";
import voiceCoverPc from "./images/voice_cover_pc.png";
import { StaticImageData } from "next/image";

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

interface DesktopVoiceProps {
  voices: Voice[];
}

const DesktopVoice = ({ voices }: DesktopVoiceProps) => {
  return (
    <section
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: "3rem",
              color: "black",
              marginBottom: "1rem",
              fontFamily: "RocknRoll One",
            }}
          >
            VOICE
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4b5563",
            }}
          >
            お客様の声
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {voices.map((voice, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                border: `2px solid ${voice.accent === "blue" ? "#3b82f6" : "#e5e7eb"}`,
                borderRadius: "0.5rem",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* 背景画像部分 */}
              <div
                style={{
                  position: "relative",
                  height: "240px",
                  width: "100%",
                }}
              >
                <Image
                  src={voiceCoverPc}
                  alt="background"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />

                {/* 左上のテキストエリア - category */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "white",
                    padding: "1rem",
                    maxWidth: "60%",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {voice.category}
                    {voice.categoryLine2 && (
                      <>
                        <br />
                        {voice.categoryLine2}
                      </>
                    )}
                    {voice.categoryLine3 && (
                      <>
                        <br />
                        {voice.categoryLine3}
                      </>
                    )}
                  </h3>
                </div>

                {/* 左下のテキストエリア - name */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    color: "white",
                    padding: "1rem",
                    maxWidth: "60%",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {voice.name}
                    {voice.nameLine2 && (
                      <>
                        <br />
                        {voice.nameLine2}
                      </>
                    )}
                  </p>
                </div>

                {/* 右側のプロフィール画像 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "1.5rem",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid white",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    src={voice.profileImage}
                    alt="profile"
                    width={100}
                    height={100}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {/* コンテンツエリア */}
              <div
                style={{
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  {voice.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesktopVoice;

