/**
 * Geolocation Utilities
 * Calculate distances between coordinates and sort schools by proximity
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Sort schools by proximity to user location
 * @param {Array} schools - Array of school objects with lat/lng
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} - Schools sorted by distance (nearest first)
 */
export const sortSchoolsByProximity = (schools, userLat, userLon) => {
  if (!userLat || !userLon) return schools;
  
  const withDistance = schools.map((school) => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.lat, school.lng),
  }));
  
  return withDistance.sort((a, b) => a.distance - b.distance);
};

/**
 * Group schools by district
 * @param {Array} schools - Array of school objects
 * @returns {Object} - Schools grouped by district
 */
export const groupSchoolsByDistrict = (schools) => {
  return schools.reduce((groups, school) => {
    const district = school.district || "Unknown";
    if (!groups[district]) {
      groups[district] = [];
    }
    groups[district].push(school);
    return groups;
  }, {});
};

/**
 * Get nearest school from a list
 * @param {Array} schools - Array of school objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Object} - Nearest school or null
 */
export const getNearestSchool = (schools, userLat, userLon) => {
  if (!schools || schools.length === 0) return null;
  
  const sorted = sortSchoolsByProximity(schools, userLat, userLon);
  return sorted[0] || null;
};

/**
 * Get schools within a radius
 * @param {Array} schools - Array of school objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} radiusKm - Radius in kilometers (default 50km)
 * @returns {Array} - Schools within the specified radius
 */
export const getSchoolsWithinRadius = (schools, userLat, userLon, radiusKm = 50) => {
  if (!userLat || !userLon) return schools;
  
  return schools.filter((school) => {
    const distance = calculateDistance(userLat, userLon, school.lat, school.lng);
    return distance <= radiusKm;
  });
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (!distance) return "Unknown distance";
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance} km`;
};

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<Object>} - Object with latitude and longitude
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

/**
 * Create a school selector with proximity information
 * @param {Array} schools - Array of school objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} - Schools with proximity metadata
 */
export const enhanceSchoolsWithProximity = (schools, userLat, userLon) => {
  if (!userLat || !userLon) return schools;
  
  return schools.map((school) => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.lat, school.lng),
    distanceDisplay: formatDistance(
      calculateDistance(userLat, userLon, school.lat, school.lng)
    ),
    isNearby: calculateDistance(userLat, userLon, school.lat, school.lng) <= 10, // Within 10km
  }));
};

/**
 * Get school recommendations based on user location and preferences
 * @param {Array} schools - Array of school objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {Object} preferences - User preferences (filters)
 * @returns {Array} - Recommended schools
 */
export const getSchoolRecommendations = (schools, userLat, userLon, preferences = {}) => {
  let filtered = [...schools];
  
  // Filter by status if specified
  if (preferences.status) {
    filtered = filtered.filter((s) => s.status === preferences.status);
  }
  
  // Filter by district if specified
  if (preferences.district) {
    filtered = filtered.filter((s) => s.district === preferences.district);
  }
  
  // Filter by classes if specified
  if (preferences.classes) {
    filtered = filtered.filter((s) => s.classes === preferences.classes);
  }
  
  // Sort by proximity
  const withDistance = filtered.map((school) => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.lat, school.lng),
  }));
  
  return withDistance.sort((a, b) => a.distance - b.distance);
};
