import ContactSection from "../../layouts/Sections/ContactSection";

import Opportunities from "../../components/Opportunities";
import ContainerNews from "../../layouts/Sections/ContainerNews";

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center items-center w-full px-8">
        <ContainerNews />
        <Opportunities />
        <ContactSection />
      </main>
    </>
  );
}
