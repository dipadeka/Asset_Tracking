import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const EMRS_PINS = [
  { name: "EMRS Dalbari, Barama", district: "Baksa", students: 220, cap: 300, classes: "6–12", status: "Active", principal: "Mr. R. Basumatary", lat: 26.4500, lng: 90.8500 },
  { name: "EMRS Jalah, Vill. Daodhara", district: "Baksa", students: 300, cap: 340, classes: "6–12", status: "Active", principal: "Mr. K. Boro", lat: 26.4600, lng: 90.8600 },
  { name: "EMRS Sarupeta, Vill Tatikuchi", district: "Baksa", students: 300, cap: 320, classes: "6–12", status: "Active", principal: "Mr. I. Narzary", lat: 26.4400, lng: 90.8400 },
  { name: "EMRS Kharadhara", district: "Bajali", students: 295, cap: 320, classes: "6–12", status: "Active", principal: "Ms. P. Devi", lat: 26.6700, lng: 91.1800 },
  { name: "EMRS Bedlangmari", district: "Kokrajhar", students: 340, cap: 380, classes: "6–12", status: "Active", principal: "Mr. A. Gogoi", lat: 26.4000, lng: 90.2600 },
  { name: "EMRS Howraghat", district: "Karbi Anglong", students: 410, cap: 450, classes: "6–12", status: "Active", principal: "Dr. S. Terang", lat: 26.0900, lng: 93.3000 },
  { name: "EMRS Phuloni, Donghap", district: "Karbi Anglong", students: 275, cap: 300, classes: "6–10", status: "Active", principal: "Mr. K. Hmar", lat: 25.3000, lng: 92.8000 },
  { name: "EMRS Silonijan, Thengkur Terang", district: "Karbi Anglong", students: 380, cap: 400, classes: "6–12", status: "Active", principal: "Ms. N. Das", lat: 26.1700, lng: 91.7700 },
  { name: "EMRS Donka, Taralangsho", district: "West Karbi Anglong", students: 350, cap: 400, classes: "6–12", status: "Active", principal: "Mr. B. Bora", lat: 26.7500, lng: 94.2000 },
  { name: "EMRS Jonai, Purana Jhelom", district: "Dhemaji", students: 290, cap: 320, classes: "6–12", status: "Active", principal: "Ms. R. Choudhury", lat: 27.2300, lng: 94.1100 },
  { name: "EMRS Haflong, Ardaopur", district: "Dima Hasao", students: 315, cap: 350, classes: "6–12", status: "Active", principal: "Mr. D. Phukan", lat: 27.4900, lng: 95.3500 },
  { name: "EMRS Umrangso", district: "Dima Hasao", students: 260, cap: 300, classes: "6–10", status: "Planned", principal: "TBD", lat: 26.1700, lng: 90.6200 },
  { name: "EMRS Harangajao", district: "Dima Hasao", students: 305, cap: 340, classes: "6–12", status: "Active", principal: "Ms. A. Kalita", lat: 25.0974, lng: 93.0000 },
  { name: "EMRS Diyungbra", district: "Dima Hasao", students: 332, cap: 360, classes: "6–12", status: "Active", principal: "Mr. P. Hazarika", lat: 25.6271, lng: 92.9165 },
  { name: "EMRS Boko", district: "Kamrup", students: 332, cap: 345, classes: "6–12", status: "Active", principal: "Mr. P. Hazarika", lat: 25.9594, lng: 91.2040 },
  { name: "EMRS Dudhnoi, Jakhuwapara", district: "Goalpara", students: 332, cap: 360, classes: "6–12", status: "Active", principal: "Mr. P. Hazarika", lat: 25.9500, lng: 90.9010 },
  { name: "EMRS Khairabari, Malmura", district: "Udalguri", students: 332, cap: 380, classes: "6–12", status: "Active", principal: "Mr. P. Hazarika", lat: 26.6400, lng: 91.7500 },
];

const ASSET_PINS = [
  { name: "Kamrup Asset Hub", district: "Kamrup", type: "infra", value: "₹4.2Cr", status: "Active", year: 2023, lat: 26.1700, lng: 91.7700 },
  { name: "Tezpur Road Project", district: "Sonitpur", type: "road", value: "₹2.8Cr", status: "In Progress", year: 2024, lat: 26.6300, lng: 92.7900 },
  { name: "Jorhat Infra Store", district: "Jorhat", type: "infra", value: "₹3.1Cr", status: "Active", year: 2022, lat: 26.7500, lng: 94.2000 },
  { name: "Dibrugarh Warehouse", district: "Dibrugarh", type: "building", value: "₹5.6Cr", status: "Active", year: 2021, lat: 27.4800, lng: 94.9100 },
  { name: "Nagaon Construction", district: "Nagaon", type: "building", value: "₹1.9Cr", status: "In Progress", year: 2024, lat: 26.3500, lng: 92.6900 },
  { name: "Barpeta Road Network", district: "Barpeta", type: "road", value: "₹2.2Cr", status: "Active", year: 2023, lat: 26.3200, lng: 91.0000 },
  { name: "Cachar Asset Depot", district: "Cachar", type: "infra", value: "₹3.4Cr", status: "Active", year: 2022, lat: 24.8200, lng: 92.7800 },
  { name: "Dhubri Bridge Project", district: "Dhubri", type: "road", value: "₹6.0Cr", status: "Planned", year: 2025, lat: 26.0200, lng: 89.9800 },
  { name: "Sivasagar Heritage", district: "Sivasagar", type: "building", value: "₹4.8Cr", status: "Active", year: 2020, lat: 26.9800, lng: 94.6400 },
  { name: "Kokrajhar Dev Store", district: "Kokrajhar", type: "infra", value: "₹1.5Cr", status: "Active", year: 2023, lat: 26.4000, lng: 90.2700 },
];

const STAFF_DATA = [
  { name: "Mr. R. Basumatary", school: "EMRS Dalbari", desig: "Principal", subject: "General", exp: "14 yrs", status: "Active" },
  { name: "Ms. P. Devi", school: "EMRS Kharadhara", desig: "Principal", subject: "General", exp: "11 yrs", status: "Active" },
  { name: "Dr. S. Terang", school: "EMRS Howraghat", desig: "Principal", subject: "General", exp: "18 yrs", status: "Active" },
  { name: "Mr. A. Gogoi", school: "EMRS Bedlangmari", desig: "Principal", subject: "General", exp: "9 yrs", status: "Active" },
  { name: "Ms. N. Das", school: "EMRS Silonijan", desig: "Vice Principal", subject: "General", exp: "8 yrs", status: "Active" },
  { name: "Mr. B. Bora", school: "EMRS Donka", desig: "PGT", subject: "Mathematics", exp: "7 yrs", status: "Active" },
  { name: "Ms. R. Choudhury", school: "EMRS Jonai", desig: "PGT", subject: "Science", exp: "6 yrs", status: "Active" },
  { name: "Mr. K. Hmar", school: "EMRS Phuloni", desig: "TGT", subject: "English", exp: "5 yrs", status: "Active" },
  { name: "Ms. A. Kalita", school: "EMRS Harangajao", desig: "TGT", subject: "Social Studies", exp: "4 yrs", status: "On Leave" },
  { name: "Mr. P. Hazarika", school: "EMRS Boko", desig: "PGT", subject: "Physics", exp: "10 yrs", status: "Active" },
  { name: "Ms. L. Timung", school: "EMRS Howraghat", desig: "TGT", subject: "Hindi", exp: "6 yrs", status: "Active" },
  { name: "Mr. D. Basumatary", school: "EMRS Dalbari", desig: "PRT", subject: "Primary", exp: "3 yrs", status: "Active" },
  { name: "Ms. G. Boro", school: "EMRS Bedlangmari", desig: "Admin", subject: "—", exp: "8 yrs", status: "Active" },
  { name: "Mr. H. Narzary", school: "EMRS Jalah", desig: "TGT", subject: "Biology", exp: "5 yrs", status: "Active" },
  { name: "Ms. S. Mech", school: "EMRS Sarupeta", desig: "PGT", subject: "Chemistry", exp: "7 yrs", status: "Active" },
];

const HOSTEL_WARDENS = [
  { boys: "Mr. B. Das", girls: "Ms. P. Kalita", cap: 300, occ: 248 },
  { boys: "Mr. K. Boro", girls: "Ms. L. Devi", cap: 340, occ: 312 },
  { boys: "Mr. N. Baruah", girls: "Ms. G. Gogoi", cap: 320, occ: 290 },
  { boys: "Mr. A. Mech", girls: "Ms. S. Boro", cap: 320, occ: 275 },
  { boys: "Mr. P. Bodo", girls: "Ms. R. Nath", cap: 380, occ: 350 },
  { boys: "Mr. S. Terang", girls: "Ms. D. Engti", cap: 450, occ: 410 },
  { boys: "Mr. K. Hmar", girls: "Ms. A. Rongpi", cap: 300, occ: 260 },
  { boys: "Mr. B. Timung", girls: "Ms. N. Phukan", cap: 400, occ: 368 },
  { boys: "Mr. R. Kro", girls: "Ms. L. Tisso", cap: 400, occ: 340 },
  { boys: "Mr. D. Pegu", girls: "Ms. T. Doley", cap: 320, occ: 280 },
];

const ATT_RANKING = [96.2, 93.8, 92.1, 91.4, 90.7, 89.3, 88.9, 87.4, 86.1, 85.8, 85.2, 84.9, 83.7, 82.1, 81.4, 79.8, 77.2];

// ── FALLBACK used whenever an image fails to load ──────────────────────────
const FALLBACK_IMG = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500";

const handleImgError = (e) => {
  console.error("Image failed to load:", e.target.src);
  e.target.onerror = null;
  e.target.src = FALLBACK_IMG;
};
// ── FIX: All local /images/ paths replaced with working Unsplash URLs ──────
const HERO_SCROLL_IMAGES = [
  { src: "/images/emrs-kharadhara-building.png",      caption: "EMRS Kharadhara",  sub: "New Campus Building"  },
  { src: "/images/emrs-kharadhara-morning-assembly.png", caption: "EMRS Kharadhara", sub: "Morning Assembly"   },
  { src: "/images/emrs-kharadhara-inauguration.png",  caption: "EMRS Kharadhara",  sub: "Inauguration Day"     },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500", caption: "EMRS Dalbari", sub: "Annual Day" },
  { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500", caption: "EMRS Boko",    sub: "Smart Classroom" },
  { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500", caption: "EMRS Dalbari", sub: "Library" },
  { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500",    caption: "EMRS Bedlangmari", sub: "Hostel Wing" },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=500", caption: "EMRS Howraghat", sub: "Sports Ground" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  brown: "#8b4513",
  brownLight: "#c8781e",
  brownDark: "#2d1a0e",
  cream: "#fdf8f0",
  creamDark: "#fdf3e3",
  purple: "#6b3fa0",
  green: "#2d6a4f",
  gold: "#e8a020",
  muted: "#7a5c3a",
  faint: "#8a6a3a",
  border: "rgba(139,69,19,0.12)",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    Active: { bg: "#e6f4ee", color: T.green },
    "On Leave": { bg: "#fff3e0", color: T.brownLight },
    Planned: { bg: "#f0eafd", color: T.purple },
    "In Progress": { bg: "#fff3e0", color: T.brownLight },
  };
  const s = map[status] || map.Active;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>{status}</span>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 6, background: "rgba(139,69,19,0.1)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color || T.brown, borderRadius: 10, transition: "width 0.6s ease" }} />
    </div>
  );
}

function MetricCard({ icon, label, value, sub, accentColor }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden", borderLeft: `4px solid ${accentColor || T.brown}` }}>
      <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 36, opacity: 0.12 }}>{icon}</div>
      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.faint, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.brownDark, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.faint, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function ChartCard({ title, children, style }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", ...style }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#5a3e28", marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span style={{ display: "inline-block", background: "#fde9d2", color: "#c2530e", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", padding: "5px 12px", borderRadius: 4, marginBottom: 16 }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART LOADER
// ─────────────────────────────────────────────────────────────────────────────
let chartJsLoaded = false;
let chartJsCallbacks = [];

function loadChartJs(cb) {
  if (chartJsLoaded) { cb(); return; }
  chartJsCallbacks.push(cb);
  if (chartJsCallbacks.length > 1) return;
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
  s.onload = () => { chartJsLoaded = true; chartJsCallbacks.forEach(fn => fn()); chartJsCallbacks = []; };
  document.head.appendChild(s);
}

function useChart(ref, config, deps = []) {
  useEffect(() => {
    loadChartJs(() => {
      if (!ref.current) return;
      const existing = ref.current.__chartInstance;
      if (existing) existing.destroy();
      ref.current.__chartInstance = new window.Chart(ref.current, config());
    });
    return () => {
      if (ref.current?.__chartInstance) {
        ref.current.__chartInstance.destroy();
        ref.current.__chartInstance = null;
      }
    };
  }, deps);
}

const baseScales = (yExtra = {}) => ({
  y: { grid: { color: "rgba(139,69,19,0.07)" }, ticks: { color: T.faint, font: { size: 11 } }, ...yExtra },
  x: { grid: { display: false }, ticks: { color: T.faint, font: { size: 11 } } },
});

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TABS
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab() {
  const classRef  = useRef(null);
  const genderRef = useRef(null);
  const attRef    = useRef(null);
  const hostelRef = useRef(null);
  const staffRef  = useRef(null);

  useChart(classRef, () => ({
    type: "bar",
    data: {
      labels: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"],
      datasets: [{ label: "Students", data: [920,850,820,780,740,640,566], backgroundColor: [T.brown,T.brown,T.brown,T.brownLight,T.brownLight,T.purple,T.purple], borderRadius: 5, borderSkipped: false }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales({ beginAtZero: true }) },
  }), []);

  useChart(genderRef, () => ({
    type: "doughnut",
    data: { labels: ["Boys","Girls"], datasets: [{ data: [52,48], backgroundColor: [T.brown,T.gold], borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false } } },
  }), []);

  useChart(attRef, () => ({
    type: "line",
    data: { labels: ["Jan","Feb","Mar","Apr","May","Jun"], datasets: [{ label: "Att %", data: [86,87.5,89,88.2,90.1,88.4], borderColor: T.brown, backgroundColor: "rgba(139,69,19,0.06)", tension: 0.4, fill: true, pointBackgroundColor: T.brown, pointRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales({ min: 80, max: 95 }) },
  }), []);

  const top5 = EMRS_PINS.slice(0, 5);
  useChart(hostelRef, () => ({
    type: "bar",
    data: {
      labels: top5.map(s => s.name.replace("EMRS ","").split(",")[0]),
      datasets: [
        { label: "Capacity", data: top5.map(s => s.cap), backgroundColor: "rgba(139,69,19,0.15)", borderRadius: 4, borderSkipped: false },
        { label: "Occupied", data: top5.map(s => s.students), backgroundColor: T.brown, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales({ beginAtZero: true }) },
  }), []);

  useChart(staffRef, () => ({
    type: "doughnut",
    data: { labels: ["Teaching","Admin","Support"], datasets: [{ data: [228,96,88], backgroundColor: [T.brown,T.brownLight,T.purple], borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { display: false } } },
  }), []);

  const totalEnrolled = EMRS_PINS.reduce((a, s) => a + s.students, 0);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="🏫" label="Total EMRS"      value="17"                        sub="Across 10 districts"      accentColor={T.brown}      />
        <MetricCard icon="🎓" label="Total Students"  value={totalEnrolled.toLocaleString()} sub="Classes 6–12"         accentColor={T.purple}     />
        <MetricCard icon="👨‍🏫" label="Staff Strength" value="412"                       sub="Teaching + non-teaching"  accentColor={T.green}      />
        <MetricCard icon="🏠" label="Hostel Capacity" value="6,200"                     sub="Occupancy: 85.7%"         accentColor={T.brownLight} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Enrollment by class">
          <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            {[{ color: T.brown, label: "Junior (6–8)" },{ color: T.brownLight, label: "Middle (9–10)" },{ color: T.purple, label: "Senior (11–12)" }].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: 180 }}><canvas ref={classRef} /></div>
        </ChartCard>
        <ChartCard title="Student gender split">
          <div style={{ display: "flex", gap: 20, alignItems: "center", height: 200 }}>
            <div style={{ position: "relative", flex: 1, height: "100%" }}><canvas ref={genderRef} /></div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5a3e28", marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.brown, display: "inline-block" }} />Boys — 2,764 (52%)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5a3e28" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: T.gold, display: "inline-block" }} />Girls — 2,552 (48%)
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Attendance trend (2025)"><div style={{ position: "relative", height: 150 }}><canvas ref={attRef} /></div></ChartCard>
        <ChartCard title="Hostel occupancy (top 5)"><div style={{ position: "relative", height: 150 }}><canvas ref={hostelRef} /></div></ChartCard>
        <ChartCard title="Staff composition">
          <div style={{ display: "flex", gap: 12, alignItems: "center", height: 150 }}>
            <div style={{ position: "relative", flex: 1, height: "100%" }}><canvas ref={staffRef} /></div>
            <div style={{ fontSize: 12 }}>
              {[{ color: T.brown, label: "Teaching — 228" },{ color: T.brownLight, label: "Admin — 96" },{ color: T.purple, label: "Support — 88" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#5a3e28" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="School-wise enrollment snapshot">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                {["School","District","Enrolled","Capacity","Fill Rate","Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMRS_PINS.map((s, i) => {
                const rate = Math.round(s.students / s.cap * 100);
                const barColor = rate > 85 ? T.green : rate > 70 ? T.brownLight : "#a32d2d";
                return (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(139,69,19,0.04)` }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: T.brownDark }}>{s.name}</td>
                    <td style={{ padding: "10px 12px", color: T.muted }}>{s.district}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>{s.students}</td>
                    <td style={{ padding: "10px 12px" }}>{s.cap}</td>
                    <td style={{ padding: "10px 12px", minWidth: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1 }}><ProgressBar pct={rate} color={barColor} /></div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: barColor }}>{rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><Badge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  );
}

function EnrollmentTab() {
  const yoyRef    = useRef(null);
  const tribalRef = useRef(null);
  const dropoutRef= useRef(null);

  useChart(yoyRef, () => ({
    type: "bar",
    data: {
      labels: EMRS_PINS.slice(0,6).map(s => s.name.replace("EMRS ","").split(",")[0]),
      datasets: [
        { label: "2022–23", data: [195,265,270,270,310,380], backgroundColor: "rgba(139,69,19,0.18)", borderRadius: 3, borderSkipped: false },
        { label: "2023–24", data: [205,282,285,280,325,395], backgroundColor: "rgba(139,69,19,0.5)",  borderRadius: 3, borderSkipped: false },
        { label: "2024–25", data: [220,300,300,295,340,410], backgroundColor: T.brown,                borderRadius: 3, borderSkipped: false },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...baseScales({ beginAtZero: true }), x: { grid: { display: false }, ticks: { color: T.faint, font: { size: 10 }, maxRotation: 30 } } } },
  }), []);

  useChart(tribalRef, () => ({
    type: "bar",
    data: {
      labels: ["Bodo","Karbi","Mising","Dimasa","Deori","Others"],
      datasets: [{ label: "Students", data: [1480,1220,890,640,420,666], backgroundColor: [T.brown,T.brownLight,T.purple,T.green,"#c8a84b","#a85c3a"], borderRadius: 5, borderSkipped: false }],
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "rgba(139,69,19,0.07)" }, ticks: { color: T.faint, font: { size: 11 } } }, y: { grid: { display: false }, ticks: { color: "#5a3e28", font: { size: 11 } } } } },
  }), []);

  useChart(dropoutRef, () => ({
    type: "line",
    data: {
      labels: ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"],
      datasets: [
        { label: "2024–25", data: [1.2,1.8,2.1,3.4,2.8,4.2,3.1], borderColor: T.brown, backgroundColor: "rgba(139,69,19,0.07)", tension: 0.4, fill: true, pointBackgroundColor: T.brown, pointRadius: 4 },
        { label: "2023–24", data: [1.5,2.2,2.8,4.1,3.5,5.0,4.2], borderColor: "rgba(139,69,19,0.35)", backgroundColor: "transparent", tension: 0.4, borderDash: [4,4], pointRadius: 3, pointBackgroundColor: "rgba(139,69,19,0.4)" },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...baseScales({ min: 0, max: 6, ticks: { color: T.faint, font: { size: 11 }, callback: v => v+"%" } }) } },
  }), []);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="🎓" label="Total Enrolled"    value="5,316" sub="↑ 4.2% vs last year"   accentColor={T.brown}      />
        <MetricCard icon="👧" label="Girl Students"     value="2,552" sub="48% of total"           accentColor={T.purple}     />
        <MetricCard icon="📈" label="New Admissions"    value="920"   sub="Class 6 intake 2024–25" accentColor={T.green}      />
        <MetricCard icon="🏆" label="Highest Enrolment" value="410"  sub="EMRS Howraghat"          accentColor={T.brownLight} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Year-over-year enrollment (top 6 schools)">
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {[{ op: "0.2", label: "2022–23" },{ op: "0.55", label: "2023–24" },{ op: "1", label: "2024–25" }].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: `rgba(139,69,19,${l.op})`, display: "inline-block" }} />{l.label}
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: 200 }}><canvas ref={yoyRef} /></div>
        </ChartCard>
        <ChartCard title="Tribal community breakdown">
          <div style={{ position: "relative", height: 230 }}><canvas ref={tribalRef} /></div>
        </ChartCard>
      </div>
      <ChartCard title="Class-wise dropout rate — current vs previous year">
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}><span style={{ width: 20, height: 2, background: T.brown, display: "inline-block" }} /> 2024–25</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}><span style={{ width: 20, height: 2, background: "rgba(139,69,19,0.4)", display: "inline-block", borderTop: "2px dashed rgba(139,69,19,0.4)" }} /> 2023–24</span>
        </div>
        <div style={{ position: "relative", height: 180 }}><canvas ref={dropoutRef} /></div>
      </ChartCard>
    </>
  );
}

function HostelTab() {
  const occRef = useRef(null);
  const FACILITIES = [
    { name: "Safe Drinking Water",    pct: 100, color: T.green      },
    { name: "Functional Toilets",     pct: 94,  color: T.green      },
    { name: "Solar Power",            pct: 71,  color: T.brownLight },
    { name: "Medical Room",           pct: 88,  color: T.green      },
    { name: "Recreation Room",        pct: 65,  color: T.brownLight },
    { name: "CCTV Coverage",          pct: 59,  color: "#a32d2d"    },
    { name: "Internet Connectivity",  pct: 82,  color: T.green      },
  ];

  useChart(occRef, () => ({
    type: "bar",
    data: {
      labels: EMRS_PINS.slice(0,8).map(s => s.name.replace("EMRS ","").split(",")[0]),
      datasets: [
        { label: "Capacity", data: EMRS_PINS.slice(0,8).map(s => s.cap),      backgroundColor: "rgba(139,69,19,0.12)", borderRadius: 4, borderSkipped: false },
        { label: "Occupied", data: EMRS_PINS.slice(0,8).map(s => s.students), backgroundColor: T.brown,                 borderRadius: 4, borderSkipped: false },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...baseScales({ beginAtZero: true }), x: { grid: { display: false }, ticks: { color: T.faint, font: { size: 10 }, maxRotation: 35 } } } },
  }), []);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="🏠" label="Total Capacity" value="6,200" sub="Across 17 schools"    accentColor={T.brown}      />
        <MetricCard icon="🛏️" label="Occupied Beds"  value="5,316" sub="85.7% occupancy"      accentColor={T.purple}     />
        <MetricCard icon="👦" label="Boys' Hostels"  value="17"    sub="Avg 64% occupancy"    accentColor={T.green}      />
        <MetricCard icon="👧" label="Girls' Hostels" value="17"    sub="Avg 72% occupancy"    accentColor={T.brownLight} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Capacity vs occupancy (top 8 schools)">
          <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "rgba(139,69,19,0.2)", display: "inline-block" }} /> Capacity</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}><span style={{ width: 9, height: 9, borderRadius: 2, background: T.brown, display: "inline-block" }} /> Occupied</span>
          </div>
          <div style={{ position: "relative", height: 240 }}><canvas ref={occRef} /></div>
        </ChartCard>
        <ChartCard title="Facility availability across all schools">
          {FACILITIES.map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: T.brownDark }}>{f.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>{f.pct}%</span>
              </div>
              <ProgressBar pct={f.pct} color={f.color} />
            </div>
          ))}
        </ChartCard>
      </div>
      <ChartCard title="Hostel warden directory">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                {["School","Boys Warden","Girls Warden","Capacity","Occupancy","Fill %"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOSTEL_WARDENS.map((w, i) => {
                const pct = Math.round(w.occ / w.cap * 100);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(139,69,19,0.04)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: 12 }}>{EMRS_PINS[i]?.name.split(",")[0]}</td>
                    <td style={{ padding: "10px 12px" }}>{w.boys}</td>
                    <td style={{ padding: "10px 12px" }}>{w.girls}</td>
                    <td style={{ padding: "10px 12px" }}>{w.cap}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: pct > 85 ? T.green : T.brownLight }}>{w.occ}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                        <div style={{ flex: 1 }}><ProgressBar pct={pct} color={pct > 85 ? T.green : T.brownLight} /></div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: pct > 85 ? T.green : T.brownLight }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  );
}

function StaffTab() {
  const desigRef = useRef(null);
  const qualRef  = useRef(null);
  const [filter, setFilter] = useState({ school: "", role: "" });

  useChart(desigRef, () => ({
    type: "bar",
    data: {
      labels: ["Principal","Vice Principal","PGT","TGT","PRT","Admin","Support"],
      datasets: [{ label: "Count", data: [17,14,84,102,48,64,83], backgroundColor: [T.brown,T.brown,T.brownLight,T.brownLight,T.brownLight,T.purple,T.purple], borderRadius: 4, borderSkipped: false }],
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "rgba(139,69,19,0.07)" }, ticks: { color: T.faint, font: { size: 11 } } }, y: { grid: { display: false }, ticks: { color: "#5a3e28", font: { size: 11 } } } } },
  }), []);

  useChart(qualRef, () => ({
    type: "doughnut",
    data: { labels: ["Ph.D","Post-Graduate","Graduate","Diploma"], datasets: [{ data: [28,183,154,47], backgroundColor: [T.brown,T.brownLight,T.purple,T.green], borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "60%", plugins: { legend: { display: false } } },
  }), []);

  const filtered = STAFF_DATA.filter(s => (!filter.school || s.school.includes(filter.school)) && (!filter.role || s.desig === filter.role));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="👨‍🏫" label="Total Staff"    value="412"  sub="All 17 schools"       accentColor={T.brown}  />
        <MetricCard icon="📚"  label="Teaching Posts" value="228"  sub="192 filled (84%)"     accentColor={T.purple} />
        <MetricCard icon="🧩"  label="Vacant Posts"   value="36"   sub="Under recruitment"    accentColor="#a32d2d"  />
        <MetricCard icon="🎓"  label="Post-Graduate"  value="68%"  sub="Of teaching staff"    accentColor={T.green}  />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Staff by designation"><div style={{ position: "relative", height: 220 }}><canvas ref={desigRef} /></div></ChartCard>
        <ChartCard title="Qualification profile">
          <div style={{ display: "flex", gap: 16, alignItems: "center", height: 220 }}>
            <div style={{ position: "relative", flex: 1, height: "100%" }}><canvas ref={qualRef} /></div>
            <div style={{ fontSize: 12 }}>
              {[{ color: T.brown, label: "Ph.D — 28" },{ color: T.brownLight, label: "Post-Grad — 183" },{ color: T.purple, label: "Graduate — 154" },{ color: T.green, label: "Diploma — 47" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: "#5a3e28" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Staff roster">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <select value={filter.school} onChange={e => setFilter(f => ({ ...f, school: e.target.value }))} style={{ padding: "7px 12px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: "#5a3e28", background: "#fff" }}>
            <option value="">All Schools</option>
            {[...new Set(STAFF_DATA.map(s => s.school))].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))} style={{ padding: "7px 12px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: "#5a3e28", background: "#fff" }}>
            <option value="">All Roles</option>
            {["Principal","Vice Principal","PGT","TGT","PRT","Admin"].map(r => <option key={r}>{r}</option>)}
          </select>
          <span style={{ fontSize: 12, color: T.faint, alignSelf: "center" }}>{filtered.length} records</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                {["Name","School","Designation","Subject","Experience","Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(139,69,19,0.04)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: T.muted }}>{s.school}</td>
                  <td style={{ padding: "10px 12px" }}>{s.desig}</td>
                  <td style={{ padding: "10px 12px" }}>{s.subject}</td>
                  <td style={{ padding: "10px 12px" }}>{s.exp}</td>
                  <td style={{ padding: "10px 12px" }}><Badge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  );
}

function AttendanceTab() {
  const monthlyRef = useRef(null);
  const HEATMAP_COLORS = [
    "#e8e0d0","#2d6a4f","#8b4513","#c8781e","#2d6a4f","#2d6a4f","#e8e0d0",
    "#2d6a4f","#8b4513","#2d6a4f","#c8781e","#2d6a4f","#e8e0d0","#e8e0d0",
    "#2d6a4f","#2d6a4f","#2d6a4f","#8b4513","#2d6a4f","#e8e0d0","#e8e0d0",
    "#c8781e","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#e8e0d0","#e8e0d0",
  ];
  const HEATMAP_TIPS = [
    "Holiday","95%","88%","82%","97%","93%","Holiday",
    "91%","87%","96%","79%","94%","Holiday","Holiday",
    "96%","98%","89%","85%","92%","Holiday","Holiday",
    "78%","95%","90%","88%","96%","Holiday","Holiday",
  ];

  useChart(monthlyRef, () => ({
    type: "line",
    data: {
      labels: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"],
      datasets: [{ label: "Att %", data: [87,88,86,89,91,90,92,88,87,86,87.5,89,88.2,90.1,88.4], borderColor: T.brown, backgroundColor: "rgba(139,69,19,0.06)", tension: 0.4, fill: true, pointBackgroundColor: T.brown, pointRadius: 3 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 82, max: 95, grid: { color: "rgba(139,69,19,0.07)" }, ticks: { color: T.faint, font: { size: 10 }, callback: v => v+"%" } }, x: { grid: { display: false }, ticks: { color: T.faint, font: { size: 10 }, maxRotation: 30 } } } },
  }), []);

  const ranked = EMRS_PINS.map((s, i) => ({ name: s.name, att: ATT_RANKING[i] })).sort((a, b) => b.att - a.att);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="📅" label="Avg Attendance" value="88.4%" sub="June 2025"           accentColor={T.brown}  />
        <MetricCard icon="✅" label="Present Today"  value="4,697" sub="Of 5,316 students"   accentColor={T.green}  />
        <MetricCard icon="⚠️" label="Below 75%"      value="214"   sub="Students flagged"    accentColor="#a32d2d"  />
        <MetricCard icon="🏆" label="Best School"    value="96.2%" sub="EMRS Boko"           accentColor={T.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <ChartCard title="Monthly attendance trend (Apr 2024 – Jun 2025)">
          <div style={{ position: "relative", height: 220 }}><canvas ref={monthlyRef} /></div>
        </ChartCard>
        <ChartCard title="School-wise attendance ranking">
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {ranked.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(139,69,19,0.06)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.faint, minWidth: 22 }}>#{i+1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.brownDark }}>{s.name.replace("EMRS ","").split(",")[0]}</div>
                  <div style={{ marginTop: 4 }}><ProgressBar pct={s.att} color={s.att > 90 ? T.green : s.att > 80 ? T.brownLight : "#a32d2d"} /></div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.att > 90 ? T.green : s.att > 80 ? T.brownLight : "#a32d2d", minWidth: 44, textAlign: "right" }}>{s.att}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Attendance heatmap — June 2025 (EMRS Boko)">
        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
          {[{ color: T.green, label: "95–100%" },{ color: T.brown, label: "80–94%" },{ color: T.brownLight, label: "60–79%" },{ color: "#e8e0d0", label: "Holiday" }].map(l => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#5a3e28" }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, color: T.faint, fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} title={HEATMAP_TIPS[i]} style={{ height: 18, borderRadius: 3, background: c, cursor: "pointer" }} />
          ))}
        </div>
      </ChartCard>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function EMRSDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [year, setYear] = useState("2024–25");
  const tabs = [
    { key: "overview",    label: "Overview",    icon: "📊" },
    { key: "enrollment",  label: "Enrollment",  icon: "🎓" },
    { key: "hostel",      label: "Hostel",      icon: "🏠" },
    { key: "staff",       label: "Staff",       icon: "👨‍🏫" },
    { key: "attendance",  label: "Attendance",  icon: "📅" },
  ];
  return (
    <section style={{ background: T.creamDark, padding: "40px 40px 60px", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 6 }}>Directorate of Tribal Affairs (Plain)</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: T.brownDark }}>EMRS Analytics Dashboard</h2>
            <p style={{ color: T.muted, margin: "6px 0 0", fontSize: 13 }}>Live data across all 17 Eklavya Model Residential Schools</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: "#5a3e28", background: "#fff", cursor: "pointer" }}>
              {["2024–25","2023–24","2022–23"].map(y => <option key={y}>{y}</option>)}
            </select>
            <div style={{ background: "rgba(139,69,19,0.07)", border: `1px solid rgba(139,69,19,0.18)`, borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, color: T.brown }}>Last updated: Jun 2025</div>
            <button onClick={onClose} style={{ background: "rgba(139,69,19,0.07)", color: "#5a3e28", border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✕ Close</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: 5, marginBottom: 28, overflowX: "auto" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, minWidth: 110, padding: "10px 16px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: activeTab === tab.key ? "linear-gradient(135deg,#8b4513,#c8781e)" : "transparent", color: activeTab === tab.key ? "#fff" : T.muted, transition: "all 0.2s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "overview"   && <OverviewTab   />}
        {activeTab === "enrollment" && <EnrollmentTab />}
        {activeTab === "hostel"     && <HostelTab     />}
        {activeTab === "staff"      && <StaffTab      />}
        {activeTab === "attendance" && <AttendanceTab />}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS FLASH TICKER
// ─────────────────────────────────────────────────────────────────────────────
function NewsFlashTicker({ items }) {
  const text = items.join("      •      ");
  return (
    <div style={{ display: "flex", alignItems: "stretch", background: "#2d1a0e", overflow: "hidden" }}>
      <style>{`@keyframes newsFlashMarquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}`}</style>
      <div style={{ background: "linear-gradient(135deg,#c8781e,#e8a020)", color: "#2d1a0e", fontWeight: 800, fontSize: 13, padding: "11px 22px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, letterSpacing: 0.3, whiteSpace: "nowrap" }}>📢 News Flash</div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", whiteSpace: "nowrap", color: "#fdf3e3", fontSize: 13, fontWeight: 500, animation: "newsFlashMarquee 28s linear infinite" }}>{text}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMOSA BORDER
// ─────────────────────────────────────────────────────────────────────────────
function GamosaBorder({ height = 10 }) {
  return (
    <div style={{ height, width: "100%", backgroundImage: `repeating-linear-gradient(-45deg,#a83232 0px,#a83232 ${height}px,#fdf3e3 ${height}px,#fdf3e3 ${height*2}px)`, backgroundSize: `${height*2*1.414}px ${height*2*1.414}px`, flexShrink: 0 }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIBAL MOTIF WATERMARK
// ─────────────────────────────────────────────────────────────────────────────
function TribalMotifWatermark({ style }) {
  return (
    <svg viewBox="0 0 400 400" style={{ position: "absolute", pointerEvents: "none", ...style }} xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.5">
        <path d="M50 220 C50 120 150 60 200 60 C250 60 350 120 350 220 Z" fill="none" stroke="#8b4513" strokeWidth="3" />
        <path d="M90 200 C90 130 160 90 200 90 C240 90 310 130 310 200" fill="none" stroke="#8b4513" strokeWidth="2.5" />
        <path d="M130 185 C130 145 170 120 200 120 C230 120 270 145 270 185" fill="none" stroke="#8b4513" strokeWidth="2" />
        <circle cx="200" cy="70" r="6" fill="#c8781e" />
      </g>
      <g opacity="0.4" transform="translate(0,235)">
        <path d="M70 0 L330 0 L300 40 L100 40 Z" fill="none" stroke="#c8781e" strokeWidth="3" />
        <ellipse cx="200" cy="40" rx="100" ry="14" fill="none" stroke="#c8781e" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO IMAGE STRIP
// ─────────────────────────────────────────────────────────────────────────────
function HeroImageStrip({ images }) {
  const trackItems = [...images, ...images];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto 36px", zIndex: 1 }}>
      <style>{`
        @keyframes heroImageStripScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .hero-image-strip-track { animation: heroImageStripScroll 40s linear infinite; }
        .hero-image-strip-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .hero-image-strip-track { animation: none; } }
      `}</style>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 70, background: "linear-gradient(90deg,#fdf3e3,rgba(253,243,227,0))", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 70, background: "linear-gradient(270deg,#fdf3e3,rgba(253,243,227,0))", zIndex: 2, pointerEvents: "none" }} />
        <div className="hero-image-strip-track" style={{ display: "flex", gap: 16, width: "max-content" }}>
          {trackItems.map((img, i) => (
            <div key={i} style={{ position: "relative", flexShrink: 0, width: 250, height: 156, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(139,69,19,0.2)", boxShadow: "0 6px 22px rgba(139,69,19,0.14)" }}>
              <img
                src={img.src}
                alt={img.caption}
                onError={handleImgError}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(45,26,14,0) 45%,rgba(45,26,14,0.8) 100%)" }} />
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 9 }}>
                <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 700, lineHeight: 1.25 }}>{img.caption}</div>
                <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 10.5, marginTop: 1 }}>{img.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BAR
// ─────────────────────────────────────────────────────────────────────────────
function NotificationBar({ notifications }) {
  const trackRef = useRef(null);
  const [animDuration, setAnimDuration] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      const half = trackRef.current.scrollHeight / 2;
      setAnimDuration(half);
    }
  }, []);

  const half = animDuration;
  const dur  = Math.max(half / 18, 12);

  const itemRow = (notif, key) => (
    <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: `1px solid rgba(139,90,43,0.1)`, borderLeft: `3px solid ${notif.color}`, background: "transparent", transition: "background 0.2s", cursor: "default" }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: `${notif.color}18`, border: `1px solid ${notif.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{notif.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: T.brownDark, fontWeight: 600, lineHeight: 1.4 }}>{notif.title}</div>
        <div style={{ fontSize: 10, color: T.faint, marginTop: 2 }}>{notif.time}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: `1px solid rgba(139,90,43,0.16)`, borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 20px rgba(139,69,19,0.08)", display: "flex", flexDirection: "column", maxHeight: 440 }}>
      <style>{`@keyframes emrsScrollUp{0%{transform:translateY(0)}100%{transform:translateY(-${half}px)}}`}</style>
      <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid rgba(139,90,43,0.1)`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fde9d2", color: "#c2530e", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", padding: "5px 12px", borderRadius: 4 }}>🔔 What's New</span>
        <span style={{ fontSize: 9, background: T.brown, color: "#fff", padding: "2px 9px", borderRadius: 20, fontWeight: 700, letterSpacing: 0.5 }}>LIVE</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 20, background: "linear-gradient(to bottom,#fff,transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 20, background: "linear-gradient(to top,#fff,transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", flexDirection: "column", animation: half > 0 ? `emrsScrollUp ${dur}s linear infinite` : "none" }}>
          {notifications.map((n, i) => itemRow(n, i))}
          {notifications.map((n, i) => itemRow(n, `d${i}`))}
        </div>
      </div>
      <div style={{ padding: "8px 16px", borderTop: `1px solid rgba(139,90,43,0.1)`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fdf8f0", flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: T.faint, fontWeight: 600 }}>{notifications.length} recent updates</span>
        <span style={{ fontSize: 11, color: T.brown, fontWeight: 700, cursor: "pointer" }}>View All →</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function GallerySection() {
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [mediaType,      setMediaType]      = useState("all");
  const [lightbox,       setLightbox]       = useState(null);
  const [uploading,      setUploading]      = useState(false);
  const fileRef = useRef(null);

  // ── FIX: All local /images/ paths replaced with working Unsplash URLs ──
  const galleryData = {
    "EMRS Dalbari, Barama": [
      { type: "photo", src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", caption: "School Building" },
      { type: "photo", src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600", caption: "Library" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", caption: "Inauguration Ceremony" },
    ],
    "EMRS Kharadhara": [
  { type: "photo", src: "/images/emrs-kharadhara-building.png",         caption: "New Campus Building" },
  { type: "photo", src: "/images/emrs-kharadhara-morning-assembly.png", caption: "Morning Assembly"    },
  { type: "photo", src: "/images/emrs-kharadhara-inauguration.png",     caption: "Inauguration Day"    },
  
],
    "EMRS Howraghat": [
      { type: "photo", src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", caption: "Annual Day" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", caption: "Cultural Programme" },
    ],
    "EMRS Bedlangmari":         [{ type: "photo", src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600", caption: "Hostel Wing" }],
    "EMRS Jonai, Purana Jhelom":[{ type: "photo", src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600", caption: "Morning Assembly" }],
    "EMRS Boko": [
      { type: "photo", src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600", caption: "Smart Classroom" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600", caption: "Science Fair 2024" },
    ],
  };

  const allItems  = Object.entries(galleryData).flatMap(([school, items]) => items.map(item => ({ ...item, school })));
  const schools   = ["all", ...Object.keys(galleryData)];
  const filtered  = allItems.filter(item => {
    const schoolOk = selectedSchool === "all" || item.school === selectedSchool;
    const typeOk   = mediaType === "all"      || item.type   === mediaType;
    return schoolOk && typeOk;
  });

  return (
    <section id="gallery" style={{ padding: "70px 40px", background: "#fdf6e9" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 10 }}>Media Archive</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: T.brownDark, margin: "0 0 10px" }}>📸 EMRS Photo & Video Gallery</h2>
          <p style={{ color: T.muted, fontSize: 15, maxWidth: 520, margin: "0 auto 28px" }}>Browse photos and videos from all Eklavya Model Residential Schools across Assam</p>
          <button onClick={() => fileRef.current?.click()} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>⬆️ Upload Media</button>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={() => { setUploading(true); setTimeout(() => setUploading(false), 1500); }} />
          {uploading && <div style={{ color: "#2d6a4f", fontSize: 12, marginTop: 10 }}>✅ Files received — pending admin approval</div>}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, background: "rgba(139,69,19,0.07)", border: `1px solid rgba(139,69,19,0.15)`, borderRadius: 50, padding: "4px 6px" }}>
            {[{ key: "all", label: "🗂 All" },{ key: "photo", label: "📷 Photos" },{ key: "video", label: "🎬 Videos" }].map(t => (
              <button key={t.key} onClick={() => setMediaType(t.key)} style={{ background: mediaType === t.key ? "linear-gradient(135deg,#8b4513,#c8781e)" : "transparent", color: mediaType === t.key ? "#fff" : T.muted, border: "none", padding: "7px 18px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid rgba(139,69,19,0.1)` }}>
          {schools.map(s => (
            <button key={s} onClick={() => setSelectedSchool(s)} style={{ background: selectedSchool === s ? "rgba(139,69,19,0.12)" : "rgba(139,69,19,0.04)", border: `1px solid ${selectedSchool === s ? "rgba(139,69,19,0.5)" : "rgba(139,69,19,0.12)"}`, color: selectedSchool === s ? T.brown : T.muted, padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {s === "all" ? "All Schools" : s}
              {s !== "all" && <span style={{ marginLeft: 6, fontSize: 10, background: selectedSchool === s ? "rgba(139,69,19,0.2)" : "rgba(139,69,19,0.08)", padding: "1px 6px", borderRadius: 20, color: "inherit" }}>{(galleryData[s]||[]).length}</span>}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#b89a78" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
            <div style={{ fontSize: 14 }}>No media found for this filter.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {filtered.map((item, i) => <GalleryCard key={i} item={item} onClick={() => setLightbox(item)} />)}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#b89a78" }}>
          Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}{selectedSchool !== "all" ? ` from ${selectedSchool}` : " across all schools"}
        </div>
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(45,26,14,0.92)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 24, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: 10, cursor: "pointer", fontSize: 20 }}>×</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: "100%" }}>
            {lightbox.type === "photo"
              ? <img src={lightbox.src} alt={lightbox.caption} onError={handleImgError} style={{ width: "100%", borderRadius: 16, maxHeight: "80vh", objectFit: "contain" }} />
              : <video src={lightbox.src} controls autoPlay style={{ width: "100%", borderRadius: 16, maxHeight: "80vh" }} />}
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{lightbox.caption}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4 }}>📍 {lightbox.school}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryCard({ item, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: "#fff", border: `1px solid ${hover ? "rgba(139,69,19,0.4)" : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hover ? "translateY(-4px)" : "translateY(0)", boxShadow: hover ? "0 12px 40px rgba(139,69,19,0.15)" : "0 2px 12px rgba(139,69,19,0.07)", transition: "all 0.25s" }}>
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img
          src={item.type === "video" ? item.thumb : item.src}
          alt={item.caption}
          onError={handleImgError}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hover ? "scale(1.06)" : "scale(1)" }}
        />
        {item.type === "video" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(45,26,14,0.3)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, paddingLeft: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>▶</div>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, background: item.type === "video" ? "rgba(139,69,19,0.88)" : "rgba(200,120,30,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>{item.type === "video" ? "🎬 Video" : "📷 Photo"}</div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.brownDark, marginBottom: 4 }}>{item.caption}</div>
        <div style={{ fontSize: 11, color: T.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {item.school}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OSM MAP
// ─────────────────────────────────────────────────────────────────────────────
function AssamOSMMap({ activeLayer, selectedPin, onPinClick }) {
  const mapRef     = useRef(null);
  const leafletRef = useRef(null);
  const mapObjRef  = useRef(null);
  const markersRef = useRef([]);

  const pins = activeLayer === "emrs"
    ? EMRS_PINS.map((p, i) => ({ ...p, color: T.brown, id: i }))
    : ASSET_PINS.map((p, i) => ({ ...p, color: p.type === "infra" ? T.brownLight : p.type === "road" ? T.green : T.purple, id: i }));

  useEffect(() => {
    const loadLeaflet = () => new Promise(resolve => {
      if (window.L) { resolve(window.L); return; }
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css"; link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve(window.L);
      document.head.appendChild(script);
    });
    loadLeaflet().then(L => {
      leafletRef.current = L;
      if (!mapObjRef.current && mapRef.current) {
        const map = L.map(mapRef.current, { center: [26.2,92.8], zoom: 7, scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, dragging: true });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 18 }).addTo(map);
        mapObjRef.current = map;
      }
    });
    return () => { if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null; } };
  }, []);

  useEffect(() => {
    const L = leafletRef.current; const map = mapObjRef.current;
    if (!L || !map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    pins.forEach(pin => {
      if (!pin.lat || !pin.lng) return;
      const isSelected = selectedPin === pin.id;
      const size = isSelected ? 18 : 13; const ring = isSelected ? 32 : 22;
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:${ring}px;height:${ring}px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:${ring}px;height:${ring}px;border-radius:50%;background:${pin.color}22;border:1.5px solid ${pin.color}99;"></div>
          <div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${pin.color};box-shadow:0 2px 10px ${pin.color}88;border:2px solid rgba(255,255,255,0.8);"></div>
        </div>`,
        iconSize: [ring,ring], iconAnchor: [ring/2,ring],
      });
      const marker = L.marker([pin.lat,pin.lng],{ icon }).addTo(map).on("click",() => onPinClick(pin.id));
      marker.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#2d1a0e">${pin.name}</div><div style="font-size:11px;color:#7a5c3a">📍 ${pin.district}</div>`,
        { direction: "top", offset: [0,-ring], className: "leaflet-emrs-tooltip" }
      );
      markersRef.current.push(marker);
    });
  }, [activeLayer, selectedPin, pins]);

  return (
    <div style={{ position: "relative", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
      <style>{`.leaflet-emrs-tooltip{background:#fffdf7!important;border:1px solid rgba(139,69,19,0.2)!important;border-radius:8px!important;padding:6px 10px!important;box-shadow:0 4px 20px rgba(139,69,19,0.12)!important}.leaflet-emrs-tooltip::before{display:none!important}.leaflet-container{background:#f5ede0!important}`}</style>
      <div ref={mapRef} style={{ width: "100%", height: 460, borderRadius: "0 0 16px 16px" }} />
      {activeLayer === "asset" && (
        <div style={{ position: "absolute", bottom: 36, left: 12, zIndex: 1000, background: "rgba(253,246,233,0.95)", border: `1px solid rgba(139,69,19,0.18)`, borderRadius: 10, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          {[{ color: T.brownLight, label: "Infrastructure" },{ color: T.green, label: "Road Project" },{ color: T.purple, label: "Building" }].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "#5a3e28" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />{label}
            </div>
          ))}
        </div>
      )}
      <div style={{ position: "absolute", bottom: 10, right: 12, zIndex: 1000, fontSize: 10, color: T.faint, background: "rgba(253,246,233,0.85)", padding: "3px 8px", borderRadius: 6 }}>Scroll to zoom · Drag to pan</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE MAIN
// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled,       setScrolled]       = useState(false);
  const [time,           setTime]           = useState(new Date());
  const [activePortal,   setActivePortal]   = useState(null);
  const [showDashboard,  setShowDashboard]  = useState(false);
  const [counters,       setCounters]       = useState({ schools: 0, students: 0, assets: 0, districts: 0 });
  const [mapLayer,       setMapLayer]       = useState("emrs");
  const [selectedPin,    setSelectedPin]    = useState(null);

  const notifications = [
    { icon: "🏫", title: "EMRS Kampur infrastructure data updated",           time: "Just now",  color: T.brown      },
    { icon: "📋", title: "New asset entry submitted — Block A, Jorhat",       time: "5 min ago", color: T.brownLight },
    { icon: "🎓", title: "Enrollment data for Class 9 approved",              time: "20 min ago",color: T.purple     },
    { icon: "👨‍🏫",title: "Staff record added — EMRS Howraghat",              time: "1 hr ago",  color: T.green      },
    { icon: "📸", title: "New photos uploaded — EMRS Boko",                   time: "2 hrs ago", color: "#c8a84b"    },
    { icon: "🏗️", title: "Construction status: EMRS Dalbari Phase 2 complete",time: "3 hrs ago", color: "#a83232"    },
    { icon: "📊", title: "Monthly report generated for all 17 schools",       time: "Yesterday", color: T.brown      },
    { icon: "✅", title: "EMRS Kharadhara audit form verified",               time: "2 days ago",color: T.green      },
    { icon: "📝", title: "New circular issued — EMRS admission 2024–25",      time: "3 days ago",color: T.brownLight },
    { icon: "🏆", title: "EMRS Howraghat wins state science olympiad",        time: "4 days ago",color: T.brown      },
  ];

  const newsFlashItems = [
    "Admission notice 2025–26 for Class 6 now open across all EMRS",
    "Asset audit submission deadline extended to 30th June",
    "EMRS Boko science fair registrations closing soon",
    "Staff recruitment drive — apply through the EMRS Portal",
    "Monthly infrastructure report due by the 5th of every month",
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);
    const targets = { schools: 17, students: 5316, assets: 50, districts: 10 };
    let step = 0;
    const counterTimer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step/60, 3);
      setCounters({ schools: Math.round(targets.schools*ease), students: Math.round(targets.students*ease), assets: Math.round(targets.assets*ease), districts: Math.round(targets.districts*ease) });
      if (step >= 60) clearInterval(counterTimer);
    }, 2000/60);
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(timer); clearInterval(counterTimer); };
  }, []);

  const stats = [
    { label: "EMRS Schools",      value: counters.schools,                   suffix: "",  icon: "🏫", color: T.brown      },
    { label: "Students Enrolled", value: counters.students.toLocaleString(), suffix: "",  icon: "🎓", color: T.purple     },
    { label: "Assets Tracked",    value: counters.assets,                    suffix: "+", icon: "🏗️", color: T.brownLight },
    { label: "Districts Covered", value: counters.districts,                 suffix: "+", icon: "🗺️", color: T.green      },
  ];

  const navItems = ["Home","About","Gallery","Dashboard","Contact"];
  const handleNavClick = item => {
    if (item === "Dashboard") { setShowDashboard(true); setTimeout(() => document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" }), 50); return; }
    if (item === "Home")      { setShowDashboard(false); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (item === "Gallery")   { document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }); return; }
    setShowDashboard(false);
  };

  const portals = [
    {
      title: "EMRS Management", subtitle: "Eklavya Model Residential School",
      description: "Manage school details, infrastructure, student enrollment, staff records, hostel administration, and operational data.",
      icon: "🏫", gradient: "linear-gradient(135deg,#8b4513,#c8781e)", accent: T.brownLight, glowColor: "rgba(139,69,19,0.2)",
      features: [
        { icon: "🏫", text: "School & Location Details" },{ icon: "🎓", text: "Student Enrollment" },
        { icon: "👨‍🏫", text: "Staff Management" },{ icon: "🏠", text: "Hostel Administration" },
        { icon: "🏗️", text: "Construction Status" },
      ],
      path: "/emrs/login", badge: "17 Schools",
    },
    {
      title: "Asset Management", subtitle: "Infrastructure & Project Tracking",
      description: "Track government assets, monitor construction projects, record financial details, and maintain comprehensive asset lifecycle.",
      icon: "🏗️", gradient: "linear-gradient(135deg,#1a3d2e,#2d6a4f)", accent: "#52b788", glowColor: "rgba(45,106,79,0.2)",
      features: [
        { icon: "📊", text: "Project Details" },{ icon: "🏛️", text: "Asset Tracking" },
        { icon: "💰", text: "Financial Records" },{ icon: "🔨", text: "Construction Status" },
        { icon: "📍", text: "GPS Location Tagging" },
      ],
      path: "/asset/login", badge: "50+ Assets",
    },
  ];

  const quickLinks = [
    { icon: "📋", label: "Asset Portal",  path: "/asset/login", color: T.brown      },
    { icon: "🏫", label: "EMRS Portal",   path: "/emrs/login",  color: T.purple     },
    { icon: "📸", label: "Gallery",       path: "#gallery",      color: T.brownLight },
    { icon: "📊", label: "View Reports",  path: "/asset/login", color: T.green      },
  ];

  const assetTypeColor = { infra: T.brownLight, road: T.green, building: T.purple };
  const assetTypeLabel = { infra: "Infrastructure", road: "Road Project", building: "Building" };
  const assetTypeEmoji = { infra: "🏗️", road: "🛣️", building: "🏛️" };
  const statusColor    = s => s === "Active" ? T.green : s === "In Progress" ? T.brownLight : T.purple;

  const currentPins  = mapLayer === "emrs" ? EMRS_PINS : ASSET_PINS;
  const selectedData = selectedPin !== null ? currentPins[selectedPin] : null;
  const handlePinClick    = id    => setSelectedPin(prev => prev === id ? null : id);
  const handleLayerSwitch = layer => { setMapLayer(layer); setSelectedPin(null); };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: T.cream, minHeight: "100vh", color: T.brownDark }}>
      <GamosaBorder height={8} />

      {/* TOP STRIP */}
      <div style={{ background: "linear-gradient(90deg,#8b4513,#a0522d)", color: "rgba(255,255,255,0.9)", fontSize: 12, padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: 4, padding: "2px 10px" }}>🇮🇳 Government of Assam</span>
          <span style={{ opacity: 0.5 }}>|</span>
          Directorate of Tribal Affairs (Plain)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
          <span>📅 {time.toLocaleDateString("en-IN",{ weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>🕐 {time.toLocaleTimeString("en-IN")}</span>
        </span>
      </div>

      {/* NAVBAR */}
      <header style={{ background: scrolled ? "rgba(253,248,240,0.97)" : "rgba(253,248,240,0.85)", backdropFilter: "blur(16px)", padding: "14px 40px", position: "sticky", top: 0, zIndex: 100, boxShadow: scrolled ? "0 2px 20px rgba(139,69,19,0.12)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#8b4513,#c8781e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 3px 12px rgba(139,69,19,0.3)" }}>🏛️</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: T.brown, fontWeight: 700, textTransform: "uppercase" }}>Assam</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5, color: T.brownDark }}>EMRS Management System</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => handleNavClick(item)}
              style={{ background: showDashboard && item==="Dashboard" ? "rgba(139,69,19,0.1)" : "transparent", border: "none", color: showDashboard && item==="Dashboard" ? T.brown : "#5a3e28", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = T.brown; e.target.style.background = "rgba(139,69,19,0.07)"; }}
              onMouseLeave={e => { e.target.style.color = showDashboard && item==="Dashboard" ? T.brown : "#5a3e28"; e.target.style.background = showDashboard && item==="Dashboard" ? "rgba(139,69,19,0.1)" : "transparent"; }}>
              {item}
            </button>
          ))}
          <button onClick={() => navigate("/emrs/login")}
            style={{ marginLeft: 10, background: "transparent", color: T.brown, border: `1.5px solid ${T.brown}`, padding: "8px 18px", borderRadius: 6, fontWeight: 800, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.brown; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.brown; }}>
            EMRS Login
          </button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg,#fdf3e3 0%,#f5e6c8 40%,#ede0b8 100%)", padding: "72px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,69,19,0.08),transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: 60, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,120,30,0.1),transparent)", pointerEvents: "none" }} />
        <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.06, pointerEvents: "none" }} width="420" height="420" viewBox="0 0 420 420">
          <circle cx="420" cy="0" r="180" fill="none" stroke="#8b4513" strokeWidth="40" />
          <circle cx="420" cy="0" r="260" fill="none" stroke="#c8781e" strokeWidth="20" />
          <circle cx="420" cy="0" r="330" fill="none" stroke="#8b4513" strokeWidth="12" />
        </svg>
        <TribalMotifWatermark style={{ top: "8%", left: "50%", width: 380, height: 380, transform: "translateX(-50%)", opacity: 0.07, zIndex: 0 }} />
        <HeroImageStrip images={HERO_SCROLL_IMAGES} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,69,19,0.08)", border: `1px solid rgba(139,69,19,0.22)`, color: T.brown, padding: "8px 20px", borderRadius: 50, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32, fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.brown, display: "inline-block" }} />
            Digital India Initiative — Govt. of Assam
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5, color: T.brownDark }}>
            Eklavya Model Residential School<br />
            <span style={{ background: "linear-gradient(90deg,#8b4513,#c8781e,#e8a020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management System</span>
          </h1>
          <p style={{ fontSize: 18, color: T.muted, maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.8 }}>
            A unified platform for managing Eklavya Model Residential Schools and Government Assets
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/emrs/login")} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(139,69,19,0.3)" }} onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>🏫 Access EMRS Portal</button>
            <button onClick={() => navigate("/asset/login")} style={{ background: "rgba(139,69,19,0.06)", color: "#5a3e28", border: `1px solid rgba(139,69,19,0.22)`, padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background="rgba(139,69,19,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.background="rgba(139,69,19,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>🏗️ Asset Portal</button>
            <button onClick={() => { setShowDashboard(true); setTimeout(() => document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" }),50); }} style={{ background: "rgba(200,168,75,0.1)", color: "#8b6914", border: "1px solid rgba(200,168,75,0.35)", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background="rgba(200,168,75,0.2)"; e.currentTarget.style.transform="translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.background="rgba(200,168,75,0.1)"; e.currentTarget.style.transform="translateY(0)"; }}>📊 Dashboard</button>
            <button onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "rgba(200,168,75,0.06)", color: "#8b6914", border: "1px solid rgba(200,168,75,0.25)", padding: "16px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background="rgba(200,168,75,0.14)"; e.currentTarget.style.transform="translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.background="rgba(200,168,75,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}>📸 Gallery</button>
          </div>
        </div>
      </section>

      <NewsFlashTicker items={newsFlashItems} />
      <GamosaBorder height={6} />

      {/* STATS */}
      <section style={{ background: T.cream, padding: "44px 40px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(139,69,19,0.08)", border: `1px solid rgba(139,69,19,0.12)`, borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(139,69,19,0.12)" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: "32px 24px", textAlign: "center", background: "#fff", borderRight: i < 3 ? `1px solid rgba(139,69,19,0.08)` : "none", transition: "background 0.3s" }} onMouseEnter={e => e.currentTarget.style.background=T.creamDark} onMouseLeave={e => e.currentTarget.style.background="#fff"}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}{stat.suffix}</div>
              <div style={{ fontSize: 12, color: T.faint, marginTop: 6, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT + WHAT'S NEW */}
      <section style={{ padding: "20px 40px 0", background: T.cream }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start", minHeight: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px 32px", boxShadow: "0 4px 20px rgba(139,69,19,0.07)" }}>
            <SectionLabel>About Us</SectionLabel>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: T.brownDark, margin: "0 0 14px" }}>EMRS Management System</h2>
            <p style={{ fontSize: 14, color: "#5a3e28", lineHeight: 1.85, margin: "0 0 14px" }}>
              The Directorate of Tribal Affairs (Plain), Government of Assam, established this unified digital platform to streamline governance of Eklavya Model Residential Schools (EMRS) and government assets across the state. The system brings school administration, student records, staff data, hostel management, and infrastructure tracking onto a single, transparent platform.
            </p>
            <p style={{ fontSize: 14, color: "#5a3e28", lineHeight: 1.85, margin: "0 0 20px" }}>
              Built to serve school administrators, district officers, and the public alike, the platform supports the Government of Assam's commitment to accountable, efficient, and accessible tribal education infrastructure across all 17 EMRS institutions and 50+ tracked assets statewide.
            </p>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 22 }}>
              {[{ label: "Schools Managed", value: "17" },{ label: "Districts Covered", value: "10+" },{ label: "Years of Operation", value: "5+" }].map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.brown }}>{f.value}</div>
                  <div style={{ fontSize: 11, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowDashboard(true); setTimeout(() => document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" }),50); }} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "11px 22px", borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              View Dashboard →
            </button>
          </div>
          <NotificationBar notifications={notifications} />
        </div>
      </section>

      {/* QUICK LINKS */}
      <section style={{ padding: "20px 40px 32px", background: T.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {quickLinks.map((link, i) => (
            <button key={i} onClick={() => link.path.startsWith("#") ? document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }) : navigate(link.path)}
              style={{ background: "#fff", border: `1px solid ${link.color}30`, color: "#5a3e28", padding: "12px 24px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", boxShadow: "0 2px 8px rgba(139,69,19,0.07)" }}
              onMouseEnter={e => { e.currentTarget.style.background=`${link.color}10`; e.currentTarget.style.borderColor=link.color; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor=`${link.color}30`; e.currentTarget.style.transform="translateY(0)"; }}>
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      </section>

      {/* DASHBOARD */}
      <div id="dashboard-section">
        {showDashboard && <EMRSDashboard onClose={() => setShowDashboard(false)} />}
      </div>

      {/* PORTAL CARDS */}
      <section style={{ padding: "60px 40px", background: T.creamDark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 12 }}>Our Portals</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: T.brownDark }}>Choose Your Portal</h2>
            <p style={{ color: T.muted, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Two powerful portals designed for efficient management</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 28 }}>
            {portals.map((portal, i) => (
              <div key={i} onMouseEnter={() => setActivePortal(i)} onMouseLeave={() => setActivePortal(null)} style={{ background: "#fff", border: `1px solid ${activePortal===i ? portal.accent+"60" : "rgba(139,69,19,0.1)"}`, borderRadius: 20, overflow: "hidden", boxShadow: activePortal===i ? `0 16px 48px ${portal.glowColor}` : "0 2px 16px rgba(139,69,19,0.08)", transition: "all 0.3s ease", transform: activePortal===i ? "translateY(-8px)" : "translateY(0)" }}>
                <div style={{ background: portal.gradient, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                    <div>
                      <div style={{ fontSize: 52, marginBottom: 14 }}>{portal.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{portal.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{portal.subtitle}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{portal.badge}</div>
                  </div>
                </div>
                <div style={{ padding: "28px 32px" }}>
                  <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, marginBottom: 24 }}>{portal.description}</p>
                  <div style={{ marginBottom: 28 }}>
                    {portal.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: fi < portal.features.length-1 ? `1px solid rgba(139,69,19,0.07)` : "none" }}>
                        <span style={{ fontSize: 16 }}>{f.icon}</span>
                        <span style={{ fontSize: 14, color: "#5a3e28" }}>{f.text}</span>
                        <span style={{ marginLeft: "auto", color: portal.accent, fontSize: 12 }}>→</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(portal.path)} style={{ width: "100%", background: portal.gradient, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}>Access Portal →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ padding: "60px 40px", background: T.cream }}>
        <div style={{ maxWidth: 1260, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 10 }}>Geographic Distribution</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: T.brownDark }}>Locations Across Assam</h2>
            <p style={{ color: T.muted, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Click any pin on the map to view detailed information</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", background: "#fff", border: `1px solid rgba(139,69,19,0.15)`, borderRadius: 14, padding: 4, gap: 4, boxShadow: "0 2px 12px rgba(139,69,19,0.07)" }}>
              {[{ key: "emrs", label: "🏫 EMRS Schools", grad: "linear-gradient(135deg,#8b4513,#c8781e)", shadow: "rgba(139,69,19,0.3)" },{ key: "asset", label: "🏗️ Asset Sites", grad: "linear-gradient(135deg,#1a3d2e,#2d6a4f)", shadow: "rgba(45,106,79,0.3)" }].map(tab => (
                <button key={tab.key} onClick={() => handleLayerSwitch(tab.key)} style={{ padding: "10px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.25s", background: mapLayer===tab.key ? tab.grad : "transparent", color: mapLayer===tab.key ? "#fff" : T.muted, boxShadow: mapLayer===tab.key ? `0 4px 16px ${tab.shadow}` : "none" }}>{tab.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
            <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${mapLayer==="emrs" ? "rgba(139,69,19,0.2)" : "rgba(45,106,79,0.2)"}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(139,69,19,0.08)", transition: "border-color 0.3s" }}>
              <div style={{ background: mapLayer==="emrs" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "linear-gradient(135deg,#1a3d2e,#2d6a4f)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{mapLayer==="emrs" ? "🏫 EMRS School Locations" : "🏗️ Asset Site Locations"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{mapLayer==="emrs" ? "Eklavya Model Residential Schools across Assam" : "Infrastructure, roads & buildings tracked across Assam"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{mapLayer==="emrs" ? `${EMRS_PINS.length} Schools` : `${ASSET_PINS.length} Assets`}</div>
              </div>
              <AssamOSMMap activeLayer={mapLayer} selectedPin={selectedPin} onPinClick={handlePinClick} />
              <div style={{ margin: "12px 14px 14px", background: mapLayer==="emrs" ? "rgba(139,69,19,0.05)" : "rgba(45,106,79,0.05)", border: `1px solid ${mapLayer==="emrs" ? "rgba(139,69,19,0.12)" : "rgba(45,106,79,0.12)"}`, borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-around" }}>
                {(mapLayer==="emrs" ? [
                  { label: "Active",  count: EMRS_PINS.filter(p => p.status==="Active").length,  color: T.green  },
                  { label: "Planned", count: EMRS_PINS.filter(p => p.status==="Planned").length, color: T.purple },
                  { label: "Total",   count: EMRS_PINS.length,                                   color: T.brown  },
                ] : [
                  { label: "Infra",    count: ASSET_PINS.filter(p => p.type==="infra").length,    color: T.brownLight },
                  { label: "Road",     count: ASSET_PINS.filter(p => p.type==="road").length,     color: T.green      },
                  { label: "Building", count: ASSET_PINS.filter(p => p.type==="building").length, color: T.purple     },
                ]).map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {selectedData ? (
                <div style={{ background: "#fff", border: `2px solid ${mapLayer==="emrs" ? "rgba(139,69,19,0.35)" : "rgba(45,106,79,0.35)"}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 32px rgba(139,69,19,0.12)" }}>
                  <div style={{ background: mapLayer==="emrs" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "linear-gradient(135deg,#1a3d2e,#2d6a4f)", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{mapLayer==="emrs" ? "🏫" : assetTypeEmoji[selectedData.type]}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{selectedData.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>📍 {selectedData.district} District</div>
                    </div>
                    <button onClick={() => setSelectedPin(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    {mapLayer==="emrs" ? (
                      <>
                        {[
                          { icon: "🎓", label: "Students", value: `${selectedData.students} enrolled` },
                          { icon: "📚", label: "Classes",  value: `Class ${selectedData.classes}`    },
                          { icon: "👤", label: "Principal",value: selectedData.principal             },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid rgba(139,69,19,0.07)` : "none" }}>
                            <span style={{ fontSize: 15, flexShrink: 0 }}>{row.icon}</span>
                            <div>
                              <div style={{ fontSize: 10, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                              <div style={{ fontSize: 13, color: T.brownDark, fontWeight: 600 }}>{row.value}</div>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(selectedData.status) }} />
                          <span style={{ fontSize: 12, color: statusColor(selectedData.status), fontWeight: 700 }}>{selectedData.status}</span>
                        </div>
                        <button onClick={() => navigate("/emrs/login")} style={{ width: "100%", marginTop: 14, padding: "10px", background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Access EMRS Portal →</button>
                      </>
                    ) : (
                      <>
                        {[
                          { icon: assetTypeEmoji[selectedData.type], label: "Type",        value: assetTypeLabel[selectedData.type] },
                          { icon: "💰",                               label: "Asset Value", value: selectedData.value                },
                          { icon: "📅",                               label: "Year",        value: selectedData.year                 },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid rgba(139,69,19,0.07)` : "none" }}>
                            <span style={{ fontSize: 15, flexShrink: 0 }}>{row.icon}</span>
                            <div>
                              <div style={{ fontSize: 10, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>{row.label}</div>
                              <div style={{ fontSize: 13, color: T.brownDark, fontWeight: 600 }}>{row.value}</div>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(selectedData.status) }} />
                          <span style={{ fontSize: 12, color: statusColor(selectedData.status), fontWeight: 700 }}>{selectedData.status}</span>
                        </div>
                        <button onClick={() => navigate("/asset/login")} style={{ width: "100%", marginTop: 14, padding: "10px", background: "linear-gradient(135deg,#1a3d2e,#2d6a4f)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Access Asset Portal →</button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px dashed rgba(139,69,19,0.18)", borderRadius: 18, padding: "36px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>{mapLayer==="emrs" ? "🏫" : "🏗️"}</div>
                  <div style={{ fontSize: 14, color: "#b89a78", lineHeight: 1.6 }}>Click any pin on the map<br />to view details here</div>
                </div>
              )}
              <div style={{ background: "#fff", border: `1px solid rgba(139,69,19,0.1)`, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(139,69,19,0.06)" }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid rgba(139,69,19,0.08)`, fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>All {mapLayer==="emrs" ? "Schools" : "Assets"}</div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {currentPins.map((pin, i) => {
                    const col = mapLayer==="emrs" ? T.brown : assetTypeColor[pin.type];
                    return (
                      <div key={i} onClick={() => handlePinClick(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", transition: "background 0.15s", background: selectedPin===i ? `${col}0d` : "transparent", borderLeft: `3px solid ${selectedPin===i ? col : "transparent"}`, borderBottom: i < currentPins.length-1 ? `1px solid rgba(139,69,19,0.05)` : "none" }}
                        onMouseEnter={e => { if (selectedPin!==i) e.currentTarget.style.background="rgba(139,69,19,0.03)"; }}
                        onMouseLeave={e => { if (selectedPin!==i) e.currentTarget.style.background="transparent"; }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.name}</div>
                          <div style={{ fontSize: 10, color: T.faint }}>{pin.district}</div>
                        </div>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${statusColor(pin.status)}15`, color: statusColor(pin.status), fontWeight: 600, whiteSpace: "nowrap" }}>{pin.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GallerySection />
      <GamosaBorder height={8} />

      {/* FOOTER */}
      <footer style={{ background: "#2d1a0e", borderTop: "1px solid rgba(200,168,75,0.25)", padding: "40px", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", bottom: -40, right: -20, opacity: 0.06, pointerEvents: "none" }} width="260" height="260" viewBox="0 0 260 260">
          <path d="M130 230 C70 200 40 140 70 70 C90 110 120 130 130 230 Z" fill="none" stroke="#c8a84b" strokeWidth="3" />
          <path d="M130 230 C190 200 220 140 190 70 C170 110 140 130 130 230 Z" fill="none" stroke="#c8a84b" strokeWidth="3" />
          <line x1="130" y1="230" x2="130" y2="100" stroke="#c8a84b" strokeWidth="2" />
        </svg>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#8b4513,#c8781e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏛️</div>
              <div>
                <div style={{ fontWeight: 700, color: "#c8a84b", fontSize: 14 }}>EMRS Management System</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Directorate of Tribal Affairs (Plain)</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy","Terms of Use","Contact Us","Help"].map(link => (
                <button key={link} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }} onMouseEnter={e => e.target.style.color="#c8a84b"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}>{link}</button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>© {new Date().getFullYear()} Government of Assam. All Rights Reserved.</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Designed & Developed by IntelliSight Consultancy Private Limited</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;