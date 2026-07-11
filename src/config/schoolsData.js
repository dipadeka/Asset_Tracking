/**
 * Shared Schools and Assets Data Configuration
 * Used by ApplyOnline.jsx, homepage.jsx, and other components
 * Eliminates duplicate data across the application
 */

const FALLBACK_IMG = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500";

// ─────────────────────────────────────────────────────────────────────────────
// EMRS SCHOOLS DATA (consolidated for reuse across components)
// ─────────────────────────────────────────────────────────────────────────────
export const EMRS_SCHOOLS = [
  { name: "EMRS Dalbari, Barama", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. R. Basumatary", lat: 26.4500, lng: 90.8500, image: "/images/emrs-dalbari-school.jpeg" },
  { name: "EMRS Jalah, Vill. Daodhara", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Mr. K. Boro", lat: 26.4600, lng: 90.8600, image: "/images/emrs-jalah-morning-assembly.png" },
  { name: "EMRS Sarupeta, Vill Tatikuchi", district: "Baksa", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. I. Narzary", lat: 26.4400, lng: 90.8400, image: FALLBACK_IMG },
  { name: "EMRS Kharadhara", district: "Bajali", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Ms. P. Devi", lat: 26.6700, lng: 91.1800, image: "/images/emrs-kharadhara-inauguration.png" },
  { name: "EMRS Bedlangmari", district: "Kokrajhar", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. A. Gogoi", lat: 26.4000, lng: 90.2600, image: "/images/emrs-bedlangmari-schoolbuilding.png" },
  { name: "EMRS Howraghat", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Dr. S. Terang", lat: 26.0900, lng: 93.3000, image: "/images/emrs-howraghat-schoolbuilding.png" },
  { name: "EMRS Phuloni, Donghap", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. K. Hmar", lat: 25.3000, lng: 92.8000, image: FALLBACK_IMG },
  { name: "EMRS Silonijan, Thengkur Terang", district: "Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Ms. N. Das", lat: 26.04, lng: 93.63, image: FALLBACK_IMG },
  { name: "EMRS Donka, Taralangsho", district: "West Karbi Anglong", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. B. Bora", lat: 24.90, lng: 92.69, image: FALLBACK_IMG },
  { name: "EMRS Jonai, Purana Jhelom", district: "Dhemaji", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Ms. R. Choudhury", lat: 27.2300, lng: 94.1100, image: "/images/emrs-jonai-building.png" },
  { name: "EMRS Haflong, Ardaopur", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Functional", principal: "Mr. D. Phukan", lat: 25.1633, lng: 93.0128, image: "/images/emrs-ardaopur-schoolbuilding.png" },
  { name: "EMRS Umrangso", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "TBD", lat: 25.51, lng: 92.73, image: "/images/emrs-umrangsho-aerialview.png" },
  { name: "EMRS Harangajao", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Ms. A. Kalita", lat: 25.09, lng: 92.84, image: FALLBACK_IMG },
  { name: "EMRS Diyungbra", district: "Dima Hasao", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.62, lng: 92.91, image: FALLBACK_IMG },
  { name: "EMRS Boko", district: "Kamrup", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.95, lng: 91.2040, image: "/images/emrs-boko-schoolbuilding.png" },
  { name: "EMRS Dudhnoi, Jakhuwapara", district: "Goalpara", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 25.9500, lng: 90.9010, image: FALLBACK_IMG },
  { name: "EMRS Khairabari, Malmura", district: "Udalguri", students: 300, cap: 300, classes: "VI-XII", status: "Non-Functional", principal: "Mr. P. Hazarika", lat: 26.6400, lng: 91.7500, image: FALLBACK_IMG },
];

// ─────────────────────────────────────────────────────────────────────────────
// ASSET PINS DATA
// ─────────────────────────────────────────────────────────────────────────────
export const ASSET_PINS = [
  { name: "Kamrup Asset Hub", district: "Kamrup", type: "infra", value: "₹4.2Cr", status: "Active", year: 2023, lat: 26.1700, lng: 91.7700, image: FALLBACK_IMG },
  { name: "Tezpur Road Project", district: "Sonitpur", type: "road", value: "₹2.8Cr", status: "In Progress", year: 2024, lat: 26.6300, lng: 92.7900, image: FALLBACK_IMG },
  { name: "Jorhat Infra Store", district: "Jorhat", type: "infra", value: "₹3.1Cr", status: "Active", year: 2022, lat: 26.7500, lng: 94.2000, image: FALLBACK_IMG },
  { name: "Dibrugarh Warehouse", district: "Dibrugarh", type: "building", value: "₹5.6Cr", status: "Active", year: 2021, lat: 27.4800, lng: 94.9100, image: FALLBACK_IMG },
  { name: "Nagaon Construction", district: "Nagaon", type: "building", value: "₹1.9Cr", status: "In Progress", year: 2024, lat: 26.3500, lng: 92.6900, image: FALLBACK_IMG },
  { name: "Barpeta Road Network", district: "Barpeta", type: "road", value: "₹2.2Cr", status: "Active", year: 2023, lat: 26.3200, lng: 91.0000, image: FALLBACK_IMG },
  { name: "Cachar Asset Depot", district: "Cachar", type: "infra", value: "₹3.4Cr", status: "Active", year: 2022, lat: 24.8200, lng: 92.7800, image: FALLBACK_IMG },
  { name: "Dhubri Bridge Project", district: "Dhubri", type: "road", value: "₹6.0Cr", status: "Non-Functional", year: 2025, lat: 26.0200, lng: 89.9800, image: FALLBACK_IMG },
  { name: "Sivasagar Heritage", district: "Sivasagar", type: "building", value: "₹4.8Cr", status: "Active", year: 2020, lat: 26.9800, lng: 94.6400, image: FALLBACK_IMG },
  { name: "Kokrajhar Dev Store", district: "Kokrajhar", type: "infra", value: "₹1.5Cr", status: "Active", year: 2023, lat: 26.4000, lng: 90.2700, image: FALLBACK_IMG },
];

// ─────────────────────────────────────────────────────────────────────────────
// RAILWAY STATIONS DATA
// ─────────────────────────────────────────────────────────────────────────────
export const ASSAM_RAILWAY_STATIONS = [
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

// ─────────────────────────────────────────────────────────────────────────────
// AIRPORTS DATA
// ─────────────────────────────────────────────────────────────────────────────
export const ASSAM_AIRPORTS = [
  { name: "Lokpriya Gopinath Bordoloi Intl. Airport, Guwahati", lat: 26.1061, lng: 91.5859 },
  { name: "Dibrugarh Airport (Mohanbari)", lat: 27.4839, lng: 95.0169 },
  { name: "Jorhat Airport", lat: 26.7315, lng: 94.1754 },
  { name: "Silchar Airport (Kumbhirgram)", lat: 24.9129, lng: 92.9787 },
  { name: "Tezpur Airport (Salonibari)", lat: 26.7091, lng: 92.7847 },
  { name: "Lilabari Airport (North Lakhimpur)", lat: 27.2954, lng: 94.0974 },
];

// ─────────────────────────────────────────────────────────────────────────────
// EMRS CIVIC INFORMATION
// ─────────────────────────────────────────────────────────────────────────────
export const EMRS_CIVIC_INFO = {
  "EMRS Dalbari, Barama": {
    pincode: "781360",
    districtHQ: "Mushalpur",
    policeStation: "Barama Police Station",
    postOffice: "Barama Post Office",
  },
  "EMRS Jalah, Vill. Daodhara": {
    pincode: "781372",
    districtHQ: "Mushalpur",
    policeStation: "Baksa Police Station",
    postOffice: "Jalah Post Office",
  },
  "EMRS Sarupeta, Vill Tatikuchi": {
    pincode: "781317",
    districtHQ: "Mushalpur",
    policeStation: "Sarupeta Police Station",
    postOffice: "Sarupeta Post Office",
  },
  "EMRS Kharadhara": {
    pincode: "781348",
    districtHQ: "Pathsala",
    policeStation: "Bajali Police Station",
    postOffice: "Pathsala Post Office",
  },
  "EMRS Bedlangmari": {
    pincode: "783335",
    districtHQ: "Kokrajhar",
    policeStation: "Kokrajhar Police Station",
    postOffice: "Kokrajhar Head Post Office",
  },
  "EMRS Howraghat": {
    pincode: "782446",
    districtHQ: "Diphu",
    policeStation: "Howraghat Police Station",
    postOffice: "Howraghat Post Office",
  },
  "EMRS Phuloni, Donghap": {
    pincode: "782447",
    districtHQ: "Diphu",
    policeStation: "Donghap Police Outpost",
    postOffice: "Diphu Head Post Office",
  },
  "EMRS Silonijan, Thengkur Terang": {
    pincode: "782480",
    districtHQ: "Diphu",
    policeStation: "Silonijan Police Station",
    postOffice: "Silonijan Post Office",
  },
  "EMRS Donka, Taralangsho": {
    pincode: "782490",
    districtHQ: "Hamren",
    policeStation: "Hamren Police Station",
    postOffice: "Hamren Post Office",
  },
  "EMRS Jonai, Purana Jonai": {
    pincode: "787060",
    districtHQ: "Dhemaji",
    policeStation: "Jonai Police Station",
    postOffice: "Jonai Post Office",
  },
  "EMRS Haflong, Ardaopur": {
    pincode: "788819",
    districtHQ: "Haflong",
    policeStation: "Haflong Police Station",
    postOffice: "Haflong Head Post Office",
  },
  "EMRS Umrangso": {
    pincode: "788931",
    districtHQ: "Haflong",
    policeStation: "Umrangso Police Station",
    postOffice: "Umrangso Post Office",
  },
  "EMRS Harangajao": {
    pincode: "788815",
    districtHQ: "Haflong",
    policeStation: "Harangajao Police Outpost",
    postOffice: "Harangajao Post Office",
  },
  "EMRS Diyungbra": {
    pincode: "788830",
    districtHQ: "Haflong",
    policeStation: "Diyungbra Police Outpost",
    postOffice: "Diyungbra Post Office",
  },
  "EMRS Boko": {
    pincode: "781123",
    districtHQ: "Amingaon",
    policeStation: "Boko Police Station",
    postOffice: "Boko Post Office",
  },
  "EMRS Dudhnoi, Jakhuwapara": {
    pincode: "783124",
    districtHQ: "Goalpara",
    policeStation: "Dudhnoi Police Station",
    postOffice: "Dudhnoi Post Office",
  },
  "EMRS Khairabari, Malmura": {
    pincode: "784509",
    districtHQ: "Udalguri",
    policeStation: "Khairabari Police Station",
    postOffice: "Khairabari Post Office",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STAFF DATA
// ─────────────────────────────────────────────────────────────────────────────
export const STAFF_DATA = [
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

// ─────────────────────────────────────────────────────────────────────────────
// HOSTEL WARDENS
// ─────────────────────────────────────────────────────────────────────────────
export const HOSTEL_WARDENS = [
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

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE RANKING
// ─────────────────────────────────────────────────────────────────────────────
export const ATT_RANKING = [96.2, 93.8, 92.1, 91.4, 90.7, 89.3, 88.9, 87.4, 86.1, 85.8, 85.2, 84.9, 83.7, 82.1, 81.4, 79.8, 77.2];

// ─────────────────────────────────────────────────────────────────────────────
// HERO SCROLL IMAGES
// ─────────────────────────────────────────────────────────────────────────────
export const HERO_SCROLL_IMAGES = [
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
];

export { FALLBACK_IMG };
