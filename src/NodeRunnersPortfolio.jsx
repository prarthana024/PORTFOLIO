import { useState, useEffect, useRef } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from "recharts";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const C = {
  bg: "#0F172A", card: "#1E293B", card2: "#162032",
  green: "#4ADE80", cyan: "#22D3EE", magenta: "#E879F9",
  amber: "#FBBF24", text: "#E2E8F0", muted: "#94A3B8",
  dim: "#64748B", border: "#1E3A5F",
};

const MEMBERS = [
  {
    name: "Ajmal Kareem", initials: "AK", college: "BITS Pilani",
    interest: "AI/ML · LLM Research",
    learn: ["LLM Architecture & Attention Mechanisms", "Fine-tuning with LoRA / PEFT", "End-to-end ML Pipeline Engineering"],
    color: C.green, emoji: "🤖",
    funFact: "Can whiteboard a transformer diagram from memory — at 2 AM, no coffee.",
    role: "// ML_Engineer.init()",
  },
  {
    name: "Prarthana", initials: "PR", college: "BITS Pilani",
    interest: "AI/ML · Data Analysis",
    learn: ["Prompt Engineering & RAG Systems", "Pandas · Polars · Plotly", "Model Evaluation & Benchmarking"],
    color: C.cyan, emoji: "⚡",
    funFact: "Has read more arXiv papers this year than fiction novels in her entire life.",
    role: "// DataExplorer.connect()",
  },
  {
    name: "Chaitrali", initials: "CH", college: "BITS Pilani",
    interest: "AI/ML · LLM Systems",
    learn: ["Vector DBs & Embedding Pipelines", "MLOps & Model Deployment", "LangChain · LlamaIndex Frameworks"],
    color: C.magenta, emoji: "🔮",
    funFact: "Debugs production issues in her sleep — wakes up with the stack trace solved.",
    role: "// AI_Architect.build()",
  },
];

const SKILLS_DATA = [
  { name: "Backend", value: 3, color: C.green },
  { name: "Frontend", value: 2, color: C.cyan },
  { name: "Design", value: 1, color: C.magenta },
  { name: "Data/ML", value: 3, color: C.amber },
];

const LEARNING = [
  {
    icon: "🔬", label: "$ explore --technologies", color: C.green,
    title: "Tech Stack to Master",
    items: ["Hugging Face Transformers", "LangChain & LlamaIndex", "PyTorch · scikit-learn", "Pandas · Polars · Plotly", "Pinecone · Weaviate (Vector DBs)"],
  },
  {
    icon: "⚡", label: "$ grep --problems-we-love", color: C.cyan,
    title: "Problems That Excite Us",
    items: ["LLM hallucination & factual grounding", "Explainable AI in production", "Low-resource language NLP", "Real-time ML inference at scale", "Efficient RAG pipeline design"],
  },
  {
    icon: "🚀", label: "$ git log --intern-goals", color: C.magenta,
    title: "Internship Targets",
    items: ["Ship an end-to-end ML pipeline", "Fine-tune an LLM on real domain data", "Deploy & monitor a model in production", "Master collaborative code review culture", "Contribute to at least one open-source tool"],
  },
];

const WORK_STYLE = [
  { e: "☕", t: "Daily Check-ins", d: "15-min standups. Blockers surface early, wins get celebrated." },
  { e: "🎯", t: "Weekly Demos", d: "Every Friday we ship something and show it. No exceptions." },
  { e: "👥", t: "Pair Programming", d: "Two sets of eyes. We tackle hard problems together." },
  { e: "🔍", t: "Code Reviews", d: "Every PR reviewed. Quality is a team responsibility." },
  { e: "📝", t: "Async Documentation", d: "We document as we build. Future-us says thank you." },
  { e: "🧪", t: "Prototype & Iterate", d: "Fail fast, learn faster. Ship small, learn a lot." },
];

const OSS = [
  {
    icon: "📦", label: "$ ls ~/projects-we-follow", color: C.green,
    title: "Projects We Love",
    items: [
      { n: "Hugging Face Transformers", d: "State-of-the-art transformer models for NLP, vision, and audio. Powers our LLM research pipeline." },
      { n: "LangChain", d: "Framework for building context-aware reasoning applications with LLMs. Essential for RAG architecture." },
      { n: "Apache Superset", d: "Modern enterprise-ready BI platform. Our go-to for interactive data dashboards." },
      { n: "ONNX Runtime", d: "High-performance inference engine for production ML. Cross-platform, hardware-accelerated." },
    ],
  },
  {
    icon: "🌐", label: "$ ping communities", color: C.cyan,
    title: "Communities",
    items: [
      { n: "Hugging Face Hub", d: "40,000+ open-source models and datasets. Where we discover, test, and share ML artifacts." },
      { n: "MLOps Community", d: "Global network of ML engineers sharing best practices for model lifecycle management." },
      { n: "Papers With Code", d: "The definitive resource linking ML research to implementations. Our learning roadmap." },
      { n: "Apache Foundation", d: "Community-driven, enterprise-grade open source projects. Building software that lasts." },
    ],
  },
  {
    icon: "🛠️", label: "$ todo --open-problems", color: C.magenta,
    title: "Problems to Tackle",
    items: [
      { n: "Model Interpretability", d: "Democratizing AI by making complex models explainable and trustworthy for end users." },
      { n: "Low-resource NLP", d: "Bringing multilingual AI to underserved populations. 7,000 languages deserve better tools." },
      { n: "Efficient Edge Inference", d: "Running billion-parameter models on constrained hardware. Privacy-first, latency-optimized." },
      { n: "Data Quality Tooling", d: "Automated data validation and cleaning at scale. Fixing the root cause of model failures." },
    ],
  },
];

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

.nr-root * { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; box-sizing: border-box; }
.nr-root { background: #0F172A; color: #E2E8F0; min-height: 100vh; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0F172A; }
::-webkit-scrollbar-thumb { background: #4ADE80; border-radius: 2px; }

/* Animations */
@keyframes nr-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes nr-flicker { 0%,94%,100%{opacity:1} 95%{opacity:.82} 97%{opacity:.93} 98%{opacity:.87} }
@keyframes nr-slideup { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
@keyframes nr-mchar {
  0%{opacity:0;transform:translateY(-24px)} 8%{opacity:.7;transform:translateY(0)}
  92%{opacity:.7} 100%{opacity:0;transform:translateY(24px)}
}
@keyframes nr-glow-pulse {
  0%,100%{text-shadow:0 0 8px rgba(74,222,128,.6)} 50%{text-shadow:0 0 20px rgba(74,222,128,1),0 0 40px rgba(74,222,128,.4)}
}
@keyframes nr-grad {
  0%,100%{background-position:0% 50%} 50%{background-position:100% 50%}
}
@keyframes nr-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.nr-flicker { animation: nr-flicker 12s infinite; }
.nr-blink { animation: nr-blink 1s step-end infinite; display:inline-block; color:#4ADE80; }
.nr-su  { animation: nr-slideup .7s ease both; }
.nr-su1 { animation: nr-slideup .7s .12s ease both; }
.nr-su2 { animation: nr-slideup .7s .24s ease both; }
.nr-su3 { animation: nr-slideup .7s .36s ease both; }
.nr-su4 { animation: nr-slideup .7s .48s ease both; }

/* Section fade-in */
.nr-fade { opacity:0; transform:translateY(28px); transition:opacity .85s ease, transform .85s ease; }
.nr-fade.nr-in { opacity:1; transform:translateY(0); }

/* Card flip */
.nr-flip { perspective: 1100px; cursor: pointer; }
.nr-flip-inner {
  position:relative; width:100%; height:100%;
  transform-style: preserve-3d;
  transition: transform .72s cubic-bezier(.4,0,.2,1);
}
.nr-flipped { transform: rotateY(180deg); }
.nr-front, .nr-back {
  position:absolute; inset:0; border-radius:12px;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
}
.nr-back { transform: rotateY(180deg); }

/* Neon borders */
.nb-g { border:1px solid rgba(74,222,128,.35); box-shadow:0 0 22px rgba(74,222,128,.12),inset 0 0 16px rgba(74,222,128,.04); }
.nb-c { border:1px solid rgba(34,211,238,.35); box-shadow:0 0 22px rgba(34,211,238,.12),inset 0 0 16px rgba(34,211,238,.04); }
.nb-m { border:1px solid rgba(232,121,249,.35); box-shadow:0 0 22px rgba(232,121,249,.12),inset 0 0 16px rgba(232,121,249,.04); }

/* Text glows */
.tg-g { text-shadow: 0 0 12px rgba(74,222,128,.85); }
.tg-c { text-shadow: 0 0 12px rgba(34,211,238,.85); }
.tg-m { text-shadow: 0 0 12px rgba(232,121,249,.85); }

/* Gradient text */
.nr-grad-text {
  background: linear-gradient(135deg,#4ADE80,#22D3EE,#E879F9,#4ADE80);
  background-size: 300% 300%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: nr-grad 5s ease infinite;
}

/* Nav hover */
.nr-nav-btn:hover { color:#4ADE80 !important; text-shadow:0 0 10px rgba(74,222,128,.8) !important; }

/* Card hover lift */
.nr-card-hover { transition: transform .2s ease, box-shadow .2s ease; }
.nr-card-hover:hover { transform: translateY(-3px); }

/* Scanlines */
.nr-scanlines {
  position:fixed; inset:0; pointer-events:none; z-index:9000;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 3px,
    rgba(0,0,0,.09) 3px, rgba(0,0,0,.09) 4px
  );
}

/* Avatar glow */
.ag-g { box-shadow: 0 0 22px rgba(74,222,128,.55), 0 0 44px rgba(74,222,128,.18); }
.ag-c { box-shadow: 0 0 22px rgba(34,211,238,.55), 0 0 44px rgba(34,211,238,.18); }
.ag-m { box-shadow: 0 0 22px rgba(232,121,249,.55), 0 0 44px rgba(232,121,249,.18); }
`;

/* ─────────────────────────── SMALL COMPONENTS ─────────────────────────── */
function Avatar({ initials, color, size = 72 }) {
  const ag = color === C.green ? "ag-g" : color === C.cyan ? "ag-c" : "ag-m";
  return (
    <div className={ag} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `radial-gradient(circle at 35% 30%, ${color}30, ${color}0a)`,
      border: `1.5px solid ${color}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.29, fontWeight: 700, color,
      letterSpacing: "0.04em",
    }}>{initials}</div>
  );
}

function SectionHeader({ cmd, title, color = C.green }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: 11, color: C.dim, marginBottom: 6, letterSpacing: ".06em" }}>
        <span style={{ color: C.green }}>node@runners</span>
        <span style={{ color: C.dim }}>:~/portfolio$ </span>
        <span style={{ color: C.text }}>{cmd}</span>
      </div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3.5vw,30px)", fontWeight: 700, color, letterSpacing: "-.02em" }}>
        <span style={{ color: C.dim, marginRight: 10 }}>{">"}</span>{title}
      </h2>
    </div>
  );
}

/* ─────────────────────────── MAIN ─────────────────────────── */
export default function NodeRunners() {
  const [activeNav, setActiveNav] = useState("home");
  const [visibleSections, setVisibleSections] = useState(new Set(["home"]));
  const [chartVisible, setChartVisible] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  /* Inject CSS */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* Intersection observer */
  useEffect(() => {
    const ids = ["home","team","learning","fun","skills","opensource","contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          setVisibleSections(prev => new Set([...prev, id]));
          setActiveNav(id);
          if (id === "skills") setChartVisible(true);
        }
      });
    }, { threshold: 0.12, rootMargin: "-55px 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const fade = id => ({
    opacity: visibleSections.has(id) ? 1 : 0,
    transform: visibleSections.has(id) ? "translateY(0)" : "translateY(28px)",
    transition: "opacity .85s ease, transform .85s ease",
  });

  const sec = (bg) => ({ padding: "88px 20px", background: bg || C.bg });
  const wrap = { maxWidth: 1080, margin: "0 auto" };

  /* ── NAV ── */
  const navLinks = [
    { l: "~/home", id: "home" }, { l: "team", id: "team" },
    { l: "skills", id: "skills" }, { l: "learning", id: "learning" },
    { l: "fun", id: "fun" }, { l: "open source", id: "opensource" },
    { l: "contact", id: "contact" },
  ];

  return (
    <div className="nr-root nr-flicker" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>

      {/* Scanlines overlay */}
      <div className="nr-scanlines" />

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 500,
        background: "rgba(15,23,42,.96)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid rgba(74,222,128,.18)`,
      }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <button onClick={() => scrollTo("home")} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, padding: 0,
          }}>
            <span style={{ color: C.green, fontSize: 20, lineHeight: 1 }}>⬡</span>
            <span className="tg-g" style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".08em", color: C.green }}>
              NODE<span style={{ color: C.cyan }}>_</span>RUNNERS
            </span>
          </button>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {navLinks.map(({ l, id }) => (
              <button key={id} className="nr-nav-btn" onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 11, padding: "4px 9px",
                color: activeNav === id ? C.green : C.dim,
                textShadow: activeNav === id ? `0 0 10px rgba(74,222,128,.8)` : "none",
                transition: "color .2s, text-shadow .2s",
                fontWeight: activeNav === id ? 600 : 400,
              }}>
                {activeNav === id ? "> " : ""}{l}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 20px", position: "relative", overflow: "hidden" }}>

        {/* Matrix rain bg */}
        {[...Array(14)].map((_, i) => (
          <div key={i} aria-hidden style={{
            position: "absolute", top: 0,
            left: `${(i * 7.3 + 1) % 100}%`,
            color: `rgba(74,222,128,${.06 + (i % 3) * .02})`,
            fontSize: 13, writingMode: "vertical-rl", letterSpacing: 5,
            animation: `nr-mchar ${2.5 + (i % 4) * .7}s ${i * .35}s ease infinite`,
            userSelect: "none", pointerEvents: "none",
          }}>
            {["01001","10110","NODE>","00111","RUN->","11010","AI::=","01101","<LLM>","10011"][i % 10]}
          </div>
        ))}

        {/* Decorative ring */}
        <div aria-hidden style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          width: 380, height: 380, borderRadius: "50%",
          border: `1px solid rgba(34,211,238,.08)`,
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
          width: 280, height: 280, borderRadius: "50%",
          border: `1px solid rgba(74,222,128,.1)`,
          animation: "nr-spin 30s linear infinite",
          pointerEvents: "none",
        }}>
          {[0,60,120,180,240,300].map(deg => (
            <div key={deg} style={{
              position: "absolute", width: 6, height: 6, borderRadius: "50%",
              background: C.green, top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(139px) translateY(-50%)`,
              boxShadow: `0 0 8px ${C.green}`,
            }} />
          ))}
        </div>

        <div style={{ ...wrap, width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: C.dim, marginBottom: 14, letterSpacing: ".05em" }} className="nr-su">
            <span style={{ color: C.green }}>root@node-runners</span>
            <span style={{ color: C.dim }}>:~$ </span>
            <span style={{ color: C.text }}>./launch-portfolio.sh --intern-cohort=2025</span>
          </div>

          <h1 className="nr-su1" style={{ fontSize: "clamp(52px,9vw,100px)", fontWeight: 700, margin: "0 0 4px", lineHeight: 1, letterSpacing: "-.04em" }}>
            <span className="nr-grad-text">NODE</span>
          </h1>
          <h1 className="nr-su2" style={{ fontSize: "clamp(52px,9vw,100px)", fontWeight: 700, margin: "0 0 32px", lineHeight: 1, letterSpacing: "-.04em", color: C.text }}>
            RUNNERS<span className="nr-blink" style={{ marginLeft: 6 }}>_</span>
          </h1>

          <div className="nr-su3" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
            {[["🤖 AI/ML", C.green], ["⚡ LLM Research", C.cyan], ["🔮 Data Engineering", C.magenta], ["🎓 BITS Pilani", C.amber]].map(([t, c]) => (
              <span key={t} style={{
                padding: "5px 14px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: `${c}18`, border: `1px solid ${c}44`, color: c,
              }}>{t}</span>
            ))}
          </div>

          <div className="nr-su3" style={{ maxWidth: 580, display: "grid", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid rgba(74,222,128,.2)`, borderRadius: 8, padding: "14px 18px" }}>
              <span style={{ color: C.green, fontSize: 11 }}>{">"} </span>
              <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
                Three interns on a mission to navigate the data streams of modern AI — processing inputs, sharing knowledge, relaying outputs. Always running. 🚀
              </span>
            </div>
            <div style={{ background: C.card, border: `1px solid rgba(34,211,238,.2)`, borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ color: C.cyan, fontSize: 10, letterSpacing: ".1em", marginBottom: 5 }}>$ cat WHY_THIS_NAME.md</div>
              <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
                Like nodes in a distributed network, we each process information independently — yet our combined output is stronger than any single node could produce alone. ⬡
              </span>
            </div>
            <div style={{ background: C.card, border: `1px solid rgba(232,121,249,.2)`, borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ color: C.magenta, fontSize: 10, letterSpacing: ".1em", marginBottom: 5 }}>$ cat FUN_FACT.txt</div>
              <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
                💡 Combined, the team has read more arXiv papers than they've had proper nights of sleep during exam season — and they'd make the same trade every time.
              </span>
            </div>
          </div>

          <div className="nr-su4" style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("team")} style={{
              background: "rgba(74,222,128,.14)", border: `1px solid ${C.green}`,
              color: C.green, padding: "10px 22px", borderRadius: 6,
              fontSize: 12, fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
              transition: "background .2s",
            }}>$ meet_the_team →</button>
            <button onClick={() => scrollTo("skills")} style={{
              background: "transparent", border: `1px solid ${C.cyan}55`,
              color: C.cyan, padding: "10px 22px", borderRadius: 6,
              fontSize: 12, fontFamily: "inherit", cursor: "pointer",
            }}>$ view_skills</button>
          </div>

          <div style={{ marginTop: 56, display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[["3", "Interns", C.green], ["∞", "Curiosity", C.cyan], ["2025", "Cohort", C.magenta], ["AI/ML", "Domain", C.amber]].map(([v, l, c]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 700, color: c, textShadow: `0 0 14px ${c}88` }}>{v}</div>
                <div style={{ fontSize: 10, color: C.dim, letterSpacing: ".1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TEAM ══════════════════ */}
      <section id="team" style={{ ...sec("#0B1120") }}>
        <div style={{ ...wrap, ...fade("team") }}>
          <SectionHeader cmd="ls -la ./team/" title="MEET THE TEAM" />
          <p style={{ color: C.dim, fontSize: 12, marginTop: -24, marginBottom: 36 }}>// hover over a card to flip it and reveal more</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {MEMBERS.map((m, i) => {
              const nb = m.color === C.green ? "nb-g" : m.color === C.cyan ? "nb-c" : "nb-m";
              const isFlipped = flippedCard === i;
              return (
                <div
                  key={m.name}
                  className="nr-flip"
                  style={{ height: 390 }}
                  onMouseEnter={() => setFlippedCard(i)}
                  onMouseLeave={() => setFlippedCard(null)}
                >
                  <div className={`nr-flip-inner ${isFlipped ? "nr-flipped" : ""}`}>
                    {/* FRONT */}
                    <div className={`nr-front ${nb}`} style={{ background: C.card, padding: 28, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                        <Avatar initials={m.initials} color={m.color} size={70} />
                        <div>
                          <div style={{ color: m.color, fontSize: 10, letterSpacing: ".1em", marginBottom: 3 }}>{m.role}</div>
                          <div style={{ fontWeight: 700, fontSize: 17, color: "#F1F5F9" }}>{m.name}</div>
                          <div style={{ color: C.dim, fontSize: 11, marginTop: 3 }}>{m.emoji} {m.college}</div>
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ color: C.dim, fontSize: 9, letterSpacing: ".12em", marginBottom: 5 }}>AREA OF INTEREST</div>
                          <div style={{ color: m.color, fontSize: 14, fontWeight: 600 }}>{m.interest}</div>
                        </div>
                        <div style={{ background: "rgba(15,23,42,.65)", borderRadius: 6, padding: "10px 14px" }}>
                          <div style={{ color: m.color, fontSize: 9, letterSpacing: ".1em", marginBottom: 5 }}>$ whoami --profile</div>
                          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>
                            Passionate about building intelligent systems that reason, learn, and adapt. Focused on real-world AI/ML applications and large language models.
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 16, color: "#334155", fontSize: 10, textAlign: "center" }}>⟳ hover to flip</div>
                    </div>

                    {/* BACK */}
                    <div className="nr-back" style={{
                      background: `linear-gradient(145deg, #162032, #0F1829)`,
                      border: `1px solid ${m.color}55`, padding: 28, display: "flex", flexDirection: "column",
                    }}>
                      <div style={{ color: m.color, fontSize: 10, letterSpacing: ".1em", marginBottom: 10 }}>$ cat learning_goals.md</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#F1F5F9", marginBottom: 3 }}>{m.name}</div>
                      <div style={{ color: C.dim, fontSize: 11, marginBottom: 20 }}>Technologies to master this internship 🎯</div>

                      <div style={{ flex: 1 }}>
                        {m.learn.map((item, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                            <span style={{ color: m.color, fontSize: 11, flexShrink: 0, marginTop: 2 }}>▶</span>
                            <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.55 }}>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: "rgba(15,23,42,.75)", borderRadius: 6, padding: "10px 14px", marginTop: 10 }}>
                        <div style={{ color: C.magenta, fontSize: 9, letterSpacing: ".1em", marginBottom: 5 }}>💡 FUN_FACT</div>
                        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.55, fontStyle: "italic" }}>"{m.funFact}"</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ LEARNING GOALS ══════════════════ */}
      <section id="learning" style={sec()}>
        <div style={{ ...wrap, ...fade("learning") }}>
          <SectionHeader cmd="cat LEARNING_GOALS.md" title="WHAT WE WANT TO LEARN" color={C.cyan} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
            {LEARNING.map(g => (
              <div key={g.title} className="nr-card-hover" style={{
                background: C.card, borderRadius: 12, padding: 28,
                border: `1px solid ${g.color}28`,
              }}>
                <div style={{ fontSize: 10, color: g.color, letterSpacing: ".1em", marginBottom: 10 }}>{g.label}</div>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{g.icon}</div>
                <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: g.color, textShadow: `0 0 10px ${g.color}55` }}>{g.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {g.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 11 }}>
                      <span style={{ color: g.color, fontSize: 9, marginTop: 5, flexShrink: 0 }}>◆</span>
                      <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WORKING STYLE / FUN ══════════════════ */}
      <section id="fun" style={{ ...sec("#0B1120") }}>
        <div style={{ ...wrap, ...fade("fun") }}>
          <SectionHeader cmd="cat TEAM_WORKING_STYLE.md" title="HOW WE WORK" color={C.magenta} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {WORK_STYLE.map((w, i) => {
              const colors = [C.green, C.cyan, C.magenta, C.green, C.cyan, C.magenta];
              const c = colors[i];
              return (
                <div key={w.t} className="nr-card-hover" style={{
                  background: C.card, borderRadius: 10, padding: "20px 22px",
                  border: `1px solid ${c}1a`,
                  display: "flex", gap: 16, alignItems: "flex-start",
                  transition: "border-color .25s, box-shadow .25s, transform .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c}55`; e.currentTarget.style.boxShadow = `0 0 22px ${c}1a`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c}1a`; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{w.e}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: c, fontSize: 13, marginBottom: 6 }}>{w.t}</div>
                    <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{w.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ SKILLS ══════════════════ */}
      <section id="skills" style={sec()}>
        <div style={{ ...wrap, ...fade("skills") }}>
          <SectionHeader cmd="npm run audit:skills" title="SKILLS MAP" color={C.green} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "start" }}>
            {/* Animated bars */}
            <div>
              <div style={{ color: C.dim, fontSize: 10, letterSpacing: ".1em", marginBottom: 18 }}>// members per skill area (out of 3)</div>
              {SKILLS_DATA.map((s, i) => (
                <div key={s.name} style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ color: s.color, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                    <span style={{ color: C.dim, fontSize: 11 }}>{s.value}/3</span>
                  </div>
                  <div style={{ background: "#162032", borderRadius: 4, height: 10, overflow: "hidden", border: `1px solid ${s.color}22` }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: `linear-gradient(90deg, ${s.color}bb, ${s.color})`,
                      boxShadow: `0 0 12px ${s.color}88`,
                      width: chartVisible ? `${(s.value / 3) * 100}%` : "0%",
                      transition: `width 1.3s ${i * 0.22}s cubic-bezier(.4,0,.2,1)`,
                    }} />
                  </div>
                </div>
              ))}

              {/* Skill tags */}
              <div style={{ marginTop: 28, background: C.card, borderRadius: 10, padding: "18px 20px", border: `1px solid rgba(74,222,128,.18)` }}>
                <div style={{ color: C.green, fontSize: 10, letterSpacing: ".1em", marginBottom: 12 }}>$ pip install -r requirements.txt</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[["Python", C.green], ["PyTorch", C.cyan], ["Hugging Face", C.magenta], ["LangChain", C.green], ["Pandas", C.cyan], ["scikit-learn", C.magenta], ["SQL", C.amber], ["FastAPI", C.green], ["Docker", C.cyan], ["NumPy", C.magenta], ["Git", C.green], ["Plotly", C.amber]].map(([n, c]) => (
                    <span key={n} style={{
                      padding: "3px 11px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                      background: `${c}12`, border: `1px solid ${c}38`, color: c,
                    }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div>
              <div style={{ color: C.dim, fontSize: 10, letterSpacing: ".1em", marginBottom: 12 }}>// radar visualization</div>
              <div style={{ height: 320, background: C.card, borderRadius: 10, padding: "20px 12px 12px", border: `1px solid rgba(34,211,238,.18)` }}>
                {chartVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILLS_DATA}>
                      <PolarGrid stroke="#1E3A5F" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: C.dim, fontSize: 11, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 3]}
                        tick={{ fill: C.dim, fontSize: 9 }}
                        tickCount={4}
                      />
                      <Radar
                        name="Skill Level"
                        dataKey="value"
                        stroke="#22D3EE"
                        fill="#22D3EE"
                        fillOpacity={0.35}
                        strokeWidth={2.5}
                        animationDuration={1200}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#162032",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.text,
                          fontSize: 12
                        }}
                        formatter={v => [`${v}/3 members`, "Level"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {SKILLS_DATA.map(s => (
                  <div key={s.name} style={{ background: C.card, borderRadius: 8, padding: "12px 14px", border: `1px solid ${s.color}22` }}>
                    <div style={{ fontSize: 10, color: C.dim, marginBottom: 3 }}>{s.name}</div>
                    <div style={{ fontWeight: 700, color: s.color, fontSize: 20, textShadow: `0 0 12px ${s.color}66` }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: C.dim }}>members</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ OPEN SOURCE ══════════════════ */}
      <section id="opensource" style={{ ...sec("#0B1120") }}>
        <div style={{ ...wrap, ...fade("opensource") }}>
          <SectionHeader cmd="cat OPEN_SOURCE_INTERESTS.md" title="OPEN SOURCE" color={C.amber} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
            {OSS.map(cat => (
              <div key={cat.title} className="nr-card-hover" style={{ background: C.card, borderRadius: 12, padding: 28, border: `1px solid ${cat.color}25` }}>
                <div style={{ fontSize: 10, color: C.dim, letterSpacing: ".1em", marginBottom: 10 }}>{cat.label}</div>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
                <h3 style={{ margin: "0 0 20px", color: cat.color, fontSize: 15, fontWeight: 700, textShadow: `0 0 10px ${cat.color}44` }}>{cat.title}</h3>
                {cat.items.map((item, j) => (
                  <div key={j} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: j < cat.items.length - 1 ? `1px solid rgba(30,58,95,.5)` : "none" }}>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.n}</div>
                    <div style={{ color: C.dim, fontSize: 11, lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section id="contact" style={sec()}>
        <div style={{ ...wrap, maxWidth: 680, ...fade("contact") }}>
          <SectionHeader cmd="nc -lv 9000" title="CONNECT WITH US" color={C.cyan} />
          <div style={{ background: C.card, borderRadius: 14, padding: "40px 36px", border: `1px solid rgba(34,211,238,.28)`, boxShadow: "0 0 48px rgba(34,211,238,.08)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>📡</div>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              Three curious interns ready to learn, build, and ship. If you're working on something interesting in the AI/ML space — let's connect. 🤝
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              {MEMBERS.map(m => (
                <div key={m.name} style={{
                  background: "#0F172A", border: `1px solid ${m.color}44`, borderRadius: 10,
                  padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <Avatar initials={m.initials} color={m.color} size={36} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: m.color, fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ color: C.dim, fontSize: 10, marginTop: 1 }}>BITS Pilani · AI/ML</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0F172A", borderRadius: 8, padding: "12px 18px", display: "inline-block" }}>
              <span style={{ color: C.dim, fontSize: 12 }}>node@runners</span>
              <span style={{ color: C.magenta, fontSize: 12 }}>:~$ </span>
              <span style={{ color: C.text, fontSize: 12 }}>echo "Let's build the future of AI together"</span>
              <span className="nr-blink" style={{ marginLeft: 4, fontSize: 12 }}>█</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ padding: "28px 20px", borderTop: `1px solid rgba(74,222,128,.1)`, textAlign: "center" }}>
        <div style={{ color: "#2A3F55", fontSize: 11 }}>
          <span style={{ color: C.green }}>// </span>
          Built with 🤖 by Node Runners · BITS Pilani · Intern Cohort 2025
          <span style={{ color: C.green }}> // </span>
        </div>
        <div style={{ color: "#1A2A3A", fontSize: 10, marginTop: 4 }}>process.exit(0) — until the next sprint.</div>
      </footer>
    </div>
  );
}
