# Delegation: hiring the Foundry crew

The orchestrator does not do specialist work itself. It writes a brief, starts
the right agent, checks the artifact against the gate, and either accepts it or
sends one correction. This file holds the briefs.

## Rules for every delegation

1. The brief is self-contained. The subagent does not see this conversation.
2. Give: product slug, absolute repo path, gate number, the exact artifact path,
   the relevant upstream artifacts to read, the exit test, and the stop
   conditions.
3. Tell it what **not** to do (scope fence) — that is what keeps diffs small.
4. Ask for a report in the doctrine format, not an essay.
5. One correction round maximum; if it fails twice, rewrite the brief smaller.

## Brief template

```text
You are the <role> for the product "<name>" (<slug>).

Repo: /root/sites/<slug>            (create it if missing)
Read first: <upstream artifact paths>
Your gate: G<n> — <gate name>
Deliverable: <exact path(s)>, following the header contract in
  /root/.dsh/skills/product-foundry/references/pipeline.md
Exit test: <copy from pipeline.md>

Context you cannot infer:
- <owner constraints, stack, brand decisions, prior evidence>

Scope fence — do NOT:
- <out-of-scope work, files you must not touch, things that need the owner>

Method:
- <the 4-6 steps that matter for this gate>

Then report exactly:
DONE / VERIFIED / NOT DONE / RISKS / NEXT
```

## Scout brief

```text
Role: foundry-scout. Gate G1.
Deliverable: docs/01-market.md — competitor table (≥8, with URLs), demand
evidence, feature frequency table, gap list, GO/NO-GO with a score.
Rules: fetch the pages you cite; never invent traffic numbers; label estimates;
separate "what they have" from "what users complain about". Use REA or Craft
Anything only if a competitor's shipped artifact/UI genuinely matters.
```

## Feature-miner brief

```text
Role: foundry-feature-miner. Gate G2.
Deliverable: docs/02-features.md + FEATURES.md board.
Rules: every MVP feature traces to a gap or an owner requirement; ≤7 MVP
features; each has a flag name, a test, and an acceptance line. Kill list is
mandatory. Score with impact × confidence ÷ effort.
```

## Brand brief

```text
Role: foundry-brand. Gate G3.
Deliverable: docs/03-brand.md.
Rules: 30 candidates → rubric (memorability, spelling, pronunciation, SEO
adjacency, domain, handles, trademark sanity, room to grow) → top 5 → 1.
Check .com/.co.uk and GitHub/npm/X handles by actually querying; mark taken
names as taken. Provide tagline, one-liner, meta title/description, keyword map.
```

## Logo brief

```text
Role: foundry-logo. Gate G4.
Deliverable: brand/logo.svg, logo-mark.svg, logo-mono.svg, favicon.svg,
og-image.svg, tokens.json + docs/04-identity.md.
Rules: original geometry only; construct on a grid; test at 16 px, one colour,
dark background, and with the wordmark removed. Contrast AA for text. No
gradients-as-crutch, no stock icons, no competitor silhouettes.
```

## Architect brief

```text
Role: foundry-architect. Gate G5.
Deliverable: docs/05-prd.md + docs/06-architecture.md.
Rules: users and jobs-to-be-done, scope, explicit non-goals, routes, data model
(or "no persistence"), calculation spec with formulas and sources, SEO page map,
risks, 3 ADRs, and a build order the builder can follow without asking.
```

## Builder brief

```text
Role: foundry-builder. Gate G6.
Deliverable: working app in app/ (or web/), tests, docs/plans/<task>.md.
Rules: follow the PRD; pure functions for logic; typed; no new dependency
without a one-line justification; no secrets; flags off; run tests and paste
output; stay under the perf/a11y budgets; stop at the spec, do not redesign.
```

## Growth brief

```text
Role: foundry-growth. Gate G7.
Deliverable: docs/07-seo-content.md + the actual pages/metadata.
Rules: one intent per page; answer-first copy; a 40-60 word direct answer near
the top; FAQ with real questions; JSON-LD (WebApplication/FAQPage/Organization);
canonical, OG/Twitter, sitemap, robots, llms.txt; internal links; no keyword
stuffing; every number sourced and dated.
```

## Release brief

```text
Role: foundry-release. Gate G8.
Deliverable: live URL + docs/08-release.md runbook.
Rules: repo under the owner's account; branch protection if available; CI from
a clean checkout; tag the verified SHA; deploy; smoke test from outside; write
rollback before deploy; never print secrets; verify DNS/TLS and the actual
served bytes (hash or visible marker).
```

## QA brief

```text
Role: foundry-qa. Gate G9.
Deliverable: docs/09-qa.md with PASS/FAIL per check and evidence.
Rules: independent — do not trust the builder's report. Functional matrix,
mobile viewport, keyboard-only pass, contrast, Lighthouse (mobile), metadata
and JSON-LD validation, broken links, sitemap/robots, 404, security headers,
copy accuracy against sources. Any FAIL blocks release.
```

## Orchestrator loop

```text
brief → delegate → read artifact → run gate exit test yourself
  pass  → mark approved, move to next gate
  fixable → one correction brief, same agent
  fails twice → shrink scope, or stop and report to the owner
```

Do not let an agent grade its own gate. The orchestrator runs the exit test.
