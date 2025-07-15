"use client";

import { useState } from "react";
import PricingToggle from "./pricing-toggle";
import FeeCalculator from "./fee-calculator";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const clientFee = isAnnual ? 250 : 25;
  const clientFeePeriod = isAnnual ? "/year" : "/month";

  return (
    <section className="flex flex-col items-center justify-center w-full h-fit px-4 py-8 lg:px-8 lg:py-12 bg-neutral-900">

      <div className="flex flex-col items-center justify-center w-full max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center w-full max-w-[800px] mb-8">
          <span className="tag-1 text-neutral-500 text-center mb-3">[ PRICING ]</span>
          <h1 className="heading-1 text-white text-center mb-4">
            Membership and Pricing
          </h1>
        </div>

        {/* Pricing Cards and Calculator */}
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-center w-full gap-6 lg:gap-8">
          
          {/* Left Column - Combined Fee Card */}
          <div className="flex flex-col w-full lg:w-1/2">
            <div className="bg-neutral-800 rounded-2xl p-6 md:p-8 w-full h-fit lg:h-[600px]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h3 className="heading-3 text-white">Client Fee</h3>
                <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
              </div>
              
              {/* Client Fee Section */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">$</span>
                  <span className="text-4xl md:text-5xl font-mono text-white">
                    {clientFee.toLocaleString()}
                  </span>
                  <span className="text-lg text-neutral-400">
                    {clientFeePeriod}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Covers operational costs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Covers platform access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Single fee for unlimited accounts</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-neutral-700 mb-8"></div>

              {/* Management Fee Section */}
              <div>
                <h3 className="heading-3 text-white mb-4">Management Fee (Annual)</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl md:text-5xl font-mono text-white">0.12</span>
                  <span className="text-2xl text-white">%</span>
                  <span className="text-sm text-neutral-400 ml-2">/AUM</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Industry-leading rate (traditional managers charge ~1-2%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Covers all investment management services & strategy access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <span className="text-sm text-white">Applied to assets under management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Fee Calculator */}
          <div className="w-full lg:w-1/2">
            <FeeCalculator isAnnual={isAnnual} />
          </div>
        </div>
      </div>
    </section>
  );
} 