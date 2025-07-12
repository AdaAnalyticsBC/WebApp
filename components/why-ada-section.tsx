"use client"

import NumberFlow from "@number-flow/react";

export default function WhyAdaSection() {
  return (
    <div className="relative flex flex-col items-center bg-neutral-900 justify-center w-full max-w-[1480px] px-4 py-8 lg:px-8">
      {/* Numbers and Section Wrapper */}
      <div className="flex flex-row items-start justify-between w-full gap-6">
        {/* Heading Wrapper */}
        <div className="flex flex-col items-start w-fit gap-3">
          <span className="tag-1 text-neutral-500 text-left">
            [ BENEFITS ]
          </span>
          <h2 className="heading-2 text-left text-white">Why Ada Analytics?</h2>
        </div>

        {/* NUMBERS WRAPPER */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-center w-fit gap-6 sm:gap-3">
          {/* TRADING VOLUME */}
          <div className="flex flex-col items-end sm:items-center justify-center w-fit gap-3">
            <span className="tag-1 text-neutral-500 text-center md:text-left">TRADING VOLUME</span>
            <div className="flex flex-row items-end gap-1">
              <NumberFlow
                value={12000000}
                locales="en-US"
                format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
                className="heading-2 text-white text-center"
                style={{ '--number-flow-mask-height': '0em' } as any}
              />
            </div>
          </div>

          {/* Add Line Here 1px wide and 100% height, only on md+ */}
          <div className="hidden sm:block h-12 w-[1px] bg-neutral-700 mx-2" />

          {/* ORDERS EXECUTED */}
          <div className="flex flex-col items-end sm:items-center justify-center w-fit gap-3">
            <span className="tag-1 text-neutral-500 text-center md:text-left">ORDERS EXECUTED</span>
            <div className="flex flex-row items-end gap-1">
              <NumberFlow
                value={7000000}
                locales="en-US"
                className="heading-2 text-white text-center"
                style={{ '--number-flow-mask-height': '0em' } as any}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 