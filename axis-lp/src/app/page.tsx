"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useMotionValueEvent 
} from "framer-motion";
import { 
  ArrowRight, Zap, ShieldCheck, 
  Github, FileText, Menu, X 
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* STYLES                                     */
/* -------------------------------------------------------------------------- */
// グローバルCSSファイルを編集しなくて済むように、ここでスタイルを注入します
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --font-serif: "Times New Roman", Times, serif;
      --font-sans: "Inter", system-ui, sans-serif;
      --color-gold-light: #FCD34D;
      --color-gold-base: #D97706;
      --color-gold-dark: #78350F;
      --color-obsidian: #050505;
    }

    body {
      background-color: var(--color-obsidian);
      color: #E7E5E4;
      font-family: var(--font-sans);
      overflow-x: hidden;
    }

    /* 高級ガラスカード */
    .card-glass {
      background: 
        linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.6) 100%),
        rgba(10, 10, 10, 0.7);
      backdrop-filter: blur(24px);
      border-radius: 24px;
      position: relative;
      box-shadow: 
        0 20px 50px -10px rgba(0, 0, 0, 0.8),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* ガラスの縁（擬似要素） */
    .card-glass::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 24px;
      padding: 1px;
      background: linear-gradient(
        160deg, 
        rgba(255, 255, 255, 0.2) 0%, 
        rgba(255, 255, 255, 0.05) 30%, 
        rgba(217, 119, 6, 0.1) 60%, 
        rgba(217, 119, 6, 0.6) 100%
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask-composite: xor;
      pointer-events: none;
    }

    /* ゴールドグラデーションテキスト */
    .text-gold-gradient {
      background: linear-gradient(135deg, #FFFBEB 0%, #FCD34D 40%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* 選択色 */
    ::selection {
      background: #D97706;
      color: #000;
    }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* UI COMPONENTS                                   */
/* -------------------------------------------------------------------------- */

const PhoneMockup = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={`relative w-full aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-3 shadow-2xl overflow-hidden mx-auto ${className}`}
    style={{
      background: 'linear-gradient(145deg, #1a1a1a, #000000)',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)'
    }}
  >
    {/* ベゼル装飾 */}
    <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 pointer-events-none"></div>
    
    {/* ダイナミックアイランド */}
    <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-6 sm:h-7 bg-black rounded-full z-30 flex items-center justify-center border border-white/5">
        <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-[#111] rounded-full"></div>
    </div>

    {/* スクリーン */}
    <div className="h-full w-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-black relative border border-white/5 flex flex-col">
       {children}
       <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.1)_0%,transparent_30%,transparent_60%,rgba(255,255,255,0.05)_100%)] pointer-events-none z-20 mix-blend-overlay" />
    </div>
  </div>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

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
    <div className="card-glass relative w-full h-[380px] sm:h-[480px] md:h-[500px] flex flex-col items-center justify-center p-5 sm:p-8 overflow-hidden">
      {/* 背景のグリッド装飾 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {phase === "bid" && (
          <motion.div 
            key="bid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            className="flex flex-col items-center w-full max-w-lg z-10"
          >
            <h3 className="text-gold-gradient text-xs font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shadow-[0_0_10px_#D97706]"/> Phase 1: Auction
            </h3>
            <div className="relative w-full h-40 flex items-end justify-center gap-4">
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
                   className={`w-14 md:w-16 rounded-t-lg relative flex justify-center backdrop-blur-sm border-t border-l border-r border-white/10 ${
                     bot.win 
                       ? 'bg-gradient-to-t from-[#78350F] to-[#D97706] shadow-[0_0_40px_rgba(217,119,6,0.5)] z-10' 
                       : 'bg-white/5'
                   }`}
                 >
                   <motion.span 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: -25 }}
                     transition={{ delay: bot.delay * 0.5 + 0.3 }}
                     className={`absolute -top-8 text-xs font-bold font-sans whitespace-nowrap ${bot.win ? 'text-[#FCD34D]' : 'text-white/40'}`}
                   >
                     {bot.val}
                   </motion.span>
                   {bot.win && (
                     <motion.div 
                       initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}
                       className="absolute -top-16 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg"
                     >
                       WINNER
                     </motion.div>
                   )}
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {phase === "win" && (
          <motion.div 
            key="win"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center z-10"
          >
            <div className="w-24 h-24 rounded-full border border-[#D97706]/30 bg-[#78350F]/10 flex items-center justify-center relative mb-6 shadow-[0_0_30px_rgba(217,119,6,0.2)]">
              <ShieldCheck className="w-10 h-10 text-[#D97706]" />
              <div className="absolute inset-0 border border-[#D97706]/50 rounded-full animate-ping opacity-50"/>
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">License Minted</h3>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-lg border border-[#D97706]/20 shadow-inner">
              <span className="text-white/40 text-xs uppercase tracking-wider">Fee Rate</span>
              <span className="text-[#FCD34D] font-sans text-xl font-bold">0.00%</span>
            </div>
          </motion.div>
        )}

        {phase === "yield" && (
            <motion.div 
            key="yield"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full z-10"
          >
            <h3 className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <Zap size={14} className="fill-emerald-400" /> Phase 2: Value Capture
            </h3>
            <div className="flex gap-6 items-center justify-center w-full px-4">
               {/* 負け側 */}
               <motion.div 
                 className="w-28 sm:w-36 p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center opacity-50 grayscale"
               >
                 <span className="text-white/40 text-xs font-bold mb-2 uppercase">Legacy AMM</span>
                 <span className="text-xl sm:text-2xl font-sans font-bold text-white">-13.7%</span>
               </motion.div>
               
               <ArrowRight className="text-white/20 w-6 h-6" />
               
               {/* 勝ち側（Axis） */}
               <motion.div 
                 initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                 className="w-36 sm:w-48 p-5 rounded-xl border border-[#D97706]/50 bg-gradient-to-b from-[#78350F]/20 to-black flex flex-col items-center shadow-[0_0_50px_rgba(217,119,6,0.15)]"
               >
                 <span className="text-[#D97706] text-xs font-bold mb-2 uppercase">Axis</span>
                 <motion.span
                   initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.4 }}
                   className="text-3xl sm:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FCD34D] drop-shadow-lg"
                 >
                   +4.1%
                 </motion.span>
                 <span className="text-xs text-[#D97706]/80 mt-2 font-mono">Real Yield APR</span>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full">
        <motion.div 
          className="h-full bg-[#D97706] box-shadow-[0_0_10px_#D97706]"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PAGE SECTIONS                                   */
/* -------------------------------------------------------------------------- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // スムーズスクロール用関数
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} className="text-2xl font-serif font-black tracking-tighter italic text-white hover:opacity-80 transition-opacity">
          Axis
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
           {[
             { name: 'Home', id: 'hero' },
             { name: 'How it Works', id: 'how-it-works' }, 
             { name: 'Mechanism', id: 'mechanism' }
           ].map((item) => (
             <button 
               key={item.name} 
               onClick={() => scrollTo(item.id)}
               className="text-sm font-medium text-white/50 hover:text-[#D97706] transition-colors"
             >
               {item.name}
             </button>
           ))}
        </div>

        {/* Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
        <a 
          href="https://axs.pizza" // ← ここに実際のアプリのURLを入力してください
          target="_blank" // 別のタブで開く場合（不要なら削除）
          rel="noopener noreferrer" // セキュリティ対策（target="_blank"を使う場合推奨）
          className="hidden sm:block bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-white/10 transition-all text-white/70 text-center"
        >
          Launch App
        </a>
          
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {[
                 { name: 'Home', id: 'hero' },
                 { name: 'How it Works', id: 'how-it-works' }, 
                 { name: 'Mechanism', id: 'mechanism' }
              ].map((item) => (
                 <button 
                   key={item.name} 
                   className="text-left text-xl font-serif text-white/70 py-3 border-b border-white/5" 
                   onClick={() => scrollTo(item.id)}
                 >
                   {item.name}
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 sm:pt-0 sm:pb-0">
      <motion.div 
        style={{ opacity, scale }} 
        className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-32 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 z-10"
      >
        <div className="flex-1 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] sm:leading-[0.9] mb-6 tracking-tight font-serif"
          >
            First onchain <br /> 
            <span className="italic font-normal text-white/60">Index funds.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.6 }} 
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-xl md:text-2xl font-light italic text-white/80 max-w-lg mx-auto lg:mx-0"
          >
            Your idea. Your ETF. Built for the sovereign individual.
          </motion.p>
        </div>

        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, delay: 0.6 }}
            className="w-[240px] sm:w-[280px] lg:w-[340px]"
          >
            <PhoneMockup>
               <img 
                 src="/hero.png" 
                 alt="Axis Interface" 
                 className="w-full h-full object-cover"
               />
            </PhoneMockup>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.3) setActiveStep(0);
    else if (latest < 0.7) setActiveStep(1);
    else setActiveStep(2);
  });

  const steps = [
    {
      id: "discover",
      number: "1",
      title: "Discover Alpha.",
      desc: "Browse community-crafted indices. Find the strategy that defines your thesis.",
      video: "/videos/discover.mp4"
    },
    {
      id: "invest",
      number: "2",
      title: "Invest Atomically.",
      desc: "One click, total exposure. Axis routes your entry optimally in a single block.",
      video: "/videos/invest.mp4"
    },
    {
      id: "create",
      number: "3",
      title: "Create Standard.",
      desc: "Build your own index. Define weights, set rules, and launch instantly.",
      video: "/videos/create.mp4"
    }
  ];

  return (
    <section id="how-it-works" ref={containerRef} className="relative z-10">
      
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-16 py-20 px-6">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center text-center gap-8">
             <div className="space-y-4">
               <span className="text-[#D97706] text-lg font-bold font-mono">/{step.number}</span>
               <h3 className="text-4xl font-serif font-bold text-white">{step.title}</h3>
               <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
             </div>
             <div className="w-[240px]">
               <PhoneMockup>
                 <video 
                   src={step.video} 
                   autoPlay 
                   loop 
                   muted 
                   playsInline 
                   className="w-full h-full object-cover"
                 />
               </PhoneMockup>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-[300vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
           <div className="max-w-7xl w-full mx-auto grid grid-cols-2 gap-20 items-center px-12">
              <div className="h-[300px] relative">
                <AnimatePresence mode="wait">
                   <motion.div 
                     key={activeStep}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="absolute inset-0 flex flex-col justify-center"
                   >
                     <div className="w-16 h-16 rounded-full border border-[#D97706]/30 text-[#D97706] text-2xl font-bold flex items-center justify-center mb-8">
                       {steps[activeStep].number}
                     </div>
                     <h3 className="text-7xl font-serif font-bold mb-6 text-white">{steps[activeStep].title}</h3>
                     <p className="text-xl text-white/60 max-w-md">{steps[activeStep].desc}</p>
                   </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-end">
                 <div className="w-[320px]">
                   <PhoneMockup>
                      <AnimatePresence mode="wait">
                        <motion.video 
                          key={activeStep}
                          src={steps[activeStep].video}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>
                   </PhoneMockup>
                 </div>
              </div>
           </div>
           
           <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {steps.map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: i === activeStep ? 32 : 8,
                    backgroundColor: i === activeStep ? "#D97706" : "rgba(255,255,255,0.2)"
                  }}
                  className="w-1 rounded-full"
                />
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

const Mechanism = () => {
  return (
    <section id="mechanism" className="relative py-20 sm:py-32 px-4 sm:px-6 bg-black/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Text Side */}
        <div className="text-center lg:text-left space-y-6">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white">
            Don't pay for <br />
            <span className="text-white/40">rebalancing.</span> <br />
            <span className="text-gold-gradient italic">Get paid for it.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md mx-auto lg:mx-0">
            Traditional AMMs leak value to arbitrage bots. Axis internalizes this leakage through a 
            <strong className="text-white"> License Auction</strong>, turning loss into yield.
          </p>
        </div>

        {/* Animation Container */}
        <div className="w-full">
            <AuctionCycleAnimation />
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-16 md:py-24 relative z-10 px-6 border-t border-white/5 bg-black">
    <div className="max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Brand */}
      <h2 className="text-3xl md:text-5xl font-serif font-black mb-8 tracking-tighter italic text-white/80">
        Axis
      </h2>
      
      {/* Social Links */}
      <div className="flex gap-8 md:gap-12 mb-12">
        <a href="https://x.com/Axis_pizza" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#D97706] transition-all hover:scale-110">
          <XIcon className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <a href="https://github.com/Axis-pizza/Axis_MVP" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#D97706] transition-all hover:scale-110">
          <Github className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <a href="https://muse-7.gitbook.io/axis/product-docs" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#D97706] transition-all hover:scale-110">
          <FileText className="w-5 h-5 md:w-6 md:h-6" />
        </a>
      </div>

      {/* Legal Links (Restored) */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12 text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/30">
        <a href="/privacy" className="hover:text-[#D97706] transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-[#D97706] transition-colors">Terms</a>
        <a href="/license" className="hover:text-[#D97706] transition-colors">License</a>
        <a href="/copyright" className="hover:text-[#D97706] transition-colors">Copyright</a>
      </div>

      {/* Copyright & Tagline */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 text-[10px] uppercase tracking-widest font-bold text-center md:text-left border-t border-white/5 pt-8 mt-4">
        <p className="font-mono">© 2026 AXIS</p>
        <p>Built for the Sovereign Individual</p>
      </div>
    </div>
  </footer>
);

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function AxisLandingPage() {
  return (
    <>
      <GlobalStyles />
      <main className="bg-[#050505] text-[#E7E5E4] font-sans w-full min-h-screen relative selection:bg-[#D97706] selection:text-black">
        
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
           }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,53,15,0.15),transparent_70%)]" />

        <Navbar />
        
        <div className="relative z-10 flex flex-col">
          <Hero />
          <HowItWorks />
          <Mechanism />
        </div>

        <Footer />
      </main>
    </>
  );
}