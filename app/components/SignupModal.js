"use client";

import { useState } from "react";

export default function SignupModal({ onClose, onSignup, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (name && email && password) {
      console.log("Signed up with:", name, email);
      localStorage.setItem("loggedIn", "true");
      onSignup();
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

        <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded text-black placeholder-gray-500"
          />
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
            Sign Up
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Already an existing user?{" "}
          <button onClick={switchToLogin} className="text-purple-600 underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
