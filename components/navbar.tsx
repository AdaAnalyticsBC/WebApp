import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LockIcon } from "lucide-react";


export default function NavBar() {
  return (
    <nav className="flex sticky top-0 z-40 px-3 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3 justify-between items-center self-stretch bg-background/80 backdrop-blur-lg">


      {/* LOGO */}
      <Link href="/" className="flex items-center gap-1 font-bold md:gap-2">
        {/* Icon */}
        <Image src="/new-logo.svg" alt="Ada Analytics Logo" width={24} height={24} className="w-6 h-6 md:w-9 md:h-9" />
        {/* Text */}
        <span className="text-foreground text-[14px] md:text-lg not-italic font-semibold leading-none tracking-tight">Ada Analytics</span>
      </Link>




      {/* BUTTON WRAPPER */}
      <div className="flex items-center gap-1 w-fit h-fit">

        {/* Login Button */}
        <Link href="/login">
          <Button variant="link" className="w-fit h-fit pl-3 pr-2 py-1.5 text-[10px] font-semibold text-foreground rounded-full gap-1">
            LOG IN
            <LockIcon size={14} />
          </Button>
        </Link>

        {/* Apply to Join Button */}
        <Link href="/apply">
          <Button 
            variant="default" 
            className="w-fit h-fit bg-primary pl-3 pr-2 py-1.5 md:py-2 text-[10px] justify-center content-center font-semibold text-primary-foreground rounded-full gap-1.5 md:gap-6">
            <span className="block md:hidden">JOIN</span>
            <span className="hidden md:block">APPLY TO JOIN</span>
            <ArrowRightIcon size={14} />
          </Button>
        </Link>
      </div>
    </nav>
  )
}