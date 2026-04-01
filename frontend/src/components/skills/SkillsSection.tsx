import {
  createFadeUp,
  createHoverScale,
  createStaggerContainer,
  defaultViewport,
} from "@/animations";
import { Container } from "@/components/layout/Container";
import {
  SKILL_CATEGORIES,
  SKILLS,
  averagePercentForCategory,
  skillsByCategory,
  type Skill,
  type SkillCategory,
} from "@/data/skills-expertise";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

function levelBadgeClass(label: Skill["levelLabel"]) {
  switch (label) {
    case "Advanced":
      return "border-accent/35 bg-accent/[0.12] text-accent";
    case "Intermediate":
      return "border-border bg-elevated text-foreground";
    default:
      return "border-border/70 bg-muted/15 text-muted";
  }
}

function SkillIcon({ skill }: { skill: Skill }) {
  const [broken, setBroken] = useState(false);
  if (!skill.iconSlug || broken) {
    const initials = skill.name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-[0.65rem] font-bold leading-none text-accent"
        aria-hidden
      >
        {initials || "—"}
      </div>
    );
  }
  const src = `https://cdn.simpleicons.org/${skill.iconSlug}/${skill.iconColor ?? "6366f1"}`;
  return (
    <img
      src={src}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 rounded-xl border border-border/60 bg-background object-contain p-1.5"
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

function SkillProgress({
  percent,
  reducedMotion,
}: {
  percent: number;
  reducedMotion: boolean;
}) {
  const target = Math.min(100, Math.max(0, percent)) / 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border/90">
      <motion.div
        className="h-full w-full origin-left rounded-full bg-gradient-to-r from-accent to-accent/65"
        initial={reducedMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: target }}
        viewport={defaultViewport}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function CategoryAvgBar({
  avg,
  reducedMotion,
}: {
  avg: number;
  reducedMotion: boolean;
}) {
  const target = Math.min(100, Math.max(0, avg)) / 100;
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/80">
      <motion.div
        className="h-full w-full origin-left rounded-full bg-accent/75"
        initial={reducedMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: target }}
        viewport={defaultViewport}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function SkillCard({
  skill,
  reducedMotion,
  variants,
}: {
  skill: Skill;
  reducedMotion: boolean;
  variants: ReturnType<typeof createFadeUp>;
}) {
  const tipId = `skill-depth-${skill.id}`;
  const hover = createHoverScale(reducedMotion, { scale: 1.015, lift: -1 });

  return (
    <motion.article
      variants={variants}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-elevated/35 p-4 shadow-sm",
        "transition-colors hover:border-accent/30 hover:bg-elevated/55"
      )}
      {...hover}
    >
      <div className="flex gap-3">
        <SkillIcon skill={skill} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {skill.name}
            </h3>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                levelBadgeClass(skill.levelLabel)
              )}
            >
              {skill.levelLabel}
            </span>
            {skill.years != null ? (
              <span className="rounded-md bg-background/60 px-1.5 py-0.5 text-[0.7rem] font-medium text-muted">
                {skill.years}+ yrs
              </span>
            ) : null}
          </div>
          <div className="mt-3 space-y-1">
            <SkillProgress percent={skill.levelPercent} reducedMotion={reducedMotion} />
            <div className="flex items-center justify-between text-[0.7rem] text-muted">
              <span>Proficiency</span>
              <span className="tabular-nums font-medium text-foreground/90">
                {skill.levelPercent}%
              </span>
            </div>
          </div>
        </div>
        <div className="relative shrink-0 self-start">
          <button
            type="button"
            className={cn(
              "rounded-full border border-transparent p-1.5 text-muted transition-colors",
              "hover:border-border hover:bg-background hover:text-foreground",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            )}
            aria-describedby={tipId}
          >
            <span className="sr-only">Depth of knowledge for {skill.name}</span>
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              aria-hidden
              className="fill-current"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>
          <div
            id={tipId}
            role="tooltip"
            className={cn(
              "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2",
              "rounded-xl border border-border bg-background/95 p-3 text-left text-xs leading-relaxed text-muted shadow-lg backdrop-blur-sm",
              "invisible opacity-0 transition-[opacity,visibility] duration-200",
              "group-hover:visible group-hover:opacity-100",
              "group-focus-within:visible group-focus-within:opacity-100"
            )}
          >
            {skill.tooltip}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const FILTER_ALL = "all" as const;

export function SkillsSection() {
  const reducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<SkillCategory | typeof FILTER_ALL>(FILTER_ALL);

  const filtered = useMemo(() => skillsByCategory(filter), [filter]);

  const sectionStagger = useMemo(
    () =>
      createStaggerContainer(reducedMotion, {
        stagger: 0.06,
        delayChildren: reducedMotion ? 0 : 0.05,
      }),
    [reducedMotion]
  );
  const cardFade = useMemo(
    () => createFadeUp(reducedMotion, { distance: 12 }),
    [reducedMotion]
  );
  const headerFade = useMemo(
    () => createFadeUp(reducedMotion, { distance: 16 }),
    [reducedMotion]
  );

  const activeCategoryMeta =
    filter === FILTER_ALL
      ? null
      : SKILL_CATEGORIES.find((c) => c.id === filter) ?? null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border bg-gradient-to-b from-background via-elevated/[0.08] to-background py-14 sm:py-20"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Stack &amp; craft
          </p>
          <h2
            id="skills-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Skills &amp; expertise
          </h2>
          <p className="mt-3 text-muted sm:text-lg">
            Practical shipping experience across the stack, plus testing discipline and system
            design—drawn from real projects using the tools in your reference boards (React, Next,
            Node, data stores, Shopify/WordPress, Flutter, Angular, and more).
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-5xl"
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
            Category strength (avg. proficiency)
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SKILL_CATEGORIES.map((cat) => {
              const avg = averagePercentForCategory(cat.id);
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-border/70 bg-elevated/25 px-3 py-3 text-left"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                    {cat.label}
                  </p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{avg}%</p>
                  <CategoryAvgBar avg={avg} reducedMotion={reducedMotion} />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3"
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <p className="text-sm font-medium text-muted">Filter by area</p>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Skill categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === FILTER_ALL}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                filter === FILTER_ALL
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-elevated/40 text-muted hover:border-accent/25 hover:text-foreground"
              )}
              onClick={() => setFilter(FILTER_ALL)}
            >
              All ({SKILLS.length})
            </button>
            {SKILL_CATEGORIES.map((cat) => {
              const count = SKILLS.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === cat.id}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    filter === cat.id
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-elevated/40 text-muted hover:border-accent/25 hover:text-foreground"
                  )}
                  onClick={() => setFilter(cat.id)}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
          {activeCategoryMeta ? (
            <p className="max-w-xl text-center text-sm text-muted">{activeCategoryMeta.description}</p>
          ) : (
            <p className="max-w-xl text-center text-sm text-muted">
              Hover a card (or focus the info control) to read depth: frameworks, production usage,
              and concepts mastered.
            </p>
          )}
        </motion.div>

        <motion.div
          className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              reducedMotion={reducedMotion}
              variants={cardFade}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
