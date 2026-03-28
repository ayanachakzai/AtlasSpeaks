"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── STAR FIELD ──────────────────────────────────────────────────────────────
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

// ── GLOBE ───────────────────────────────────────────────────────────────────
function HeroGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement>(null);
  const orbitCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Inject Three.js from CDN if not already loaded
    function initGlobe() {
      const wrap = wrapRef.current;
      const heroCanvas = globeCanvasRef.current;
      const orbitCanvas = orbitCanvasRef.current;
      if (!wrap || !heroCanvas || !orbitCanvas) return;

      const THREE = (window as any).THREE;
      if (!THREE) return;

      const sz = wrap.offsetWidth || 320;

      // buildGlobe
      function buildGlobe(canvas: HTMLCanvasElement, size: number, rotSpeed: number) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 2.8;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(size, size);
        renderer.setClearColor(0x000000, 0);

        const tc = document.createElement("canvas");
        tc.width = 1024; tc.height = 512;
        const tx = tc.getContext("2d")!;
        const og = tx.createLinearGradient(0, 0, 0, 512);
        og.addColorStop(0, "#1A4A7A"); og.addColorStop(0.5, "#1E5A90"); og.addColorStop(1, "#1A4A7A");
        tx.fillStyle = og; tx.fillRect(0, 0, 1024, 512);
        tx.fillStyle = "#3A7A22";
        [
          [[300,80],[420,70],[520,80],[600,90],[680,100],[720,130],[700,170],[650,180],[580,200],[500,210],[450,200],[400,190],[360,180],[320,160],[290,140],[280,110]],
          [[360,200],[410,195],[440,220],[450,270],[440,320],[410,360],[380,380],[350,370],[330,340],[320,290],[325,240],[340,215]],
          [[580,170],[640,165],[680,175],[700,200],[690,230],[650,240],[610,235],[580,210],[575,185]],
          [[720,280],[780,270],[820,285],[840,320],[830,360],[790,375],[750,365],[720,340],[710,305]],
          [[60,80],[160,70],[200,90],[210,140],[190,180],[160,200],[130,210],[100,200],[70,170],[50,130],[45,100]],
          [[140,210],[190,205],[210,240],[200,300],[185,350],[160,390],[130,400],[110,370],[105,310],[115,255],[130,220]],
          [[175,40],[210,35],[225,55],[215,80],[190,85],[170,70],[165,50]],
        ].forEach((pts: number[][]) => {
          tx.beginPath(); tx.moveTo(pts[0][0], pts[0][1]);
          pts.slice(1).forEach(([x, y]) => tx.lineTo(x, y));
          tx.closePath(); tx.fill();
        });
        tx.fillStyle = "rgba(10,40,5,0.35)";
        [[380,90,60,40],[480,85,40,30],[600,95,50,35],[320,130,30,25],[150,95,40,30]].forEach(([x,y,w,h]) => tx.fillRect(x,y,w,h));
        tx.fillStyle = "#EEF4F8"; tx.fillRect(0, 0, 1024, 28); tx.fillRect(0, 484, 1024, 28);

        const earthTex = new THREE.CanvasTexture(tc);
        const geo = new THREE.SphereGeometry(1, 64, 64);
        const mat = new THREE.MeshPhongMaterial({
          color: 0xffffff, map: earthTex,
          specular: new THREE.Color(0x224433), shininess: 10,
        });
        const globe = new THREE.Mesh(geo, mat);
        globe.rotation.y = -1.2;
        scene.add(globe);

        scene.add(new THREE.Mesh(
          new THREE.SphereGeometry(1.04, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0x4488CC, transparent: true, opacity: 0.06, side: THREE.BackSide })
        ));

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.08, 0.006, 8, 120),
          new THREE.MeshBasicMaterial({ color: 0xC87A10, transparent: true, opacity: 0.35 })
        );
        ring.rotation.x = Math.PI / 2; scene.add(ring);

        const ring2 = new THREE.Mesh(
          new THREE.TorusGeometry(1.13, 0.004, 8, 120),
          new THREE.MeshBasicMaterial({ color: 0xF0B040, transparent: true, opacity: 0.2 })
        );
        ring2.rotation.x = Math.PI / 3; scene.add(ring2);

        const dm = new THREE.MeshBasicMaterial({ color: 0xF0C060 });
        [[30.3,67.0],[33.7,73.1],[24.9,67.0],[31.5,74.3],[34.0,71.6]].forEach(([la, lo]) => {
          const phi = (90 - la) * Math.PI / 180, theta = (lo + 180) * Math.PI / 180;
          const d = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), dm);
          d.position.set(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
          globe.add(d);
        });

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const sun = new THREE.DirectionalLight(0xFFF8F0, 1.5); sun.position.set(5, 3, 5); scene.add(sun);
        const fill = new THREE.DirectionalLight(0xAABBCC, 0.4); fill.position.set(-4, -1, -3); scene.add(fill);

        let rafId: number;
        function anim() {
          rafId = requestAnimationFrame(anim);
          globe.rotation.y += rotSpeed;
          ring.rotation.z += rotSpeed * 0.6;
          ring2.rotation.y += rotSpeed * 0.3;
          renderer.render(scene, camera);
        }
        anim();
        return () => { cancelAnimationFrame(rafId); renderer.dispose(); };
      }

      const cleanupGlobe = buildGlobe(heroCanvas, sz, 0.003);

      // orbit text
      const octx = orbitCanvas.getContext("2d")!;
      const EQTEXT = "ATLAS  SPEAKS  \u2726  FROM  QUETTA  \u2726  ";
      let eqAngle = 0;

      function resizeOrbit() {
        if (!wrap || !orbitCanvas) return;
        orbitCanvas.width = wrap.offsetWidth + 80;
        orbitCanvas.height = wrap.offsetHeight + 80;
      }
      resizeOrbit();
      window.addEventListener("resize", resizeOrbit);

      let orbitRaf: number;
      function drawEq() {
        if (!orbitCanvas) return;
        const W = orbitCanvas.width, H = orbitCanvas.height;
        octx.clearRect(0, 0, W, H);
        const cx = W / 2, cy = H / 2, Rx = W * 0.44, Ry = Rx * 0.18;
        const chars = EQTEXT.split(""), step = (Math.PI * 2) / chars.length;
        octx.font = "400 11px 'DM Sans',sans-serif";
        octx.textAlign = "center"; octx.textBaseline = "middle";
        chars.forEach((ch, i) => {
          const a = eqAngle + i * step, depth = Math.sin(a);
          if (depth > 0.3) return;
          const x = cx + Rx * Math.cos(a), y = cy + Ry * Math.sin(a);
          const alpha = depth > 0 ? 0.15 : 0.8 - depth * 0.1;
          octx.save(); octx.translate(x, y);
          octx.rotate(Math.atan2(Ry * Math.cos(a), -Rx * Math.sin(a)));
          octx.fillStyle = `rgba(240,176,64,${alpha})`;
          octx.fillText(ch, 0, 0); octx.restore();
        });
        octx.beginPath();
        octx.ellipse(cx, cy, Rx, Ry, 0, Math.PI, Math.PI * 2);
        octx.strokeStyle = "rgba(200,122,16,0.08)"; octx.lineWidth = 1; octx.stroke();
        eqAngle += 0.005;
        orbitRaf = requestAnimationFrame(drawEq);
      }
      drawEq();

      return () => {
        cleanupGlobe?.();
        cancelAnimationFrame(orbitRaf);
        window.removeEventListener("resize", resizeOrbit);
      };
    }

    let cleanup: (() => void) | undefined;

    if ((window as any).THREE) {
      cleanup = initGlobe() ?? undefined;
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.onload = () => { cleanup = initGlobe() ?? undefined; };
      document.head.appendChild(script);
    }

    return () => { cleanup?.(); };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "min(320px, 66vw)", height: "min(320px, 66vw)",
        margin: "0 auto 32px", flexShrink: 0,
      }}
    >
      <canvas
        ref={globeCanvasRef}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          borderRadius: "50%",
          boxShadow: "0 0 60px rgba(50,100,200,0.15), 0 0 120px rgba(50,100,200,0.07), 0 0 40px rgba(200,122,16,0.12)",
        }}
      />
      <canvas
        ref={orbitCanvasRef}
        style={{
          position: "absolute", inset: -40,
          width: "calc(100% + 80px)", height: "calc(100% + 80px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── MOUNTAINS ───────────────────────────────────────────────────────────────
function MountainSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;

    function draw() {
      const W = c!.width = c!.offsetWidth || window.innerWidth;
      const H = c!.height = 360;
      ctx.clearRect(0, 0, W, H);

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#04060E"); sky.addColorStop(0.3, "#060A18");
      sky.addColorStop(0.55, "#0A1020"); sky.addColorStop(1, "#04060E");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      const aurora = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.4);
      aurora.addColorStop(0, "rgba(28,56,130,0.18)");
      aurora.addColorStop(0.5, "rgba(20,40,100,0.08)");
      aurora.addColorStop(1, "transparent");
      ctx.fillStyle = aurora; ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 120; i++) {
        const x = (Math.sin(i * 42) * 0.5 + 0.5) * W;
        const y = (Math.cos(i * 55) * 0.5 + 0.5) * H * 0.48;
        const r = 0.25 + Math.abs(Math.sin(i * 7)) * 0.9;
        const al = 0.12 + Math.abs(Math.sin(i * 13)) * 0.55;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${al})`; ctx.fill();
      }

      function rng(pts: number[][], fill: string, stroke: string, alpha: number) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        pts.forEach(([x, y]) => ctx.lineTo(x * W, y * H));
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      rng([[0,.70],[.04,.56],[.09,.42],[.14,.50],[.20,.36],[.26,.46],[.31,.30],[.37,.40],[.43,.26],[.49,.36],[.54,.20],[.60,.33],[.65,.24],[.71,.38],[.77,.28],[.83,.42],[.89,.32],[.95,.46],[1,.54]], "#0C1428", "rgba(60,100,160,0.15)", 0.9);
      rng([[0,.80],[.05,.66],[.10,.52],[.16,.62],[.22,.47],[.28,.58],[.34,.43],[.40,.53],[.46,.40],[.52,.50],[.58,.37],[.64,.48],[.70,.36],[.76,.48],[.82,.40],[.88,.54],[.94,.44],[1,.65]], "#0E1830", "rgba(70,110,180,0.2)", 0.95);

      const np = [[0,.88],[.05,.74],[.10,.60],[.16,.71],[.22,.56],[.28,.67],[.34,.52],[.40,.63],[.46,.50],[.52,.60],[.58,.47],[.64,.58],[.70,.44],[.76,.57],[.82,.48],[.88,.61],[.94,.53],[1,.72]];
      rng(np, "#0A1020", "rgba(200,122,16,0.45)", 1);

      ctx.save();
      ctx.shadowColor = "rgba(200,122,16,0.6)"; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(np[0][0] * W, np[0][1] * H);
      np.forEach(([x, y]) => ctx.lineTo(x * W, y * H));
      ctx.strokeStyle = "rgba(200,122,16,0.65)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    // Defer first draw to after layout is complete
    const rafId = requestAnimationFrame(() => {
      draw();
    });
    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <div ref={sectionRef} style={{ position: "relative", zIndex: 10, width: "100%", padding: "0 6vw 0", boxSizing: "border-box" }}>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          borderRadius: 24,
          /* Use clipPath instead of overflow:hidden to avoid clipping the canvas compositing layer */
          clipPath: "inset(0 round 24px)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px rgba(200,122,16,0.04)",
        }}
      >
        {/* Top edge highlight */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", zIndex: 5, pointerEvents: "none" }} />
        {/* Amber corner glow */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(200,122,16,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 5 }} />

        <canvas ref={canvasRef} style={{ width: "100%", height: 360, display: "block" }} />

        <div style={{
          position: "absolute", bottom: 40, left: "6vw",
          fontFamily: "'Humble Nostalgia', serif",
          fontSize: "clamp(1.8rem,4vw,3rem)",
          fontStyle: "italic", fontWeight: 300,
          color: "rgba(196,216,238,0.7)",
          textShadow: "0 0 40px rgba(50,100,200,0.4), 0 0 20px rgba(200,122,16,0.2)",
          letterSpacing: "0.04em",
          zIndex: 20,
        }}>
          <span style={{ display: "block", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#E09020", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontStyle: "normal" }}>
            HEART OF THE REGION
          </span>
          Balochistan
        </div>
      </motion.div>
    </div>
  );
}

// ── EMBROIDERY ──────────────────────────────────────────────────────────────
function EmbroiderySection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let scroll = 0;

    function rs() {
      c!.width = c!.offsetWidth || window.innerWidth;
      c!.height = 340;
    }
    rs();
    window.addEventListener("resize", rs);

    const CRIMSON = "#C0152A";
    const WHITE = "rgba(245,240,232,";
    const GOLD = "#D4880A";
    const TEAL = "#F0C060";
    const PINK = "#E8607A";
    const ORANGE = "#D4620A";

    function diamond(cx: number, cy: number, s: number, fillCol: string | null, strokeCol: string | null, strokeW?: number) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy);
      ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy);
      ctx.closePath();
      if (fillCol) { ctx.fillStyle = fillCol; ctx.fill(); }
      if (strokeCol) { ctx.strokeStyle = strokeCol; ctx.lineWidth = strokeW || 1; ctx.stroke(); }
    }

    function zigzagBand(y: number, amplitude: number, period: number, col: string, lw: number, alpha: number) {
      ctx.beginPath(); ctx.globalAlpha = alpha;
      for (let x = 0; x <= c!.width + period; x += 2) {
        const py = y + Math.sin((x / period) * Math.PI * 2 + scroll) * amplitude;
        x === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = "round"; ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function band(y: number, bh: number, tOffset: number) {
      const W = c!.width, period = bh * 2.2, amp = bh * 0.38;
      ctx.fillStyle = "rgba(8,4,12,0.65)"; ctx.fillRect(0, y, W, bh);
      ctx.strokeStyle = "rgba(160,15,30,0.6)"; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(0, y + 1); ctx.lineTo(W, y + 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y + bh - 1); ctx.lineTo(W, y + bh - 1); ctx.stroke();
      ctx.globalAlpha = 1;
      zigzagBand(y + bh / 2, amp, period, WHITE + "0.18)", 2.5, 1);
      zigzagBand(y + bh / 2, amp, period, CRIMSON, 1.6, 1);
      zigzagBand(y + bh / 2, amp * 0.5, period, CRIMSON, 0.8, 0.6);
      const ds = bh * 0.22;
      for (let x = period / 4 + (tOffset % period); x < W + period; x += period / 2) {
        const py = y + bh / 2 + Math.sin((x / period) * Math.PI * 2 + scroll) * amp;
        diamond(x, py, ds * 1.2, null, WHITE + "0.5)", 0.9);
        diamond(x, py, ds * 0.8, CRIMSON, null);
        ctx.beginPath(); ctx.arc(x, py, ds * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = Math.sin(x) > 0 ? GOLD : TEAL; ctx.fill();
      }
      for (let x = tOffset % period; x < W + period; x += period / 2) {
        const py = y + bh / 2 + Math.sin((x / period) * Math.PI * 2 + Math.PI + scroll) * amp;
        diamond(x, py, ds * 0.4, Math.sin(x * 0.3) > 0 ? PINK : ORANGE, null);
      }
    }

    let raf: number;
    function drawFrame() {
      const W = c!.width, H = c!.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#06040A"; ctx.fillRect(0, 0, W, H);
      const bh = H / 5, bp = bh * 2.2;
      for (let i = 0; i < 5; i++) band(i * bh, bh, i % 2 === 0 ? 0 : bp * 0.5);
      scroll += 0.008;
      raf = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rs);
    };
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 10, width: "100%", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", zIndex: 20, pointerEvents: "none",
      }}>
        <span style={{
          display: "block", fontSize: 10, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#E09020",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
        }}>
          Traditional Art
        </span>
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300,
          background: "linear-gradient(135deg, #C87A10, #F0B040, #C87A10)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.04em",
        }}>
          Balochi Embroidery
        </h2>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
    </div>
  );
}

// ── FEATURE CARD ────────────────────────────────────────────────────────────
function FeatureCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative", overflow: "hidden",
        padding: "48px 38px 44px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px) saturate(150%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "background 0.35s, border-color 0.35s, transform 0.35s, box-shadow 0.35s",
      }}
      whileHover={{
        y: -5,
        background: "rgba(255,255,255,0.06)",
        borderColor: "rgba(200,122,16,0.2)",
        boxShadow: "0 16px 60px rgba(0,0,0,0.4), 0 0 30px rgba(200,122,16,0.06), inset 0 1px 0 rgba(255,255,255,0.09)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,transparent,rgba(240,176,64,0.25),transparent)",
      }} />
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "3rem", fontWeight: 300, color: "#C87A10",
        opacity: 0.3, lineHeight: 1, marginBottom: 20,
      }}>{num}</div>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "1.55rem", fontWeight: 400,
        color: "#C4D8EE", marginBottom: 14, lineHeight: 1.2,
      }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: "#7A96B8", lineHeight: 1.85 }}>{desc}</p>
      <div style={{
        width: 28, height: 1,
        background: "linear-gradient(to right, #E09020, transparent)",
        marginTop: 28,
        transition: "width 0.35s",
      }} />
    </motion.div>
  );
}

// ── NAV ─────────────────────────────────────────────────────────────────────
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

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  return (
    <>
      <StarField />
      <Nav />

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "100px 6vw 40px",
        overflow: "hidden",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#E09020", marginBottom: 28,
          }}
        >
          From Quetta · To the World
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative" }}
        >
          {/* Ambient amber glow above globe */}
          <div style={{
            position: "absolute",
            top: "-60px", left: "50%",
            transform: "translateX(-50%)",
            width: 500, height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,122,16,0.04) 0%, transparent 70%)",
            filter: "blur(120px)",
            pointerEvents: "none",
            zIndex: -1,
          }} />
          {/* Ambient blue/indigo glow to the right */}
          <div style={{
            position: "absolute",
            top: "10%", right: "-120px",
            width: 400, height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(60,80,220,0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
            pointerEvents: "none",
            zIndex: -1,
          }} />
          <HeroGlobe />
        </motion.div>

        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 0.88, textAlign: "center", marginBottom: 24,
        }}>
          <motion.span
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            style={{
              display: "block",
              fontSize: "clamp(5rem,13vw,11rem)",
              fontWeight: 200, color: "#C4D8EE", letterSpacing: "-0.02em",
            }}
          >
            Atlas
          </motion.span>
          <motion.em
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9 }}
            style={{
              display: "block",
              fontSize: "clamp(5rem,13vw,11rem)",
              fontFamily: "'Humble Nostalgia', serif",
              fontWeight: 300, fontStyle: "italic",
              color: "#E09020", letterSpacing: "-0.02em", lineHeight: 0.9,
            }}
          >
            Speaks
          </motion.em>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          style={{
            fontFamily: "'Humble Nostalgia', serif",
            fontSize: "clamp(1rem,1.9vw,1.25rem)", fontStyle: "italic",
            color: "#7A96B8", maxWidth: 500, lineHeight: 1.7, marginBottom: 36,
          }}
        >
          A cultural intelligence rooted in Balochistan — built to challenge what the world thinks it knows about Pakistan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.6 }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}
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
            Talk to Atlas
          </a>
          <a href="/about" style={{
            display: "inline-block", padding: "14px 44px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#7A96B8",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 500,
            letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: "pointer", textDecoration: "none",
            borderRadius: 2, transition: "all 0.35s",
          }}>
            About Atlas
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#48607C" }}>Explore</span>
          <div style={{
            width: 1, height: 44,
            background: "linear-gradient(to bottom, #E09020, transparent)",
            animation: "sb 2.2s ease-in-out infinite",
          }} />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position: "relative", zIndex: 10, padding: "100px 6vw" }}>
        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 30 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span style={{
            display: "block", fontSize: 10, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#E09020", marginBottom: 14,
          }}>
            Cultural Intelligence
          </span>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 300,
            color: "#C4D8EE", lineHeight: 1.1,
          }}>
            The Atlas Experience
          </h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          <FeatureCard
            num="01"
            title="Myth-Busting"
            desc="Atlas confronts stereotypes head-on — with facts, context, and reflection drawn from lived cultural knowledge of Pakistan's regions."
          />
          <FeatureCard
            num="02"
            title="Music Discovery"
            desc="Answer three questions about your mood. Atlas matches you to songs spanning Sufi qawwali, Balochi folk, modern pop, and fusion."
          />
          <FeatureCard
            num="03"
            title="Cultural Comparison"
            desc="Compare Pakistan with the UK, USA, India, China, and Turkey — discovering parallels across traditions, food, and history."
          />
        </div>
      </section>

      {/* MOUNTAINS */}
      <MountainSection />

      {/* EMBROIDERY */}
      <EmbroiderySection />

      {/* ABOUT */}
      <section style={{
        position: "relative", zIndex: 10,
        width: "100%", height: 600,
        overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/assets/quetta.png')",
          backgroundSize: "cover", backgroundPosition: "center 20%",
          backgroundColor: "#0C1428",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(4,6,14,0.6) 0%, rgba(4,6,14,0.3) 40%, rgba(4,6,14,0.55) 70%, rgba(4,6,14,0.85) 100%)",
        }} />
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative", zIndex: 2,
            marginLeft: "auto", marginRight: "6vw",
            width: "min(480px, 90%)",
            padding: "52px 48px",
            borderRadius: 20,
            background: "rgba(4,6,14,0.7)",
            backdropFilter: "blur(32px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <span style={{
            display: "block", fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "#E09020", marginBottom: 18,
          }}>
            Built in Quetta. Built for the world.
          </span>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 300,
            lineHeight: 1.15, color: "#C4D8EE", marginBottom: 22,
          }}>
            The Story Behind <em style={{ fontFamily: "'Humble Nostalgia', serif", fontStyle: "italic", color: "#F0B040" }}>Atlas</em>
          </h2>
          <p style={{ fontSize: 13.5, color: "#7A96B8", lineHeight: 1.85, marginBottom: 13 }}>
            Atlas Speaks was created by Muhammad Ayan Achakzai — a filmmaker and cultural storyteller from Quetta, Balochistan, now studying MSc Applied Machine Learning for Creatives at UAL&apos;s Creative Computing Institute in London.
          </p>
          <p style={{ fontSize: 13.5, color: "#7A96B8", lineHeight: 1.85, marginBottom: 13 }}>
            It started as a university project and became something more personal — a way to use AI to represent Balochistan with nuance, warmth, and accuracy.
          </p>
          <a href="/about" style={{
            display: "inline-block", marginTop: 10,
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#E09020", textDecoration: "none",
            borderBottom: "1px solid rgba(224,144,32,0.3)", paddingBottom: 3,
            transition: "all 0.25s",
          }}>
            Meet the creator →
          </a>
        </motion.div>
      </section>

      {/* STATS */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16, padding: "64px 6vw",
      }}>
        {[
          { n: "205+", l: "Cultural Facts" },
          { n: "100", l: "Curated Songs" },
          { n: "7", l: "Provinces" },
          { n: "6", l: "Countries" },
        ].map(({ n, l }) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              padding: "44px 20px", textAlign: "center",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "3rem", fontWeight: 300,
              color: "#E09020", lineHeight: 1, marginBottom: 10,
            }}>{n}</div>
            <div style={{
              fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#48607C",
            }}>{l}</div>
          </motion.div>
        ))}
      </div>

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
        @keyframes sb {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @media (max-width: 760px) {
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>
    </>
  );
}
