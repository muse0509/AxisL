"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { 
  ArrowRight, Zap, Shield, Repeat, 
  Compass, Wallet, BarChart3, 
  Github, FileText, ExternalLink, TrendingUp,
  Plus, Layers
} from "lucide-react";
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

// --- Icons ---
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const TOKEN_ADDRESS = "HHf2VfXSPUVqQth6tXypfdUX2vawCiVKfkbAX4CJpump";

// --- Components ---
// 1. オークションアニメーション（はみ出し修正・Flexbox版）
const AuctionAnimation = () => {
  const [step, setStep] = useState(0);

  // 高さの調整: ラベルが乗る分を考慮して MAX 75% 程度に設定
  const bids = [
    { price: "$0.47", height: "30%", color: "bg-blue-900/80" },
    { price: "$0.58", height: "45%", color: "bg-blue-800/80" },
    { price: "$0.73", height: "60%", color: "bg-blue-700/80" },
    { price: "$0.99", height: "75%", color: "bg-gradient-to-t from-orange-600 to-orange-400", isFinal: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (bids.length + 2));
    }, 1200);
    return () => clearInterval(interval);
  }, [bids.length]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-end justify-center gap-3 md:gap-6 bg-black/40 rounded-[2rem] md:rounded-[3rem] border border-gold/10 overflow-hidden p-6 md:p-12">
      <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />

      {bids.map((bid, index) => {
        const show = step >= index + 1;
        return (
          // Flexboxで下揃え配置。
          // これにより、ラベル(上)と棒グラフ(下)が積み重なり、棒が伸びるとラベルも上に移動します。
          <div key={index} className="relative flex flex-col items-center justify-end h-full flex-1 max-w-[80px]">
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  // ★修正点: absolute を削除し、margin-bottom で棒グラフとの距離を確保
                  className="mb-3 flex flex-col items-center z-20 w-full"
                >
                  <span className={`text-xs md:text-lg font-bold font-mono px-2 md:px-3 py-1 rounded-md whitespace-nowrap shadow-xl ${bid.isFinal ? 'text-white bg-orange-500' : 'text-white/80 bg-blue-950/80'}`}>
                    {bid.price}
                  </span>
                  {bid.isFinal && (
                    <motion.span 
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      className="text-[8px] md:text-[10px] font-bold text-black bg-white px-1.5 py-0.5 rounded-sm mt-1 whitespace-nowrap tracking-tighter md:tracking-wider"
                    >
                      AUCTION END
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: show ? bid.height : "0%" }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.05 }}
              className={`w-full rounded-t-lg md:rounded-t-xl ${bid.color} ${bid.isFinal ? 'shadow-[0_0_40px_rgba(249,115,22,0.4)] z-10' : 'opacity-60'} relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            </motion.div>
          </div>
        );
      })}
      
      <div className="absolute bottom-4 md:bottom-6 text-center w-full px-4">
        <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
          MEV Recapture in progress
        </p>
      </div>
    </div>
  );
};
// 2. スマホモックアップ
const PhoneMockup = ({ label }: { label: string }) => (
  <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[9/18.5] rounded-[2.5rem] md:rounded-[3rem] border-[4px] md:border-[6px] border-white/5 bg-[#0C0A09] p-2 md:p-3 shadow-2xl overflow-hidden mx-auto lg:mx-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-black rounded-b-2xl z-30" />
    <div className="h-full w-full rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden bg-white/5 flex items-center justify-center relative border border-white/5">
       <div className="text-gold/10 text-2xl md:text-4xl italic font-black rotate-12 select-none uppercase tracking-tighter">{label} DEMO</div>
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1),transparent)]" />
    </div>
  </div>
);


const CandleStickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        // 1. トークン情報の取得 (DexScreener)
        const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
        const dexJson = await dexRes.json();
        const pair = dexJson.pairs?.[0];

        if (!pair) return;

        setTokenInfo({
          price: pair.priceUsd,
          change24h: pair.priceChange.h24,
          symbol: pair.baseToken.symbol,
        });

        // 2. チャートデータの取得 (GeckoTerminal) - 15分足
        const chartRes = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/solana/pools/${pair.pairAddress}/ohlcv/minute?aggregate=15&limit=100`
        );
        const chartJson = await chartRes.json();
        
        if (!chartJson.data || !chartContainerRef.current) return;

        // データ整形: [time, open, high, low, close, volume]
        const candleData = chartJson.data.attributes.ohlcv_list.map((item: number[]) => ({
          time: item[0],
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
        })).reverse(); // GeckoTerminalは新しい順に来るので逆転させる

        // 3. チャートの初期化
        // 既存のチャートがあれば削除（再レンダリング対策）
        chartContainerRef.current.innerHTML = '';

        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#525252',
          },
          grid: {
            vertLines: { color: 'rgba(42, 46, 57, 0)' }, // グリッド線なし
            horzLines: { color: 'rgba(42, 46, 57, 0.1)' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 350,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          rightPriceScale: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          crosshair: {
            mode: CrosshairMode.Normal,
          },
        });

        // ローソク足シリーズの追加
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#10B981',        // 上昇: エメラルドグリーン
          downColor: '#EF4444',      // 下落: 赤
          borderVisible: false,
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });

        candlestickSeries.setData(candleData);
        chart.timeScale().fitContent();

        // リサイズ対応
        const handleResize = () => {
          if (chartContainerRef.current) {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
          }
        };
        window.addEventListener('resize', handleResize);

        setLoading(false);

        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };

      } catch (e) {
        console.error("Chart Error", e);
      }
    };

    fetchAndRender();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-white/20 animate-pulse font-mono text-xs">
        INITIALIZING CHART DATA...
      </div>
    );
  }

  const isPositive = tokenInfo?.change24h >= 0;

  return (
    <div className="w-full flex flex-col">
      {/* Header Info */}
      <div className="flex justify-between items-end px-6 pt-6 pb-2 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
             <span className="text-gold text-xs font-bold uppercase tracking-widest">
               ${tokenInfo.symbol} / USD
             </span>
          </div>
          <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter">
            ${parseFloat(tokenInfo.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
        </div>
        <div className={`text-xl font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={24} /> : <TrendingUp size={24} className="rotate-180" />}
          {tokenInfo.change24h}%
        </div>
      </div>
      
      {/* Chart Canvas Area */}
      <div ref={chartContainerRef} className="w-full h-[350px]" />
    </div>
  );
};

// --- Main Page ---
export default function AxisLanding() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }, []);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <main className="bg-[#050505] text-[#E7E5E4] font-serif min-h-screen relative overflow-x-hidden selection:bg-gold selection:text-black">
      
      {/* 水面のように動く背景グラデーション */}
      <div className="fixed inset-0 bg-water-flow opacity-60 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />
      
      {/* Navigation (Blur & Transparent) */}
      <nav className="fixed top-0 w-full px-6 md:px-12 lg:px-20 py-6 md:py-10 flex justify-between items-center z-[100] backdrop-blur-xl bg-black/20 border-b border-white/5">
        <span className="text-xl md:text-2xl font-bold tracking-tighter text-gold uppercase italic">Axis</span>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#how-it-works" className="hidden md:block text-[10px] uppercase tracking-[0.3em] font-bold hover:text-gold transition-colors">How it works</a>
          <button className="bg-gold text-black px-5 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold/20">
            Launch App
          </button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-gold/20 text-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 md:mb-12 bg-gold/5 backdrop-blur-md"
          >
            First onchain index funds on Solana
          </motion.span>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-bold leading-[0.9] mb-10 md:mb-14 tracking-tight">
            The ETF <br /> 
            <span className="italic font-normal text-white/10">Factory.</span>
          </h1>
          <p className="text-lg md:text-2xl opacity-40 font-light leading-relaxed max-w-2xl mx-auto italic">
            No gatekeepers. No hidden fees. <br />
            Institutional portfolios, native to the frontier.
          </p>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-10 flex flex-col items-center gap-4 opacity-20 hidden md:flex"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* 2. How It Works (Steps) */}
      <section id="how-it-works" className="relative z-10 py-32 md:py-60 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="mb-24 md:mb-48 text-center md:text-left">
          <h2 className="text-4xl md:text-7xl font-bold italic mb-6">How to Axis.</h2>
          <p className="text-white/30 uppercase tracking-[0.3em] text-xs md:text-sm font-bold">Three steps to on-chain sovereignty</p>
        </div>

        <div className="space-y-48 md:space-y-80">
          {/* Step 1: Discover */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }} className="flex-1 space-y-6 md:space-y-10 order-2 lg:order-1">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl md:text-2xl font-bold">1</div>
              <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">Discover <br/><span className="text-white/20">Market Alpha.</span></h3>
              <p className="text-base md:text-xl opacity-40 leading-relaxed max-w-md italic">Browse community-crafted indices. From AI Agents to L1 Shards, find the strategy that defines your thesis.</p>
              <div className="flex flex-wrap gap-4 text-gold/80 font-bold uppercase text-[10px] md:text-xs tracking-widest pt-4">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><Compass size={14}/> Live Stats</span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><BarChart3 size={14}/> Risk Filter</span>
              </div>
            </motion.div>
            <div className="flex-1 order-1 lg:order-2"><PhoneMockup label="DISCOVER" /></div>
          </div>

          {/* Step 2: Invest */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
            <div className="flex-1 order-1"><PhoneMockup label="INVEST" /></div>
            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 30 }} className="flex-1 space-y-6 md:space-y-10 order-2">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl md:text-2xl font-bold">2</div>
              <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">Invest <br/><span className="text-white/20">Atomically.</span></h3>
              <p className="text-base md:text-xl opacity-40 leading-relaxed max-w-md italic">One click, total exposure. Axis routes your entry through Jupiter, ensuring optimal fill for the entire basket in a single block.</p>
              <div className="flex flex-wrap gap-4 text-gold/80 font-bold uppercase text-[10px] md:text-xs tracking-widest pt-4">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><Wallet size={14}/> Zero Entry Fee</span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><Zap size={14}/> Instant Fill</span>
              </div>
            </motion.div>
          </div>

          {/* Step 3: Create (Added) */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }} className="flex-1 space-y-6 md:space-y-10 order-2 lg:order-1">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl md:text-2xl font-bold">3</div>
              <h3 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">Create <br/><span className="text-white/20">The Standard.</span></h3>
              <p className="text-base md:text-xl opacity-40 leading-relaxed max-w-md italic">Build your own index. Define weights, set rebalancing rules, and launch your strategy to the global market instantly.</p>
              <div className="flex flex-wrap gap-4 text-gold/80 font-bold uppercase text-[10px] md:text-xs tracking-widest pt-4">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><Plus size={14}/> Custom Weights</span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><Layers size={14}/> Auto-Rebalance</span>
              </div>
            </motion.div>
            <div className="flex-1 order-1 lg:order-2"><PhoneMockup label="CREATE" /></div>
          </div>
        </div>
      </section>

      {/* 3. Mechanism Section */}
      <section id="mechanism" className="py-32 md:py-60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-8xl font-bold mb-8 md:mb-12 leading-none tracking-tighter">
              Internalizing <br />
              <span className="text-gold italic">Arbitrage.</span>
            </h2>
            <p className="text-lg md:text-2xl opacity-40 leading-relaxed mb-12 md:mb-16 italic">
              Axis turns rebalancing from a cost into a revenue stream. Through our **License Auction**, executors bid for the right to optimize your index.
            </p>
            
          </div>
          <AuctionAnimation />
        </div>
      </section>

      {/* 4. Token Section ($MAXIS) - Real Data Integration */}
      <section id="token" className="py-32 md:py-60 relative z-10 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-bold mb-6 leading-none tracking-tighter">
                The Axis <br />
                <span className="text-gold italic">Standard.</span>
              </h2>
              <p className="text-lg md:text-xl opacity-50 font-light leading-relaxed max-w-xl">
                $MAXIS is not just a meme. It represents the captured value of the Axis protocol. 
                Track the pulse of the ecosystem in real-time.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <a 
                href={`https://pump.fun/${TOKEN_ADDRESS}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-4 px-8 py-4 bg-emerald-500 text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                Buy on Pump.fun <ExternalLink size={18} />
              </a>
              <a 
                href={`https://dexscreener.com/solana/${TOKEN_ADDRESS}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
              >
                View on DexScreener <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"/>
              </a>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full bg-[#0C0A09] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative group min-h-[400px]">
             {/* 背景装飾 */}
             <div className="absolute inset-0 bg-magma-dark opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none" />
             
             {/* 本格的なローソク足チャート */}
             <CandleStickChart />
          </div>
        </div>
      </section>

      {/* Footer (Icons Only) */}
      <footer className="py-20 md:py-32 relative z-10 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-black mb-12 tracking-tighter italic opacity-80">Axis Protocol.</h2>
          
          <div className="flex gap-8 md:gap-12 mb-20">
            <a href="https://x.com" target="_blank" className="text-white/40 hover:text-gold transition-all hover:scale-110">
              <XIcon className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a href="https://github.com" target="_blank" className="text-white/40 hover:text-gold transition-all hover:scale-110">
              <Github className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a href="#" className="text-white/40 hover:text-gold transition-all hover:scale-110">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-20 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold">
            <p>© 2026 AXIS</p>
            <p>Built for the Sovereign Individual</p>
          </div>
        </div>
      </footer>
    </main>
  );
}