const EMRS_AUTH_BASE = "http://localhost:5000/api/emrs/auth";

export const emrsLogin = async (username, password) => {
  const res = await fetch(`${EMRS_AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid username or password");
  }

  return data;
};

export const fetchEmrsSchools = async () => {
  const res = await fetch(`${EMRS_AUTH_BASE}/schools`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load schools");
  }

  return data.schools;
};
