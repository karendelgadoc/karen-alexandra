import Link from "next/link";
import Image from "next/image";
import { getFeaturedBlogPosts } from "@/lib/blog-db";
import { KaMarquee, KaSectionHead } from "@/components/KaComponents";

export const revalidate = 60;

const VIDEOS = [
  {
    title: "A week in Mykonos — villas, yacht days & the best restaurants",
    category: "Travel",
    length: "18:42",
    image: "/photos/mykonos-infinity.jpg",
  },
  {
    title: "What I packed for Mallorca — resort wardrobe breakdown",
    category: "Fashion",
    length: "12:18",
    image: "/photos/mallorca-cliff.jpg",
  },
  {
    title: "Morning routine in Santorini — wellness habits I never skip",
    category: "Wellness",
    length: "09:55",
    image: "/photos/santorini-pool.jpg",
  },
];

const CATEGORIES = [
  {
    label: "Fashion",
    desc: "Wardrobe, styling & the art of dressing well",
    image: "/photos/marbella-street.jpg",
    slug: "fashion",
  },
  {
    label: "Travel",
    desc: "Destinations, hotels & how I move through the world",
    image: "/photos/mykonos-terrace.jpg",
    slug: "travel",
  },
  {
    label: "Wellness",
    desc: "Rituals, routines and the slower pace",
    image: "/photos/mykonos-pool.jpg",
    slug: "wellness",
  },
  {
    label: "Lifestyle",
    desc: "Home, culture and everything in between",
    image: "/photos/mykonos-cocktail.jpg",
    slug: "lifestyle",
  },
];

export default async function HomePage() {
  const featuredPosts = await getFeaturedBlogPosts(3).catch(() => []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "88vh",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        {/* Left — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px",
            paddingBottom: "80px",
            borderRight: "1px solid var(--ka-line)",
          }}
        >
          <span className="ka-eyebrow" style={{ marginBottom: "24px" }}>
            Est. 2014 · The Art of Well
          </span>
          <h1
            style={{
              fontFamily: "var(--ka-display)",
              fontSize: "clamp(72px, 8vw, 120px)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: "28px",
            }}
          >
            The Art<br />of Well.
          </h1>
          <p
            style={{
              fontFamily: "var(--ka-body)",
              fontSize: "15px",
              color: "var(--ka-ink-soft)",
              maxWidth: "400px",
              lineHeight: 1.7,
              fontWeight: 300,
              marginBottom: "48px",
            }}
          >
            A global citizen&apos;s guide to well living — fashion, travel,
            wellness and the life that happens in between.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/journal" className="ka-btn">
              Read the Journal <span>→</span>
            </Link>
            <Link href="/portfolio" className="ka-btn" style={{ borderColor: "var(--ka-line)", color: "var(--ka-muted)" }}>
              The Work
            </Link>
          </div>
        </div>

        {/* Right — portrait */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Image
            src="/photos/portrait-lavender.jpg"
            alt="Karen Alexandra"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
            sizes="50vw"
          />
          {/* Editor card */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "32px",
              background: "var(--ka-bg)",
              border: "1px solid var(--ka-ink)",
              padding: "20px 24px",
              maxWidth: "260px",
            }}
          >
            <span className="ka-eyebrow" style={{ display: "block", marginBottom: "8px" }}>
              This week&apos;s letter
            </span>
            <p
              style={{
                fontFamily: "var(--ka-display)",
                fontSize: "18px",
                fontStyle: "italic",
                lineHeight: 1.3,
                marginBottom: "12px",
              }}
            >
              On dressing for the life you actually want.
            </p>
            <Link href="/journal" className="ka-arrow-link" style={{ fontSize: "10px" }}>
              Read now <span className="ka-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────── */}
      <KaMarquee />

      {/* ── Featured Stories ─────────────────────────────────────────── */}
      <section style={{ padding: "96px 0" }}>
        <KaSectionHead num="01" title="From the Journal" href="/journal" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 4fr 4fr",
            gap: "2px",
            padding: "0 64px",
          }}
        >
          {featuredPosts.length === 0
            ? [
                { image: "/photos/mykonos-villa.jpg", title: "On the art of slow travel", category: "Travel", slug: "#" },
                { image: "/photos/marbella-beach.jpg", title: "The Mallorca edit", category: "Fashion", slug: "#" },
                { image: "/photos/santorini-caldera.jpg", title: "Morning rituals abroad", category: "Wellness", slug: "#" },
              ].map((post, i) => (
                <Link key={i} href={`/journal/${post.slug}`} className="group" style={{ display: "block" }}>
                  <div
                    style={{
                      aspectRatio: i === 0 ? "5/6" : "4/5",
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--ka-sand)",
                    }}
                  >
                    <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} sizes="33vw" />
                  </div>
                  <div style={{ padding: "18px 0 0" }}>
                    <span className="ka-eyebrow">{post.category}</span>
                    <p
                      style={{
                        fontFamily: "var(--ka-display)",
                        fontSize: "24px",
                        fontStyle: "italic",
                        marginTop: "8px",
                        lineHeight: 1.2,
                      }}
                    >
                      {post.title}
                    </p>
                  </div>
                </Link>
              ))
            : featuredPosts.map((post, i) => (
                <Link key={post.slug} href={`/journal/${post.slug}`} className="group" style={{ display: "block" }}>
                  <div
                    style={{
                      aspectRatio: i === 0 ? "5/6" : "4/5",
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--ka-sand)",
                    }}
                  >
                    {post.heroImage ? (
                      <Image
                        src={post.heroImage}
                        alt={post.heroAlt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="33vw"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
                    )}
                  </div>
                  <div style={{ padding: "18px 0 0" }}>
                    <span className="ka-eyebrow">{post.category}</span>
                    <p
                      style={{
                        fontFamily: "var(--ka-display)",
                        fontSize: "24px",
                        fontStyle: "italic",
                        marginTop: "8px",
                        lineHeight: 1.2,
                      }}
                    >
                      {post.title}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--ka-ink-soft)",
                        marginTop: "8px",
                        lineHeight: 1.6,
                        fontWeight: 300,
                      }}
                    >
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* ── Editor ───────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--ka-bg-soft)",
          padding: "96px 64px",
          textAlign: "center",
          borderTop: "1px solid var(--ka-line)",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "28px" }}>
          Letter from the editor
        </span>
        <blockquote
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 400,
            fontStyle: "italic",
            maxWidth: "780px",
            margin: "0 auto 40px",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;The art of living well is knowing what to keep and what to
          leave behind.&rdquo;
        </blockquote>
        <Link href="/journal" className="ka-arrow-link">
          Read the letter <span className="ka-arrow">→</span>
        </Link>
      </section>

      {/* ── From the Reel ────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0" }}>
        <KaSectionHead num="02" title="From the Reel" href="/watch" linkLabel="Watch all" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            padding: "0 64px",
          }}
        >
          {VIDEOS.map((v, i) => (
            <Link key={i} href="/watch" style={{ display: "block" }}>
              <div
                style={{
                  aspectRatio: "16/9",
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--ka-sand)",
                }}
              >
                <Image src={v.image} alt={v.title} fill style={{ objectFit: "cover" }} sizes="33vw" />
                {/* Play button */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(10,10,10,0.15)",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "var(--ka-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="var(--ka-ink)">
                      <polygon points="5,3 15,9 5,15" />
                    </svg>
                  </div>
                </div>
                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    fontFamily: "var(--ka-mono)",
                    fontSize: "10px",
                    background: "var(--ka-ink)",
                    color: "var(--ka-bg)",
                    padding: "2px 6px",
                  }}
                >
                  {v.length}
                </span>
              </div>
              <div style={{ padding: "14px 0 0" }}>
                <span className="ka-eyebrow">{v.category}</span>
                <p
                  style={{
                    fontFamily: "var(--ka-display)",
                    fontSize: "20px",
                    fontStyle: "italic",
                    marginTop: "6px",
                    lineHeight: 1.25,
                  }}
                >
                  {v.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 0",
          background: "var(--ka-bg-soft)",
          borderTop: "1px solid var(--ka-line)",
        }}
      >
        <KaSectionHead num="03" title="By Category" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
            padding: "0 64px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/journal?category=${cat.slug}`}
              style={{ display: "block", position: "relative", overflow: "hidden" }}
            >
              <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "28px",
                    left: "24px",
                    right: "24px",
                    color: "var(--ka-bg)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--ka-display)",
                      fontSize: "32px",
                      fontStyle: "italic",
                      marginBottom: "6px",
                    }}
                  >
                    {cat.label}
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 300, opacity: 0.85 }}>{cat.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--ka-ink)",
          color: "var(--ka-bg)",
          padding: "96px 64px",
          textAlign: "center",
        }}
      >
        <span
          className="ka-eyebrow"
          style={{ color: "var(--ka-accent)", display: "block", marginBottom: "20px" }}
        >
          The Letter
        </span>
        <h2
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: "16px",
            color: "var(--ka-bg)",
          }}
        >
          Join the conversation
        </h2>
        <p
          style={{
            fontFamily: "var(--ka-body)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "480px",
            margin: "0 auto 48px",
            fontWeight: 300,
          }}
        >
          Weekly letters on fashion, travel and the art of living well. No noise — only
          what matters.
        </p>
        <form
          action="#"
          style={{
            display: "flex",
            maxWidth: "460px",
            margin: "0 auto",
            gap: "0",
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            style={{
              flex: 1,
              padding: "16px 20px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "transparent",
              color: "var(--ka-bg)",
              fontFamily: "var(--ka-body)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="ka-btn ka-btn-light"
            style={{ borderLeft: "none" }}
          >
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}
