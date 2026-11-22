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

export const TEAM_INSTITUTIONS = [
  "Mercor",
  "Etched",
  "Google",
  "Google DeepMind",
  "Nvidia",
  "Stanford SAIL",
  "Berkeley RISE",
  "TerminalBench",
] as const;

export interface RefineryStage {
  id: string;
  step: string;
  shortTitle: string;
  shortTag: string;
  title: string;
  summary: string;
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
    step: "01",
    shortTitle: "Raw Trace",
    shortTag: "Agent fails live",
    title: "Capture real production failures",
    summary: "Real chronology of an AI agent pushed past its limit on real economic work.",
    detail:
      "Every partner-permissioned session records the user's request, repository context, tool calls, and mid-session corrections. Today, the majority of economically valuable traces come from coding agents.",
    inputLabel: "Live coding-agent session hitting a subtle production bug",
    outputLabel: "Timestamped failure trace showing exact model limitation",
    outcomeNote: "Illustrative example · Boundary failure captured in production",
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
    step: "02",
    shortTitle: "Filter & Sanitize",
    shortTag: "Strip PII & noise",
    title: "Permission, redact & isolate signal",
    summary: "Separate genuine model limits from noise, broken tooling, and private data.",
    detail:
      "SF Data never claims ownership of underlying data. We work with source companies to enforce permissions, strip customer secrets and proprietary material, and discard broken-tool or repetitive sessions.",
    inputLabel: "Unfiltered partner traces containing secrets, noise, and dead ends",
    outputLabel: "Consent-verified, redacted, high-signal failure candidate",
    outcomeNote: "6 sensitive values redacted · Genuine capability boundary confirmed",
    statusLabel: "Sanitized · high signal",
    statusTone: "neutral",
    codeTitle: "filter_pipeline.log · illustrative pass",
    lines: [
      { prefix: "ACL", text: "partner_consent: verified · rev_share_tier: active", tone: "verified" },
      { prefix: "PII", text: "redacted 3 env tokens, 1 tenant hostname, 2 customer IDs", tone: "muted" },
      { prefix: "SIG", text: "environment_broken: false · repetitive_pattern: false", tone: "muted" },
      { prefix: "SIG", text: "failure_class: implicit_resource_lifecycle_bug · signal: 0.94", tone: "default" },
      { prefix: "OUT", text: "promoted to deterministic environment reconstruction", tone: "verified" },
    ],
  },
  {
    id: "reconstruct",
    step: "03",
    shortTitle: "Reconstruct Env",
    shortTag: "Freeze sandbox",
    title: "Reconstruct a deterministic sandbox",
    summary: "Rebuild enough of the original world so any frontier model can attempt the same work.",
    detail:
      "We recover both explicit and implicit user objectives and snapshot an isolated, reproducible container, preserving the nuance and mid-session constraints that made the original attempt hard.",
    inputLabel: "Sanitized multi-turn trace with implicit user requirements",
    outputLabel: "Isolated, 100% reproducible container ready for RL rollouts",
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
    step: "04",
    shortTitle: "RL Verifier",
    shortTag: "Grade real outcome",
    title: "Write ungameable behavioral verifiers",
    summary: "Grade the exact outcome the user needed, closing shortcuts models try to exploit.",
    detail:
      "Verifiers inspect real behavioral invariants under adversarial load so frontier labs can run reinforcement learning directly against real-world failure modes without reward hacking.",
    inputLabel: "Reconstructed sandbox vulnerable to superficial test shortcuts",
    outputLabel: "Audited RL environment + reward verifier shipped to frontier labs",
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
    title: "Selecting signal over noise",
    body: "Finding the rare production sessions that expose genuine model limitations rather than broken local tooling, ambiguous prompts, or repetitive boilerplate.",
  },
  {
    title: "Reconstructing real work faithfully",
    body: "Turning messy, multi-turn sessions into reproducible sandboxes without stripping away the implicit objectives and user corrections that made the task hard.",
  },
  {
    title: "Preventing reward hacking",
    body: "Engineering verifiers that grade the exact outcome the user needed, closing off shortcuts and test loopholes that frontier models routinely exploit during RL.",
  },
] as const;

export const AUDIENCE_PATHS = [
  {
    audience: "For AI-agent companies",
    heading: "Monetize production traces without surrendering your edge.",
    body: "We do not claim ownership of your underlying data. SF Data handles partner permissions, redaction, and filtering, and shares proceeds when frontier labs extract more training value than any single company could capture alone. Your distribution, network effects, and customer trust stay yours.",
    ctaLabel: "Reach the founders on X",
    ctaHref: SFDATA_LINKS.xBrandon,
  },
  {
    audience: "For frontier AI labs",
    heading: "Train on where models actually fail across the economy.",
    body: "As models surpass human experts, contractor-generated tasks become a race to the bottom. Production traces move continuously with the frontier because users keep pushing deployed agents past their limits, starting today with coding agents.",
    ctaLabel: "Read the October 1 thesis",
    ctaHref: SFDATA_LINKS.essay,
  },
  {
    audience: "For research engineers",
    heading: "Build the continuous link between deployed AI and training.",
    body: "We are a small, in-person team on Kearny Street in San Francisco's Financial District, working 5 days a week. Our team has previously engineered and operated at Mercor, Etched, Google, Google DeepMind, Nvidia, Stanford SAIL, and Berkeley RISE, co-authored TerminalBench, and built environments and evals for 20+ frontier labs.",
    ctaLabel: "View open roles on Ashby",
    ctaHref: SFDATA_LINKS.careers,
  },
] as const;
