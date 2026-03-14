import SectorHeatmap from "@/components/SectorHeatmap";
import TickerBar from "@/components/TickerBar";
import EarningsPanel from "@/components/EarningsPanel";
import StatusBar from "@/components/StatusBar";

export default function USMarketsPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div style={{ flexShrink: 0 }}>
        <TickerBar market="US" />
      </div>
      <div className="flex-1 overflow-auto" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: "var(--space-3)" }}>
        <SectorHeatmap market="US" />
        <EarningsPanel market="US" />
      </div>
      <div className="status-area">
        <StatusBar />
      </div>
    </main>
  );
}
