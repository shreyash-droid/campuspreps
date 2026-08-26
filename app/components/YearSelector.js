"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getAllSubjectsForYear } from "../data/subjectData";

const years = [
  { title: "First Year", image: "/1st.png" },
  { title: "Second Year", image: "/2nd.png" },
  { title: "Third Year", image: "/3rd.png" },
  { title: "Fourth Year", image: "/4th.png" },
];

export default function YearSelector() {
  return (
    <section className="mx-auto w-[92%] max-w-6xl pt-10 pb-12 text-[var(--fg)]">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-3.5 py-1.5 text-sm text-[var(--fg-2)] transition hover:text-[var(--fg)]"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>

      <div className="mt-10 mb-10 text-center">
        <span className="eyebrow">Browse resources</span>
        <h1 className="display mt-3 text-4xl md:text-5xl">Select your year</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {years.map((year, index) => {
          const subjects = Object.values(getAllSubjectsForYear(index + 1)).map((s) => s.name);
          return (
            <Link href={`/subjects/${index + 1}`} key={index} className="group">
              <div className="card-surface h-full rounded-3xl p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-[var(--line-strong)]">
                    <Image
                      src={year.image}
                      alt={year.title}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ChevronRight className="h-5 w-5 text-[var(--fg-3)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                </div>

                <h3 className="display text-xl text-[var(--fg)]">{year.title}</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[var(--line)] bg-white/[0.03] px-3 py-1 text-xs text-[var(--fg-2)]"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
