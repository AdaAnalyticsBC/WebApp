import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import GrokGalaxy from "@/components/grok-galaxy";

import { HeroHeadings } from "@/components/HeroHeadings";
import { HeroGlassCard } from "@/components/HeroGlassCard";
import WhyAdaNumbers from "@/components/why-ada-numbers";

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

        {/* W H Y   A D A   S E C T I O N */}
        <section className="relative flex flex-col items-center bg-neutral-900 justify-center w-full max-w-[1480px] px-4 py-8 lg:px-8 lg:py-12">

          {/* Top Row */}
          <div className="flex flex-row items-start md:items-center justify-between w-full gap-6 mb-4 lg:mb-8">
            <div className="flex flex-col items-start justify-center w-fit gap-3">
              <span className="tag-1 text-neutral-500 text-left">[ BENEFITS ]</span>
              <h2 className="heading-2 font-medium text-white text-left">Why Ada?</h2>
            </div>
            <WhyAdaNumbers />
          </div>



        </section>
        {/* P E R F O R M A N C E   S E C T I O N */}
        {/* L A T E S T   R E S E A R C H   S E C T I O N */}
        {/* M E M B E R S H I P   A N D   P R I C I N G   S E C T I O N */}
        {/* F A Q   S E C T I O N */}
        {/* B O T T O M   C T A   S E C T I O N */}
      </main>
      <Footer />
    </>
  );
}
