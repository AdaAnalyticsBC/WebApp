import FAQItem from "./faq-item";

const faqData = [
  {
    question: "Who can invest with Ada Analytics?",
    answer: "We currently serve accredited investors and anyone with ≥ $100k in investable assets. If you meet either threshold you can open an account and allocate capital to our managed strategies."
  },
  {
    question: "What exactly is Ada Analytics—research tool, robo-advisor, or hedge-fund-lite?",
    answer: "Ada Analytics is a quantitative investment management firm that combines advanced AI research with systematic trading strategies. We provide both research insights and managed investment solutions for qualified investors."
  },
  {
    question: "Which data feeds power your models and how \"live\" are they?",
    answer: "Our models are powered by real-time market data feeds, alternative data sources including satellite imagery, social sentiment, and economic indicators. Data is updated continuously during market hours with sub-second latency for critical signals."
  },
  {
    question: "Can I inspect past performance before funding an account?",
    answer: "Yes, we provide detailed performance analytics, backtesting results, and risk metrics for all our strategies. You can review historical performance, drawdown analysis, and risk-adjusted returns before making any investment decisions."
  },
  {
    question: "What does it cost?",
    answer: "Our fee structure is transparent and competitive. We charge a management fee plus performance-based compensation aligned with your returns. Detailed fee schedules are provided during the onboarding process and vary by strategy and account size."
  },
  {
    question: "How is risk managed once my money is invested?",
    answer: "We employ multiple layers of risk management including position sizing algorithms, dynamic hedging, stop-loss mechanisms, and portfolio-level risk controls. Our systems monitor exposures 24/7 and can automatically adjust positions based on changing market conditions."
  },
  {
    question: "Is my data—and my capital—secure?",
    answer: "Security is our top priority. We use bank-level encryption, multi-factor authentication, and segregated custody accounts. Your capital is held at regulated prime brokers, and we maintain comprehensive cybersecurity protocols and insurance coverage."
  },
  {
    question: "Who's behind Ada Analytics?",
    answer: "Our team consists of quantitative researchers, former hedge fund managers, and AI specialists from top-tier institutions. We combine decades of experience in systematic trading with cutting-edge machine learning expertise to deliver superior risk-adjusted returns."
  }
];

export default function FAQQuestions() {
  return (
    <div className="flex flex-col w-full h-fit max-w-[800px]">
      {faqData.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
} 