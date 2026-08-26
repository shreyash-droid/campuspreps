"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import Navbar from "../components/navbar";
import AuroraBackground from "../components/AuroraBackground";

const TABS = [
  { key: "notes", label: "Notes" },
  { key: "questionPapers", label: "Question Papers" },
  { key: "youtubeLinks", label: "YouTube Links" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { favorites, totalCount } = useFavorites();
  const [activeTab, setActiveTab] = useState("notes");

  const userInfo = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.image || "/profile.svg",
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login?callbackUrl=/profile");
  }, [loading, isAuthenticated, router]);

  const openUrl = (item) => item.driveUrl || item.url || null;

  const renderList = () => {
    const items = favorites[activeTab] || [];
    if (items.length === 0) {
      return (
        <div className="card-surface rounded-2xl p-10 text-center text-[var(--fg-2)]">
          Nothing saved here yet. Tap the star on any resource to save it.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const url = openUrl(item);
          const label =
            activeTab === "notes"
              ? `Module ${item.moduleNumber}`
              : item.title || "Resource";
          return (
            <div
              key={`${item.id}-${i}`}
              className={`card-surface rounded-2xl p-5 ${url ? "cursor-pointer" : ""}`}
              onClick={() => url && window.open(url, "_blank")}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--fg)]">{label}</span>
                {url && <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" />}
              </div>
              {(item.subject || item.year) && (
                <p className="mt-1 text-sm text-[var(--fg-3)]">
                  {item.subject}
                  {item.subject && item.year ? " · " : ""}
                  {item.year ? `Year ${item.year}` : ""}
                </p>
              )}
              <p className={`mt-1 text-sm ${url ? "text-[var(--accent)]" : "text-[var(--fg-3)]"}`}>
                {url ? "Open resource" : "Link unavailable"}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-[var(--fg)]">
      <AuroraBackground />
      <Navbar />

      <section className="mx-auto w-[92%] max-w-4xl pt-10 pb-12">
        <div className="mb-8 text-sm text-[var(--fg-3)]">
          <Link href="/" className="transition hover:text-[var(--fg)]">Home</Link>
          <span className="mx-2">›</span>
          <span>Profile</span>
        </div>

        {/* Header */}
        <div className="mb-12 flex items-center gap-6">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-[var(--line-strong)]">
            <Image src={userInfo.avatar} alt="Profile" width={80} height={80} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="display text-3xl">{userInfo.name || "Your Profile"}</h1>
            <p className="text-[var(--fg-2)]">{userInfo.email}</p>
          </div>
        </div>

        {/* Favorites */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="eyebrow">Saved</span>
            <h2 className="display mt-2 text-2xl">Your favourites</h2>
          </div>
          <span className="text-sm text-[var(--fg-3)]">{totalCount} total</span>
        </div>

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
              <span className="ml-1.5 text-xs opacity-70">
                {(favorites[tab.key] || []).length}
              </span>
            </button>
          ))}
        </div>

        {renderList()}
      </section>
    </div>
  );
}
