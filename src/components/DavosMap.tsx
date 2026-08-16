"use client";

/**
 * Illustrated Davos map — the long Landwasser valley running south-west to
 * north-east, ski mountains either side, the lake at the top end.
 * Interactive: scroll/pinch to zoom, drag to pan, click a pin for detail.
 *
 * Same interactivity contract as the Bogota, Atitlan, DTLA and Paracas maps.
 */

import { useEffect, useRef, useState } from "react";

interface Pin {
  x: number;
  y: number;
  label: string;
  sub?: string;
  description: string;
  accent?: boolean;
}

const PINS: Pin[] = [
  {
    x: 245, y: 285, accent: true,
    label: "InterContinental Davos", sub: "Now the AlpenGold Hotel",
    description: "The golden egg on the hillside above Davos Platz. 216 rooms behind 791 champagne-colored facade panels, opened 2013. IHG left in 2021 and it now trades as the AlpenGold Hotel Davos — same building, same spa, different sign.",
  },
  {
    x: 272, y: 302,
    label: "Davos Platz", sub: "The southern half of town",
    description: "The main railway station, the Kongresszentrum where the World Economic Forum happens each January, and most of the shops and restaurants. A ten-minute walk downhill from the hotel.",
  },
  {
    x: 352, y: 212,
    label: "Davos Dorf", sub: "The northern half",
    description: "The quieter end of town, and the base station for the Parsenn funicular. Davos is really two settlements strung along one valley, about two kilometers apart, linked by train and bus.",
  },
  {
    x: 304, y: 372,
    label: "Jakobshorn", sub: "2,590 m",
    description: "The mountain directly across from Davos Platz, reached by cable car from the edge of town. Snowboarders' side of the valley in winter, hiking and mountain biking in summer.",
  },
  {
    x: 318, y: 144,
    label: "Parsenn / Weissfluhjoch", sub: "2,663 m",
    description: "The big ski area above Davos Dorf, reached by the Parsennbahn funicular. It links across to Klosters, and it's the main reason Davos fills up between December and April.",
  },
  {
    x: 404, y: 152,
    label: "Davosersee", sub: "The lake",
    description: "At the top end of the valley past Davos Dorf. A flat walk or a short bus ride, and one of the better things to do here in summer — the path all the way around takes about an hour.",
  },
  {
    x: 224, y: 248,
    label: "Schatzalp", sub: "Funicular from Davos Platz",
    description: "A 1900 sanatorium turned hotel, up its own funicular above the town, and the setting Thomas Mann used for The Magic Mountain. Worth the ride for the botanical garden and the view back down the valley.",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function DavosMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [activePin, setActivePin] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const pinchState = useRef<{ startDist: number; startScale: number; centerX: number; centerY: number } | null>(null);

  function clamp(scale: number) {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
  }

  function clampPan(x: number, y: number, scale: number) {
    if (!containerRef.current) return { x, y };
    const { width, height } = containerRef.current.getBoundingClientRect();
    const extra = (scale - 1) / 2;
    const maxX = width * extra;
    const maxY = height * extra;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;

    const delta = -e.deltaY * 0.002;
    const newScale = clamp(transform.scale * (1 + delta));
    if (newScale === transform.scale) return;
    const ratio = newScale / transform.scale;
    const newX = transform.x - (px - transform.x) * (ratio - 1);
    const newY = transform.y - (py - transform.y) * (ratio - 1);
    setTransform({ scale: newScale, ...clampPan(newX, newY, newScale) });
  }

  function startPan(clientX: number, clientY: number) {
    dragState.current = { startX: clientX, startY: clientY, origX: transform.x, origY: transform.y };
    setIsDragging(true);
  }

  function movePan(clientX: number, clientY: number) {
    if (!dragState.current) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    const next = clampPan(dragState.current.origX + dx, dragState.current.origY + dy, transform.scale);
    setTransform((t) => ({ ...t, ...next }));
  }

  function endPan() {
    dragState.current = null;
    setIsDragging(false);
  }

  function handlePointerDown(e: React.PointerEvent) {
    if ((e.target as Element).closest("[data-pin]")) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startPan(e.clientX, e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent) {
    movePan(e.clientX, e.clientY);
  }

  function handlePointerUp() {
    endPan();
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      pinchState.current = {
        startDist: Math.hypot(dx, dy),
        startScale: transform.scale,
        centerX: (t1.clientX + t2.clientX) / 2,
        centerY: (t1.clientY + t2.clientY) / 2,
      };
      dragState.current = null;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchState.current) {
      e.preventDefault();
      const t1 = e.touches[0], t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = clamp(pinchState.current.startScale * (dist / pinchState.current.startDist));
      setTransform({ scale: newScale, ...clampPan(transform.x, transform.y, newScale) });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinchState.current = null;
  }

  function resetView() {
    setTransform({ scale: 1, x: 0, y: 0 });
    setActivePin(null);
  }
  function zoomIn() {
    const s = clamp(transform.scale * 1.4);
    setTransform({ scale: s, ...clampPan(transform.x, transform.y, s) });
  }
  function zoomOut() {
    const s = clamp(transform.scale / 1.4);
    setTransform({ scale: s, ...clampPan(transform.x, transform.y, s) });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActivePin(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <figure
      style={{
        margin: "64px 0",
        background: "var(--ka-bg-soft)",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid var(--ka-line)",
      }}
    >
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <svg
          viewBox="0 0 460 420"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.18s ease-out",
          }}
          aria-label="Interactive map of Davos, Switzerland showing the InterContinental Davos and the surrounding valley"
        >
          <rect width="460" height="420" fill="#F4EEFE" />

          {/* Valley floor — a band along the axis the towns actually sit on,
              running south-west (Davos Platz) to north-east (the lake). */}
          <path
            d="M232,322 L444,83 L444,123 L232,362 Z"
            fill="#E4D8FA" opacity="0.85"
          />

          {/* Ridge lines either side of the valley */}
          <path
            d="M216,286 L250,232 L292,182 L336,132 L380,84 L420,48"
            fill="none" stroke="#C9B8F0" strokeWidth="1.4" opacity="0.9"
          />
          <path
            d="M262,392 L316,340 L366,290 L414,240 L452,198"
            fill="none" stroke="#C9B8F0" strokeWidth="1.4" opacity="0.9"
          />

          {/* Peaks — north-west side (Parsenn) */}
          {[[300, 150, 30], [340, 112, 26], [382, 76, 22]].map(([cx, cy, w], i) => (
            <polygon
              key={`n${i}`}
              points={`${cx},${cy} ${cx - w},${cy + w * 1.15} ${cx + w},${cy + w * 1.15}`}
              fill="#C9B8F0" stroke="#9C86E0" strokeWidth="0.9" opacity="0.75"
            />
          ))}
          {/* Peaks — south-east side (Jakobshorn) */}
          {[[306, 356, 32], [360, 306, 26], [408, 258, 22]].map(([cx, cy, w], i) => (
            <polygon
              key={`s${i}`}
              points={`${cx},${cy} ${cx - w},${cy + w * 1.15} ${cx + w},${cy + w * 1.15}`}
              fill="#C9B8F0" stroke="#9C86E0" strokeWidth="0.9" opacity="0.75"
            />
          ))}
          {/* Snow caps */}
          {[[300, 150, 30], [340, 112, 26], [306, 356, 32]].map(([cx, cy, w], i) => (
            <polygon
              key={`sc${i}`}
              points={`${cx},${cy} ${cx - w * 0.42},${cy + w * 0.5} ${cx + w * 0.42},${cy + w * 0.5}`}
              fill="#FFFFFF" opacity="0.75"
            />
          ))}

          {/* Davosersee */}
          <ellipse cx="406" cy="146" rx="24" ry="11" transform="rotate(-48,406,146)" fill="#B49DF5" opacity="0.55" stroke="#8E74E0" strokeWidth="1" />

          {/* Rail line down the valley */}
          <path
            d="M240,333 L436,112"
            fill="none" stroke="#8E74E0" strokeWidth="1.1" strokeDasharray="7 5" opacity="0.9"
          />

          {/* Labels */}
          <text
            x="262" y="330" fill="#5A4A8F" fontSize="7" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.85"
            textAnchor="middle" transform="rotate(-48,262,330)"
          >
            Landwasser valley
          </text>
          <text x="288" y="130" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" letterSpacing="1" textAnchor="middle">
            PARSENN
          </text>
          <text x="350" y="404" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" letterSpacing="1" textAnchor="middle">
            JAKOBSHORN
          </text>
          <text
            x="424" y="112" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" textAnchor="middle"
            transform="rotate(-44,424,112)"
          >
            KLOSTERS →
          </text>
          <text
            x="252" y="384" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" textAnchor="middle"
            transform="rotate(-48,252,384)"
          >
            ← ZÜRICH · 2½ HRS
          </text>

          {/* North arrow */}
          <g transform="translate(432,395)">
            <circle cx="0" cy="0" r="12" fill="white" stroke="#E4D8FA" strokeWidth="1" />
            <polygon points="0,-9 -4,4 0,1 4,4" fill="#6E4FD1" />
            <text x="0" y="10" textAnchor="middle" fontSize="7" fill="#6E4FD1" fontFamily="Georgia, serif" fontWeight="bold">N</text>
          </g>

          {/* Pins */}
          {PINS.map((pin, i) => {
            const isAccent = pin.accent;
            const isActive = activePin === i;
            const pinColor = isAccent ? "#6E4FD1" : "#B49DF5";
            const dotColor = isAccent ? "#FFFFFF" : "#6E4FD1";
            const dotSize = isAccent ? 9 : 7;

            return (
              <g key={i} transform={`translate(${pin.x},${pin.y})`}>
                {isActive && (
                  <circle cx="0" cy="0" r={dotSize + 6} fill="none" stroke={pinColor} strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" from={dotSize + 2} to={dotSize + 10} dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx="1" cy="2" r={dotSize} fill="rgba(0,0,0,0.1)" />
                <circle
                  cx="0" cy="0" r={dotSize}
                  fill={pinColor}
                  data-pin="1"
                  onClick={() => setActivePin(activePin === i ? null : i)}
                  style={{ cursor: "pointer" }}
                />
                <circle cx="0" cy="0" r={dotSize - 3} fill={dotColor} data-pin="1" style={{ pointerEvents: "none" }} />
                {isAccent && (
                  <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="5" fill="#6E4FD1" fontFamily="Georgia" fontWeight="bold" style={{ pointerEvents: "none" }}>★</text>
                )}
                <circle cx="0" cy="0" r={dotSize + 8} fill="transparent" data-pin="1" onClick={() => setActivePin(activePin === i ? null : i)} style={{ cursor: "pointer" }} />
              </g>
            );
          })}

          {/* Title */}
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Davos</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">GRAUBÜNDEN · SWITZERLAND</text>
        </svg>

        {/* Zoom controls */}
        <div
          style={{
            position: "absolute", top: 12, right: 12,
            display: "flex", flexDirection: "column", gap: 4,
            background: "rgba(255,255,255,0.95)", border: "1px solid #E4D8FA",
            borderRadius: 3, padding: 4,
          }}
        >
          <button onClick={zoomIn} style={ctrlBtnStyle} aria-label="Zoom in" title="Zoom in">+</button>
          <button onClick={zoomOut} style={ctrlBtnStyle} aria-label="Zoom out" title="Zoom out">−</button>
          <button onClick={resetView} style={{ ...ctrlBtnStyle, fontSize: 9, letterSpacing: "0.08em" }} aria-label="Reset view" title="Reset view">RESET</button>
        </div>

        {/* Pin popover */}
        {activePin !== null && (
          <div
            style={{
              position: "absolute", left: 16, right: 16, bottom: 16,
              maxWidth: 380, marginLeft: "auto", marginRight: "auto",
              background: "white", border: "1px solid #E4D8FA",
              borderRadius: 3, padding: "14px 16px",
              boxShadow: "0 8px 24px rgba(110,79,209,0.18)",
              pointerEvents: "auto",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePin(null)}
              style={{
                position: "absolute", top: 6, right: 8,
                border: "none", background: "none", color: "#9B8AC0",
                fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 4,
              }}
              aria-label="Close"
            >×</button>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E4FD1", marginBottom: 6 }}>
              {PINS[activePin].sub}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 18, color: "#0A0A0A", marginBottom: 8, lineHeight: 1.25 }}>
              {PINS[activePin].label}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "#5A4A8F", margin: 0 }}>
              {PINS[activePin].description}
            </p>
          </div>
        )}

        {/* Legend */}
        {activePin === null && (
          <div
            style={{
              position: "absolute", bottom: 16, left: 16,
              background: "rgba(244,238,254,0.95)",
              border: "1px solid #E4D8FA",
              borderRadius: 2,
              padding: "10px 14px",
              maxWidth: 200,
              pointerEvents: "none",
            }}
          >
            {PINS.map((pin, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: i < PINS.length - 1 ? 7 : 0 }}>
                <div style={{
                  width: pin.accent ? 11 : 9,
                  height: pin.accent ? 11 : 9,
                  borderRadius: "50%",
                  background: pin.accent ? "#6E4FD1" : "#B49DF5",
                  border: `2px solid ${pin.accent ? "#6E4FD1" : "#B49DF5"}`,
                  flexShrink: 0,
                  marginTop: 2,
                }} />
                <div>
                  <div style={{ fontSize: 9, fontFamily: "'Georgia', serif", fontStyle: pin.accent ? "italic" : "normal", color: pin.accent ? "#6E4FD1" : "#0A0A0A", lineHeight: 1.3, fontWeight: pin.accent ? "bold" : "normal" }}>
                    {pin.label}
                  </div>
                  {pin.sub && (
                    <div style={{ fontSize: 7.5, color: "#5A4A8F", letterSpacing: "0.06em", lineHeight: 1.2 }}>{pin.sub}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <figcaption
        style={{
          padding: "12px 20px",
          fontSize: 11,
          color: "#5A4A8F",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--ka-body, Jost, sans-serif)",
          borderTop: "1px solid #E4D8FA",
          textAlign: "center",
        }}
      >
        Click a pin · Scroll or pinch to zoom · Drag to pan
      </figcaption>
    </figure>
  );
}

const ctrlBtnStyle: React.CSSProperties = {
  width: 28, height: 28,
  border: "none", background: "white",
  color: "#6E4FD1", fontSize: 16, fontFamily: "Georgia, serif",
  cursor: "pointer", borderRadius: 2,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 0,
};
