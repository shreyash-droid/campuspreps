import YearSelector from "../components/YearSelector";
import Navbar from '../components/navbar';

export default function SelectYearPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-black  text-white">
        <YearSelector />
    </main>
    </>
  );
}
