import NewsList from "@/components/NewsList";
import StatusBar from "@/components/StatusBar";

export default function NewsPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <NewsList />
      </div>
      <div className="status-area">
        <StatusBar />
      </div>
    </main>
  );
}
