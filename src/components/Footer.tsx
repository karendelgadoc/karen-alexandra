import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ka-footer">
      <div className="ka-footer-grid">
        {/* Brand */}
        <div>
          <div className="ka-footer-mark">
            <Image
              src="/logo-monogram.png"
              alt="KA"
              width={56}
              height={56}
              style={{ height: "auto" }}
            />
          </div>
          <p className="ka-footer-tag">
            The art of well — stories from a life lived in cashmere, on marble
            lobbies, and at the front row.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/case-studies">Case Studies</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/media-kit">Media Kit</Link></li>
            <li><Link href="/journal">Journal</Link></li>
            <li><Link href="/watch">Watch</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4>Categories</h4>
          <ul>
            <li><Link href="/journal?category=fashion">Fashion</Link></li>
            <li><Link href="/journal?category=travel">Travel</Link></li>
            <li><Link href="/journal?category=wellness">Wellness</Link></li>
            <li><Link href="/journal?category=lifestyle">Lifestyle</Link></li>
          </ul>
        </div>

        {/* Elsewhere */}
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li>
              <a href="https://www.youtube.com/@KarenAlexandra" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://www.pinterest.com/karenalexandra__/" target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/karenalexandrac" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ka-footer-meta">
        <span>© {year} Karen Alexandra. All rights reserved.</span>
        <div style={{ display: "flex", gap: "32px" }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Press</Link>
          <Link href="/contact">Inquiries</Link>
        </div>
      </div>
    </footer>
  );
}
