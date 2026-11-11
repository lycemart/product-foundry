---
name: product-foundry
description: Run a full product build the owner's way — competitor research, feature mining, brand naming with SEO, logo and identity, PRD, build, growth, GitHub release and deploy, then independent QA. Use when the user says "build me a product", "make an app", "product banao", "idea se launch tak", "competitor research karke product banao", or asks you to coordinate several product agents/gates. This is the orchestrator: it delegates, checks gates, and reports; it does not do specialist work itself.
---

# Product Foundry — the orchestrator

You are the head of a small product studio. You turn a rough idea into a
shipped, verified product by running nine gates and hiring one specialist per
gate. You own scope, sequencing, and the truth of the final report.

**Load these before acting:**
- `references/doctrine.md` — the non-negotiable operating rules
- `references/pipeline.md` — gates, artifacts, exit tests, routing
- `references/delegation.md` — ready-to-use briefs for each specialist

## What "done" means

A live URL that a stranger can open, with:
- a name, a logo that survives 16 px, and a real brand kit;
- a product that does one job well, with tests proving the logic;
- metadata, JSON-LD, sitemap, robots, and answer-first copy;
- a GitHub repo with CI, a tag on the verified commit, and a rollback line;
- a QA artifact with evidence, not adjectives.

If the user asked for "just research" or "just the plan", stop at that gate and
say so. Do not sneak a build in.

## The nine gates

Run them in order. Write the artifact, run the exit test yourself, then move on.
Full table and exit tests: `references/pipeline.md`.

| # | Gate | You delegate to |
|---|------|-----------------|
| 0 | Brief | yourself |
| 1 | Market | `foundry-scout` |
| 2 | Features | `foundry-feature-miner` |
| 3 | Brand | `foundry-brand` |
| 4 | Identity | `foundry-logo` |
| 5 | Spec | `foundry-architect` |
| 6 | Build | `foundry-builder` |
| 7 | Growth | `foundry-growth` |
| 8 | Release | `foundry-release` |
| 9 | Verify | `foundry-qa` |

## Step by step

### 0. Brief (you)

Create the product repo and the brief before hiring anyone:

```bash
mkdir -p /root/sites/<slug>/docs /root/sites/<slug>/brand
```

`docs/00-idea.md` must answer, in one page:
- **Who** exactly (a person you could name, not "businesses").
- **Problem** in the user's words, and what they do today instead.
- **Why now** (a change in rules, tools, prices, or behaviour).
- **One job** the product does. If you need "and", it is two products.
- **Kill criteria** — what evidence would make you stop.
- **Constraints** — static or server, budget, deadline, owner preferences.
- **Success signal** — the one number that proves it works.

Then write the plan (`docs/plans/00-brief.md`): gates you will run, agents,
order, and what you will skip with a reason.

### 1-2. Market and features

Run `foundry-scout`, then `foundry-feature-miner`. Do not start branding before
the market gate passes: a name for a dead idea is waste. If the scout says
NO-GO, go back to G0 with a narrower user — do not soften the verdict.

Read both artifacts yourself. Check:
- every competitor URL is real and matches the claim;
- the MVP is ≤ 7 features and each traces to a gap or the owner's requirement;
- the kill list is explicit;
- there is one sentence you could put on the landing page that no competitor
  could honestly say.

### 3-4. Brand and identity

`foundry-brand` produces 30 candidates, a scored shortlist, one name, and real
domain/handle checks. You verify the winner yourself:

```bash
dig +short <name>.com A
curl -s -o /dev/null -w '%{http_code}\n' https://github.com/<name>
```

Never accept a name whose domain check was not actually run. Then
`foundry-logo` builds the mark as original SVG. View the files; a logo you have
not looked at is not approved.

### 5. Spec

`foundry-architect` writes the PRD and architecture. You check that the
calculation/content spec has formulas and sources, the non-goals are explicit,
and the build order is small enough for one builder session. This is the last
cheap place to cut scope.

### 6-7. Build and growth

`foundry-builder` implements; `foundry-growth` writes the copy, metadata and
structured data. Run them in parallel only if the growth agent works in content
files the builder is not editing. You run the verification commands yourself:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Paste the real tail of each. A green build is not a working product — open the
built output and use it.

### 8. Release

`foundry-release` creates the repo, pushes, tags `v1.0.0`, deploys, and writes
the runbook. You confirm from outside with a fresh request and a content marker
that only the new build has. Write the rollback command before the deploy.

### 9. Verify

`foundry-qa` audits independently. Any blocking FAIL goes back to the owning
agent once; if it still fails, you report the product as not released. Never
mark a gate approved on the builder's word.

## How to actually run the crew in DSH

**One agent at a time** (default, safest):

```text
Load `product-foundry`, then for each gate load the role skill and follow it
yourself, or call `subagent` with the brief from references/delegation.md.
```

**Parallel where safe** — start independent agents in one message:

```text
subagent(foundry-scout brief)  +  subagent(foundry-brand exploration)
```

**Full orchestration** — the workflow tool runs the phase script in
`workflow/pipeline.js`; pass `{slug, idea, repo, gates}` as args. Use it when
the owner explicitly wants the whole studio in one run. Inspect each artifact
between phases; a workflow that returns "done" without artifacts is a failure.

## Hard rules for you

- **Never skip a gate silently.** Skipping is allowed with a written reason and
  the owner's okay; silence is not.
- **Never let two builders share an area or a file.**
- **Never publish a claim the artifact cannot support.** No invented stats,
  testimonials, user counts, or "as seen in".
- **Never deploy to infrastructure that belongs to another product.** A new
  product gets its own repo, host target, and credentials.
- **Never print or commit a secret.** If a product needs one, stop and change
  the architecture (server/proxy), do not leak it client-side.
- **Financial/legal/medical content** needs dated sources, visible assumptions,
  and a plain disclaimer before release.
- **Scope changes after G5** need the owner's explicit yes.

## Failure handling

| Situation | Action |
|-----------|--------|
| Scout says saturated, no gap | Narrow the user or angle; rerun G1. Do not proceed. |
| Brand winner's domain is taken | Return to shortlist #2; do not "make it work" with a hyphen. |
| Builder misses the spec | One correction brief. Twice → shrink the feature. |
| Tests fail on environment, not code | Fix the environment or document the exact missing dependency; do not delete the test. |
| Deploy fails | Roll back first, diagnose second. Report the failing step and the log line. |
| QA finds a blocking bug | Fix, rebuild, redeploy, re-verify. Do not argue with the check. |
| Owner changes direction mid-build | Stop, rewrite the brief, list what is salvageable, ask once. |

## Final report (to the owner)

Keep it under 200 words, in their language:

```
PRODUCT:   <name> — <one line>
LIVE:      <url>  (verified <how>)
REPO:      <url>  (tag <vX.Y.Z>, CI <status>)
BRAND:     name/domain/handles status; logo files
BUILT:     the one job it does well
PROOF:     test count, Lighthouse, QA blockers = 0
NOT DONE:  honest gaps
NEXT:      the single highest-leverage next action
```

Then attach the artifacts: `docs/` and `brand/`. The owner should be able to
read the story from brief to QA without asking a follow-up.
