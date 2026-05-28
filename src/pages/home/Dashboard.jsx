import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  LineChart, Line, ResponsiveContainer, AreaChart, Area,
} from "recharts";

const SCHOOLS = [
  {
    id: 1, name: "EMRS Kharadhara", shortName: "Kharadhara", district: "Bajali",
    estYear: 2018, affiliation: "CBSE", type: "Co-ed",
    sanctioned: 480, enrolled: 312, hostelCapacity: 480, hostelOccupied: 295,
    classrooms: 14, scienceLab: true, computerLab: true, library: true, playground: true, smartClassroom: true,
    cctv: true, securityGuard: true,
    teachingFilled: 18, teachingVacant: 6,
    nonTeachingFilled: 9, nonTeachingVacant: 3,
    classwise: [
      { cls: "VI", boys: 28, girls: 25 }, { cls: "VII", boys: 30, girls: 27 },
      { cls: "VIII", boys: 27, girls: 24 }, { cls: "IX", boys: 26, girls: 22 },
      { cls: "X", boys: 24, girls: 20 }, { cls: "XI", boys: 22, girls: 18 },
      { cls: "XII", boys: 20, girls: 15 },
    ],
    color: "#3b82f6",
  },
  {
    id: 2, name: "EMRS Jalah", shortName: "Jalah", district: "Baksa",
    estYear: 2017, affiliation: "CBSE", type: "Co-ed",
    sanctioned: 480, enrolled: 344, hostelCapacity: 480, hostelOccupied: 320,
    classrooms: 15, scienceLab: true, computerLab: true, library: true, playground: true, smartClassroom: false,
    cctv: true, securityGuard: true,
    teachingFilled: 20, teachingVacant: 4,
    nonTeachingFilled: 10, nonTeachingVacant: 2,
    classwise: [
      { cls: "VI", boys: 30, girls: 30 }, { cls: "VII", boys: 29, girls: 28 },
      { cls: "VIII", boys: 27, girls: 26 }, { cls: "IX", boys: 25, girls: 24 },
      { cls: "X", boys: 24, girls: 22 }, { cls: "XI", boys: 20, girls: 18 },
      { cls: "XII", boys: 18, girls: 13 },
    ],
    color: "#8b5cf6",
  },
  {
    id: 3, name: "EMRS Jonai", shortName: "Jonai", district: "Dhemaji",
    estYear: 2016, affiliation: "CBSE", type: "Co-ed",
    sanctioned: 480, enrolled: 390, hostelCapacity: 480, hostelOccupied: 370,
    classrooms: 16, scienceLab: true, computerLab: true, library: true, playground: true, smartClassroom: true,
    cctv: true, securityGuard: true,
    teachingFilled: 22, teachingVacant: 2,
    nonTeachingFilled: 11, nonTeachingVacant: 1,
    classwise: [
      { cls: "VI", boys: 32, girls: 30 }, { cls: "VII", boys: 30, girls: 28 },
      { cls: "VIII", boys: 29, girls: 27 }, { cls: "IX", boys: 27, girls: 26 },
      { cls: "X", boys: 26, girls: 24 }, { cls: "XI", boys: 22, girls: 20 },
      { cls: "XII", boys: 20, girls: 19 },
    ],
    color: "#10b981",
  },
  {
    id: 4, name: "EMRS Howraghat", shortName: "Howraghat", district: "Karbi Anglong",
    estYear: 2019, affiliation: "CBSE", type: "Co-ed",
    sanctioned: 480, enrolled: 258, hostelCapacity: 480, hostelOccupied: 240,
    classrooms: 13, scienceLab: true, computerLab: false, library: true, playground: true, smartClassroom: false,
    cctv: false, securityGuard: true,
    teachingFilled: 16, teachingVacant: 8,
    nonTeachingFilled: 7, nonTeachingVacant: 5,
    classwise: [
      { cls: "VI", boys: 25, girls: 22 }, { cls: "VII", boys: 24, girls: 20 },
      { cls: "VIII", boys: 22, girls: 19 }, { cls: "IX", boys: 20, girls: 17 },
      { cls: "X", boys: 18, girls: 15 }, { cls: "XI", boys: 10, girls: 8 },
      { cls: "XII", boys: 10, girls: 8 },
    ],
    color: "#f59e0b",
  },
  {
    id: 5, name: "EMRS Ardaopur", shortName: "Ardaopur", district: "Dima Hasao",
    estYear: 2020, affiliation: "CBSE", type: "Co-ed",
    sanctioned: 480, enrolled: 196, hostelCapacity: 480, hostelOccupied: 180,
    classrooms: 12, scienceLab: false, computerLab: false, library: true, playground: true, smartClassroom: false,
    cctv: false, securityGuard: false,
    teachingFilled: 14, teachingVacant: 10,
    nonTeachingFilled: 6, nonTeachingVacant: 6,
    classwise: [
      { cls: "VI", boys: 20, girls: 18 }, { cls: "VII", boys: 18, girls: 15 },
      { cls: "VIII", boys: 16, girls: 14 }, { cls: "IX", boys: 15, girls: 12 },
      { cls: "X", boys: 14, girls: 10 }, { cls: "XI", boys: 0, girls: 0 },
      { cls: "XII", boys: 0, girls: 0 },
    ],
    color: "#ef4444",
  },
];

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444"];

/* ─── helpers ─── */
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const enrollmentData = SCHOOLS.map(s => ({
  name: s.shortName, enrolled: s.enrolled, sanctioned: s.sanctioned,
  rate: pct(s.enrolled, s.sanctioned), color: s.color,
}));

const hostelData = SCHOOLS.map(s => ({
  name: s.shortName, capacity: s.hostelCapacity, occupied: s.hostelOccupied,
  vacant: s.hostelCapacity - s.hostelOccupied, color: s.color,
}));

const districtData = SCHOOLS.map(s => ({
  name: s.district, value: s.enrolled, color: s.color,
}));

const staffData = SCHOOLS.map(s => ({
  name: s.shortName,
  tFilled: s.teachingFilled, tVacant: s.teachingVacant,
  ntFilled: s.nonTeachingFilled, ntVacant: s.nonTeachingVacant,
}));

const infraItems = ["scienceLab","computerLab","library","playground","smartClassroom","cctv","securityGuard"];
const infraLabels = {
  scienceLab: "Science Lab", computerLab: "Computer Lab", library: "Library",
  playground: "Playground", smartClassroom: "Smart Class", cctv: "CCTV", securityGuard: "Security",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 6px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill, fontSize: 13, margin: "3px 0", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" && !p.name.includes("%") ? p.value.toLocaleString() : p.value}
          {p.name === "Rate" ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

/* ── STAT CARD ── */
const StatCard = ({ label, value, suffix = "", icon, color, sub }) => (
  <div style={{ background: "#1e293b", border: `1px solid ${color}30`, borderRadius: 16, padding: "20px 22px",
    boxShadow: `0 4px 20px ${color}15`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -10, right: -10, width: 70, height: 70, borderRadius: "50%", background: `${color}12` }} />
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}{suffix}</div>
    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
  </div>
);

/* ── SECTION HEADER ── */
const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 18 }}>
    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>{title}</h3>
    {subtitle && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>{subtitle}</p>}
  </div>
);

/* ── CHART CARD ── */
const ChartCard = ({ title, subtitle, children, style = {} }) => (
  <div style={{ background: "#1e293b", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", padding: "22px 22px 16px", ...style }}>
    <SectionHeader title={title} subtitle={subtitle} />
    {children}
  </div>
);

/* ─── MAIN DASHBOARD ─── */
const EMRSDashboard = () => {
  const [activeSchool, setActiveSchool] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const totalEnrolled  = SCHOOLS.reduce((a, s) => a + s.enrolled, 0);
  const totalSanc      = SCHOOLS.reduce((a, s) => a + s.sanctioned, 0);
  const totalHOcc      = SCHOOLS.reduce((a, s) => a + s.hostelOccupied, 0);
  const totalTFilled   = SCHOOLS.reduce((a, s) => a + s.teachingFilled, 0);
  const totalTVacant   = SCHOOLS.reduce((a, s) => a + s.teachingVacant, 0);

  const selectedSchool = activeSchool !== null ? SCHOOLS[activeSchool] : null;

  /* class-wise for selected or aggregate */
  const classData = selectedSchool
    ? selectedSchool.classwise.map(r => ({ ...r, total: r.boys + r.girls }))
    : ["VI","VII","VIII","IX","X","XI","XII"].map(cls => {
        const agg = SCHOOLS.reduce((a, s) => {
          const r = s.classwise.find(c => c.cls === cls);
          return r ? { boys: a.boys + r.boys, girls: a.girls + r.girls } : a;
        }, { boys: 0, girls: 0 });
        return { cls, ...agg, total: agg.boys + agg.girls };
      });

  const tabs = ["overview","enrollment","hostel","staff","infrastructure"];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

      {/* ── DASHBOARD HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#0f172a)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#c8a84b", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                Directorate of Tribal Affairs (Plain) · Govt. of Assam
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>📊 EMRS Schools Dashboard</h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
                Eklavya Model Residential Schools — Live Analytics & Tracker Overview
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SCHOOLS.map((s, i) => (
                <button key={i} onClick={() => setActiveSchool(activeSchool === i ? null : i)}
                  style={{ background: activeSchool === i ? `${s.color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${activeSchool === i ? s.color : "rgba(255,255,255,0.1)"}`,
                    color: activeSchool === i ? s.color : "rgba(255,255,255,0.6)",
                    padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    transition: "all 0.2s" }}>
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 0 }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ background: "transparent", border: "none", color: activeTab === tab ? "#c8a84b" : "rgba(255,255,255,0.45)",
                  padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  borderBottom: activeTab === tab ? "2px solid #c8a84b" : "2px solid transparent",
                  textTransform: "capitalize", transition: "all 0.2s", marginBottom: -1 }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 32px" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 28 }}>
              <StatCard label="Total EMRS Schools"   value={SCHOOLS.length}                                   icon="🏫" color="#3b82f6" sub="Across Assam" />
              <StatCard label="Total Enrolled"       value={totalEnrolled.toLocaleString()}                  icon="🎓" color="#8b5cf6" sub={`of ${totalSanc} sanctioned`} />
              <StatCard label="Occupancy Rate"       value={pct(totalEnrolled,totalSanc)}        suffix="%"  icon="📈" color="#10b981" sub="Enrollment vs Sanctioned" />
              <StatCard label="Hostel Occupied"      value={totalHOcc.toLocaleString()}                      icon="🏠" color="#f59e0b" sub="Residential students" />
              <StatCard label="Teaching Staff"       value={totalTFilled}                                     icon="👨‍🏫" color="#ef4444" sub={`${totalTVacant} posts vacant`} />
              <StatCard label="Districts Covered"    value={SCHOOLS.length}                                   icon="🗺️" color="#c8a84b" sub="Plains districts" />
            </div>

            {/* Charts row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Enrollment vs Sanctioned Strength" subtitle={selectedSchool ? `Showing: ${selectedSchool.name}` : "All 5 EMRS Schools"}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={selectedSchool ? [enrollmentData[SCHOOLS.indexOf(selectedSchool)]] : enrollmentData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Bar dataKey="sanctioned" name="Sanctioned" fill="#334155" radius={[4,4,0,0]} />
                    <Bar dataKey="enrolled"   name="Enrolled"
                      fill="#3b82f6" radius={[4,4,0,0]}
                      label={{ position: "top", fill: "#60a5fa", fontSize: 11, formatter: v => v }}>
                      {(selectedSchool ? [SCHOOLS.indexOf(selectedSchool)] : SCHOOLS.map((_,i)=>i)).map(i => (
                        <Cell key={i} fill={SCHOOLS[i].color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="District-wise Enrollment" subtitle="Proportional share">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={districtData} cx="50%" cy="48%" innerRadius={55} outerRadius={90}
                      paddingAngle={3} dataKey="value">
                      {districtData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} students`]} contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Class-wise distribution */}
            <ChartCard title="Class-wise Student Distribution" subtitle={selectedSchool ? selectedSchool.name : "Aggregate across all schools"} style={{ marginBottom: 20 }}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={classData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cls" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                  <Bar dataKey="boys"  name="Boys"  stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
                  <Bar dataKey="girls" name="Girls" stackId="a" fill="#ec4899" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* School comparison table */}
            <ChartCard title="School Summary Table" subtitle="Quick comparison across all EMRS schools">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {["School","District","Est.","Enrolled","Sanctioned","Rate","Hostel","Teaching Staff"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCHOOLS.map((s, i) => (
                      <tr key={i} onClick={() => setActiveSchool(activeSchool === i ? null : i)}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer",
                          background: activeSchool === i ? `${s.color}12` : "transparent",
                          transition: "background 0.15s" }}>
                        <td style={{ padding: "12px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                            <span style={{ fontWeight: 700, color: "#fff" }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "rgba(255,255,255,0.55)" }}>{s.district}</td>
                        <td style={{ padding: "12px", color: "rgba(255,255,255,0.55)" }}>{s.estYear}</td>
                        <td style={{ padding: "12px", fontWeight: 700, color: s.color }}>{s.enrolled}</td>
                        <td style={{ padding: "12px", color: "rgba(255,255,255,0.55)" }}>{s.sanctioned}</td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 20, height: 6, maxWidth: 80 }}>
                              <div style={{ width: `${pct(s.enrolled, s.sanctioned)}%`, background: s.color, borderRadius: 20, height: "100%" }} />
                            </div>
                            <span style={{ color: s.color, fontWeight: 700, fontSize: 12 }}>{pct(s.enrolled, s.sanctioned)}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "rgba(255,255,255,0.55)" }}>{s.hostelOccupied}/{s.hostelCapacity}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ color: "#34d399", fontWeight: 600 }}>{s.teachingFilled} filled</span>
                          <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 4px" }}>·</span>
                          <span style={{ color: "#ef4444", fontSize: 11 }}>{s.teachingVacant} vacant</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </>
        )}

        {/* ── ENROLLMENT TAB ── */}
        {activeTab === "enrollment" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 28 }}>
              {SCHOOLS.map((s, i) => (
                <StatCard key={i} label={s.shortName} value={s.enrolled} icon="🎓" color={s.color} sub={`${pct(s.enrolled,s.sanctioned)}% filled · ${s.district}`} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Enrollment Rate by School" subtitle="Current vs Sanctioned Strength">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={enrollmentData} layout="vertical" margin={{ top: 5, right: 40, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} domain={[0, 480]} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sanctioned" name="Sanctioned" fill="#334155" radius={[0,4,4,0]} barSize={12} />
                    <Bar dataKey="enrolled"   name="Enrolled"   radius={[0,4,4,0]} barSize={12}>
                      {SCHOOLS.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Gender Distribution by School" subtitle="Boys vs Girls enrollment">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={SCHOOLS.map(s => ({
                      name: s.shortName,
                      boys:  s.classwise.reduce((a,c) => a+c.boys,  0),
                      girls: s.classwise.reduce((a,c) => a+c.girls, 0),
                    }))}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Bar dataKey="boys"  name="Boys"  fill="#3b82f6" radius={[4,4,0,0]} />
                    <Bar dataKey="girls" name="Girls" fill="#ec4899" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
            <ChartCard title="Class-wise Enrollment — All Schools" subtitle="Aggregate count per class">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={classData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="boysGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="girlsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cls" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                  <Area type="monotone" dataKey="boys"  name="Boys"  stroke="#3b82f6" fill="url(#boysGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="girls" name="Girls" stroke="#ec4899" fill="url(#girlsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* ── HOSTEL TAB ── */}
        {activeTab === "hostel" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
              {SCHOOLS.map((s, i) => (
                <div key={i} style={{ background: "#1e293b", border: `1px solid ${s.color}30`, borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{s.shortName}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Occupied</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.hostelOccupied}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, height: 8, marginBottom: 8 }}>
                    <div style={{ width: `${pct(s.hostelOccupied, s.hostelCapacity)}%`, background: s.color, borderRadius: 20, height: "100%", transition: "width 0.8s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{pct(s.hostelOccupied, s.hostelCapacity)}% of {s.hostelCapacity} capacity</div>
                </div>
              ))}
            </div>
            <ChartCard title="Hostel Occupancy vs Capacity" subtitle="Current residential students vs total capacity">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hostelData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} domain={[0, 500]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                  <Bar dataKey="capacity" name="Total Capacity" fill="#334155" radius={[4,4,0,0]} />
                  <Bar dataKey="occupied"  name="Occupied"       radius={[4,4,0,0]}>
                    {hostelData.map((d, i) => <Cell key={i} fill={SCHOOLS[i].color} />)}
                  </Bar>
                  <Bar dataKey="vacant"    name="Vacant"          fill="#1e293b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* ── STAFF TAB ── */}
        {activeTab === "staff" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Teaching Staff — Filled vs Vacant" subtitle="By EMRS school">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={staffData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Bar dataKey="tFilled" name="Teaching Filled" stackId="t" fill="#10b981" radius={[0,0,0,0]} />
                    <Bar dataKey="tVacant" name="Teaching Vacant" stackId="t" fill="#ef4444" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Non-Teaching Staff — Filled vs Vacant" subtitle="By EMRS school">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={staffData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Bar dataKey="ntFilled" name="Non-Teaching Filled" stackId="nt" fill="#8b5cf6" radius={[0,0,0,0]} />
                    <Bar dataKey="ntVacant" name="Non-Teaching Vacant" stackId="nt" fill="#f59e0b" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
            <ChartCard title="Staff Vacancy Summary" subtitle="Teaching posts across all EMRS schools">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {["School","T. Filled","T. Vacant","T. Total","NT. Filled","NT. Vacant","NT. Total","Fill Rate"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCHOOLS.map((s, i) => {
                      const total  = s.teachingFilled + s.teachingVacant + s.nonTeachingFilled + s.nonTeachingVacant;
                      const filled = s.teachingFilled + s.nonTeachingFilled;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "11px 12px", fontWeight: 700, color: s.color }}>{s.shortName}</td>
                          <td style={{ padding: "11px 12px", color: "#34d399" }}>{s.teachingFilled}</td>
                          <td style={{ padding: "11px 12px", color: "#ef4444" }}>{s.teachingVacant}</td>
                          <td style={{ padding: "11px 12px", color: "rgba(255,255,255,0.55)" }}>{s.teachingFilled + s.teachingVacant}</td>
                          <td style={{ padding: "11px 12px", color: "#34d399" }}>{s.nonTeachingFilled}</td>
                          <td style={{ padding: "11px 12px", color: "#ef4444" }}>{s.nonTeachingVacant}</td>
                          <td style={{ padding: "11px 12px", color: "rgba(255,255,255,0.55)" }}>{s.nonTeachingFilled + s.nonTeachingVacant}</td>
                          <td style={{ padding: "11px 12px" }}>
                            <span style={{ color: pct(filled, total) >= 75 ? "#34d399" : "#f59e0b", fontWeight: 700 }}>{pct(filled, total)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </>
        )}

        {/* ── INFRASTRUCTURE TAB ── */}
        {activeTab === "infrastructure" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Infrastructure Availability" subtitle="Feature availability across all EMRS schools">
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                  {infraItems.map(key => {
                    const count = SCHOOLS.filter(s => s[key]).length;
                    return (
                      <div key={key}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{infraLabels[key]}</span>
                          <span style={{ fontSize: 12, color: count >= 4 ? "#34d399" : count >= 3 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                            {count}/{SCHOOLS.length}
                          </span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, height: 7 }}>
                          <div style={{ width: `${(count / SCHOOLS.length) * 100}%`,
                            background: count >= 4 ? "#34d399" : count >= 3 ? "#f59e0b" : "#ef4444",
                            borderRadius: 20, height: "100%", transition: "width 0.8s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>
              <ChartCard title="School-wise Infrastructure Status" subtitle="Green = available · Red = not available">
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", marginTop: 8, alignItems: "center" }}>
                  {/* header row */}
                  <div />
                  <div style={{ display: "flex", gap: 6, justifyContent: "space-around" }}>
                    {infraItems.map(k => (
                      <div key={k} style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textAlign: "center", width: 40, lineHeight: 1.2 }}>{infraLabels[k].split(" ")[0]}</div>
                    ))}
                  </div>
                  {SCHOOLS.map((s, i) => (
                    <>
                      <div key={`n${i}`} style={{ fontSize: 12, color: s.color, fontWeight: 700, whiteSpace: "nowrap" }}>{s.shortName}</div>
                      <div key={`r${i}`} style={{ display: "flex", gap: 6, justifyContent: "space-around" }}>
                        {infraItems.map(k => (
                          <div key={k} style={{ width: 40, height: 24, borderRadius: 6,
                            background: s[k] ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)",
                            border: `1px solid ${s[k] ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.3)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                            {s[k] ? "✓" : "✗"}
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              </ChartCard>
            </div>
            <ChartCard title="Classrooms by School" subtitle="Total classrooms per EMRS school">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={SCHOOLS.map(s => ({ name: s.shortName, classrooms: s.classrooms, color: s.color }))}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="classrooms" name="Classrooms" radius={[6,6,0,0]}
                    label={{ position: "top", fill: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                    {SCHOOLS.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

      </div>
    </div>
  );
};

export default EMRSDashboard;