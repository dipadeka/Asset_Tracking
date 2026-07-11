/**
 * Geo Helper Functions and Utilities
 * Used by homepage.jsx and other map-based components
 * Eliminates duplicate calculation and helper functions
 */

import { EMRS_CIVIC_INFO, FALLBACK_IMG } from "../config/schoolsData";

/**
 * Calculate Haversine distance in km between two coordinates
 */
export const haversineKm = (lat1, lng1, lat2, lng2) => {
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
};

/**
 * Find nearest place in a list to given coordinates
 */
export const findNearestPlace = (lat, lng, list) => {
  let best = null;
  list.forEach((p) => {
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d === null) return;
    if (!best || d < best.distance) best = { ...p, distance: d };
  });
  return best;
};

/**
 * Find nearest EMRS school to a given school (excluding itself)
 */
export const findNearestEMRS = (pin, allPins) => {
  let best = null;
  allPins.forEach((p) => {
    if (p.name === pin.name) return;
    const d = haversineKm(pin.lat, pin.lng, p.lat, p.lng);
    if (d === null) return;
    if (!best || d < best.distance) best = { ...p, distance: d };
  });
  return best;
};

/**
 * Format distance in km to readable string
 */
export const formatKm = (km) => (km == null ? "—" : `${km.toFixed(1)} km`);

/**
 * Get civic information for a school
 */
export const getCivicInfo = (pinName) => {
  return (
    EMRS_CIVIC_INFO[pinName] || {
      pincode: "—",
      districtHQ: "—",
      policeStation: "—",
      postOffice: "—",
    }
  );
};

/**
 * Handle image loading error with fallback
 */
export const handleImgError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK_IMG;
};
