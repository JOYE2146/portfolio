import portraitImg from "@/assets/yoseph-portrait.png";
import {
  createFadeUp,
  createHoverScale,
  createStaggerContainer,
  createStaggerInner,
  DURATION_SLOW,
} from "@/animations";
import { Container } from "@/components/layout/Container";
import { MotionAnchor } from "@/components/ui/MotionAnchor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const TECH_STACK = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Vite",
  "Firebase",
  "Networking",
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  const heroStagger = createStaggerContainer(reducedMotion, {
    stagger: 0.055,
    delayChildren: reducedMotion ? 0 : 0.08,
  });
  const badgeStagger = createStaggerInner(reducedMotion, { stagger: 0.045 });
  const fadeItem = createFadeUp(reducedMotion, { duration: DURATION_SLOW });
  const portraitVariants = createFadeUp(reducedMotion, {
    distance: 24,
    duration: DURATION_SLOW,
    delay: reducedMotion ? 0 : 0.12,
  });
  const badgeHover = createHoverScale(reducedMotion, { scale: 1.03, lift: -2 });

  return (
    <section
      id="about"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-border bg-background"
    >
      {/* Decorative ambient motion (loops) — separate from entrance variant system */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,color-mix(in_oklch,var(--token-accent)_18%,transparent),transparent_58%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,color-mix(in_oklch,var(--token-accent)_14%,transparent),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklch,oklch(0.55_0.2_290)_12%,transparent),transparent_45%)] opacity-90 dark:opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,color-mix(in_oklch,oklch(0.55_0.15_280)_10%,transparent),transparent_42%)]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
          style={{
            backgroundImage: `radial-gradient(color-mix(in oklch, var(--token-fg) 9%, transparent) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -left-1/4 top-[-10%] h-[min(520px,90vw)] w-[min(520px,90vw)] rounded-full bg-accent/12 blur-[100px] dark:bg-accent/8" />
        <div className="absolute -right-1/4 bottom-[-15%] h-[min(480px,85vw)] w-[min(480px,85vw)] rounded-full bg-violet-500/11 blur-[90px] dark:bg-violet-400/8" />
        <div className="absolute left-1/2 top-1/2 h-[min(600px,120%)] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-accent/[0.04] to-transparent blur-3xl dark:via-accent/[0.06]" />

        {!reducedMotion && (
          <>
            <motion.div
              className="absolute left-[8%] top-[14%] h-2 w-2 rounded-full bg-accent shadow-[0_0_20px_color-mix(in_oklch,var(--token-accent)_55%,transparent)]"
              animate={{ opacity: [0.35, 0.95, 0.35], scale: [1, 1.35, 1] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[14%] top-[22%] h-1.5 w-1.5 rounded-full bg-foreground/30"
              animate={{ opacity: [0.15, 0.65, 0.15], y: [0, -12, 0], x: [0, 4, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div
              className="absolute bottom-[26%] left-[22%] h-1 w-1 rounded-full bg-accent/70"
              animate={{ opacity: [0.25, 0.75, 0.25], x: [0, 10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            />
            <motion.div
              className="absolute right-[28%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-violet-400/50 dark:bg-violet-300/35"
              animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.4, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            />
            <motion.div
              className="absolute left-[40%] top-[8%] h-px w-12 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              animate={{ opacity: [0.2, 0.6, 0.2], scaleX: [0.85, 1.05, 0.85] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,21rem)] lg:gap-16 xl:grid-cols-[1fr_minmax(0,23rem)]">
          <motion.div
            className="order-2 text-center lg:order-1 lg:text-left"
            initial="hidden"
            animate="visible"
            variants={heroStagger}
          >
            <motion.div
              variants={fadeItem}
              className="flex items-center justify-center gap-3 lg:justify-start"
            >
              <span
                className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_14px_color-mix(in_oklch,var(--token-accent)_45%,transparent)]"
                aria-hidden
              />
              <p className="text-sm font-semibold tracking-wide text-accent">
                Hi, I&apos;m Yoseph Bedasa
              </p>
            </motion.div>

            <motion.div
              variants={fadeItem}
              className="mx-auto mt-5 h-px max-w-xs bg-gradient-to-r from-transparent via-border to-transparent lg:mx-0 lg:max-w-[11rem]"
            />

            <motion.h1
              id="hero-heading"
              variants={fadeItem}
              className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
            >
              <span className="bg-gradient-to-br from-foreground via-foreground to-accent bg-clip-text text-transparent dark:from-zinc-50 dark:via-zinc-100 dark:to-accent">
                Yoseph Bedasa
              </span>
            </motion.h1>

            <motion.p
              variants={fadeItem}
              className="mt-3 text-lg font-medium text-muted sm:text-xl"
            >
              Web developer <span className="text-accent">&amp;</span> network engineer
            </motion.p>

            <motion.p
              variants={fadeItem}
              className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-muted lg:mx-0 lg:max-w-[52ch]"
            >
              I specialize in building modern, scalable web applications using tools like React
              and Tailwind CSS, and I have a strong foundation in networking. I&apos;m passionate
              about solving real-world problems and continuously learning new technologies.
            </motion.p>

            <motion.ul
              variants={badgeStagger}
              className="mt-8 flex list-none flex-wrap justify-center gap-2.5 p-0 lg:justify-start"
              aria-label="Tech stack"
            >
              {TECH_STACK.map((label) => (
                <motion.li
                  key={label}
                  variants={fadeItem}
                  {...badgeHover}
                  className={cn(
                    "inline-flex cursor-default items-center gap-1.5 rounded-full border border-border/90 bg-elevated/75 px-3.5 py-1.5",
                    "text-xs font-semibold tracking-wide text-foreground shadow-sm backdrop-blur-md",
                    "ring-1 ring-black/[0.03] transition-[border-color,box-shadow] duration-300 dark:ring-white/[0.06]",
                    "hover:border-accent/35 hover:shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--token-accent)_35%,transparent)]"
                  )}
                >
                  <span
                    className="h-1 w-1 shrink-0 rounded-full bg-accent/80 shadow-[0_0_8px_color-mix(in_oklch,var(--token-accent)_50%,transparent)]"
                    aria-hidden
                  />
                  {label}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeItem}
              className="mt-10 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start"
            >
              <MotionAnchor
                href="#projects"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
              >
                {!reducedMotion && (
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    aria-hidden
                  />
                )}
                View projects
              </MotionAnchor>
              <MotionAnchor
                href="#contact"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
              >
                Get in touch
              </MotionAnchor>
            </motion.div>
          </motion.div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={portraitVariants}
            >
              {!reducedMotion && (
                <motion.div
                  className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/20 via-transparent to-violet-500/15 opacity-80 blur-2xl dark:from-accent/15"
                  animate={{ opacity: [0.65, 0.95, 0.65], scale: [1, 1.03, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
              )}
              <motion.div
                className="relative"
                animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className={cn(
                    "relative rounded-[1.35rem] p-[1.5px]",
                    "bg-gradient-to-br from-accent/70 via-violet-500/35 to-fuchsia-500/25 dark:from-accent/50 dark:via-violet-400/30 dark:to-fuchsia-400/20"
                  )}
                  style={{
                    boxShadow:
                      "0 25px 50px -12px color-mix(in oklch, var(--token-fg) 12%, transparent), 0 0 0 1px color-mix(in oklch, var(--token-border) 80%, transparent)",
                  }}
                >
                  <div className="overflow-hidden rounded-[1.28rem] bg-elevated ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
                    <img
                      src={portraitImg}
                      width={440}
                      height={550}
                      alt="Portrait of Yoseph Bedasa, Web Developer and Network Engineer."
                      className="aspect-[4/5] h-auto w-[min(100%,300px)] object-cover sm:w-[min(100%,340px)] lg:w-full lg:max-w-none"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute -bottom-3 left-1/2 h-8 w-[55%] -translate-x-1/2 rounded-[100%] bg-foreground/[0.08] blur-xl dark:bg-black/40"
                  aria-hidden
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
