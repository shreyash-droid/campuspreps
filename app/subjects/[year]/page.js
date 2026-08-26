"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/navbar";
import AuroraBackground from "../../components/AuroraBackground";
import { getAllSubjectsForYear } from "../../data/subjectData";

const ordinal = { "1": "First", "2": "Second", "3": "Third", "4": "Fourth" };

export default function SubjectPage() {
  const { year } = useParams();
  // Derive the subject list straight from the data so every link resolves.
  const subjects = Object.entries(getAllSubjectsForYear(year)).map(([slug, info]) => ({
    slug,
    name: info.name,
    count: info.modules?.length || 0,
  }));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-[var(--fg)]">
      <AuroraBackground />
      <Navbar />

      <section className="mx-auto w-[92%] max-w-5xl pt-10 pb-12">
        <Link
          href="/select-year"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-3.5 py-1.5 text-sm text-[var(--fg-2)] transition hover:text-[var(--fg)]"
        >
          <ArrowLeft className="h-4 w-4" /> Year select
        </Link>

        <div className="mt-10 mb-10">
          <span className="eyebrow">{ordinal[year] || year} Year</span>
          <h1 className="display mt-3 text-4xl md:text-5xl">Choose a subject</h1>
        </div>

        {subjects.length === 0 ? (
          <p className="text-[var(--fg-2)]">No subjects found for this year.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/subjects/${year}/${subject.slug}`}
                className="card-surface group flex items-center justify-between rounded-2xl px-6 py-5"
              >
                <div>
                  <span className="text-lg font-medium text-[var(--fg)]">{subject.name}</span>
                  <p className="mt-0.5 text-sm text-[var(--fg-3)]">{subject.count} modules</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[var(--fg-3)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
