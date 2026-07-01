import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// DATA (image field added to each EMRS pin + each Asset pin for hover/preview)
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_IMG = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500";

const EMRS_PINS = [
  { name: "EMRS Dalbari, Barama", district: "Baksa", students: 220, cap: 300, classes: "6–12", status: "Not Active", principal: "Mr. R. Basumatary", lat: 26.4500, lng: 90.8500, image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400" },
  { name: "EMRS Jalah, Vill. Daodhara", district: "Baksa", students: 300, cap: 340, classes: "6–12", status: "Active", principal: "Mr. K. Boro", lat: 26.4600, lng: 90.8600, image: "/images/emrs-jalah-morning-assembly.png" },
  { name: "EMRS Sarupeta, Vill Tatikuchi", district: "Baksa", students: 300, cap: 320, classes: "6–12", status: "Not Active", principal: "Mr. I. Narzary", lat: 26.4400, lng: 90.8400, image: FALLBACK_IMG },
  { name: "EMRS Kharadhara", district: "Bajali", students: 295, cap: 320, classes: "6–12", status: "Active", principal: "Ms. P. Devi", lat: 26.6700, lng: 91.1800, image: "/images/emrs-kharadhara-inauguration.png" },
  { name: "EMRS Bedlangmari", district: "Kokrajhar", students: 340, cap: 380, classes: "6–12", status: "Not Active", principal: "Mr. A. Gogoi", lat: 26.4000, lng: 90.2600, image: "images/emrs-bedlangmari-schoolbuilding.png" },
  { name: "EMRS Howraghat", district: "Karbi Anglong", students: 410, cap: 450, classes: "6–12", status: "Active", principal: "Dr. S. Terang", lat: 26.0900, lng: 93.3000, image: "/images/emrs-howraghat-schoolbuilding.png" },
  { name: "EMRS Phuloni, Donghap", district: "Karbi Anglong", students: 275, cap: 300, classes: "6–10", status: "Not Active", principal: "Mr. K. Hmar", lat: 25.3000, lng: 92.8000, image: FALLBACK_IMG },
  { name: "EMRS Silonijan, Thengkur Terang", district: "Karbi Anglong", students: 380, cap: 400, classes: "6–12", status: "Not Active", principal: "Ms. N. Das", lat: 26.04, lng: 93.63, image: FALLBACK_IMG },
  { name: "EMRS Donka, Taralangsho", district: "West Karbi Anglong", students: 350, cap: 400, classes: "6–12", status: " Not Active", principal: "Mr. B. Bora", lat: 24.90, lng: 92.69, image: FALLBACK_IMG },
  { name: "EMRS Jonai, Purana Jhelom", district: "Dhemaji", students: 290, cap: 320, classes: "6–12", status: "Active", principal: "Ms. R. Choudhury", lat: 27.2300, lng: 94.1100, image: "/images/emrs-jonai-building.png" },
  { name: "EMRS Haflong, Ardaopur", district: "Dima Hasao", students: 315, cap: 350, classes: "6–12", status: "Active", principal: "Mr. D. Phukan", lat: 25.1633, lng: 93.0128, image: "images/emrs-ardaopur-schoolbuilding.png" },
  { name: "EMRS Umrangso", district: "Dima Hasao", students: 260, cap: 300, classes: "6–10", status: "Not Active", principal: "TBD", lat: 25.51, lng: 92.73, image: "/images/emrs-umrangsho-aerialview.png" },
  { name: "EMRS Harangajao", district: "Dima Hasao", students: 305, cap: 340, classes: "6–12", status: "Not Active", principal: "Ms. A. Kalita", lat: 25.09, lng: 92.84, image: FALLBACK_IMG },
  { name: "EMRS Diyungbra", district: "Dima Hasao", students: 332, cap: 360, classes: "6–12", status: "Not Active", principal: "Mr. P. Hazarika", lat: 25.62, lng: 92.91, image: FALLBACK_IMG },
  { name: "EMRS Boko", district: "Kamrup", students: 332, cap: 345, classes: "6–12", status: "Not Active", principal: "Mr. P. Hazarika", lat: 25.95, lng: 91.2040, image: "/images/emrs-boko-schoolbuilding.png" },
  { name: "EMRS Dudhnoi, Jakhuwapara", district: "Goalpara", students: 332, cap: 360, classes: "6–12", status: "Not Active", principal: "Mr. P. Hazarika", lat: 25.9500, lng: 90.9010, image: FALLBACK_IMG },
  { name: "EMRS Khairabari, Malmura", district: "Udalguri", students: 332, cap: 380, classes: "6–12", status: "Not Active", principal: "Mr. P. Hazarika", lat: 26.6400, lng: 91.7500, image: FALLBACK_IMG },
];

const ASSET_PINS = [
  { name: "Kamrup Asset Hub", district: "Kamrup", type: "infra", value: "₹4.2Cr", status: "Active", year: 2023, lat: 26.1700, lng: 91.7700, image: FALLBACK_IMG },
  { name: "Tezpur Road Project", district: "Sonitpur", type: "road", value: "₹2.8Cr", status: "In Progress", year: 2024, lat: 26.6300, lng: 92.7900, image: FALLBACK_IMG },
  { name: "Jorhat Infra Store", district: "Jorhat", type: "infra", value: "₹3.1Cr", status: "Active", year: 2022, lat: 26.7500, lng: 94.2000, image: FALLBACK_IMG },
  { name: "Dibrugarh Warehouse", district: "Dibrugarh", type: "building", value: "₹5.6Cr", status: "Active", year: 2021, lat: 27.4800, lng: 94.9100, image: FALLBACK_IMG },
  { name: "Nagaon Construction", district: "Nagaon", type: "building", value: "₹1.9Cr", status: "In Progress", year: 2024, lat: 26.3500, lng: 92.6900, image: FALLBACK_IMG },
  { name: "Barpeta Road Network", district: "Barpeta", type: "road", value: "₹2.2Cr", status: "Active", year: 2023, lat: 26.3200, lng: 91.0000, image: FALLBACK_IMG },
  { name: "Cachar Asset Depot", district: "Cachar", type: "infra", value: "₹3.4Cr", status: "Active", year: 2022, lat: 24.8200, lng: 92.7800, image: FALLBACK_IMG },
  { name: "Dhubri Bridge Project", district: "Dhubri", type: "road", value: "₹6.0Cr", status: "Not Active", year: 2025, lat: 26.0200, lng: 89.9800, image: FALLBACK_IMG },
  { name: "Sivasagar Heritage", district: "Sivasagar", type: "building", value: "₹4.8Cr", status: "Active", year: 2020, lat: 26.9800, lng: 94.6400, image: FALLBACK_IMG },
  { name: "Kokrajhar Dev Store", district: "Kokrajhar", type: "infra", value: "₹1.5Cr", status: "Active", year: 2023, lat: 26.4000, lng: 90.2700, image: FALLBACK_IMG },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEAREST-TRANSIT DATA (approximate coordinates) + DISTANCE HELPERS
// Used to show "nearest railway station", "nearest airport", and
// "distance to nearest EMRS school" when hovering / selecting a map pin.
// ─────────────────────────────────────────────────────────────────────────────
const ASSAM_RAILWAY_STATIONS = [
  { name: "Guwahati Railway Station", lat: 26.1758, lng: 91.7086 },
  { name: "Kamakhya Junction", lat: 26.1587, lng: 91.6417 },
  { name: "New Bongaigaon Junction", lat: 26.4770, lng: 90.5583 },
  { name: "Rangiya Junction", lat: 26.4362, lng: 91.6122 },
  { name: "Kokrajhar Railway Station", lat: 26.4013, lng: 90.2723 },
  { name: "Fakiragram Junction", lat: 26.3667, lng: 90.2333 },
  { name: "Barpeta Road Railway Station", lat: 26.4580, lng: 90.9670 },
  { name: "Nalbari Railway Station", lat: 26.4465, lng: 91.4384 },
  { name: "Rangapara North Junction", lat: 26.8280, lng: 92.6580 },
  { name: "North Lakhimpur Railway Station", lat: 27.2280, lng: 94.0930 },
  { name: "Dibrugarh Railway Station", lat: 27.4728, lng: 94.9120 },
  { name: "New Tinsukia Junction", lat: 27.4898, lng: 95.3597 },
  { name: "Naharkatiya Railway Station", lat: 27.2833, lng: 95.3333 },
  { name: "Jorhat Town Railway Station", lat: 26.7509, lng: 94.2037 },
  { name: "Mariani Junction", lat: 26.6667, lng: 94.3167 },
  { name: "Simaluguri Junction", lat: 26.8500, lng: 94.5833 },
  { name: "Golaghat Railway Station", lat: 26.5100, lng: 93.9600 },
  { name: "Lumding Junction", lat: 25.7500, lng: 93.1700 },
  { name: "Nagaon Railway Station", lat: 26.3480, lng: 92.6840 },
  { name: "Hojai Railway Station", lat: 26.0058, lng: 92.8564 },
  { name: "Diphu Railway Station", lat: 25.8425, lng: 93.4290 },
  { name: "Haflong Hill Railway Station", lat: 25.1667, lng: 93.0167 },
  { name: "Badarpur Junction", lat: 24.8667, lng: 92.6000 },
  { name: "Karimganj Railway Station", lat: 24.8697, lng: 92.3572 },
  { name: "Silchar Railway Station", lat: 24.7960, lng: 92.7788 },
  { name: "Dhubri Railway Station", lat: 26.0230, lng: 89.9850 },
];

const ASSAM_AIRPORTS = [
  { name: "Lokpriya Gopinath Bordoloi Intl. Airport, Guwahati", lat: 26.1061, lng: 91.5859 },
  { name: "Dibrugarh Airport (Mohanbari)", lat: 27.4839, lng: 95.0169 },
  { name: "Jorhat Airport", lat: 26.7315, lng: 94.1754 },
  { name: "Silchar Airport (Kumbhirgram)", lat: 24.9129, lng: 92.9787 },
  { name: "Tezpur Airport (Salonibari)", lat: 26.7091, lng: 92.7847 },
  { name: "Lilabari Airport (North Lakhimpur)", lat: 27.2954, lng: 94.0974 },
];

// Haversine great-circle distance in km between two lat/lng points
function haversineKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => v === undefined || v === null)) return null;
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Closest entry in `list` to a given lat/lng, with `.distance` (km) attached
function findNearestPlace(lat, lng, list) {
  let best = null;
  list.forEach((p) => {
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d === null) return;
    if (!best || d < best.distance) best = { ...p, distance: d };
  });
  return best;
}

// Closest *other* EMRS school to a given EMRS pin
function findNearestEMRS(pin, allPins) {
  let best = null;
  allPins.forEach((p) => {
    if (p.name === pin.name) return;
    const d = haversineKm(pin.lat, pin.lng, p.lat, p.lng);
    if (d === null) return;
    if (!best || d < best.distance) best = { ...p, distance: d };
  });
  return best;
}

const formatKm = (km) => (km == null ? "—" : `${km.toFixed(1)} km`);

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
  { boys: "Mr. B. Das", girls: "Ms. P. Kalita", cap: 240, occ: 240 },
  { boys: "Mr. K. Boro", girls: "Ms. L. Devi", cap: 240, occ: 240 },
  { boys: "Mr. N. Baruah", girls: "Ms. G. Gogoi", cap: 240, occ: 240 },
  { boys: "Mr. A. Mech", girls: "Ms. S. Boro", cap: 240, occ: 240 },
  { boys: "Mr. P. Bodo", girls: "Ms. R. Nath", cap: 240, occ: 240 },
  { boys: "Mr. S. Terang", girls: "Ms. D. Engti", cap: 240, occ: 240 },
  { boys: "Mr. K. Hmar", girls: "Ms. A. Rongpi", cap: 240, occ: 240 },
  { boys: "Mr. B. Timung", girls: "Ms. N. Phukan", cap: 240, occ: 240 },
  { boys: "Mr. R. Kro", girls: "Ms. L. Tisso", cap: 240, occ: 240 },
  { boys: "Mr. D. Pegu", girls: "Ms. T. Doley", cap: 240, occ: 240 },
];

const ATT_RANKING = [96.2, 93.8, 92.1, 91.4, 90.7, 89.3, 88.9, 87.4, 86.1, 85.8, 85.2, 84.9, 83.7, 82.1, 81.4, 79.8, 77.2];

const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const HERO_SCROLL_IMAGES = [
  { src: "/images/emrs-jonai-building.png", caption: "EMRS Jonai (Dhemaji)", sub: "New Campus Building" },
  { src: "/images/emrs-jalah-morning-assembly.png", caption: "EMRS Jalah (Baksa)", sub: "Morning Assembly" },
  { src: "/images/emrs-kharadhara-inauguration.png", caption: "EMRS Kharadhara (Bajali)", sub: "Inauguration Day" },
  { src: "/images/emrs-howraghat-schoolbuilding.png", caption: "EMRS Howraghat (Karbi Anglong)", sub: "School Building" },
  { src: "/images/emrs-dalbari-school.jpeg", caption: "EMRS Dalbari (Baksa)", sub: "School Building" },
  { src: "/images/emrs-ardaopur-academic-block.jpeg", caption: "EMRS Ardaopur (Dima Hasao)", sub: "Academic Block" },
  { src: "/images/emrs-ardaopur-assembly.jpeg", caption: "EMRS Ardaopur (Dima Hasao)", sub: "School Assembly" },
  { src: "/images/emrs-ardaopur-dinninghall.jpeg", caption: "EMRS Ardaopur (Dima Hasao)", sub: "Dining Hall" },
  { src: "/images/emrs-ardaopur-hostel.jpeg", caption: "EMRS Ardaopur (Dima Hasao)", sub: "Hostel" },
  { src: "/images/emrs-ardaopur-schoolgate.png", caption: "EMRS Ardaopur (Dima Hasao)", sub: "School Gate" },
  
  { src: "/images/emrs-boko-schoolbuilding.png", caption: "EMRS Boko (Kamrup)", sub: "School Building" },
  { src: "/images/emrs-boko-playground.png", caption: "EMRS Boko (Kamrup)", sub: "Playground" },
  { src: "/images/emrs-umrangsho-aerialview.png", caption: "EMRS Umrangso (Dima Hasao)", sub: "Aerial View" },
  { src: "/images/emrs-kharadhara-boyshostel.png", caption: "EMRS Kharadhara (Bajali)", sub: "Boys Hostel" },
{ src: "/images/emrs-kharadhara-girlshostel.png", caption: "EMRS Kharadhara (Bajali)", sub: "Girls Hostel" },
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
  gamosaRed: "#c0392b",
  mugaGold: "#c8a84b",
  bodoTeal: "#1a6b6b",
};

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES DROPDOWN DATA
// ─────────────────────────────────────────────────────────────────────────────
const RESOURCES_MENU = [
  { icon: "📋", label: "EMRS Guidelines", sub: "Official operational guidelines", url: "/pdf/EMRSguidelines2026.pdf" },
  { icon: "📜", label: "Rules & Regulations", sub: "Governing rules for EMRS", url: "https://tribal.assam.gov.in/rules-regulations" },
  { icon: "📰", label: "Circulars", sub: "Latest circulars & orders", url: "https://tribal.assam.gov.in/circulars" },
  { icon: "📅", label: "EMRS Annual Calendar", sub: "Academic calendar 2024–25", url: "https://tribal.assam.gov.in/annual-calendar" },
  { icon: "📊", label: "Annual Reports", sub: "Year-wise performance reports", url: "https://tribal.assam.gov.in/annual-reports" },
  { icon: "🏆", label: "Cultural & Sports Meet", sub: "Events & achievements", url: "https://tribal.assam.gov.in/cultural-sports" },
  { icon: "📁", label: "Other Reports", sub: "Miscellaneous documents", url: "https://tribal.assam.gov.in/other-reports" },
  { icon: "🎓", label: "Admission Guidelines", sub: "Class 6 admission process", url: "https://tribal.assam.gov.in/admission-guidelines" },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRIBAL SVG BACKGROUNDS — inline encoders
// ─────────────────────────────────────────────────────────────────────────────

// Bodo weave diamond lattice
function makeBodoWeave(color = "#8b4513", size = 32) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='none'/><polygon points='${size/2},2 ${size-2},${size/2} ${size/2},${size-2} 2,${size/2}' fill='none' stroke='${color}' stroke-width='0.9' opacity='1'/><circle cx='${size/2}' cy='${size/2}' r='1.5' fill='${color}' opacity='0.7'/><circle cx='0' cy='0' r='1' fill='${color}' opacity='0.5'/><circle cx='${size}' cy='0' r='1' fill='${color}' opacity='0.5'/><circle cx='0' cy='${size}' r='1' fill='${color}' opacity='0.5'/><circle cx='${size}' cy='${size}' r='1' fill='${color}' opacity='0.5'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Gamosa cross-hatch motif
function makeGamosaMotif(color = "#c0392b", size = 48) {
  const h = size / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='none'/><line x1='${h}' y1='6' x2='${h}' y2='${size-6}' stroke='${color}' stroke-width='1.2'/><line x1='6' y1='${h}' x2='${size-6}' y2='${h}' stroke='${color}' stroke-width='1.2'/><polyline points='${h-7},${h-7} ${h},${h-13} ${h+7},${h-7}' fill='none' stroke='${color}' stroke-width='0.8'/><polyline points='${h-7},${h+7} ${h},${h+13} ${h+7},${h+7}' fill='none' stroke='${color}' stroke-width='0.8'/><line x1='0' y1='0' x2='5' y2='5' stroke='${color}' stroke-width='0.7'/><line x1='${size}' y1='0' x2='${size-5}' y2='5' stroke='${color}' stroke-width='0.7'/><line x1='0' y1='${size}' x2='5' y2='${size-5}' stroke='${color}' stroke-width='0.7'/><line x1='${size}' y1='${size}' x2='${size-5}' y2='${size-5}' stroke='${color}' stroke-width='0.7'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Muga silk diagonal stripe
function makeMugaStripe() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1' height='24'><rect width='1' height='24' fill='transparent'/><rect y='0' width='1' height='1' fill='#c8a84b'/><rect y='1' width='1' height='5' fill='transparent'/><rect y='6' width='1' height='0.5' fill='#8b4513'/><rect y='6.5' width='1' height='5.5' fill='transparent'/><rect y='12' width='1' height='1' fill='#c8a84b'/><rect y='13' width='1' height='5' fill='transparent'/><rect y='18' width='1' height='0.5' fill='#8b4513'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Karbi brocade tiny zigzag
function makeKarbiZigzag(color = "#c8a84b", w = 20, h = 10) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><polyline points='0,${h} ${w/4},0 ${w/2},${h} ${3*w/4},0 ${w},${h}' fill='none' stroke='${color}' stroke-width='1.2'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIBAL BACKGROUND COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function BodoWeaveBackground({ opacity = 0.045, color = "#8b4513" }) {
  const size = 32;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: makeBodoWeave(color, size),
      backgroundSize: `${size}px ${size}px`,
      opacity,
    }} />
  );
}

function MugaStripeBackground({ opacity = 0.06 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: makeMugaStripe(),
      backgroundSize: "1px 24px",
      opacity,
    }} />
  );
}

function GamosaMotifBackground({ opacity = 0.05, color = "#c0392b" }) {
  const size = 48;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: makeGamosaMotif(color, size),
      backgroundSize: `${size}px ${size}px`,
      opacity,
    }} />
  );
}

function BihuDholAccent({ style }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", pointerEvents: "none", ...style }}>
      <g opacity="0.5">
        <ellipse cx="100" cy="100" rx="60" ry="30" fill="none" stroke="#c8a84b" strokeWidth="2.5"/>
        <line x1="40" y1="100" x2="40" y2="130" stroke="#c8a84b" strokeWidth="2"/>
        <line x1="160" y1="100" x2="160" y2="130" stroke="#c8a84b" strokeWidth="2"/>
        <ellipse cx="100" cy="130" rx="60" ry="30" fill="none" stroke="#c8a84b" strokeWidth="2.5"/>
        {[0,1,2,3,4,5].map(i => {
          const x1 = 40 + i * 24;
          return <line key={i} x1={x1} y1="100" x2={x1 + 12} y2="130" stroke="#8b4513" strokeWidth="1.2" opacity="0.8"/>;
        })}
        <circle cx="100" cy="100" r="8" fill="none" stroke="#c8a84b" strokeWidth="1.5"/>
        <circle cx="100" cy="130" r="8" fill="none" stroke="#c8a84b" strokeWidth="1.5"/>
        <path d="M 100 70 Q 130 55 160 70" fill="none" stroke="#c8a84b" strokeWidth="1.8" strokeDasharray="3 3"/>
      </g>
    </svg>
  );
}

function PeacockFeatherAccent({ style }) {
  return (
    <svg viewBox="0 0 160 320" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", pointerEvents: "none", ...style }}>
      <g opacity="0.45">
        <line x1="80" y1="300" x2="80" y2="40" stroke="#8b4513" strokeWidth="2"/>
        <ellipse cx="80" cy="55" rx="22" ry="28" fill="none" stroke="#c8a84b" strokeWidth="2"/>
        <ellipse cx="80" cy="55" rx="11" ry="14" fill="none" stroke="#1a6b6b" strokeWidth="1.5"/>
        <circle cx="80" cy="55" r="5" fill="#8b4513" opacity="0.7"/>
        {[-100,-80,-60,-40,-20,0,20,40,60,80,100].map((offset, i) => {
          const y = 80 + i * 20;
          const x1 = 80 - Math.abs(offset) * 0.6;
          const x2 = 80 + Math.abs(offset) * 0.6;
          return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#c8a84b" strokeWidth="0.9" opacity="0.7"/>;
        })}
      </g>
    </svg>
  );
}

function KarbiBrocadeCorner({ flip = false, style }) {
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", pointerEvents: "none", transform: flip ? "scaleX(-1)" : "none", ...style }}>
      <g opacity="0.55">
        <path d="M 4 4 L 40 4 L 40 10 L 10 10 L 10 40 L 4 40 Z" fill="none" stroke="#c8a84b" strokeWidth="1.5"/>
        <path d="M 4 4 L 20 4 L 4 20 Z" fill="rgba(200,168,75,0.15)"/>
        <path d="M 18 18 L 30 18 L 30 24 L 24 24 L 24 30 L 18 30 Z" fill="none" stroke="#8b4513" strokeWidth="1.2"/>
        <path d="M 34 10 L 40 10 L 40 16 L 34 16 Z" fill="rgba(139,69,19,0.2)"/>
        <path d="M 10 34 L 10 40 L 16 40 L 16 34 Z" fill="rgba(139,69,19,0.2)"/>
        <line x1="4" y1="4" x2="38" y2="38" stroke="#c8781e" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5"/>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS (unchanged)
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
// CHART LOADER (unchanged)
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
// DASHBOARD TABS (unchanged)
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
        <MetricCard icon="🏫" label="Total EMRS" value="17" sub="Across 10 districts" accentColor={T.brown} />
        <MetricCard icon="🎓" label="Total Students" value="500" sub="Classes 6–12" accentColor={T.purple} />
        <MetricCard icon="👨‍🏫" label="Staff Strength" value="50" sub="Teaching + non-teaching" accentColor={T.green} />
        <MetricCard icon="🏠" label="Hostel Capacity" value="480" sub="Occupancy: 85.7%" accentColor={T.brownLight} />
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
  const yoyRef = useRef(null);
  const tribalRef = useRef(null);
  const dropoutRef = useRef(null);

  useChart(yoyRef, () => ({
    type: "bar",
    data: {
      labels: EMRS_PINS.slice(0,6).map(s => s.name.replace("EMRS ","").split(",")[0]),
      datasets: [
        { label: "2022–23", data: [195,265,270,270,310,380], backgroundColor: "rgba(139,69,19,0.18)", borderRadius: 3, borderSkipped: false },
        { label: "2023–24", data: [205,282,285,280,325,395], backgroundColor: "rgba(139,69,19,0.5)", borderRadius: 3, borderSkipped: false },
        { label: "2024–25", data: [220,300,300,295,340,410], backgroundColor: T.brown, borderRadius: 3, borderSkipped: false },
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
        <MetricCard icon="🎓" label="Total Enrolled" value="50" sub="↑ 4.2% vs last year" accentColor={T.brown} />
        <MetricCard icon="👧" label="Girl Students" value="20" sub="48% of total" accentColor={T.purple} />
        <MetricCard icon="📈" label="New Admissions" value="920" sub="Class 6 intake 2024–25" accentColor={T.green} />
        <MetricCard icon="🏆" label="Highest Enrolment" value="410" sub="EMRS Howraghat" accentColor={T.brownLight} />
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
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#7a5c3a" }}><span style={{ width: 20, height: 2, background: "rgba(139,69,19,0.4)", display: "inline-block" }} /> 2023–24</span>
        </div>
        <div style={{ position: "relative", height: 180 }}><canvas ref={dropoutRef} /></div>
      </ChartCard>
    </>
  );
}

function HostelTab() {
  const occRef = useRef(null);
  const FACILITIES = [
    { name: "Safe Drinking Water", pct: 100, color: T.green },
    { name: "Functional Toilets", pct: 94, color: T.green },
    { name: "Solar Power", pct: 71, color: T.brownLight },
    { name: "Medical Room", pct: 88, color: T.green },
    { name: "Recreation Room", pct: 65, color: T.brownLight },
    { name: "CCTV Coverage", pct: 59, color: "#a32d2d" },
    { name: "Internet Connectivity", pct: 82, color: T.green },
  ];

  useChart(occRef, () => ({
    type: "bar",
    data: {
      labels: EMRS_PINS.slice(0,8).map(s => s.name.replace("EMRS ","").split(",")[0]),
      datasets: [
        { label: "Capacity", data: EMRS_PINS.slice(0,8).map(s => s.cap), backgroundColor: "rgba(139,69,19,0.12)", borderRadius: 4, borderSkipped: false },
        { label: "Occupied", data: EMRS_PINS.slice(0,8).map(s => s.students), backgroundColor: T.brown, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...baseScales({ beginAtZero: true }), x: { grid: { display: false }, ticks: { color: T.faint, font: { size: 10 }, maxRotation: 35 } } } },
  }), []);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard icon="🏠" label="Total Capacity" value="6,200" sub="Across 17 schools" accentColor={T.brown} />
        <MetricCard icon="🛏️" label="Occupied Beds" value="500" sub="85.7% occupancy" accentColor={T.purple} />
        <MetricCard icon="👦" label="Boys' Hostels" value="17" sub="Avg 64% occupancy" accentColor={T.green} />
        <MetricCard icon="👧" label="Girls' Hostels" value="17" sub="Avg 72% occupancy" accentColor={T.brownLight} />
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
  const qualRef = useRef(null);
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
        <MetricCard icon="👨‍🏫" label="Total Staff" value="412" sub="All 17 schools" accentColor={T.brown} />
        <MetricCard icon="📚" label="Teaching Posts" value="228" sub="192 filled (84%)" accentColor={T.purple} />
        <MetricCard icon="🧩" label="Vacant Posts" value="36" sub="Under recruitment" accentColor="#a32d2d" />
        <MetricCard icon="🎓" label="Post-Graduate" value="68%" sub="Of teaching staff" accentColor={T.green} />
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
        <MetricCard icon="📅" label="Avg Attendance" value="88.4%" sub="June 2025" accentColor={T.brown} />
        <MetricCard icon="✅" label="Present Today" value="4,697" sub="Of 500+ students" accentColor={T.green} />
        <MetricCard icon="⚠️" label="Below 75%" value="214" sub="Students flagged" accentColor="#a32d2d" />
        <MetricCard icon="🏆" label="Best School" value="96.2%" sub="EMRS Boko" accentColor={T.purple} />
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

function EMRSDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [year, setYear] = useState("2024–25");
  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "enrollment", label: "Enrollment", icon: "🎓" },
    { key: "hostel", label: "Hostel", icon: "🏠" },
    { key: "staff", label: "Staff", icon: "👨‍🏫" },
    { key: "attendance", label: "Attendance", icon: "📅" },
  ];
  return (
    <section style={{ background: T.creamDark, padding: "40px 40px 60px", borderBottom: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
      <BodoWeaveBackground opacity={0.03} />
      <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
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
        {activeTab === "overview"   && <OverviewTab />}
        {activeTab === "enrollment" && <EnrollmentTab />}
        {activeTab === "hostel"     && <HostelTab />}
        {activeTab === "staff"      && <StaffTab />}
        {activeTab === "attendance" && <AttendanceTab />}
      </div>
    </section>
  );
}

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

function GamosaBorder({ height = 10 }) {
  return (
    <div style={{ height: height + 6, width: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(-45deg, #c0392b 0px, #c0392b ${height}px, #fdf3e3 ${height}px, #fdf3e3 ${height * 1.5}px, #8b1a1a ${height * 1.5}px, #8b1a1a ${height * 2}px, #fdf3e3 ${height * 2}px, #fdf3e3 ${height * 2.5}px)`,
        backgroundSize: `${height * 2.5 * 1.414}px ${height * 2.5 * 1.414}px`,
      }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #c8a84b, #e8a020, #c8a84b)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #c8a84b, #e8a020, #c8a84b)" }} />
    </div>
  );
}

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
              <img src={img.src} alt={img.caption} onError={handleImgError} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
  const dur = Math.max(half / 18, 12);

  const itemRow = (notif, key) => (
    <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: `1px solid rgba(139,90,43,0.1)`, borderLeft: `3px solid ${notif.color}`, background: "transparent", cursor: "default" }}>
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

function GallerySection() {
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [mediaType, setMediaType] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const galleryData = {
    "EMRS Dalbari, Barama": [
      { type: "photo", src: "/images/emrs-dalbari-school.jpeg", caption: "School Building" },
      { type: "photo", src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600", caption: "Library" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", caption: "Inauguration Ceremony" },
    ],
    "EMRS Kharadhara": [
      { type: "photo", src: "/images/emrs-kharadhara-girlshostel.png", caption: "Girls Hostel" },
      { type: "photo", src: "/images/emrs-kharadhara-boyshostel.png", caption: "Boys Hostel" },
      { type: "photo", src: "/images/emrs-kharadhara-inauguration.png", caption: "School Building" },
    ],
    "EMRS Howraghat": [
      { type: "photo", src: "/images/emrs-howraghat-schoolbuilding.png", caption: "School Building" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", caption: "Cultural Programme" },
    ],
    "EMRS Bedlangmari": [
      { type: "photo", src: "images/emrs-bedlangmari-schoolbuilding.png", caption: "School Building" },
      { type: "photo", src: "images/emrs-bedlangmari-hostel.png", caption: "Hostel" }],
      "EMRS Jhelom, Dhemaji": [
      { type: "photo", src: "images/emrs-jonai-building2.png", caption: " Building" },
      { type: "photo", src: "images/emrs-jonai-schoolbuilding.png",  caption: "School Building" },
    ],
    "EMRS Boko": [
      { type: "photo", src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600", caption: "Smart Classroom" },
      { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumb: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600", caption: "Science Fair 2024" },
    ],
    "EMRS Ardaopur": [
      { type: "photo", src: "images/emrs-ardaopur-schoolbuilding.png", caption: "School Building" },
      { type: "photo", src: "images/emrs-ardaopur-hostel.png", caption: "Hostel" },
      { type: "photo", src: "images/emrs-ardaopur-academic-block.jpeg", caption: "Academic Block" },
{ type: "photo", src: "images/emrs-ardaopur-assembly.jpeg", caption: "Assembly" },
{ type: "photo", src: "images/emrs-ardaopur-dinninghall.jpeg", caption: "Dining Hall" },
{ type: "photo", src: "images/emrs-ardaopur-schoolgate.png", caption: "School Gate" },



    ]
    
  };

  const allItems = Object.entries(galleryData).flatMap(([school, items]) => items.map(item => ({ ...item, school })));
  const schools = ["all", ...Object.keys(galleryData)];
  const filtered = allItems.filter(item => {
    const schoolOk = selectedSchool === "all" || item.school === selectedSchool;
    const typeOk = mediaType === "all" || item.type === mediaType;
    return schoolOk && typeOk;
  });

  return (
    <section id="gallery" style={{ padding: "70px 40px", background: "#fdf6e9", position: "relative", overflow: "hidden" }}>
      <GamosaMotifBackground opacity={0.04} />
      <KarbiBrocadeCorner style={{ top: 20, left: 20, width: 80, height: 80 }} />
      <KarbiBrocadeCorner flip style={{ top: 20, right: 20, width: 80, height: 80 }} />
      <div style={{ maxWidth: 1260, margin: "0 auto", position: "relative", zIndex: 1 }}>
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
        <img src={item.type === "video" ? item.thumb : item.src} alt={item.caption} onError={handleImgError} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hover ? "scale(1.06)" : "scale(1)" }} />
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

function AssamOSMMap({ activeLayer, selectedPin, onPinClick }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const mapObjRef = useRef(null);
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
        html: `<div style="position:relative;width:${ring}px;height:${ring}px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:${ring}px;height:${ring}px;border-radius:50%;background:${pin.color}22;border:1.5px solid ${pin.color}99;"></div><div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${pin.color};box-shadow:0 2px 10px ${pin.color}88;border:2px solid rgba(255,255,255,0.8);"></div></div>`,
        iconSize: [ring,ring], iconAnchor: [ring/2,ring],
      });
      const marker = L.marker([pin.lat,pin.lng],{ icon }).addTo(map).on("click",() => onPinClick(pin.id));

      // Hover tooltip shows a small image thumbnail, name & district, plus
      // — for EMRS pins — distance to the nearest railway station, nearest
      // airport, and the nearest other EMRS school.
      const tooltipImg = pin.image || FALLBACK_IMG;

      let extraInfoHtml = "";
      if (activeLayer === "emrs") {
        const nearestStation = findNearestPlace(pin.lat, pin.lng, ASSAM_RAILWAY_STATIONS);
        const nearestAirport = findNearestPlace(pin.lat, pin.lng, ASSAM_AIRPORTS);
        const nearestSchool = findNearestEMRS(pin, EMRS_PINS);
        extraInfoHtml = `<div style="margin-top:7px;padding-top:7px;border-top:1px solid rgba(139,69,19,0.15);font-size:10.5px;color:#5a3e28;line-height:1.7;">
             <div>🚉 ${nearestStation ? nearestStation.name : "—"}: <strong>${formatKm(nearestStation?.distance)}</strong></div>
             <div>✈️ ${nearestAirport ? nearestAirport.name : "—"}: <strong>${formatKm(nearestAirport?.distance)}</strong></div>
             <div>🏫 Nearest EMRS — ${nearestSchool ? nearestSchool.name.replace("EMRS ","") : "—"}: <strong>${formatKm(nearestSchool?.distance)}</strong></div>
           </div>`;
      }

      marker.bindTooltip(
        `<div style="max-width:250px;">
           <div style="display:flex;gap:8px;align-items:center;">
             <img src="${tooltipImg}" alt="${pin.name}"
                  style="width:54px;height:54px;object-fit:cover;border-radius:7px;flex-shrink:0;border:1px solid rgba(139,69,19,0.2);"
                  onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" />
             <div>
               <div style="font-weight:700;font-size:12px;color:#2d1a0e;line-height:1.3">${pin.name}</div>
               <div style="font-size:11px;color:#7a5c3a;margin-top:2px">📍 ${pin.district}</div>
             </div>
           </div>
           ${extraInfoHtml}
         </div>`,
        { direction: "top", offset: [0,-ring], className: "leaflet-emrs-tooltip" }
      );
      markersRef.current.push(marker);
    });
  }, [activeLayer, selectedPin, pins]);

  return (
    <div style={{ position: "relative", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
      <style>{`.leaflet-emrs-tooltip{background:#fffdf7!important;border:1px solid rgba(139,69,19,0.2)!important;border-radius:10px!important;padding:8px 10px!important;box-shadow:0 6px 24px rgba(139,69,19,0.18)!important;max-width:250px!important}.leaflet-emrs-tooltip::before{display:none!important}.leaflet-container{background:#f5ede0!important}`}</style>
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
// ★ RESOURCES DROPDOWN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ResourcesDropdown() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? "rgba(139,69,19,0.1)" : "transparent",
          border: "none",
          color: open ? T.brown : "#5a3e28",
          padding: "8px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = T.brown; e.currentTarget.style.background = "rgba(139,69,19,0.07)"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.color = "#5a3e28"; e.currentTarget.style.background = "transparent"; } }}
      >
        Resources
        <span style={{
          display: "inline-block",
          width: 0, height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: open ? "none" : `5px solid currentColor`,
          borderBottom: open ? `5px solid currentColor` : "none",
          marginLeft: 2,
          transition: "all 0.2s",
        }} />
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          background: "#fff",
          border: `1px solid rgba(139,69,19,0.15)`,
          borderRadius: 14,
          boxShadow: "0 12px 48px rgba(139,69,19,0.16)",
          zIndex: 9999,
          overflow: "hidden",
          animation: "dropdownFade 0.18s ease",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#8b4513,#c8781e)",
            padding: "14px 18px",
            position: "relative",
            overflow: "hidden",
          }}>
            <BodoWeaveBackground opacity={0.1} color="#fff" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>📚 EMRS Resources</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Guidelines, circulars & reports</div>
            </div>
          </div>
          <div style={{ padding: "6px 0" }}>
            {RESOURCES_MENU.map((item, i) => (
  <button
    key={i}
    onClick={() => {
  setOpen(false);
  if (item.url) {
    window.open(item.url, "_blank", "noopener,noreferrer");
  }
}}
    onMouseEnter={() => setHovered(i)}
    onMouseLeave={() => setHovered(null)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "10px 18px",
      background: hovered === i ? "rgba(139,69,19,0.06)" : "transparent",
      border: "none",
      borderLeft: hovered === i ? `3px solid ${T.brown}` : "3px solid transparent",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.15s",
    }}
  >
    <span style={{
      fontSize: 18,
      width: 28,
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: hovered === i ? "rgba(139,69,19,0.1)" : "rgba(139,69,19,0.06)",
      borderRadius: 7,
      flexShrink: 0,
      transition: "background 0.15s",
    }}>{item.icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: hovered === i ? T.brown : T.brownDark, transition: "color 0.15s" }}>{item.label}</div>
      <div style={{ fontSize: 10.5, color: T.faint, marginTop: 1 }}>{item.sub}</div>
    </div>
    <span style={{
      marginLeft: "auto",
      fontSize: 10,
      color: hovered === i ? T.brown : "rgba(139,69,19,0.35)",
      background: hovered === i ? "rgba(139,69,19,0.08)" : "transparent",
      border: `1px solid ${hovered === i ? "rgba(139,69,19,0.25)" : "transparent"}`,
      padding: "2px 6px",
      borderRadius: 4,
      fontWeight: 600,
      transition: "all 0.15s",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}>↗ Open</span>
  </button>

            ))}
          </div>
          <div style={{
            padding: "10px 18px",
            borderTop: `1px solid rgba(139,69,19,0.08)`,
            background: "#fdf8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 10.5, color: T.faint }}>Govt. of Assam — EMRS Division</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 11, color: T.brown, fontWeight: 700, cursor: "pointer" }}>View All →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ TRIBAL STATS CARD — individual card with layered tribal textures
// ─────────────────────────────────────────────────────────────────────────────
function TribalStatCard({ icon, value, suffix, label, sub, valueColor, labelColor, subColor, topBarColor, iconBg, iconBorder, bodoColor, gamosaColor, mugaOpacity, isLast }) {
  const [hover, setHover] = useState(false);

  // Each card gets its own combo of tribal textures at low opacity
  const bodoPattern   = makeBodoWeave(bodoColor, 28);
  const gamosaPattern = makeGamosaMotif(gamosaColor, 40);
  const mugaPattern   = makeMugaStripe();
  const zigzagPattern = makeKarbiZigzag(iconBorder.replace("rgba(","").replace(")","").split(",").slice(0,3).map(n=>parseInt(n)).reduce((a,b,i)=>a+(b.toString(16).padStart(2,"0")),"#"), 16, 8);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: "30px 20px 28px",
        textAlign: "center",
        overflow: "hidden",
        borderRight: !isLast ? "1px solid rgba(139,69,19,0.1)" : "none",
        background: hover ? "#fdf6e3" : "#fff",
        transition: "background 0.25s",
        cursor: "default",
      }}
    >
      {/* ── Layered tribal texture stack ── */}
      {/* Layer 1: Bodo diamond weave — very faint base */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: bodoPattern, backgroundSize: "28px 28px", opacity: hover ? 0.07 : 0.045, transition: "opacity 0.25s", pointerEvents: "none" }} />
      {/* Layer 2: Gamosa cross motif — slightly different scale */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: gamosaPattern, backgroundSize: "40px 40px", opacity: hover ? 0.055 : 0.03, transition: "opacity 0.25s", pointerEvents: "none" }} />
      {/* Layer 3: Muga silk vertical stripes */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: mugaPattern, backgroundSize: "1px 24px", opacity: hover ? mugaOpacity * 1.4 : mugaOpacity, transition: "opacity 0.25s", pointerEvents: "none" }} />
      {/* Layer 4: Karbi zigzag border strip along bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 9, backgroundImage: zigzagPattern, backgroundSize: "16px 9px", backgroundRepeat: "repeat-x", opacity: hover ? 0.5 : 0.28, transition: "opacity 0.25s", pointerEvents: "none" }} />

      {/* Colored top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: topBarColor }} />

      {/* Content — sits above all texture layers */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Icon bubble */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: iconBg,
          border: `1.5px solid ${iconBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 26,
        }}>
          {icon}
        </div>

        {/* Big number */}
        <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: -1.5, color: valueColor, marginBottom: 5 }}>
          {value}<span style={{ fontSize: 26, letterSpacing: 0 }}>{suffix}</span>
        </div>

        {/* Muga-gold divider line under number */}
        <div style={{ width: 36, height: 2, background: `linear-gradient(90deg, transparent, #c8a84b, transparent)`, margin: "8px auto 8px", borderRadius: 1 }} />

        {/* Label */}
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: labelColor }}>
          {label}
        </div>

        {/* Sub */}
        {sub && (
          <div style={{ fontSize: 11, color: subColor, marginTop: 5, fontStyle: "italic" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE
// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [activePortal, setActivePortal] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [counters, setCounters] = useState({ schools: 0, students: 0, assets: 0, districts: 0 });
  const [mapLayer, setMapLayer] = useState("emrs");
  const [selectedPin, setSelectedPin] = useState(null);

  const notifications = [
    { icon: "🏫", title: "EMRS Kampur infrastructure data updated", time: "Just now", color: T.brown },
    { icon: "📋", title: "New asset entry submitted — Block A, Jorhat", time: "5 min ago", color: T.brownLight },
    { icon: "🎓", title: "Enrollment data for Class 9 approved", time: "20 min ago", color: T.purple },
    { icon: "👨‍🏫", title: "Staff record added — EMRS Howraghat", time: "1 hr ago", color: T.green },
    { icon: "📸", title: "New photos uploaded — EMRS Boko", time: "2 hrs ago", color: "#c8a84b" },
    { icon: "🏗️", title: "Construction status: EMRS Dalbari Phase 2 complete", time: "3 hrs ago", color: "#a83232" },
    { icon: "📊", title: "Monthly report generated for all 17 schools", time: "Yesterday", color: T.brown },
    { icon: "✅", title: "EMRS Kharadhara audit form verified", time: "2 days ago", color: T.green },
    { icon: "📝", title: "New circular issued — EMRS admission 2024–25", time: "3 days ago", color: T.brownLight },
    { icon: "🏆", title: "EMRS Howraghat wins state science olympiad", time: "4 days ago", color: T.brown },
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
    const targets = { schools: 17, students: 500, assets: 50, districts: 10 };
    let step = 0;
    const counterTimer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 60, 3);
      setCounters({ schools: Math.round(targets.schools * ease), students: Math.round(targets.students * ease), assets: Math.round(targets.assets * ease), districts: Math.round(targets.districts * ease) });
      if (step >= 60) clearInterval(counterTimer);
    }, 2000 / 60);
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(timer); clearInterval(counterTimer); };
  }, []);

  const handleNavClick = item => {
    if (item === "Dashboard") {
      setShowDashboard(true);
      setTimeout(() => document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" }), 50);
      return;
    }
    if (item === "Home") { setShowDashboard(false); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (item === "About Us") { document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" }); return; }
    if (item === "Gallery") { document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }); return; }
    setShowDashboard(false);
  };

  const navItems = ["Home", "About Us", "Gallery", "Dashboard", "Contact"];

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
    { icon: "📋", label: "Asset Portal", path: "/asset/login", color: T.brown },
    { icon: "🏫", label: "EMRS Portal", path: "/emrs/login", color: T.purple },
    { icon: "📸", label: "Gallery", path: "#gallery", color: T.brownLight },
    { icon: "📊", label: "View Reports", path: "/asset/login", color: T.green },
  ];

  const assetTypeColor = { infra: T.brownLight, road: T.green, building: T.purple };
  const assetTypeLabel = { infra: "Infrastructure", road: "Road Project", building: "Building" };
  const assetTypeEmoji = { infra: "🏗️", road: "🛣️", building: "🏛️" };
  const statusColor = s => s === "Active" ? T.green : s === "In Progress" ? T.brownLight : T.purple;

  const currentPins = mapLayer === "emrs" ? EMRS_PINS : ASSET_PINS;
  const selectedData = selectedPin !== null ? currentPins[selectedPin] : null;
  const handlePinClick = id => setSelectedPin(prev => prev === id ? null : id);
  const handleLayerSwitch = layer => { setMapLayer(layer); setSelectedPin(null); };

  // ── Stats card config ──
  const tribalStatCards = [
    {
      icon: "🏫",
      value: counters.schools,
      suffix: "",
      label: "EMRS Schools",
      sub: "Across 10 districts",
      valueColor: "#8b4513",
      labelColor: "#5a3e28",
      subColor: "#a07050",
      topBarColor: "linear-gradient(90deg,#8b4513,#c8781e)",
      iconBg: "#fdf0e5",
      iconBorder: "rgba(139,69,19,0.2)",
      bodoColor: "#8b4513",
      gamosaColor: "#c0392b",
      mugaOpacity: 0.07,
    },
    {
      icon: "🎓",
      value: counters.students.toLocaleString(),
      suffix: "",
      label: "Students Enrolled",
      sub: "Classes 6–12",
      valueColor: "#6b3fa0",
      labelColor: "#4a2d70",
      subColor: "#7a5ca0",
      topBarColor: "linear-gradient(90deg,#6b3fa0,#9b6fd0)",
      iconBg: "#f3edfb",
      iconBorder: "rgba(107,63,160,0.2)",
      bodoColor: "#6b3fa0",
      gamosaColor: "#9b6fd0",
      mugaOpacity: 0.05,
    },
    {
      icon: "🏗️",
      value: counters.assets,
      suffix: "+",
      label: "Assets Tracked",
      sub: "State-wide coverage",
      valueColor: "#c8781e",
      labelColor: "#7a4a10",
      subColor: "#a06830",
      topBarColor: "linear-gradient(90deg,#c8781e,#e8a020)",
      iconBg: "#fff4e5",
      iconBorder: "rgba(200,120,30,0.2)",
      bodoColor: "#c8781e",
      gamosaColor: "#e8a020",
      mugaOpacity: 0.06,
    },
    {
      icon: "🗺️",
      value: counters.districts,
      suffix: "+",
      label: "Districts Covered",
      sub: "Assam state",
      valueColor: "#2d6a4f",
      labelColor: "#1a4030",
      subColor: "#3a7060",
      topBarColor: "linear-gradient(90deg,#2d6a4f,#52b788)",
      iconBg: "#eaf6f1",
      iconBorder: "rgba(45,106,79,0.2)",
      bodoColor: "#2d6a4f",
      gamosaColor: "#52b788",
      mugaOpacity: 0.055,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: T.cream, minHeight: "100vh", color: T.brownDark }}>

      <style>{`
        @keyframes newsFlashMarquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes heroImageStripScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes dropdownFade{0%{opacity:0;transform:translateX(-50%) translateY(-6px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}
        .hero-image-strip-track{animation:heroImageStripScroll 40s linear infinite;}
        .hero-image-strip-track:hover{animation-play-state:paused;}
        @media(prefers-reduced-motion:reduce){.hero-image-strip-track{animation:none;}}
        .tribal-heading::after{content:'';display:block;width:60px;height:3px;margin:10px auto 0;background:linear-gradient(90deg,#c0392b,#c8a84b,#c0392b);border-radius:2px;}
      `}</style>

      <GamosaBorder height={8} />

      {/* TOP STRIP */}
      <div style={{ background: "linear-gradient(90deg,#8b4513,#a0522d)", color: "rgba(255,255,255,0.9)", fontSize: 12, padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.15)", position: "relative", overflow: "hidden" }}>
        <MugaStripeBackground opacity={0.12} />
        <span style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
          <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: 4, padding: "2px 10px" }}>🇮🇳 Government of Assam</span>
          <span style={{ opacity: 0.5 }}>|</span>
          Directorate of Tribal Affairs (Plain)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, position: "relative", zIndex: 1 }}>
          <span>📅 {time.toLocaleDateString("en-IN",{ weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>🕐 {time.toLocaleTimeString("en-IN")}</span>
        </span>
      </div>

      {/* NAVBAR */}
      <header style={{ background: scrolled ? "rgba(253,248,240,0.97)" : "rgba(253,248,240,0.85)", backdropFilter: "blur(16px)", padding: "14px 40px", position: "sticky", top: 0, zIndex: 200, boxShadow: scrolled ? "0 2px 20px rgba(139,69,19,0.12)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
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
              style={{ background: showDashboard && item === "Dashboard" ? "rgba(139,69,19,0.1)" : "transparent", border: "none", color: showDashboard && item === "Dashboard" ? T.brown : "#5a3e28", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = T.brown; e.target.style.background = "rgba(139,69,19,0.07)"; }}
              onMouseLeave={e => { e.target.style.color = showDashboard && item === "Dashboard" ? T.brown : "#5a3e28"; e.target.style.background = showDashboard && item === "Dashboard" ? "rgba(139,69,19,0.1)" : "transparent"; }}>
              {item}
            </button>
          ))}
          <ResourcesDropdown />
          <button onClick={() => navigate("/emrs/login")}
            style={{ marginLeft: 10, background: "transparent", color: T.brown, border: `1.5px solid ${T.brown}`, padding: "8px 18px", borderRadius: 6, fontWeight: 800, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.brown; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.brown; }}>
            EMRS Login
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ background: "linear-gradient(160deg,#fdf3e3 0%,#f5e6c8 40%,#ede0b8 100%)", padding: "72px 40px 80px", position: "relative", overflow: "hidden" }}>
        <BodoWeaveBackground opacity={0.055} color="#8b4513" />
        <MugaStripeBackground opacity={0.07} />
        <PeacockFeatherAccent style={{ left: -20, top: "10%", width: 160, height: 320, opacity: 0.35 }} />
        <BihuDholAccent style={{ right: 60, top: "12%", width: 200, height: 200, opacity: 0.3 }} />
        <KarbiBrocadeCorner style={{ bottom: 30, left: 30, width: 100, height: 100, opacity: 0.6 }} />
        <KarbiBrocadeCorner flip style={{ bottom: 30, right: 30, width: 100, height: 100, opacity: 0.6 }} />
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,transparent,#c8a84b)" }} />
            <div style={{ width: 8, height: 8, borderRadius: 1, background: "#c0392b", transform: "rotate(45deg)" }} />
            <div style={{ width: 5, height: 5, borderRadius: 1, background: "#c8a84b", transform: "rotate(45deg)" }} />
            <div style={{ width: 8, height: 8, borderRadius: 1, background: "#c0392b", transform: "rotate(45deg)" }} />
            <div style={{ height: 1, width: 60, background: "linear-gradient(90deg,#c8a84b,transparent)" }} />
          </div>
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

      {/* ── STATS — tribal-textured cards ── */}
      <section style={{ background: T.cream, padding: "44px 40px 0", position: "relative", overflow: "hidden" }}>
        <GamosaMotifBackground opacity={0.04} color="#c0392b" />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Outer frame: gamosa-red border top + bottom, muga-gold corners */}
          <div style={{
            border: "1.5px solid rgba(139,69,19,0.2)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 12px 48px rgba(139,69,19,0.14)",
            position: "relative",
          }}>
            {/* Gamosa-red top stripe across entire box */}
            <div style={{ height: 5, background: "repeating-linear-gradient(90deg,#c0392b 0px,#c0392b 18px,#fdf3e3 18px,#fdf3e3 22px,#8b1a1a 22px,#8b1a1a 36px,#fdf3e3 36px,#fdf3e3 40px)", backgroundSize: "40px 5px" }} />

            {/* Brocade corner accents inside the outer box */}
            <KarbiBrocadeCorner style={{ top: 5, left: 0, width: 44, height: 44, opacity: 0.5, zIndex: 2 }} />
            <KarbiBrocadeCorner flip style={{ top: 5, right: 0, width: 44, height: 44, opacity: 0.5, zIndex: 2 }} />

            {/* 4-column grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {tribalStatCards.map((card, i) => (
                <TribalStatCard key={i} {...card} isLast={i === tribalStatCards.length - 1} />
              ))}
            </div>

            {/* Gamosa-red bottom stripe */}
            <div style={{ height: 5, background: "repeating-linear-gradient(90deg,#c0392b 0px,#c0392b 18px,#fdf3e3 18px,#fdf3e3 22px,#8b1a1a 22px,#8b1a1a 36px,#fdf3e3 36px,#fdf3e3 40px)", backgroundSize: "40px 5px" }} />
          </div>

          {/* Muga-gold line beneath the box */}
          <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#c8a84b 20%,#e8a020 50%,#c8a84b 80%,transparent)", marginTop: 4, borderRadius: 1 }} />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-section" style={{ padding: "20px 40px 0", background: T.cream, position: "relative", overflow: "hidden" }}>
        <BodoWeaveBackground opacity={0.04} />
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "start", minHeight: 0, position: "relative", zIndex: 1 }}>
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px 32px", boxShadow: "0 4px 20px rgba(139,69,19,0.07)", position: "relative", overflow: "hidden" }}>
            <KarbiBrocadeCorner style={{ top: 0, left: 0, width: 60, height: 60, opacity: 0.4 }} />
            <KarbiBrocadeCorner flip style={{ top: 0, right: 0, width: 60, height: 60, opacity: 0.4 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <SectionLabel>About Us</SectionLabel>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: T.brownDark, margin: "0 0 14px" }}>EMRS Management System</h2>
              <p style={{ fontSize: 14, color: "#5a3e28", lineHeight: 1.85, margin: "0 0 14px" }}>
                The Directorate of Tribal Affairs (Plain), Government of Assam, established this unified digital platform to streamline governance of Eklavya Model Residential Schools (EMRS) and government assets across the state. The system brings school administration, student records, staff data, hostel management, and infrastructure tracking onto a single, transparent platform.
              </p>
              <p style={{ fontSize: 14, color: "#5a3e28", lineHeight: 1.85, margin: "0 0 20px" }}>
                Built to serve school administrators, district officers, and the public alike, the platform supports the Government of Assam's commitment to accountable, efficient, and accessible tribal education infrastructure across all 17 EMRS institutions and 50+ tracked assets statewide.
              </p>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 22 }}>
                {[{ label: "Schools Managed", value: "17" },{ label: "Districts Covered", value: "10" },{ label: "Years of Operation", value: "5+" }].map((f, i) => (
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
          </div>
          <NotificationBar notifications={notifications} />
        </div>
      </section>

      {/* QUICK LINKS */}
      <section style={{ padding: "20px 40px 32px", background: T.cream, position: "relative" }}>
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
      <section style={{ padding: "60px 40px", background: T.creamDark, position: "relative", overflow: "hidden" }}>
        <BodoWeaveBackground opacity={0.05} />
        <GamosaMotifBackground opacity={0.035} color="#8b4513" />
        <BihuDholAccent style={{ right: -40, bottom: 40, width: 260, height: 260, opacity: 0.15 }} />
        <PeacockFeatherAccent style={{ left: -30, top: 40, width: 120, height: 240, opacity: 0.2 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 12 }}>Our Portals</div>
            <h2 className="tribal-heading" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: T.brownDark }}>Choose Your Portal</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "16px auto 12px" }}>
              {[...Array(7)].map((_, i) => (
                <div key={i} style={{ width: i === 3 ? 12 : 7, height: i === 3 ? 12 : 7, borderRadius: 1, background: i % 2 === 0 ? "#c0392b" : "#c8a84b", transform: "rotate(45deg)", opacity: i === 3 ? 1 : 0.6 }} />
              ))}
            </div>
            <p style={{ color: T.muted, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Two powerful portals designed for efficient management</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 28 }}>
            {portals.map((portal, i) => (
              <div key={i} onMouseEnter={() => setActivePortal(i)} onMouseLeave={() => setActivePortal(null)} style={{ background: "#fff", border: `1px solid ${activePortal===i ? portal.accent+"60" : "rgba(139,69,19,0.1)"}`, borderRadius: 20, overflow: "hidden", boxShadow: activePortal===i ? `0 16px 48px ${portal.glowColor}` : "0 2px 16px rgba(139,69,19,0.08)", transition: "all 0.3s ease", transform: activePortal===i ? "translateY(-8px)" : "translateY(0)" }}>
                <div style={{ background: portal.gradient, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                  <BodoWeaveBackground opacity={0.08} color="#fff" />
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,rgba(200,168,75,0.6),rgba(200,168,75,0.9),rgba(200,168,75,0.6),transparent)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: 52, marginBottom: 14 }}>{portal.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{portal.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{portal.subtitle}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{portal.badge}</div>
                  </div>
                </div>
                <div style={{ padding: "28px 32px", position: "relative" }}>
                  <MugaStripeBackground opacity={0.04} />
                  <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, marginBottom: 24, position: "relative", zIndex: 1 }}>{portal.description}</p>
                  <div style={{ marginBottom: 28, position: "relative", zIndex: 1 }}>
                    {portal.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: fi < portal.features.length-1 ? `1px solid rgba(139,69,19,0.07)` : "none" }}>
                        <span style={{ fontSize: 16 }}>{f.icon}</span>
                        <span style={{ fontSize: 14, color: "#5a3e28" }}>{f.text}</span>
                        <span style={{ marginLeft: "auto", color: portal.accent, fontSize: 12 }}>→</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(portal.path)} style={{ width: "100%", background: portal.gradient, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s", position: "relative", zIndex: 1 }} onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}>Access Portal →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section style={{ padding: "60px 40px", background: T.cream, position: "relative", overflow: "hidden" }}>
        <GamosaMotifBackground opacity={0.035} color="#8b4513" />
        <div style={{ maxWidth: 1260, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: T.brown, fontWeight: 700, marginBottom: 10 }}>Geographic Distribution</div>
            <h2 className="tribal-heading" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: T.brownDark }}>Locations Across Assam</h2>
            <p style={{ color: T.muted, fontSize: 15, maxWidth: 500, margin: "16px auto 0" }}>Click any pin on the map to view detailed information — hover to see nearby transit distances</p>
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
              <div style={{ background: mapLayer==="emrs" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "linear-gradient(135deg,#1a3d2e,#2d6a4f)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
                <BodoWeaveBackground opacity={0.08} color="#fff" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{mapLayer==="emrs" ? "🏫 EMRS School Locations" : "🏗️ Asset Site Locations"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{mapLayer==="emrs" ? "Eklavya Model Residential Schools across Assam" : "Infrastructure, roads & buildings tracked across Assam"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, position: "relative", zIndex: 1 }}>{mapLayer==="emrs" ? `${EMRS_PINS.length} Schools` : `${ASSET_PINS.length} Assets`}</div>
              </div>
              <AssamOSMMap activeLayer={mapLayer} selectedPin={selectedPin} onPinClick={handlePinClick} />
              <div style={{ margin: "12px 14px 14px", background: mapLayer==="emrs" ? "rgba(139,69,19,0.05)" : "rgba(45,106,79,0.05)", border: `1px solid ${mapLayer==="emrs" ? "rgba(139,69,19,0.12)" : "rgba(45,106,79,0.12)"}`, borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-around" }}>
                {(mapLayer==="emrs" ? [
                  { label: "Active", count: EMRS_PINS.filter(p => p.status==="Active").length, color: T.green },
                  
                  { label: "Total", count: EMRS_PINS.length, color: T.brown },
                ] : [
                  { label: "Infra", count: ASSET_PINS.filter(p => p.type==="infra").length, color: T.brownLight },
                  { label: "Road", count: ASSET_PINS.filter(p => p.type==="road").length, color: T.green },
                  { label: "Building", count: ASSET_PINS.filter(p => p.type==="building").length, color: T.purple },
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
                  {/* Image preview at top of selected-pin detail card */}
                  <div style={{ width: "100%", height: 140, overflow: "hidden" }}>
                    <img
                      src={selectedData.image || FALLBACK_IMG}
                      alt={selectedData.name}
                      onError={handleImgError}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div style={{ background: mapLayer==="emrs" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "linear-gradient(135deg,#1a3d2e,#2d6a4f)", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                    <BodoWeaveBackground opacity={0.1} color="#fff" />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{mapLayer==="emrs" ? "🏫" : assetTypeEmoji[selectedData.type]}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{selectedData.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>📍 {selectedData.district} District</div>
                    </div>
                    <button onClick={() => setSelectedPin(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>×</button>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    {mapLayer==="emrs" ? (
                      <>
                        {[
                          { icon: "🎓", label: "Students", value: `${selectedData.students} enrolled` },
                          { icon: "📚", label: "Classes", value: `Class ${selectedData.classes}` },
                          { icon: "👤", label: "Principal", value: selectedData.principal },
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

                        {/* NEW: Nearest transit + nearest EMRS distances */}
                        {(() => {
                          const nearestStation = findNearestPlace(selectedData.lat, selectedData.lng, ASSAM_RAILWAY_STATIONS);
                          const nearestAirport = findNearestPlace(selectedData.lat, selectedData.lng, ASSAM_AIRPORTS);
                          const nearestSchool = findNearestEMRS(selectedData, EMRS_PINS);
                          const distRows = [
                            { icon: "🚉", label: "Nearest Railway Station", value: nearestStation ? `${nearestStation.name} — ${formatKm(nearestStation.distance)}` : "—" },
                            { icon: "✈️", label: "Nearest Airport", value: nearestAirport ? `${nearestAirport.name} — ${formatKm(nearestAirport.distance)}` : "—" },
                            { icon: "🏫", label: "Nearest EMRS School", value: nearestSchool ? `${nearestSchool.name.replace("EMRS ","")} — ${formatKm(nearestSchool.distance)}` : "—" },
                          ];
                          return (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed rgba(139,69,19,0.15)` }}>
                              <div style={{ fontSize: 10, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontWeight: 700 }}>Nearby Distances</div>
                              {distRows.map((row, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "5px 0" }}>
                                  <span style={{ fontSize: 13, flexShrink: 0 }}>{row.icon}</span>
                                  <span style={{ fontSize: 11.5, color: "#5a3e28", lineHeight: 1.4 }}>{row.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        <button onClick={() => navigate("/emrs/login")} style={{ width: "100%", marginTop: 14, padding: "10px", background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Access EMRS Portal →</button>
                      </>
                    ) : (
                      <>
                        {[
                          { icon: assetTypeEmoji[selectedData.type], label: "Type", value: assetTypeLabel[selectedData.type] },
                          { icon: "💰", label: "Asset Value", value: selectedData.value },
                          { icon: "📅", label: "Year", value: selectedData.year },
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
                        <img
                          src={pin.image || FALLBACK_IMG}
                          alt={pin.name}
                          onError={handleImgError}
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(139,69,19,0.15)" }}
                        />
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
        <MugaStripeBackground opacity={0.2} />
        <BodoWeaveBackground opacity={0.08} color="#c8a84b" />
        <PeacockFeatherAccent style={{ right: 80, top: -40, width: 100, height: 200, opacity: 0.15 }} />
        <svg style={{ position: "absolute", bottom: -40, right: -20, opacity: 0.08, pointerEvents: "none" }} width="260" height="260" viewBox="0 0 260 260">
          <path d="M130 230 C70 200 40 140 70 70 C90 110 120 130 130 230 Z" fill="none" stroke="#c8a84b" strokeWidth="3" />
          <path d="M130 230 C190 200 220 140 190 70 C170 110 140 130 130 230 Z" fill="none" stroke="#c8a84b" strokeWidth="3" />
          <line x1="130" y1="230" x2="130" y2="100" stroke="#c8a84b" strokeWidth="2" />
        </svg>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#c8a84b 20%,#c0392b 50%,#c8a84b 80%,transparent)", marginBottom: 28, borderRadius: 1 }} />
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