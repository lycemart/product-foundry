---
name: foundry-release
description: Put the product on GitHub and deploy it, with CI, tags, smoke tests, and a rollback runbook. Use at gate G8 when the user asks "deploy karo", "GitHub par daalo", "release", "publish", "live karo", or after build/growth. Verifies the served bytes from outside, tags only the verified commit, and writes the rollback before deploying.
---

# Foundry Release — ship it, prove it, be able to undo it

You are the studio's release engineer. A deploy is not "push and hope"; it is a
sequence with a pre-flight check, an external verification, and a written way
back.

**Preconditions:** G6 green (tests/typecheck/lint/build), G7 metadata shipped,
a GitHub account chosen by the owner, and a host target that belongs to this
product (never another product's infra).

## Pre-flight

```bash
git status --short                  # clean tree or explain each file
git log --oneline -3
gh auth status                      # correct account for THIS product
pnpm test -- --run && pnpm typecheck && pnpm lint && pnpm build
```

Record: commit SHA, test count, build output size, Node/pnpm versions. If the
tree is dirty, commit intentionally; never `git add -A` blindly.

## 1. Repo

```bash
# owner decides the account; check it, do not assume
gh api user --jq .login
gh repo create <owner>/<slug> --public --description "<one line>" --source=. --remote=origin --push
```

Private is fine for a business, but Pages on free plans needs public — say the
trade-off instead of silently choosing.

`main` is the only long-lived branch. Feature branches are short-lived. Squash
merge only. Protect `main` if the plan allows (require the CI check).

Files that must exist before the first push: `README.md`, `AGENTS.md`,
`.gitignore` (node_modules, .next, out, dist, .env*, .DS_Store), `LICENSE` if
public, and the `docs/` artifacts.

## 2. CI

`.github/workflows/ci.yml`:

```yaml
name: ci
on:
  push: {branches: [main]}
  pull_request:
permissions: {contents: read}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: {version: 9}
      - uses: actions/setup-node@v4
        with: {node-version: 22, cache: pnpm}
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --run
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm build
```

The CI must run from a clean checkout, the same install command a stranger
would use. Pin the lockfile. Do not cache a build you did not produce.

## 3. Deploy target

### GitHub Pages (default for a static product)

`.github/workflows/pages.yml`:

```yaml
name: pages
on:
  push: {branches: [main]}
  workflow_dispatch:
permissions: {contents: read, pages: write, id-token: write}
concurrency: {group: pages, cancel-in-progress: false}
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: {version: 9}
      - uses: actions/setup-node@v4
        with: {node-version: 22, cache: pnpm}
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: {path: out}          # or dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Repo → Settings → Pages → Source: GitHub Actions. For a project site
(`owner.github.io/<repo>`) set `basePath`/`assetPrefix` in the framework config
— a root-relative asset URL will 404 and the page will look blank.

### VPS (only when a backend/domain is genuinely needed)

Static: build to `/srv/<slug>/releases/<sha>`, symlink `current`, nginx server
block, certbot, systemd only if a process is needed. Back up nginx and the
current release first; reload, then verify. Never reuse another product's
service, port, or database.

## 4. Tag and release

Tag the exact commit that passed CI and the smoke test:

```bash
git tag -a v1.0.0 -m "v1.0.0 <one line>"
git push origin v1.0.0
gh release create v1.0.0 --title "v1.0.0" --generate-notes
```

Never move a tag that shipped; cut `v1.0.1` instead.

## 5. Verify from outside (not from the build log)

```bash
URL=https://<owner>.github.io/<slug>/
curl -sS -o /tmp/page.html -w 'status=%{http_code} time=%{time_total}s size=%{size_download}\n' "$URL"
grep -o '<title>[^<]*</title>' /tmp/page.html
grep -c 'application/ld+json' /tmp/page.html
curl -sS -o /dev/null -w 'sitemap=%{http_code}\n' "${URL}sitemap.xml"
curl -sS -o /dev/null -w 'robots=%{http_code}\n' "${URL}robots.txt"
```

Then a browser check: load the live URL on a phone viewport, run one real
calculation, follow one internal link, open the 404. Save one screenshot.

A marker that only the new build has (version string in the footer or
`/version.json`) is the cheapest anti-stale-cache proof. Put the SHA there.

## 6. Rollback (write before deploying)

- **Pages:** re-run the last good `pages` workflow run on the previous `main`
  SHA (Actions → the green run → "Re-run all jobs"), or revert the bad commit
  and let CI redeploy. Both are one action; write which one is authorised.
- **VPS/static:** `ln -sfn /srv/<slug>/releases/<previous> /srv/<slug>/current
  && systemctl reload nginx` (or restart the unit), then re-verify.
- **DNS/TLS:** restore the backed-up zone file / nginx site, reload, verify.
- **Database:** never in a v1 static product; if present, restore the backup
  taken immediately before the release and say so.

## 7. Runbook (`docs/08-release.md`)

Include: live URL, repo, account, tag, CI URL, host, where the build comes
from, env vars (names only, never values), how to deploy, how to roll back, how
to check health, who owns DNS/TLS, and the date of the last verification.

## Quality bar

- The live URL opens in a private window, with no login, from a clean cache.
- The served HTML contains the real title and JSON-LD, not a placeholder.
- Assets load (no 404 in the network panel), and the page works with JS errors
  zero.
- The tag points at the verified SHA (`git rev-parse v1.0.0^{commit}`).
- The rollback line was executed once in a dry form or is trivially inspectable.
- No secret in the repo, the workflow, the build output, or the runbook.

## Report

```
DONE: repo + CI + deploy + tag + runbook
VERIFIED: curl status/title/sitemap/robots, browser check, tag SHA
NOT DONE: custom domain / Search Console / analytics (needs owner)
RISKS: Pages limits, CDN cache, no monitoring yet
NEXT: G9 independent QA
```
