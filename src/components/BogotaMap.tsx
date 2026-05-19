/**
 * Illustrated Bogotá map — matches the site's cream/lilac palette.
 * Uses SVG paths hand-traced from the city grid (approximate, editorial style).
 * Key districts and pins: Casa Medina (Zona G), Parque 93, Zona Rosa,
 * La Candelaria, Usaquén, Museo del Oro, Emerald District.
 */
export default function BogotaMap() {
  const pins: Array<{ x: number; y: number; label: string; sub?: string; accent?: boolean }> = [
    { x: 228, y: 188, label: "Four Seasons Casa Medina", sub: "Zona G", accent: true },
    { x: 256, y: 154, label: "Parque 93", sub: "Chicó" },
    { x: 210, y: 162, label: "Zona Rosa / Zona T", sub: "Andino Mall" },
    { x: 168, y: 298, label: "La Candelaria", sub: "Historic Centre" },
    { x: 178, y: 280, label: "Museo del Oro", sub: "Banco de la República" },
    { x: 172, y: 302, label: "Emerald District", sub: "Av. Jiménez" },
    { x: 278, y: 102, label: "Usaquén", sub: "Sunday Market" },
  ];

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
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 460 420"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "auto" }}
          aria-label="Illustrated map of Bogotá showing key locations"
        >
          {/* Background */}
          <rect width="460" height="420" fill="#F4EEFE" />

          {/* Grid streets — the city's characteristic north-south Carreras and east-west Calles */}
          {/* Carreras (N-S) */}
          {[60, 90, 120, 150, 175, 200, 220, 240, 260, 280, 310, 340, 370, 400].map((x) => (
            <line key={`c${x}`} x1={x} y1={20} x2={x} y2={400} stroke="#E4D8FA" strokeWidth="0.8" />
          ))}
          {/* Calles (E-W) */}
          {[50, 80, 110, 140, 160, 180, 200, 220, 250, 280, 310, 340, 370].map((y) => (
            <line key={`l${y}`} x1={20} y1={y} x2={440} y2={y} stroke="#E4D8FA" strokeWidth="0.8" />
          ))}

          {/* Major avenues — bolder */}
          {/* Carrera 7 / Avenida Séptima — the spine */}
          <line x1="200" y1="20" x2="190" y2="400" stroke="#B49DF5" strokeWidth="2" />
          {/* Avenida El Dorado (Calle 26) */}
          <line x1="20" y1="270" x2="440" y2="270" stroke="#B49DF5" strokeWidth="2" />
          {/* Avenida Chile (Calle 72) */}
          <line x1="20" y1="180" x2="440" y2="180" stroke="#D4C5FA" strokeWidth="1.5" />
          {/* Calle 93 */}
          <line x1="20" y1="150" x2="440" y2="150" stroke="#D4C5FA" strokeWidth="1.5" />
          {/* Autopista Norte */}
          <line x1="280" y1="20" x2="290" y2="400" stroke="#D4C5FA" strokeWidth="1.5" />
          {/* NQS */}
          <line x1="150" y1="20" x2="148" y2="400" stroke="#D4C5FA" strokeWidth="1.5" />

          {/* Andes mountains silhouette — eastern edge */}
          <path
            d="M380,20 Q390,60 400,100 Q415,150 410,200 Q420,250 415,300 Q410,350 420,400 L460,400 L460,20 Z"
            fill="#E4D8FA"
            opacity="0.5"
          />
          <text x="410" y="190" fill="#9B8AC0" fontSize="8" textAnchor="middle" fontFamily="Georgia, serif" transform="rotate(-90,410,190)" opacity="0.7">
            ANDES
          </text>

          {/* District shading */}
          {/* Zona G */}
          <rect x="190" y="175" width="55" height="30" fill="#B49DF5" opacity="0.15" rx="1" />
          {/* Zona Rosa / Chicó */}
          <rect x="185" y="148" width="80" height="30" fill="#6E4FD1" opacity="0.08" rx="1" />
          {/* La Candelaria */}
          <rect x="155" y="282" width="50" height="35" fill="#6E4FD1" opacity="0.12" rx="1" />
          {/* Usaquén */}
          <rect x="250" y="88" width="55" height="30" fill="#B49DF5" opacity="0.1" rx="1" />

          {/* Parks */}
          {/* Parque 93 */}
          <rect x="252" y="148" width="14" height="10" fill="#9BCA9B" opacity="0.6" rx="1" />
          {/* Parque de la Independencia */}
          <rect x="215" y="238" width="18" height="12" fill="#9BCA9B" opacity="0.5" rx="1" />
          {/* Botanical Garden area */}
          <rect x="160" y="226" width="22" height="14" fill="#9BCA9B" opacity="0.5" rx="1" />
          {/* Plaza de Bolívar */}
          <rect x="178" y="292" width="8" height="8" fill="#9BCA9B" opacity="0.6" rx="0" />
          {/* Usaquén park */}
          <rect x="265" y="94" width="12" height="8" fill="#9BCA9B" opacity="0.5" rx="1" />

          {/* Street labels */}
          <text x="196" y="176" fill="#7B6AAF" fontSize="6.5" fontFamily="'Georgia', serif" opacity="0.8">Av. Chile / Calle 72</text>
          <text x="196" y="147" fill="#7B6AAF" fontSize="6.5" fontFamily="'Georgia', serif" opacity="0.8">Calle 93</text>
          <text x="192" y="268" fill="#7B6AAF" fontSize="6" fontFamily="'Georgia', serif" opacity="0.8">Av. El Dorado</text>
          <text x="193" y="22" fill="#7B6AAF" fontSize="6" fontFamily="'Georgia', serif" writingMode="vertical-rl" opacity="0.7">Carrera 7</text>

          {/* Airport label */}
          <text x="80" y="260" fill="#9B8AC0" fontSize="7" fontFamily="'Georgia', serif" opacity="0.7" textAnchor="middle">El Dorado ✈</text>

          {/* North arrow */}
          <g transform="translate(432,35)">
            <circle cx="0" cy="0" r="12" fill="white" stroke="#E4D8FA" strokeWidth="1" />
            <polygon points="0,-9 -4,4 0,1 4,4" fill="#6E4FD1" />
            <text x="0" y="10" textAnchor="middle" fontSize="7" fill="#6E4FD1" fontFamily="Georgia, serif" fontWeight="bold">N</text>
          </g>

          {/* Pins */}
          {pins.map((pin, i) => {
            const isAccent = pin.accent;
            const pinColor = isAccent ? "#6E4FD1" : "#B49DF5";
            const dotColor = isAccent ? "#FFFFFF" : "#6E4FD1";
            const dotSize = isAccent ? 9 : 7;

            return (
              <g key={i} transform={`translate(${pin.x},${pin.y})`}>
                {/* Drop shadow */}
                <circle cx="1" cy="2" r={dotSize} fill="rgba(0,0,0,0.1)" />
                {/* Pin circle */}
                <circle cx="0" cy="0" r={dotSize} fill={pinColor} />
                <circle cx="0" cy="0" r={dotSize - 3} fill={dotColor} />
                {isAccent && (
                  <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="5" fill="#6E4FD1" fontFamily="Georgia" fontWeight="bold">★</text>
                )}
              </g>
            );
          })}

          {/* Title */}
          <text x="30" y="40" fill="#0A0A0A" fontSize="14" fontFamily="'Georgia', serif" fontStyle="italic">Bogotá</text>
          <text x="30" y="55" fill="#5A4A8F" fontSize="7.5" fontFamily="'Georgia', serif" letterSpacing="1.5">COLOMBIA</text>
        </svg>

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "rgba(244,238,254,0.95)",
            border: "1px solid #E4D8FA",
            borderRadius: 2,
            padding: "10px 14px",
            maxWidth: 200,
          }}
        >
          {pins.map((pin, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: i < pins.length - 1 ? 7 : 0 }}>
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
        Key districts &amp; addresses — Bogotá
      </figcaption>
    </figure>
  );
}
