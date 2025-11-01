"use client";

import React, { useState } from "react";
import { loginUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose, onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const validateVITEmail = (email) => {
    return email.toLowerCase().endsWith('@vitstudent.ac.in');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    if (!validateVITEmail(email)) {
      setError("Please use your VIT email address");
      return;
    }

    try {
      setLoading(true);
      const userData = await loginUser({ email, password });
      setUser(userData);
      onLogin();
      onClose();
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-none bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-[90%] max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-xl font-bold">
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="VIT email-id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded text-black placeholder-gray-500"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded text-black placeholder-gray-500"
            disabled={loading}
          />

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Not an existing user?{" "}
          <button onClick={switchToSignup} className="text-purple-600 underline">
            Sign-up
          </button>
        </p>
      </div>
    </div>
  );
}
