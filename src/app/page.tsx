import Hero from "../components/sections/Hero";
import How from "../components/sections/How";
import Features from "../components/sections/Features";
import Testimonial from "../components/sections/Testimonial";
import Footer from "../components/sections/Footer";
import NavBar from "../components/common/NavBar";
import Fq from "../components/sections/Fq";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <Hero />
      <How />
      <Features />
      <Testimonial />
      <Fq />
      <Footer />
    </main>
  );
}

