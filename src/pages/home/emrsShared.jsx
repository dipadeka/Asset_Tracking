// ─────────────────────────────────────────────────────────────────────────────
// SHARED MODULE
// Holds the constants/components that BOTH homepage.jsx and ApplyOnline.jsx
// need (T, EMRS_PINS, BodoWeaveBackground). This file must not import
// anything from homepage.jsx or ApplyOnline.jsx — its only job is to sit
// "below" both of them so neither has to import from the other.
//
// Why this file exists: homepage.jsx imports ApplyOnlineModal from
// ApplyOnline.jsx, and ApplyOnline.jsx used to import { T, EMRS_PINS,
// BodoWeaveBackground } back from homepage.jsx. That's a circular import —
// in ESM, when homepage.jsx starts loading, it immediately loads
// ApplyOnline.jsx (top-of-file import) before homepage.jsx's own `const T`
// has been initialized, so ApplyOnline.jsx sees T as undefined/TDZ and
// throws "Cannot access 'T' before initialization". Moving the shared
// pieces here breaks the cycle: homepage.jsx -> ApplyOnline.jsx -> here,
// and homepage.jsx -> here, with no edge going back from ApplyOnline.jsx
// or here into homepage.jsx.
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_IMG = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500";

export const EMRS_PINS = [
  { name: "EMRS Dalbari, Barama", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. R. Basumatary", lat: 26.4500, lng: 90.8500, image: "/images/emrs-dalbari-school.jpeg" },
  { name: "EMRS Jalah, Vill. Daodhara", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Mr. K. Boro", lat: 26.4600, lng: 90.8600, image: "/images/emrs-jalah-morning-assembly.png" },
  { name: "EMRS Sarupeta, Vill Tatikuchi", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. I. Narzary", lat: 26.4400, lng: 90.8400, image: FALLBACK_IMG },
  { name: "EMRS Kharadhara", district: "Bajali", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Ms. P. Devi", lat: 26.6700, lng: 91.1800, image: "/images/emrs-kharadhara-inauguration.png" },
  { name: "EMRS Bedlangmari", district: "Kokrajhar", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. A. Gogoi", lat: 26.4000, lng: 90.2600, image: "images/emrs-bedlangmari-schoolbuilding.png" },
  { name: "EMRS Howraghat", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Dr. S. Terang", lat: 26.0900, lng: 93.3000, image: "/images/emrs-howraghat-schoolbuilding.png" },
  { name: "EMRS Phuloni, Donghap", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. K. Hmar", lat: 25.3000, lng: 92.8000, image: FALLBACK_IMG },
  { name: "EMRS Silonijan, Thengkur Terang", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Ms. N. Das", lat: 26.04, lng: 93.63, image: FALLBACK_IMG },
  { name: "EMRS Donka, Taralangsho", district: "West Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: " Non-Functional", principal: "Mr. B. Bora", lat: 24.90, lng: 92.69, image: FALLBACK_IMG },
  { name: "EMRS Jonai, Purana Jhelom", district: "Dhemaji", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Ms. R. Choudhury", lat: 27.2300, lng: 94.1100, image: "/images/emrs-jonai-building.png" },
  { name: "EMRS Haflong, Ardaopur", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Mr. D. Phukan", lat: 25.1633, lng: 93.0128, image: "images/emrs-ardaopur-schoolbuilding.png" },
  { name: "EMRS Umrangso", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "TBD", lat: 25.51, lng: 92.73, image: "/images/emrs-umrangsho-aerialview.png" },
  { name: "EMRS Harangajao", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Ms. A. Kalita", lat: 25.09, lng: 92.84, image: FALLBACK_IMG },
  { name: "EMRS Diyungbra", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.62, lng: 92.91, image: FALLBACK_IMG },
  { name: "EMRS Boko", district: "Kamrup", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.95, lng: 91.2040, image: "/images/emrs-boko-schoolbuilding.png" },
  { name: "EMRS Dudhnoi, Jakhuwapara", district: "Goalpara", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.9500, lng: 90.9010, image: FALLBACK_IMG },
  { name: "EMRS Khairabari, Malmura", district: "Udalguri", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 26.6400, lng: 91.7500, image: FALLBACK_IMG },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const T = {
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

// Bodo weave diamond lattice (used by BodoWeaveBackground below)
function makeBodoWeave(color = "#8b4513", size = 32) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='none'/><polygon points='${size/2},2 ${size-2},${size/2} ${size/2},${size-2} 2,${size/2}' fill='none' stroke='${color}' stroke-width='0.9' opacity='1'/><circle cx='${size/2}' cy='${size/2}' r='1.5' fill='${color}' opacity='0.7'/><circle cx='0' cy='0' r='1' fill='${color}' opacity='0.5'/><circle cx='${size}' cy='0' r='1' fill='${color}' opacity='0.5'/><circle cx='0' cy='${size}' r='1' fill='${color}' opacity='0.5'/><circle cx='${size}' cy='${size}' r='1' fill='${color}' opacity='0.5'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function BodoWeaveBackground({ opacity = 0.045, color = "#8b4513" }) {
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