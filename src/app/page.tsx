import HeroSection from "@/components/global/landing/heroSection";
import HeaderNav from "@/components/global/landing/headerNav";
import FeaturesSection from "@/components/global/landing/featuresSection";
import Testimonials from "@/components/global/landing/testimonials";
import { ThemeSelector } from "@/components/global/theme-selector";

export default function Home() {
  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <HeroSection />
        <FeaturesSection />
        <Testimonials />
        <footer className="w-full flex flex-row space-x-5 items-center justify-center md:text-base text-sm p-10 px-0 text-center">
          <p>© Quirk, 2024. All rights reserved.</p>
          <ThemeSelector />
        </footer>{" "}
      </main>
    </div>
  );
}
