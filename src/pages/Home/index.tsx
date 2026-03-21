import ContactSection from "../../layouts/Sections/ContactSection";

import Opportunities from "../../layouts/Sections/Opportunities";
import ContainerNews from "../../layouts/Sections/ContainerNews";
import SocialSection from "../../layouts/Sections/SocialSection";

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center items-center w-full px-8">
        <ContainerNews />
        <Opportunities />
        <ContactSection />
        <SocialSection />
      </main>
    </>
  );
}
