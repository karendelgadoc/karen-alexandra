"use client";

/**
 * Illustrated Lake Atitlán map — matches the site's cream/lilac palette.
 * Interactive: scroll/pinch to zoom, drag to pan, click a pin to reveal
 * its name + a short description.
 *
 * Modeled on BogotaMap.tsx — keeps the same interactivity contract.
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
    x: 336, y: 122, accent: true,
    label: "Casa Prana", sub: "Santa Cruz la Laguna",
    description: "Eight suites on nine acres of terraced garden, on a stretch of the north shore with no road to it. Reached by boat from Panajachel. Herbal steam sauna, lake-facing gym, a pool cut into the hillside above the water.",
  },
  {
    x: 418, y: 150,
    label: "Panajachel", sub: "The gateway dock",
    description: "Where the road from Guatemala City ends and the lake begins. Leave the car here and take the boat. Calle Santander runs down to the water — textiles, coffee, and the last ATM you'll see for a while.",
  },
  {
    x: 297, y: 124,
    label: "Jaibalito", sub: "The north-shore footpath",
    description: "A tiny village a walk east along the shoreline path from Santa Cruz. The trail continues to Tzununá and San Marcos — an hour or three of lake on one side, coffee terraces on the other.",
  },
  {
    x: 243, y: 142,
    label: "San Marcos la Laguna", sub: "Cerro Tzankujil",
    description: "A community-managed reserve of about 50 acres on a sacred hill west of the village. Stone paths through native forest, a frontal view of Volcán San Pedro, and jumping platforms of 3, 5 and 8 meters into the water. Roughly Q30 to enter.",
  },
  {
    x: 219, y: 182,
    label: "San Juan la Laguna", sub: "Weaving & coffee",
    description: "Casa Flor Ixcaco, founded in 1996 by Teresa Ujpan Perez, weaves organic cotton on backstrap looms with dyes from indigo, avocado, cochineal and cinnamon — each piece tagged with the name of the woman who made it. Above the village, the La Voz que Clama en el Desierto cooperative (est. 1978) runs the coffee walk.",
  },
  {
    x: 238, y: 276,
    label: "Volcán San Pedro", sub: "3,020 m — dormant",
    description: "The most climbable of the three. Hikes leave around 6:30 am and run four to seven hours round trip. Tolimán (3,158 m) and Atitlán (3,535 m) stand to the east; Atitlán last erupted in 1853.",
  },
  {
    x: 274, y: 262,
    label: "Santiago Atitlán", sub: "Tz'utujil heartland",
    description: "The largest lakeside town, set in the bay between Tolimán and San Pedro. The colonial church of Santiago Apóstol, and the shrine of Maximón — a cigar-smoking folk saint who moves to a different household each year.",
  },
  {
    x: 305, y: 56,
    label: "Chichicastenango", sub: "Thursday & Sunday market",
    description: "About an hour and a half north by road. The largest indigenous market in the highlands — textiles, masks, copal smoke on the steps of Santo Tomás. Go early, go Thursday if you can.",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function AtitlanMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [activePin, setActivePin] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const pinchState = useRef<{ startDist: number; startScale: number; centerX: number; centerY: number } | null>(null);

  function clamp(scale: number) {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
  }

  // Constrain pan so the map can't be dragged off-screen
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
    // zoom toward cursor
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
    // Don't start a pan if the user clicked a pin
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

  // Touch pinch-zoom (two fingers)
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
    const clamped = clampPan(transform.x, transform.y, newScale);
    setTransform({ scale: newScale, ...clamped });
  }
  function zoomOut() {
    const newScale = clamp(transform.scale / 1.4);
    const clamped = clampPan(transform.x, transform.y, newScale);
    setTransform({ scale: newScale, ...clamped });
  }

  // Close popover on Escape
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
          aria-label="Interactive map of Lake Atitlán showing Casa Prana and key villages"
        >
          {/* Background — highland plateau */}
          <rect width="460" height="420" fill="#F4EEFE" />

          {/* Contour hatching — highlands around the caldera rim */}
          {[30, 54, 366, 390].map((y) => (
            <line key={`h${y}`} x1={20} y1={y} x2={440} y2={y} stroke="#E4D8FA" strokeWidth="0.7" />
          ))}
          {[228, 268, 308, 348, 388, 428].map((x) => (
            <line key={`v${x}`} x1={x} y1={20} x2={x} y2={400} stroke="#E4D8FA" strokeWidth="0.7" />
          ))}

          {/* Caldera rim — the 84,000-year-old collapse ring */}
          <ellipse
            cx="325" cy="198" rx="122" ry="110"
            fill="none" stroke="#D4C5FA" strokeWidth="1.2"
            strokeDasharray="5 5" opacity="0.9"
          />
          <text x="325" y="82" fill="#9B8AC0" fontSize="7" textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1.2" opacity="0.8">
            CALDERA RIM
          </text>

          {/* ── The lake ─────────────────────────────────────────────── */}
          <path
            d="M420,150
               C410,136 370,126 340,126
               C315,126 290,124 268,128
               C252,132 238,142 228,158
               C220,172 214,190 218,206
               C222,220 232,226 242,232
               C250,240 252,254 258,266
               C264,278 276,282 284,272
               C292,262 294,248 304,246
               C318,244 332,256 348,252
               C368,248 386,236 398,218
               C410,200 418,176 420,150 Z"
            fill="#B49DF5"
            opacity="0.42"
            stroke="#8E74E0"
            strokeWidth="1.4"
          />
          {/* Water texture — a few still-water strokes */}
          <path d="M266,160 C292,154 320,156 344,162" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          <path d="M258,208 C286,202 314,204 342,210" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
          <path d="M290,228 C314,223 338,225 362,230" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.35" />

          <text x="330" y="190" fill="#4A3A7F" fontSize="6.5" textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1" opacity="0.75">
            1,562 M · 340 M DEEP
          </text>

          {/* ── The three volcanoes ──────────────────────────────────── */}
          {/* San Pedro — 3,020 m */}
          <g>
            <polygon points="238,272 214,322 262,322" fill="#C9B8F0" stroke="#8E74E0" strokeWidth="1.1" />
            <polygon points="238,272 228,294 248,294" fill="#FFFFFF" opacity="0.45" />
            <text x="238" y="333" fill="#5A4A8F" fontSize="6.5" textAnchor="middle" fontFamily="Georgia, serif">San Pedro</text>
            <text x="238" y="341" fill="#9B8AC0" fontSize="5.5" textAnchor="middle" fontFamily="Georgia, serif">3,020 m</text>
          </g>
          {/* Tolimán — 3,158 m */}
          <g>
            <polygon points="312,285 286,340 338,340" fill="#C9B8F0" stroke="#8E74E0" strokeWidth="1.1" />
            <polygon points="312,285 301,309 323,309" fill="#FFFFFF" opacity="0.45" />
            <text x="308" y="351" fill="#5A4A8F" fontSize="6.5" textAnchor="middle" fontFamily="Georgia, serif">Tolimán</text>
            <text x="308" y="359" fill="#9B8AC0" fontSize="5.5" textAnchor="middle" fontFamily="Georgia, serif">3,158 m</text>
          </g>
          {/* Atitlán — 3,535 m, the active one */}
          <g>
            <polygon points="368,296 338,364 398,364" fill="#B49DF5" stroke="#6E4FD1" strokeWidth="1.2" />
            <polygon points="368,296 356,326 380,326" fill="#FFFFFF" opacity="0.45" />
            {/* plume */}
            <path d="M368,292 C364,282 372,278 368,268" fill="none" stroke="#9B8AC0" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
            <text x="372" y="375" fill="#5A4A8F" fontSize="6.5" textAnchor="middle" fontFamily="Georgia, serif">Atitlán</text>
            <text x="372" y="383" fill="#9B8AC0" fontSize="5.5" textAnchor="middle" fontFamily="Georgia, serif">3,535 m</text>
          </g>

          {/* ── Road in from Guatemala City ──────────────────────────── */}
          <path
            d="M452,268 C446,232 436,196 424,158"
            fill="none" stroke="#B49DF5" strokeWidth="1.8" strokeDasharray="6 4" opacity="0.85"
          />
          <text x="443" y="216" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" opacity="0.9" textAnchor="middle" transform="rotate(-72,443,216)">
            RN-1 · GUATEMALA CITY — 3 HRS
          </text>

          {/* Road up to Chichicastenango */}
          <path d="M402,134 C376,102 346,72 318,58" fill="none" stroke="#D4C5FA" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.9" />

          {/* ── Village markers (unpinned, for context) ──────────────── */}
          {[
            { x: 270, y: 132, name: "Tzununá" },
            { x: 231, y: 158, name: "San Pablo" },
            { x: 219, y: 208, name: "San Pedro" },
            { x: 332, y: 252, name: "San Lucas" },
            { x: 396, y: 216, name: "S. Antonio Palopó" },
            { x: 414, y: 180, name: "Sta. Catarina" },
          ].map((v) => (
            <g key={v.name}>
              <circle cx={v.x} cy={v.y} r="2" fill="#8E74E0" opacity="0.6" />
              <text x={v.x} y={v.y - 5} fill="#7B6AAF" fontSize="5.5" textAnchor="middle" fontFamily="Georgia, serif" opacity="0.85">
                {v.name}
              </text>
            </g>
          ))}

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
                {/* Active pulse ring */}
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
                {/* Larger invisible hit target for easier tapping */}
                <circle cx="0" cy="0" r={dotSize + 8} fill="transparent" data-pin="1" onClick={() => setActivePin(activePin === i ? null : i)} style={{ cursor: "pointer" }} />
              </g>
            );
          })}

          {/* Title */}
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Lago de Atitlán</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">SOLOLÁ · GUATEMALA</text>
        </svg>

        {/* ── Zoom controls ───────────────────────────────────────────── */}
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

        {/* ── Pin popover ─────────────────────────────────────────────── */}
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

        {/* ── Legend (only shown when no pin is open) ─────────────────── */}
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
