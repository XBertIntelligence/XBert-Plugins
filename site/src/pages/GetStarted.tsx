import { motion } from "motion/react";
import { Check, Info } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { ROUTE_META } from "../lib/route-meta";
import { Chip } from "../components/Chip";
import { SectionHeading } from "../components/SectionHeading";
import { AddressChip } from "../components/AddressChip";
import { MCP_ADDRESS } from "../components/AddressChip";
import { TabGroup } from "../components/TabGroup";
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
        address. ChatGPT takes more setting up. Custom MCP connectors sit behind developer
        mode, which is web only and lives under Settings → Security and login; on a
        Business, Enterprise or Edu workspace an admin has to switch it on
        and publish the connector before anyone else can use it. Those workspace plans are
        also the only place OpenAI has released write actions, and they are still in beta.
        On Plus or Pro, treat XBert as read-only: OpenAI's help centre says Pro can connect
        an MCP with read and fetch permissions only, and doesn't list Plus at all.
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

const CONNECT_TABS = [
  {
    id: "claude",
    label: "Claude (web & Desktop)",
    content: (
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <ConnectButton href={CLAUDE_ADD_CONNECTOR_URL}>Add XBert to Claude</ConnectButton>
          <ConnectButton href={CLAUDE_CONNECTORS_URL} variant="secondary">
            Open Claude connectors
          </ConnectButton>
        </div>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          The first button opens Claude's <strong className={STRONG}>Add custom connector</strong>{" "}
          box with the name and address already filled in — sign in to Claude first and it lands
          ready to add. Both buttons end up on the same screen, so use the second if you would
          rather type it in yourself. On a Team or Enterprise plan only an Owner can add a
          connector — there is a button for them below.
        </p>
        <div className="mt-8">
          <StepFlow
            variant="list"
            steps={[
              {
                title: "",
                body: (
                  <>
                    Select <strong className={STRONG}>Customize</strong> in Claude's left sidebar,
                    then the <strong className={STRONG}>Connectors</strong> tab. It moved out of
                    Settings — if you have been hunting through Settings for it, that is why it
                    wasn't there.
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
                    Leave the Client ID and Client Secret boxes empty — there is nothing for you
                    to fetch from XBert.
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
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            On a Team or Enterprise plan? An Owner goes first.
          </h3>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed">
            Members can't add a custom connector on those plans. An Owner adds XBert once for the
            whole firm under <strong className={STRONG}>Organization settings → Connectors</strong>{" "}
            — labelled <strong className={STRONG}>Admin settings</strong> in some places — and
            everyone else then finds XBert under{" "}
            <strong className={STRONG}>Customize → Connectors</strong> and selects{" "}
            <strong className={STRONG}>Connect</strong>. On Free, Pro and Max you add it yourself,
            with no admin involved — though Free allows only one custom connector at a time.
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
          . Claude's own version:{" "}
          <a
            href={ANTHROPIC_CONNECTOR_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            adding a custom connector →
          </a>
        </p>
      </div>
    ),
  },
  {
    id: "claude-code",
    label: "Claude Code",
    content: (
      <div>
        <StepFlow
          variant="list"
          steps={[
            {
              title: "",
              body: (
                <>
                  Run:
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04] p-3">
                    <code className="font-mono text-[13px] text-neutral-900 dark:text-neutral-100 break-all">
                      {CLAUDE_CODE_COMMAND}
                    </code>
                    <CopyButton text={CLAUDE_CODE_COMMAND} />
                  </div>
                </>
              ),
            },
            {
              title: "",
              body: (
                <>
                  In your next session, run <span className={MONO}>/mcp</span> and complete the
                  XBert sign-in when prompted.
                </>
              ),
            },
            {
              title: "",
              body: <>Ask in plain English.</>,
            },
          ]}
        />
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
          <Info
            size={16}
            aria-hidden
            className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0"
          />
          <p>
            <span className={MONO}>--callback-port 6274</span> is not optional. Without it Claude
            Code picks a port at random to finish the sign-in, and XBert accepts only 6274 — leave
            the flag out and the sign-in fails.
          </p>
        </div>
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          By default the connection only works in the folder you ran the command in — add{" "}
          <span className={MONO}>--scope user</span> to reach XBert from anywhere. If your Claude
          Code doesn't recognise <span className={MONO}>--callback-port</span>, update it first:
          the flag is only in recent versions. Full syntax in{" "}
          <a href={CLAUDE_CODE_DOCS} target="_blank" rel="noopener noreferrer" className={LINK}>
            Claude Code's MCP documentation →
          </a>
        </p>
      </div>
    ),
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    content: (
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <ConnectButton href={CHATGPT_PLUGINS_URL}>Open ChatGPT plugins</ConnectButton>
          <ConnectButton href={OPENAI_DEVELOPER_MODE_GUIDE} variant="secondary">
            OpenAI: turn on developer mode
          </ConnectButton>
        </div>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          ChatGPT has no one-click install. The first button opens the page where you add the
          connection; the second is OpenAI's own write-up of developer mode, which has to be on
          first or there is nowhere to add anything.
        </p>
        <div className="mt-8">
          <StepFlow
            variant="list"
            steps={[
              {
                title: "",
                body: (
                  <>
                    Turn on developer mode under <strong className={STRONG}>Settings</strong> →{" "}
                    <strong className={STRONG}>Security and login</strong>. Web only. On a Business,
                    Enterprise or Edu workspace an admin has to enable it for the workspace before
                    the switch appears for you.
                  </>
                ),
              },
              {
                title: "",
                body: (
                  <>
                    Open <strong className={STRONG}>Plugins</strong> and select{" "}
                    <strong className={STRONG}>+</strong>. OpenAI has been renaming this area, so
                    your account may call it Apps or Connectors instead.
                  </>
                ),
              },
              {
                title: "",
                body: (
                  <>
                    Give it a name and description, then paste the address above as the MCP
                    server URL — keep the <span className={MONO}>/mcp</span> on the end — and
                    create it, then sign in.
                  </>
                ),
              },
            ]}
          />
        </div>
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          Check what your own plan allows before you rely on it. OpenAI's pages don't agree with
          each other on which plans get custom connectors, and write actions are narrower again, so
          treat XBert as read-only on ChatGPT until you have watched a write go through.{" "}
          <a href={OPENAI_HELP_MCP} target="_blank" rel="noopener noreferrer" className={LINK}>
            OpenAI on developer mode and MCP →
          </a>
        </p>
      </div>
    ),
  },
  {
    id: "other",
    label: "Other MCP-aware assistants",
    content: (
      <div>
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-xbert-indigo/25 bg-xbert-indigo/[0.06] dark:border-xbert-cyan/20 dark:bg-xbert-cyan/[0.05] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
          <Info
            size={16}
            aria-hidden
            className="mt-0.5 text-xbert-indigo dark:text-xbert-cyan flex-shrink-0"
          />
          <p>
            Worth knowing before you start. An assistant that runs on your own machine finishes the
            sign-in on a port on your computer, and XBert accepts port{" "}
            <span className={MONO}>6274</span>. Claude Code lets you set it — that is what the
            command on the previous tab does. An assistant that uses a different fixed port and
            gives you no way to change it can't finish signing in today. If yours won't connect,{" "}
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              tell us which one you use
            </a>{" "}
            and we will look at it.
          </p>
        </div>
        <StepFlow
          variant="list"
          steps={[
            {
              title: "",
              body: (
                <>
                  Find where your assistant manages connectors or MCP servers — they each name it
                  slightly differently.
                </>
              ),
            },
            {
              title: "",
              body: <>Add a remote MCP server with the address above.</>,
            },
            {
              title: "",
              body: <>Complete the XBert sign-in when your browser opens, then start asking.</>,
            },
          ]}
        />
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          If your assistant asks for a transport type, choose HTTP (sometimes shown as
          &ldquo;streamable HTTP&rdquo;). If it asks for an OAuth client ID, leave it empty — XBert
          registers itself.
        </p>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Microsoft Copilot Studio is an IT job rather than a self-serve one: your administrator
          adds XBert under{" "}
          <strong className={STRONG}>Tools → Add a tool → New tool → Model Context Protocol</strong>
          , and should{" "}
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
            talk to us
          </a>{" "}
          first — that route needs credentials issued for your tenant.
        </p>
      </div>
    ),
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
                <Chip>Works with Claude · Claude Code · ChatGPT with extra setup</Chip>
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
                client's books, or about how the practice itself is tracking. ChatGPT takes
                more setting up — what your plan and your workspace admin have to allow is
                below. On Claude, most people get their first real answer before the
                kettle's boiled.
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
        <SectionHeading title="Connect your assistant." />
        <div className="mt-8 max-w-3xl">
          <div className="mb-6">
            <AddressChip label="XBert MCP address" />
          </div>
          <TabGroup label="Connect your assistant" tabs={CONNECT_TABS} />
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
