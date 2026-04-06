"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { Tooltip } from "antd";

interface CastDescriptionWithTooltipProps {
  description: string;
  paragraphStyle: React.CSSProperties;
}

const CastDescriptionWithTooltip = ({
  description,
  paragraphStyle,
}: CastDescriptionWithTooltipProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el === null) {
      return;
    }
    const update = () => {
      const next =
        Math.ceil(el.scrollHeight) > Math.ceil(el.clientHeight) + 1;
      setIsTruncated(next);
    };
    update();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    observer?.observe(el);
    return () => observer?.disconnect();
  }, [description, isTruncated]);

  const paragraph = (
    <p ref={ref} style={paragraphStyle}>
      {description}
    </p>
  );

  if (!isTruncated) {
    return paragraph;
  }

  return (
    <Tooltip
      title={
        <span
          style={{
            display: "block",
            whiteSpace: "pre-wrap",
            maxWidth: 400,
            maxHeight: "min(60vh, 480px)",
            overflowY: "auto",
          }}
        >
          {description}
        </span>
      }
      placement="bottom"
      mouseEnterDelay={0.2}
      styles={{
        root: { maxWidth: 420 },
        container: { maxWidth: 420 },
      }}
    >
      {paragraph}
    </Tooltip>
  );
};

export default CastDescriptionWithTooltip;
