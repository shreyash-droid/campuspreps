"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ExternalLink } from "lucide-react";
import { useState } from "react";
import { getSubjectData } from "../data/subjectData";
import { useFavorites } from "../context/FavoritesContext";

const TABS = [
  { key: "notes", label: "Module Notes" },
  { key: "qp", label: "Question Papers" },
  { key: "yt", label: "YouTube Links" },
];

export default function SubjectTabs() {
  const { year, subject } = useParams();
  const [activeTab, setActiveTab] = useState("notes");
  const { toggleFavorite, isFavorited } = useFavorites();

  const subjectInfo = getSubjectData(parseInt(year), subject);
  const subjectName = subjectInfo?.name || subject;

  const fallbackData = {
    modules: Array.from({ length: 6 }).map((_, i) => ({
      id: `${subject}-${year}-${i}`,
      moduleNumber: i + 1,
      title: `Module ${i + 1} Notes`,
      driveUrl: null,
    })),
    questionPapers: [
      { id: `${subject}-${year}-cats`, title: "CATs", type: "cats", driveUrl: null },
      { id: `${subject}-${year}-fats`, title: "FATs", type: "fats", driveUrl: null },
    ],
    youtubeLinks: [],
  };

  const data = subjectInfo || fallbackData;

  // Attach subject/year so the profile page can label saved items.
  const decorate = (item) => ({ ...item, subject: subjectName, year });

  const FavStar = ({ type, item }) => {
    const active = isFavorited(type, item.id);
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(type, decorate(item));
        }}
        className="ml-3 shrink-0 transition hover:scale-110"
        aria-label={active ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className={`h-5 w-5 ${active ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--fg-3)]"}`}
        />
      </button>
    );
  };

  const openable = (url) => (url ? "cursor-pointer" : "");

  return (
    <section className="mx-auto w-[92%] max-w-4xl pt-10 pb-12 text-[var(--fg)]">
      <Link
        href={`/subjects/${year}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/[0.03] px-3.5 py-1.5 text-sm text-[var(--fg-2)] transition hover:text-[var(--fg)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to subjects
      </Link>

      <div className="mt-10 mb-8">
        <span className="eyebrow">Study resources</span>
        <h1 className="display mt-3 text-4xl capitalize md:text-5xl">{subjectName}</h1>
      </div>

      {/* Tabs */}
      <div className="mb-8 grid grid-cols-3 gap-1 rounded-full border border-[var(--line)] bg-white/[0.03] p-1 text-sm font-medium">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full py-2.5 transition ${
              activeTab === tab.key
                ? "bg-[var(--fg)] text-[#0a0a0b]"
                : "text-[var(--fg-2)] hover:text-[var(--fg)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notes */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.modules.map((module) => (
            <div key={module.id} className="card-surface flex items-center justify-between rounded-2xl p-5">
              <div
                className={`flex-1 ${openable(module.driveUrl)}`}
                onClick={() => module.driveUrl && window.open(module.driveUrl, "_blank")}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--fg)]">Module {module.moduleNumber}</span>
                  {module.driveUrl && <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" />}
                </div>
                <p className={`mt-0.5 text-sm ${module.driveUrl ? "text-[var(--accent)]" : "text-[var(--fg-3)]"}`}>
                  {module.driveUrl ? "Open notes" : "Coming soon"}
                </p>
              </div>
              <FavStar type="notes" item={module} />
            </div>
          ))}
        </div>
      )}

      {/* Question papers */}
      {activeTab === "qp" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.questionPapers.map((paper) => (
            <div key={paper.id} className="card-surface flex items-center justify-between rounded-2xl p-5">
              <div
                className={`flex-1 ${openable(paper.driveUrl)}`}
                onClick={() => paper.driveUrl && window.open(paper.driveUrl, "_blank")}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--fg)]">{paper.title}</span>
                  {paper.driveUrl && <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" />}
                </div>
                <p className={`mt-0.5 text-sm ${paper.driveUrl ? "text-[var(--accent)]" : "text-[var(--fg-3)]"}`}>
                  {paper.driveUrl ? "Open paper" : "Coming soon"}
                </p>
              </div>
              <FavStar type="questionPapers" item={paper} />
            </div>
          ))}
        </div>
      )}

      {/* YouTube */}
      {activeTab === "yt" && (
        <div className="grid grid-cols-1 gap-3">
          {data.youtubeLinks.length > 0 ? (
            data.youtubeLinks.map((link) => (
              <div key={link.id} className="card-surface flex items-center justify-between rounded-2xl p-5">
                <div className="flex-1 cursor-pointer" onClick={() => window.open(link.url, "_blank")}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--fg)]">
                      {link.moduleNumber ? `Module ${link.moduleNumber} — ` : ""}
                      {link.title}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" />
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--accent)]">Watch video</p>
                </div>
                <FavStar type="youtubeLinks" item={link} />
              </div>
            ))
          ) : (
            <div className="card-surface rounded-2xl p-8 text-center text-[var(--fg-2)]">
              No video tutorials available yet.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
