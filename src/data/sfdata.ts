export const SFDATA_LINKS = {
  homepage: "https://www.sfdata.com/",
  essay: "https://www.sfdata.com/blog/production-traces/",
  careers: "https://jobs.ashbyhq.com/sfdata",
  xCompany: "https://x.com/sfdata",
  xBrandon: "https://x.com/brandonguo",
  linkedinBrandon: "https://www.linkedin.com/in/guobrandon",
  xFaiz: "https://x.com/faizsiddiqii",
  linkedinFaiz: "https://www.linkedin.com/in/faizsiddiqi",
  linkedinCompany: "https://www.linkedin.com/company/sanfranciscodata",
} as const;

export interface LogoAsset {
  name: string;
  src: string;
  heightPx: number;
  widthPx: number;
}

export const BACKER_LOGOS: LogoAsset[] = [
  { name: "a16z speedrun", src: "/logos/a16z-speedrun.png", heightPx: 42, widthPx: 145 },
  { name: "Khosla Ventures", src: "/logos/khosla-ventures.png", heightPx: 38, widthPx: 118 },
];

export const PEDIGREE_COL_1: LogoAsset[] = [
  { name: "Mercor", src: "/logos/mercor.png", heightPx: 44, widthPx: 128 },
  { name: "Google", src: "/logos/google.png", heightPx: 48, widthPx: 112 },
  { name: "NVIDIA", src: "/logos/nvidia.png", heightPx: 34, widthPx: 176 },
  { name: "UC Berkeley RISELab", src: "/logos/berkeley-rise.png", heightPx: 50, widthPx: 110 },
];

export const PEDIGREE_COL_2: LogoAsset[] = [
  { name: "Etched", src: "/logos/etched.png", heightPx: 36, widthPx: 152 },
  { name: "Google DeepMind", src: "/logos/deepmind.png", heightPx: 38, widthPx: 164 },
  { name: "Stanford SAIL", src: "/logos/stanford-sail.png", heightPx: 52, widthPx: 114 },
  { name: "Terminal-Bench", src: "/logos/terminal-bench.png", heightPx: 38, widthPx: 168 },
];

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
  bullets: string[];
  xHref: string;
  linkedinHref: string;
}

export const FOUNDERS: FounderProfile[] = [
  {
    name: "Brandon Guo",
    role: "Co-founder & CEO",
    image: "/founders/brandon-guo.png",
    bullets: [
      "Previously grew Mercor's code team to $100M in annualized revenue run rate.",
      "Leads trace-supply partnerships with AI-agent companies and frontier labs.",
      "Co-author of San Francisco Data's thesis on production traces and RL.",
    ],
    xHref: SFDATA_LINKS.xBrandon,
    linkedinHref: SFDATA_LINKS.linkedinBrandon,
  },
  {
    name: "Faiz Siddiqi",
    role: "Co-founder & CTO",
    image: "/founders/faiz-siddiqi.png",
    bullets: [
      "Previously scaled Mercor's code team alongside Brandon to $100M ARR.",
      "Leads research engineering for sandbox reconstruction and reward verifiers.",
      "Built evaluation and RL infrastructure used across 20+ frontier AI labs.",
    ],
    xHref: SFDATA_LINKS.xFaiz,
    linkedinHref: SFDATA_LINKS.linkedinFaiz,
  },
];

export interface RefineryStage {
  id: string;
  shortTitle: string;
  shortTag: string;
  title: string;
  detail: string;
  inputLabel: string;
  outputLabel: string;
  outcomeNote: string;
  statusLabel: string;
  statusTone: "signal" | "neutral" | "verified";
  codeTitle: string;
  lines: Array<{
    prefix: string;
    text: string;
    tone?: "muted" | "default" | "red" | "verified";
  }>;
}

export const REFINERY_STAGES: RefineryStage[] = [
  {
    id: "capture",
    shortTitle: "Raw Trace",
    shortTag: "Real failure logged",
    title: "Capture live agent failures",
    detail:
      "Partner-permissioned sessions capture the user's request, repository state, tool calls, and mid-session corrections whenever an agent hits a real capability wall.",
    inputLabel: "Deployed coding-agent session hitting a subtle production bug",
    outputLabel: "Complete failure trace showing where and why the model broke",
    outcomeNote: "Illustrative example · Real capability boundary captured",
    statusLabel: "Boundary failure",
    statusTone: "signal",
    codeTitle: "trace_8f2a9c.jsonl · illustrative trace",
    lines: [
      { prefix: "USR", text: "Fix connection pool starvation during burst traffic in worker.ts" },
      { prefix: "CTX", text: "repo: payments-worker @ 9a41e0c · 14 files loaded", tone: "muted" },
      { prefix: "ACT", text: "edit src/pool.ts (+18 -4) · raise maxConnections=200" },
      { prefix: "ERR", text: "FAIL test/pool_burst.spec.ts: deadlock after 64 concurrent tx", tone: "red" },
      { prefix: "USR", text: "Raising the cap hides the leak. Transactions aren't releasing on timeout.", tone: "red" },
    ],
  },
  {
    id: "filter",
    shortTitle: "Filter & Sanitize",
    shortTag: "Drop noise & PII",
    title: "Enforce permissions & isolate signal",
    detail:
      "We never claim ownership of partner data. Our pipeline strips customer secrets and proprietary material, discards broken tooling or routine tasks, and keeps only true model limits.",
    inputLabel: "Unfiltered agent logs mixed with secrets, noise, and dead ends",
    outputLabel: "Consent-verified, redacted session with high training signal",
    outcomeNote: "6 sensitive fields redacted · Capability boundary confirmed",
    statusLabel: "Sanitized · high signal",
    statusTone: "neutral",
    codeTitle: "filter_pipeline.log · illustrative pass",
    lines: [
      { prefix: "ACL", text: "partner_consent: verified · rev_share_tier: active", tone: "verified" },
      { prefix: "PII", text: "redacted 3 env tokens, 1 tenant hostname, 2 customer IDs", tone: "muted" },
      { prefix: "SIG", text: "environment_broken: false · repetitive_pattern: false", tone: "muted" },
      { prefix: "SIG", text: "failure_class: implicit_resource_lifecycle_bug · signal: 0.94", tone: "default" },
      { prefix: "OUT", text: "promoted to deterministic sandbox reconstruction", tone: "verified" },
    ],
  },
  {
    id: "reconstruct",
    shortTitle: "Reconstruct Env",
    shortTag: "Deterministic world",
    title: "Rebuild the exact working environment",
    detail:
      "We recover both explicit prompts and implicit user constraints, then freeze a self-contained container so any frontier model can re-attempt the exact same engineering problem.",
    inputLabel: "Redacted multi-turn trace with implicit user requirements",
    outputLabel: "Isolated, 100% reproducible sandbox ready for RL rollouts",
    outcomeNote: "32/32 baseline rollouts deterministic · Network isolated",
    statusLabel: "Sandbox ready",
    statusTone: "neutral",
    codeTitle: "env_manifest.yaml · illustrative task",
    lines: [
      { prefix: "ENV", text: "image: sfdata/code-sandbox:node22-pg16-deterministic" },
      { prefix: "GIT", text: "base_commit: sanitized_9a41e0c · network: isolated", tone: "muted" },
      { prefix: "OBJ", text: "explicit: eliminate burst starvation under 64 concurrent workers" },
      { prefix: "OBJ", text: "implicit: preserve pool ceiling; release aborted tx cleanly", tone: "default" },
      { prefix: "RUN", text: "rollout_reproducibility: 100% (32/32 baseline checks)", tone: "verified" },
    ],
  },
  {
    id: "verify",
    shortTitle: "RL Verifier",
    shortTag: "Ungameable reward",
    title: "Grade the true outcome, not a loophole",
    detail:
      "Behavioral verifiers check real system invariants under adversarial load so frontier labs can run reinforcement learning directly on real-world failures without reward hacking.",
    inputLabel: "Reproducible sandbox vulnerable to superficial test shortcuts",
    outputLabel: "Audited RL environment and verifier shipped to frontier labs",
    outcomeNote: "Reward-hacking audit passed · 0.00 false-positive rate",
    statusLabel: "RL reward verified",
    statusTone: "verified",
    codeTitle: "verifier_suite.py · illustrative grader",
    lines: [
      { prefix: "CHK", text: "assert pool.max_connections <= BASELINE_CAP  # blocks cap hack" },
      { prefix: "CHK", text: "assert leaked_handles_after_timeout(n=64) == 0" },
      { prefix: "CHK", text: "assert p99_acquire_ms < 45 and deadlocks == 0", tone: "muted" },
      { prefix: "GRD", text: "reward_hacking_audit: passed · false_positive_rate: 0.00", tone: "verified" },
      { prefix: "RL ", text: "environment published to frontier lab training cluster", tone: "verified" },
    ],
  },
];

export const HARD_PROBLEMS = [
  {
    title: "Isolating true model failures",
    body: "Most production logs are noisy: broken local tools, vague prompts, or repetitive boilerplate. Finding the rare sessions where a frontier model genuinely fails requires deep automated filtering.",
  },
  {
    title: "Preserving implicit work context",
    body: "Real tasks rarely live in a single prompt. Reconstructing a faithful sandbox means capturing the hidden constraints, repo state, and mid-session corrections that made the task hard.",
  },
  {
    title: "Closing reward-hacking loopholes",
    body: "Frontier models exploit weak unit tests during RL. Every verifier must check the true behavioral invariant the user actually needed under adversarial execution.",
  },
] as const;

export const AUDIENCE_PATHS = [
  {
    audience: "AI-agent companies",
    heading: "Monetize edge-case failures without losing your moat",
  },
  {
    audience: "Frontier AI labs",
    heading: "Train where models actually break in the real economy",
  },
  {
    audience: "Research engineers",
    heading: "Engineer the feedback loop between deployment and training",
  },
] as const;
