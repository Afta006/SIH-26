import { useEffect, useRef, useState } from "react";
import { C } from "../theme";

function AnimatedPath({ d, color, delay = 0 }) {
  const ref = useRef(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);

  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
  }, [d]);

  useEffect(() => {
    if (!length) return;

    if (reducedMotion.current) {
      setDrawn(true);
      return;
    }

    const t = setTimeout(() => setDrawn(true), delay);

    return () => clearTimeout(t);
  }, [length, delay]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      style={{
        strokeDasharray: length,
        strokeDashoffset: drawn ? 0 : length,
        transition: reducedMotion.current
          ? "none"
          : "stroke-dashoffset 1s ease",
      }}
    />
  );
}

export default function DepthChart({
  series,
  xLabel = "Temperature (°C)",
  maxDepth = 1000,
  height = 300,
}) {
  const width = 460;

  const padding = {
    top: 10,
    right: 16,
    bottom: 34,
    left: 46,
  };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const allValues = series.flatMap((s) =>
    s.data.map((d) => d.value)
  );

  const minX = Math.min(...allValues) - 0.5;
  const maxX = Math.max(...allValues) + 0.5;

  const xScale = (v) =>
    padding.left +
    ((v - minX) / (maxX - minX)) * plotW;

  const yScale = (d) =>
    padding.top + (d / maxDepth) * plotH;

  const depthTicks = [
    0,
    100,
    200,
    300,
    500,
    700,
    1000,
  ].filter((d) => d <= maxDepth);

  const xTicks = Array.from(
    { length: 5 },
    (_, i) =>
      minX + (i / 4) * (maxX - minX)
  );

  // Currently hovered point
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Used to prevent blinking when moving between nearby points
  const hoverTimeout = useRef(null);

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const handlePointEnter = (point) => {
    // Cancel pending hide
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    setHoveredPoint(point);
  };

  const handlePointLeave = () => {
    // Small delay prevents blinking when moving
    // from one point directly to another
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setHoveredPoint(null);
      hoverTimeout.current = null;
    }, 80);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{
          display: "block",
          overflow: "hidden",
        }}
      >
        {/* =========================
            HORIZONTAL GRID LINES
        ========================== */}
        {depthTicks.map((d) => (
          <g key={d}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yScale(d)}
              y2={yScale(d)}
              stroke={C.border}
              strokeDasharray="3 3"
            />

            <text
              x={padding.left - 8}
              y={yScale(d) + 4}
              fontSize="10"
              fill={C.dim}
              textAnchor="end"
              fontFamily="'IBM Plex Mono', monospace"
            >
              {d}m
            </text>
          </g>
        ))}

        {/* =========================
            X-AXIS VALUES
        ========================== */}
        {xTicks.map((v, i) => (
          <text
            key={i}
            x={xScale(v)}
            y={height - padding.bottom + 16}
            fontSize="10"
            fill={C.dim}
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace"
          >
            {v.toFixed(1)}
          </text>
        ))}

        {/* =========================
            X-AXIS LABEL
        ========================== */}
        <text
          x={width / 2}
          y={height - 4}
          fontSize="11"
          fill={C.dim}
          textAnchor="middle"
        >
          {xLabel}
        </text>

        {/* =========================
            GRAPH LINES + POINTS
        ========================== */}
        {series.map((s, si) => {
          const sorted = [...s.data].sort(
            (a, b) => a.depth - b.depth
          );

          const path = sorted
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${xScale(
                  p.value
                )} ${yScale(p.depth)}`
            )
            .join(" ");

          return (
            <g key={s.name}>
              {/* Graph line */}
              <AnimatedPath
                d={path}
                color={s.color}
                delay={si * 150}
              />

              {/* Graph points */}
              {sorted.map((p, i) => {
                const cx = xScale(p.value);
                const cy = yScale(p.depth);

                const isHovered =
                  hoveredPoint?.series === s.name &&
                  hoveredPoint?.index === i;

                return (
                  <g key={i}>
                    {/* =========================
                        INVISIBLE HIT AREA
                    ========================== */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill="transparent"
                      style={{
                        cursor: "pointer",
                      }}
                      onMouseEnter={() =>
                        handlePointEnter({
                          series: s.name,
                          index: i,
                          depth: p.depth,
                          value: p.value,
                          color: s.color,
                          x: cx,
                          y: cy,
                        })
                      }
                      onMouseLeave={handlePointLeave}
                    />

                    {/* =========================
                        VISIBLE POINT
                    ========================== */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5 : 3}
                      fill={s.color}
                      pointerEvents="none"
                      style={{
                        transition: "r 0.15s ease",
                      }}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* =========================
            TOOLTIP
        ========================== */}
        {hoveredPoint &&
          (() => {
            const tooltipWidth = 125;
            const tooltipHeight = 54;
            const gap = 8;

            /*
             * Calculate horizontal position.
             *
             * Normally tooltip appears to the RIGHT
             * of the point.
             *
             * If there isn't enough space on the right,
             * it moves to the LEFT.
             */
            let tooltipX = hoveredPoint.x + gap;

            if (
              tooltipX + tooltipWidth >
              width - padding.right
            ) {
              tooltipX =
                hoveredPoint.x -
                tooltipWidth -
                gap;
            }

            // Final horizontal safety boundary
            tooltipX = Math.max(
              padding.left,
              Math.min(
                tooltipX,
                width -
                  padding.right -
                  tooltipWidth
              )
            );

            /*
             * Calculate vertical position.
             *
             * Normally tooltip appears ABOVE
             * the point.
             *
             * If there isn't enough space above,
             * it moves BELOW the point.
             */
            let tooltipY =
              hoveredPoint.y -
              tooltipHeight -
              gap;

            if (tooltipY < padding.top) {
              tooltipY =
                hoveredPoint.y + gap;
            }

            // Final vertical safety boundary
            tooltipY = Math.max(
              padding.top,
              Math.min(
                tooltipY,
                height -
                  padding.bottom -
                  tooltipHeight
              )
            );

            return (
              <g
                pointerEvents="none"
                transform={`translate(${tooltipX}, ${tooltipY})`}
              >
                {/* Tooltip background */}
                <rect
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx="6"
                  fill={C.bgCard}
                  stroke={C.border}
                />

                {/* =========================
                    SERIES NAME
                ========================== */}
                <text
                  x="8"
                  y="16"
                  fontSize="9"
                  fill={hoveredPoint.color}
                  fontFamily="'IBM Plex Mono', monospace"
                  fontWeight="600"
                >
                  {hoveredPoint.series}
                </text>

                {/* =========================
                    DEPTH
                ========================== */}
                <text
                  x="8"
                  y="31"
                  fontSize="9"
                  fill={C.text}
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  Depth: {hoveredPoint.depth}m
                </text>

                {/* =========================
                    VALUE
                ========================== */}
                <text
                  x="8"
                  y="46"
                  fontSize="9"
                  fill={C.text}
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  {xLabel}:{" "}
                  {hoveredPoint.value.toFixed(2)}
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}