import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Importez useNavigate

const Login = () => {
  const { loginUser, error } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialisez useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(credentials);
    if (success) {
      navigate("/dashboard"); 
    }
  };

  return (
    <div className='lg:pl-72'>
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="w-1/3 p-4 bg-white shadow-md">
          <h1 className="mb-4 text-lg font-bold">Connexion</h1>
          {error && <div className="text-red-600">{error}</div>}
          <input
            type="email"
            name="email"
            placeholder="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="block w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
