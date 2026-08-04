// src/utils/monthlyActivityStore.js
//
// Lightweight persistence layer for "Monthly Activity" submissions.
//
// WHY localStorage: no backend endpoint was provided for this feature.
// Everything is namespaced by the current user's id/role, so switching
// logins (Admin / Principal / Warden / etc.) never mixes up data.
//
// If/when a real API exists for this, swap the bodies of the functions
// below for fetch() calls — every call site in the app only talks to
// this file, so nothing else needs to change.

const STORAGE_PREFIX = "emrs_monthly_activity__";

/**
 * Tries a handful of common places an app stores "who is logged in".
 * Adjust this ONE function if your auth system stores the user differently
 * (e.g. inside a React AuthContext) — everything else here just calls it.
 */
export const getCurrentUserId = () => {
  const candidateKeys = ["userId", "user_id", "username", "user", "authUser", "emrsUser"];

  for (const key of candidateKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      const id = parsed?.id || parsed?.userId || parsed?.username || parsed?.email;
      if (id) return String(id);
    } catch {
      // it wasn't JSON, just a plain string — use it directly
      return raw;
    }
  }

  return "guest";
};

const getStorageKey = (userId) => `${STORAGE_PREFIX}${userId || getCurrentUserId()}`;

const readAll = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (userId, list) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
  return list;
};

/** All submissions for a user, most recent first. */
export const getSubmissions = (userId) => {
  return readAll(userId).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

/**
 * Saves (or overwrites) the submission for a given month/year.
 * Re-submitting the same month updates that entry instead of duplicating it.
 */
export const saveSubmission = (submission, userId) => {
  const existing = readAll(userId);
  const filtered = existing.filter(
    (s) => !(s.month === submission.month && s.year === submission.year)
  );

  const entry = {
    id: `${submission.year}-${submission.month}`,
    submittedAt: new Date().toISOString(),
    ...submission,
  };

  return writeAll(userId, [...filtered, entry]);
};

export const deleteSubmission = (id, userId) => {
  const existing = readAll(userId);
  return writeAll(
    userId,
    existing.filter((s) => s.id !== id)
  );
};

/** Groups submissions by year, e.g. { 2026: [...], 2025: [...] } */
export const groupByYear = (submissions) => {
  return submissions.reduce((acc, s) => {
    const year = s.year || "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(s);
    return acc;
  }, {});
};