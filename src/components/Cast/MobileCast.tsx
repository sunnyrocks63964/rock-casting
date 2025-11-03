import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface Cast {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface MobileCastProps {
  tabs: Tab[];
  casts: Cast[];
}

const MobileCast = ({ tabs, casts }: MobileCastProps) => {
  const [expandedTab, setExpandedTab] = useState<string | null>(null);

  const toggleTab = (tabId: string) => {
    setExpandedTab(expandedTab === tabId ? null : tabId);
  };

  return (
    <section
      style={{
        padding: "0",
        backgroundColor: "white",
        minHeight: "428px",
        paddingBottom: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 16px",
          paddingTop: "35px",
        }}
      >
        {/* タイトル */}
        <h2
          style={{
            fontFamily: "RocknRoll One",
            fontSize: "28px",
            fontWeight: "normal",
            color: "black",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          CAST
        </h2>
        
        {/* サブタイトル */}
        <p
          style={{
            fontFamily: "Noto Sans JP",
            fontSize: "12px",
            color: "black",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          キャスト
        </p>

        {/* アコーディオン */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {tabs.map((tab, index) => {
            const isExpanded = expandedTab === tab.id;
            const isFirst = index === 0;

            return (
              <div key={tab.id}>
                {/* タブボタン */}
                <button
                  onClick={() => toggleTab(tab.id)}
                  style={{
                    height: "62px",
                    width: "100%",
                    backgroundColor: "black",
                    border: isFirst ? "none" : "1px solid white",
                    borderRadius: isExpanded ? "5px 5px 0 0" : "5px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    fontFamily: "Noto Sans JP",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 22px",
                    boxShadow: isFirst ? "0px 4px 4px rgba(0, 0, 0, 0.25)" : "none",
                    position: "relative",
                  }}
                >
                  <span>{tab.label}</span>
                  
                  {/* プラス/マイナスアイコン */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    {/* 横線（常に表示） */}
                    <svg
                      width="14"
                      height="2"
                      viewBox="0 0 14 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0"
                        y1="1"
                        x2="14"
                        y2="1"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    
                    {/* 縦線（閉じているときのみ表示）- プラスアイコンに */}
                    {!isExpanded && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "22px",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <line
                          x1="7"
                          y1="0"
                          x2="7"
                          y2="14"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* アコーディオンコンテンツ */}
                {isExpanded && (
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "0 0 10px 10px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {casts.slice(0, 5).map((cast) => (
                      <div
                        key={cast.id}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                          display: "flex",
                          height: "140px",
                          overflow: "hidden",
                        }}
                      >
                        {/* 左側：画像 */}
                        <div
                          style={{
                            width: "100px",
                            height: "140px",
                            flexShrink: 0,
                            backgroundImage: `url(${cast.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "10px 0 0 10px",
                          }}
                        />
                        
                        {/* 右側：テキスト */}
                        <div
                          style={{
                            flex: 1,
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "Noto Sans JP",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "black",
                              margin: 0,
                              textAlign: "center",
                            }}
                          >
                            {cast.name}
                          </h3>
                          <p
                            style={{
                              fontFamily: "Noto Sans JP",
                              fontSize: "14px",
                              color: "black",
                              margin: 0,
                              lineHeight: "1.5",
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {cast.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MobileCast;

