import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser, error } = useAuth();
  const [userDetails, setUserDetails] = useState({ username: "", email: "", password: "", role: "USER" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await registerUser(userDetails); // Appelle la fonction registerUser
    if (success) {
      navigate("/dashboard"); // Redirige l'utilisateur après l'inscription
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 p-4 bg-white shadow-md">
        <h1 className="mb-4 text-lg font-bold">Register</h1>
        {error && <div className="text-red-600">{error}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userDetails.username}
          onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userDetails.password}
          onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
