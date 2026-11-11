# Case study: DrawDesk, built by the Foundry

First end-to-end run of the crew, 11 November 2026. One idea, nine gates, one
live product, one day.

| Gate | Artifact | Outcome |
|------|----------|---------|
| 0 Brief | `docs/00-idea.md` | Named user, one job, kill criteria |
| 1 Market | `docs/01-market.md` | 11 competitors (3 read in full), feature matrix, CONDITIONAL GO (3.55) |
| 2 Features | `docs/02-features.md`, `FEATURES.md` | 7 MVP features, 6 killed/deferred, acceptance lines |
| 3 Brand | `docs/03-brand.md` | 30 names → DrawDesk; .co.uk/.uk available, .com taken, handles checked |
| 4 Identity | `brand/`, `docs/04-identity.md` | Original split-square mark, 16 px/mono/dark proofs, AA pairs |
| 5 Spec | `docs/05-prd.md`, `docs/06-architecture.md` | Formulas, sourced rates, 9-case acceptance table, ADRs |
| 6 Build | app + 18 tests | Engine matches the published £60,000 example to the penny |
| 7 Growth | `docs/07-seo-content.md` | Metadata, 3 JSON-LD blocks, sitemap/robots/llms, Lighthouse 93/100/100/100 |
| 8 Release | `docs/08-release.md` | GitHub repo, CI, Pages, tag v1.0.0, rollback |
| 9 QA | `docs/09-qa.md` | RELEASE, zero blockers, 3 non-blocking findings |

Live: https://lycemart.github.io/drawdesk/
Repo: https://github.com/lycemart/drawdesk

## What the gates actually caught
- **G1** stopped the first instinct ("another calculator") and forced a wedge:
  one-off multi-year spreading + pension in the same model.
- **G2** killed accounts, PDF, Scottish bands and two-director support before
  they entered the build.
- **G3** ruled out every `.com` candidate on evidence and chose a `.co.uk`
  brand with a free GitHub/npm handle.
- **G6** found that spreading a *recurring* profit saves nothing; the feature
  was narrowed to a one-off pot (recorded in `docs/plans/build.md`).
- **G9** caught the empty plan table at low profit and the 180 KB JS budget miss.
