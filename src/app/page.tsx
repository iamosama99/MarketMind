import Sidebar from "@/components/Sidebar";
import TickerBar from "@/components/TickerBar";
import SectorHeatmap from "@/components/SectorHeatmap";
import EarningsPanel from "@/components/EarningsPanel";
import MarketFeed from "@/components/MarketFeed";
import CommandInput from "@/components/CommandInput";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="terminal-grid">
        <div className="ticker-area">
          <TickerBar />
        </div>
        <div className="heatmap-area">
          <SectorHeatmap />
        </div>
        <div className="earnings-area">
          <EarningsPanel />
        </div>
        <div className="feed-area">
          <MarketFeed />
        </div>
        <div className="input-area">
          <CommandInput />
        </div>
        <div className="status-area">
          <StatusBar />
        </div>
      </main>
    </div>
  );
}
