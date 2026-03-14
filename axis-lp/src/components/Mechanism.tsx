"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

const AuctionCycleAnimation = () => {
  const [phase, setPhase] = useState<"bid" | "win" | "yield">("bid");

  useEffect(() => {
    const cycle = async () => {
      setPhase("bid");
      await new Promise((r) => setTimeout(r, 3500));
      setPhase("win");
      await new Promise((r) => setTimeout(r, 2000));
      setPhase("yield");
      await new Promise((r) => setTimeout(r, 3500));
      cycle();
    };
    cycle();
  }, []);

  return (
    <div className="card-dark relative w-full h-[380px] sm:h-[460px] flex flex-col items-center justify-center p-5 sm:p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "bid" && (
          <motion.div
            key="bid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-lg z-10"
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FCD34D] animate-pulse" />
              <span className="text-[#FCD34D] text-xs font-bold uppercase tracking-widest">Phase 1: Auction</span>
            </div>
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
                  className={`w-14 md:w-16 rounded-t-lg relative flex justify-center ${
                    bot.win
                      ? "bg-[#FCD34D] z-10"
                      : "bg-white/5 border border-white/[0.04]"
                  }`}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -25 }}
                    transition={{ delay: bot.delay * 0.5 + 0.3 }}
                    className={`absolute -top-8 text-xs font-bold font-mono whitespace-nowrap ${
                      bot.win ? "text-[#FCD34D]" : "text-white/30"
                    }`}
                  >
                    {bot.val}
                  </motion.span>
                  {bot.win && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2 }}
                      className="absolute -top-14 bg-[#FCD34D] text-black text-[10px] font-bold px-2 py-1 rounded"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center z-10"
          >
            <div className="w-20 h-20 rounded-full bg-[#FCD34D]/10 flex items-center justify-center relative mb-6">
              <ShieldCheck className="w-8 h-8 text-[#FCD34D]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">License Minted</h3>
            <div className="flex items-center gap-3 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">
              <span className="text-white/30 text-xs uppercase tracking-wider">Fee Rate</span>
              <span className="text-[#FCD34D] font-mono text-lg font-bold">0.00%</span>
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
            <div className="flex items-center gap-2 mb-8">
              <Zap size={14} className="text-[#FCD34D]" />
              <span className="text-[#FCD34D] text-xs font-bold uppercase tracking-widest">Phase 2: Value Capture</span>
            </div>
            <div className="flex gap-6 items-center justify-center w-full px-4">
              <div className="w-28 sm:w-36 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center opacity-50">
                <span className="text-white/30 text-xs font-bold mb-2 uppercase">Legacy AMM</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-white">-13.7%</span>
              </div>
              <ArrowRight className="text-white/15 w-5 h-5" />
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="w-36 sm:w-48 p-5 rounded-xl bg-[#FCD34D]/5 border border-[#FCD34D]/20 flex flex-col items-center"
              >
                <span className="text-[#FCD34D] text-xs font-bold mb-2 uppercase">Axis</span>
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                  className="text-3xl sm:text-4xl font-mono font-black text-[#FCD34D]"
                >
                  +4.1%
                </motion.span>
                <span className="text-xs text-[#FCD34D]/60 mt-1 font-mono">Real Yield APR</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 h-[2px] bg-white/[0.03] w-full">
        <motion.div
          className="h-full bg-[#FCD34D]"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default function Mechanism() {
  return (
    <section id="mechanism" className="relative py-20 sm:py-32 px-4 sm:px-6 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left space-y-4">
          <p className="text-[#FCD34D] text-xs font-bold uppercase tracking-widest">License Auction</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-[-0.03em]">
            Don&apos;t pay for rebalancing.{" "}
            <span className="text-[#FCD34D]">Get paid for it.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed max-w-md mx-auto lg:mx-0">
            Traditional AMMs leak value to arbitrage bots. Axis internalizes
            this leakage through a License Auction, turning loss into yield for fund creators and LPs.
          </p>
        </div>
        <div className="w-full">
          <AuctionCycleAnimation />
        </div>
      </div>
    </section>
  );
}
