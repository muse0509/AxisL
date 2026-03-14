"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", id: "hero" },
  { name: "How it Works", id: "how-it-works" },
  { name: "Mechanism", id: "mechanism" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else {
      // Navigate to homepage with hash if not on the homepage
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <a
          href="/"
          className="hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="Axis" className="h-10 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollTo(item.id)}
              className="text-[13px] font-medium text-white/40 hover:text-white transition-colors tracking-tight"
            >
              {item.name}
            </button>
          ))}
          <a
            href="/ambassador"
            className="text-[13px] font-medium text-white/40 hover:text-white transition-colors tracking-tight flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
            Ambassador
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://axs.pizza"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex text-[13px] font-semibold px-4 py-2 rounded-lg bg-[#FCD34D] text-black hover:bg-[#fde68a] transition-colors tracking-tight"
          >
            Launch App
          </a>
          <button
            className="md:hidden text-white/60"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/[0.04] overflow-hidden md:hidden"
          >
            <div className="p-5 flex flex-col gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  className="text-left text-base text-white/60 py-3 hover:text-white transition-colors tracking-tight"
                  onClick={() => scrollTo(item.id)}
                >
                  {item.name}
                </button>
              ))}
              <a
                href="/ambassador"
                className="text-left text-base text-white/60 py-3 hover:text-white transition-colors tracking-tight flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
                Ambassador
              </a>
              <a
                href="https://axs.pizza"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-[13px] font-semibold px-4 py-3 rounded-lg bg-[#FCD34D] text-black hover:bg-[#fde68a] transition-colors tracking-tight"
              >
                Launch App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
