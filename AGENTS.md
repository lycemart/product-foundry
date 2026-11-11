# Working notes for agents editing Product Foundry

This repo is the studio's source of truth. Skills are installed by copying into
`~/.dsh/skills`; edit here, then run `./install.sh`.

## Rules

- One skill per change. Do not "improve" five skills in one diff.
- Frontmatter must stay valid YAML with `name` and `description`; the
  description is the trigger surface — keep the phrases a user would actually
  say, including the Hinglish ones.
- No skill may contradict `skills/product-foundry/references/doctrine.md`. If a
  rule must change, change the doctrine first and update every skill that
  repeats it.
- Gate numbers and artifact paths are a contract with `pipeline.md` and
  `workflow/pipeline.js`. Change all three together or none.
- Keep commands executable on this machine: `pnpm`, `gh`, `curl`, `dig`,
  `python3`, Chromium at `/root/.cache/ms-playwright/...`. Do not document a
  tool that is not installed without a fallback.
- No secrets, no client names, no copied competitor copy in examples.

## Definition of done for a skill change

1. `./install.sh` succeeds and the skill appears in `~/.dsh/skills`.
2. Frontmatter parses; name == directory name.
3. The skill has: when to use, deliverable, method, quality bar, handoff.
4. Every command in it was run at least once, or is marked as a fallback.
5. Cross-references resolve (`references/*.md`, other skills).
6. A dry run on one sentence of user request produces the right routing.
