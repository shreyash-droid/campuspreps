"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Hero() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleLogin = () => {
    setShowLogin(false);
  };

  const handleSignup = () => {
    setShowSignup(false);
  };

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between mt-24 md:mt-32 px-6 md:px-20 z-10">
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          switchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSignup={handleSignup}
          switchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      <div className="flex flex-col items-start text-white z-10 text-left">
        <h2 className="text-3xl md:text-6xl font-extrabold mb-4 font-roboto">Hello!!</h2>
        <p className="text-3xl md:text-5xl leading-snug mb-10 font-roboto">
          Welcome to your <span className="font-bold text-blue-600">one</span> <br />
          <span className="font-bold text-blue-600">stop solution</span> for all<br />
          the preparations..
        </p>

        {isAuthenticated ? (
          <Link
            href="/select-year"
            className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white text-xl md:text-2xl font-medium py-5 px-10 rounded-full shadow-lg"
          >
            Start Preparing →
          </Link>
        ) : (
          <div className="flex flex-col md:flex-row gap-5 w-full md:w-auto">
            <button
              onClick={() => setShowSignup(true)}
              className="bg-blue-600 hover:bg-blue-700 hover:scale-110 transition duration-300 text-white text-xl md:text-2xl font-medium py-4 px-10 rounded-full shadow-lg"
            >
              Sign-up
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-none hover:bg-gray-800 hover:scale-110 transition duration-300 text-white text-xl md:text-2xl font-medium py-4 px-10 rounded-full border-2 border-white shadow-amber-50"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Decorative Images & Blurs */}
      <div className="relative flex items-end justify-center mt-10 z-10 gap-[-20px]">
        <Image src="/left_man.svg" alt="Left Man" width={150} height={200} className="z-0 scale-200 -rotate-[30deg] -translate-x-35" />
        <Image src="/centre_man.svg" alt="Center Man" width={150} height={200} className="z-10 scale-300 -translate-x-30 -translate-y-15" />
        <Image src="/right_man.svg" alt="Right Man" width={150} height={200} className="z-0 scale-200 rotate-[30deg] -translate-x-25" />
      </div>

      <div className="absolute w-[400px] h-[400px] top-[-100px] left-[-50px] rounded-[764px] bg-[radial-gradient(circle,_rgba(64,_120,_225,_0.7),_transparent)] blur-[100px] z-0" />
      <div className="absolute w-[600px] h-[600px] bottom-[-100px] right-[130px] rounded-[764px] bg-[radial-gradient(circle,_rgba(255,_43,_255,_0.7),_transparent)] blur-[100px] z-0" />
    </section>
  );
}
