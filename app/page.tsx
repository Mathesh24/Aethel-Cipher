import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen" style={{ background: 'transparent' }}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Contact />
      <Footer />
    </main>
  );
}
