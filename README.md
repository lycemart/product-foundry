# Product Foundry

An agentic product studio for DeepSeek Harness. Nine gates, nine specialists,
one shipped product: competitor research → feature cut → brand + SEO → logo →
PRD → build → growth → GitHub release → independent QA.

Built around the owner's operating standards: plan before code, one area per
agent, small reversible diffs, evidence over claims, no secrets, testing before
production, tags on verified commits, and a written rollback.

## The crew

| Skill | Job |
|-------|-----|
| `product-foundry` | Orchestrator: scope, sequence, gates, delegation, final report |
| `foundry-scout` | Market and competitor research with fetched evidence |
| `foundry-feature-miner` | Feature matrix, Kano, MVP cut, kill list, board |
| `foundry-brand` | 30 names → scored shortlist → domain/handle/trademark checks → lock |
| `foundry-logo` | Original SVG mark, favicon, OG, palette, type, brand kit |
| `foundry-architect` | PRD, formulas with sources, architecture, ADRs, build order |
| `foundry-builder` | Implementation, tests, a11y, perf, metadata mechanics |
| `foundry-growth` | Copy, metadata, JSON-LD, sitemap, robots, llms.txt, launch |
| `foundry-release` | Repo, CI, tag, deploy, smoke test, rollback runbook |
| `foundry-qa` | Independent audit; the only agent allowed to say "no" |

## Install

```bash
./install.sh            # copies skills into ~/.dsh/skills
ls ~/.dsh/skills | grep -E 'foundry|product-foundry'
```

DSH discovers skills from `~/.dsh/skills/<name>/SKILL.md`. Restart the session
or reload skills if the catalog is cached.

## Use

Single gate:

```text
Load foundry-scout and research this idea: ...
```

Whole studio, one at a time (recommended, inspect between gates):

```text
Load product-foundry. Run gates 0-9 for this idea: ...
```

Whole studio as a DSH workflow:

```js
// workflow tool
args = {slug: "my-product", idea: "one paragraph", repo: "/root/sites/my-product", deploy: false}
// script: the body of workflow/pipeline.js
```

Deploy is refused unless `deploy: true`; that flag is the owner's "go", not the
agent's convenience.

## Artifact layout (every product repo)

```
docs/00-idea.md  01-market.md  02-features.md  03-brand.md
     04-identity.md  05-prd.md  06-architecture.md
     07-seo-content.md  08-release.md  09-qa.md
     plans/  research/
brand/  logo*.svg  favicon.svg  og-image.svg  tokens.json  proofs
FEATURES.md
```

Each artifact starts with the header contract in
`skills/product-foundry/references/pipeline.md`, so a later agent can tell what
is approved, what is assumed, and what is still open.

## Design principles

1. **A gate can kill the idea.** Research that always says yes is not research.
2. **The MVP is a subtraction exercise.** The kill list is a deliverable.
3. **A name needs evidence, not taste.** Domains and handles are checked, not assumed.
4. **The logo is geometry you can explain**, tested at 16 px and one colour.
5. **Specs contain formulas and source URLs**, not adjectives.
6. **Deploy is a procedure with a rollback**, not a push.
7. **QA is adversarial and independent.** The builder never grades itself.
8. **Reports are short and honest.** "Not run" beats a confident lie.

## Proven on

**DrawDesk** (11 Nov 2026) — a UK director salary/dividend/pension planner:
[live](https://drawdesk.76-13-181-161.sslip.io/) ·
[repo](https://github.com/lycemart/drawdesk) ·
[case study](docs/case-study-drawdesk.md).

Built through all nine gates in one run: 11 competitors researched, 30 names
checked, original identity, 18 engine tests, Lighthouse 93/100/100/100,
GitHub Pages deploy, tagged `v1.0.1`, QA zero blockers.

## Repository layout

```
skills/            the ten skills (source of truth)
workflow/pipeline.js   DSH workflow orchestration
install.sh         install into ~/.dsh/skills
```

## Licence

Private, owner's use. No competitor assets, copy, or trademarks are included.
