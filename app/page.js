import Hero from './components/hero';
import Navbar from './components/navbar';
import Strip from './components/strip';
import Services from './components/services';
import Contact from './components/contact';
import AuroraBackground from './components/AuroraBackground';

export default function Home() {
  return (
    <div className="relative min-h-screen text-white">
      <AuroraBackground />
      <Navbar />
      <Hero />
      <Strip />
      <Services />
      <Contact />
    </div>
  );
}
