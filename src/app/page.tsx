import HeroSection from "@/components/global/landing/heroSection";
import HeaderNav from "@/components/global/landing/headerNav";
import FeaturesSection from "@/components/global/landing/featuresSection";
import Testimonials from "@/components/global/landing/testimonials";
import CardsTestimonial from "@/components/global/landing/cardsTestimonial";

export default function Home() {
  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <HeroSection />
        <FeaturesSection />
        <div className="hidden xl:flex">
          <Testimonials />
        </div>
        <div className="xl:hidden flex">
          <CardsTestimonial />
        </div>
        <footer className="w-full flex flex-col items-center justify-center md:text-base text-sm p-10 px-0 text-center">
          © Quirk, 2024. All rights reserved.
        </footer>{" "}
      </main>
    </div>
  );
}
