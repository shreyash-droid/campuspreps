"use client";

import Link from "next/link";
import { ExternalLink, FileText, BookOpen, Youtube } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import Navbar from "../components/navbar";
import AuroraBackground from "../components/AuroraBackground";

const SECTIONS = [
  { key: "notes", title: "Module Notes", icon: BookOpen, label: (i) => `Module ${i.moduleNumber}` },
  { key: "questionPapers", title: "Question Papers", icon: FileText, label: (i) => i.title },
  { key: "youtubeLinks", title: "YouTube Links", icon: Youtube, label: (i) => i.title },
];

export default function FavoritesPage() {
  const { favorites, totalCount, hydrated } = useFavorites();

  const openUrl = (item) => item.driveUrl || item.url || null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-[var(--fg)]">
      <AuroraBackground />
      <Navbar />

      <section className="mx-auto w-[92%] max-w-4xl pt-10 pb-12">
        <div className="mb-10 text-center">
          <span className="eyebrow">Your library</span>
          <h1 className="display mt-3 text-4xl md:text-5xl">Saved favourites</h1>
          <p className="mt-3 text-[var(--fg-2)]">
            Everything you&apos;ve starred, in one place.
          </p>
        </div>

        {hydrated && totalCount === 0 ? (
          <div className="card-surface rounded-3xl p-12 text-center">
            <p className="text-lg text-[var(--fg)]">No favourites yet</p>
            <p className="mt-2 text-[var(--fg-2)]">
              Browse resources and tap the star to save them here.
            </p>
            <Link
              href="/select-year"
              className="btn-primary focus-ring mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-medium"
            >
              Browse resources
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {SECTIONS.map(({ key, title, icon: Icon, label }) => {
              const items = favorites[key] || [];
              return (
                <div key={key}>
                  <div className="mb-4 flex items-center gap-2.5">
                    <Icon className="h-5 w-5 text-[var(--accent)]" />
                    <h2 className="text-lg font-medium text-[var(--fg)]">{title}</h2>
                    <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--fg-2)]">
                      {items.length}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-sm text-[var(--fg-3)]">Nothing saved here yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {items.map((item, i) => {
                        const url = openUrl(item);
                        return (
                          <div
                            key={`${item.id}-${i}`}
                            className={`card-surface rounded-2xl p-5 ${url ? "cursor-pointer" : ""}`}
                            onClick={() => url && window.open(url, "_blank")}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--fg)]">{label(item)}</span>
                              {url && <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" />}
                            </div>
                            {(item.subject || item.year) && (
                              <p className="mt-1 text-sm text-[var(--fg-3)]">
                                {item.subject}
                                {item.subject && item.year ? " · " : ""}
                                {item.year ? `Year ${item.year}` : ""}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
