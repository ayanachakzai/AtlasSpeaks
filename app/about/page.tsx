"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ── STAR FIELD ───────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let W: number, H: number;
    const stars: {
      x: number; y: number; r: number; opacity: number;
      twinkle: number; speed: number; hue: string;
    }[] = [];

    function resize() {
      W = c!.width = window.innerWidth;
      H = c!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.1 + 0.15,
        opacity: Math.random() * 0.65 + 0.08,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.004,
        hue: Math.random() > 0.85 ? "200,180,120" : "200,220,255",
      });
    }

    let raf: number;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const o = s.opacity * (0.55 + 0.45 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", width: "100%", height: "100%",
      }}
    />
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "20px 6vw",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? "rgba(4,6,14,0.82)" : "rgba(4,6,14,0.5)",
      backdropFilter: "blur(20px) saturate(160%)",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`,
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textDecoration: "none" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.2rem", fontWeight: 400,
          letterSpacing: "0.06em", color: "#C4D8EE",
        }}>
          Atlas{" "}
          <em style={{ fontFamily: "'Humble Nostalgia', serif", fontStyle: "italic", color: "#E09020" }}>Speaks</em>
        </span>
      </a>
      <ul className="nav-links" style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "center" }}>
        {["Home", "About", "Chat"].map((label) => (
          <li key={label}>
            <a
              href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
              style={{
                fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#7A96B8", textDecoration: "none",
                ...(label === "Chat" ? {
                  padding: "8px 22px",
                  background: "rgba(200,122,16,0.12)",
                  border: "1px solid rgba(200,122,16,0.35)",
                  borderRadius: 100,
                  color: "#E09020",
                  letterSpacing: "0.14em",
                } : {}),
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ background: "#04060E", minHeight: "100vh" }}>
      <StarField />
      <Nav />

      {/* SECTION 1 — HERO */}
      <section style={{ position: "relative", zIndex: 10, width: "100vw", height: "100vh", overflow: "hidden" }}>
        <motion.img
          src="/assets/quetta-hero.png"
          alt="Koh-e-Murdar, Quetta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 50%, #04060E 100%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            textAlign: "center", paddingBottom: 60,
          }}
        >
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#E09020",
          }}>
            Koh-e-Murdar, Quetta
          </span>
        </motion.div>
      </section>

      {/* SECTION 2 — OPENING QUOTE */}
      <section style={{ position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "120px 6vw", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Humble Nostalgia', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 300, fontStyle: "italic",
              color: "#C4D8EE", lineHeight: 1.35,
              margin: 0,
            }}
          >
            &ldquo;I come from a place the world knows mostly through its absence — through what it lacks in headlines, through what gets left out of maps.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* SECTION 3 — TWO COLUMN BIO */}
      <section style={{ position: "relative", zIndex: 10 }}>
        <div className="bio-grid" style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "0 6vw 120px",
          display: "flex", flexDirection: "row", gap: "60px", alignItems: "flex-start",
        }}>
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="bio-left"
            style={{ width: "55%", flexShrink: 0 }}
          >
            <span style={{
              display: "block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#E09020",
              marginBottom: 24,
            }}>
              The Creator
            </span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#7A96B8", lineHeight: 1.9, marginBottom: 20 }}>
              My name is Muhammad Ayan Achakzai. I am a filmmaker and cultural storyteller from Quetta, Balochistan — now studying MSc Applied Machine Learning for Creatives at UAL&apos;s Creative Computing Institute in London.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#7A96B8", lineHeight: 1.9, marginBottom: 20 }}>
              Atlas Speaks began as a university project. But somewhere between writing the code and feeding it 205 cultural facts about my home, it became something else. A conversation I had always wanted to have. A way to say: Balochistan is not a conflict. It is not a statistic. It is a sunrise over Koh-e-Murdar. It is poetry in Brahui. It is hospitality that does not ask your name before feeding you.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#7A96B8", lineHeight: 1.9, margin: 0 }}>
              I built this for the curious. For the ones who type a question they were afraid to ask out loud. For anyone who wants to understand — not just read about — a place.
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bio-right"
            style={{ width: "42%", flexShrink: 0 }}
          >
            <img
              src="/assets/london.jpg"
              alt="London"
              className="bio-img"
              style={{
                width: "100%", height: 520,
                objectFit: "cover", objectPosition: "center top",
                display: "block",
                border: "1px solid rgba(200,122,16,0.2)",
              }}
            />
            <p style={{
              fontFamily: "'Humble Nostalgia', serif",
              fontSize: 11, color: "#48607C",
              fontStyle: "italic", marginTop: 10,
            }}>
              London, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — MISSION */}
      <section style={{ position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mission-section"
          style={{
            maxWidth: 700, margin: "0 auto",
            padding: "80px 6vw",
            textAlign: "center",
          }}
        >
          <span style={{
            display: "block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#E09020",
            marginBottom: 20,
          }}>
            The Mission
          </span>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 300, color: "#C4D8EE",
            lineHeight: 1.2, marginBottom: 24,
          }}>
            To represent Balochistan as it actually is.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, color: "#7A96B8",
            lineHeight: 1.9, margin: 0,
          }}>
            Atlas Speaks is an AI built on verified cultural facts, myths, comparisons and music from Pakistan&apos;s regions. It does not speak about Balochistan. It speaks from it.
          </p>
        </motion.div>
      </section>

      {/* SECTION 5 — CTA */}
      <section style={{ position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", padding: "60px 6vw 120px" }}
        >
          <a href="/chat" style={{
            display: "inline-block", padding: "14px 44px",
            background: "rgba(200,122,16,0.1)",
            border: "1px solid rgba(200,122,16,0.5)",
            color: "#C4D8EE",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 500,
            letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: "pointer", textDecoration: "none",
            borderRadius: 2, transition: "all 0.35s",
          }}>
            Talk to Atlas →
          </a>
          <div style={{ marginTop: 20 }}>
            <a href="/" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "#48607C",
              textDecoration: "none",
            }}>
              ← Back home
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 10,
        padding: "44px 6vw",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(4,6,14,0.6)",
        backdropFilter: "blur(20px)",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.1rem", fontWeight: 300,
          letterSpacing: "0.08em", color: "#C4D8EE",
        }}>
          Atlas <em style={{ fontStyle: "normal", color: "#E09020" }}>Speaks</em>
        </div>
        <div style={{ fontSize: 12, color: "#48607C" }}>
          Made in Quetta · Built for the world 🇵🇰
        </div>
      </footer>

      <style>{`
        body { background: #04060E; }

        @media (max-width: 760px) {
          /* Nav */
          .nav-links { gap: 16px !important; }

          /* Bio grid: stack vertically */
          .bio-grid {
            flex-direction: column !important;
            gap: 40px !important;
            padding-bottom: 80px !important;
          }
          .bio-left {
            width: 100% !important;
          }
          .bio-right {
            width: 100% !important;
          }
          .bio-img {
            height: 360px !important;
            object-position: top !important;
          }

          .mission-section {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }

          /* Footer */
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
