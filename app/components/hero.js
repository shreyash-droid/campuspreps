"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { user, isAuthenticated, login } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <section className="relative z-10 flex w-full flex-col items-center justify-center gap-10 px-6 pb-20 pt-16 md:px-16 md:pb-24 md:pt-20 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
      {/* Copy */}
      <div className="z-10 flex flex-col items-start text-left lg:max-w-[400px] xl:max-w-[460px] 2xl:max-w-[540px]">
        <span className="reveal-in eyebrow flex items-center gap-2.5">
          <span className="h-px w-6 bg-[var(--accent)]" />
          {isAuthenticated ? `Welcome back${firstName ? `, ${firstName}` : ""}` : "Exam preparation, refined"}
        </span>

        <h1
          className="reveal-in display mt-7 text-[2.6rem] text-[var(--fg)] md:text-[4.2rem]"
          style={{ animationDelay: "80ms" }}
        >
          {isAuthenticated ? (
            <>
              Pick up right
              <br />
              where you{" "}
              <em className="display-italic text-[var(--accent)]">left&nbsp;off</em>.
            </>
          ) : (
            <>
              Your <em className="display-italic text-[var(--accent)]">one&#8209;stop</em>
              <br />
              solution for every
              <br />
              preparation.
            </>
          )}
        </h1>

        <p
          className="reveal-in mt-7 max-w-md text-lg leading-relaxed text-[var(--fg-2)]"
          style={{ animationDelay: "160ms" }}
        >
          Previous-year papers, curated study material and hand-picked video lectures — organised by
          year and subject, all in one quiet place.
        </p>

        <div
          className="reveal-in mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          {isAuthenticated ? (
            <Link
              href="/select-year"
              className="btn-primary focus-ring group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-medium"
            >
              Start Preparing
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <button
                onClick={login}
                className="btn-primary focus-ring group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-medium"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <Link
                href="/select-year"
                className="btn-ghost focus-ring rounded-full px-8 py-3.5 text-base font-medium"
              >
                Browse resources
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Decorative art — fluid cluster; figures overlap each other, never the copy */}
      <div className="relative z-10 flex w-full items-end justify-center lg:w-[clamp(300px,37vw,860px)]">
        <Image
          src="/left_man.svg"
          alt=""
          width={150}
          height={200}
          className="float-y h-auto w-[42%] origin-bottom -rotate-[14deg] opacity-95"
          style={{ animationDelay: "0.4s" }}
        />
        <Image
          src="/centre_man.svg"
          alt=""
          width={150}
          height={200}
          className="float-y z-10 -mx-[24%] h-auto w-[60%] -translate-y-3"
        />
        <Image
          src="/right_man.svg"
          alt=""
          width={150}
          height={200}
          className="float-y h-auto w-[42%] origin-bottom rotate-[14deg] opacity-95"
          style={{ animationDelay: "0.8s" }}
        />
      </div>
    </section>
  );
}
