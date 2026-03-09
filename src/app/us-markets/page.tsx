import SectorHeatmap from "@/components/SectorHeatmap";
import StatusBar from "@/components/StatusBar";

export default function USMarketsPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <SectorHeatmap />
      </div>
      <div className="status-area">
        <StatusBar />
      </div>
    </main>
  );
}
