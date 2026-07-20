import LivePrices from "@/components/LivePrices";
import MarketSentiment from "@/components/MarketSentiment";
import TrendingCoins from "@/components/TrendingCoins";
import MoversAndShakers from "@/components/MoversAndShakers";

export default function Home() {
  return (
    <div className="space-y-6">
      <MarketSentiment />

      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white">Welcome to BCA</h2>
        <p className="text-gray-400 text-sm mt-1">Your premium crypto intelligence app.</p>
      </div>
      
      <LivePrices />
      
      <TrendingCoins />

      <MoversAndShakers />

      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">System Status</h3>
        <p className="mt-2 text-green-400 font-mono text-sm">● All systems online</p>
      </div>
    </div>
  );
}
