"use client";

/**
 * Illustrated Downtown LA map — matches the site's cream/lilac palette.
 * Interactive: scroll/pinch to zoom, drag to pan, click a pin to reveal
 * its name + a short description.
 *
 * Modeled on BogotaMap.tsx / AtitlanMap.tsx — same interactivity contract.
 *
 * The DTLA street grid is rotated roughly 36° off true north, which is the
 * thing that makes downtown legible on a map, so the grid here is drawn on
 * that diagonal rather than square to the viewBox.
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

// Grid origin and basis vectors — "avenue" runs NW→SE (Figueroa … San Pedro),
// "street" runs NE→SW (1st … 12th).
const OX = 300, OY = 70, AV = 14, ST = 13;
const AVX = 0.85, AVY = 0.53;
const STX = -0.53, STY = 0.85;
const P = (a: number, s: number): [number, number] => [
  OX + a * AV * AVX + s * ST * STX,
  OY + a * AV * AVY + s * ST * STY,
];

const PINS: Pin[] = [
  {
    x: 302, y: 225, accent: true,
    label: "Downtown L.A. Proper Hotel", sub: "11th & Broadway",
    description: "148 rooms in a 1926 Renaissance Revival building by Curlett & Beelman, originally a private club and later a YWCA. Interiors by Kelly Wearstler. The rooftop has the pool, the bar and Cara Cara.",
  },
  {
    x: 358, y: 137,
    label: "Grand Central Market", sub: "3rd & Broadway",
    description: "Open since 1917 and still the best single stop downtown. Go hungry, go early, and expect a line at the well-known counters.",
  },
  {
    x: 349, y: 126,
    label: "Bradbury Building", sub: "304 S Broadway",
    description: "1893, and one of the most photographed interiors in Los Angeles — an atrium of open cage elevators and wrought iron under a glass roof. Directly across Broadway from Grand Central Market, so do both together. Only the ground floor and first landing are open to visitors.",
  },
  {
    x: 324, y: 108,
    label: "The Broad", sub: "Grand Avenue",
    description: "Contemporary collection on Bunker Hill, free general admission but book a timed ticket in advance. The Infinity Mirror Room needs a separate same-day reservation once you're inside.",
  },
  {
    x: 340, y: 85,
    label: "Walt Disney Concert Hall", sub: "Grand Avenue",
    description: "Frank Gehry, opened 2003. Worth walking up to even without a ticket — the public garden wrapping the upper level is open during the day and almost nobody is in it.",
  },
  {
    x: 356, y: 166,
    label: "The Last Bookstore", sub: "5th & Spring",
    description: "A former bank turned bookstore, with the vaults and the book tunnel upstairs. Touristy now, still worth it, best on a weekday morning.",
  },
  {
    x: 352, y: 226,
    label: "Fashion District", sub: "South of 9th",
    description: "About 100 blocks of wholesale, fabric and trim, right by the hotel. Santee Alley is the chaotic part. Cash helps, and most of it shuts by late afternoon.",
  },
  {
    x: 422, y: 192,
    label: "Arts District", sub: "East of Alameda",
    description: "Warehouses turned galleries, coffee and restaurants. It's a short ride east and a different pace from the core — better for a long lunch than a quick stop.",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function DtlaMap() {
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
    const clamped = clampPan(newX, newY, newScale);
    setTransform({ scale: newScale, ...clamped });
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
      const clamped = clampPan(transform.x, transform.y, newScale);
      setTransform({ scale: newScale, ...clamped });
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
    const newScale = clamp(transform.scale * 1.4);
    setTransform({ scale: newScale, ...clampPan(transform.x, transform.y, newScale) });
  }
  function zoomOut() {
    const newScale = clamp(transform.scale / 1.4);
    setTransform({ scale: newScale, ...clampPan(transform.x, transform.y, newScale) });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActivePin(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const avenues = Array.from({ length: 13 }, (_, a) => a);
  const streets = Array.from({ length: 13 }, (_, s) => s);

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
          aria-label="Interactive map of Downtown Los Angeles showing the Downtown L.A. Proper Hotel and key places"
        >
          <rect width="460" height="420" fill="#F4EEFE" />

          {/* Downtown block fill — the rotated grid footprint */}
          <polygon
            points={`${P(-0.6, -0.6).join(",")} ${P(12.6, -0.6).join(",")} ${P(12.6, 12.6).join(",")} ${P(-0.6, 12.6).join(",")}`}
            fill="#B49DF5" opacity="0.10"
          />

          {/* Avenues (NW→SE) */}
          {avenues.map((a) => {
            const [x1, y1] = P(a, 0);
            const [x2, y2] = P(a, 12);
            const major = a === 6 || a === 3;
            return (
              <line key={`a${a}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={major ? "#B49DF5" : "#E4D8FA"} strokeWidth={major ? 1.8 : 0.8} />
            );
          })}
          {/* Streets (NE→SW) */}
          {streets.map((s) => {
            const [x1, y1] = P(0, s);
            const [x2, y2] = P(12, s);
            const major = s === 6 || s === 10;
            return (
              <line key={`s${s}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={major ? "#B49DF5" : "#E4D8FA"} strokeWidth={major ? 1.8 : 0.8} />
            );
          })}

          {/* Street labels along the diagonal */}
          <text
            x={P(6, 12.9)[0]} y={P(6, 12.9)[1]}
            fill="#7B6AAF" fontSize="6.5" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(32,${P(6, 12.9)[0]},${P(6, 12.9)[1]})`}
          >
            BROADWAY
          </text>
          <text
            x={P(3, -2.7)[0]} y={P(3, -2.7)[1]}
            fill="#7B6AAF" fontSize="6.5" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(32,${P(3, -2.7)[0]},${P(3, -2.7)[1]})`}
          >
            GRAND AVE
          </text>
          <text
            x={P(13.3, 6)[0]} y={P(13.3, 6)[1]}
            fill="#7B6AAF" fontSize="6.5" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(-58,${P(13.3, 6)[0]},${P(13.3, 6)[1]})`}
          >
            7TH ST
          </text>
          <text
            x={P(13.3, 10)[0]} y={P(13.3, 10)[1]}
            fill="#7B6AAF" fontSize="6.5" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(-58,${P(13.3, 10)[0]},${P(13.3, 10)[1]})`}
          >
            11TH ST
          </text>

          {/* The 110 freeway, west edge */}
          <path
            d={`M${P(-2.2, -1)[0]},${P(-2.2, -1)[1]} L${P(-2.2, 13)[0]},${P(-2.2, 13)[1]}`}
            stroke="#D4C5FA" strokeWidth="4" fill="none" opacity="0.9"
          />
          <text
            x={P(-2.2, 3)[0] - 8} y={P(-2.2, 3)[1]}
            fill="#9B8AC0" fontSize="6" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(32,${P(-2.2, 3)[0] - 8},${P(-2.2, 3)[1]})`}
          >
            110
          </text>

          {/* LA River, east edge */}
          <path
            d={`M${P(14.2, -1)[0]},${P(14.2, -1)[1]} C${P(14.8, 4)[0]},${P(14.8, 4)[1]} ${P(13.9, 8)[0]},${P(13.9, 8)[1]} ${P(14.6, 13)[0]},${P(14.6, 13)[1]}`}
            stroke="#9BB8E0" strokeWidth="3" fill="none" opacity="0.7"
          />
          <text
            x={P(14.9, 7)[0]} y={P(14.9, 7)[1]}
            fill="#8AA0C0" fontSize="6" fontFamily="Georgia, serif" textAnchor="middle"
            transform={`rotate(32,${P(14.9, 7)[0]},${P(14.9, 7)[1]})`}
          >
            L.A. RIVER
          </text>

          {/* Bunker Hill shading */}
          <polygon
            points={`${P(2, -0.4).join(",")} ${P(4.6, -0.4).join(",")} ${P(4.6, 2.4).join(",")} ${P(2, 2.4).join(",")}`}
            fill="#6E4FD1" opacity="0.09"
          />
          <text x="303" y="102" fill="#9B8AC0" fontSize="6" fontFamily="Georgia, serif" textAnchor="end" opacity="0.9">Bunker Hill</text>

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
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Downtown L.A.</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">CALIFORNIA</text>
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
