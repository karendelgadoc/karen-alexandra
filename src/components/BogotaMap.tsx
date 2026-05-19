"use client";

/**
 * Illustrated Bogotá map — matches the site's cream/lilac palette.
 * Interactive: scroll/pinch to zoom, drag to pan, click a pin to reveal
 * its name + a short description.
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
    x: 228, y: 188, accent: true,
    label: "Four Seasons Casa Medina", sub: "Zona G",
    description: "A 1946 building saved from demolition. Stonework salvaged from a 17th-century convent, songbird stained-glass at every landing, a glass-roofed courtyard restaurant. 62 rooms — no two alike.",
  },
  {
    x: 256, y: 154,
    label: "Parque 93", sub: "Chicó",
    description: "A genteel open-air park surrounded by cafés, designer boutiques (Silvia Tcherassi, Amelia Toro), and the unhurried café-lined blocks that reward slow walking.",
  },
  {
    x: 210, y: 162,
    label: "Zona Rosa / Zona T", sub: "Andino Mall",
    description: "Bogotá's prime luxury shopping district. The Andino Mall houses Louis Vuitton, Dior, Gucci alongside the Colombian designers worth knowing.",
  },
  {
    x: 168, y: 298,
    label: "La Candelaria", sub: "Historic Centre",
    description: "The original 1538 city. Narrow cobbled streets running steeply between painted plaster facades, political murals, university buildings, and 17th-century churches.",
  },
  {
    x: 178, y: 280,
    label: "Museo del Oro", sub: "Banco de la República",
    description: "34,000 pre-Hispanic gold pieces, including the Muisca ceremonial raft that most likely gave rise to the El Dorado legend. Free admission on Sundays.",
  },
  {
    x: 172, y: 302,
    label: "Emerald District", sub: "Av. Jiménez",
    description: "Colombia produces 70–90% of the world's finest emeralds. The Emerald Trade Center sells stones with RUCOM provenance papers. The finest are deep, slightly bluish green with inclusions (jardín) — proof of natural origin.",
  },
  {
    x: 278, y: 102,
    label: "Usaquén", sub: "Sunday Market",
    description: "A former colonial village absorbed into the city. The Sunday flea market draws Bogotanos for handmade jewellery, artisanal food, and lazy lunches under jacaranda trees.",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function BogotaMap() {
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
          aria-label="Interactive map of Bogotá showing key locations"
        >
          {/* Background */}
          <rect width="460" height="420" fill="#F4EEFE" />

          {/* Carreras (N-S) */}
          {[60, 90, 120, 150, 175, 200, 220, 240, 260, 280, 310, 340, 370, 400].map((x) => (
            <line key={`c${x}`} x1={x} y1={20} x2={x} y2={400} stroke="#E4D8FA" strokeWidth="0.8" />
          ))}
          {/* Calles (E-W) */}
          {[50, 80, 110, 140, 160, 180, 200, 220, 250, 280, 310, 340, 370].map((y) => (
            <line key={`l${y}`} x1={20} y1={y} x2={440} y2={y} stroke="#E4D8FA" strokeWidth="0.8" />
          ))}

          {/* Major avenues */}
          <line x1="200" y1="20" x2="190" y2="400" stroke="#B49DF5" strokeWidth="2" />
          <line x1="20" y1="270" x2="440" y2="270" stroke="#B49DF5" strokeWidth="2" />
          <line x1="20" y1="180" x2="440" y2="180" stroke="#D4C5FA" strokeWidth="1.5" />
          <line x1="20" y1="150" x2="440" y2="150" stroke="#D4C5FA" strokeWidth="1.5" />
          <line x1="280" y1="20" x2="290" y2="400" stroke="#D4C5FA" strokeWidth="1.5" />
          <line x1="150" y1="20" x2="148" y2="400" stroke="#D4C5FA" strokeWidth="1.5" />

          {/* Andes silhouette */}
          <path
            d="M380,20 Q390,60 400,100 Q415,150 410,200 Q420,250 415,300 Q410,350 420,400 L460,400 L460,20 Z"
            fill="#E4D8FA"
            opacity="0.5"
          />
          <text x="410" y="190" fill="#9B8AC0" fontSize="8" textAnchor="middle" fontFamily="Georgia, serif" transform="rotate(-90,410,190)" opacity="0.7">
            ANDES
          </text>

          {/* District shading */}
          <rect x="190" y="175" width="55" height="30" fill="#B49DF5" opacity="0.15" rx="1" />
          <rect x="185" y="148" width="80" height="30" fill="#6E4FD1" opacity="0.08" rx="1" />
          <rect x="155" y="282" width="50" height="35" fill="#6E4FD1" opacity="0.12" rx="1" />
          <rect x="250" y="88" width="55" height="30" fill="#B49DF5" opacity="0.1" rx="1" />

          {/* Parks */}
          <rect x="252" y="148" width="14" height="10" fill="#9BCA9B" opacity="0.6" rx="1" />
          <rect x="215" y="238" width="18" height="12" fill="#9BCA9B" opacity="0.5" rx="1" />
          <rect x="160" y="226" width="22" height="14" fill="#9BCA9B" opacity="0.5" rx="1" />
          <rect x="178" y="292" width="8" height="8" fill="#9BCA9B" opacity="0.6" rx="0" />
          <rect x="265" y="94" width="12" height="8" fill="#9BCA9B" opacity="0.5" rx="1" />

          {/* Street labels (hidden at high zoom to reduce clutter) */}
          <text x="196" y="176" fill="#7B6AAF" fontSize="6.5" fontFamily="'Georgia', serif" opacity="0.8">Av. Chile / Calle 72</text>
          <text x="196" y="147" fill="#7B6AAF" fontSize="6.5" fontFamily="'Georgia', serif" opacity="0.8">Calle 93</text>
          <text x="192" y="268" fill="#7B6AAF" fontSize="6" fontFamily="'Georgia', serif" opacity="0.8">Av. El Dorado</text>
          <text x="193" y="22" fill="#7B6AAF" fontSize="6" fontFamily="'Georgia', serif" writingMode="vertical-rl" opacity="0.7">Carrera 7</text>

          <text x="80" y="260" fill="#9B8AC0" fontSize="7" fontFamily="'Georgia', serif" opacity="0.7" textAnchor="middle">El Dorado ✈</text>

          {/* North arrow */}
          <g transform="translate(432,35)">
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
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Bogotá</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">COLOMBIA</text>
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
