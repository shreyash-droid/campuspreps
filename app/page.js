import Hero from './components/hero';
import Navbar from './components/navbar';
import Strip from './components/strip';
import Services from './components/services';
import Contact from './components/contact';
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Strip />
      <Services />
      <Contact />
    </div>
  );
}
