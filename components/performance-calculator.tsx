"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useCursorHover } from './custom-cursor';
import { StrategyCard } from './strategy-card';
import { PerformanceChart } from './performance-chart';
import Link from 'next/link';

const strategies = [
  'Luthor - Flagship (US Stocks)',
  'Lex - Defensive Strategy', 
  'Clark - Growth Strategy',
  'Diana - International Strategy'
];

const riskProfiles = [
  'Conservative',
  'Moderate',
  'Aggressive',
  'Ultra Aggressive'
];

const accountTypes = [
  'Taxable',
  'Traditional IRA',
  'Roth IRA',
  'SEP-IRA',
  '401(k)'
];

export default function PerformanceCalculator() {
  const [selectedStrategy, setSelectedStrategy] = useState('Luthor - Flagship (US Stocks)');
  const [initialInvestment, setInitialInvestment] = useState('1,000');
  const [selectedRiskProfile, setSelectedRiskProfile] = useState('Aggressive');
  const [selectedAccountType, setSelectedAccountType] = useState('Taxable');
  const [strategySelectOpen, setStrategySelectOpen] = useState(false);
  const [riskSelectOpen, setRiskSelectOpen] = useState(false);
  const [accountSelectOpen, setAccountSelectOpen] = useState(false);
  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const { onMouseEnter, onMouseLeave } = useCursorHover();

  const formatCurrency = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    // Cap at 1,000,000
    const numValue = parseInt(numbers) || 0;
    const cappedValue = Math.min(numValue, 1000000);
    // Format with commas
    return cappedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setInitialInvestment(formatted);
  };

  const handleInfoClick = () => {
    setHoverCardOpen(!hoverCardOpen);
  };

  const handleHoverCardMouseLeave = () => {
    setHoverCardOpen(false);
  };

  const calculatorCard = (
    <div className="bg-neutral-800 rounded-xl p-4 md:p-6 w-full">
      <div className="space-y-6">
        
        {/* Strategy Select */}
        <div>
          <label className="text-neutral-400 text-sm font-medium mb-3 block">
            Strategy
          </label>
          <Select 
            value={selectedStrategy} 
            onValueChange={setSelectedStrategy}
            onOpenChange={setStrategySelectOpen}
          >
            <SelectTrigger 
              className="w-full h-12 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 transition-all duration-300 ease-in-out"
              onMouseEnter={() => !strategySelectOpen && onMouseEnter('hover')}
              onMouseLeave={() => !strategySelectOpen && onMouseLeave()}
            >
              <SelectValue className="transition-opacity duration-200" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 border-neutral-600">
              {strategies.map((strategy) => (
                <SelectItem
                  key={strategy}
                  value={strategy}
                  className="text-white hover:bg-neutral-600 hover:text-white focus:bg-neutral-600 focus:text-white cursor-pointer"
                >
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Initial Investment */}
        <div>
          <label className="text-neutral-400 text-sm font-medium mb-3 block">
            Initial Investment
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg font-medium z-10">
              $
            </div>
            <Input
              value={initialInvestment}
              onChange={handleInvestmentChange}
              className="h-12 bg-neutral-700 border-neutral-600 text-white pl-8 pr-4 text-base font-medium placeholder:text-neutral-400 focus:border-sky-400 focus:ring-sky-400/20 hover:bg-neutral-600 transition-colors duration-200"
              placeholder="1,000"
              onMouseEnter={() => onMouseEnter('hover')}
              onMouseLeave={onMouseLeave}
            />
          </div>
          <div className="flex items-center justify-end mt-2">
            <div className="flex items-center gap-1 text-neutral-400 text-sm">
              <span>0.20% Fee</span>
              <HoverCard 
                open={hoverCardOpen} 
                onOpenChange={setHoverCardOpen}
              >
                <HoverCardTrigger asChild>
                  <button
                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                    onClick={handleInfoClick}
                    onMouseEnter={() => onMouseEnter('hover')}
                    onMouseLeave={onMouseLeave}
                  >
                    <Info size={14} />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="bg-neutral-800 border-neutral-600 text-white w-80"
                  side="top"
                  align="end"
                  sideOffset={8}
                  onMouseLeave={handleHoverCardMouseLeave}
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Fee Structure</h4>
                    <p className="text-sm text-neutral-300">
                      Our transparent 0.20% annual management fee is calculated on your total assets under management. 
                      This competitive rate includes all trading, research, and portfolio management services.
                    </p>
                    <div className="pt-2 border-t border-neutral-600">
                      <p className="text-xs text-neutral-400">
                        Industry average: 1-2% annually
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>

        {/* Risk Profile and Account Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Risk Profile */}
          <div>
            <label className="text-neutral-400 text-sm font-medium mb-3 block">
              Risk Profile
            </label>
            <Select 
              value={selectedRiskProfile} 
              onValueChange={setSelectedRiskProfile}
              onOpenChange={setRiskSelectOpen}
            >
              <SelectTrigger 
                className="w-full h-12 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 transition-colors duration-200"
                onMouseEnter={() => !riskSelectOpen && onMouseEnter('hover')}
                onMouseLeave={() => !riskSelectOpen && onMouseLeave()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600">
                {riskProfiles.map((profile) => (
                  <SelectItem
                    key={profile}
                    value={profile}
                    className="text-white hover:bg-neutral-600 hover:text-white focus:bg-neutral-600 focus:text-white cursor-pointer"
                  >
                    {profile}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Type */}
          <div>
            <label className="text-neutral-400 text-sm font-medium mb-3 block">
              Account Type
            </label>
            <Select 
              value={selectedAccountType} 
              onValueChange={setSelectedAccountType}
              onOpenChange={setAccountSelectOpen}
            >
              <SelectTrigger 
                className="w-full h-12 bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600 transition-colors duration-200"
                onMouseEnter={() => !accountSelectOpen && onMouseEnter('hover')}
                onMouseLeave={() => !accountSelectOpen && onMouseLeave()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600">
                {accountTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-white hover:bg-neutral-600 hover:text-white focus:bg-neutral-600 focus:text-white cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const disclosures = (
    <div className="w-full">
      <p className="text-neutral-500 text-sm leading-tight tracking-tight">
        This interactive performance tool offers hypothetical performance outcomes for a selected strategy. 
        Modeled performance is: (1) based on the initial investment and account type (if applicable); 
        (2) inclusive of any Titan fees and annual fund expenses for third-party funds; and 
        (3) assumes any dividends and distributions are reinvested.
      </p>
      <br />
      <p className="text-neutral-500 text-sm leading-tight tracking-tight">
        Performance returns begin at the Inception Date of the selected strategy through the Last Day of the Previous Month. 
        Based on the chosen risk profile, users can receive a recommended portfolio allocation in line with Titan&apos;s general recommendation.
      </p>
      <br />
      <p className="text-neutral-500 text-sm leading-tight tracking-tight">
        Returns do not represent actual client performance. Past performance is not indicative of future results; 
        actual performance will vary. Investing involves risk, including loss of principal.
      </p>
      <br />
      <div className="flex justify-start">
        <Link
          href="/disclosures"
          className="text-neutral-500 hover:text-sky-500 text-sm font-medium underline underline-offset-2 transition-colors duration-200"
          onMouseEnter={() => onMouseEnter('hover')}
          onMouseLeave={onMouseLeave}
        >
          See Full Assumptions &amp; Disclosures
        </Link>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col items-center justify-center w-full h-fit px-4 py-8 lg:px-8 lg:py-12 bg-neutral-900">
      <div className="flex flex-col items-center justify-center w-full h-fit max-w-[1480px]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center w-full max-w-[800px] mb-8">
          <span className="tag-1 text-neutral-500 text-center mb-3">[ PERFORMANCE ]</span>
          <h1 className="heading-1 text-white text-center mb-4">
            Perfomance
          </h1>
          <p className="subtitle-1 text-neutral-400 text-center max-w-[600px]">
            Below is historical information on the performance of our strategies.          
          </p>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-center w-full gap-8 lg:gap-8">
          
          {/* Performance Chart - First on mobile, right on desktop */}
          <div className="flex flex-col w-full h-fit gap-4 order-1 lg:order-2">
            <PerformanceChart strategy={selectedStrategy} initialInvestment={initialInvestment}
              extra={
                <div className="w-full flex justify-center items-center lg:hidden my-6">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="none" className="!block flex-1 max-w-[320px] bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-full uppercase tracking-tight button-2">
                        Open Calculator
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent aria-label="Calculator" className="flex flex-col w-full h-fit items-center justify-start bg-neutral-900 border-t border-neutral-700 p-4 pb-8 rounded-t-xl">
                      <DrawerHeader>
                        <DrawerTitle className="sr-only">Calculator</DrawerTitle>
                      </DrawerHeader>
                      {calculatorCard}
                      {/* Footer – extra spacing and centering for the Confirm button */}
                      <DrawerFooter  /* kill the built-in padding and let the button stretch */
                        className="w-full mt-8 flex flex-col items-center gap-2 px-0"
                      >
                        <DrawerClose asChild className="w-full">
                          <Button
                            variant="none"
                            className="!block w-full flex-1 bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-full uppercase tracking-tight button-2"
                          >
                            CONFIRM
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              }
            />
          </div>

          {/* Desktop / Tablet: Calculator & Strategy card */}
          <div className="hidden lg:flex flex-col w-full lg:max-w-[400px] gap-6 order-2 lg:order-1">
            {/* Calculator Card */}
            {calculatorCard}
            {/* Strategy Details Card */}
            <StrategyCard strategy={selectedStrategy} />
            {disclosures}
          </div>

          {/* Mobile Strategy card below chart */}
          <div className="lg:hidden mt-4 order-3 gap-6 lg:gap-4 flex flex-col h-fit w-full">
            <StrategyCard strategy={selectedStrategy} />
            {disclosures}
           
          </div>

        </div>
      </div>
    </section>
  );
}