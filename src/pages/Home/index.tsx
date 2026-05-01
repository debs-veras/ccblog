import TechHero from "@/layouts/Sections/Hero";
import QuickLinksSection from "@/layouts/Sections/QuickLinksSection";
import ContainerNews from "@/layouts/Sections/ContainerNews";
import ContactSection from "@/layouts/Sections/ContactSection";
import SocialSection from "@/layouts/Sections/SocialSection";

export default function Home() {
  return (
    <>
      <TechHero />
      <main className="flex flex-col justify-center items-center w-full px-8">
        <QuickLinksSection />
        <ContainerNews />
        <ContactSection />
        <SocialSection />
      </main>
    </>
  );
}
