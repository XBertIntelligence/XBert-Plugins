import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export interface ConnectButtonProps {
  /** External URL the button opens (always a new tab). */
  href: string;
  children: ReactNode;
  /**
   * "primary"   — solid, one per panel: the button that does the work.
   * "secondary" — bordered, for the fallback / documentation links beside it.
   */
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Outbound deep-link button for the Get started connect panels — "Add XBert to
 * Claude", "Open ChatGPT plugins" and the vendor-documentation links beside
 * them. Same two treatments as CtaBand so the page reads as one system.
 *
 * Every one of these points at a vendor URL taken from that vendor's own
 * documentation. Custom URL schemes (claude://, cursor://, vscode:) are
 * deliberately absent: no vendor documents an MCP install scheme we could use,
 * and a locally-run client cannot finish sign-in against the gateway anyway —
 * see the note in the "Other assistants" panel.
 *
 *   <ConnectButton href={CLAUDE_ADD_CONNECTOR_URL}>Add XBert to Claude</ConnectButton>
 */
export function ConnectButton({
  href,
  children,
  variant = "primary",
  className = "",
}: ConnectButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-lg shadow-xbert-indigo/20 ring-1 ring-black/10 dark:ring-white/40 hover:bg-neutral-800 dark:hover:bg-neutral-100"
      : "border border-black/15 bg-black/[0.03] text-neutral-900 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:border-white/25 font-medium";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm transition ${styles} ${className}`}
    >
      {children}
      <ArrowUpRight
        size={16}
        strokeWidth={2.5}
        aria-hidden
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
