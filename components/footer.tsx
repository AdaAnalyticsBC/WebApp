import { Button } from "@/components/ui/button";
import { ChevronFirst } from "lucide-react";

export default function Footer() {
  return (
    <footer className="
      flex p-2 justify-between items-center self-stretch 
      bg-netrual-900 rounded-3xl
      w-full h-fit
      max-w-[1480px] p-6
    ">

      {/* Menu & Copyright Column */}
      <div className="flex flex-col justify-between items-start">
        {/* Top Conatiner */}
        <div className="flex items-start gap-x-16">
          {/* Back to top button */}
          <Button
            variant="none"
            className="px-3 md:px-8 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold text-neutral-500 hover:text-neutral-300 transition-colors duration-300 gap-2 flex items-center"
          >
            BACK TO TOP
            <ChevronFirst
              size={14}
              className="rotate-90 transition-colors duration-300"
            />
          </Button>

          {/* Menu */}
        </div>

      </div>


      {/* CTA & Social Column */}

    </footer>
  )
}