import YearSelector from "../components/YearSelector";
import Navbar from "../components/navbar";
import AuroraBackground from "../components/AuroraBackground";

export default function SelectYearPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-[var(--fg)]">
      <AuroraBackground />
      <Navbar />
      <YearSelector />
    </div>
  );
}
