"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCursorHover } from "./custom-cursor";

// Sample research data with better titles
const researchData = {
  featured: {
    id: 1,
    title: "Alternative Data in Active Asset Management",
    type: "SSRN working paper",
    date: "Sept 2024",
    description: "Comprehensive analysis of satellite imagery, social sentiment, and IoT data integration in quantitative investment strategies."
  },
  articles: [
    {
      id: 2,
      title: "Sentiment Trading with Large Language Models",
      type: "Finance Research Letter",
      date: "Apr 2024"
    },
    {
      id: 3,
      title: "Social Media Signals and Equity Risk Premia",
      type: "rXiv pre-print",
      date: "Nov 2023"
    },
    {
      id: 4,
      title: "Machine Learning in Factor Model Construction",
      type: "Review of Financial Studies",
      date: "Oct 2020"
    }
  ]
};

interface ResearchCardProps {
  article: typeof researchData.articles[0] | typeof researchData.featured;
  featured?: boolean;
}

function ResearchCard({ article, featured = false }: ResearchCardProps) {
  const { onMouseEnter, onMouseLeave } = useCursorHover();

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => onMouseEnter('drag', 'View')}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Section */}
      <div className={`relative w-full rounded-lg overflow-hidden ${
        featured ? 'h-[384px] lg:h-[600px]' : 'h-[180px] lg:h-[224px]'
      }`}>
        <svg 
          className="w-full h-full transition-transform duration-300 group-hover:scale-105" 
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Noise filter */}
            <filter id={`noise-${article.id}`} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence 
                baseFrequency="0.9" 
                numOctaves="1" 
                result="noise" 
                seed="2"
              />
              <feColorMatrix 
                in="noise" 
                type="saturate" 
                values="0"
              />
              <feComponentTransfer result="monoNoise">
                <feFuncA type="discrete" tableValues="0.05 0.1 0.05 0.1 0.05 0.1"/>
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply"/>
            </filter>
            
            {/* Different gradients for each article */}
            {article.id === 1 && (
              <linearGradient id={`grad-${article.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#0c1618', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#1e3a42', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#2d5a6b', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#0c1618', stopOpacity: 1}} />
              </linearGradient>
            )}
            
            {article.id === 2 && (
              <linearGradient id={`grad-${article.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#0f172a', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#1e293b', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#334155', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#0f172a', stopOpacity: 1}} />
              </linearGradient>
            )}
            
            {article.id === 3 && (
              <linearGradient id={`grad-${article.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#1e1b4b', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#3730a3', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#4338ca', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1e1b4b', stopOpacity: 1}} />
              </linearGradient>
            )}
            
            {article.id === 4 && (
              <linearGradient id={`grad-${article.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#0c1821', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#1f2937', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#374151', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#0c1821', stopOpacity: 1}} />
              </linearGradient>
            )}
          </defs>
          
          {/* Background gradient with noise */}
          <rect 
            width="100%" 
            height="100%" 
            fill={`url(#grad-${article.id})`}
            filter={`url(#noise-${article.id})`}
          />
          
          {/* Research icons with subtle animations */}
          <g className="opacity-20 transition-all duration-300 group-hover:opacity-30">
            {/* Database symbol */}
            <g transform="translate(300, 40)">
              <ellipse cx="0" cy="0" rx="25" ry="6" fill="white" opacity="0.4"/>
              <ellipse cx="0" cy="12" rx="25" ry="6" fill="white" opacity="0.6"/>
              <ellipse cx="0" cy="24" rx="25" ry="6" fill="white" opacity="0.4"/>
              <ellipse cx="0" cy="36" rx="25" ry="6" fill="white" opacity="0.6"/>
            </g>
            
            {/* Network nodes */}
            <g transform="translate(60, 60)">
              <circle cx="0" cy="0" r="3" fill="white" opacity="0.5"/>
              <circle cx="40" cy="0" r="3" fill="white" opacity="0.5"/>
              <circle cx="20" cy="20" r="3" fill="white" opacity="0.7"/>
              <circle cx="0" cy="40" r="3" fill="white" opacity="0.5"/>
              <circle cx="40" cy="40" r="3" fill="white" opacity="0.5"/>
              <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="1" opacity="0.3"/>
              <line x1="40" y1="0" x2="20" y2="20" stroke="white" strokeWidth="1" opacity="0.3"/>
              <line x1="20" y1="20" x2="0" y2="40" stroke="white" strokeWidth="1" opacity="0.3"/>
              <line x1="20" y1="20" x2="40" y2="40" stroke="white" strokeWidth="1" opacity="0.3"/>
            </g>
            
            {/* Chart lines */}
            <g transform="translate(280, 200)">
              <polyline 
                points="0,40 15,20 30,30 45,10 60,15 75,5" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                opacity="0.4"
              />
              <circle cx="0" cy="40" r="2" fill="white" opacity="0.6"/>
              <circle cx="15" cy="20" r="2" fill="white" opacity="0.6"/>
              <circle cx="30" cy="30" r="2" fill="white" opacity="0.6"/>
              <circle cx="45" cy="10" r="2" fill="white" opacity="0.6"/>
              <circle cx="60" cy="15" r="2" fill="white" opacity="0.6"/>
              <circle cx="75" cy="5" r="2" fill="white" opacity="0.6"/>
            </g>
            
            {/* Abstract shapes for visual interest */}
            <g transform="translate(50, 180)">
              <path 
                d="M0,0 Q20,10 40,0 T80,0" 
                stroke="white" 
                strokeWidth="1" 
                fill="none" 
                opacity="0.2"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Content Section Below Image */}
      <div className={`pt-4 lg:pt-6 ${featured ? 'pb-20' : ''}`}>
        <h3 className={`${featured ? 'heading-2 lg:heading-1' : 'heading-3'} text-black mb-2`}>
          {article.title}
        </h3>
        
        {featured && (
          <p className="subtitle-1 text-neutral-600 mb-4">
            {researchData.featured.description}
          </p>
        )}
        
        <div className="flex flex-row items-center gap-4">
          <span className="text-sm font-medium text-neutral-700">{article.type}</span>
          <span className="text-sm text-neutral-500">{article.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function ResearchSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % researchData.articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + researchData.articles.length) % researchData.articles.length);
  };

  return (
    <section className="flex flex-col items-center justify-center w-full h-fit px-4 py-8 lg:px-8 lg:py-12">
      <div className="flex flex-col items-center justify-center w-full max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-row items-center justify-between w-full mb-8">
          <div className="flex flex-col items-start justify-center">
            <span className="tag-1 text-neutral-500 text-left mb-3">[ RESEARCH ]</span>
            <h2 className="heading-2 text-black text-left">Latest Research</h2>
          </div>
          
          <Button variant="outline" className="hidden md:flex px-6 py-3">
            VIEW ALL
          </Button>
        </div>

        {/* Desktop Layout: 2-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 w-full">
          {/* Featured Article - spans 2 columns */}
          <div className="lg:col-span-2">
            <ResearchCard article={researchData.featured} featured={true} />
          </div>
          
          {/* Side Articles - 1 column, stacked with smaller images */}
          <div className="flex flex-col gap-4">
            {researchData.articles.map((article) => (
              <ResearchCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout: Featured + Carousel */}
        <div className="lg:hidden w-full">
          {/* Featured Article */}
          <div className="mb-8">
            <ResearchCard article={researchData.featured} featured={true} />
          </div>
          
          {/* Carousel */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-3 text-black">More Research</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  className="p-2 h-8 w-8"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={nextSlide}
                  className="p-2 h-8 w-8"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {researchData.articles.map((article) => (
                  <div key={article.id} className="w-full flex-shrink-0 pr-4">
                    <ResearchCard article={article} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {researchData.articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-sky-400' : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Mobile View All Button */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline" className="w-full max-w-[320px] px-6 py-3">
              VIEW ALL
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 