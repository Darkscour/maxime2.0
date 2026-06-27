"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="cta" className="py-10 sm:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="gradient-border relative overflow-hidden rounded-3xl bg-[var(--surface)] p-1"
        >
          <div className="relative overflow-hidden rounded-[calc(theme(borderRadius.3xl)-4px)] bg-[var(--background)] px-8 py-12 sm:px-14 sm:py-14">
            <div className="bg-grid bg-grid-fade absolute inset-0 opacity-50" aria-hidden />
            <div
              className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl text-center">
              <Sparkles className="mx-auto h-8 w-8 text-cyan-400" />
              <h2 className="font-heading mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to level up your org?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Whether you run a campus club or a grassroots stack — managers
                scout players and land sponsors while players get discovered and
                join teams, all from one workspace.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button href="/sign-up" size="lg">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/#solutions" variant="outline" size="lg">
                  Compare solutions
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
