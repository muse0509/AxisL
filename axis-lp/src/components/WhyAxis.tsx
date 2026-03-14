"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "One-Click Diversification",
    desc: "Mint an index token and get exposure to an entire strategy in a single transaction.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Fully Permissionless",
    desc: "Anyone can create and launch an index fund onchain. No gatekeepers, no applications.",
  },
  {
    icon: <ArrowRight className="w-5 h-5" />,
    title: "Automatic Rebalancing",
    desc: "Set your rules once and the protocol handles the rest. Built on Solana for speed.",
  },
];

export default function WhyAxis() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-[#FCD34D] text-xs font-bold uppercase tracking-widest mb-3">
            Why Axis
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-tight">
            Index funds, but onchain.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-dark p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FCD34D]/10 flex items-center justify-center text-[#FCD34D] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
