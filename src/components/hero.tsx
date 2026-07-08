"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-glow rounded-full bg-gradient-to-br from-primary/40 to-accent/30 blur-2xl" />
  ),
});

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-float rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 animate-float-slow rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            The modern way to shop
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl"
          >
            Discover more at{" "}
            <span className="gradient-text">{STORE_NAME}</span>
            <br />
            shop it in seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            Curated products across electronics, fashion, home and more. Add to
            cart, tap buy, and your order zips straight to us on WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105"
            >
              Start shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/policy"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-semibold transition-colors hover:border-primary/50"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              Our policy
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-success" /> WhatsApp checkout
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" /> Fresh arrivals weekly
            </span>
          </motion.div>
        </div>

        {/* 3D visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 animate-glow rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl" />
          <div className="relative h-full w-full">
            <HeroScene />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
