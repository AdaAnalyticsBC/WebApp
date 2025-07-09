import GrokGalaxy from "@/components/grok-galaxy";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronFirst } from "lucide-react";

export default function Home() {
  return (
    <main className="
      flex self-stretch inline-flex flex-col 
      justify-start items-center gap-8
      w-full h-fit
    ">
      
      {/* H E R O   S E C T I O N */}

      <div className="
        flex flex-col 
        items-center justify-center
        w-full h-fit
        max-w-[1480px]
        p-6
      ">
        {/* WebGL 3D Data Interative Object */}
        <GrokGalaxy />


        {/* Hero Content */}
        <div className="
          absolute top-1/2 left-1/8 right-1/8 bottom-1/2
          flex flex-col items-center justify-center gap-2
          z-10
          shadow-md shadow-black/20
        ">
          <h1 className="heading-1 w-fit text-center drop-shadow-lg">We Turn Information Into Profit.</h1>
          <p className="subtitle-1 drop-shadow-md">
            AI-powered trading strategies, fully automated for accredited investors.
          </p>
          {/* Button Wrapper */}
          <div className="flex flex-row items-center justify-center gap-3 mt-4">
            <Button variant="default" className="shadow-md">
              APPLY TO JOIN
              <ArrowRightIcon className="size-[14px]" />
            </Button>
            <Button variant="link" className="">
              EXPLORE STRATEGIES
              <ChevronFirst
              size={14}
              className="rotate-270 transition-colors duration-300"
            />
            </Button>
          </div>

        </div>
        
      </div>

      {/* W H Y   A D A   S E C T I O N */}

      {/* P E R F O R M A N C E   S E C T I O N */}

      {/* L A T E S T   R E S E A R C H   S E C T I O N */}

      {/* M E M B E R S H I P   A N D   P R I C I N G   S E C T I O N */}

      {/* F A Q   S E C T I O N */}

      {/* B O T T O M   C T A   S E C T I O N */}

    </main>
  );
}
