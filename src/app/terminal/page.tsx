import MarketFeed from "@/components/MarketFeed";
import CommandInput from "@/components/CommandInput";
import StatusBar from "@/components/StatusBar";

export default function TerminalPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <MarketFeed />
      </div>
      <div className="input-area">
        <CommandInput />
      </div>
      <div className="status-area">
        <StatusBar />
      </div>
    </main>
  );
}
