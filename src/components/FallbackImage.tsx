"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// Thin wrapper around next/image for hero images we don't control the
// origin of (Substack RSS entries, YouTube thumbnails) — a URL that's
// well-formed today can still 404, get hotlink-blocked, or simply
// disappear later. Browsers render that as a broken-image icon sitting on
// top of the card's own placeholder background, which reads as a bug.
// Renders nothing on load failure instead, letting the parent's plain
// placeholder background show through — the same graceful fallback the
// cards already use when there's no heroImage at all.
export default function FallbackImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps and always supplied via the spread; the rule can't see through it
  return <Image {...props} onError={() => setFailed(true)} />;
}
