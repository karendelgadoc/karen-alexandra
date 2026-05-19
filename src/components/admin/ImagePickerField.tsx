"use client";

import { useState } from "react";
import BlogImagePicker from "./BlogImagePicker";

interface Props {
  value: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  aspect?: string;       // e.g. "16/7" for hero
  label?: string;
}

export default function ImagePickerField({ value, onChange, onAltChange, aspect = "16/9", label = "Choose image" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "relative", width: "100%", aspectRatio: aspect,
          background: "#f5f5f4", cursor: "pointer", overflow: "hidden",
          border: value ? "1px solid #e7e5e4" : "1px dashed #d6d3d1",
          borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#a8a29e", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
        }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div
              style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                opacity: 0, transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              Click to replace
            </div>
          </>
        ) : (
          <span>+ {label}</span>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          style={{
            marginTop: 6, border: "none", background: "none",
            color: "#a8a29e", fontSize: 11, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer", padding: 0,
          }}
        >
          Remove image
        </button>
      )}

      <BlogImagePicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(pick) => {
          onChange(pick.url);
          if (onAltChange && pick.alt) onAltChange(pick.alt);
          setOpen(false);
        }}
      />
    </>
  );
}
