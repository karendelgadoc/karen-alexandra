export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <section style={{ padding: "120px 64px", textAlign: "center" }}>
      <p
        style={{
          fontFamily: "var(--ka-display)",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontStyle: "italic",
          marginBottom: 24,
        }}
      >
        Page not found.
      </p>
      <a href="/" style={{ fontFamily: "var(--ka-body)", fontSize: 15 }}>
        Return home →
      </a>
    </section>
  );
}
