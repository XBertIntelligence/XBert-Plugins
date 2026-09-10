import { motion } from "motion/react";
import { Check, Info, TriangleAlert } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";
import { Chip } from "../components/Chip";
import { SectionHeading } from "../components/SectionHeading";
import { AddressChip } from "../components/AddressChip";
import { MCP_ADDRESS } from "../components/AddressChip";
import { ConnectSection } from "../components/ConnectSection";
import { StepFlow } from "../components/StepFlow";
import { CopyButton } from "../components/CopyButton";
import { AskPrompt } from "../components/AskPrompt";
import { CtaBand } from "../components/CtaBand";
import { ConnectButton } from "../components/ConnectButton";
import { ThemeImage } from "../components/ThemeImage";

const SETUP_GUIDE_URL =
  "https://support.xbert.io/en/articles/14492922-how-to-set-up-the-xbert-mcp";

/**
 * Deep links, every one taken from the vendor's own documentation.
 *
 * Claude's two "?modal=add-custom-connector" links follow Anthropic's published
 * install-link template (claude.com/docs/connectors/building/directory-vs-custom)
 * and pre-fill the name and address. They degrade safely: drop the parameters and
 * the visitor still lands on the connectors screen they were going to.
 *
 * There is deliberately no one-click button for assistants that run on the user's
 * own machine (Cursor, VS Code, Zed and friends). Their sign-in comes back on a
 * loopback port the gateway rejects in production — the button would install the
 * server and then fail at sign-in, which is worse than no button at all.
 */
const SUPPORT_URL = "https://support.xbert.io";
const CLAUDE_CONNECTORS_URL = "https://claude.ai/customize/connectors";
const CLAUDE_ADD_CONNECTOR_URL = `${CLAUDE_CONNECTORS_URL}?modal=add-custom-connector&connectorName=XBert&connectorUrl=${encodeURIComponent(
  MCP_ADDRESS,
)}`;
const CLAUDE_ADMIN_ADD_CONNECTOR_URL = `https://claude.ai/admin-settings/connectors?modal=add-custom-connector&connectorName=XBert&connectorUrl=${encodeURIComponent(
  MCP_ADDRESS,
)}`;
const ANTHROPIC_CONNECTOR_GUIDE =
  "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp";
const CLAUDE_CODE_DOCS = "https://code.claude.com/docs/en/mcp";
const CHATGPT_PLUGINS_URL = "https://chatgpt.com/plugins";
const OPENAI_DEVELOPER_MODE_GUIDE =
  "https://developers.openai.com/api/docs/guides/developer-mode";
const OPENAI_HELP_MCP =
  "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt";

/**
 * Microsoft. Copilot Studio is the ONE mainstream client where our fixed
 * loopback port is a non-issue: Power Platform signs in through a Microsoft
 * hosted redirect, never a callback on the user's own machine.
 *
 * Microsoft documents NO install link for adding a tool or an MCP server —
 * no equivalent of Anthropic's ?modal=add-custom-connector. That is a checked
 * negative, not an oversight, so this vendor gets click steps and plain
 * navigation links rather than a one-click button.
 */
const COPILOT_STUDIO_URL = "https://copilotstudio.microsoft.com";
const COPILOT_STUDIO_NEW_URL = "https://copilotstudio.com/";
const POWER_PLATFORM_ADMIN_URL = "https://admin.powerplatform.microsoft.com/";
const COPILOT_STUDIO_MCP_DOCS =
  "https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent";
const COPILOT_STUDIO_LICENSING =
  "https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing";
const COPILOT_STUDIO_DLP_DOCS =
  "https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention";
const M365_AGENT_STORE_DOCS =
  "https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-agent-store";

/**
 * Goose is the only desktop assistant besides Claude Code that can finish our
 * sign-in: Block documents GOOSE_OAUTH_CALLBACK_PORT expressly for servers that
 * "only allow a pre-registered redirect URI with a fixed port". The port step is
 * mandatory, so the link never ships as a bare button.
 */
const GOOSE_INSTALL_URL = `goose://extension?url=${encodeURIComponent(
  MCP_ADDRESS,
)}&type=streamable_http&id=xbert&name=XBert&description=${encodeURIComponent(
  "Your practice's clients, books and worklist",
)}`;
const GOOSE_OAUTH_DOCS = "https://goose-docs.ai/docs/getting-started/using-extensions";

/**
 * --callback-port 6274 is load-bearing: the gateway rejects every other loopback
 * port in production, and Claude Code otherwise picks one at random.
 */
const CLAUDE_CODE_COMMAND = `claude mcp add --transport http --callback-port 6274 xbert ${MCP_ADDRESS}`;

const STRONG = "font-semibold text-neutral-900 dark:text-white";
const MONO = "font-mono text-neutral-900 dark:text-neutral-100";
const LINK =
  "text-xbert-indigo dark:text-xbert-cyan hover:underline focus-visible:underline";

const CHECKLIST = [
  {
    n: "01",
    title: "An XBert account",
    body: (
      <>
        With your clients' files connected as usual — Xero, QuickBooks, MYOB or FreeAgent,
        plus Xero Practice Manager if you use it: XPM is what powers the practice-side
        questions about jobs, WIP and capacity. The MCP works with what's already in
        XBert. One thing worth checking: the data and reporting tools only run for clients
        on an AI-enabled plan. A client on any other plan still works for the workflow
        side — tasks, templates and notes — but ask about its books and the assistant will
        come back and say the plan doesn't allow it. Not on XBert yet? Start at{" "}
        <a href="https://xbert.io" target="_blank" rel="noopener noreferrer" className={LINK}>
          xbert.io
        </a>
        .
      </>
    ),
  },
  {
    n: "02",
    title: "Claude, or another AI that speaks MCP",
    body: (
      <>
        Claude is the straightforward path — web, Desktop or Claude Code, and you paste one
        address. ChatGPT takes more setting up: custom MCP connectors sit behind developer
        mode, which is web only, and on a Business, Enterprise or Edu workspace an admin has
        to switch it on and publish the connector before anyone else can use it. Microsoft
        Copilot is a different shape again — you reach XBert by building a small agent in
        Copilot Studio, and someone in IT approves it before the rest of the practice sees
        it. Each one has its own steps below.
      </>
    ),
  },
  {
    n: "03",
    title: "Your normal login",
    body: (
      <>
        That's the security model in one line: the assistant signs in as you and can only
        see what your XBert role allows. If you can't see a client in XBert, your
        assistant can't either. Role isn't the only gate, though — the client's plan
        decides whether the data tools answer at all. On a workspace plan, connector
        settings are usually an admin's to switch on — ChatGPT in particular needs one to
        enable developer mode before you can add anything.
      </>
    ),
  },
];

/**
 * What "Copilot" means, because a practice saying it could mean any of five
 * Microsoft products and only one of them is a route to XBert today.
 */
const COPILOT_PRODUCTS = [
  {
    name: "Copilot Studio",
    what: "Microsoft's agent builder.",
    xbert: "yes",
    note: "The one documented route. You add XBert as a tool on an agent, and it recognises our sign-in on its own.",
  },
  {
    name: "Microsoft 365 Copilot",
    what: "Copilot Chat in Teams, Word, Outlook and on the web.",
    xbert: "indirect",
    note: "You can't paste our address in here — Microsoft documents no self-serve path. You reach it by building the Copilot Studio agent above and having an administrator approve it.",
  },
  {
    name: "Create agent / Agent Builder",
    what: "The lightweight builder inside Microsoft 365 Copilot.",
    xbert: "no",
    note: "Takes knowledge sources only. Microsoft's own advice is to use Copilot Studio when you need to reach an outside service.",
  },
  {
    name: "Microsoft Copilot (consumer)",
    what: "copilot.microsoft.com, and the Copilot mobile app.",
    xbert: "no",
    note: "Offers a fixed list of connectors — OneDrive, Outlook, Gmail and the like. There is no way to add your own.",
  },
  {
    name: "GitHub Copilot",
    what: "The coding assistant in VS Code and Visual Studio.",
    xbert: "no",
    note: "A different product entirely. Listed only so nobody goes looking for XBert in the wrong place.",
  },
];

/**
 * Assistants we deliberately do NOT give a button. Every row is a vendor-
 * documented callback port that isn't the one our gateway accepts, or a vendor
 * that documents no sign-in flow for remote servers at all. A button here would
 * install cleanly and then dead-end at the sign-in screen, which is worse than
 * no button.
 */
const NOT_YET_CLIENTS = [
  {
    name: "Visual Studio Code",
    reason: "Signs in on a fixed port of its own (33418), with no way to change it.",
  },
  {
    name: "Cursor",
    reason: "Signs in on a fixed port of its own (8787), with no way to change it.",
  },
  {
    name: "Windsurf",
    reason: "Its install link only opens servers already listed in Cognition's own registry, so we can't point it at XBert.",
  },
  {
    name: "Zed",
    reason: "No install link and no documented sign-in flow for remote servers.",
  },
  {
    name: "JetBrains IDEs",
    reason: "Documents header-based keys rather than a sign-in flow, so there's no way to reach an XBert token.",
  },
  {
    name: "LM Studio",
    reason: "Same — header-based keys only, no sign-in flow.",
  },
  {
    name: "Cline / Roo Code",
    reason: "No documented sign-in flow for remote servers.",
  },
];

const FIRST_PROMPTS = [
  "What can you do with my XBert account?",
  "List the clients I look after, and who's assigned to each.",
  "Summarise this week's XBert alerts for [client].",
  "Show me aged receivables for [client] — who should I chase first?",
  "What's on my worklist today, and which jobs are running behind?",
];

const ACCESS_BLOCKS = [
  {
    title: "Turn it off in one place.",
    body: "Remove or disable the XBert connector in your assistant's settings and the connection is gone. Reconnect any time by signing in again.",
  },
  {
    title: "Access follows your role.",
    body: "The assistant only ever holds the permissions of the person signed in. Change someone's role in XBert and their assistant's reach changes with it — nothing is granted beyond that.",
  },
  {
    title: "Everything leaves a trail.",
    body: "Every write is validated and checked for duplicates first, and each one is marked as a change to confirm, so your assistant stops and asks before it submits. That approval prompt belongs to the assistant rather than to XBert — what XBert guarantees is your permissions, the validation and an audit-log entry on every action.",
  },
];

const BEST_PRACTICES = [
  {
    lead: "Start with questions, not changes.",
    body: "Spend your first week asking — balances, alerts, worklists. Move to drafting tasks and write-backs once the answers have earned your trust.",
  },
  {
    lead: "Be specific.",
    body: "Client, period, and what good looks like. Specific asks get specific answers.",
  },
  {
    lead: "One client before twenty.",
    body: "Prove a routine on a single file, then let the assistant repeat it across the portfolio.",
  },
  {
    lead: "Review anything client-facing yourself.",
    body: "Always. The assistant drafts; you decide what leaves the practice.",
  },
  {
    lead: "Treat it like a bright new hire.",
    body: "Clear instructions, check the work early on. Trust builds the same way it does with people — quickly, when the work keeps standing up.",
  },
];

export default function GetStartedPage() {
  usePageMeta(ROUTE_META.getStarted);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-32 md:pb-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Chip>Works with Claude · Claude Code · ChatGPT · Microsoft Copilot</Chip>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
              >
                Connected to Claude in about five minutes.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed"
              >
                No code, no API keys, nothing to install on a server. You paste one address
                into Claude, sign in with your XBert account, and start asking — about a
                client's books, or about how the practice itself is tracking. ChatGPT and
                Microsoft Copilot take more setting up, and what your plan and your IT admin
                have to allow is below. On Claude, most people get their first real answer
                before the kettle's boiled.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <p>Under the hood: a remote MCP server with OAuth. That's the whole trick.</p>
                <p>
                  Full illustrated guide with screenshots:{" "}
                  <a
                    href={SETUP_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    the XBert setup guide →
                  </a>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              {/* Deliberate dark accent panel: the SVG has an opaque near-black
                  background; the light theme gets its own light-canvas
                  variant rather than a dark slab on white. */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-xbert-canvas dark:bg-xbert-ink p-4 md:p-6 overflow-hidden">
                <ThemeImage
                  lightSrc="/illustrations/get-started-path-light.svg"
                  darkSrc="/illustrations/get-started-path.svg"
                  width={1216}
                  height={896}
                  loading="eager"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEFORE YOU BEGIN */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="Before you begin, you need three things." />
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {CHECKLIST.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <div className="text-xs font-mono font-semibold text-xbert-indigo dark:text-xbert-cyan">
                {item.n}
              </div>
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONNECT YOUR ASSISTANT */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          id="connect"
          title="Connect your assistant."
          lead="One address, whichever assistant you use. Pick yours below — each set of steps has its own link, so you can send a colleague straight to the right one."
        />
        <div className="mt-8 max-w-3xl">
          <div className="mb-8">
            <AddressChip label="XBert MCP address" />
          </div>

          <nav aria-label="Jump to an assistant" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              {[
                { id: "claude", label: "Claude" },
                { id: "claude-code", label: "Claude Code" },
                { id: "chatgpt", label: "ChatGPT" },
                { id: "copilot", label: "Microsoft Copilot" },
                { id: "other-assistants", label: "Other assistants" },
              ].map((j) => (
                <li key={j.id}>
                  <a
                    href={`#${j.id}`}
                    className="inline-flex items-center rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-sm text-neutral-700 hover:bg-black/[0.06] hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08] dark:hover:text-white transition"
                  >
                    {j.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6">
            {/* ---------------------------------------------------------- CLAUDE */}
            <ConnectSection
              id="claude"
              title="Claude — web, Desktop and mobile"
              badge="One-click"
              lead="The straightforward path. Add it once and XBert is there everywhere you use Claude, with no extra setup on your other devices."
            >
              <div className="flex flex-wrap items-center gap-3">
                <ConnectButton href={CLAUDE_ADD_CONNECTOR_URL}>Add XBert to Claude</ConnectButton>
                <ConnectButton href={CLAUDE_CONNECTORS_URL} variant="secondary">
                  Open Claude connectors
                </ConnectButton>
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                The first button opens Claude&rsquo;s{" "}
                <strong className={STRONG}>Add custom connector</strong> box with the name and address
                already filled in — sign in to Claude first and it lands ready to add. Both buttons end
                up on the same screen, so use the second if you would rather type it in yourself.
              </p>
              <div className="mt-8">
                <StepFlow
                  variant="list"
                  steps={[
                    {
                      title: "",
                      body: (
                        <>
                          Select <strong className={STRONG}>Customize</strong> in Claude&rsquo;s left
                          sidebar, then the <strong className={STRONG}>Connectors</strong> tab. Some of
                          Anthropic&rsquo;s own pages still call this{" "}
                          <strong className={STRONG}>Settings → Connectors</strong>, so don&rsquo;t
                          worry if the wording differs from what you see.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          Select <strong className={STRONG}>+</strong>, then{" "}
                          <strong className={STRONG}>Add custom connector</strong>.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          Name it <strong className={STRONG}>XBert</strong>, paste the address above as
                          the remote MCP server URL, and select <strong className={STRONG}>Add</strong>.
                          Leave the Client ID and Client Secret boxes empty — XBert registers itself, so
                          there is nothing for you to fetch from us.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          Select <strong className={STRONG}>Connect</strong> and sign in with your XBert
                          account in the window that opens.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: <>Back in the chat, XBert now appears in your tools menu. Ask away.</>,
                    },
                  ]}
                />
              </div>

              <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  On a Team or Enterprise plan? An Owner goes first.
                </h4>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  Members can&rsquo;t add a custom connector on those plans. An Owner adds XBert once
                  for the whole firm under{" "}
                  <strong className={STRONG}>Organization settings → Connectors</strong> — labelled{" "}
                  <strong className={STRONG}>Admin settings</strong> in some places — and everyone else
                  then finds XBert under <strong className={STRONG}>Customize → Connectors</strong> and
                  selects <strong className={STRONG}>Connect</strong>. On Free, Pro and Max you add it
                  yourself, with no admin involved — though Free allows only one custom connector at a
                  time.
                </p>
                <div className="mt-4">
                  <ConnectButton href={CLAUDE_ADMIN_ADD_CONNECTOR_URL} variant="secondary">
                    Owners: add XBert for the firm
                  </ConnectButton>
                </div>
              </div>

              <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                Step-by-step with screenshots in{" "}
                <a href={SETUP_GUIDE_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                  the XBert setup guide →
                </a>
                . Claude&rsquo;s own version:{" "}
                <a
                  href={ANTHROPIC_CONNECTOR_GUIDE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  adding a custom connector →
                </a>
              </p>
            </ConnectSection>

            {/* ----------------------------------------------------- CLAUDE CODE */}
            <ConnectSection
              id="claude-code"
              title="Claude Code"
              badge="Command line"
              lead="If you have already added XBert on claude.ai, you may have nothing left to do."
            >
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-sm text-neutral-700 dark:border-emerald-400/20 dark:bg-emerald-400/[0.05] dark:text-neutral-300">
                <Check
                  size={16}
                  aria-hidden
                  className="mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                />
                <p>
                  <strong className={STRONG}>Try this first.</strong> Connectors you have added on
                  claude.ai load automatically in Claude Code when you are signed in with that same
                  Claude account. Run <span className={MONO}>/mcp</span> and look for XBert before you
                  add anything. This only applies to a Claude subscription login — not an API key.
                </p>
              </div>

              <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                If it isn&rsquo;t there, or you would rather register it locally, run:
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04] p-3">
                <code className="font-mono text-[13px] text-neutral-900 dark:text-neutral-100 break-all">
                  {CLAUDE_CODE_COMMAND}
                </code>
                <CopyButton text={CLAUDE_CODE_COMMAND} />
              </div>
              <div className="mt-4">
                <StepFlow
                  variant="list"
                  steps={[
                    {
                      title: "",
                      body: (
                        <>
                          In your next session, run <span className={MONO}>/mcp</span> and complete the
                          XBert sign-in when prompted.
                        </>
                      ),
                    },
                    { title: "", body: <>Ask in plain English.</> },
                  ]}
                />
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                <Info
                  size={16}
                  aria-hidden
                  className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0"
                />
                <p>
                  <span className={MONO}>--callback-port 6274</span> is not optional. XBert registers a
                  fixed port to finish the sign-in, and Claude Code otherwise picks one at random —
                  leave the flag out and the sign-in fails. <span className={MONO}>--scope user</span>{" "}
                  makes XBert available from any folder rather than only the one you ran the command in.
                </p>
              </div>
              <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                If your Claude Code doesn&rsquo;t recognise{" "}
                <span className={MONO}>--callback-port</span>, update it first — the flag is only in
                recent versions. Full syntax in{" "}
                <a href={CLAUDE_CODE_DOCS} target="_blank" rel="noopener noreferrer" className={LINK}>
                  Claude Code&rsquo;s MCP documentation →
                </a>
              </p>
            </ConnectSection>

            {/* --------------------------------------------------------- CHATGPT */}
            <ConnectSection
              id="chatgpt"
              title="ChatGPT"
              badge="Developer mode"
              lead="Custom MCP connectors sit behind developer mode, which is web only. Where you find it depends on whether you are on a workspace or a personal plan."
            >
              <div className="flex flex-wrap items-center gap-3">
                <ConnectButton href={CHATGPT_PLUGINS_URL}>Open ChatGPT plugins</ConnectButton>
                <ConnectButton href={OPENAI_DEVELOPER_MODE_GUIDE} variant="secondary">
                  OpenAI: turn on developer mode
                </ConnectButton>
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                ChatGPT has no one-click install, so the first button only opens the page where you add
                the connection — you still paste the address yourself. Developer mode has to be on first
                or there is nowhere to add anything.
              </p>

              <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  On a Business, Enterprise or Edu workspace
                </h4>
                <div className="mt-3">
                  <StepFlow
                    variant="list"
                    steps={[
                      {
                        title: "",
                        body: (
                          <>
                            An admin or owner opens{" "}
                            <strong className={STRONG}>Workspace settings</strong> and, under{" "}
                            <strong className={STRONG}>Permissions &amp; Roles → Connected Data</strong>,
                            turns on custom MCP connectors.
                          </>
                        ),
                      },
                      {
                        title: "",
                        body: (
                          <>
                            Once you have access, open{" "}
                            <strong className={STRONG}>Settings → Apps → Advanced Settings</strong> and
                            turn on <strong className={STRONG}>Developer mode</strong>.
                          </>
                        ),
                      },
                      {
                        title: "",
                        body: (
                          <>
                            Go to <strong className={STRONG}>Apps → Create</strong>, name it{" "}
                            <strong className={STRONG}>XBert</strong> with a short description, and
                            paste the address above as the MCP server URL — keep the{" "}
                            <span className={MONO}>/mcp</span> on the end.
                          </>
                        ),
                      },
                      {
                        title: "",
                        body: (
                          <>
                            Choose <strong className={STRONG}>OAuth</strong>, select{" "}
                            <strong className={STRONG}>Scan tools</strong>, sign in to XBert, then
                            select <strong className={STRONG}>Create</strong>. It appears as a draft — an
                            admin or owner publishes it from{" "}
                            <strong className={STRONG}>Workspace settings → Apps → Drafts</strong>.
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  On a personal Pro account
                </h4>
                <div className="mt-3">
                  <StepFlow
                    variant="list"
                    steps={[
                      {
                        title: "",
                        body: (
                          <>
                            Open <strong className={STRONG}>Settings → Security and login</strong> and
                            turn on <strong className={STRONG}>Developer mode</strong>.
                          </>
                        ),
                      },
                      {
                        title: "",
                        body: (
                          <>
                            Go to <strong className={STRONG}>Plugins</strong> and select{" "}
                            <strong className={STRONG}>+</strong>.
                          </>
                        ),
                      },
                      {
                        title: "",
                        body: (
                          <>
                            Give it a name and description, paste the address above under{" "}
                            <strong className={STRONG}>Connection</strong>, choose{" "}
                            <strong className={STRONG}>OAuth</strong>, and sign in to XBert.
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
                <strong className={STRONG}>Check what your own plan allows.</strong> OpenAI&rsquo;s
                developer documentation lists Plus as eligible for developer mode, while its help centre
                lists only Business, Enterprise and Edu — so if you are on Plus and developer mode
                doesn&rsquo;t appear, that is why. On Pro, OpenAI documents read-only access, so XBert
                can answer questions but not take action. Write actions are a beta on the workspace
                plans. OpenAI has called this area Connectors, Apps and now Plugins, so if the wording
                differs, look for wherever custom MCP servers are created.{" "}
                <a href={OPENAI_HELP_MCP} target="_blank" rel="noopener noreferrer" className={LINK}>
                  OpenAI on developer mode and MCP →
                </a>
              </p>
            </ConnectSection>

            {/* --------------------------------------------------------- COPILOT */}
            <ConnectSection
              id="copilot"
              title="Microsoft Copilot"
              badge="Via Copilot Studio"
              lead="Copilot Studio recognises XBert's sign-in on its own — there is no client ID or secret to copy from us. But “Copilot” means five different Microsoft products, and only one of them is a route to XBert."
            >
              <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Which Microsoft Copilot products can reach XBert
                  </caption>
                  <thead className="bg-black/[0.03] dark:bg-white/[0.04]">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-semibold">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">
                        Can it reach XBert?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COPILOT_PRODUCTS.map((p) => (
                      <tr
                        key={p.name}
                        className="border-t border-black/10 dark:border-white/10 align-top"
                      >
                        <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                          {p.name}
                          <span className="block font-normal text-xs text-neutral-500 dark:text-neutral-400 whitespace-normal">
                            {p.what}
                          </span>
                        </th>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-400">
                          <span
                            className={`mr-2 font-semibold ${
                              p.xbert === "yes"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : p.xbert === "indirect"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-neutral-500 dark:text-neutral-500"
                            }`}
                          >
                            {p.xbert === "yes" ? "Yes" : p.xbert === "indirect" ? "Indirectly" : "No"}
                          </span>
                          {p.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ConnectButton href={COPILOT_STUDIO_URL}>Open Copilot Studio</ConnectButton>
                <ConnectButton href={COPILOT_STUDIO_MCP_DOCS} variant="secondary">
                  Microsoft: add an MCP server
                </ConnectButton>
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                Microsoft publishes no one-click install link for adding a tool, so this one is
                click-steps rather than a button. If your Copilot Studio signs you in at{" "}
                <a
                  href={COPILOT_STUDIO_NEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  copilotstudio.com
                </a>{" "}
                instead, you are on Microsoft&rsquo;s newer experience and the path is{" "}
                <strong className={STRONG}>Build → Tools → Add → Model Context Protocol (MCP)</strong>.
              </p>

              <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Three things to sort out first.
                </h4>
                <ul className="mt-3 space-y-3 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  <li>
                    <strong className={STRONG}>Generative orchestration must be on.</strong> In the
                    agent, that is <strong className={STRONG}>Settings → Generative AI</strong>. New
                    agents have it on already. Without it, MCP tools don&rsquo;t run at all.
                  </li>
                  <li>
                    <strong className={STRONG}>Your IT administrator may need to act.</strong> MCP
                    servers in Copilot Studio run over Power Platform connectors, so a data policy that
                    blocks those also blocks XBert — quietly. Send your admin to the{" "}
                    <a
                      href={POWER_PLATFORM_ADMIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      Power Platform admin centre
                    </a>{" "}
                    (<strong className={STRONG}>Security → Data and privacy → Data policy</strong>), or
                    to{" "}
                    <a
                      href={COPILOT_STUDIO_DLP_DOCS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      Microsoft&rsquo;s write-up →
                    </a>
                  </li>
                  <li>
                    <strong className={STRONG}>Licences.</strong> Whoever builds the agent needs a
                    Copilot Studio or Microsoft 365 Copilot licence. People who only use the finished
                    agent don&rsquo;t need one. Worth knowing: the free trial can build and test an
                    agent but <strong className={STRONG}>cannot publish it</strong>.{" "}
                    <a
                      href={COPILOT_STUDIO_LICENSING}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      Microsoft&rsquo;s licensing guide →
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <StepFlow
                  variant="list"
                  steps={[
                    {
                      title: "",
                      body: (
                        <>
                          Open your agent in Copilot Studio and go to its{" "}
                          <strong className={STRONG}>Tools</strong> page.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          Select <strong className={STRONG}>Add a tool</strong> →{" "}
                          <strong className={STRONG}>New tool</strong> →{" "}
                          <strong className={STRONG}>Model Context Protocol</strong>.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          <strong className={STRONG}>Server name</strong>: XBert.{" "}
                          <strong className={STRONG}>Server description</strong>: a sentence or two on
                          what XBert does — Copilot reads this to decide when to call XBert, so it is
                          worth writing properly. <strong className={STRONG}>Server URL</strong>: the
                          address above.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          For authentication choose <strong className={STRONG}>OAuth 2.0</strong>, then{" "}
                          <strong className={STRONG}>Dynamic discovery</strong>.{" "}
                          <strong className={STRONG}>
                            You do not need a client ID, a client secret, or any URLs from XBert
                          </strong>{" "}
                          — that is the whole point of this option. Don&rsquo;t choose Manual: we
                          don&rsquo;t issue the credentials it asks for.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          Select <strong className={STRONG}>Create</strong>, then{" "}
                          <strong className={STRONG}>Create a new connection</strong>, sign in with your
                          XBert account, and select <strong className={STRONG}>Add to agent</strong>.
                        </>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3 text-sm text-neutral-700 dark:border-amber-400/25 dark:bg-amber-400/[0.06] dark:text-neutral-300">
                <TriangleAlert
                  size={16}
                  aria-hidden
                  className="mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                />
                <p>
                  <strong className={STRONG}>Turn most of the tools off.</strong> XBert publishes far
                  more tools than Copilot Studio will take — Microsoft caps an agent at 128 and
                  recommends 25 to 30. Switch <strong className={STRONG}>Allow all</strong> off and
                  enable only the ones your firm actually needs, or the agent won&rsquo;t behave. Once
                  Allow all is off, tools we add later arrive switched off too, so check back after an
                  XBert release. If you&rsquo;re not sure which to pick,{" "}
                  <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                    ask us
                  </a>{" "}
                  and we will suggest a starting set.
                </p>
              </div>

              <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Getting it in front of the rest of the practice.
                </h4>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  Publish the agent, then under <strong className={STRONG}>Channels</strong> add{" "}
                  <strong className={STRONG}>Teams and Microsoft 365 Copilot</strong>. Expect one more
                  step you can&rsquo;t skip:{" "}
                  <strong className={STRONG}>
                    the agent isn&rsquo;t visible to your colleagues until an administrator approves it
                  </strong>
                  . Test it in the <strong className={STRONG}>Test agent</strong> panel or in Teams
                  while you wait — sign-in doesn&rsquo;t work on the Demo Website channel, so that one
                  will look broken when it isn&rsquo;t.{" "}
                  <a
                    href={M365_AGENT_STORE_DOCS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    Microsoft on agent approval →
                  </a>
                </p>
              </div>
            </ConnectSection>

            {/* ----------------------------------------------------------- OTHER */}
            <ConnectSection
              id="other-assistants"
              title="Other MCP-aware assistants"
              lead="Anything that speaks MCP can point at the same address. Whether it can finish signing in is the part worth checking first."
            >
              <div className="rounded-xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Goose</h4>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  Goose is the one desktop assistant besides Claude Code that can complete our sign-in,
                  because Block lets you set the port it comes back on.{" "}
                  <strong className={STRONG}>
                    Set <span className={MONO}>GOOSE_OAUTH_CALLBACK_PORT</span> to{" "}
                    <span className={MONO}>6274</span> first
                  </strong>{" "}
                  — the sign-in will not finish without it.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <ConnectButton href={GOOSE_INSTALL_URL} variant="secondary">
                    Add XBert to Goose
                  </ConnectButton>
                  <a
                    href={GOOSE_OAUTH_DOCS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${LINK}`}
                  >
                    Goose&rsquo;s sign-in documentation →
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <StepFlow
                  variant="list"
                  steps={[
                    {
                      title: "",
                      body: (
                        <>
                          For anything else: find where your assistant manages connectors or MCP
                          servers, and add a remote MCP server with the address above.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: (
                        <>
                          If it asks for a transport type, choose{" "}
                          <strong className={STRONG}>HTTP</strong> (sometimes shown as &ldquo;streamable
                          HTTP&rdquo;). If it asks for an OAuth client ID, leave it empty — XBert
                          registers itself.
                        </>
                      ),
                    },
                    {
                      title: "",
                      body: <>Complete the XBert sign-in when your browser opens, then start asking.</>,
                    },
                  ]}
                />
              </div>

              <h4 className="mt-8 text-sm font-semibold text-neutral-900 dark:text-white">
                Assistants we can&rsquo;t connect yet, and why.
              </h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We only publish a button where we have checked the whole journey — install, sign in,
                first answer. These ones install fine and then can&rsquo;t finish signing in, so
                we&rsquo;d rather tell you than let you find out.
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Assistants that cannot complete XBert sign-in today
                  </caption>
                  <tbody>
                    {NOT_YET_CLIENTS.map((c, i) => (
                      <tr
                        key={c.name}
                        className={`align-top ${
                          i > 0 ? "border-t border-black/10 dark:border-white/10" : ""
                        }`}
                      >
                        <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                          {c.name}
                        </th>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-400">{c.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                Using one of these?{" "}
                <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                  Tell us which
                </a>{" "}
                — it helps us decide what to support next.
              </p>
            </ConnectSection>
          </div>
        </div>
      </section>

      {/* FIRST PROMPTS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          title="Your first five prompts."
          lead="Start read-only — a couple about a client's books, a couple about the practice itself. Get a feel for how it answers before you ask it to do anything."
        />
        <div className="mt-8 space-y-2 max-w-3xl">
          {FIRST_PROMPTS.map((text, i) => (
            <AskPrompt key={text} text={text} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 max-w-3xl"
        >
          <Info
            size={16}
            aria-hidden
            className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0"
          />
          <p>
            Name the client and the period — or the person and the week. &ldquo;Bayside Cafe,
            last quarter&rdquo; beats &ldquo;that cafe file&rdquo; every time.
          </p>
        </motion.div>
      </section>

      {/* MANAGING ACCESS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading id="manage-access" title="Managing and removing access." />
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {ACCESS_BLOCKS.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6"
            >
              <h3 className="text-base font-semibold italic">{block.title}</h3>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                {block.body}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Sign-in uses OAuth. Your credentials stay with XBert — the assistant never sees
          your password.
        </p>
      </section>

      {/* TECHNICAL DETAILS + LIMITS */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading
          id="technical-details"
          title="The technical bit, for whoever asks."
          lead="Most people never need this. Your IT team might, and it saves a round trip if it's written down."
        />
        <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-4xl">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6">
            <h3 className="text-base font-semibold">How the connection works</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Address", MCP_ADDRESS],
                ["Transport", "Streamable HTTP"],
                ["Sign-in", "OAuth 2.1 authorisation code, PKCE (S256) required"],
                ["Client registration", "Dynamic — nothing to obtain from XBert"],
                ["Scopes", "openid, profile, email, offline_access"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="sm:w-40 flex-shrink-0 text-neutral-500 dark:text-neutral-400">{k}</dt>
                  <dd className="font-mono text-[13px] text-neutral-900 dark:text-neutral-100 break-words">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              XBert is reached over the public internet, so there is no firewall change to make for
              the assistants that run in the cloud. If your firm manages your devices and filters
              outbound traffic, ask IT to allow <span className={MONO}>mcp-gateway.xbert.io</span> and{" "}
              <span className={MONO}>auth.xbert.io</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6">
            <h3 className="text-base font-semibold">Known limits, stated plainly</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
              <li>
                <strong className={STRONG}>Assistants on your own machine sign in on one fixed port.</strong>{" "}
                XBert accepts <span className={MONO}>6274</span> and nothing else. Claude Code and
                Goose let you set it; several others don&rsquo;t, which is why they&rsquo;re on the
                list above rather than behind a button.
              </li>
              <li>
                <strong className={STRONG}>Copilot Studio takes far fewer tools than XBert publishes.</strong>{" "}
                Microsoft caps an agent at 128. You choose which XBert tools that agent gets.
              </li>
              <li>
                <strong className={STRONG}>A client&rsquo;s plan decides what can be answered.</strong>{" "}
                The data and reporting tools only run for clients on an AI-enabled plan. Tasks,
                templates and notes work either way.
              </li>
              <li>
                <strong className={STRONG}>Your assistant does the asking, not us.</strong> The prompt
                you see before a change is submitted belongs to the assistant. What XBert guarantees is
                your permissions, the validation, and an audit-log entry on every action.
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 max-w-4xl">
          Assistant menus move constantly. The steps above were checked against each vendor&rsquo;s own
          documentation on 10 September 2026 — if a menu name has changed since, look for the nearest
          equivalent, and{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
            tell us
          </a>{" "}
          so we can correct this page.
        </p>
      </section>

      {/* BEST PRACTICES */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <SectionHeading title="How to work with it well." />
        <ul className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-6">
          {BEST_PRACTICES.map((item, i) => (
            <motion.li
              key={item.lead}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="flex items-start gap-3 list-none"
            >
              <Check
                size={16}
                aria-hidden
                className="mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {item.lead}
                </div>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* NEXT STEPS */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 md:pt-20 md:pb-24">
        <CtaBand
          heading="Connected? Here's where it gets fun."
          primary={{ label: "See everything you can ask", to: "/features" }}
        />
      </section>
    </div>
  );
}
