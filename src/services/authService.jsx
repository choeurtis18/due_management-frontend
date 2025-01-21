const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const login = async (credentials) => {
  console.log(credentials)
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // Retourne le token et l'utilisateur
};

export const register = async (userDetails) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};
