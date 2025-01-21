import { useState } from "react";

// Base URL de l'API
console.log("API Base URL:", import.meta.env.VITE_API_URL);
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null); // État pour les erreurs


  // Fonction pour connecter un utilisateur
  const loginUser = async (credentials: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Stocke le token
      setError(null); // Réinitialise les erreurs
      return true; // Succès
    } catch (err) {
      setError((err as Error).message || "An error occurred during login");
      return false; // Échec
    }
  };

  // Fonction pour enregistrer un nouvel utilisateur
  const registerUser = async (userDetails: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Stocke le token après l'inscription
      setError(null); // Réinitialise les erreurs
      return true; // Succès
    } catch (err) {
      setError((err as Error).message || "An error occurred during registration");
      return false;
    }
  };

  // Fonction pour déconnecter un utilisateur
  const logout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setError(null); // Réinitialise les erreurs
  };

  return { loginUser, registerUser, logout, error }; // Retourne les fonctions et erreurs
};
