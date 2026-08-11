/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Liveline } from "liveline";
import type { LivelinePoint } from "liveline";
import { TargetCalculator } from "./components/TargetCalculator";
import {
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Terminal,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Lock,
  X
} from "lucide-react";

/* ── Live Bitcoin Chart using Liveline ─────────────────────────── */
const BitcoinChart = () => {
  const [data, setData] = useState<LivelinePoint[]>([]);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const priceRef = useRef(0);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const json = await res.json();
      const price = json.bitcoin.usd as number;
      const now = Math.floor(Date.now() / 1000);
      priceRef.current = price;
      setValue(price);
      setData((prev) => [...prev, { time: now, value: price }]);
      setLoading(false);
    } catch {
      // On rate-limit / error, synthesise a slight random walk from last known price
      if (priceRef.current > 0) {
        const jitter = (Math.random() - 0.48) * 40;
        const synth = priceRef.current + jitter;
        priceRef.current = synth;
        setValue(synth);
        setData((prev) => [
          ...prev,
          { time: Math.floor(Date.now() / 1000), value: synth },
        ]);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, 3000);
    return () => clearInterval(id);
  }, [fetchPrice]);

  return (
    <Liveline
      data={data}
      value={value}
      loading={loading}
      color="#34fea0"
      theme="dark"
      grid
      badge
      pulse
      momentum
      scrub
      showValue
      valueMomentumColor
      degen={true}
      exaggerate={true}
      window={120}
      lineWidth={2}
      formatValue={(v: number) =>
        `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      }
    />
  );
};

const Navbar = ({ onApply, onNavigate, onShowCalc }: { onApply: () => void, onNavigate: () => void, onShowCalc: () => void }) => (
  <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#484847]/15">
    <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
      <div
        className="text-xl font-bold tracking-tighter text-primary uppercase font-headline cursor-pointer"
        onClick={() => {
          onNavigate();
          window.location.hash = "";
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        KINETIC_ROOM
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a className="text-on-surface-variant hover:text-white transition-colors font-headline tracking-tight font-medium text-xs" href="#expertise" onClick={onNavigate}>ARCHITECTURE</a>
        <a className="text-on-surface-variant hover:text-white transition-colors font-headline tracking-tight font-medium text-xs" href="#technology" onClick={onNavigate}>THE COUNCIL</a>
        <a className="text-on-surface-variant hover:text-white transition-colors font-headline tracking-tight font-medium text-xs" href="#openFloor" onClick={onNavigate}>THE NETWORK</a>
        <button className="text-primary hover:text-white transition-colors font-headline tracking-tight font-bold text-xs uppercase" onClick={onShowCalc}>CALCULATOR</button>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onApply}
          className="bg-gradient-to-br from-primary to-primary-container text-background font-headline font-bold text-xs px-5 py-2.5 rounded hover:scale-95 active:scale-90 transition-transform tracking-tight uppercase"
        >
          Apply to Join
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-20 kinetic-grid">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-label font-bold text-on-surface-variant">Live Market Nexus Active</span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
            NAVIGATE <span className="text-primary italic">MOMENTUM</span> <br />WITH PRECISION.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
            Collaborative futures trading engineered for maximum speed. Join an elite collective of veteran traders leveraging proprietary momentum data.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => (window as any).toggleApplication?.()}
              className="bg-primary text-background font-headline font-bold px-8 py-4 flex items-center gap-3 rounded-sm hover:opacity-90 transition-all shadow-[0_4px_14px_0_rgba(52,254,160,0.39)]"
            >
              APPLY FOR ACCESS
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:block"
        >
          <div className="relative bg-surface-container-low p-1 rounded-xl border border-outline-variant/10 overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 blur-2xl group-hover:opacity-100 transition duration-1000 opacity-50"></div>
            <div className="relative bg-[#0d0d0d] rounded-lg overflow-hidden">
              {/* Chart Header Overlay (Floating) */}
              <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary font-black uppercase tracking-widest">BTC/USD</span>
                    <span className="text-[10px] font-mono text-white/50 font-medium">BITCOIN</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-[10px] font-mono text-primary animate-pulse">● LIVE_FEED</span>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">MOMENTUM_ENGINE v4.2</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">REAL_TIME</span>
                </div>
              </div>

              {/* Liveline Chart */}
              <div className="relative w-full h-64">
                <BitcoinChart />

                {/* Visual Polish Overlays */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none"></div>
              </div>

              {/* Data HUD (Below chart) */}
              <div className="relative z-10 flex items-center gap-6 px-4 py-2.5 bg-black/60 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Sentiment</span>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase">Strong_Long</span>
                </div>
                <div className="h-6 w-[1px] bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Alpha_Prob</span>
                  <span className="text-[10px] font-mono text-secondary font-bold uppercase">84.2%</span>
                </div>
                <div className="h-6 w-[1px] bg-white/10"></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Liquidity_Void</span>
                  <div className="h-1.5 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-primary to-primary-container"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Pillars = () => (
  <section id="expertise" className="py-32 bg-background relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-20">
        <h2 className="font-headline text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">The Monolith Architecture</h2>
        <p className="font-headline text-4xl font-bold tracking-tighter">ENGINEERED FOR ALPHA.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
        {/* Pillar: Experience */}
        <motion.div
          whileHover={{ borderColor: "rgba(52, 254, 160, 0.2)" }}
          className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-outline-variant/5 transition-all group overflow-hidden relative"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
          <div>
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-3xl font-bold mb-4">Deep Experience</h3>
            <p className="text-on-surface-variant max-w-md leading-relaxed">Our seasoned team brings decades of combined volatility trading experience from top-tier professional desks to the global frontier.</p>
          </div>
          <div className="mt-8 flex gap-12 border-t border-outline-variant/10 pt-8">
            <div>
              <p className="text-2xl font-headline font-bold text-on-surface">15yr+</p>
              <p className="text-[10px] uppercase font-label tracking-widest text-on-surface-variant">Combined Insight</p>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold text-on-surface">$2.4B</p>
              <p className="text-[10px] uppercase font-label tracking-widest text-on-surface-variant">Cumulative Volume</p>
            </div>
          </div>
        </motion.div>

        {/* Pillar: Real-Time News */}
        <motion.div
          id="newsFeed"
          whileHover={{ borderColor: "rgba(143, 245, 255, 0.2)" }}
          className="md:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col justify-between border border-outline-variant/5 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-20"></div>
          <div>
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-6 text-tertiary group-hover:rotate-12 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Pulse News</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Sub-second event latency. We filter the noise to provide actionable intelligence before it hits the retail terminals.</p>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 p-2 bg-background/50 rounded-sm">
              <div className="w-1 h-4 bg-tertiary"></div>
              <span className="text-[10px] font-mono text-on-surface-variant">USD_STRENGTH: VOL_LATENCY_ALERT</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-background/50 rounded-sm">
              <div className="w-1 h-4 bg-primary"></div>
              <span className="text-[10px] font-mono text-on-surface-variant">EUR_USD: LIQUIDITY_GAP_DETECTED</span>
            </div>
          </div>
        </motion.div>

        {/* Pillar: Technology */}
        <motion.div
          whileHover={{ borderColor: "rgba(185, 132, 255, 0.2)" }}
          className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-outline-variant/5 transition-all group"
        >
          <div>
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-6 text-secondary">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Low Latency Execution</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Direct market access via colocation and custom connectivity for sub-millisecond execution across global liquidity pools.</p>
          </div>
          <div className="mt-8 relative h-32 w-full overflow-hidden rounded bg-black/40 border border-outline-variant/5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-[1px] bg-primary/20 blur-[1px]"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
            </div>
            <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">Core Engine Active</span>
          </div>
        </motion.div>

        {/* Pillar: Market Momentum */}
        <motion.div
          whileHover={{ borderColor: "rgba(52, 254, 160, 0.2)" }}
          className="md:col-span-8 bg-surface-container-highest rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/5 transition-all group relative overflow-hidden"
        >
          <div className="flex-1 relative z-10">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-6 text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-3xl font-bold mb-4">Market Momentum</h3>
            <p className="text-on-surface-variant leading-relaxed">Identify structural shifts before the trend matures. Our 'Momentum Engine' tracks order flow across 14 global exchanges simultaneously.</p>
          </div>
          <div className="flex-1 w-full relative z-10 bg-background/40 p-6 rounded-lg backdrop-blur-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase font-label text-on-surface-variant">Momentum Index</span>
              <span className="text-[10px] text-primary font-bold">ACCELERATING</span>
            </div>
            <div className="h-32 flex items-end gap-1">
              <div className="flex-1 bg-outline-variant/20 h-1/4"></div>
              <div className="flex-1 bg-outline-variant/20 h-1/2"></div>
              <div className="flex-1 bg-primary/40 h-3/4"></div>
              <div className="flex-1 bg-primary h-full"></div>
              <div className="flex-1 bg-primary h-[85%]"></div>
              <div className="flex-1 bg-primary-container h-[95%]"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Council = () => (
  <section id="technology" className="py-32 bg-surface-container-low/50 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-headline text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">The Strategic Council</h2>
          <h3 className="font-headline text-4xl font-bold tracking-tighter mb-8 leading-none">VETERAN INSIGHT.<br />TECHNICAL MASTERY.</h3>
          <p className="text-on-surface-variant mb-10 text-lg font-light leading-relaxed">
            The KINETIC_ROOM is steered by a cohort of technical masters who have redefined market engagement—from the Forex volatility peaks of 2020 to today's AI-driven systemic liquidity environments. We don't just trade; we build the systems that extract value from global flow.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-outline-variant/5 group hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-headline font-bold shrink-0">01</div>
              <div>
                <h4 className="font-headline font-bold text-lg">Architectural Trading</h4>
                <p className="text-sm text-on-surface-variant">Focusing on liquidity pockets and professional stop-runs rather than retail patterns.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-outline-variant/5 group hover:bg-surface-container-high transition-all">
              <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center text-secondary font-headline font-bold shrink-0">02</div>
              <div>
                <h4 className="font-headline font-bold text-lg">Risk-First Framework</h4>
                <p className="text-sm text-on-surface-variant">Preservation of capital through rigorous delta-neutral strategies and hedge-ratio optimization.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative group">
            <img
              className="w-full h-full object-cover"
              src="/marcus_v_white.png"
              referrerPolicy="no-referrer"
              alt="Marcus V."
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
              <p className="font-headline font-bold text-sm">MARCUS V.</p>
              <p className="text-[10px] uppercase text-primary font-bold">Head of Macro</p>
            </div>
          </div>
          <div className="aspect-[3/4] rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative group lg:mt-12">
            <img
              className="w-full h-full object-cover"
              src="/jaxson_r_white.png"
              referrerPolicy="no-referrer"
              alt="Jaxson R."
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
              <p className="font-headline font-bold text-sm">JAXSON R.</p>
              <p className="text-[10px] uppercase text-secondary font-bold">Quant Architect</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section id="openFloor" className="py-24 bg-background relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-150 -translate-y-1/2"></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">THE FLOOR IS <span className="text-primary italic">OPEN</span>.</h2>
        <p className="text-on-surface-variant text-lg mb-12 font-light">Applications for the KINETIC_ROOM are currently being processed. Enter your details to be considered for our elite trading collective.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button
            onClick={() => (window as any).toggleApplication?.()}
            className="w-full md:w-auto bg-gradient-to-br from-primary to-primary-container text-background font-headline font-extrabold px-12 py-5 rounded-sm text-lg hover:shadow-[0_0_30px_rgba(52,254,160,0.39)] transition-all flex items-center justify-center gap-3 group"
          >
            SUBMIT APPLICATION
            <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
          </button>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant">Membership is strictly limited and vetted.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ onOpenLegal }: { onOpenLegal: (type: string) => void }) => (
  <footer className="w-full py-12 border-t border-[#484847]/15 bg-[#000000]">
    <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
      <div className="flex items-center gap-8">
        <span className="text-primary font-bold font-headline tracking-tighter uppercase">KINETIC_ROOM</span>
        <p className="text-on-surface-variant font-body text-[0.6875rem] tracking-[0.05em] uppercase">© 2026 KINETIC MONOLITH TRADING. ALL RIGHTS RESERVED.</p>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => onOpenLegal('Terms of Service')} className="text-on-surface-variant hover:text-primary transition-colors font-body text-[0.6875rem] tracking-[0.05em] uppercase">Terms of Service</button>
        <button onClick={() => onOpenLegal('Privacy Policy')} className="text-on-surface-variant hover:text-primary transition-colors font-body text-[0.6875rem] tracking-[0.05em] uppercase">Privacy Policy</button>
        <button onClick={() => onOpenLegal('Risk Disclosure')} className="text-on-surface-variant hover:text-primary transition-colors font-body text-[0.6875rem] tracking-[0.05em] uppercase">Risk Disclosure</button>
        <a className="text-on-surface-variant hover:text-primary transition-colors font-body text-[0.6875rem] tracking-[0.05em] uppercase" href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
      </div>
    </div>
  </footer>
);

const LegalModal = ({ title, onClose }: { title: string, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-6"
  >
    <div className="max-w-2xl w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-8 relative">
      <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      <h2 className="font-headline text-2xl font-bold mb-6 tracking-tighter uppercase text-primary">{title}</h2>
      <div className="prose prose-invert text-on-surface-variant text-sm font-light leading-relaxed max-h-[60vh] overflow-y-auto pr-4 scroll-thin">
        <p className="mb-4">Standard {title} information for KINETIC_ROOM group trading services.</p>
        <p className="mb-4">This document outlines the standard participation rules and professional conduct expected within the KINETIC_ROOM collective.</p>
        <p className="mb-4">1. ELIGIBILITY: Membership is restricted to professional traders with proven experience in futures and volatility products.</p>
        <p className="mb-4">2. RISK: All financial decisions remain the sole responsibility of individual members. KINETIC_ROOM is a collaborative research collective, not a financial advisor.</p>
        <p className="mb-4">3. CONFIDENTIALITY: Proprietary strategies and newsflow shared within the Network must remain internal to the collective.</p>
        <p>Detailed documentation for {title} will be provided upon successful vetting and admission to the Monolith.</p>
      </div>
    </div>
  </motion.div>
);

const ApplicationPage = ({ onClose }: { onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-headline text-3xl font-bold mb-4 tracking-tighter">APPLICATION RECEIVED.</h2>
          <p className="text-on-surface-variant mb-12">Our council will review your profile. If you meet the criteria, an encrypted channel will be opened.</p>
          <button
            onClick={onClose}
            className="text-primary font-headline font-bold text-sm tracking-widest uppercase hover:underline"
          >
            Return to Monolith
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-headline text-xs font-bold tracking-widest uppercase">Go Back</span>
        </button>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/20 mb-6 font-mono text-[10px] text-tertiary">
            <Lock className="w-3 h-3" />
            SECURE_SESSION: ACTIVE
          </div>
          <h2 className="font-headline text-5xl font-bold tracking-tighter mb-4">MEMBERSHIP<br /><span className="text-primary italic">APPLICATION.</span></h2>
          <p className="text-on-surface-variant font-light text-lg">Provide your professional background for vetting.</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant px-1">Pseudonym / Alias</label>
              <input required className="w-full bg-surface-container-low border border-outline-variant/10 rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none transition-all font-mono text-sm" placeholder="e.g., ARCHITECT_01" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant px-1">Security Contact (Email)</label>
              <input type="email" required className="w-full bg-surface-container-low border border-outline-variant/10 rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none transition-all font-mono text-sm" placeholder="contact@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant px-1">Primary Asset Class</label>
              <select className="w-full bg-surface-container-low border border-outline-variant/10 rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none transition-all font-mono text-sm appearance-none">
                <option>Futures</option>
                <option>Options</option>
                <option>Equities</option>
                <option>Forex</option>
                <option>Bonds</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant px-1">Trading Experience / Background</label>
            <textarea required rows={4} className="w-full bg-surface-container-low border border-outline-variant/10 rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none transition-all font-mono text-sm resize-none" placeholder="Describe your experience with volatility-based systems and order flow..." />
          </div>

          <div className="p-6 bg-surface-container-high rounded border border-outline-variant/5">
            <p className="text-xs text-on-surface-variant font-light leading-relaxed italic border-l-2 border-primary/20 pl-4">
              "Membership in KINETIC_ROOM is a privilege reserved for those who prioritize risk management and structural analysis. Our collective success depends on the integrity and skill of every node in the network."
            </p>
          </div>

          <button type="submit" className="w-full bg-primary text-background font-headline font-extrabold text-lg py-5 rounded-sm hover:shadow-[0_0_40px_rgba(52,254,160,0.4)] transition-all">
            SUBMIT FOR VETTING
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'calc' | 'application'>(() => {
    if (window.location.pathname.startsWith('/calc') || window.location.hash === '#calc') {
      return 'calc';
    }
    return 'home';
  });
  const [legalModal, setLegalModal] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#calc' || window.location.pathname.startsWith('/calc')) {
        setView('calc');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Expose toggle to hero/CTA buttons
  (window as any).toggleApplication = () => {
    setView('application');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = () => {
    setView('home');
  };

  const handleShowCalc = () => {
    setView('calc');
    window.location.hash = '#calc';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30 selection:text-primary scroll-smooth">
      {view !== 'calc' && (
        <Navbar
          onApply={() => {
            setView('application');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={handleNavigate}
          onShowCalc={handleShowCalc}
        />
      )}
      <main className={view === 'calc' ? 'py-8' : 'pt-16'}>
        {view === 'application' ? (
          <ApplicationPage onClose={() => setView('home')} />
        ) : view === 'calc' ? (
          <TargetCalculator />
        ) : (
          <>
            <Hero />
            <Pillars />
            <Council />
            <CTA />
          </>
        )}
      </main>
      {view !== 'calc' && <Footer onOpenLegal={setLegalModal} />}

      <AnimatePresence>
        {legalModal && (
          <LegalModal title={legalModal} onClose={() => setLegalModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
