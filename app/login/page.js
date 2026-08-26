"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import AuroraBackground from "../components/AuroraBackground";

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41 35.6 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white/[0.03] px-4 py-3 text-[16px] text-[var(--fg)] placeholder:text-[var(--fg-3)] outline-none transition focus:border-[var(--accent)]/70 focus:bg-white/[0.05]";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();

  const callbackUrl = params.get("callbackUrl") || "/";
  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, callbackUrl, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode(isSignup ? "login" : "signup");
    setError("");
  };

  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center px-5 py-10">
      <AuroraBackground />

      <div className="reveal-in w-full max-w-[26rem]">
        {/* Brand */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 transition-opacity hover:opacity-80">
            <Image src="/cap.svg" alt="Campus Preps" width={38} height={38} />
          </Link>
          <span className="eyebrow">{isSignup ? "Create account" : "Sign in"}</span>
          <h1 className="display mt-3 text-3xl text-[var(--fg)]">
            {isSignup ? "Join Campus Preps" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-[var(--fg-2)]">
            {isSignup ? "A minute to set up. Then you're prepping." : "Sign in to pick up where you left off."}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="btn-ghost focus-ring flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-medium"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--fg-3)]">
          <div className="h-px flex-1 bg-[var(--line)]" />
          or
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {isSignup && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" disabled={loading} className={inputClass} />
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" disabled={loading} className={inputClass} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} className={inputClass} />

          {error && (
            <div className="rounded-lg border border-[#d98c74]/25 bg-[#d98c74]/10 px-3 py-2 text-sm text-[#e0a38f]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary focus-ring mt-1 rounded-xl py-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--fg-2)]">
          {isSignup ? "Already have an account? " : "New to Campus Preps? "}
          <button onClick={toggle} className="font-medium text-[var(--accent)] transition hover:opacity-80">
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--ink)]" />}>
      <LoginInner />
    </Suspense>
  );
}
