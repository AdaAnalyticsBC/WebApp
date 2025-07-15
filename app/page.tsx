import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import GrokGalaxy from "@/components/grok-galaxy";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DarkAreaDetector } from "@/components/dark-area-detector";

import { HeroHeadings } from "@/components/HeroHeadings";
import { HeroGlassCard } from "@/components/HeroGlassCard";
import WhyAdaNumbers from "@/components/why-ada-numbers";
import FAQQuestions from "@/components/faq-questions";
import PricingSection from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, MessagesSquare } from "lucide-react";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center w-full h-fit min-h-screen">
        {/* H E R O   S E C T I O N */}
        <section className="relative flex flex-col items-center justify-center w-full max-w-[1480px] p-4 lg:p-8">
          <GrokGalaxy />
          {/* Centered Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center md:gap-6 z-10 pointer-events-none">
            <HeroHeadings />
            <HeroGlassCard />
          </div>
        </section>

        {/* Flickering Grid with 24px and 16px on mobile margin for both top and bottom */}
        <div className="w-full mt-4 lg:mt-6">
          <FlickeringGrid
            squareSize={2}
            gridGap={4}
            flickerChance={0.5}
            color="rgb(56, 189, 248)"
            width={undefined}
            height={24}
            maxOpacity={0.8}
            className="w-full"
          />
        </div>

        {/* W H Y   A D A  &   P E R F O R M A N C E   S E C T I O N */}
        <DarkAreaDetector isDark={true}>
          <section className="relative flex flex-col items-center bg-neutral-900 justify-center w-full h-fit">

            {/* Container for both*/}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full h-fit max-w-[1480px] px-4 py-8 lg:px-8 lg:py-12">
              {/* Why Ada Section */}

              {/* Top Row */}
              <div className="flex flex-row items-start md:items-center justify-between w-full gap-6 mb-4 lg:mb-8">
                <div className="flex flex-col items-start justify-center w-fit gap-3">
                  <span className="tag-1 text-neutral-500 text-left">[ BENEFITS ]</span>
                  <h2 className="heading-2 text-white text-left">Why Ada?</h2>
                </div>

                <WhyAdaNumbers />
              </div>

              {/* 4 Point Cards */}
            </div>

          </section>
        {/* P E R F O R M A N C E   S E C T I O N */}
        {/* L A T E S T   R E S E A R C H   S E C T I O N */}


        {/* M E M B E R S H I P   A N D   P R I C I N G   S E C T I O N */}
         <PricingSection />
        </DarkAreaDetector>

        {/* F A Q   S E C T I O N */}
        <section className="flex flex-col md:flex-row items-start justify-center md:justify-between w-full max-w-[1480px] gap-4 md:gap-8 h-fit px-4 py-8 lg:px-8 lg:py-12">

          {/* Left Content Container */}
          <div className="flex flex-col w-full h-fit md:max-w-[480px] items-start justify-center">
            {/* Title */}
            <div className="flex flex-col items-start justify-center w-fit gap-3 mb-4 lg:mb-16">
              <span className="tag-1 text-neutral-500 text-left">[ FAQS ]</span>
              <h2 className="heading-2 text-black text-left">Frequently Asked Questions</h2>
              <p className="subtitle-1 w-full text-neutral-500">
                Rapid fire questions to common questions. Have a question of your own? Our Engineers are ready to help.
              </p>
            </div>

            {/* Contact Card */}
            <div className="hidden md:flex flex-col items-center justify-center p-6 bg-neutral-100 rounded-xl w-full">
              <div className="flex flex-col items-center md:items-start justify-center w-fit gap-2">
                <h2 className="heading-3 text-black text-left">Have different questions?</h2>
                <p className="subtitle-1 w-full text-neutral-500 text-center md:text-left mb-4">
                  Our team will answer your questions we ensure a quick response.
                </p>
                <Button variant="outline" className="w-full max-w-[320px] md:w-fit">
                  CONTACT OUR TEAM
                  <MessagesSquare 
                    size={14}
                  />
                </Button>
              </div>
            </div>
          </div>


          {/* Questions Container */}
          <FAQQuestions />

        </section>

        {/* Flickering Grid with 24px and 16px on mobile margin for both top and bottom */}
        <div className="w-full my-4 lg:my-6">
          <FlickeringGrid
            squareSize={2}
            gridGap={4}
            flickerChance={0.5}
            color="rgb(56, 189, 248)"
            width={undefined}
            height={24}
            maxOpacity={0.8}
            className="w-full"
          />
        </div>

        {/* B O T T O M   C T A   S E C T I O N */}
        <section className="flex flex-col items-center justify-center w-full max-w-[1480px] h-fit px-4 py-8 lg:px-8 lg:py-12">
          <h1 className="heading-1 text-black text-center mb-2 md:mb-4">
            Invest with Intelligence
          </h1>
          <p className="subtitle-1 w-full text-neutral-500 max-w-[280px] md:max-w-none text-center mb-4 md:mb-8">
            Join us to gain access to our resarch and proprietary strategies.
          </p>
          <Button variant="default" className="shadow-md w-full max-w-[320px] md:w-fit">
            START APPLICATION
            <ArrowRightIcon 
              size={14}
            />
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
