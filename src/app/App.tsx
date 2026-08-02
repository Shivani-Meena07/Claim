import { useState, useEffect, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────── */
interface FAQItem { q: string; a: string; }

/* ─── Animation hook ────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Leaf SVG ───────────────────────────────────────────── */
const Leaf = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M40 110 C40 110 5 70 5 40 C5 10 40 5 40 5 C40 5 75 10 75 40 C75 70 40 110 40 110Z" fill="currentColor" opacity="0.18"/>
    <path d="M40 110 L40 20" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M40 70 C40 70 20 55 15 42" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M40 55 C40 55 60 42 65 30" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
  </svg>
);

/* ─── Floral SVG ─────────────────────────────────────────── */
const Floral = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    {[0,60,120,180,240,300].map(r => (
      <ellipse key={r} cx="60" cy="30" rx="12" ry="22" fill="currentColor" opacity="0.15"
        transform={`rotate(${r} 60 60)`}/>
    ))}
    <circle cx="60" cy="60" r="12" fill="currentColor" opacity="0.25"/>
  </svg>
);

/* ─── Blob ───────────────────────────────────────────────── */
const Blob = ({ color, style }: { color: string; style?: React.CSSProperties }) => (
  <div style={{
    background: color,
    borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
    filter: "blur(48px)",
    opacity: 0.45,
    position: "absolute",
    animation: "blobFloat 8s ease-in-out infinite",
    ...style,
  }} />
);

/* ─── Glass Card ─────────────────────────────────────────── */
const GlassCard = ({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={className} style={{
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(183,156,255,0.25)",
    borderRadius: 24,
    boxShadow: "0 8px 32px rgba(70,48,77,0.08), 0 2px 8px rgba(183,156,255,0.12)",
    ...style,
  }}>{children}</div>
);

/* ─── Data ───────────────────────────────────────────────── */
const features = [
  { icon: "🌸", title: "Cycle Tracking", desc: "Intelligent period tracking with predictive analytics tailored to your unique rhythm.", color: "#F8D7E6" },
  { icon: "🤖", title: "AI Wellness Coach", desc: "Your personal AI guide for holistic health — nutrition, hormones, energy & more.", color: "#D9CCFF" },
  { icon: "💬", title: "AI Chatbot", desc: "24/7 empathetic support for every question, symptom, or health concern.", color: "#B79CFF" },
  { icon: "🧠", title: "Mental Wellness", desc: "Guided meditations, mood tracking, and mindfulness practices built for you.", color: "#DDF7E5" },
  { icon: "👩‍⚕️", title: "Doctor Connect", desc: "Book consultations with certified gynaecologists and health specialists instantly.", color: "#A7C7A3" },
  { icon: "🌿", title: "Meditation", desc: "Curated soundscapes, breathing exercises, and calming rituals for daily peace.", color: "#DDF7E5" },
  { icon: "🚨", title: "AI Red Flag Detection", desc: "Early warning system that identifies concerning symptoms before they escalate.", color: "#F8D7E6" },
  { icon: "📊", title: "Monthly Reports", desc: "Beautiful AI-generated health reports with trends, insights, and action plans.", color: "#D9CCFF" },
];

const timelineSteps = [
  { icon: "📍", title: "Track", desc: "Log your symptoms, mood, cycle, sleep, and daily habits in seconds." },
  { icon: "🔍", title: "Understand", desc: "Our AI analyses your patterns and surfaces meaningful health insights." },
  { icon: "✨", title: "Personalise", desc: "Receive a tailored wellness plan that evolves with your body." },
  { icon: "🛡️", title: "Detect", desc: "AI monitors for red flags and alerts you to potential concerns early." },
  { icon: "🤝", title: "Connect", desc: "Get matched with the right specialist if and when you need expert care." },
];

const communityCards = [
  { tag: "Trending", title: "Living with PCOS — share your tips", replies: 247, color: "#D9CCFF" },
  { tag: "Support", title: "Postpartum anxiety — you are not alone", replies: 189, color: "#F8D7E6" },
  { tag: "Wellness", title: "Cycle syncing your workouts: a guide", replies: 312, color: "#DDF7E5" },
  { tag: "Ask", title: "What supplements actually helped your periods?", replies: 94, color: "#B79CFF" },
];

const soundscapes = [
  { icon: "🌧️", title: "Rain Sounds", duration: "∞", color: "#D9CCFF" },
  { icon: "🌲", title: "Forest Sounds", duration: "∞", color: "#DDF7E5" },
  { icon: "🌊", title: "Ocean Waves", duration: "∞", color: "#A7C7A3" },
];

const redFlagSteps = [
  { num: "01", title: "Track Symptoms", desc: "Log irregularities, pain, unusual discharge or mood shifts as they happen.", icon: "📝" },
  { num: "02", title: "AI Analysis", desc: "Our model cross-references your data against 10,000+ clinical patterns in real time.", icon: "🧬" },
  { num: "03", title: "Risk Alert", desc: "If a concern is detected you receive a gentle, clear notification with context.", icon: "🔔" },
  { num: "04", title: "Next Step", desc: "Choose to continue monitoring or connect with a specialist — always your choice.", icon: "🤝" },
];

const testimonials = [
  { name: "Priya S.", role: "Software Engineer", quote: "Claim caught an irregular pattern in my cycle that turned out to be a thyroid issue. I'm so grateful.", avatar: "PS", color: "#D9CCFF" },
  { name: "Amara O.", role: "Yoga Instructor", quote: "Finally an app that feels like it was designed for us, not at us. The AI coach is genuinely helpful.", avatar: "AO", color: "#F8D7E6" },
  { name: "Lin W.", role: "Medical Student", quote: "As someone studying medicine, I'm impressed by the accuracy and the sensitivity of the Red Flag system.", avatar: "LW", color: "#DDF7E5" },
  { name: "Sofia M.", role: "Mother of Two", quote: "The postpartum mental wellness section helped me through the hardest months of my life.", avatar: "SM", color: "#B79CFF" },
];

const faqData: FAQItem[] = [
  { q: "Is my health data private and secure?", a: "Absolutely. Claim uses AES-256 encryption for all data at rest and TLS 1.3 in transit. We are HIPAA-compliant and never sell your data to third parties. You own your data, always." },
  { q: "How accurate is the AI Red Flag Detection?", a: "Our model has been trained on over 2 million anonymised women's health records and validated against clinical guidelines. It achieves 94% sensitivity for the conditions it monitors, though it is a support tool and not a replacement for professional medical diagnosis." },
  { q: "Can I connect with a real doctor through Claim?", a: "Yes. The Doctor Connect feature lets you book video consultations with licensed gynaecologists, endocrinologists, and mental health professionals within 24 hours." },
  { q: "Is Claim free to use?", a: "Claim offers a generous free tier with cycle tracking, basic AI insights, and community access. Our premium plan (£9.99/month) unlocks the AI Coach, monthly reports, unlimited doctor consultations, and advanced red flag monitoring." },
  { q: "Does Claim support irregular cycles?", a: "Yes — Claim is specifically designed for irregular cycles including those affected by PCOS, perimenopause, stress, postpartum recovery, and hormonal conditions. The AI adapts to your unique rhythm over time." },
];

/* ─── MoodRing component ─────────────────────────────────── */
const ProgressRing = ({ pct, color, size = 80, label, sub }: { pct: number; color: string; size?: number; label: string; sub: string }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(183,156,255,0.15)" strokeWidth={8}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color} fontFamily="Poppins">{pct}%</text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#46304D", fontFamily: "Poppins" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#8B7A96", fontFamily: "Inter" }}>{sub}</div>
      </div>
    </div>
  );
};

/* ─── Mini Bar Chart ─────────────────────────────────────── */
const BarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          background: `linear-gradient(180deg, ${color}, ${color}88)`,
          height: `${(v / max) * 100}%`,
          borderRadius: "4px 4px 0 0",
          transition: "height 0.6s ease",
          opacity: i === data.length - 1 ? 1 : 0.6,
        }}/>
      ))}
    </div>
  );
};

/* ─── FAQ Accordion ──────────────────────────────────────── */
const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, visible } = useInView();
  return (
    <section ref={ref} style={{ padding: "100px 0", background: "#FFF9F5" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#B79CFF", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Inter" }}>Questions & Answers</span>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#46304D", margin: "12px 0 0", fontFamily: "Poppins" }}>Everything you need to know</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {faqData.map((item, i) => (
            <GlassCard key={i} style={{
              overflow: "hidden",
              transform: visible ? "translateY(0)" : "translateY(30px)",
              opacity: visible ? 1 : 0,
              transition: `all 0.5s ease ${i * 0.08}s`,
            }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between",
                alignItems: "center", background: "none", border: "none", cursor: "pointer", gap: 16,
              }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#46304D", fontFamily: "Poppins", textAlign: "left" }}>{item.q}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: open === i ? "#B79CFF" : "#F8F8FB",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "all 0.3s ease", color: open === i ? "white" : "#B79CFF", fontSize: 18, fontWeight: 300,
                }}>{open === i ? "−" : "+"}</div>
              </button>
              <div style={{
                maxHeight: open === i ? 200 : 0, overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}>
                <p style={{ padding: "0 28px 22px", fontSize: 15, color: "#6B5A74", lineHeight: 1.7, fontFamily: "Inter", margin: 0 }}>{item.a}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [playingSound, setPlayingSound] = useState<number | null>(null);
  const [breathePhase, setBreathePhase] = useState<"inhale"|"hold"|"exhale">("inhale");
  const [breatheActive, setBreatheActive] = useState(false);
  const breatheTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!breatheActive) return;
    const cycle = () => {
      setBreathePhase("inhale");
      breatheTimer.current = setTimeout(() => {
        setBreathePhase("hold");
        breatheTimer.current = setTimeout(() => {
          setBreathePhase("exhale");
          breatheTimer.current = setTimeout(cycle, 6000);
        }, 4000);
      }, 4000);
    };
    cycle();
    return () => clearTimeout(breatheTimer.current);
  }, [breatheActive]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  /* Section observers */
  const heroInView = useInView(0.1);
  const featuresInView = useInView(0.1);
  const howItWorksInView = useInView(0.1);
  const dashboardInView = useInView(0.1);
  const communityInView = useInView(0.1);
  const wellnessInView = useInView(0.1);
  const redFlagInView = useInView(0.1);
  const reportsInView = useInView(0.1);
  const testimonialsInView = useInView(0.1);
  const ctaInView = useInView(0.1);

  const navLinks = ["Home","Features","Community","AI Coach","Doctors","Reports","About","Contact"];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden", background: "#FFF9F5", color: "#46304D" }}>
      {/* Global Styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #FFF9F5; }
        ::-webkit-scrollbar-thumb { background: #D9CCFF; border-radius: 99px; }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(20px,-20px) scale(1.05); }
          66% { transform: translate(-15px,15px) scale(0.96); }
        }
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
        @keyframes breathe-in { from{transform:scale(1);opacity:0.7;} to{transform:scale(1.5);opacity:1;} }
        @keyframes breathe-hold { from{transform:scale(1.5);} to{transform:scale(1.5);} }
        @keyframes breathe-out { from{transform:scale(1.5);opacity:1;} to{transform:scale(1);opacity:0.7;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .feature-card:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 48px rgba(70,48,77,0.14) !important; }
        .feature-card { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .btn-primary { transition: all 0.3s ease !important; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(183,156,255,0.4) !important; }
        .btn-secondary:hover { background: rgba(183,156,255,0.12) !important; transform: translateY(-2px); }
        .nav-link { position: relative; }
        .nav-link::after { content:""; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#B79CFF; border-radius:99px; transition:width 0.3s ease; }
        .nav-link:hover::after { width:100%; }
        .sound-card:hover { transform: scale(1.04) !important; }
        .testimonial-card:hover { transform: translateY(-6px) !important; }
        @media(max-width:768px){
          .mobile-hide { display:none !important; }
          .hero-grid { grid-template-columns:1fr !important; text-align:center; }
          .hero-buttons { justify-content:center !important; }
          .features-grid { grid-template-columns:1fr 1fr !important; }
          .dashboard-grid { grid-template-columns:1fr !important; }
          .community-grid { grid-template-columns:1fr !important; }
          .footer-grid { grid-template-columns:1fr !important; gap:32px !important; }
          .reports-grid { grid-template-columns:1fr !important; }
        }
        @media(max-width:480px){
          .features-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: navScrolled ? "12px 32px" : "20px 32px",
        background: navScrolled ? "rgba(255,249,245,0.88)" : "transparent",
        backdropFilter: navScrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: navScrolled ? "blur(24px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(183,156,255,0.2)" : "none",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #B79CFF, #F8D7E6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🌸</div>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "#46304D", letterSpacing: "-0.5px" }}>Claim</span>
        </div>

        <div className="mobile-hide" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map(link => (
            <button key={link} className="nav-link"
              onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#46304D", fontFamily: "Inter" }}>
              {link}
            </button>
          ))}
        </div>

        <div className="mobile-hide" style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary" style={{
            padding: "10px 20px", borderRadius: 99, border: "1.5px solid rgba(183,156,255,0.5)",
            background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#46304D", fontFamily: "Inter",
          }}>Login</button>
          <button className="btn-primary" onClick={() => scrollTo("cta")} style={{
            padding: "10px 22px", borderRadius: 99,
            background: "linear-gradient(135deg, #B79CFF, #D9CCFF)",
            border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#46304D", fontFamily: "Inter",
            boxShadow: "0 4px 16px rgba(183,156,255,0.35)",
          }}>Get Started</button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#46304D",
          // @ts-ignore
        }} className="mobile-menu-btn">
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, zIndex: 999,
          background: "rgba(255,249,245,0.96)", backdropFilter: "blur(24px)",
          padding: "20px 24px", borderBottom: "1px solid rgba(183,156,255,0.2)",
        }}>
          {navLinks.map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(" ", "-"))} style={{
              display: "block", width: "100%", textAlign: "left", padding: "14px 0",
              background: "none", border: "none", borderBottom: "1px solid rgba(183,156,255,0.1)",
              fontSize: 16, fontWeight: 500, color: "#46304D", fontFamily: "Inter", cursor: "pointer",
            }}>{l}</button>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button style={{ flex:1, padding:"12px", borderRadius:99, border:"1.5px solid rgba(183,156,255,0.5)", background:"transparent", fontSize:14, fontWeight:600, color:"#46304D", fontFamily:"Inter", cursor:"pointer" }}>Login</button>
            <button onClick={() => scrollTo("cta")} style={{ flex:1, padding:"12px", borderRadius:99, background:"linear-gradient(135deg,#B79CFF,#D9CCFF)", border:"none", fontSize:14, fontWeight:600, color:"#46304D", fontFamily:"Inter", cursor:"pointer" }}>Get Started</button>
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────────────── */}
      <section id="home" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "120px 0 80px" }}>
        {/* Background blobs */}
        <Blob color="rgba(183,156,255,0.35)" style={{ width: 600, height: 600, top: -100, right: -150 }}/>
        <Blob color="rgba(248,215,230,0.4)" style={{ width: 400, height: 400, bottom: 0, left: -100, animationDelay: "3s" }}/>
        <Blob color="rgba(221,247,229,0.35)" style={{ width: 300, height: 300, top: "40%", left: "40%", animationDelay: "5s" }}/>

        {/* Floating leaves */}
        <Leaf style={{ position:"absolute", top:80, left: "5%", width:60, color:"#A7C7A3", animation:"floatLeaf 6s ease-in-out infinite" }}/>
        <Leaf style={{ position:"absolute", bottom:120, right:"8%", width:80, color:"#B79CFF", animation:"floatLeaf 8s ease-in-out infinite 2s" }}/>
        <Floral style={{ position:"absolute", top:"15%", right:"22%", width:100, color:"#F8D7E6", animation:"floatLeaf 10s ease-in-out infinite 1s" }}/>
        <Floral style={{ position:"absolute", bottom:"20%", left:"12%", width:70, color:"#D9CCFF", animation:"floatLeaf 7s ease-in-out infinite 4s" }}/>

        <div ref={heroInView.ref} className="hero-grid" style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 32px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
          width: "100%",
        }}>
          {/* Left */}
          <div style={{ opacity: heroInView.visible ? 1 : 0, transform: heroInView.visible ? "translateY(0)" : "translateY(50px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
              background: "rgba(183,156,255,0.15)", borderRadius: 99, border: "1px solid rgba(183,156,255,0.3)",
              marginBottom: 24,
            }}>
              <span style={{ fontSize: 12 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#B79CFF", fontFamily: "Inter" }}>AI-Powered Women's Healthcare</span>
            </div>
            <h1 style={{
              fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)",
              color: "#46304D", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 24,
            }}>
              Understand Your<br/>
              <span style={{
                background: "linear-gradient(135deg, #B79CFF 0%, #F8D7E6 50%, #A7C7A3 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                backgroundSize: "200% auto", animation: "gradientShift 4s ease infinite",
              }}>Body Better</span><br/>with AI.
            </h1>
            <p style={{ fontSize: 18, color: "#6B5A74", lineHeight: 1.7, marginBottom: 36, fontFamily: "Inter", fontWeight: 400, maxWidth: 480 }}>
              Claim is your intelligent health companion — tracking your cycle, coaching your wellness, detecting early warning signs, and connecting you to care. All in one beautiful, private space.
            </p>
            <div className="hero-buttons" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => scrollTo("cta")} style={{
                padding: "16px 32px", borderRadius: 99,
                background: "linear-gradient(135deg, #B79CFF 0%, #D9CCFF 100%)",
                border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#46304D",
                fontFamily: "Poppins", boxShadow: "0 8px 24px rgba(183,156,255,0.4)",
              }}>Get Started Free →</button>
              <button className="btn-secondary" style={{
                padding: "16px 32px", borderRadius: 99, background: "transparent",
                border: "1.5px solid rgba(70,48,77,0.2)", cursor: "pointer", fontSize: 16, fontWeight: 600,
                color: "#46304D", fontFamily: "Poppins", display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.3s ease",
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #B79CFF, #F8D7E6)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>▶</span>
                Watch Demo
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
              {[["50K+","Women supported"],["4.9★","App Store rating"],["94%","AI accuracy"]].map(([val, lab]) => (
                <div key={val}>
                  <div style={{ fontFamily:"Poppins", fontWeight:700, fontSize:22, color:"#46304D" }}>{val}</div>
                  <div style={{ fontFamily:"Inter", fontSize:13, color:"#8B7A96" }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Mockup */}
          <div style={{
            opacity: heroInView.visible ? 1 : 0, transform: heroInView.visible ? "translateY(0) rotate(0deg)" : "translateY(60px) rotate(2deg)",
            transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.2s",
            position: "relative",
          }}>
            <GlassCard style={{ padding: 28, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#8B7A96", fontFamily:"Inter" }}>Good morning ✨</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#46304D", fontFamily:"Poppins" }}>Sarah, Day 14</div>
                </div>
                <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#B79CFF,#F8D7E6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌸</div>
              </div>

              {/* Progress rings row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
                <ProgressRing pct={72} color="#B79CFF" label="Mood" sub="Good" size={72}/>
                <ProgressRing pct={60} color="#A7C7A3" label="Hydration" sub="1.5L" size={72}/>
                <ProgressRing pct={85} color="#F8D7E6" label="Sleep" sub="7.4h" size={72}/>
                <ProgressRing pct={45} color="#D9CCFF" label="Exercise" sub="3.2km" size={72}/>
              </div>

              {/* AI Insight chip */}
              <div style={{
                background: "linear-gradient(135deg, rgba(183,156,255,0.15), rgba(248,215,230,0.15))",
                border: "1px solid rgba(183,156,255,0.25)", borderRadius: 16, padding: "14px 18px",
                marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 20, flexShrink:0 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#B79CFF", fontFamily:"Poppins", marginBottom: 4 }}>AI Insight</div>
                  <div style={{ fontSize: 13, color: "#6B5A74", fontFamily:"Inter", lineHeight:1.5 }}>You are in your ovulation window. Energy levels tend to peak — great time for workouts and social activities.</div>
                </div>
              </div>

              {/* Cycle bar */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#46304D", fontFamily:"Poppins" }}>Cycle Day 14 of 28</span>
                  <span style={{ fontSize:12, color:"#B79CFF", fontFamily:"Inter" }}>Ovulation</span>
                </div>
                <div style={{ height:10, borderRadius:99, background:"rgba(183,156,255,0.15)", overflow:"hidden" }}>
                  <div style={{ width:"50%", height:"100%", borderRadius:99, background:"linear-gradient(90deg,#B79CFF,#F8D7E6)" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  {["Menstrual","Follicular","Ovulation","Luteal"].map((p,i) => (
                    <span key={p} style={{ fontSize:10, color: i===2 ? "#B79CFF" : "#8B7A96", fontFamily:"Inter", fontWeight: i===2 ? 600 : 400 }}>{p}</span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Floating mini cards */}
            <GlassCard style={{
              position: "absolute", top: -24, right: -24, padding: "12px 16px",
              animation: "floatLeaf 5s ease-in-out infinite",
            }}>
              <div style={{ fontSize: 11, color:"#8B7A96", fontFamily:"Inter" }}>Next Period</div>
              <div style={{ fontSize: 16, fontWeight:700, color:"#46304D", fontFamily:"Poppins" }}>14 days</div>
            </GlassCard>
            <GlassCard style={{
              position: "absolute", bottom: -20, left: -24, padding: "12px 16px",
              animation: "floatLeaf 7s ease-in-out infinite 2s",
            }}>
              <div style={{ fontSize: 11, color:"#8B7A96", fontFamily:"Inter" }}>Wellness Score</div>
              <div style={{ fontSize: 16, fontWeight:700, color:"#A7C7A3", fontFamily:"Poppins" }}>87 / 100 🌿</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 0", background: "linear-gradient(180deg, #FFF9F5 0%, #F8F0FF 100%)", position:"relative", overflow:"hidden" }}>
        <Leaf style={{ position:"absolute", top:40, right:"3%", width:120, color:"#D9CCFF", opacity:0.5 }}/>
        <Leaf style={{ position:"absolute", bottom:40, left:"2%", width:90, color:"#A7C7A3", opacity:0.4 }}/>

        <div ref={featuresInView.ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#B79CFF", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Everything in one place</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0 16px", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>Features built around your body</h2>
            <p style={{ fontSize:17, color:"#6B5A74", maxWidth:560, margin:"0 auto", lineHeight:1.7, fontFamily:"Inter" }}>Every feature in Claim was designed with women's lived experience at its heart — not as an afterthought.</p>
          </div>

          <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {features.map((f, i) => (
              <GlassCard key={i} className="feature-card" style={{
                padding: 28, cursor:"default",
                opacity: featuresInView.visible ? 1 : 0,
                transform: featuresInView.visible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: f.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: 24, marginBottom: 16,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:16, color:"#46304D", marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontFamily:"Inter", fontSize:14, color:"#6B5A74", lineHeight:1.65 }}>{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" style={{ padding:"100px 0", background:"#FFF9F5" }}>
        <div ref={howItWorksInView.ref} style={{ maxWidth:1000, margin:"0 auto", padding:"0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#A7C7A3", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Your journey</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>How Claim works</h2>
          </div>

          <div style={{ position:"relative" }}>
            {/* Timeline line */}
            <div style={{
              position:"absolute", left:"50%", top:0, bottom:0, width:2,
              background:"linear-gradient(180deg, #B79CFF, #A7C7A3, #F8D7E6)",
              transform:"translateX(-50%)", borderRadius:99,
            }} className="mobile-hide"/>

            {timelineSteps.map((step, i) => (
              <div key={i} style={{
                display:"flex", gap:32, alignItems:"center",
                justifyContent: i%2===0 ? "flex-start" : "flex-end",
                marginBottom: 40,
                opacity: howItWorksInView.visible ? 1 : 0,
                transform: howItWorksInView.visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease ${i*0.12}s`,
              }}>
                {i%2===0 ? (
                  <>
                    <GlassCard style={{ padding:"24px 28px", maxWidth:380, flex:1 }}>
                      <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                        <div style={{ fontSize:28, flexShrink:0 }}>{step.icon}</div>
                        <div>
                          <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:18, color:"#46304D", marginBottom:8 }}>{step.title}</h3>
                          <p style={{ fontFamily:"Inter", fontSize:14, color:"#6B5A74", lineHeight:1.65 }}>{step.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                    <div className="mobile-hide" style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#B79CFF,#D9CCFF)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Poppins", fontWeight:800, color:"#46304D", fontSize:16, flexShrink:0, zIndex:1, boxShadow:"0 4px 16px rgba(183,156,255,0.35)" }}>{i+1}</div>
                    <div className="mobile-hide" style={{ flex:1 }}/>
                  </>
                ) : (
                  <>
                    <div className="mobile-hide" style={{ flex:1 }}/>
                    <div className="mobile-hide" style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#A7C7A3,#DDF7E5)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Poppins", fontWeight:800, color:"#46304D", fontSize:16, flexShrink:0, zIndex:1, boxShadow:"0 4px 16px rgba(167,199,163,0.35)" }}>{i+1}</div>
                    <GlassCard style={{ padding:"24px 28px", maxWidth:380, flex:1 }}>
                      <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                        <div style={{ fontSize:28, flexShrink:0 }}>{step.icon}</div>
                        <div>
                          <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:18, color:"#46304D", marginBottom:8 }}>{step.title}</h3>
                          <p style={{ fontFamily:"Inter", fontSize:14, color:"#6B5A74", lineHeight:1.65 }}>{step.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ──────────────────────────────── */}
      <section id="reports" style={{ padding:"100px 0", background:"linear-gradient(135deg, #F8F0FF 0%, #FFF9F5 50%, #F0FFF4 100%)", position:"relative", overflow:"hidden" }}>
        <Blob color="rgba(183,156,255,0.2)" style={{ width:500, height:500, top:-100, left:-100 }}/>
        <Blob color="rgba(167,199,163,0.2)" style={{ width:400, height:400, bottom:-80, right:-80, animationDelay:"4s" }}/>

        <div ref={dashboardInView.ref} style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:56, opacity: dashboardInView.visible?1:0, transform: dashboardInView.visible?"translateY(0)":"translateY(30px)", transition:"all 0.6s ease" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#A7C7A3", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Your health at a glance</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>Beautiful, intelligent dashboard</h2>
          </div>

          <div className="dashboard-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* Left column */}
            <div style={{ display:"flex", flexDirection:"column", gap:24, opacity: dashboardInView.visible?1:0, transform: dashboardInView.visible?"translateX(0)":"translateX(-40px)", transition:"all 0.7s ease 0.2s" }}>
              {/* Today's mood */}
              <GlassCard style={{ padding:28 }}>
                <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:16, color:"#46304D", marginBottom:18 }}>Today's Mood 🌈</h3>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {[["😊","Happy","#DDF7E5"],["😌","Calm","#D9CCFF"],["😔","Tired","#F8D7E6"],["🤩","Energised","#B79CFF"],["😤","Anxious","#F8F8FB"]].map(([emoji, label, bg]) => (
                    <button key={label} style={{
                      padding:"8px 14px", borderRadius:99, background:bg, border:"none", cursor:"pointer",
                      fontSize:13, fontWeight:600, color:"#46304D", fontFamily:"Inter", display:"flex", alignItems:"center", gap:6,
                      boxShadow: label==="Happy" ? "0 4px 12px rgba(221,247,229,0.5)" : "none",
                      transition:"all 0.2s ease",
                    }}>{emoji} {label}</button>
                  ))}
                </div>
              </GlassCard>

              {/* Cycle chart */}
              <GlassCard style={{ padding:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:16, color:"#46304D" }}>7-Day Activity 💪</h3>
                  <span style={{ fontSize:12, color:"#B79CFF", fontWeight:600, fontFamily:"Inter" }}>This week</span>
                </div>
                <BarChart data={[3.2,4.8,2.1,6.5,5.0,7.2,3.8]} color="#B79CFF"/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                    <span key={d} style={{ fontSize:11, color:"#8B7A96", fontFamily:"Inter" }}>{d}</span>
                  ))}
                </div>
              </GlassCard>

              {/* Sleep */}
              <GlassCard style={{ padding:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:16, color:"#46304D" }}>Sleep Quality 🌙</h3>
                  <span style={{ fontSize:12, color:"#A7C7A3", fontWeight:600, fontFamily:"Inter" }}>7.4h avg</span>
                </div>
                <BarChart data={[6.5,7.2,6.8,8.1,7.5,9.0,7.4]} color="#A7C7A3"/>
              </GlassCard>
            </div>

            {/* Right column */}
            <div style={{ display:"flex", flexDirection:"column", gap:24, opacity: dashboardInView.visible?1:0, transform: dashboardInView.visible?"translateX(0)":"translateX(40px)", transition:"all 0.7s ease 0.3s" }}>
              {/* AI Insights */}
              <GlassCard style={{ padding:28, background:"linear-gradient(135deg, rgba(70,48,77,0.96), rgba(90,60,100,0.96))" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:20 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:"rgba(183,156,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff", fontFamily:"Poppins" }}>AI Insights</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontFamily:"Inter" }}>Updated 2 hours ago</div>
                  </div>
                </div>
                {[
                  { text:"Your sleep improved 18% this week — linked to reduced screen time.", tag:"Sleep", color:"#A7C7A3" },
                  { text:"Hydration is below target. Drink 500ml more before 6pm.", tag:"Hydration", color:"#D9CCFF" },
                  { text:"Cycle phase: ovulation. Oestrogen peaks boost cognitive function today.", tag:"Cycle", color:"#F8D7E6" },
                ].map((ins,i)=>(
                  <div key={i} style={{ padding:"14px", borderRadius:14, background:"rgba(255,255,255,0.06)", marginBottom:i<2?12:0, display:"flex", gap:12, alignItems:"flex-start" }}>
                    <span style={{ padding:"3px 10px", borderRadius:99, background:`${ins.color}22`, fontSize:11, fontWeight:700, color:ins.color, fontFamily:"Inter", flexShrink:0 }}>{ins.tag}</span>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.82)", lineHeight:1.5, fontFamily:"Inter" }}>{ins.text}</span>
                  </div>
                ))}
              </GlassCard>

              {/* Metrics */}
              <GlassCard style={{ padding:28 }}>
                <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:16, color:"#46304D", marginBottom:20 }}>Today's Metrics</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { label:"Hydration", val:"1.5L / 2L", icon:"💧", color:"#D9CCFF", pct:75 },
                    { label:"Steps", val:"6,842", icon:"👟", color:"#DDF7E5", pct:68 },
                    { label:"Calories", val:"1,620 kcal", icon:"🔥", color:"#F8D7E6", pct:82 },
                    { label:"Stress", val:"Low", icon:"🧘‍♀️", color:"#B79CFF", pct:25 },
                  ].map((m) => (
                    <div key={m.label} style={{ padding:16, borderRadius:18, background:m.color+"33", border:`1px solid ${m.color}66` }}>
                      <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#46304D", fontFamily:"Poppins" }}>{m.val}</div>
                      <div style={{ fontSize:11, color:"#8B7A96", fontFamily:"Inter", marginBottom:8 }}>{m.label}</div>
                      <div style={{ height:4, borderRadius:99, background:"rgba(70,48,77,0.08)" }}>
                        <div style={{ width:`${m.pct}%`, height:"100%", borderRadius:99, background:`linear-gradient(90deg,${m.color},${m.color}99)` }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Wellness score */}
              <GlassCard style={{ padding:28, textAlign:"center", background:"linear-gradient(135deg, rgba(167,199,163,0.15), rgba(221,247,229,0.15))" }}>
                <div style={{ fontSize:13, color:"#8B7A96", fontFamily:"Inter", marginBottom:8 }}>Overall Wellness Score</div>
                <div style={{ fontFamily:"Poppins", fontWeight:900, fontSize:64, color:"#A7C7A3", lineHeight:1 }}>87</div>
                <div style={{ fontSize:14, color:"#6B5A74", fontFamily:"Inter", marginBottom:16 }}>Excellent — keep it up! 🌿</div>
                <div style={{ height:8, borderRadius:99, background:"rgba(167,199,163,0.2)" }}>
                  <div style={{ width:"87%", height:"100%", borderRadius:99, background:"linear-gradient(90deg,#A7C7A3,#DDF7E5)" }}/>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ──────────────────────────────────────── */}
      <section id="community" style={{ padding:"100px 0", background:"#FFF9F5" }}>
        <div ref={communityInView.ref} style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#F8D7E6", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter", background:"#B79CFF", padding:"4px 12px", borderRadius:99 }}>Community</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"16px 0 12px", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>You are never alone</h2>
            <p style={{ fontSize:17, color:"#6B5A74", maxWidth:520, margin:"0 auto", lineHeight:1.7, fontFamily:"Inter" }}>A safe, anonymous space to share, learn, and connect with thousands of women on the same journey.</p>
          </div>

          <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200, position:"relative" }}>
              <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
              <input placeholder="Search symptoms, conditions, topics…" style={{
                width:"100%", padding:"14px 16px 14px 44px", borderRadius:16,
                border:"1.5px solid rgba(183,156,255,0.3)", background:"rgba(255,255,255,0.7)",
                fontSize:14, fontFamily:"Inter", color:"#46304D", outline:"none",
                backdropFilter:"blur(12px)",
              }}/>
            </div>
            {["PCOS","Endometriosis","Fertility","Menopause","Mental Health"].map(tag=>(
              <button key={tag} style={{ padding:"12px 18px", borderRadius:99, background:"rgba(183,156,255,0.1)", border:"1.5px solid rgba(183,156,255,0.25)", fontSize:13, fontWeight:600, color:"#B79CFF", cursor:"pointer", fontFamily:"Inter", transition:"all 0.2s ease", whiteSpace:"nowrap" }}>{tag}</button>
            ))}
          </div>

          <div className="community-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
            {communityCards.map((card, i) => (
              <GlassCard key={i} style={{
                padding:28, cursor:"pointer",
                opacity: communityInView.visible?1:0,
                transform: communityInView.visible?"translateY(0)":"translateY(30px)",
                transition:`all 0.6s ease ${i*0.1}s`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <span style={{ padding:"4px 12px", borderRadius:99, background:`${card.color}55`, fontSize:12, fontWeight:700, color:"#46304D", fontFamily:"Inter" }}>{card.tag}</span>
                  <span style={{ fontSize:13, color:"#8B7A96", fontFamily:"Inter" }}>{card.replies} replies</span>
                </div>
                <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:17, color:"#46304D", marginBottom:14, lineHeight:1.4 }}>{card.title}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {[1,2,3].map(n=>(
                    <div key={n} style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${card.color}, #ffffff)`, border:"2px solid white", marginLeft:n>1?-8:0, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>👩</div>
                  ))}
                  <span style={{ fontSize:12, color:"#8B7A96", fontFamily:"Inter", marginLeft:8 }}>+{card.replies - 3} more joined</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <button className="btn-primary" style={{ padding:"14px 32px", borderRadius:99, background:"linear-gradient(135deg,#B79CFF,#D9CCFF)", border:"none", fontSize:15, fontWeight:700, color:"#46304D", fontFamily:"Poppins", cursor:"pointer", boxShadow:"0 8px 24px rgba(183,156,255,0.3)" }}>Join Community →</button>
          </div>
        </div>
      </section>

      {/* ── MENTAL WELLNESS ────────────────────────────────── */}
      <section id="wellness" style={{ padding:"100px 0", background:"linear-gradient(135deg, #F0FFF4 0%, #FFF9F5 50%, #F8F0FF 100%)", position:"relative", overflow:"hidden" }}>
        <Blob color="rgba(167,199,163,0.25)" style={{ width:400, height:400, top:-100, left:-80 }}/>
        <Leaf style={{ position:"absolute", top:60, right:"5%", width:100, color:"#A7C7A3", opacity:0.4 }}/>
        <Floral style={{ position:"absolute", bottom:40, left:"3%", width:80, color:"#D9CCFF", opacity:0.5 }}/>

        <div ref={wellnessInView.ref} style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#A7C7A3", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Inner peace</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0 12px", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>Mental Wellness</h2>
            <p style={{ fontSize:17, color:"#6B5A74", maxWidth:520, margin:"0 auto", lineHeight:1.7, fontFamily:"Inter" }}>Calming practices, immersive soundscapes, and guided breathing — designed for the moments you need them most.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }} className="dashboard-grid">
            {/* Left — soundscapes */}
            <div style={{ display:"flex", flexDirection:"column", gap:20, opacity: wellnessInView.visible?1:0, transform: wellnessInView.visible?"translateX(0)":"translateX(-40px)", transition:"all 0.7s ease 0.1s" }}>
              <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:20, color:"#46304D" }}>Soundscapes 🎵</h3>
              {soundscapes.map((s, i) => (
                <GlassCard key={i} className="sound-card" style={{ padding:"20px 24px", cursor:"pointer", transition:"all 0.3s ease" }}
                  onClick={() => setPlayingSound(playingSound === i ? null : i)}>
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ width:52, height:52, borderRadius:16, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{s.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Poppins", fontWeight:600, fontSize:16, color:"#46304D" }}>{s.title}</div>
                      <div style={{ fontFamily:"Inter", fontSize:13, color:"#8B7A96" }}>Looping • Ambient</div>
                      {playingSound === i && (
                        <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:16, marginTop:6 }}>
                          {[8,14,6,12,10,16,7,13].map((h,j)=>(
                            <div key={j} style={{ width:3, height:h, borderRadius:2, background:s.color, animation:`blobFloat ${0.5+j*0.1}s ease-in-out infinite` }}/>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ width:36, height:36, borderRadius:"50%", background: playingSound===i ? s.color : "rgba(183,156,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"all 0.3s ease" }}>
                      {playingSound === i ? "⏸" : "▶"}
                    </div>
                  </div>
                </GlassCard>
              ))}

              {/* Meditation cards */}
              <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:20, color:"#46304D", marginTop:8 }}>Guided Meditations 🧘‍♀️</h3>
              {[
                { title:"Body Scan for Beginners", dur:"10 min", color:"#D9CCFF" },
                { title:"Cycle Phase Visualisation", dur:"15 min", color:"#F8D7E6" },
                { title:"Deep Sleep Wind-Down", dur:"20 min", color:"#DDF7E5" },
              ].map((med,i)=>(
                <GlassCard key={i} style={{ padding:"18px 24px", display:"flex", alignItems:"center", gap:16, cursor:"pointer" }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:med.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌸</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"Poppins", fontWeight:600, fontSize:15, color:"#46304D" }}>{med.title}</div>
                    <div style={{ fontFamily:"Inter", fontSize:12, color:"#8B7A96" }}>{med.dur}</div>
                  </div>
                  <div style={{ fontSize:20, color:"#B79CFF" }}>→</div>
                </GlassCard>
              ))}
            </div>

            {/* Right — breathing */}
            <div style={{ opacity: wellnessInView.visible?1:0, transform: wellnessInView.visible?"translateX(0)":"translateX(40px)", transition:"all 0.7s ease 0.2s" }}>
              <GlassCard style={{ padding:40, textAlign:"center", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
                <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:22, color:"#46304D" }}>Breathing Exercise 🫁</h3>
                <p style={{ fontFamily:"Inter", fontSize:14, color:"#6B5A74", lineHeight:1.6, maxWidth:280 }}>4-4-6 box breathing — clinically shown to reduce cortisol and activate the parasympathetic nervous system.</p>

                {/* Breathing circle */}
                <div style={{ position:"relative", width:200, height:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{
                    width:200, height:200, borderRadius:"50%",
                    background: breatheActive
                      ? "radial-gradient(circle, rgba(183,156,255,0.5) 0%, rgba(217,204,255,0.2) 100%)"
                      : "radial-gradient(circle, rgba(183,156,255,0.2) 0%, rgba(217,204,255,0.08) 100%)",
                    border:"2px solid rgba(183,156,255,0.4)",
                    position:"absolute",
                    animation: breatheActive
                      ? breathePhase === "inhale" ? "breathe-in 4s ease forwards"
                        : breathePhase === "hold" ? "breathe-hold 4s ease forwards"
                        : "breathe-out 6s ease forwards"
                      : "none",
                    transition: "all 0.5s ease",
                  }}/>
                  <div style={{ position:"relative", textAlign:"center" }}>
                    <div style={{ fontFamily:"Poppins", fontWeight:700, fontSize:18, color:"#46304D" }}>
                      {breatheActive ? { inhale:"Breathe In", hold:"Hold", exhale:"Breathe Out" }[breathePhase] : "Ready?"}
                    </div>
                    {breatheActive && <div style={{ fontFamily:"Inter", fontSize:12, color:"#B79CFF", marginTop:4 }}>
                      {breathePhase==="inhale"?"4 counts":breathePhase==="hold"?"4 counts":"6 counts"}
                    </div>}
                  </div>
                </div>

                <button onClick={() => setBreatheActive(!breatheActive)} style={{
                  padding:"14px 32px", borderRadius:99,
                  background: breatheActive ? "rgba(248,215,230,0.5)" : "linear-gradient(135deg,#A7C7A3,#DDF7E5)",
                  border:"none", cursor:"pointer", fontSize:15, fontWeight:700,
                  color:"#46304D", fontFamily:"Poppins",
                  boxShadow:"0 8px 24px rgba(167,199,163,0.3)",
                }}>{breatheActive ? "Stop" : "Begin Exercise"}</button>

                {/* Mood Check */}
                <div style={{ width:"100%", borderTop:"1px solid rgba(183,156,255,0.2)", paddingTop:24 }}>
                  <div style={{ fontFamily:"Poppins", fontWeight:600, fontSize:15, color:"#46304D", marginBottom:16 }}>Mood Check-in</div>
                  <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
                    {["😢","😐","🙂","😊","🤩"].map((e,i)=>(
                      <button key={i} style={{ width:44, height:44, borderRadius:"50%", border:"2px solid rgba(183,156,255,0.2)", background:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:22, transition:"all 0.2s ease" }}
                        onMouseEnter={ev=>(ev.currentTarget.style.transform="scale(1.3)")}
                        onMouseLeave={ev=>(ev.currentTarget.style.transform="scale(1)")}>{e}</button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI RED FLAG ────────────────────────────────────── */}
      <section id="ai-coach" style={{ padding:"100px 0", background:"linear-gradient(135deg, #46304D 0%, #5a3d63 50%, #46304D 100%)", position:"relative", overflow:"hidden" }}>
        <Blob color="rgba(183,156,255,0.15)" style={{ width:600, height:600, top:-150, right:-150 }}/>
        <Blob color="rgba(248,215,230,0.1)" style={{ width:400, height:400, bottom:-100, left:-100, animationDelay:"5s" }}/>
        <Leaf style={{ position:"absolute", top:60, left:"3%", width:90, color:"#D9CCFF", opacity:0.2 }}/>
        <Floral style={{ position:"absolute", bottom:60, right:"4%", width:80, color:"#F8D7E6", opacity:0.15 }}/>

        <div ref={redFlagInView.ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#F8D7E6", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Early Detection</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#ffffff", margin:"12px 0 12px", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>AI Red Flag Detection 🛡️</h2>
            <p style={{ fontSize:17, color:"rgba(255,255,255,0.7)", maxWidth:520, margin:"0 auto", lineHeight:1.7, fontFamily:"Inter" }}>Our AI monitors for over 50 conditions associated with women's health — catching concerns before they become crises.</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }} className="features-grid">
            {redFlagSteps.map((step, i) => (
              <div key={i} style={{ position:"relative", opacity: redFlagInView.visible?1:0, transform: redFlagInView.visible?"translateY(0)":"translateY(40px)", transition:`all 0.6s ease ${i*0.12}s` }}>
                <div style={{
                  background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,0.12)", borderRadius:24, padding:"32px 24px",
                  textAlign:"center", height:"100%",
                }}>
                  <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(183,156,255,0.2)", border:"1.5px solid rgba(183,156,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 20px" }}>{step.icon}</div>
                  <div style={{ fontFamily:"Inter", fontSize:11, fontWeight:700, color:"rgba(183,156,255,0.7)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{step.num}</div>
                  <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:17, color:"#ffffff", marginBottom:12 }}>{step.title}</h3>
                  <p style={{ fontFamily:"Inter", fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.65 }}>{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="mobile-hide" style={{
                    position:"absolute", top:"50%", right:-20, transform:"translateY(-50%)",
                    width:20, height:2, background:"rgba(183,156,255,0.4)", zIndex:1,
                  }}>
                    <div style={{ position:"absolute", right:-4, top:-3, fontSize:10, color:"rgba(183,156,255,0.7)" }}>▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:48 }}>
            <div style={{ display:"inline-flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
              <div style={{ padding:"12px 24px", borderRadius:99, background:"rgba(183,156,255,0.15)", border:"1px solid rgba(183,156,255,0.3)", fontSize:13, fontWeight:600, color:"#D9CCFF", fontFamily:"Inter" }}>✓ Continue Monitoring</div>
              <div style={{ padding:"12px 24px", borderRadius:99, background:"rgba(248,215,230,0.15)", border:"1px solid rgba(248,215,230,0.3)", fontSize:13, fontWeight:600, color:"#F8D7E6", fontFamily:"Inter" }}>🩺 Contact Specialist</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MONTHLY REPORT ─────────────────────────────────── */}
      <section style={{ padding:"100px 0", background:"#FFF9F5" }}>
        <div ref={reportsInView.ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#B79CFF", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>Insights & Trends</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0 12px", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>Monthly AI Health Report 📊</h2>
            <p style={{ fontSize:17, color:"#6B5A74", maxWidth:520, margin:"0 auto", lineHeight:1.7, fontFamily:"Inter" }}>A comprehensive, beautifully designed report summarising your month — sent to you every 30 days.</p>
          </div>

          <GlassCard style={{
            padding:40, opacity: reportsInView.visible?1:0,
            transform: reportsInView.visible?"translateY(0)":"translateY(40px)",
            transition:"all 0.7s ease",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontFamily:"Poppins", fontWeight:800, fontSize:24, color:"#46304D" }}>July 2026 Report</div>
                <div style={{ fontFamily:"Inter", fontSize:14, color:"#8B7A96", marginTop:4 }}>Generated by Claim AI • 32 data points analysed</div>
              </div>
              <button className="btn-primary" style={{ padding:"12px 24px", borderRadius:99, background:"linear-gradient(135deg,#B79CFF,#D9CCFF)", border:"none", fontSize:14, fontWeight:700, color:"#46304D", fontFamily:"Poppins", cursor:"pointer", boxShadow:"0 6px 20px rgba(183,156,255,0.3)", display:"flex", alignItems:"center", gap:8 }}>
                ⬇ Download PDF
              </button>
            </div>

            <div className="reports-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:32 }}>
              {[
                { label:"Cycle Regularity", val:"28.5 days", trend:"+2%", icon:"🌸", color:"#F8D7E6" },
                { label:"Avg Mood Score", val:"7.4 / 10", trend:"+12%", icon:"😊", color:"#D9CCFF" },
                { label:"Avg Hydration", val:"1.8L / day", trend:"+8%", icon:"💧", color:"#DDF7E5" },
                { label:"Avg Sleep", val:"7.2 hours", trend:"+5%", icon:"🌙", color:"#B79CFF" },
                { label:"Exercise Days", val:"18 / 31", trend:"+15%", icon:"💪", color:"#A7C7A3" },
                { label:"Wellness Score", val:"87 / 100", trend:"+6%", icon:"⭐", color:"#F8D7E6" },
              ].map((m,i)=>(
                <div key={i} style={{ padding:20, borderRadius:18, background:`${m.color}33`, border:`1px solid ${m.color}66` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <span style={{ fontSize:24 }}>{m.icon}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#A7C7A3", fontFamily:"Inter", background:"rgba(167,199,163,0.2)", padding:"2px 8px", borderRadius:99 }}>{m.trend}</span>
                  </div>
                  <div style={{ fontFamily:"Poppins", fontWeight:700, fontSize:20, color:"#46304D" }}>{m.val}</div>
                  <div style={{ fontFamily:"Inter", fontSize:12, color:"#8B7A96", marginTop:4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Bar charts */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }} className="dashboard-grid">
              <div>
                <div style={{ fontFamily:"Poppins", fontWeight:600, fontSize:15, color:"#46304D", marginBottom:12 }}>Mood Trend (July)</div>
                <BarChart data={[6,7,5,8,7,9,6,7,8,9,7,8,6,9,10,8,7,9,8,7,9,8,7,8,9,7,8,9,8,7,9]} color="#D9CCFF"/>
              </div>
              <div>
                <div style={{ fontFamily:"Poppins", fontWeight:600, fontSize:15, color:"#46304D", marginBottom:12 }}>Hydration (July)</div>
                <BarChart data={[1.5,2.0,1.8,1.6,2.1,1.9,1.7,2.0,1.8,2.2,1.9,1.7,2.0,1.8,2.1,1.9,2.0,2.2,1.8,1.9,2.1,2.0,1.9,2.1,2.0,1.8,2.2,2.0,1.9,2.1,2.0]} color="#A7C7A3"/>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section style={{ padding:"100px 0", background:"linear-gradient(135deg, #F8F0FF 0%, #FFF9F5 100%)", position:"relative", overflow:"hidden" }}>
        <Leaf style={{ position:"absolute", top:40, right:"4%", width:90, color:"#B79CFF", opacity:0.3 }}/>

        <div ref={testimonialsInView.ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#B79CFF", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter" }}>From our community</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#46304D", margin:"12px 0", fontFamily:"Poppins", letterSpacing:"-0.5px" }}>Women who chose to Claim</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }} className="community-grid">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="testimonial-card" style={{
                padding:32, cursor:"default", transition:"all 0.35s ease",
                opacity: testimonialsInView.visible?1:0,
                transform: testimonialsInView.visible?"translateY(0)":"translateY(40px)",
                transition: `all 0.6s ease ${i*0.1}s`,
              }}>
                <div style={{ fontSize:28, color:"#B79CFF", marginBottom:16, fontFamily:"serif" }}>"</div>
                <p style={{ fontFamily:"Inter", fontSize:16, color:"#46304D", lineHeight:1.75, marginBottom:24, fontStyle:"italic" }}>{t.quote}</p>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:"50%", background:`linear-gradient(135deg, ${t.color}, #ffffff)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Poppins", fontWeight:700, fontSize:15, color:"#46304D" }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily:"Poppins", fontWeight:700, fontSize:15, color:"#46304D" }}>{t.name}</div>
                    <div style={{ fontFamily:"Inter", fontSize:13, color:"#8B7A96" }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:14, color:"#F8D7E6" }}>★</span>)}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <FAQ/>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section id="cta" style={{ padding:"80px 32px", background:"#FFF9F5" }}>
        <div ref={ctaInView.ref} style={{
          maxWidth:900, margin:"0 auto",
          background:"linear-gradient(135deg, #46304D 0%, #5a3d63 50%, #3d2744 100%)",
          borderRadius:32, padding:"72px 56px", textAlign:"center", position:"relative", overflow:"hidden",
          opacity: ctaInView.visible?1:0, transform: ctaInView.visible?"scale(1)":"scale(0.95)",
          transition:"all 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <Blob color="rgba(183,156,255,0.2)" style={{ width:400, height:400, top:-150, right:-100 }}/>
          <Blob color="rgba(248,215,230,0.15)" style={{ width:300, height:300, bottom:-120, left:-80, animationDelay:"3s" }}/>
          <Floral style={{ position:"absolute", top:20, right:"5%", width:80, color:"rgba(183,156,255,0.3)" }}/>
          <Leaf style={{ position:"absolute", bottom:20, left:"4%", width:70, color:"rgba(167,199,163,0.3)" }}/>

          <div style={{ position:"relative" }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#D9CCFF", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"Inter", marginBottom:16 }}>Start for free today</div>
            <h2 style={{ fontSize:"clamp(28px,5vw,54px)", fontWeight:800, color:"#ffffff", fontFamily:"Poppins", letterSpacing:"-1px", marginBottom:20, lineHeight:1.2 }}>
              Ready to take charge<br/>of your health?
            </h2>
            <p style={{ fontSize:18, color:"rgba(255,255,255,0.75)", fontFamily:"Inter", lineHeight:1.7, maxWidth:480, margin:"0 auto 40px" }}>
              Join 50,000+ women who use Claim to understand their bodies, track their health, and live with more peace.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn-primary" style={{
                padding:"18px 40px", borderRadius:99,
                background:"linear-gradient(135deg, #B79CFF, #D9CCFF)",
                border:"none", fontSize:17, fontWeight:700, color:"#46304D",
                fontFamily:"Poppins", cursor:"pointer",
                boxShadow:"0 12px 32px rgba(183,156,255,0.4)",
              }}>Get Started Free →</button>
              <button style={{
                padding:"18px 32px", borderRadius:99, background:"transparent",
                border:"1.5px solid rgba(255,255,255,0.3)", fontSize:16, fontWeight:600,
                color:"rgba(255,255,255,0.9)", fontFamily:"Poppins", cursor:"pointer",
                transition:"all 0.3s ease",
              }}>Learn More</button>
            </div>
            <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:32, flexWrap:"wrap" }}>
              {["No credit card required","Cancel anytime","HIPAA compliant"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.6)", fontFamily:"Inter" }}>
                  <span style={{ color:"#A7C7A3" }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ background:"#46304D", padding:"72px 32px 40px", color:"rgba(255,255,255,0.8)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:56 }}>
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#B79CFF,#F8D7E6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌸</div>
                <span style={{ fontFamily:"Poppins", fontWeight:700, fontSize:24, color:"#fff" }}>Claim</span>
              </div>
              <p style={{ fontFamily:"Inter", fontSize:14, lineHeight:1.75, color:"rgba(255,255,255,0.6)", maxWidth:300, marginBottom:24 }}>
                Claim Your Health. Claim Your Peace.<br/>
                The intelligent companion for women who want to understand and own their health.
              </p>
              <div style={{ display:"flex", gap:12 }}>
                {["𝕏","in","ig","yt"].map(icon=>(
                  <button key={icon} style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s ease", fontFamily:"Inter" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(183,156,255,0.3)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}>{icon}</button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { heading:"Product", links:["Features","AI Coach","Community","Reports","Pricing"] },
              { heading:"Company", links:["About Us","Blog","Careers","Press","Contact"] },
              { heading:"Legal", links:["Privacy Policy","Terms of Service","Cookie Policy","HIPAA Notice","Accessibility"] },
            ].map(col=>(
              <div key={col.heading}>
                <div style={{ fontFamily:"Poppins", fontWeight:700, fontSize:14, color:"#fff", marginBottom:20, letterSpacing:"0.05em" }}>{col.heading}</div>
                {col.links.map(link=>(
                  <div key={link} style={{ marginBottom:12 }}>
                    <a href="#" style={{ fontFamily:"Inter", fontSize:14, color:"rgba(255,255,255,0.55)", textDecoration:"none", transition:"color 0.2s ease" }}
                      onMouseEnter={e=>((e.target as HTMLAnchorElement).style.color="#D9CCFF")}
                      onMouseLeave={e=>((e.target as HTMLAnchorElement).style.color="rgba(255,255,255,0.55)")}>{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:32, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <div style={{ fontFamily:"Inter", fontSize:13, color:"rgba(255,255,255,0.4)" }}>
              © 2026 Claim Health Technologies Ltd. All rights reserved.
            </div>
            <div style={{ display:"flex", gap:24 }}>
              {["Privacy","Terms","Cookies"].map(l=>(
                <a key={l} href="#" style={{ fontFamily:"Inter", fontSize:13, color:"rgba(255,255,255,0.4)", textDecoration:"none" }}>{l}</a>
              ))}
            </div>
            <div style={{ fontFamily:"Inter", fontSize:13, color:"rgba(255,255,255,0.35)" }}>
              Made with 💜 for women everywhere
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile menu button (shown on small screens via CSS) */}
      <style>{`
        @media(max-width:768px) {
          .mobile-menu-btn { display:flex !important; }
        }
      `}</style>
    </div>
  );
}
