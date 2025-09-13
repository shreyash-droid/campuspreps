"use client";

import { useState } from "react";
import Image from "next/image";
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-[100%] mx-auto ">
      {/* Decorative SVGs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/trophy.svg" // ✅ no 'public' in path
          alt="Trophy"
          width={140}
          height={140}
          className="absolute top-[-20px] right-[21%] opacity-100 rotate-342"
        />
        <Image
          src="/office.svg" // ✅ no 'public' in path
          alt="Office"
          width={140}
          height={140}
          className="absolute top-[-20px] right-[16%] opacity-100"
        />
        <Image
          src="/cap.svg" // ✅ no 'public' in path
          alt="Cap"
          width={160}
          height={160}
          className="absolute top-[-20px] right-[8%] opacity-100 rotate-12"
        />
        <Image
          src="/book.svg"
          alt="Book"
          width={140}
          height={140}
          className="absolute bottom-[-20px] right-[1%] opacity-100 rotate-10"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-sm px-8 py-2 flex items-center justify-between">
        {/* Title */}
        <Link
          href="/"
          className="text-white text-2xl sm:text-3xl font-semibold font-roboto"
        >
          <a>Campus Preps</a>
        </Link>

        {/* User Icon or Avatar */}
        <button className="w-16 h-16 rounded-full bg-none flex items-center justify-center">
        <Image
          src="/profile.svg"
          alt="Profile"
          width={15}
          height={15}
          className="relative scale-380 opacity-100 shadow-black"
        />
        </button>
      </nav>
    </div>
  );
}
