"use client";

/**
 * Illustrated Paracas map — desert meeting the Pacific, with the peninsula
 * sheltering Paracas Bay.
 * Interactive: scroll/pinch to zoom, drag to pan, click a pin for detail.
 *
 * Modeled on BogotaMap.tsx / AtitlanMap.tsx / DtlaMap.tsx — same contract.
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
    x: 370, y: 250, accent: true,
    label: "Hotel Paracas", sub: "Paracas Bay",
    description: "120 rooms on the bay, with a private dock the boat trips leave from. The original hotel was destroyed in the 2007 earthquake and rebuilt; the current building is by Arquitectonica.",
  },
  {
    x: 388, y: 224,
    label: "El Chaco", sub: "The village pier",
    description: "The small waterfront town next door, and where the public Ballestas boats leave from. A few minutes' walk up the bay from the hotel.",
  },
  {
    x: 250, y: 155,
    label: "Islas Ballestas", sub: "Offshore, north-west",
    description: "Rock islands covered in sea lions, Humboldt penguins, pelicans and cormorants. Boats don't land — you circle the arches and stacks and come back. Early morning is the calm crossing.",
  },
  {
    x: 316, y: 272,
    label: "The Paracas Candelabra", sub: "North face of the peninsula",
    description: "A geoglyph about 181 meters tall, cut roughly 60 cm into the hillside. Pottery found nearby dates to around 200 BCE, which puts it with the Paracas culture rather than the Nazca. It faces the sea and is visible from a long way out — boats slow down as they pass.",
  },
  {
    x: 300, y: 312,
    label: "Paracas National Reserve", sub: "The peninsula",
    description: "Protected desert running straight into the Pacific — red sand, cliffs, and almost no vegetation. The coastline lookouts are the reason to go.",
  },
  {
    x: 434, y: 186,
    label: "The desert", sub: "Inland, east",
    description: "Flat open desert behind the bay, and where the dune buggies run. Go late in the afternoon when the heat drops and the light gets long.",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function ParacasMap() {
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
          aria-label="Interactive map of Paracas, Peru showing Hotel Paracas, the Ballestas Islands and the Candelabra"
        >
          {/* Ocean */}
          <rect width="460" height="420" fill="#F4EEFE" />
          <rect width="460" height="420" fill="#B49DF5" opacity="0.22" />

          {/* Swell lines */}
          {[110, 190, 260, 340].map((y, i) => (
            <path
              key={y}
              d={`M20,${y} C80,${y - 7} 140,${y + 7} 210,${y}`}
              fill="none" stroke="#FFFFFF" strokeWidth="1" opacity={0.4 - i * 0.05}
            />
          ))}

          {/* Land — mainland with Paracas Bay notch and the peninsula */}
          <path
            d="M460,55
               L410,72 L392,105 L386,150 L390,195 L380,228
               C374,240 366,246 358,250
               C345,258 330,262 305,266
               C282,278 262,296 255,318
               C268,336 295,348 328,344
               C352,336 370,318 378,292
               C388,280 393,292 398,304
               C406,340 425,378 460,398 Z"
            fill="#E2D6BE"
            stroke="#BFAE8E"
            strokeWidth="1.3"
          />

          {/* Desert stipple inland */}
          {[[418, 120], [432, 152], [408, 175], [438, 210], [414, 240], [430, 300], [410, 330], [440, 260]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="11" ry="4" fill="#CFBE9E" opacity="0.5" />
          ))}
          {/* Peninsula relief */}
          {[[300, 300], [330, 316], [278, 312], [312, 330]].map(([cx, cy], i) => (
            <ellipse key={`p${i}`} cx={cx} cy={cy} rx="13" ry="5" fill="#CFBE9E" opacity="0.5" />
          ))}

          {/* Ballestas islands */}
          {[[246, 150, 7, 4.5], [258, 160, 5, 3.2], [238, 163, 4, 2.6]].map(([cx, cy, rx, ry], i) => (
            <ellipse key={`b${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#E2D6BE" stroke="#BFAE8E" strokeWidth="1" />
          ))}

          {/* The candelabra, scratched into the peninsula's north face */}
          <g stroke="#A89268" strokeWidth="1.3" fill="none" opacity="0.95">
            <line x1="298" y1="276" x2="298" y2="302" />
            <line x1="288" y1="283" x2="288" y2="297" />
            <line x1="308" y1="283" x2="308" y2="297" />
            <line x1="288" y1="285" x2="298" y2="285" />
            <line x1="298" y1="285" x2="308" y2="285" />
          </g>

          {/* Labels */}
          <text x="252" y="242" fill="#5A4A8F" fontSize="10" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.55" textAnchor="middle">
            Pacific Ocean
          </text>
          <text x="366" y="214" fill="#5A4A8F" fontSize="7" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.85" textAnchor="end">
            Paracas Bay
          </text>
          <text
            x="308" y="356" fill="#8A7A5E" fontSize="6.5" fontFamily="Georgia, serif"
            letterSpacing="1" textAnchor="middle"
          >
            PARACAS PENINSULA
          </text>
          <text x="418" y="152" fill="#8A7A5E" fontSize="6" fontFamily="Georgia, serif" letterSpacing="1" textAnchor="middle">
            DESERT
          </text>

          {/* Direction and drive time to Lima */}
          <text x="392" y="140" fill="#7B6AAF" fontSize="6" fontFamily="Georgia, serif" textAnchor="middle">
            ↑ LIMA · 3 HRS
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
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Paracas</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">ICA · PERU</text>
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
