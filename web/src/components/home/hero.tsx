"use client";

import { motion } from "framer-motion";
import { HeroDashboardMockup } from "@/components/home/hero-dashboard-mockup";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  marketingHashHref,
  useMarketingHashRoot,
} from "@/hooks/use-marketing-hash-root";

export function Hero() {
  const hashRoot = useMarketingHashRoot();

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative pt-20 pb-14 lg:pt-28 lg:pb-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="mx-auto max-w-3xl text-center md:mx-0 md:max-w-none md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            Built for collegiate & grassroots programs
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.04 }}
            className="font-heading mt-4 text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-6xl xl:text-7xl"
          >
            The all‑in‑one OS for{" "}
            <span className="text-gradient">collegiate & grassroots esports</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-7 text-[var(--foreground-muted)] md:mx-0"
          >
            Scout players, land sponsors, and run rosters — one workspace for
            amateur orgs, without spreadsheets or Discord chaos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <Button href="/sign-up" size="lg">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={marketingHashHref(hashRoot, "#solutions")}
              variant="outline"
              size="lg"
            >
              Explore solutions
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto w-full max-w-md md:max-w-none"
        >
          <HeroDashboardMockup />
        </motion.div>
        </div>
      </Container>
    </section>
  );
}
