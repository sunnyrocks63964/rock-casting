import React, { useState, useRef } from "react";
import flowBg from "./images/flow_bg.png";

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
}

interface MobileFlowProps {
  steps: Step[];
}

const MobileFlow = ({ steps }: MobileFlowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      if (containerRef.current) {
        const cardWidth = containerRef.current.offsetWidth;
        containerRef.current.scrollTo({
          left: cardWidth * nextIndex,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      
      if (containerRef.current) {
        const cardWidth = containerRef.current.offsetWidth;
        containerRef.current.scrollTo({
          left: cardWidth * prevIndex,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const cardWidth = containerRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section
      style={{
        paddingTop: "3rem",
        paddingBottom: "3rem",
        backgroundImage: `url(${flowBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        color: "white",
      }}
    >
      {/* 背景オーバーレイ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "28px",
              color: "white",
              marginBottom: "0.5rem",
              fontFamily: "RocknRoll One",
            }}
          >
            FLOW
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "white",
              fontFamily: "Noto Sans JP",
            }}
          >
            お仕事依頼の流れ
          </p>
        </div>

        {/* カルーセル */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* カードコンテナ */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  minWidth: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  scrollSnapAlign: "center",
                  padding: "0 2rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "10px",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: "294px",
                    border: "1px solid #b1b1b1",
                  }}
                >
                  {/* 画像エリア */}
                  <div
                    style={{
                      width: "100%",
                      height: "145px",
                      backgroundImage: `url(${step.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderBottom: "1px solid #d7d7d7",
                    }}
                  ></div>

                  {/* テキストエリア */}
                  <div style={{ padding: "1rem" }}>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "0.5rem",
                        fontFamily: "Noto Sans JP",
                        color: "black",
                      }}
                    >
                      {step.number}. {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "black",
                        lineHeight: "1.5",
                        margin: 0,
                        fontFamily: "Noto Sans JP",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 左側の白い三角ボタン（前へ） */}
          {currentIndex > 0 && (
            <button
              onClick={scrollToPrev}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                zIndex: 10,
                transform: "translateY(-50%)",
              }}
              aria-label="Previous"
            >
              <svg
                width="28"
                height="49"
                viewBox="0 0 28 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "scaleX(-1)" }}
              >
                <path d="M27.75 24.2485L0 48.4972L0 -0.000175476L27.75 24.2485Z" fill="white"/>
              </svg>
            </button>
          )}

          {/* 右側の白い三角ボタン（次へ） */}
          {currentIndex < steps.length - 1 && (
            <button
              onClick={scrollToNext}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                zIndex: 10,
                transform: "translateY(-50%)",
              }}
              aria-label="Next"
            >
              <svg
                width="28"
                height="49"
                viewBox="0 0 28 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M27.75 24.2485L0 48.4972L0 -0.000175476L27.75 24.2485Z" fill="white"/>
              </svg>
            </button>
          )}
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
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (containerRef.current) {
                  const cardWidth = containerRef.current.offsetWidth;
                  containerRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "white" : "rgba(255, 255, 255, 0.5)",
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

export default MobileFlow;

