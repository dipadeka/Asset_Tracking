import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EMRSDashboard from "./Dashboard";

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE ASSAM OUTLINE
// Traced from official district maps. ViewBox: 0 0 800 480
// The state sits roughly like a wide horizontal shape, narrow in the west,
// widening eastward, with the Barak Valley corridor hanging south-center-right.
// ─────────────────────────────────────────────────────────────────────────────
const ASSAM_MAIN = `
  M 112,188
  L 118,175 L 126,162 L 132,150 L 136,140 L 140,130
  L 148,122 L 158,114 L 168,108 L 180,104 L 192,100
  L 206,97  L 222,95  L 240,93  L 260,92  L 282,91
  L 306,90  L 332,89  L 358,89  L 384,90  L 408,91
  L 430,93  L 452,96  L 472,100 L 490,105 L 506,111
  L 520,118 L 532,126 L 542,134 L 550,142 L 558,150
  L 564,158 L 570,168 L 574,178 L 578,188 L 580,198
  L 582,210 L 582,222 L 580,234 L 576,244 L 570,254
  L 562,262 L 552,270 L 540,278 L 526,284 L 510,290
  L 492,295 L 474,300 L 456,304 L 438,307 L 420,309
  L 402,311 L 384,312 L 368,311 L 352,310 L 338,307
  L 326,302
  L 322,314 L 318,326 L 316,338 L 316,350 L 318,360
  L 322,368 L 328,374 L 336,378 L 344,380 L 352,378
  L 360,374 L 366,368 L 370,360 L 372,350 L 370,340
  L 366,330 L 362,320 L 358,312
  L 344,310 L 330,308 L 316,304
  L 302,300 L 288,296 L 272,290 L 258,284
  L 244,276 L 230,268 L 216,258 L 204,248
  L 192,236 L 182,224 L 174,212 L 168,200
  L 160,194 L 148,190 L 134,188 Z
`;

// District boundary lines (approximate internal borders for visual depth)
const DISTRICT_LINES = [
  "M 200,95 L 196,190",
  "M 260,92 L 256,200 L 252,290",
  "M 330,89 L 328,210 L 326,302",
  "M 408,91 L 406,200 L 404,309",
  "M 480,98 L 478,205 L 476,300",
  "M 160,108 L 230,150 L 200,190",
  "M 300,90 L 320,150 L 340,210",
  "M 450,95 L 440,170 L 430,245",
  "M 540,130 L 520,200 L 510,270",
  "M 180,200 L 280,195 L 380,198 L 480,196 L 560,200",
  "M 200,250 L 310,248 L 420,252 L 510,258",
];

// Brahmaputra river path (wide, winding through middle)
const BRAHMAPUTRA = `M 118,180 Q 180,168 250,164 Q 330,160 410,163 Q 480,167 545,175 Q 568,178 580,185`;

// Barak river
const BARAK = `M 320,310 Q 340,340 352,370`;

function AssamMap({ activeLayer, emrsPins, assetPins, selectedPin, onPinClick }) {
  const assetTypeColor = { infra: "#f59e0b", road: "#10b981", building: "#8b5cf6" };
  const pins = activeLayer === "emrs"
    ? emrsPins.map((p, i) => ({ ...p, color: "#60a5fa", id: i }))
    : assetPins.map((p, i) => ({ ...p, color: assetTypeColor[p.type] || "#34d399", id: i }));

  const accentColor  = activeLayer === "emrs" ? "#3b82f6" : "#059669";
  const fillColor    = activeLayer === "emrs" ? "rgba(37,99,235,0.10)" : "rgba(5,150,105,0.10)";
  const glowColor    = activeLayer === "emrs" ? "rgba(59,130,246,0.3)" : "rgba(16,185,129,0.3)";

  return (
    <svg
      viewBox="0 0 700 420"
      style={{ width: "100%", height: "auto", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Map background gradient */}
        <radialGradient id="mapBg" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0b1120" />
        </radialGradient>

        {/* Assam fill gradient */}
        <linearGradient id="assamFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={activeLayer === "emrs" ? "#1e3a8a" : "#064e3b"} stopOpacity="0.18" />
          <stop offset="100%" stopColor={activeLayer === "emrs" ? "#2563eb" : "#059669"} stopOpacity="0.06" />
        </linearGradient>

        {/* Glow filter for border */}
        <filter id="borderGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Pin glow */}
        <filter id="pinGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* River blur */}
        <filter id="riverBlur">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>

        {/* Subtle terrain texture pattern */}
        <pattern id="terrain" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.5" fill="rgba(255,255,255,0.04)" />
          <circle cx="30" cy="25" r="0.5" fill="rgba(255,255,255,0.04)" />
          <circle cx="20" cy="35" r="0.5" fill="rgba(255,255,255,0.03)" />
        </pattern>

        {/* Clip path for map bounds */}
        <clipPath id="mapClip">
          <rect x="0" y="0" width="700" height="420" />
        </clipPath>
      </defs>

      {/* ── Background ── */}
      <rect width="700" height="420" fill="url(#mapBg)" />

      {/* Subtle grid */}
      {[70,140,210,280,350,420,490,560,630].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420"
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}
      {[70,140,210,280,350].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="700" y2={y}
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}

      {/* ── Assam shape — terrain texture layer ── */}
      <path d={ASSAM_MAIN} fill="url(#terrain)" clipPath="url(#mapClip)" />

      {/* ── Assam shape — color fill ── */}
      <path d={ASSAM_MAIN} fill="url(#assamFill)" />

      {/* ── Subtle internal district lines ── */}
      {DISTRICT_LINES.map((d, i) => (
        <path key={i} d={d} fill="none"
          stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.12"
          strokeDasharray="4 6" />
      ))}

      {/* ── Assam border — outer glow (wide, soft) ── */}
      <path d={ASSAM_MAIN} fill="none"
        stroke={accentColor} strokeWidth="6" strokeOpacity="0.15"
        filter="url(#borderGlow)" />

      {/* ── Assam border — crisp inner line ── */}
      <path d={ASSAM_MAIN} fill="none"
        stroke={accentColor} strokeWidth="1.8" strokeOpacity="0.75"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* ── Brahmaputra River ── */}
      {/* Wide glow */}
      <path d={BRAHMAPUTRA} fill="none"
        stroke="#1d4ed8" strokeWidth="8" strokeOpacity="0.18"
        strokeLinecap="round" filter="url(#riverBlur)" />
      {/* Main river line */}
      <path d={BRAHMAPUTRA} fill="none"
        stroke="#3b82f6" strokeWidth="3" strokeOpacity="0.45"
        strokeLinecap="round" />
      {/* Highlight shimmer */}
      <path d={BRAHMAPUTRA} fill="none"
        stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.3"
        strokeLinecap="round" strokeDasharray="12 8" />

      {/* ── Barak river ── */}
      <path d={BARAK} fill="none"
        stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.3"
        strokeLinecap="round" />

      {/* ── Labels ── */}
      <text x="350" y="26" fill={accentColor} fontSize="10" textAnchor="middle"
        fontWeight="800" letterSpacing="8" opacity="0.35" fontFamily="'Inter',sans-serif">
        A S S A M
      </text>
      <text x="350" y="178" fill="rgba(147,197,253,0.28)" fontSize="7.5"
        textAnchor="middle" fontStyle="italic" fontFamily="'Inter',sans-serif">
        Brahmaputra
      </text>
      <text x="338" y="348" fill="rgba(147,197,253,0.22)" fontSize="6.5"
        textAnchor="middle" fontStyle="italic" fontFamily="'Inter',sans-serif">
        Barak Valley
      </text>

      {/* ── Compass rose (top-right) ── */}
      <g transform="translate(655,38)" opacity="0.3">
        <circle cx="0" cy="0" r="14" fill="none" stroke={accentColor} strokeWidth="0.8" />
        <text x="0" y="-18" textAnchor="middle" fill={accentColor} fontSize="7" fontWeight="700">N</text>
        <polygon points="0,-10 2,-2 0,4 -2,-2" fill={accentColor} opacity="0.7" />
        <polygon points="0,10 2,2 0,-4 -2,2" fill={accentColor} opacity="0.3" />
      </g>

      {/* ── Scale bar ── */}
      <g transform="translate(48,398)" opacity="0.3">
        <line x1="0" y1="0" x2="60" y2="0" stroke={accentColor} strokeWidth="1.2" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={accentColor} strokeWidth="1" />
        <line x1="60" y1="-4" x2="60" y2="4" stroke={accentColor} strokeWidth="1" />
        <text x="30" y="-7" textAnchor="middle" fill={accentColor} fontSize="6">100 km</text>
      </g>

      {/* ── Pins ── */}
      {pins.map((pin) => {
        const isSel = selectedPin === pin.id;
        return (
          <g key={pin.id} style={{ cursor: "pointer" }} onClick={() => onPinClick(pin.id)}>
            {/* Outer pulse ring */}
            <circle cx={pin.cx} cy={pin.cy}
              r={isSel ? 22 : 15}
              fill={`${pin.color}15`}
              stroke={pin.color}
              strokeWidth={isSel ? 1.8 : 1}
              strokeOpacity={isSel ? 0.9 : 0.5} />

            {/* Mid ring on selected */}
            {isSel && (
              <circle cx={pin.cx} cy={pin.cy} r="13"
                fill="none" stroke={pin.color}
                strokeWidth="1" strokeOpacity="0.4"
                strokeDasharray="3 3" />
            )}

            {/* Pin body — teardrop shape */}
            <ellipse cx={pin.cx} cy={pin.cy - 2} rx="6" ry="7"
              fill={pin.color} filter="url(#pinGlow)"
              opacity={isSel ? 1 : 0.85} />
            <polygon
              points={`${pin.cx - 3},${pin.cy + 4} ${pin.cx + 3},${pin.cy + 4} ${pin.cx},${pin.cy + 10}`}
              fill={pin.color} opacity={isSel ? 1 : 0.85}
              filter="url(#pinGlow)" />

            {/* White dot inside pin */}
            <circle cx={pin.cx} cy={pin.cy - 2} r="2"
              fill="rgba(255,255,255,0.85)" />

            {/* District label */}
            <text x={pin.cx} y={pin.cy + 22}
              fill="rgba(255,255,255,0.5)" fontSize="7"
              textAnchor="middle" fontFamily="'Inter',sans-serif"
              fontWeight={isSel ? "700" : "400"}>
              {pin.district}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled]         = useState(false);
  const [time, setTime]                 = useState(new Date());
  const [activePortal, setActivePortal] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [counters, setCounters]         = useState({ schools: 0, students: 0, assets: 0, districts: 0 });
  const [mapLayer, setMapLayer]         = useState("emrs");
  const [selectedPin, setSelectedPin]   = useState(null);

  useEffect(() => {
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
      clearInterval(counterTimer);
    };
  }, []);

  const stats = [
    { label: "EMRS Schools",      value: counters.schools,   suffix: "",  icon: "🏫", color: "#3b82f6" },
    { label: "Students Enrolled", value: counters.students,  suffix: "+", icon: "🎓", color: "#8b5cf6" },
    { label: "Assets Tracked",    value: counters.assets,    suffix: "+", icon: "🏗️", color: "#f59e0b" },
    { label: "Districts Covered", value: counters.districts, suffix: "+", icon: "🗺️", color: "#10b981" },
  ];

  const navItems = ["Home", "About", "Portals", "Dashboard", "Contact"];
  const handleNavClick = (item) => {
    if (item === "Dashboard") { setShowDashboard(true);  window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (item === "Home")      { setShowDashboard(false); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setShowDashboard(false);
  };

  const portals = [
    {
      title: "EMRS Management", subtitle: "Eklavya Model Residential School",
      description: "Manage school details, infrastructure, student enrollment, staff records, hostel administration, and operational data.",
      icon: "🏫", gradient: "linear-gradient(135deg,#1e3a8a,#2563eb)", accent: "#60a5fa", glowColor: "rgba(37,99,235,0.3)",
      features: [
        { icon: "🏫", text: "School & Location Details" }, { icon: "🎓", text: "Student Enrollment" },
        { icon: "👨‍🏫", text: "Staff Management" },         { icon: "🏠", text: "Hostel Administration" },
        { icon: "🏗️", text: "Construction Status" },
      ],
      path: "/emrs/login", badge: "17 Schools",
    },
    {
      title: "Asset Management", subtitle: "Infrastructure & Project Tracking",
      description: "Track government assets, monitor construction projects, record financial details, and maintain comprehensive asset lifecycle.",
      icon: "🏗️", gradient: "linear-gradient(135deg,#064e3b,#059669)", accent: "#34d399", glowColor: "rgba(5,150,105,0.3)",
      features: [
        { icon: "📊", text: "Project Details" },   { icon: "🏛️", text: "Asset Tracking" },
        { icon: "💰", text: "Financial Records" }, { icon: "🔨", text: "Construction Status" },
        { icon: "📍", text: "GPS Location Tagging" },
      ],
      path: "/asset/login", badge: "50+ Assets",
    },
  ];

  const recentActivities = [
    { icon: "🏫", text: "EMRS Kampur updated infrastructure details",  time: "2 hrs ago",  color: "#3b82f6" },
    { icon: "👨‍🏫", text: "Staff records added for EMRS Jorhat",        time: "5 hrs ago",  color: "#8b5cf6" },
    { icon: "🏗️", text: "Construction status updated — Block A",        time: "1 day ago",  color: "#f59e0b" },
    { icon: "🎓", text: "Enrollment data submitted for Class 9",         time: "2 days ago", color: "#10b981" },
    { icon: "📋", text: "Asset Management form submitted",               time: "3 days ago", color: "#ef4444" },
  ];

  const quickLinks = [
    { icon: "📋", label: "New Application", path: "/asset/login", color: "#3b82f6" },
    { icon: "🏫", label: "EMRS Portal",     path: "/emrs/login",  color: "#8b5cf6" },
    { icon: "✅", label: "Already Applied", path: "/asset/login", color: "#10b981" },
    { icon: "📊", label: "View Reports",    path: "/asset/login", color: "#f59e0b" },
  ];

  // ── Pins repositioned to match the corrected viewBox (700×420) ──
  // The state occupies roughly x:112–582, y:89–380
  const emrsPins = [
    { name: "EMRS Bajali",        district: "Bajali",       students: 320, classes: "6–12", status: "Active",  principal: "Mr. R. Basumatary", cx: 200, cy: 175 },
    { name: "EMRS Baksa",         district: "Baksa",        students: 295, classes: "6–12", status: "Active",  principal: "Ms. P. Devi",        cx: 248, cy: 162 },
    { name: "EMRS Dhemaji",       district: "Dhemaji",      students: 340, classes: "6–12", status: "Active",  principal: "Mr. A. Gogoi",       cx: 560, cy: 128 },
    { name: "EMRS Karbi Anglong", district: "Karbi Anglong",students: 410, classes: "6–12", status: "Active",  principal: "Dr. S. Terang",      cx: 435, cy: 235 },
    { name: "EMRS Dima Hasao",    district: "Dima Hasao",   students: 275, classes: "6–10", status: "Active",  principal: "Mr. K. Hmar",        cx: 472, cy: 268 },
    { name: "EMRS Kamrup",        district: "Kamrup",       students: 380, classes: "6–12", status: "Active",  principal: "Ms. N. Das",         cx: 285, cy: 185 },
    { name: "EMRS Jorhat",        district: "Jorhat",       students: 350, classes: "6–12", status: "Active",  principal: "Mr. B. Bora",        cx: 490, cy: 162 },
    { name: "EMRS Lakhimpur",     district: "Lakhimpur",    students: 290, classes: "6–12", status: "Active",  principal: "Ms. R. Choudhury",   cx: 510, cy: 128 },
    { name: "EMRS Tinsukia",      district: "Tinsukia",     students: 315, classes: "6–12", status: "Active",  principal: "Mr. D. Phukan",      cx: 562, cy: 155 },
    { name: "EMRS Goalpara",      district: "Goalpara",     students: 260, classes: "6–10", status: "Planned", principal: "TBD",                cx: 164, cy: 195 },
    { name: "EMRS Bongaigaon",    district: "Bongaigaon",   students: 305, classes: "6–12", status: "Active",  principal: "Ms. A. Kalita",      cx: 222, cy: 185 },
    { name: "EMRS Sivasagar",     district: "Sivasagar",    students: 332, classes: "6–12", status: "Active",  principal: "Mr. P. Hazarika",    cx: 530, cy: 158 },
  ];

  const assetTypeColor = { infra: "#f59e0b", road: "#10b981", building: "#8b5cf6" };
  const assetTypeLabel = { infra: "Infrastructure", road: "Road Project", building: "Building" };
  const assetTypeEmoji = { infra: "🏗️", road: "🛣️", building: "🏛️" };

  const assetPins = [
    { name: "Kamrup Asset Hub",      district: "Kamrup",    type: "infra",    value: "₹4.2Cr", status: "Active",      year: 2023, cx: 268, cy: 190 },
    { name: "Tezpur Road Project",   district: "Sonitpur",  type: "road",     value: "₹2.8Cr", status: "In Progress", year: 2024, cx: 365, cy: 148 },
    { name: "Jorhat Infra Store",    district: "Jorhat",    type: "infra",    value: "₹3.1Cr", status: "Active",      year: 2022, cx: 490, cy: 162 },
    { name: "Dibrugarh Warehouse",   district: "Dibrugarh", type: "building", value: "₹5.6Cr", status: "Active",      year: 2021, cx: 548, cy: 158 },
    { name: "Nagaon Construction",   district: "Nagaon",    type: "building", value: "₹1.9Cr", status: "In Progress", year: 2024, cx: 390, cy: 200 },
    { name: "Barpeta Road Network",  district: "Barpeta",   type: "road",     value: "₹2.2Cr", status: "Active",      year: 2023, cx: 210, cy: 172 },
    { name: "Cachar Asset Depot",    district: "Cachar",    type: "infra",    value: "₹3.4Cr", status: "Active",      year: 2022, cx: 345, cy: 355 },
    { name: "Dhubri Bridge Project", district: "Dhubri",    type: "road",     value: "₹6.0Cr", status: "Planned",     year: 2025, cx: 130, cy: 210 },
    { name: "Sivasagar Heritage",    district: "Sivasagar", type: "building", value: "₹4.8Cr", status: "Active",      year: 2020, cx: 528, cy: 162 },
    { name: "Kokrajhar Dev Store",   district: "Kokrajhar", type: "infra",    value: "₹1.5Cr", status: "Active",      year: 2023, cx: 148, cy: 192 },
  ];

  const statusColor = s =>
    s === "Active"      ? "#34d399" :
    s === "In Progress" ? "#f59e0b" : "#8b5cf6";

  const currentPins  = mapLayer === "emrs" ? emrsPins : assetPins;
  const selectedData = selectedPin !== null ? currentPins[selectedPin] : null;

  const handlePinClick    = (id) => setSelectedPin(prev => prev === id ? null : id);
  const handleLayerSwitch = (layer) => { setMapLayer(layer); setSelectedPin(null); };

  // ─── shared button styles ──────────────────────────────────────────────────
  const navBtn = (active) => ({
    background: "transparent", border: "none",
    color: active ? "#fff" : "rgba(255,255,255,0.7)",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, transition: "all 0.2s",
  });

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
          {navItems.map(item => (
            <button key={item} style={navBtn(false)} onClick={() => handleNavClick(item)}
              onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.7)"; e.target.style.background = "transparent"; }}>
              {item}
            </button>
          ))}
          
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
            <span style={{ background: "linear-gradient(90deg,#c8a84b,#f0d060,#c8a84b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Through Digital Governance
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.8 }}>
            A unified platform for managing Eklavya Model Residential Schools and Government Assets — bringing transparency, efficiency, and accountability.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/emrs/login")}
              style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              🏫 Access EMRS Portal
            </button>
            <button onClick={() => navigate("/asset/login")}
              style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              🏗️ Asset Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      {showDashboard && (
        <section style={{ background: "#0b1221", padding: "40px 40px 60px" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>EMRS Dashboard Preview</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", margin: "8px 0 0" }}>Live EMRS analytics appear below.</p>
              </div>
              <button onClick={() => setShowDashboard(false)}
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", fontWeight: 700, cursor: "pointer" }}>
                Close Dashboard
              </button>
            </div>
            <EMRSDashboard />
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      <section style={{ background: "#0f172a", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", transform: "translateY(-40px)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: "32px 24px", textAlign: "center", background: "#1e293b", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1e3a5f"}
              onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}>
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
            <button key={i} onClick={() => navigate(link.path)}
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${link.color}40`, color: "#fff", padding: "12px 24px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${link.color}20`; e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${link.color}40`; e.currentTarget.style.transform = "translateY(0)"; }}>
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
              <div key={i}
                onMouseEnter={() => setActivePortal(i)} onMouseLeave={() => setActivePortal(null)}
                style={{ background: "#1e293b", border: `1px solid ${activePortal === i ? portal.accent + "60" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, overflow: "hidden", boxShadow: activePortal === i ? `0 20px 60px ${portal.glowColor}` : "0 4px 20px rgba(0,0,0,0.3)", transition: "all 0.3s ease", transform: activePortal === i ? "translateY(-8px)" : "translateY(0)" }}>
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
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: fi < portal.features.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <span style={{ fontSize: 16 }}>{f.icon}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{f.text}</span>
                        <span style={{ marginLeft: "auto", color: portal.accent, fontSize: 12 }}>→</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(portal.path)}
                    style={{ width: "100%", background: portal.gradient, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Access Portal →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MAP SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "60px 40px", background: "#0a1628" }}>
        <div style={{ maxWidth: 1260, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c8a84b", fontWeight: 700, marginBottom: 10 }}>Geographic Distribution</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Locations Across Assam</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
              Click any pin on the map to view detailed information
            </p>
          </div>

          {/* Layer toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 4, gap: 4 }}>
              {[
                { key: "emrs",  label: "🏫 EMRS Schools", grad: "linear-gradient(135deg,#1e3a8a,#2563eb)", shadow: "rgba(37,99,235,0.4)" },
                { key: "asset", label: "🏗️ Asset Sites",  grad: "linear-gradient(135deg,#064e3b,#059669)", shadow: "rgba(5,150,105,0.4)" },
              ].map(tab => (
                <button key={tab.key} onClick={() => handleLayerSwitch(tab.key)}
                  style={{
                    padding: "10px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                    fontWeight: 700, fontSize: 14, transition: "all 0.25s",
                    background:  mapLayer === tab.key ? tab.grad    : "transparent",
                    color:       mapLayer === tab.key ? "#fff"       : "rgba(255,255,255,0.45)",
                    boxShadow:   mapLayer === tab.key ? `0 4px 16px ${tab.shadow}` : "none",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map + Detail panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

            {/* ── Map card ── */}
            <div style={{
              background: "#1e293b", borderRadius: 20,
              border: `1px solid ${mapLayer === "emrs" ? "rgba(59,130,246,0.25)" : "rgba(5,150,105,0.25)"}`,
              overflow: "hidden",
              boxShadow: `0 20px 60px ${mapLayer === "emrs" ? "rgba(37,99,235,0.15)" : "rgba(5,150,105,0.15)"}`,
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}>
              {/* Map header */}
              <div style={{
                background: mapLayer === "emrs" ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "linear-gradient(135deg,#064e3b,#059669)",
                padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "background 0.3s",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>
                    {mapLayer === "emrs" ? "🏫 EMRS School Locations" : "🏗️ Asset Site Locations"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                    {mapLayer === "emrs"
                      ? "Eklavya Model Residential Schools across Assam"
                      : "Infrastructure, roads & buildings tracked across Assam"}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {mapLayer === "emrs" ? `${emrsPins.length} Schools` : `${assetPins.length} Assets`}
                </div>
              </div>

              {/* Asset type legend */}
              {mapLayer === "asset" && (
                <div style={{ padding: "10px 20px 0", display: "flex", gap: 20 }}>
                  {Object.entries(assetTypeLabel).map(([type, label]) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: assetTypeColor[type] }} />
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {/* SVG Map */}
              <div style={{ padding: "10px 14px 4px" }}>
                <AssamMap
                  activeLayer={mapLayer}
                  emrsPins={emrsPins}
                  assetPins={assetPins}
                  selectedPin={selectedPin}
                  onPinClick={handlePinClick}
                />
                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "4px 0 4px" }}>
                  Click any pin to view details →
                </p>
              </div>

              {/* Summary bar */}
              <div style={{
                margin: "0 14px 14px",
                background: mapLayer === "emrs" ? "rgba(59,130,246,0.07)" : "rgba(5,150,105,0.07)",
                border: `1px solid ${mapLayer === "emrs" ? "rgba(59,130,246,0.15)" : "rgba(5,150,105,0.15)"}`,
                borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-around",
              }}>
                {(mapLayer === "emrs" ? [
                  { label: "Active",  count: emrsPins.filter(p => p.status === "Active").length,  color: "#34d399" },
                  { label: "Planned", count: emrsPins.filter(p => p.status === "Planned").length, color: "#8b5cf6" },
                  { label: "Total",   count: emrsPins.length,                                      color: "#60a5fa" },
                ] : [
                  { label: "Infra",    count: assetPins.filter(p => p.type === "infra").length,    color: "#f59e0b" },
                  { label: "Road",     count: assetPins.filter(p => p.type === "road").length,      color: "#10b981" },
                  { label: "Building", count: assetPins.filter(p => p.type === "building").length,  color: "#8b5cf6" },
                ]).map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Detail Panel ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {selectedData ? (
                <div style={{
                  background: "#1e293b",
                  border: `2px solid ${mapLayer === "emrs" ? "rgba(59,130,246,0.5)" : "rgba(5,150,105,0.5)"}`,
                  borderRadius: 18, overflow: "hidden",
                  boxShadow: `0 12px 40px ${mapLayer === "emrs" ? "rgba(37,99,235,0.25)" : "rgba(5,150,105,0.25)"}`,
                }}>
                  {/* Card header */}
                  <div style={{
                    background: mapLayer === "emrs" ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "linear-gradient(135deg,#064e3b,#059669)",
                    padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  }}>
                    <div>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>
                        {mapLayer === "emrs" ? "🏫" : assetTypeEmoji[selectedData.type]}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.3 }}>{selectedData.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>📍 {selectedData.district} District</div>
                    </div>
                    <button onClick={() => setSelectedPin(null)}
                      style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      ×
                    </button>
                  </div>

                  <div style={{ padding: "16px 18px" }}>
                    {mapLayer === "emrs" ? (
                      <>
                        {[
                          { icon: "🎓", label: "Students",  value: `${selectedData.students} enrolled` },
                          { icon: "📚", label: "Classes",   value: `Class ${selectedData.classes}` },
                          { icon: "👤", label: "Principal", value: selectedData.principal },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                            <span style={{ fontSize: 15, flexShrink: 0 }}>{row.icon}</span>
                            <div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{row.value}</div>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(selectedData.status) }} />
                          <span style={{ fontSize: 12, color: statusColor(selectedData.status), fontWeight: 700 }}>{selectedData.status}</span>
                        </div>
                        <button onClick={() => navigate("/emrs/login")}
                          style={{ width: "100%", marginTop: 14, padding: "10px", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          Access EMRS Portal →
                        </button>
                      </>
                    ) : (
                      <>
                        {[
                          { icon: assetTypeEmoji[selectedData.type], label: "Type",        value: assetTypeLabel[selectedData.type] },
                          { icon: "💰",                               label: "Asset Value", value: selectedData.value },
                          { icon: "📅",                               label: "Year",        value: selectedData.year },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                            <span style={{ fontSize: 15, flexShrink: 0 }}>{row.icon}</span>
                            <div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{row.value}</div>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(selectedData.status) }} />
                          <span style={{ fontSize: 12, color: statusColor(selectedData.status), fontWeight: 700 }}>{selectedData.status}</span>
                        </div>
                        <button onClick={() => navigate("/asset/login")}
                          style={{ width: "100%", marginTop: 14, padding: "10px", background: "linear-gradient(135deg,#064e3b,#059669)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          Access Asset Portal →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div style={{ background: "#1e293b", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 18, padding: "36px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>{mapLayer === "emrs" ? "🏫" : "🏗️"}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                    Click any pin on the map<br />to view details here
                  </div>
                </div>
              )}

              {/* Mini list */}
              <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>
                  All {mapLayer === "emrs" ? "Schools" : "Assets"}
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {currentPins.map((pin, i) => {
                    const col = mapLayer === "emrs" ? "#3b82f6" : assetTypeColor[pin.type];
                    return (
                      <div key={i} onClick={() => handlePinClick(i)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                          cursor: "pointer", transition: "background 0.15s",
                          background: selectedPin === i ? `${col}12` : "transparent",
                          borderLeft: `3px solid ${selectedPin === i ? col : "transparent"}`,
                          borderBottom: i < currentPins.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        }}
                        onMouseEnter={e => { if (selectedPin !== i) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                        onMouseLeave={e => { if (selectedPin !== i) e.currentTarget.style.background = "transparent"; }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{pin.district}</div>
                        </div>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${statusColor(pin.status)}15`, color: statusColor(pin.status), fontWeight: 600, whiteSpace: "nowrap" }}>
                          {pin.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < recentActivities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
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
              { step: "01", title: "Visit Homepage",  desc: "Access the portal from any device",         icon: "🌐", color: "#3b82f6" },
              { step: "02", title: "Select Portal",   desc: "Choose EMRS or Asset Management",           icon: "🎯", color: "#8b5cf6" },
              { step: "03", title: "Login Securely",  desc: "Enter your credentials to authenticate",    icon: "🔐", color: "#f59e0b" },
              { step: "04", title: "Fill & Submit",   desc: "Complete the form and submit data",          icon: "📋", color: "#10b981" },
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
              {["Privacy Policy", "Terms of Use", "Contact Us", "Help"].map(link => (
                <button key={link}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.target.style.color = "#c8a84b"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
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