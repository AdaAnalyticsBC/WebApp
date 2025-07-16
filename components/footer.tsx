"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronFirst } from "lucide-react";
import { DarkAreaDetector } from "./dark-area-detector";
import { useCursorHover } from "./custom-cursor";

export default function Footer() {
  const { onMouseEnter, onMouseLeave } = useCursorHover();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="w-full h-fit flex flex-col items-start justify-center gap-3 lg:gap-6">
      {/* Main Footer */}
      <DarkAreaDetector isDark={true}>
        <footer className="w-full px-3 lg:px-6">
          <div className="relative w-full max-w-[1480px] mx-auto bg-neutral-900 rounded-3xl overflow-hidden">
            
            {/* Content Container */}
            <div className="relative w-full p-6 lg:p-8">
              
              {/* Desktop Layout */}
              <div className="hidden lg:flex w-full items-start justify-between gap-2">
                
                {/* Left Side - Back to Top + Navigation */}
                <div className="flex items-baseline gap-16 flex-shrink-0">
                  {/* Back to Top */}
                  <Button 
                    variant="link" 
                    className="button-3 hover:text-white hover:bg-transparent"
                    onClick={scrollToTop}
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    BACK TO TOP
                    <ChevronFirst
                      size={14}
                      className="rotate-90 transition-colors duration-300"
                    />
                  </Button>

                  {/* Navigation Columns */}
                  <div className="flex gap-12">
                    {/* Ada Analytics Column */}
                    <div className="flex flex-col gap-4 w-fit">
                      <h3 className="text-white text-sm text-nowrap font-semibold">Ada Analytics</h3>
                      <nav className="flex flex-col gap-2">
                        <Link 
                          href="/" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Home
                        </Link>
                        <Link 
                          href="/what-we-offer" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          What We Offer
                        </Link>
                        <Link 
                          href="/blog" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Blog
                        </Link>
                        <Link 
                          href="/about" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          About
                        </Link>
                        <Link 
                          href="/historical-performance" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Historical Performance
                        </Link>
                        <Link 
                          href="/careers" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Careers
                        </Link>
                        <Link 
                          href="/legal" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Legal
                        </Link>
                        <Link 
                          href="/privacy" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Privacy
                        </Link>
                        <Link 
                          href="/terms" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Terms
                        </Link>
                        <Link 
                          href="/help" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Help
                        </Link>
                      </nav>
                    </div>

                    {/* Strategies Column */}
                    <div className="flex flex-col gap-4 w-fit">
                      <h3 className="text-white text-sm text-nowrap font-semibold">Strategies</h3>
                      <nav className="flex flex-col gap-2">
                        <Link 
                          href="/strategies/luther" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Luther
                        </Link>
                        <Link 
                          href="/strategies/crypto-arbitrage" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Crypto Arbitrage
                        </Link>
                        <Link 
                          href="/strategies/smart-treasury" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Smart Treasury
                        </Link>
                        <Link 
                          href="/strategies/clovis" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Clovis
                        </Link>
                        <Link 
                          href="/strategies/offshore" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          Offshore
                        </Link>
                        <Link 
                          href="/strategies/ark-venture" 
                          className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                          onMouseEnter={() => onMouseEnter('hover')}
                          onMouseLeave={onMouseLeave}
                        >
                          ARK Venture
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Center - FooterGraphic Image */}
                <div className="flex flex-col xl:flex-row lg:items-end xl:items-start justify-center gap-6">
                  <div className="hidden xl:flex flex-1 justify-center items-center">
                    <Image
                      src="/FooterGraphic.webp"
                      alt="Footer Background"
                      width={800}
                      height={400}
                      className="w-full h-auto object-contain opacity-100"
                      priority
                    />
                  </div>

                  {/* Right Side - Apply to Join Button */}
                  <Button 
                    variant="outline" 
                    className="w-fit h-fit button-1"
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    APPLY TO JOIN
                    <ArrowRight size={14} />
                  </Button>        

                  <div className="xl:hidden lg:flex flex-1 justify-center items-center">
                    <Image
                      src="/FooterGraphic.webp"
                      alt="Footer Background"
                      width={800}
                      height={400}
                      className="w-full h-auto object-contain opacity-100"
                      priority
                    />
                  </div>       
                </div>
              </div>

              {/* Bottom Row - Logo, Copyright, Social (Desktop Only) */}
              <div className="hidden lg:flex justify-between items-center w-full mt-12">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-1 font-bold md:gap-2" onMouseEnter={() => onMouseEnter('hover')} onMouseLeave={onMouseLeave}>
                  {/* Icon */}
                  <Image src="/new-logo-dark.svg" alt="Ada Analytics Logo" width={24} height={24} className="w-6 h-6 md:w-9 md:h-9" />
                  {/* Text */}
                  <span className="text-white text-[14px] md:text-lg not-italic font-semibold leading-none tracking-tight">Ada Analytics</span>
                
                </Link>


                {/* Copyright and Social */}
                <p className="text-neutral-500 text-sm">© 2025 Ada Analytics LLC. All Rights Reserved</p>


                <div className="flex gap-4">
                    <Link 
                      href="https://twitter.com/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://linkedin.com/company/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://youtube.com/@ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://instagram.com/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
                  </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden w-full h-full flex flex-col items-center md:items-start justify-center gap-6">
                
                {/* Top Row - Buttons */}
                <div className="flex justify-between items-center w-full">
                  <Button 
                    variant="link" 
                    className="button-3 hover:text-white hover:bg-transparent"
                    onClick={scrollToTop}
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    BACK TO TOP
                    <ChevronFirst
                      size={14}
                      className="rotate-90 transition-colors duration-300"
                    />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-fit h-fit button-1"
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    JOIN
                    <ArrowRight size={14} />
                  </Button>
                </div>

                {/* Navigation Columns */}
                <div className="grid grid-cols-2 gap-6 w-full">
                  {/* Ada Analytics Column */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-white text-sm font-semibold">Ada Analytics</h3>
                    <nav className="flex flex-col gap-2">
                      <Link 
                        href="/" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Home
                      </Link>
                      <Link 
                        href="/what-we-offer" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        What We Offer
                      </Link>
                      <Link 
                        href="/blog" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Blog
                      </Link>
                      <Link 
                        href="/about" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        About
                      </Link>
                      <Link 
                        href="/historical-performance" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Historical Performance
                      </Link>
                      <Link 
                        href="/careers" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Careers
                      </Link>
                      <Link 
                        href="/legal" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Legal
                      </Link>
                      <Link 
                        href="/privacy" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Privacy
                      </Link>
                      <Link 
                        href="/terms" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Terms
                      </Link>
                      <Link 
                        href="/help" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Help
                      </Link>
                    </nav>
                  </div>

                  {/* Strategies Column */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-white text-sm font-semibold">Strategies</h3>
                    <nav className="flex flex-col gap-2">
                      <Link 
                        href="/strategies/luther" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Luther
                      </Link>
                      <Link 
                        href="/strategies/crypto-arbitrage" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Crypto Arbitrage
                      </Link>
                      <Link 
                        href="/strategies/smart-treasury" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Smart Treasury
                      </Link>
                      <Link 
                        href="/strategies/clovis" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Clovis
                      </Link>
                      <Link 
                        href="/strategies/offshore" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        Offshore
                      </Link>
                      <Link 
                        href="/strategies/ark-venture" 
                        className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors duration-300"
                        onMouseEnter={() => onMouseEnter('hover')}
                        onMouseLeave={onMouseLeave}
                      >
                        ARK Venture
                      </Link>
                    </nav>
                  </div>
                </div>

                {/* FooterGraphic Image */}
                <div className="w-full flex justify-center items-center">
                  <Image
                    src="/FooterGraphic.webp"
                    alt="Footer Background"
                    width={800}
                    height={400}
                    className="w-full h-auto object-contain opacity-100"
                    priority
                  />
                </div>

                {/* Bottom Row - Logo, Social, Copyright */}
                <div className="w-full flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4 mt-3 md:mt-8">
                  {/* Logo */}
                  <Link 
                    href="/" 
                    className="flex items-center gap-1 md:gap-2"
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    <Image src="/new-logo-dark.svg" alt="Ada Analytics Logo" width={24} height={24} className="w-6 h-6 md:w-9 md:h-9" />
                    <span className="text-white text-[14px] md:text-lg font-semibold leading-none tracking-tight">Ada Analytics</span>
                  </Link>

                  {/* Copyright and Social Icons - Tablet: space between, Mobile: stacked center */}
                  <p className="text-neutral-500 text-xs text-center">© 2025 Ada Analytics LLC. All Rights Reserved</p>
                    
                  {/* Social Icons */}
                  <div className="flex gap-4">
                    <Link 
                      href="https://twitter.com/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://linkedin.com/company/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://youtube.com/@ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </Link>
                    <Link 
                      href="https://instagram.com/ada-analytics" 
                      className="text-neutral-400 hover:text-neutral-200 transition-colors duration-300"
                      onMouseEnter={() => onMouseEnter('hover')}
                      onMouseLeave={onMouseLeave}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </DarkAreaDetector>

      {/* Disclosure Section */}
      <div className="w-full px-3 lg:px-6 pb-6">
        <div className="w-full max-w-[1480px] mx-auto bg-neutral-200 rounded-2xl p-4 lg:p-6">
          <p className="text-neutral-400 text-xs leading-tight tracking-tight">
            This website is operated by Ada Analytics LLC (&quot;Ada&quot;), a quantitative research and technology company. Ada is not registered as an investment adviser with the U.S. Securities and Exchange Commission (&quot;SEC&quot;) and does not provide personalized investment, legal, or tax advice. Interests in Ada Analytics Fund LP (the &quot;Fund&quot;) are offered solely through a confidential private-placement memorandum and related subscription documents and only to persons who qualify as &quot;accredited investors&quot; (and, where applicable, &quot;qualified purchasers&quot;) under U.S. securities laws. Nothing on this site constitutes an offer to sell—or a solicitation of an offer to buy—any security, nor shall any such security be offered or sold in any jurisdiction where such offer or solicitation would be unlawful.
            <br /><br />
            Any performance figures, expected returns, or probability projections shown are hypothetical, unaudited, and do not represent the results of actual client accounts. Past performance is not indicative of future results; investment loss, including total loss of principal, is possible. Strategies involving crypto-assets or interval funds may be highly speculative, volatile, and illiquid.
            <br /><br />
            Charts comparing Ada strategies to benchmarks such as the S&P 500 (SPY) are for illustrative purposes only and are not investment recommendations. All research articles, AI-generated insights, and third-party data feeds are provided &quot;as-is&quot; without warranty as to completeness or accuracy. You are solely responsible for evaluating the merits and risks of any information before making investment decisions.
            <br /><br />
            Brokerage, custody, and fund administration services, if applicable, will be provided by unaffiliated, SEC-registered broker-dealers and qualified custodians; details are available upon request. You may verify the registration status of such firms at FINRA BrokerCheck (brokercheck.finra.org) or the SEC&apos;s Investment Adviser Public Disclosure site (adviserinfo.sec.gov).
            <br /><br />
            Support communications from Ada personnel are for general educational purposes only and should not be construed as investment advice. For further information, request a copy of the private-placement memorandum or contact support@ada-analytics.com.© 2025 Ada Analytics LLC, 123 Innovation Way, Phoenix, AZ 85004. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}