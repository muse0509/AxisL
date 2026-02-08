"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { 
  ArrowRight, Zap, BarChart3, 
  Github, FileText, Plus, Layers,
  ShieldCheck,
  Compass, Wallet,
  Search, ArrowDown, Settings, 
  CheckCircle2
} from "lucide-react";

// --- Icons ---
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

// --- Component: Auction Cycle Animation (Responsive Optimized) ---
const AuctionCycleAnimation = () => {
  const [phase, setPhase] = useState<"bid" | "win" | "yield">("bid");

  useEffect(() => {
    const cycle = async () => {
      setPhase("bid");
      await new Promise(r => setTimeout(r, 3500));
      setPhase("win");
      await new Promise(r => setTimeout(r, 2000));
      setPhase("yield");
      await new Promise(r => setTimeout(r, 3500));
      cycle();
    };
    cycle();
  }, []);

  return (
    // 高さ: スマホ400px / PC600px
    <div className="relative w-full h-[400px] md:h-[600px] bg-[#0C0A09] rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 md:p-10 shadow-2xl">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* --- Phase 1: The Bidding War --- */}
        {phase === "bid" && (
          <motion.div 
            key="bid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="flex flex-col items-center w-full max-w-lg"
          >
            <h3 className="text-gold text-xs md:text-sm font-bold tracking-widest uppercase mb-6 md:mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"/> Phase 1: Auction
            </h3>
            
            {/* Gap調整: スマホgap-2 / PCgap-4 */}
            <div className="relative w-full h-32 md:h-40 flex items-end justify-center gap-2 md:gap-4">
               {[
                 { h: "40%", val: "10 SOL", delay: 0 },
                 { h: "60%", val: "12 SOL", delay: 1 },
                 { h: "85%", val: "15 SOL", delay: 2, win: true },
               ].map((bot, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: "0%", opacity: 0 }}
                   animate={{ height: bot.h, opacity: 1 }}
                   transition={{ delay: bot.delay * 0.5, type: "spring" }}
                   // 幅調整: スマホw-12 / PCw-16
                   className={`w-12 md:w-16 rounded-t-lg relative flex justify-center ${bot.win ? 'bg-gold z-10 shadow-[0_0_30px_rgba(217,119,6,0.4)]' : 'bg-white/10'}`}
                 >
                   <motion.span 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: -25 }}
                     transition={{ delay: bot.delay * 0.5 + 0.3 }}
                     // 文字サイズ調整
                     className={`absolute -top-6 md:-top-8 text-[9px] md:text-xs font-bold font-mono whitespace-nowrap ${bot.win ? 'text-gold' : 'text-white/40'}`}
                   >
                     {bot.val}
                   </motion.span>
                   {bot.win && (
                     <motion.div 
                       initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}
                       className="absolute -top-12 md:-top-16 bg-white text-black text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-sm"
                     >
                       WINNER
                     </motion.div>
                   )}
                 </motion.div>
               ))}
            </div>
            <p className="mt-6 md:mt-8 text-center text-white/60 text-xs md:text-sm max-w-xs px-2">
              Bots compete to pay <span className="text-white font-bold">you</span> for the right to trade.
            </p>
          </motion.div>
        )}

        {/* --- Phase 2: Execution Privilege --- */}
        {phase === "win" && (
          <motion.div 
            key="win"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gold/50 flex items-center justify-center relative mb-6">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-ping"/>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">License Minted</h3>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider">Fee Rate</span>
              <span className="text-gold font-mono text-lg md:text-xl font-bold">0.00%</span>
            </div>
            <p className="mt-4 text-center text-white/60 text-xs md:text-sm px-4">
              Winner gets exclusive 0-fee trading rights.
            </p>
          </motion.div>
        )}

        {/* --- Phase 3: Yield Distribution --- */}
        {phase === "yield" && (
          <motion.div 
            key="yield"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full"
          >
            <h3 className="text-green-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <Zap size={14} className="fill-green-400" /> Phase 2: Value Capture
            </h3>

            <div className="flex gap-2 md:gap-8 items-center justify-center w-full px-2">
               {/* Legacy vs Axis Card */}
               <motion.div 
                 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                 // 幅調整: スマホw-28 / PCw-40
                 className="w-28 md:w-40 p-3 md:p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col items-center"
               >
                 <span className="text-red-400 text-[9px] md:text-xs font-bold mb-2 uppercase">Legacy AMM</span>
                 <span className="text-lg md:text-3xl font-bold text-red-500">-13.7%</span>
                 <span className="text-[9px] md:text-[10px] text-red-400/60 mt-1">LVR Loss</span>
               </motion.div>

               <ArrowRight className="text-white/20 w-4 h-4 md:w-6 md:h-6" />

               <motion.div 
                 initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                 // 幅調整: スマホw-36 / PCw-48
                 className="w-36 md:w-48 p-4 md:p-5 rounded-xl border border-gold/50 bg-gold/10 flex flex-col items-center shadow-[0_0_50px_rgba(217,119,6,0.2)]"
               >
                 <span className="text-gold text-[9px] md:text-xs font-bold mb-2 uppercase">Axis</span>
                 <motion.span 
                   initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.4 }}
                   className="text-3xl md:text-5xl font-black text-white"
                 >
                   +4.1%
                 </motion.span>
                 <span className="text-[9px] md:text-xs text-gold/80 mt-2 font-mono">Real Yield APR</span>
               </motion.div>
            </div>
            
            <p className="mt-8 text-center text-white/60 text-xs md:text-sm max-w-sm px-4">
              We turned a <span className="text-red-400">hidden loss</span> into <span className="text-gold font-bold">your profit</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
        <motion.div 
          className="h-full bg-gold"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
};

// --- PhoneMockup Component (Responsive) ---
const PhoneMockup = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  // RadiusとBorderをスマホ/PCで切り替え
  <div className={`relative w-full aspect-[9/19] rounded-[1.75rem] md:rounded-[2rem] border-[4px] md:border-[6px] border-white/10 bg-[#0C0A09] p-1.5 shadow-2xl overflow-hidden ${className}`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-4 md:h-5 bg-black rounded-b-lg z-30" />
    
    <div className="h-full w-full rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden bg-[#111] relative border border-white/5 flex flex-col">
       {children}
       <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,transparent_40%)] pointer-events-none z-20" />
    </div>
  </div>
);

// --- Main Page ---
export default function AxisLanding() {
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: mainRef });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const stickyRef = useRef(null);
  const { scrollYProgress: stickyProgress } = useScroll({
    target: stickyRef,
    container: mainRef,
    offset: ["start start", "end end"]
  });
  
  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(stickyProgress, "change", (latest) => {
    if (latest < 0.3) setActiveStep(0);
    else if (latest < 0.7) setActiveStep(1);
    else setActiveStep(2);
  });

  // 👇 ここを元のWebM動画を使う形に戻しました
  const steps = [
    {
      id: "discover",
      number: "01",
      title: "Discover Market Alpha.",
      desc: "Browse community-crafted indices. From AI Agents to L1 Shards, find the strategy that defines your thesis.",
      screen: (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/videos/discover.webm" type="video/webm" />
          <source src="/videos/discover.mp4" type="video/mp4" />
        </video>
      ),
      tags: [{ icon: Compass, label: "Live Stats" }, { icon: BarChart3, label: "Risk Filter" }]
    },
    {
      id: "invest",
      number: "02",
      title: "Invest Atomically.",
      desc: "One click, total exposure. Axis routes your entry through Jupiter, ensuring optimal fill for the entire basket in a single block.",
      screen: (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/videos/invest.webm" type="video/webm" />
          <source src="/videos/invest.mp4" type="video/mp4" />
        </video>
      ),
      tags: [{ icon: Wallet, label: "Zero Entry Fee" }, { icon: Zap, label: "Instant Fill" }]
    },
    {
      id: "create",
      number: "03",
      title: "Create The Standard.",
      desc: "Build your own index. Define weights, set rebalancing rules, and launch your strategy to the global market instantly.",
      screen: (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/videos/create.webm" type="video/webm" />
          <source src="/videos/create.mp4" type="video/mp4" />
        </video>
      ),
      tags: [{ icon: Plus, label: "Custom Weights" }, { icon: Layers, label: "Auto-Rebalance" }]
    }
  ];

  return (
    <main 
      ref={mainRef}
      className="bg-[#050505] text-[#E7E5E4] font-serif h-screen w-full overflow-y-scroll overflow-x-hidden relative selection:bg-gold selection:text-black snap-y snap-mandatory scroll-smooth"
    >
      
      {/* Backgrounds */}
      <div className="fixed inset-0 bg-water-flow opacity-60 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full px-4 md:px-12 lg:px-20 py-4 md:py-8 flex justify-between items-center z-[100] backdrop-blur-md bg-black/10 border-b border-white/5">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            alt="Axis Logo" 
            className="h-8 md:h-12 w-auto object-contain" 
          />
        </a>
        
        <button 
          className="
            group relative 
            bg-white/5 border border-white/10 text-white/30 
            px-4 md:px-8 py-2 md:py-2.5 
            rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest 
            transition-all duration-300
            hover:bg-white/10 hover:text-white/50 hover:border-white/20
            cursor-not-allowed
          "
        >
          <span className="group-hover:hidden">Launch App</span>
          <span className="hidden group-hover:inline-block text-white/80">Coming Soon</span>
        </button>
      </nav>

     {/* 1. Hero Section */}
     <section className="relative min-h-screen flex flex-col items-center justify-start md:justify-center px-4 md:px-6 z-10 pt-40 md:pt-48 pb-20 overflow-hidden snap-start">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }} 
          className="text-center w-full max-w-6xl mx-auto relative z-20 flex flex-col items-center"
        >
          {/* Main Title */}
          {/* 先ほどの mt-32 は不要になるので削除、または微調整のみでOK */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.9] mb-4 md:mb-6 tracking-tight"
          >
            onchain <br /> 
            <span className="italic font-normal text-white/50">Index funds.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-3xl font-light italic text-white/80 mb-10 md:mb-16"
          >
            Your strategy. Your ETF.
          </motion.p>

          {/* Phone Mockup: スマホ幅を考慮してサイズ調整 */}
          <div className="w-full flex justify-center mt-4 pb-8 md:pb-12">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 100, delay: 0.6 }}
              className="relative w-full flex justify-center"
            >
              {/* max-wを画面サイズに合わせて制御 */}
              <PhoneMockup className="!w-[80vw] !max-w-[320px] md:!max-w-[370px]">
                <img 
                  src="/hero.PNG" 
                  alt="App Interface" 
                  className="w-full h-full object-cover"
                />
              </PhoneMockup>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. How It Works (Sticky Scroll) */}
      <section id="how-it-works" ref={stickyRef} className="relative z-10 h-[300vh] md:h-[350vh] snap-start">
        {/* stickyコンテナの高さを調整 */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-6">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center h-full pt-16 md:pt-0">
            
            {/* Left Side: Text Content */}
            <div className="order-2 lg:order-1 relative h-[180px] md:h-[300px] flex items-center justify-center lg:justify-start">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4 md:space-y-8 absolute w-full flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl md:text-2xl font-bold">
                     {steps[activeStep].number}
                   </div>
                   <h3 className="text-3xl md:text-7xl font-bold leading-tight tracking-tighter">
                     {steps[activeStep].title.split(" ").slice(0, -1).join(" ")} <br className="hidden md:block"/>
                     <span className="text-white/20">{steps[activeStep].title.split(" ").slice(-1)}</span>
                   </h3>
                   <p className="text-sm md:text-xl opacity-60 leading-relaxed max-w-sm md:max-w-md italic">
                     {steps[activeStep].desc}
                   </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Changing Phone Content */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end h-[40vh] md:h-auto items-end md:items-center">
              <div className="relative">
                {/* 動画部分のレスポンシブ対応 */}
                <PhoneMockup className="!w-[60vw] md:!w-full !max-w-[240px] md:!max-w-[320px]">
                   <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full w-full"
                      >
                        {steps[activeStep].screen}
                      </motion.div>
                   </AnimatePresence>
                </PhoneMockup>
                
                <motion.div 
                  className="absolute inset-0 bg-gold/20 blur-[60px] md:blur-[100px] -z-10 rounded-full"
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ 
                  height: i === activeStep ? 24 : 8,
                  backgroundColor: i === activeStep ? "#D97706" : "rgba(255,255,255,0.2)"
                }}
                className="w-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mechanism Section */}
      <section id="mechanism" className="py-20 md:py-40 relative z-10 bg-black snap-start min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
             <h2 className="text-4xl md:text-7xl font-bold leading-[0.9] tracking-tighter">
               Don't pay for <br />
               <span className="text-white/40">rebalancing.</span> <br />
               <span className="text-gold italic">Get paid for it.</span>
             </h2>
             <p className="text-sm md:text-lg text-white/60 leading-relaxed max-w-md mx-auto lg:mx-0">
               Traditional AMMs leak value to arbitrage bots. Axis internalizes this leakage through a 
               <strong className="text-white"> License Auction</strong>.
             </p>
          </div>

          {/* Right: The Responsive Animation */}
          <div className="relative w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-purple-500/20 blur-[40px] md:blur-[60px] opacity-30 rounded-full pointer-events-none" />
            <AuctionCycleAnimation />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-32 relative z-10 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl snap-start">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-black mb-12 tracking-tighter italic opacity-80">Axis</h2>
          <div className="flex gap-8 md:gap-12 mb-20">
            <a href="https://x.com/Axis_pizza" target="_blank" className="text-white/40 hover:text-gold transition-all hover:scale-110"><XIcon className="w-5 h-5 md:w-6 md:h-6" /></a>
            <a href="https://github.com/muse0509" target="_blank" className="text-white/40 hover:text-gold transition-all hover:scale-110"><Github className="w-5 h-5 md:w-6 md:h-6" /></a>
            <a href="https://muse-7.gitbook.io/axis/product-docs" className="text-white/40 hover:text-gold transition-all hover:scale-110"><FileText className="w-5 h-5 md:w-6 md:h-6" /></a>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 opacity-20 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-center md:text-left">
            <p>© 2026 AXIS</p>
            <p>Built for the Sovereign Individual</p>
          </div>
        </div>
      </footer>
    </main>
  );
}