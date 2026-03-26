import ContactSection from "../../layouts/Sections/ContactSection";
import ContainerNews from "../../layouts/Sections/ContainerNews";
import SocialSection from "../../layouts/Sections/SocialSection";
import QuickLinksSection from "../../layouts/Sections/QuickLinksSection";
import TechHero from "../../layouts/Sections/Hero";

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
