"use client";

import React, { useState } from "react";

export default function LoginModal({ onClose, onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      console.log("Logged in with:", email);
      localStorage.setItem("loggedIn", "true");
      onLogin();
      onClose();
    } else {
      alert("Please fill in all fields!");
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded text-black placeholder-gray-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Login
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
