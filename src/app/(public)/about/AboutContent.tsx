"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { WORLD_MAP_PATHS, WORLD_MAP_VIEWBOX } from "@/lib/world-map-paths";
import type { AboutContent as AboutContentType } from "@/lib/page-content-db";

const PLACES = [
  { n: "01", city: "Lima",             country: "Peru",             era: "1992 — 2002",  type: "Born",       x: 28.6, y: 63.5, note: "Born April 2nd to a Peruvian family. The first ten years on a continent I still call home most readily." },
  { n: "02", city: "Palm Desert",      country: "California",       era: "2002 — 2011",  type: "Grew up",    x: 17.4, y: 39.0, note: "Moved at ten. Spent my childhood in the kind of dry heat that teaches you to read in the shade." },
  { n: "03", city: "Huntington Beach", country: "California",       era: "2011 — 2016",  type: "Lived",      x: 16.6, y: 40.6, note: "Five years on the coast. I learned to surf badly, drink coffee well, and stop apologising for either." },
  { n: "04", city: "Barcelona",        country: "Spain",            era: "2017",         type: "First solo", x: 49.7, y: 33.8, note: "My first solo trip. I went for two weeks. I stayed the year. The decision that rearranged everything." },
  { n: "05", city: "Lima",             country: "Peru",             era: "Summer 2018",  type: "Returned",   x: 27.4, y: 65.4, note: "South American summer with my family. The first time I'd really come home as an adult." },
  { n: "06", city: "Mallorca",         country: "Spain",            era: "Summer 2018",  type: "Island",     x: 52.2, y: 36.4, note: "European summer on the island. The first time I understood the case for a slow August." },
  { n: "07", city: "Barcelona",        country: "Spain",            era: "2019 — 2020",  type: "Returned",   x: 51.0, y: 35.0, note: "Back to the city, on purpose. Same neighborhood, different life." },
  { n: "08", city: "Miami",            country: "Florida",          era: "2021",         type: "Lived",      x: 27.7, y: 43.5, note: "A year of pivoting — work, climate, and the particular quiet of a Sunday at the beach." },
  { n: "09", city: "New York",         country: "New York",         era: "2022 — 2023",  type: "Lived",      x: 29.5, y: 38.0, note: "Two years that compressed five. The city does what the city does." },
  { n: "10", city: "Miami Platja",     country: "Tarragona, Spain", era: "2024 — 2025",  type: "Lived",      x: 48.4, y: 36.0, note: "A small town on the Costa Daurada. The closest thing to a writing retreat I've ever had." },
  { n: "11", city: "Madrid",           country: "Spain",            era: "Present",      type: "Currently",  x: 48.0, y: 34.6, note: "The current chapter. Sun, terrazas, and the kind of working hours the rest of the world won't quite believe." },
];


function WorldMapSVG() {
  return (
    <svg
      viewBox={WORLD_MAP_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1066" height="632" fill="var(--ka-bg)" />
      <g fill="none" stroke="var(--ka-accent-deep)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85">
        {WORLD_MAP_PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}

function WorldMap({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDist = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDragging = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const MAX_ZOOM = 4;

  function clampPan(x: number, y: number, z: number) {
    const W = containerRef.current?.offsetWidth ?? 400;
    const H = containerRef.current?.offsetHeight ?? 240;
    const lx = W * (z - 1) / (2 * z);
    const ly = H * (z - 1) / (2 * z);
    return { x: Math.max(-lx, Math.min(lx, x)), y: Math.max(-ly, Math.min(ly, y)) };
  }

  // Non-passive wheel listener so we can call preventDefault and stop page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top - rect.height / 2;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setZoom(z => {
        const next = Math.max(1, Math.min(MAX_ZOOM, z * factor));
        if (next === 1) { setPan({ x: 0, y: 0 }); return 1; }
        const W2 = el.offsetWidth;
        const H2 = el.offsetHeight;
        setPan(p => {
          const nx = p.x + dx * (1 / next - 1 / z);
          const ny = p.y + dy * (1 / next - 1 / z);
          const lx = W2 * (next - 1) / (2 * next);
          const ly = H2 * (next - 1) / (2 * next);
          return { x: Math.max(-lx, Math.min(lx, nx)), y: Math.max(-ly, Math.min(ly, ny)) };
        });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return;
    e.preventDefault();
    isMouseDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isMouseDragging.current || !lastMousePos.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setPan(p => clampPan(p.x + dx / zoom, p.y + dy / zoom, zoom));
  }

  function handleMouseUp() {
    if (!isMouseDragging.current) return;
    isMouseDragging.current = false;
    lastMousePos.current = null;
    setIsDragging(false);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setIsDragging(true);
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 1 && zoom > 1 && lastTouch.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPan(p => clampPan(p.x + dx / zoom, p.y + dy / zoom, zoom));
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / lastPinchDist.current;
      lastPinchDist.current = dist;
      setZoom(z => {
        const next = Math.max(1, Math.min(MAX_ZOOM, z * scale));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  }

  function handleTouchEnd() {
    setIsDragging(false);
    lastTouch.current = null;
    lastPinchDist.current = null;
  }

  function zoomIn() {
    setZoom(z => Math.min(z + 0.75, MAX_ZOOM));
  }

  function zoomOut() {
    setZoom(z => {
      const next = Math.max(z - 0.75, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  const btnStyle: React.CSSProperties = {
    width: 32, height: 32,
    background: "var(--ka-bg)",
    border: "1px solid var(--ka-ink)",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 300,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--ka-ink)",
    lineHeight: 1,
    fontFamily: "var(--ka-body)",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%", aspectRatio: `${1066 / 632}`,
        background: "var(--ka-bg)", border: "1px solid var(--ka-line)",
        overflow: "hidden", touchAction: zoom > 1 ? "none" : "auto",
        cursor: isDragging ? "grabbing" : (zoom > 1 ? "grab" : "default"),
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Scalable + pannable content */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        transformOrigin: "center center",
        transition: isDragging ? "none" : "transform 0.25s ease",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <WorldMapSVG />
        </div>

        {/* Connecting lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {PLACES.slice(0, -1).map((p, i) => {
            const next = PLACES[i + 1];
            const dim = active !== null && active !== i && active !== i + 1;
            return (
              <line key={i}
                x1={`${p.x}%`} y1={`${p.y}%`} x2={`${next.x}%`} y2={`${next.y}%`}
                stroke="var(--ka-accent-deep)" strokeOpacity={dim ? "0.15" : "0.5"}
                strokeWidth="1" strokeDasharray="3 4"
              />
            );
          })}
        </svg>

        {/* Dots */}
        {PLACES.map((p, i) => {
          const isActive = active === i;
          const isCurrent = i === PLACES.length - 1;
          const sz = isActive ? 36 : 24;
          return (
            <button
              key={i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${p.city}, ${p.country}`}
              style={{
                position: "absolute",
                left: `calc(${p.x}% - ${sz / 2}px)`,
                top: `calc(${p.y}% - ${sz / 2}px)`,
                width: sz, height: sz,
                borderRadius: "50%",
                background: isActive ? "var(--ka-ink)" : (isCurrent ? "var(--ka-accent-deep)" : "var(--ka-bg)"),
                color: isActive || isCurrent ? "var(--ka-bg)" : "var(--ka-ink)",
                border: `1.5px solid ${isCurrent ? "var(--ka-accent-deep)" : "var(--ka-ink)"}`,
                cursor: "pointer",
                fontFamily: "var(--ka-mono)",
                fontSize: 10,
                letterSpacing: "0.04em",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s ease",
                zIndex: isActive ? 5 : 2,
                boxShadow: isActive ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
                transform: `scale(${1 / zoom})`,
                transformOrigin: "center center",
              }}
            >
              {p.n}
            </button>
          );
        })}

      </div>

      {/* Currently here badge — outside scaled div so it stays fixed */}
      <div style={{
        position: "absolute", right: 16, top: 16,
        padding: "6px 12px",
        background: "var(--ka-bg)", border: "1px solid var(--ka-line)",
        fontFamily: "var(--ka-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
        color: "var(--ka-accent-deep)", display: "flex", alignItems: "center", gap: 8,
        zIndex: 10,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ka-accent-deep)", display: "inline-block" }} />
        Currently · Madrid
      </div>

      {/* Zoom controls */}
      <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", flexDirection: "column", gap: 2, zIndex: 10 }}>
        <button onClick={zoomIn} style={btnStyle} aria-label="Zoom in">+</button>
        <button onClick={zoomOut} disabled={zoom <= 1} style={{ ...btnStyle, opacity: zoom <= 1 ? 0.35 : 1, cursor: zoom <= 1 ? "default" : "pointer" }} aria-label="Zoom out">−</button>
        {zoom > 1 && (
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ ...btnStyle, fontSize: 12 }} aria-label="Reset zoom">↺</button>
        )}
      </div>
    </div>
  );
}

function WorldMapDetails({ active }: { active: number }) {
  const p = PLACES[active];
  return (
    <div style={{ padding: "32px 0", borderTop: "1px solid var(--ka-ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)" }}>N° {p.n} · {p.era}</div>
        <div className="ka-eyebrow">{p.type}</div>
      </div>
      <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(24px,3vw,36px)", fontStyle: active % 2 ? "italic" : "normal", marginBottom: 12, lineHeight: 1.05 }}>
        {p.city}, <span style={{ color: "var(--ka-muted)" }}>{p.country}</span>
      </h3>
      <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.5, color: "var(--ka-ink)" }}>{p.note}</p>
    </div>
  );
}

export default function AboutContent({ content }: { content: AboutContentType }) {
  const [active, setActive] = useState(PLACES.length - 1);
  const hidden = content.hiddenSections ?? [];

  return (
    <>
      {/* Hero */}
      {!hidden.includes("hero") && <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px) clamp(32px,5vw,64px)", borderBottom: "1px solid var(--ka-line)" }}>
        <div className="ka-eyebrow" style={{ marginBottom: "clamp(24px,4vw,48px)" }}>{content.hero.eyebrow}</div>
        <div className="ka-about-hero-grid">
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(64px,12vw,144px)", fontWeight: 300, lineHeight: 0.93 }}>
            Hello,<br />I&apos;m <span style={{ fontStyle: "italic" }}>Karen<span style={{ color: "var(--ka-accent-deep)" }}>.</span></span>
          </h1>
          <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.7, color: "var(--ka-ink)", maxWidth: 420, alignSelf: "end" }}>
            {content.hero.subhead}
          </p>
        </div>
      </section>}

      {/* Manifesto */}
      {!hidden.includes("manifesto") && <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)" }}>
        <div className="ka-about-manifesto-grid">
          <div className="ka-eyebrow">{content.manifesto.eyebrow}</div>
          <div>
            <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(22px,3vw,36px)", fontStyle: "italic", lineHeight: 1.3, color: "var(--ka-ink)", marginBottom: 32 }}>
              {content.manifesto.quote}
            </p>
            <div className="ka-about-manifesto-cols" style={{ paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
              <p style={{ fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.75, color: "var(--ka-ink)" }}>
                {content.manifesto.para1}
              </p>
              <p style={{ fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.75, color: "var(--ka-ink)" }}>
                {content.manifesto.para2}
              </p>
            </div>
          </div>
        </div>
      </section>}

      {/* Bio */}
      {!hidden.includes("bio") && <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 02 — About the author</div>
          <Link href="/media-kit" className="ka-arrow-link" style={{ fontSize: 10 }}>Press kit <span className="ka-arrow">→</span></Link>
        </div>
        <div className="ka-about-bio-grid">
          <div className="ka-about-bio-sticky" style={{ position: "sticky", top: 32 }}>
            <img
              src={content.bio.portraitUrl}
              alt="Karen Alexandra"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
            />
            <div style={{ marginTop: 24, padding: "20px 0", borderTop: "1px solid var(--ka-ink)", borderBottom: "1px solid var(--ka-line)" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 8 }}>The short version</div>
              <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(17px,1.6vw,22px)", lineHeight: 1.35 }}>
                {content.bio.tagline}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <p style={{ fontSize: "clamp(15px,1.3vw,19px)", lineHeight: 1.75 }}>
              <span style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(48px,6vw,64px)", fontStyle: "italic", float: "left", lineHeight: 0.85, paddingRight: 14, color: "var(--ka-accent-deep)", marginTop: 4 }}>I</span>
              {content.bio.para1.replace(/^I\s+/, "")}
            </p>
            <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.8, color: "var(--ka-ink)" }}>
              {content.bio.para2}
            </p>
            <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.8, color: "var(--ka-ink)" }}>
              {content.bio.para3}
            </p>
            <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.8, color: "var(--ka-ink)" }}>
              {content.bio.para4}
            </p>
            <div className="ka-about-bio-facts" style={{ marginTop: 24, paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
              {content.bio.facts.map((f, i) => (
                <div key={i}>
                  <div className="ka-eyebrow" style={{ marginBottom: 6, fontSize: 10 }}>{f.label}</div>
                  <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(14px,1.3vw,17px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.3 }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>}

      {/* World Map */}
      {!hidden.includes("map") && <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 03 — A world-citizen, in order</div>
          <div className="ka-eyebrow">11 places · 3 passports</div>
        </div>

        <div className="ka-about-map-grid">
          <div>
            <WorldMap active={active} setActive={setActive} />
            <p className="ka-eyebrow" style={{ marginTop: 16, color: "var(--ka-muted)" }}>
              ✱ Hover a number to read the chapter. The dotted line traces the route, in order.
            </p>
          </div>
          <WorldMapDetails active={active} />
        </div>

        {/* Timeline */}
        <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
          <div className="ka-eyebrow" style={{ marginBottom: 24 }}>Chronological — the long version</div>
          <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${PLACES.length}, 1fr)`, position: "relative", minWidth: `${PLACES.length * 80}px` }}>
            <div style={{ position: "absolute", top: 6, left: `${100 / (PLACES.length * 2)}%`, right: `${100 / (PLACES.length * 2)}%`, height: 1, background: "var(--ka-ink)", opacity: 0.4 }} />
            {PLACES.map((p, i) => (
              <button key={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{
                  position: "relative", background: "transparent", border: "none",
                  padding: "0 4px", cursor: "pointer", textAlign: "left",
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: active === i ? "var(--ka-ink)" : (i === PLACES.length - 1 ? "var(--ka-accent-deep)" : "var(--ka-bg-soft)"),
                  border: `1.5px solid ${i === PLACES.length - 1 ? "var(--ka-accent-deep)" : "var(--ka-ink)"}`,
                  marginBottom: 16, flexShrink: 0,
                }} />
                <div className="ka-eyebrow" style={{ fontSize: 9, color: "var(--ka-muted)", marginBottom: 6 }}>
                  {p.era.split(" — ")[0]}
                </div>
                <div style={{ fontFamily: "var(--ka-display)", fontSize: 13, fontStyle: i % 2 ? "italic" : "normal", color: active === i ? "var(--ka-ink)" : "var(--ka-muted)" }}>
                  {p.city}
                </div>
              </button>
            ))}
          </div>
          </div>
        </div>
      </section>}

      {/* Joys */}
      {!hidden.includes("joys") && <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 04 — A short list of joys</div>
          <div className="ka-eyebrow" style={{ color: "var(--ka-muted)" }}>In rough order →</div>
        </div>
        <div className="ka-about-joys-grid">
          {content.joys.map((j, i) => (
            <div key={i} style={{
              padding: "clamp(24px,3vw,40px) clamp(16px,2vw,24px) clamp(28px,3vw,44px)",
              borderRight: "1px solid var(--ka-line)", borderBottom: "1px solid var(--ka-line)",
              background: i === content.joys.length - 1 ? "var(--ka-bg-soft)" : "transparent",
              minHeight: "clamp(160px,18vw,220px)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", marginBottom: 12 }}>N° {j.n}</div>
                <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2vw,26px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.1 }}>{j.title}</h3>
              </div>
              <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(13px,1.1vw,16px)", color: "var(--ka-muted)", lineHeight: 1.4, marginTop: 16 }}>
                {j.desc}
              </p>
            </div>
          ))}
        </div>
      </section>}

      {/* Closing CTA */}
      {!hidden.includes("cta") && <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", background: "var(--ka-ink)", color: "var(--ka-bg)", textAlign: "center" }}>
        <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 32 }}>— A small invitation</div>
        <h2 style={{ fontFamily: "var(--ka-display)", color: "var(--ka-bg)", fontSize: "clamp(32px,6vw,80px)", fontStyle: "italic", lineHeight: 1, maxWidth: 1100, margin: "0 auto" }}>
          {content.cta.headline}
        </h2>
        <p style={{ color: "rgba(250,247,242,0.7)", maxWidth: 560, margin: "32px auto 48px", fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7 }}>
          {content.cta.subhead}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <a href="https://karenalexandra.substack.com" target="_blank" rel="noopener noreferrer" className="ka-btn ka-btn-light">
            The Saturday Letter →
          </a>
          <Link href="/contact" className="ka-arrow-link" style={{ color: "var(--ka-bg)", borderBottomColor: "rgba(250,247,242,0.4)" }}>
            Write to Karen <span className="ka-arrow">→</span>
          </Link>
        </div>
      </section>}
    </>
  );
}
