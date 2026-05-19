"use client";

import { useMemo } from "react";
import { analyzePost, overallScore, type Check, type CheckStatus } from "@/lib/seo-analyzer";
import type { BlogPostInput } from "@/lib/blog-db";

const STATUS_COLORS: Record<CheckStatus, { bg: string; fg: string; dot: string; label: string }> = {
  good: { bg: "#ecfdf5", fg: "#047857", dot: "#10b981", label: "Good"  },
  ok:   { bg: "#fffbeb", fg: "#b45309", dot: "#f59e0b", label: "OK"    },
  bad:  { bg: "#fef2f2", fg: "#b91c1c", dot: "#ef4444", label: "Fix"   },
};

const GRADE_COLOR: Record<string, string> = {
  A: "#10b981", B: "#10b981", C: "#f59e0b", D: "#f59e0b", F: "#ef4444",
};

function CheckRow({ check }: { check: Check }) {
  const c = STATUS_COLORS[check.status];
  return (
    <div style={{ display: "flex", gap: 10, padding: "9px 12px", borderBottom: "1px solid #f5f5f4", background: "white" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, marginTop: 6, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#292524", marginBottom: 2 }}>{check.label}</p>
        <p style={{ fontSize: 11, color: "#78716c", lineHeight: 1.5 }}>{check.message}</p>
      </div>
    </div>
  );
}

export default function SeoPanel({ form }: { form: BlogPostInput }) {
  const checks = useMemo(() => analyzePost(form), [form]);
  const { score, grade } = useMemo(() => overallScore(checks), [checks]);

  const seoChecks = checks.filter((c) => c.group === "seo");
  const geoChecks = checks.filter((c) => c.group === "geo");
  const readChecks = checks.filter((c) => c.group === "readability");

  return (
    <div style={{ background: "white", border: "1px solid #e7e5e4", borderRadius: 6, overflow: "hidden", position: "sticky", top: 20 }}>
      {/* ── Score header ─────────────────────────────────────────────── */}
      <div style={{ padding: "20px 18px", background: "#fafaf9", borderBottom: "1px solid #e7e5e4" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#78716c" }}>
            SEO + GEO Score
          </p>
          <span style={{ fontSize: 11, color: "#a8a29e", fontFamily: "monospace" }}>{checks.length} checks</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: GRADE_COLOR[grade], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, fontWeight: 700, fontFamily: "ui-serif, Georgia, serif" }}>
            {grade}
          </div>
          <div>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#292524", lineHeight: 1 }}>{score}<span style={{ fontSize: 14, color: "#a8a29e", fontWeight: 400 }}>/100</span></p>
            <p style={{ fontSize: 11, color: "#78716c", marginTop: 4 }}>
              {score >= 90 ? "Search-ready and AI-friendly."
               : score >= 75 ? "Good — fix the yellow items for an A."
               : score >= 60 ? "OK — keep going."
               : "Needs work. Address the red items first."}
            </p>
          </div>
        </div>
      </div>

      {/* ── SEO group ──────────────────────────────────────────────── */}
      <div style={{ padding: "10px 14px 4px", background: "white", borderBottom: "1px solid #f5f5f4" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#78716c" }}>
          Search Engines (SEO)
        </p>
      </div>
      {seoChecks.map((c) => <CheckRow key={c.id} check={c} />)}

      {/* ── GEO group ─────────────────────────────────────────────── */}
      <div style={{ padding: "10px 14px 4px", background: "#faf5ff", borderBottom: "1px solid #f5f5f4", borderTop: "1px solid #f5f5f4" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7c3aed" }}>
          AI Search (GEO)
        </p>
        <p style={{ fontSize: 10, color: "#a78bfa", marginTop: 2 }}>ChatGPT · Perplexity · Claude · Google AI</p>
      </div>
      {geoChecks.map((c) => <CheckRow key={c.id} check={c} />)}

      {/* ── Readability ────────────────────────────────────────── */}
      {readChecks.length > 0 && (
        <>
          <div style={{ padding: "10px 14px 4px", background: "white", borderTop: "1px solid #f5f5f4", borderBottom: "1px solid #f5f5f4" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#78716c" }}>
              Readability
            </p>
          </div>
          {readChecks.map((c) => <CheckRow key={c.id} check={c} />)}
        </>
      )}

      {/* ── Snippet preview ──────────────────────────────────────── */}
      <div style={{ padding: "16px 14px", borderTop: "1px solid #e7e5e4", background: "#fafaf9" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#78716c", marginBottom: 10 }}>
          Google preview
        </p>
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          <p style={{ fontSize: 11, color: "#202124", marginBottom: 2 }}>karenalexandra.com<span style={{ color: "#5f6368" }}> &rsaquo; journal &rsaquo; {form.slug || "your-slug"}</span></p>
          <p style={{ fontSize: 18, color: "#1a0dab", marginBottom: 2, lineHeight: 1.3 }}>{(form.seoTitle?.trim() || form.title || "Your post title")} — Karen Alexandra</p>
          <p style={{ fontSize: 13, color: "#4d5156", lineHeight: 1.4 }}>{form.seoDescription?.trim() || form.excerpt || "Your meta description will appear here."}</p>
        </div>
      </div>
    </div>
  );
}
