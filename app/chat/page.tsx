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
      <ul style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "center" }}>
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

// ── LIQUID GLASS CARD ────────────────────────────────────────────────────────
function LiquidGlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ perspective: "1200px", width: "100%" }}>
      <style>{`
        @keyframes liquidFloat {
          0%   { transform: rotateY(-6deg) rotateX(2deg); }
          50%  { transform: rotateY(6deg)  rotateX(-2deg); }
          100% { transform: rotateY(-6deg) rotateX(2deg); }
        }
      `}</style>
      <div style={{
        animation: "liquidFloat 8s ease-in-out infinite",
        background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 100%)",
        backdropFilter: "blur(40px) saturate(200%)",
        border: "1px solid rgba(0,255,65,0.2)",
        borderRadius: 24,
        padding: "48px 44px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(0,255,65,0.06), inset 0 1px 0 rgba(0,255,65,0.1)",
        position: "relative",
        overflow: "hidden",
        transformStyle: "preserve-3d",
      }}>
        {/* Light streaks */}
        <div style={{ position: "absolute", left: "15%", width: 1, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "45%", width: 1, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "20%", width: 2, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(0,255,65,0.12), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
        {/* Top edge highlight */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.4), transparent)" }} />
        {/* Scanline overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, borderRadius: 24,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)",
        }} />
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── LOADING DOTS ─────────────────────────────────────────────────────────────
function LoadingDot() {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
      `}</style>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00FF41",
            boxShadow: "0 0 6px rgba(0,255,65,0.6)",
            animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
          }} />
        ))}
      </div>
    </>
  );
}

// ── API ───────────────────────────────────────────────────────────────────────
async function callAtlas(
  message: string,
  musicStep = 0,
  musicPreferences: Record<string, string> = {},
  inMusicMode = false,
) {
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      music_step: musicStep,
      music_preferences: musicPreferences,
      in_music_mode: inMusicMode,
    }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return await res.json();
}

// ── ERROR DISPLAY ─────────────────────────────────────────────────────────────
function ErrorBox({ error, onDismiss }: { error: string; onDismiss: () => void }) {
  return (
    <div style={{
      marginTop: 32,
      padding: "20px 24px",
      borderRadius: 12,
      background: "rgba(180,40,40,0.08)",
      border: "1px solid rgba(200,60,60,0.3)",
      display: "flex", alignItems: "flex-start", gap: 16,
    }}>
      <span style={{ color: "#C05050", fontSize: 18, lineHeight: 1 }}>⚠</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C08080", margin: "0 0 4px", fontWeight: 500 }}>
          Could not reach Atlas
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#7A5050", margin: 0, lineHeight: 1.6 }}>
          {error.includes("Failed to fetch") || error.includes("NetworkError") || error.includes("ERR_CONNECTION_REFUSED")
            ? "The backend server isn't running. Start it with: cd atlas_deploy && uvicorn main:app --port 8000"
            : error}
        </p>
      </div>
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", color: "#7A5050", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
      >✕</button>
    </div>
  );
}

// ── BACKEND STATUS ────────────────────────────────────────────────────────────
function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/health`)
      .then(r => r.ok ? setStatus("online") : setStatus("offline"))
      .catch(() => setStatus("offline"));
  }, []);

  if (status === "checking") return null;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "6px 14px", borderRadius: 100,
      background: status === "online" ? "rgba(40,160,80,0.08)" : "rgba(180,40,40,0.08)",
      border: `1px solid ${status === "online" ? "rgba(40,160,80,0.25)" : "rgba(200,60,60,0.25)"}`,
      marginBottom: 32,
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: status === "online" ? "#40C060" : "#C05050",
      }} />
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: status === "online" ? "#40A050" : "#C07070",
      }}>
        {status === "online" ? "Atlas backend online" : "Backend offline — start the Python server"}
      </span>
    </div>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const amberBtn: React.CSSProperties = {
  padding: "14px 32px",
  borderRadius: 100,
  fontSize: 11,
  letterSpacing: "0.18em",
  fontFamily: "'DM Sans', sans-serif",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 0.3s",
  background: "rgba(200,122,16,0.15)",
  border: "1px solid rgba(200,122,16,0.5)",
  color: "#E09020",
};

const mutedBtn: React.CSSProperties = {
  padding: "14px 32px",
  borderRadius: 100,
  fontSize: 11,
  letterSpacing: "0.18em",
  fontFamily: "'DM Sans', sans-serif",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 0.3s",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#48607C",
};

const textInput: React.CSSProperties = {
  flex: 1,
  padding: "14px 20px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "#C4D8EE",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};

const sendBtn: React.CSSProperties = {
  padding: "14px 28px",
  background: "rgba(200,122,16,0.15)",
  border: "1px solid rgba(200,122,16,0.4)",
  borderRadius: 12,
  color: "#E09020",
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  cursor: "pointer",
};

const eyebrow: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "#E09020",
  display: "block",
};

// ── TEXT CLEANER ─────────────────────────────────────────────────────────────
function clean(text: string): string {
  return text
    .replace(/\*\*/g, "")                  // strip bold markers
    .replace(/^[=\-]{3,}\s*$/gm, "")       // strip separator lines (===, ---)
    .replace(/\n{3,}/g, "\n\n")            // collapse excessive blank lines
    .trim();
}

// ── MYTH MODE ────────────────────────────────────────────────────────────────
const MYTH_TOPICS = [
  "Women in Pakistan", "Religion & Daily Life", "Food Culture",
  "Safety & Security", "Balochistan", "Education",
  "Music & Arts", "Economy", "Hospitality",
  "Youth Culture", "Politics", "Family Life",
];

function MythMode() {
  const [mythInput, setMythInput] = useState("");
  const [mythResult, setMythResult] = useState<string | null>(null);
  const [mythLoading, setMythLoading] = useState(false);
  const [mythError, setMythError] = useState<string | null>(null);

  async function handleMythSubmit(question?: string) {
    const q = question ?? mythInput;
    if (!q.trim()) return;
    setMythLoading(true);
    setMythResult(null);
    setMythError(null);
    try {
      const data = await callAtlas(q);
      setMythResult(clean(data.reply));
    } catch (e: any) {
      setMythError(e.message ?? "Unknown error");
    } finally {
      setMythLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {!mythResult && !mythLoading && (
        <>
          {/* Topic grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10, marginBottom: 32,
          }}>
            {MYTH_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => { setMythInput(topic); handleMythSubmit(topic); }}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#7A96B8",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,122,16,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#C4D8EE";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,122,16,0.06)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#7A96B8";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Custom input row */}
          <div style={{ display: "flex", gap: 12 }}>
            <input
              style={textInput}
              placeholder="Or ask your own question..."
              value={mythInput}
              onChange={e => setMythInput(e.target.value)}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,122,16,0.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              onKeyDown={e => { if (e.key === "Enter") handleMythSubmit(); }}
            />
            <button style={sendBtn} onClick={() => handleMythSubmit()}>Ask Atlas</button>
          </div>
        </>
      )}

      {mythLoading && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <LoadingDot />
        </div>
      )}

      {mythError && (
        <ErrorBox error={mythError} onDismiss={() => { setMythError(null); setMythInput(""); }} />
      )}

      {mythResult && (
        <div style={{ width: "100%" }}>
          <LiquidGlassCard>
            <p style={{
              fontFamily: "'Jersey 10', monospace",
              fontSize: "1rem",
              color: "#00FF41",
              lineHeight: 1.9,
              letterSpacing: "0.02em",
              textShadow: "0 0 8px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.15)",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}>
              {mythResult}
            </p>
            <button
              style={{ ...amberBtn, marginTop: 32, fontSize: 12 }}
              onClick={() => { setMythResult(null); setMythInput(""); }}
            >
              Ask another question →
            </button>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  );
}

// ── MUSIC MODE ───────────────────────────────────────────────────────────────
const MUSIC_STEPS: {
  question: string;
  options: { label: string; letter: string }[];
  prefKey: string;
}[] = [
  {
    question: "What mood are you in?",
    prefKey: "mood",
    options: [
      { label: "Energetic", letter: "a" },
      { label: "Calm",      letter: "b" },
      { label: "Romantic",  letter: "c" },
      { label: "Emotional", letter: "d" },
      { label: "Curious",   letter: "e" },
    ],
  },
  {
    question: "Which style sounds interesting?",
    prefKey: "style",
    options: [
      { label: "Modern",      letter: "a" },
      { label: "Traditional", letter: "b" },
      { label: "Spiritual",   letter: "c" },
      { label: "Fusion",      letter: "d" },
    ],
  },
  {
    question: "Vocal preference?",
    prefKey: "vocals",
    options: [
      { label: "Powerful", letter: "a" },
      { label: "Soft",     letter: "b" },
      { label: "Any",      letter: "c" },
    ],
  },
];

function MusicMode() {
  const [musicStep, setMusicStep] = useState(0);
  const [musicPreferences, setMusicPreferences] = useState<Record<string, string>>({});
  const [inMusicMode, setInMusicMode] = useState(false);
  const [musicResult, setMusicResult] = useState<string | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);

  async function handleMusicBegin() {
    setMusicLoading(true);
    setMusicError(null);
    try {
      const data = await callAtlas("music", 0, {}, false);
      setMusicStep(data.music_step);
      setInMusicMode(data.in_music_mode);
    } catch (e: any) {
      setMusicError(e.message ?? "Unknown error");
    } finally {
      setMusicLoading(false);
    }
  }

  async function handleMusicAnswer(letter: string, prefKey: string) {
    const valueMap: Record<string, Record<string, string>> = {
      mood:   { a: "energetic", b: "calm", c: "romantic", d: "emotional", e: "curious" },
      style:  { a: "modern", b: "traditional", c: "spiritual", d: "fusion" },
      vocals: { a: "powerful", b: "soft", c: "any" },
    };

    const newPrefs = { ...musicPreferences, [prefKey]: valueMap[prefKey][letter] };
    setMusicPreferences(newPrefs);
    setMusicLoading(true);
    setMusicError(null);

    try {
      const data = await callAtlas(letter, musicStep, newPrefs, inMusicMode);
      setMusicStep(data.music_step);
      setInMusicMode(data.in_music_mode);
      if (!data.in_music_mode) {
        setMusicResult(clean(data.reply));
        setMusicStep(0);
      }
    } catch (e: any) {
      setMusicError(e.message ?? "Unknown error");
    } finally {
      setMusicLoading(false);
    }
  }

  function resetMusic() {
    setMusicResult(null);
    setMusicStep(0);
    setMusicPreferences({});
    setInMusicMode(false);
  }

  // Intro screen
  if (musicStep === 0 && !musicResult) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 48,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Jersey 10', monospace",
            fontSize: "1.4rem",
            color: "#00FF41",
            letterSpacing: "0.02em",
            textShadow: "0 0 8px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.15)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Let Atlas find music for your mood.
          </p>
          {musicLoading
            ? <div style={{ display: "flex", justifyContent: "center" }}><LoadingDot /></div>
            : <button style={amberBtn} onClick={handleMusicBegin}>Begin →</button>
          }
        </div>
        {musicError && (
          <ErrorBox error={musicError} onDismiss={() => setMusicError(null)} />
        )}
      </div>
    );
  }

  // Result screen
  if (musicResult) {
    const songChunks = musicResult
      .split(/\n(?=\d+\.|🎵\s*\d+\.)/)
      .map(s => s.trim())
      .filter(Boolean);

    return (
      <div style={{ width: "100%" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {songChunks.map((chunk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative", marginBottom: 20 }}
            >
              {/* Amber number badge */}
              <div style={{
                position: "absolute", top: -12, left: 24, zIndex: 10,
                background: "#C87A10", color: "white",
                borderRadius: 100, padding: "4px 14px",
                fontSize: 11, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, letterSpacing: "0.06em",
              }}>
                {i + 1}
              </div>

              {/* Smaller card */}
              <div style={{ perspective: "1200px" }}>
                <div style={{
                  animation: "liquidFloat 8s ease-in-out infinite",
                  animationDelay: `${i * 0.8}s`,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 100%)",
                  backdropFilter: "blur(40px) saturate(200%)",
                  border: "1px solid rgba(0,255,65,0.2)",
                  borderRadius: 24,
                  padding: "32px 36px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(0,255,65,0.06), inset 0 1px 0 rgba(0,255,65,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                }}>
                  {/* Light streaks */}
                  <div style={{ position: "absolute", left: "15%", width: 1, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", left: "45%", width: 1, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", right: "20%", width: 2, height: "140%", top: "-20%", background: "linear-gradient(to bottom, transparent, rgba(0,255,65,0.12), transparent)", transform: "rotate(25deg)", pointerEvents: "none" }} />
                  {/* Top edge highlight */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.4), transparent)" }} />
                  {/* Scanline overlay */}
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, borderRadius: 24, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)" }} />

                  <p style={{
                    position: "relative", zIndex: 2,
                    fontFamily: "'Jersey 10', monospace",
                    fontSize: "1rem",
                    color: "#00FF41",
                    lineHeight: 1.9,
                    letterSpacing: "0.02em",
                    textShadow: "0 0 8px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.15)",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}>
                    {chunk}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: songChunks.length * 0.15 + 0.2, duration: 0.5 }}
            style={{ textAlign: "center", marginTop: 12 }}
          >
            <button style={{ ...amberBtn, fontSize: 12 }} onClick={resetMusic}>
              Discover another song →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Question screen (steps 1–3)
  const stepData = MUSIC_STEPS[musicStep - 1];
  const completedSteps = musicStep - 1;

  return (
    <div style={{ width: "100%" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i < completedSteps ? "#C87A10" : "rgba(255,255,255,0.15)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      <p style={{
        fontFamily: "'Jersey 10', monospace",
        fontSize: "1.4rem",
        color: "#00FF41",
        letterSpacing: "0.02em",
        textShadow: "0 0 8px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.15)",
        marginBottom: 32,
        textAlign: "center",
      }}>
        {stepData.question}
      </p>

      {musicError && (
        <ErrorBox error={musicError} onDismiss={() => setMusicError(null)} />
      )}

      {musicLoading
        ? <div style={{ display: "flex", justifyContent: "center" }}><LoadingDot /></div>
        : (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {stepData.options.map(({ label, letter }) => (
              <button
                key={letter}
                style={{
                  padding: "14px 28px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C4D8EE",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,122,16,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,122,16,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#E09020";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#C4D8EE";
                }}
                onClick={() => handleMusicAnswer(letter, stepData.prefKey)}
              >
                {label}
              </button>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── COMPARE MODE ─────────────────────────────────────────────────────────────
const COMPARE_COUNTRIES = ["UK", "USA", "India", "China", "Turkey"];

const RANDOM_TOPICS = [
  "food", "family values", "music", "hospitality", "education",
  "religion", "architecture", "women's roles", "festivals", "history",
  "language", "clothing", "art", "sport", "humour",
];

function CompareMode() {
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  async function handleCountryClick(country: string) {
    setActiveCountry(country);
    setCompareLoading(true);
    setCompareResult(null);
    setCompareError(null);
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    try {
      const data = await callAtlas(`Compare Pakistan with ${country} on the topic of ${topic}`);
      setCompareResult(clean(data.reply));
    } catch (e: any) {
      setCompareError(e.message ?? "Unknown error");
    } finally {
      setCompareLoading(false);
    }
  }

  function resetCompare() {
    setCompareResult(null);
    setActiveCountry(null);
  }

  const countryBtn = (active: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    borderRadius: 100,
    fontSize: 11,
    letterSpacing: "0.18em",
    fontFamily: "'DM Sans', sans-serif",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.25s",
    background: active ? "rgba(200,122,16,0.15)" : "rgba(255,255,255,0.04)",
    border: active ? "1px solid rgba(200,122,16,0.5)" : "1px solid rgba(255,255,255,0.08)",
    color: active ? "#E09020" : "#7A96B8",
  });

  if (compareResult) {
    return (
      <div style={{ width: "100%" }}>
        <LiquidGlassCard>
          <p style={{
            fontFamily: "'Jersey 10', monospace",
            fontSize: "1rem",
            color: "#00FF41",
            lineHeight: 1.9,
            letterSpacing: "0.02em",
            textShadow: "0 0 8px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.15)",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}>
            {compareResult}
          </p>
          <button style={{ ...amberBtn, marginTop: 32, fontSize: 12 }} onClick={resetCompare}>
            Compare something else →
          </button>
        </LiquidGlassCard>
      </div>
    );
  }

  const [customInput, setCustomInput] = useState("");

  async function handleCustomSubmit() {
    const q = customInput.trim();
    if (!q) return;
    setCompareLoading(true);
    setCompareResult(null);
    setCompareError(null);
    setActiveCountry(null);
    try {
      const data = await callAtlas(q);
      setCompareResult(clean(data.reply));
    } catch (e: any) {
      setCompareError(e.message ?? "Unknown error");
    } finally {
      setCompareLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <span style={{ ...eyebrow, display: "block", marginBottom: 16 }}>Compare Pakistan with:</span>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        {COMPARE_COUNTRIES.map((c) => (
          <button
            key={c}
            style={countryBtn(activeCountry === c)}
            onClick={() => handleCountryClick(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <input
          style={textInput}
          placeholder="Or ask your own comparison..."
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,122,16,0.5)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          onKeyDown={e => { if (e.key === "Enter") handleCustomSubmit(); }}
        />
        <button style={sendBtn} onClick={handleCustomSubmit}>Ask</button>
      </div>

      {compareLoading && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <LoadingDot />
        </div>
      )}

      {compareError && (
        <ErrorBox error={compareError} onDismiss={() => setCompareError(null)} />
      )}
    </div>
  );
}

// ── CONVERSATION MODE ─────────────────────────────────────────────────────────
type Message = { role: "user" | "atlas"; text: string };

function ConversationMode() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setError(null);
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const data = await callAtlas(q);
      setMessages(prev => [...prev, { role: "atlas", text: clean(data.reply) }]);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Message thread */}
      <div style={{
        minHeight: 300,
        maxHeight: 520,
        overflowY: "auto",
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingRight: 4,
      }}>
        {messages.length === 0 && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, color: "#48607C",
            textAlign: "center", marginTop: 60,
            lineHeight: 1.7,
          }}>
            Ask Atlas anything about Pakistan, Balochistan, culture, history, or just say hello.
          </p>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div style={{
              maxWidth: "78%",
              padding: "14px 20px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? "rgba(200,122,16,0.12)"
                : "rgba(255,255,255,0.05)",
              border: msg.role === "user"
                ? "1px solid rgba(200,122,16,0.3)"
                : "1px solid rgba(0,255,65,0.15)",
              fontFamily: msg.role === "atlas" ? "'Jersey 10', monospace" : "'DM Sans', sans-serif",
              fontSize: msg.role === "atlas" ? "0.95rem" : "0.9rem",
              fontWeight: msg.role === "user" ? 400 : undefined,
              color: msg.role === "atlas" ? "#00FF41" : "#C4D8EE",
              lineHeight: 1.8,
              letterSpacing: msg.role === "atlas" ? "0.02em" : "normal",
              textShadow: msg.role === "atlas"
                ? "0 0 8px rgba(0,255,65,0.3)"
                : "none",
              whiteSpace: "pre-wrap",
            }}>
              {msg.role === "atlas" && (
                <span style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "#E09020",
                  marginBottom: 8, fontWeight: 500,
                  textShadow: "none",
                }}>
                  Atlas
                </span>
              )}
              {msg.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "14px 20px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,255,65,0.15)",
            }}>
              <LoadingDot />
            </div>
          </div>
        )}

        {error && (
          <ErrorBox error={error} onDismiss={() => setError(null)} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 12 }}>
        <input
          style={textInput}
          placeholder="Say something to Atlas..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(200,122,16,0.5)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <button style={sendBtn} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
type Mode = "myth" | "music" | "compare" | "converse";

const MODES: { id: Mode; label: string }[] = [
  { id: "myth",     label: "Myth-Busting" },
  { id: "music",    label: "Music Discovery" },
  { id: "compare",  label: "Cultural Comparison" },
  { id: "converse", label: "Just Converse" },
];

export default function ChatPage() {
  const [activeMode, setActiveMode] = useState<Mode>("myth");

  return (
    <div style={{ background: "#04060E", minHeight: "100vh" }}>
      <StarField />
      <Nav />

      <main style={{
        minHeight: "100vh",
        padding: "100px 6vw 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <BackendStatus />
            </div>
            <span style={{ ...eyebrow, marginBottom: 16 }}>Atlas Speaks</span>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              color: "#C4D8EE",
              margin: 0,
              lineHeight: 1.2,
            }}>
              What would you like to explore?
            </h1>
          </div>

          {/* Mode selector */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 60, flexWrap: "wrap" }}>
            {MODES.map(({ id, label }) => (
              <button
                key={id}
                style={activeMode === id ? amberBtn : mutedBtn}
                onClick={() => setActiveMode(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active mode */}
          {activeMode === "myth"     && <MythMode />}
          {activeMode === "music"    && <MusicMode />}
          {activeMode === "compare"  && <CompareMode />}
          {activeMode === "converse" && <ConversationMode />}

        </div>
      </main>

      {/* Footer */}
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
        @keyframes liquidFloat {
          0%   { transform: rotateY(-6deg) rotateX(2deg); }
          50%  { transform: rotateY(6deg)  rotateX(-2deg); }
          100% { transform: rotateY(-6deg) rotateX(2deg); }
        }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 760px) {
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
