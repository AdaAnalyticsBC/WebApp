/* components/perfomance-metrics.tsx */

/* Simple helper for rendering a metric label/value pair */
type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="flex flex-col px-4">
      <span className="tag-1 text-neutral-500">{label}</span>
      <span className="heading-3 text-white">{value}</span>
    </div>
  );
}

/* === Main component === */
export default function PerfomanceMetrics() {
  return (
    <section className="flex flex-col w-full gap-6">
      {/* ---------- Simulated Returns ---------- */}
      <h3 className="heading-3 text-white">Simulated Returns</h3>

      <div className="flex justify-between items-center w-full p-4 md:p-6 bg-neutral-800 rounded-xl">
        {/* Initial investment */}
        <div className="flex flex-col gap-1">
          <span className="tag-1 text-neutral-500">2020</span>
          <h3 className="heading-3 text-white">$10,000.00</h3>
        </div>

        {/* Final value */}
        <div className="flex flex-col gap-1 items-end">
          <span className="tag-1 text-neutral-500">2025</span>
          <h3 className="heading-3 text-white bg-primary/20 rounded-lg px-4 py-1">
            $182,020.46
          </h3>
        </div>
      </div>

      {/* ---------- Performance Metrics ---------- */}
      <h3 className="heading-3 text-white">Performance Metrics</h3>

      <div className="flex flex-col w-full p-4 md:p-6 bg-neutral-800 rounded-xl gap-6">
        {/* Top‑row metrics */}
        <div className="grid grid-cols-6 w-full divide-x divide-neutral-700">
          <Metric label="Cumulative Return" value="20302.3%" />
          <Metric label="Annualized Return" value="400.5%" />
          <Metric label="Max Drawdown" value="-15.2%" />
          <Metric label="Sharpe Ratio" value="3.22" />
          <Metric label="Standard Deviation" value="80.7%" />
          <Metric label="Alpha" value="2.68" />
        </div>

        {/* Beta (second row) */}
        <Metric label="Beta vs SPY" value="0.25" />
      </div>

      <p className="paragraph-1 text-neutral-500">
        This interactive performance tool offers hypothetical performance outcomes for a selected strategy. Modeled performance is: (1) based on the initial investment and account type (if applicable); (2) inclusive of any Titan fees and annual fund expenses for third-party funds; and (3) assumes any dividends and distributions are reinvested. Performance returns begin at the Inception Date of the selected strategy through the Last Day of the Previous Month. Based on the chosen risk profile, users can receive a recommended portfolio allocation in line with Titan's general recommendation. Returns do not represent actual client performance.
        <br />
        Past performance is not indicative of future results; actual performance will vary. Investing involves risk, including loss of principal. Click ‘See Full Assumptions & Disclosures’ below for detailed information about the assumptions and disclosures for this tool.
      </p>
    </section>
  );
}