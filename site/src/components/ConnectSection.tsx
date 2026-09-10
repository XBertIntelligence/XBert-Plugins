import { motion } from "motion/react";
import { Link2 } from "lucide-react";
import type { ReactNode } from "react";

export interface ConnectSectionProps {
  /** Stable anchor id, e.g. "claude-code". Support links straight to it. */
  id: string;
  /** Heading, verbatim, e.g. "Claude — web, Desktop and mobile". */
  title: string;
  /** Short status chip shown beside the heading, e.g. "One-click". */
  badge?: string;
  /** One-line orientation under the heading. */
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * One assistant's connect instructions, as a STACKED, always-rendered section.
 *
 * This deliberately replaced a TabGroup. The page prerenders to static HTML at
 * build time, and a tab group only ever prerendered the SELECTED panel — so
 * every other assistant's instructions were absent from the delivered markup.
 * That cost us four things at once: crawlers and LLM readers never saw them,
 * browser find-in-page could not find them, they did not print, and support had
 * no URL to send a firm straight to. Stacked sections put every assistant in the
 * HTML and give each one a stable #anchor.
 *
 *   <ConnectSection id="claude" title="Claude — web, Desktop and mobile" badge="One-click">
 *     …
 *   </ConnectSection>
 */
export function ConnectSection({
  id,
  title,
  badge,
  lead,
  children,
  className = "",
}: ConnectSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      // scroll-mt clears the sticky header when an #anchor is followed.
      className={`scroll-mt-24 rounded-2xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-black/40 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-sm p-6 md:p-8 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="group text-xl md:text-2xl font-semibold tracking-tight">
          <a
            href={`#${id}`}
            className="inline-flex items-center gap-2 hover:underline focus-visible:underline"
          >
            {title}
            <Link2
              size={15}
              aria-hidden
              className="opacity-0 group-hover:opacity-60 group-focus-within:opacity-60 transition-opacity flex-shrink-0"
            />
            <span className="sr-only"> — direct link to this section</span>
          </a>
        </h3>
        {badge && (
          <span className="inline-flex items-center rounded-full border border-xbert-indigo/30 bg-xbert-indigo/[0.08] dark:border-xbert-cyan/25 dark:bg-xbert-cyan/[0.08] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-xbert-indigo dark:text-xbert-cyan">
            {badge}
          </span>
        )}
      </div>
      {lead && (
        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed max-w-2xl">
          {lead}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}
