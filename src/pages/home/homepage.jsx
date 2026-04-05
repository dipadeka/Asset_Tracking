import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ASSAM_PATH = `M 72 118 L 84 94 L 106 76 L 140 64 L 178 56 L 218 50 L 258 46
  L 298 43 L 338 41 L 378 40 L 416 42 L 452 47 L 484 57 L 512 72
  L 534 92 L 550 112 L 558 134 L 556 156 L 548 176 L 536 196
  L 522 214 L 506 230 L 488 243 L 468 252 L 448 258 L 426 263
  L 404 268 L 382 273 L 360 278 L 338 283 L 316 287 L 294 290
  L 272 290 L 250 287 L 228 280 L 206 270 L 186 258 L 168 245
  L 152 230 L 136 214 L 118 196 L 100 176 L 82 154 Z`;

const BARAK_PATH = `M 338 283 L 350 295 L 362 308 L 374 318 L 386 322 L 396 318
  L 400 308 L 396 296 L 388 284 L 382 273`;

function AssamMapBase({ accentColor, children }) {
  return (
    <svg viewBox="0 0 660 340" style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, background: "#0b1622" }} xmlns="http://www.w3.org/2000/svg">
      <path d={ASSAM_PATH} fill="#162032" stroke={accentColor} strokeWidth="1.8" strokeOpacity="0.6" />
      <path d={BARAK_PATH} fill="#162032" stroke={accentColor} strokeWidth="1.8" strokeOpacity="0.6" />
      <path d="M 90 158 Q 180 142 300 138 Q 420 136 548 152" fill="none" stroke="#1e40af" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />
      <text x="310" y="130" fill="rgba(96,165,250,0.3)" fontSize="8.5" textAnchor="middle" fontStyle="italic">Brahmaputra</text>
      <text x="310" y="24" fill={accentColor} fontSize="10" textAnchor="middle" fontWeight="700" letterSpacing="3" opacity="0.5">ASSAM</text>
      {children}
    </svg>
  );
}

function MapPin({ cx, cy, color, isSelected, onClick }) {
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <circle cx={cx} cy={cy} r={isSelected ? 18 : 12} fill={`${color}25`} stroke={color} strokeWidth={isSelected ? 2 : 1.2} />
      <circle cx={cx} cy={cy} r="5.5" fill={color} />
    </g>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled,      setScrolled]      = useState(false);
  const [time,          setTime]          = useState(new Date());
  const [activePortal,  setActivePortal]  = useState(null);
  const [selectedEmrs,  setSelectedEmrs]  = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [counters,      setCounters]      = useState({ schools: 0, students: 0, assets: 0, districts: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard/emrs");
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);
    const targets = { schools: 17, students: 500, assets: 50, districts: 10 };
    let step = 0;
    const counterTimer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 60, 3);
      setCounters({
        schools:   Math.round(targets.schools   * ease),
        students:  Math.round(targets.students  * ease),
        assets:    Math.round(targets.assets    * ease),
        districts: Math.round(targets.districts * ease),
      });
      if (step >= 60) clearInterval(counterTimer);
    }, 2000 / 60);
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(timer); clearInterval(counterTimer); };
  }, []);

  const stats = [
    { label: "EMRS Schools",      value: counters.schools,  suffix: "",  icon: "🏫", color: "#3b82f6" },
    { label: "Students Enrolled", value: counters.students, suffix: "+", icon: "🎓", color: "#8b5cf6" },
    { label: "Assets Tracked",    value: counters.assets,   suffix: "+", icon: "🏗️", color: "#f59e0b" },
    { label: "Districts Covered", value: counters.districts,suffix: "+", icon: "🗺️", color: "#10b981" },
  ];

  const portals = [
    {
      title: "EMRS Management", subtitle: "Eklavya Model Residential School",
      description: "Manage school details, infrastructure, student enrollment, staff records, hostel administration, and operational data.",
      icon: "🏫", gradient: "linear-gradient(135deg,#1e3a8a,#2563eb)", accent: "#60a5fa", glowColor: "rgba(37,99,235,0.3)",
      features: [
        { icon: "🏫", text: "School & Location Details" }, { icon: "🎓", text: "Student Enrollment" },
        { icon: "👨‍🏫", text: "Staff Management" }, { icon: "🏠", text: "Hostel Administration" },
        { icon: "🏗️", text: "Construction Status" },
      ],
      path: "/signin", badge: "17 Schools",
    },
    {
      title: "Asset Management", subtitle: "Infrastructure & Project Tracking",
      description: "Track government assets, monitor construction projects, record financial details, and maintain comprehensive asset lifecycle.",
      icon: "🏗️", gradient: "linear-gradient(135deg,#064e3b,#059669)", accent: "#34d399", glowColor: "rgba(5,150,105,0.3)",
      features: [
        { icon: "📊", text: "Project Details" }, { icon: "🏛️", text: "Asset Tracking" },
        { icon: "💰", text: "Financial Records" }, { icon: "🔨", text: "Construction Status" },
        { icon: "📍", text: "GPS Location Tagging" },
      ],
      path: "/signin", badge: "50+ Assets",
    },
  ];

  const recentActivities = [
    { icon: "🏫", text: "EMRS Kampur updated infrastructure details", time: "2 hrs ago",  color: "#3b82f6" },
    { icon: "👨‍🏫", text: "Staff records added for EMRS Jorhat",      time: "5 hrs ago",  color: "#8b5cf6" },
    { icon: "🏗️", text: "Construction status updated — Block A",      time: "1 day ago",  color: "#f59e0b" },
    { icon: "🎓", text: "Enrollment data submitted for Class 9",       time: "2 days ago", color: "#10b981" },
    { icon: "📋", text: "Asset Management form submitted",             time: "3 days ago", color: "#ef4444" },
  ];

  const quickLinks = [
    { icon: "📋", label: "New Application", path: "/signin", color: "#3b82f6" },
    { icon: "🏫", label: "EMRS Portal",     path: "/signin", color: "#8b5cf6" },
    { icon: "✅", label: "Already Applied", path: "/signin", color: "#10b981" },
    { icon: "📊", label: "View Reports",    path: "/signin", color: "#f59e0b" },
  ];

  /* ── EMRS pins ── */
  const emrsPins = [
  { name: "EMRS Bajali",        district: "Bajali",        students: 320, class: "6–12", status: "Active",  cx: 168, cy: 155 },
  { name: "EMRS Baksa",         district: "Baksa",         students: 295, class: "6–12", status: "Active",  cx: 210, cy: 148 },
  { name: "EMRS Dhemaji",       district: "Dhemaji",       students: 340, class: "6–12", status: "Active",  cx: 548, cy: 125 },
  { name: "EMRS Karbi Anglong", district: "Karbi Anglong", students: 410, class: "6–12", status: "Active",  cx: 400, cy: 222 },
  { name: "EMRS Dima Hasao",    district: "Dima Hasao",    students: 275, class: "6–10", status: "Active",  cx: 448, cy: 252 },
];
  /* ── Asset pins ── */
  const assetTypeColor = { infra: "#f59e0b", road: "#10b981", building: "#8b5cf6" };
  const assetTypeLabel = { infra: "Infrastructure", road: "Road Project", building: "Building" };
  const assetTypeEmoji = { infra: "🏗️", road: "🛣️", building: "🏛️" };
  const assetPins = [
    { name: "Kamrup Asset Hub",        district: "Kamrup",    type: "infra",    value: "₹4.2Cr", status: "Active",      cx: 192, cy: 178 },
    { name: "Tezpur Road Project",     district: "Sonitpur",  type: "road",     value: "₹2.8Cr", status: "In Progress", cx: 298, cy: 132 },
    { name: "Jorhat Infra Store",      district: "Jorhat",    type: "infra",    value: "₹3.1Cr", status: "Active",      cx: 432, cy: 150 },
    { name: "Dibrugarh Warehouse",     district: "Dibrugarh", type: "building", value: "₹5.6Cr", status: "Active",      cx: 508, cy: 158 },
    { name: "Nagaon Construction",     district: "Nagaon",    type: "building", value: "₹1.9Cr", status: "In Progress", cx: 352, cy: 188 },
    { name: "Barpeta Road Network",    district: "Barpeta",   type: "road",     value: "₹2.2Cr", status: "Active",      cx: 148, cy: 150 },
    { name: "Cachar Asset Depot",      district: "Cachar",    type: "infra",    value: "₹3.4Cr", status: "Active",      cx: 382, cy: 298 },
    { name: "Dhubri Bridge Project",   district: "Dhubri",    type: "road",     value: "₹6.0Cr", status: "Planned",     cx: 108, cy: 202 },
    { name: "Sivasagar Heritage Site", district: "Sivasagar", type: "building", value: "₹4.8Cr", status: "Active",      cx: 472, cy: 162 },
    { name: "Kokrajhar Dev Store",     district: "Kokrajhar", type: "infra",    value: "₹1.5Cr", status: "Active",      cx: 122, cy: 162 },
  ];

  const statusColor = s => s === "Active" ? "#34d399" : s === "In Progress" ? "#f59e0b" : "#8b5cf6";
  const ttx = cx => cx + 18 > 510 ? cx - 178 : cx + 18;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

      {/* ── TOP STRIP ── */}
      <div style={{ background: "linear-gradient(90deg,#1e3a8a,#1d4ed8)", color: "rgba(255,255,255,0.85)", fontSize: 12, padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "2px 10px" }}>🇮🇳 Government of Assam</span>
          <span style={{ opacity: 0.5 }}>|</span>
          Directorate of Tribal Affairs (Plain)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
          <span>📅 {time.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>🕐 {time.toLocaleTimeString("en-IN")}</span>
        </span>
      </div>

      {/* ── NAVBAR ── */}
      <header style={{ background: scrolled ? "rgba(15,23,42,0.97)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", padding: "16px 40px", position: "sticky", top: 0, zIndex: 100, boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#c8a84b,#f0d060)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛️</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#c8a84b", fontWeight: 700, textTransform: "uppercase" }}>Assam EMRS</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>EMRS & Asset Management System</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {["Home","About","Portals","Contact"].map(item => (
            <button key={item} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color="#fff"; e.target.style.background="rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.target.style.color="rgba(255,255,255,0.7)"; e.target.style.background="transparent"; }}>
              {item}
            </button>
          ))}
          <button onClick={() => navigate("/signin")} style={{ background: "linear-gradient(135deg,#c8a84b,#e8c55b)", color: "#1a1a1a", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform="translateY(0)"}>
            🔐 Login
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", padding: "100px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.15),transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.12),transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.3)", color: "#c8a84b", padding: "8px 20px", borderRadius: 50, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a84b", display: "inline-block" }} />
            Digital India Initiative — Govt. of Assam
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5 }}>
            Empowering Tribal Education<br />
            <span style={{ background: "linear-gradient(90deg,#c8a84b,#f0d060,#c8a84b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Through Digital Governance</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.8 }}>
            A unified platform for managing Eklavya Model Residential Schools and Government Assets — bringing transparency, efficiency, and accountability.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/signin")} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
              🏫 Access EMRS Portal
            </button>
            <button onClick={() => navigate("/signin")} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>
              🏗️ Asset Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#0f172a", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", transform: "translateY(-40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: "32px 24px", textAlign: "center", background: "#1e293b", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background="#1e3a5f"}
              onMouseLeave={e => e.currentTarget.style.background="#1e293b"}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}{stat.suffix}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section style={{ padding: "0 40px 60px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {quickLinks.map((link, i) => (
            <button key={i} onClick={() => navigate(link.path)} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${link.color}40`, color: "#fff", padding: "12px 24px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background=`${link.color}20`; e.currentTarget.style.borderColor=link.color; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor=`${link.color}40`; e.currentTarget.style.transform="translateY(0)"; }}>
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── PORTAL CARDS ── */}
      <section style={{ padding: "60px 40px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c8a84b", fontWeight: 700, marginBottom: 12 }}>Our Portals</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Choose Your Portal</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Two powerful portals designed for efficient management</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 28 }}>
            {portals.map((portal, i) => (
              <div key={i} onMouseEnter={() => setActivePortal(i)} onMouseLeave={() => setActivePortal(null)}
                style={{ background: "#1e293b", border: `1px solid ${activePortal===i ? portal.accent+"60" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, overflow: "hidden", boxShadow: activePortal===i ? `0 20px 60px ${portal.glowColor}` : "0 4px 20px rgba(0,0,0,0.3)", transition: "all 0.3s ease", transform: activePortal===i ? "translateY(-8px)" : "translateY(0)" }}>
                <div style={{ background: portal.gradient, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                    <div>
                      <div style={{ fontSize: 52, marginBottom: 14 }}>{portal.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{portal.title}</div>
                      <div style={{ fontSize: 12, color: portal.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{portal.subtitle}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{portal.badge}</div>
                  </div>
                </div>
                <div style={{ padding: "28px 32px" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>{portal.description}</p>
                  <div style={{ marginBottom: 28 }}>
                    {portal.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: fi < portal.features.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <span style={{ fontSize: 16 }}>{f.icon}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{f.text}</span>
                        <span style={{ marginLeft: "auto", color: portal.accent, fontSize: 12 }}>→</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(portal.path)} style={{ width: "100%", background: portal.gradient, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}>
                    Access Portal →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ── TWO SEPARATE ASSAM MAPS ──
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "60px 40px", background: "#0a1628" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c8a84b", fontWeight: 700, marginBottom: 10 }}>Geographic Distribution</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Locations Across Assam</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
              Two separate maps — EMRS school locations and asset sites. Click any pin for details.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>

            {/* ══ MAP 1 — EMRS SCHOOLS ══ */}
            <div style={{ background: "#1e293b", borderRadius: 20, border: "1px solid rgba(59,130,246,0.25)", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>🏫 EMRS School Locations</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Eklavya Model Residential Schools across Assam</div>
                </div>
                {/* Inside the EMRS map header */}
<div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
  {emrsPins.length} Schools
</div>              </div>

              {/* Map */}
              <div style={{ padding: "16px 16px 4px" }}>
                <AssamMapBase accentColor="#3b82f6">
                  {emrsPins.map((pin, i) => {
                    const isSel = selectedEmrs === i;
                    const tx    = ttx(pin.cx);
                    return (
                      <g key={i}>
                        <MapPin cx={pin.cx} cy={pin.cy} color="#3b82f6" isSelected={isSel} onClick={() => setSelectedEmrs(isSel ? null : i)} />
                        <text x={pin.cx} y={pin.cy + 22} fill="rgba(255,255,255,0.28)" fontSize="7.5" textAnchor="middle">{pin.district}</text>
                        {isSel && (
                          <g>
                            <rect x={tx} y={pin.cy-50} width="162" height="74" rx="7" fill="#0c1a2e" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.85" />
                            <text x={tx+10} y={pin.cy-32} fill="#fff"                    fontSize="10.5" fontWeight="700">{pin.name}</text>
                            <text x={tx+10} y={pin.cy-18} fill="rgba(255,255,255,0.5)"  fontSize="9">📍 {pin.district}</text>
                            <text x={tx+10} y={pin.cy-5}  fill="rgba(255,255,255,0.5)"  fontSize="9">🎓 {pin.students} students</text>
                            <text x={tx+10} y={pin.cy+9}  fill="rgba(255,255,255,0.5)"  fontSize="9">📚 Class {pin.class}</text>
                            <text x={tx+10} y={pin.cy+22} fill={statusColor(pin.status)} fontSize="9" fontWeight="700">{pin.status}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </AssamMapBase>
                {selectedEmrs !== null && (
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 5 }}>Click pin again to close</div>
                )}
              </div>

              {/* School list */}
              <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 5, maxHeight: 230, overflowY: "auto" }}>
                {emrsPins.map((pin, i) => (
                  <div key={i} onClick={() => setSelectedEmrs(selectedEmrs===i ? null : i)}
                    style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 9, cursor: "pointer", transition: "all 0.15s",
                      background: selectedEmrs===i ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedEmrs===i ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.05)"}`,
                      borderLeft: `3px solid ${selectedEmrs===i ? "#3b82f6" : "transparent"}`,
                    }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(59,130,246,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🏫</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.name}</div>
                      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.38)" }}>{pin.district} · {pin.students} students</div>
                    </div>
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${statusColor(pin.status)}15`, color: statusColor(pin.status), border: `1px solid ${statusColor(pin.status)}30`, fontWeight: 600, whiteSpace: "nowrap" }}>{pin.status}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ margin: "0 14px 14px", background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.14)", borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-around" }}>
                {[
                  { label: "Active",  count: 5,  color: "#34d399" },
                  { label: "Planned", count: 17, color: "#8b5cf6" },
                  { label: "Total",   count: 17,                                 color: "#3b82f6" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ MAP 2 — ASSET LOCATIONS ══ */}
            <div style={{ background: "#1e293b", borderRadius: 20, border: "1px solid rgba(5,150,105,0.25)", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg,#064e3b,#059669)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>🏗️ Asset Site Locations</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Infrastructure, roads & buildings tracked across Assam</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{assetPins.length} Assets</div>
              </div>

              {/* Legend */}
              <div style={{ padding: "10px 16px 2px", display: "flex", gap: 14 }}>
                {Object.entries(assetTypeLabel).map(([type, label]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.42)" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: assetTypeColor[type] }} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Map */}
              <div style={{ padding: "8px 16px 4px" }}>
                <AssamMapBase accentColor="#059669">
                  {assetPins.map((pin, i) => {
                    const isSel = selectedAsset === i;
                    const col   = assetTypeColor[pin.type];
                    const tx    = ttx(pin.cx);
                    return (
                      <g key={i}>
                        <MapPin cx={pin.cx} cy={pin.cy} color={col} isSelected={isSel} onClick={() => setSelectedAsset(isSel ? null : i)} />
                        <text x={pin.cx} y={pin.cy + 22} fill="rgba(255,255,255,0.28)" fontSize="7.5" textAnchor="middle">{pin.district}</text>
                        {isSel && (
                          <g>
                            <rect x={tx} y={pin.cy-50} width="168" height="74" rx="7" fill="#0c1a2e" stroke={col} strokeWidth="1.2" strokeOpacity="0.85" />
                            <text x={tx+10} y={pin.cy-32} fill="#fff"                    fontSize="10.5" fontWeight="700">{pin.name}</text>
                            <text x={tx+10} y={pin.cy-18} fill="rgba(255,255,255,0.5)"  fontSize="9">📍 {pin.district}</text>
                            <text x={tx+10} y={pin.cy-5}  fill="rgba(255,255,255,0.5)"  fontSize="9">💰 Value: {pin.value}</text>
                            <text x={tx+10} y={pin.cy+9}  fill={col}                    fontSize="9">{assetTypeLabel[pin.type]}</text>
                            <text x={tx+10} y={pin.cy+22} fill={statusColor(pin.status)} fontSize="9" fontWeight="700">{pin.status}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </AssamMapBase>
                {selectedAsset !== null && (
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 5 }}>Click pin again to close</div>
                )}
              </div>

              {/* Asset list */}
              <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 5, maxHeight: 230, overflowY: "auto" }}>
                {assetPins.map((pin, i) => {
                  const col = assetTypeColor[pin.type];
                  return (
                    <div key={i} onClick={() => setSelectedAsset(selectedAsset===i ? null : i)}
                      style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 9, cursor: "pointer", transition: "all 0.15s",
                        background: selectedAsset===i ? `${col}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${selectedAsset===i ? col+"50" : "rgba(255,255,255,0.05)"}`,
                        borderLeft: `3px solid ${selectedAsset===i ? col : "transparent"}`,
                      }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${col}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{assetTypeEmoji[pin.type]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.name}</div>
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.38)" }}>{pin.district} · {pin.value}</div>
                      </div>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${statusColor(pin.status)}15`, color: statusColor(pin.status), border: `1px solid ${statusColor(pin.status)}30`, fontWeight: 600, whiteSpace: "nowrap" }}>{pin.status}</span>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div style={{ margin: "0 14px 14px", background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.14)", borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-around" }}>
                {[
                  { label: "Infra",    count: assetPins.filter(p=>p.type==="infra").length,    color: "#f59e0b" },
                  { label: "Road",     count: assetPins.filter(p=>p.type==="road").length,     color: "#10b981" },
                  { label: "Building", count: assetPins.filter(p=>p.type==="building").length, color: "#8b5cf6" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── RECENT ACTIVITY + HOW IT WORKS ── */}
      <section style={{ padding: "60px 40px", background: "#0a1628" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>📊 Recent Activity</h3>
              <span style={{ fontSize: 11, color: "#c8a84b", background: "rgba(200,168,75,0.1)", padding: "4px 12px", borderRadius: 50, fontWeight: 600 }}>LIVE</span>
            </div>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < recentActivities.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${act.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{act.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 28, marginTop: 0 }}>🔄 How It Works</h3>
            {[
              { step: "01", title: "Visit Homepage",  desc: "Access the portal from any device",      icon: "🌐", color: "#3b82f6" },
              { step: "02", title: "Select Portal",   desc: "Choose EMRS or Asset Management",        icon: "🎯", color: "#8b5cf6" },
              { step: "03", title: "Login Securely",  desc: "Enter your credentials to authenticate", icon: "🔐", color: "#f59e0b" },
              { step: "04", title: "Fill & Submit",   desc: "Complete the form and submit data",       icon: "📋", color: "#10b981" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i < 3 ? 20 : 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}20`, border: `1px solid ${item.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: item.color, fontWeight: 700, letterSpacing: 1 }}>STEP {item.step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
                </div>
                {i < 3 && <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060d1a", borderTop: "1px solid rgba(200,168,75,0.3)", padding: "40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#c8a84b,#f0d060)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏛️</div>
              <div>
                <div style={{ fontWeight: 700, color: "#c8a84b", fontSize: 14 }}>EMRS & Asset Management System</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Directorate of Tribal Affairs (Plain)</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy","Terms of Use","Contact Us","Help"].map(link => (
                <button key={link} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.target.style.color="#c8a84b"}
                  onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}>
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>© {new Date().getFullYear()} Government of Assam. All Rights Reserved.</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Designed & Developed by IntelliSight Consultancy Private Limited</div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
