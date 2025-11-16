import React from "react";
import { Navbar } from "@/components/landing-page/navbar";
import { HeroSection } from "@/components/landing-page/hero-section";
import { AboutSection } from "@/components/landing-page/about-product";
import { FAQSection } from "@/components/landing-page/FAQ-section";
import { Footer } from "@/components/landing-page/footer";

const page = () => {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default page;
