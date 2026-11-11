# The Foundry Pipeline

A product moves through 9 gates. Each gate has an owner skill, a required
artifact, and an exit test. No gate is skipped because "it is obvious"; a gate
can be marked `SKIPPED` with a one-line reason the owner can challenge.

| # | Gate | Owner skill | Artifact | Exit test |
|---|------|-------------|----------|-----------|
| 0 | Brief | product-foundry | `docs/00-idea.md` | One sentence: who, problem, why now, kill criteria, constraints |
| 1 | Market | foundry-scout | `docs/01-market.md` | ≥ 8 real competitors with URLs; demand evidence; GO/NO-GO |
| 2 | Features | foundry-feature-miner | `docs/02-features.md`, `FEATURES.md` | Gap → feature traceability; MVP ≤ 7; each has flag + test |
| 3 | Brand | foundry-brand | `docs/03-brand.md` | Name, domain, handles, SEO adjacency, trademark sanity |
| 4 | Identity | foundry-logo | `brand/*`, `docs/04-identity.md` | 16 px, mono, dark, contrast AA, favicon + OG |
| 5 | Spec | foundry-architect | `docs/05-prd.md`, `docs/06-architecture.md` | Scope + non-goals + data model + SEO map + ADRs |
| 6 | Build | foundry-builder | code + tests + `docs/plans/*` | Tests/typecheck/lint green; budgets met |
| 7 | Growth | foundry-growth | `docs/07-seo-content.md` + pages | Metadata, JSON-LD, sitemap, content, answer-first |
| 8 | Release | foundry-release | `docs/08-release.md` | CI green, tag, live URL, smoke pass, rollback |
| 9 | Verify | foundry-qa | `docs/09-qa.md` | Independent pass; blocking issues zero |

## Gate rules

- **G0 → G1 is a real decision.** If the brief has no sharp user and no painful
  problem, stop and rewrite it. A vague brief always produces a vague product.
- **G1 can kill the idea.** "The market is saturated" is a valid outcome. Return
  to G0 with a narrower user or a sharper angle; do not push a loser forward.
- **G2 freezes the MVP.** After it, new features go to `FEATURES.md` as
  `later` — they do not enter this release.
- **G3 and G4 are one brand lock.** A name without a working mark is not done;
  a mark without a name is not done.
- **G5 is the last cheap place to change scope.** After the spec gate, scope
  changes require the owner's explicit yes.
- **G6 and G7 may overlap** (builder adds metadata as it builds) but the growth
  gate still runs its own audit.
- **G8 must be verified from outside the deploy** — a fresh curl/browser, not
  the build log.
- **G9 is adversarial.** The QA agent looks for reasons to say no.

## Artifact contract

Every artifact starts with this header so a later agent can trust it:

```yaml
---
product: <slug>
gate: <0-9>
status: draft | approved | blocked
owner_skill: <skill>
updated: YYYY-MM-DD
sources: [url, ...]
assumptions: [one-liners]
---
```

Rules: no artifact is "approved" without its exit test written underneath;
`blocked` requires the concrete blocker and what unblocks it; sources are real
URLs that were actually fetched, not remembered.

## Routing: who does what

| Task | Skill |
|------|-------|
| "Is this idea worth building?", competitor scan, pricing/positioning | foundry-scout |
| "What should we build first?", feature matrix, MVP cut | foundry-feature-miner |
| "Name it", domain/handle checks, tagline, keyword map | foundry-brand |
| "Make a logo", palette, type, favicon, OG, brand kit | foundry-logo |
| PRD, stack, schema, routes, risks, ADRs | foundry-architect |
| Write the app, tests, components, calculation engine | foundry-builder |
| Landing copy, metadata, schema, sitemap, launch assets | foundry-growth |
| Repo, CI, tag, deploy, rollback, runbook | foundry-release |
| Independent pre-launch audit, evidence, blockers | foundry-qa |
| Orchestration, delegation, gate decisions | product-foundry |

## Parallelism

Safe to run in parallel:
- scout + a first brand exploration (names are cheap and inform each other);
- logo concepts + PRD draft (once brand direction is chosen);
- growth copy + builder implementation (copy lands in a content file);
- QA prep (checklists, test matrix) + release runbook.

Never parallel:
- two builders in the same repo area;
- brand lock + logo lock (logo depends on the name);
- build + release;
- deploy + anything else touching the same host.

## Fast lane (small, reversible change)

A change touching ≤ 3 files, no schema, no auth, no money, no legal copy:
branch from `main`, one PR, CI once, merge, deploy, verify, tag patch. No
staging round-trip. Everything else uses the full pipeline.

## Stop conditions (escalate to the owner, do not improvise)

- The product would give financial, legal or medical advice without a
  disclaimer and cited, dated sources.
- A feature needs a paid API key, a backend, or personal data.
- A competitor's asset, copy or trademark would be reused.
- Deployment would touch a host, domain or repo not created for this product.
- Two gates disagree and resolving it changes scope.
