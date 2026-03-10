import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [activePortal, setActivePortal] = useState(null);
  const [counters, setCounters] = useState({ schools: 0, students: 0, assets: 0, districts: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard/emrs");

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Animate counters
    const targets = { schools: 17, students: 500, assets: 50, districts: 10 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const counterTimer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        schools:   Math.round(targets.schools   * ease),
        students:  Math.round(targets.students  * ease),
        assets:    Math.round(targets.assets    * ease),
        districts: Math.round(targets.districts * ease),
      });
      if (step >= steps) clearInterval(counterTimer);
    }, interval);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
      clearInterval(counterTimer);
    };
  }, []);

  const stats = [
    { label: "EMRS Schools",      value: counters.schools,   suffix: "",   icon: "🏫", color: "#3b82f6", bg: "#eff6ff" },
    { label: "Students Enrolled", value: counters.students,  suffix: "+",  icon: "🎓", color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Assets Tracked",    value: counters.assets,    suffix: "+",  icon: "🏗️", color: "#f59e0b", bg: "#fffbeb" },
    { label: "Districts Covered", value: counters.districts, suffix: "+",  icon: "🗺️", color: "#10b981", bg: "#ecfdf5" },
  ];

  const portals = [
    {
      title: "EMRS Management",
      subtitle: "Eklavya Model Residential School",
      description: "Manage school details, infrastructure, student enrollment, staff records, hostel administration, and operational data.",
      icon: "🏫",
      gradient: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      accent: "#60a5fa",
      glowColor: "rgba(37,99,235,0.3)",
      features: [
        { icon: "🏫", text: "School & Location Details" },
        { icon: "🎓", text: "Student Enrollment" },
        { icon: "👨‍🏫", text: "Staff Management" },
        { icon: "🏠", text: "Hostel Administration" },
        { icon: "🏗️", text: "Construction Status" },
      ],
      path: "/signin",
      badge: "17 Schools",
    },
    {
      title: "Asset Management",
      subtitle: "Infrastructure & Project Tracking",
      description: "Track government assets, monitor construction projects, record financial details, and maintain comprehensive asset lifecycle.",
      icon: "🏗️",
      gradient: "linear-gradient(135deg, #064e3b, #059669)",
      accent: "#34d399",
      glowColor: "rgba(5,150,105,0.3)",
      features: [
        { icon: "📊", text: "Project Details" },
        { icon: "🏛️", text: "Asset Tracking" },
        { icon: "💰", text: "Financial Records" },
        { icon: "🔨", text: "Construction Status" },
        { icon: "📍", text: "GPS Location Tagging" },
      ],
      path: "/signin",
      badge: "50+ Assets",
    },
  ];

  const recentActivities = [
    { icon: "🏫", text: "EMRS Kampur updated infrastructure details", time: "2 hrs ago", color: "#3b82f6" },
    { icon: "👨‍🏫", text: "Staff records added for EMRS Jorhat",      time: "5 hrs ago", color: "#8b5cf6" },
    { icon: "🏗️", text: "Construction status updated — Block A",      time: "1 day ago", color: "#f59e0b" },
    { icon: "🎓", text: "Enrollment data submitted for Class 9",       time: "2 days ago", color: "#10b981" },
    { icon: "📋", text: "Asset Management form submitted",             time: "3 days ago", color: "#ef4444" },
  ];

  const quickLinks = [
    { icon: "📋", label: "New Application",    path: "/signin", color: "#3b82f6" },
    { icon: "🏫", label: "EMRS Portal",        path: "/signin", color: "#8b5cf6" },
    { icon: "✅", label: "Already Applied",    path: "/signin", color: "#10b981" },
    { icon: "📊", label: "View Reports",       path: "/signin", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

      {/* ── TOP STRIP ── */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)",
        color: "rgba(255,255,255,0.85)", fontSize: 12,
        padding: "7px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", px: 8, borderRadius: 4, padding: "2px 10px" }}>
            🇮🇳 Government of Assam
          </span>
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
      <header style={{
        background: scrolled ? "rgba(15,23,42,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        padding: "16px 40px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #c8a84b, #f0d060)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 15px rgba(200,168,75,0.4)"
          }}>🏛️</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#c8a84b", fontWeight: 700, textTransform: "uppercase" }}>Assam EMRS</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>EMRS & Asset Management System</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {["Home", "About", "Portals", "Contact"].map(item => (
            <button key={item} style={{
              background: "transparent", border: "none", color: "rgba(255,255,255,0.7)",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14,
              transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.7)"; e.target.style.background = "transparent"; }}>
              {item}
            </button>
          ))}
          <button onClick={() => navigate("/signin")} style={{
            background: "linear-gradient(135deg, #c8a84b, #e8c55b)",
            color: "#1a1a1a", border: "none",
            padding: "10px 24px", borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 4px 15px rgba(200,168,75,0.35)",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
            🔐 Login
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        padding: "100px 40px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Animated background blobs */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,168,75,0.08), transparent)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.3)",
            color: "#c8a84b", padding: "8px 20px", borderRadius: 50,
            fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
            marginBottom: 32, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a84b", display: "inline-block", animation: "pulse 2s infinite" }} />
            Digital India Initiative — Govt. of Assam
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5,
          }}>
            Empowering Tribal Education
            <br />
            <span style={{
              background: "linear-gradient(90deg, #c8a84b, #f0d060, #c8a84b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Through Digital Governance
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.6)",
            maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.8,
          }}>
            A unified platform for managing Eklavya Model Residential Schools and Government Assets — bringing transparency, efficiency, and accountability.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/signin")} style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none",
              padding: "16px 36px", borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 25px rgba(37,99,235,0.4)",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(37,99,235,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,99,235,0.4)"; }}>
              🏫 Access EMRS Portal
            </button>
            <button onClick={() => navigate("/signin")} style={{
              background: "rgba(255,255,255,0.06)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
              padding: "16px 36px", borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              🏗️ Asset Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS ── */}
      <section style={{ background: "#0f172a", padding: "0 40px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, overflow: "hidden",
          transform: "translateY(-40px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              padding: "32px 24px", textAlign: "center",
              background: "#1e293b",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = stat.bg.replace("ff", "1a")}
              onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}{stat.suffix}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section style={{ padding: "0 40px 60px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {quickLinks.map((link, i) => (
              <button key={i} onClick={() => navigate(link.path)} style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${link.color}40`,
                color: "#fff", padding: "12px 24px", borderRadius: 50,
                cursor: "pointer", fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${link.color}20`; e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${link.color}40`; e.currentTarget.style.transform = "translateY(0)"; }}>
                {link.icon} {link.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL CARDS ── */}
      <section style={{ padding: "60px 40px", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c8a84b", fontWeight: 700, marginBottom: 12 }}>Our Portals</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Choose Your Portal</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
              Two powerful portals designed for efficient management
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 28 }}>
            {portals.map((portal, i) => (
              <div key={i}
                onMouseEnter={() => setActivePortal(i)}
                onMouseLeave={() => setActivePortal(null)}
                style={{
                  background: "#1e293b",
                  border: `1px solid ${activePortal === i ? portal.accent + "60" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 20, overflow: "hidden",
                  boxShadow: activePortal === i ? `0 20px 60px ${portal.glowColor}` : "0 4px 20px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                  transform: activePortal === i ? "translateY(-8px)" : "translateY(0)",
                }}>

                {/* Card Header */}
                <div style={{ background: portal.gradient, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ position: "absolute", bottom: -20, left: "40%", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                    <div>
                      <div style={{ fontSize: 52, marginBottom: 14 }}>{portal.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{portal.title}</div>
                      <div style={{ fontSize: 12, color: portal.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{portal.subtitle}</div>
                    </div>
                    <div style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff", padding: "6px 14px", borderRadius: 50,
                      fontSize: 12, fontWeight: 700, backdropFilter: "blur(10px)"
                    }}>
                      {portal.badge}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "28px 32px" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>
                    {portal.description}
                  </p>

                  <div style={{ marginBottom: 28 }}>
                    {portal.features.map((f, fi) => (
                      <div key={fi} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 0",
                        borderBottom: fi < portal.features.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}>
                        <span style={{ fontSize: 16 }}>{f.icon}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{f.text}</span>
                        <span style={{ marginLeft: "auto", color: portal.accent, fontSize: 12 }}>→</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => navigate(portal.path)} style={{
                    width: "100%", background: portal.gradient,
                    color: "#fff", border: "none",
                    padding: "14px", borderRadius: 12,
                    fontWeight: 700, fontSize: 15, cursor: "pointer",
                    boxShadow: `0 6px 20px ${portal.glowColor}`,
                    transition: "all 0.2s",
                  }}
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

      {/* ── DASHBOARD PREVIEW: Recent Activity + How It Works side by side ── */}
      <section style={{ padding: "60px 40px", background: "#0a1628" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* Recent Activity */}
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>📊 Recent Activity</h3>
              <span style={{ fontSize: 11, color: "#c8a84b", background: "rgba(200,168,75,0.1)", padding: "4px 12px", borderRadius: 50, fontWeight: 600 }}>
                LIVE
              </span>
            </div>
            {recentActivities.map((act, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 0",
                borderBottom: i < recentActivities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${act.color}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 28, marginTop: 0 }}>🔄 How It Works</h3>
            {[
              { step: "01", title: "Visit Homepage",  desc: "Access the portal from any device",       icon: "🌐", color: "#3b82f6" },
              { step: "02", title: "Select Portal",   desc: "Choose EMRS or Asset Management",         icon: "🎯", color: "#8b5cf6" },
              { step: "03", title: "Login Securely",  desc: "Enter your credentials to authenticate",  icon: "🔐", color: "#f59e0b" },
              { step: "04", title: "Fill & Submit",   desc: "Complete the form and submit data",        icon: "📋", color: "#10b981" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i < 3 ? 20 : 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${item.color}20`, border: `1px solid ${item.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 700, letterSpacing: 1 }}>STEP {item.step}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
                </div>
                {i < 3 && (
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#060d1a",
        borderTop: "1px solid rgba(200,168,75,0.3)",
        padding: "40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #c8a84b, #f0d060)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏛️</div>
              <div>
                <div style={{ fontWeight: 700, color: "#c8a84b", fontSize: 14 }}>EMRS & Asset Management System</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Directorate of Tribal Affairs (Plain)</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Use", "Contact Us", "Help"].map(link => (
                <button key={link} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.target.style.color = "#c8a84b"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} Government of Assam. All Rights Reserved.
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              Designed & Developed by IntelliSight Consultancy Private Limited
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;