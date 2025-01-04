import HeroSection from "@/components/global/landing/heroSection";
import HeaderNav from "@/components/global/landing/headerNav";
import FeaturesSection from "@/components/global/landing/featuresSection";
import Testimonials from "@/components/global/landing/testimonials";

export default function Home() {
  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <HeroSection />
        <FeaturesSection />
        <Testimonials />
        <footer className="w-full flex flex-col items-center justify-center p-10">
          © Quirk, 2024. All rights reserved.
        </footer>{" "}
      </main>
    </div>
  );
}
