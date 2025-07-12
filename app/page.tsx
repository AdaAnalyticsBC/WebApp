import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import GrokGalaxy from "@/components/grok-galaxy";

import { HeroHeadings } from "@/components/HeroHeadings";
import { HeroGlassCard } from "@/components/HeroGlassCard";
import WhyAdaSection from "@/components/why-ada-section";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center w-full h-fit min-h-screen">
        <div className="relative flex flex-col items-center justify-center w-full max-w-[1480px] p-4 md:p-8">
          <GrokGalaxy />
          {/* Centered Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center md:gap-6 z-10 pointer-events-none">
            <HeroHeadings />
            <HeroGlassCard />
          </div>
        </div>

        {/* W H Y   A D A   S E C T I O N */}
        <WhyAdaSection />
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
