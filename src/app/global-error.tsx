"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "64px", textAlign: "center" }}>
        <p>Something went wrong.</p>
        <button onClick={() => reset()} style={{ marginTop: "24px", padding: "12px 24px", cursor: "pointer" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
