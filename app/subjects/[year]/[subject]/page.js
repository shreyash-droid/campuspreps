"use client";

import SubjectTabs from "../../../components/SubjectTabs";
import Navbar from "../../../components/navbar";
import AuroraBackground from "../../../components/AuroraBackground";

export default function SubjectDetailPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-[var(--fg)]">
      <AuroraBackground />
      <Navbar />
      <SubjectTabs />
    </div>
  );
}
